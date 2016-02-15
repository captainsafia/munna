// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec4 a_Normal;\n' +
  'uniform mat4 u_mvpMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_mvpMatrix * a_Position;\n' +
  '  vec3 lightDirection = normalize(vec3(0.0, 0.5, 0.7));\n' +
  '  vec4 color = vec4(1.0, 0.4, 0.0, 1.0);\n' +
  '  vec3 normal = normalize((u_NormalMatrix * a_Normal).xyz);\n' +
  '  float nDotL = max(dot(normal, lightDirection), 0.0);\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

// Vertex Buffer Object Variables
var floatsPerVertex = 6;
var forestVerts, gndVerts, ballVerts, moonVerts, planetVerts;

// Resize and pane variables
var g_EyeX = 0.20, g_EyeY = 0.25, g_EyeZ = 4.25;
var canvas;

// Joint movemen variables
var ANGLE_STEP = 3.0;
var g_arm1Angle = 90.0;
var g_joint1Angle = 45.0;
var g_joint2Angle = 0.0;
var g_joint3Angle = 0.0;

// Coordinate transformation matrix variables
var g_modelMatrix = new Matrix4();
var g_mvpMatrix = new Matrix4();

// Array for storing matrices
var g_matrixStack = [];

function pushMatrix(m) {
  var m2 = new Matrix4(m);
  g_matrixStack.push(m2);
}

function popMatrix() {
  return g_matrixStack.pop();
}

$(window).on('resize', function() {
  canvas = document.getElementById('webgl');
  var gl = getWebGLContext(canvas);

  // Lookup the size the browser is displaying the canvas.
  var displayWidth  = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size.
  if (canvas.width  != displayWidth ||
      canvas.height != displayHeight) {

    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }

  draw(gl);
});

$(document).ready(function() {
  canvas = document.getElementById('webgl');

  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  gl.enable(gl.DEPTH_TEST);

  var n = initVertexBuffers(gl);

  if (n < 0) {
    console.log('Failed to specify the vertex information');
    return;
  }

  gl.clearColor(0.25, 0.2, 0.25, 1.0);

  u_mvpMatrix = gl.getUniformLocation(gl.program, 'u_mvpMatrix');
  u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (!u_mvpMatrix || !u_NormalMatrix) {
    console.log('Failed to get u_mvpMatrix or u_NormalMatrix!');
    return;
  }

  viewMatrix = new Matrix4();
  modelMatrix = new Matrix4();
  projMatrix = new Matrix4();
  mvpMatrix = new Matrix4();

  $(document).keypress(function(event) {
    switch (event.keyCode) {
      // The "A" key
      case 97:
        g_EyeX += 0.01;
        break;
      // The "S" key
      case 115:
        g_EyeX -= 0.01;
      // The "Q" key
      case 81:
        if (g_joint1Angle < 135.0) g_joint1Angle += ANGLE_STEP;
        break;
      // The "W" key
      case 87:
        if (g_joint1Angle > -135.0) g_joint1Angle -= ANGLE_STEP;
        break;
      // The "E" key
      case 69:
        g_arm1Angle = (g_arm1Angle + ANGLE_STEP) % 360;
        break;
      // The "R" key
      case 82:
         g_arm1Angle = (g_arm1Angle - ANGLE_STEP) % 360;
         break;
      // The "T" key
      case 84:
        g_joint2Angle = (g_joint2Angle + ANGLE_STEP) % 360;
        break;
      // The "Y" key
      case 89:
        g_joint2Angle = (g_joint2Angle - ANGLE_STEP) % 360;
        break;
      // The "U" key
      case 85:
        if (g_joint3Angle < 60.0)  g_joint3Angle = (g_joint3Angle + ANGLE_STEP) % 360;
        break;
      // The "I" key
      case 73:
        if (g_joint3Angle > -60.0) g_joint3Angle = (g_joint3Angle - ANGLE_STEP) % 360;
        break;
      default:
        return;
    }

    draw(gl);
  });

  draw(gl);
});


function initVertexBuffers(gl) {
  forestVerts = makeForestVertices();
  gndVerts = makeGroundGrid();
  moonVerts = makeSphere(10);
  ballVerts = makeSphere(5);
  planetVerts = makeSphere(7);
  armVerts = makeArmVertices();

  mySiz = forestVerts.length + gndVerts.length + moonVerts.length + ballVerts.length + planetVerts.length + armVerts.length;

  var nn = mySiz / floatsPerVertex;
  console.log('nn is', nn, 'mySiz is', mySiz, 'floatsPerVertex is', floatsPerVertex);

  var verticesColors = new Float32Array(mySiz);

  forestStart = 0;
  for(i=0,j=0; j< forestVerts.length; i++,j++) {
    verticesColors[i] = forestVerts[j];
  }

  gndStart = i;
  for(j=0; j< gndVerts.length; i++, j++) {
    verticesColors[i] = gndVerts[j];
  }

  moonStart = i;
  for(j=0; j< moonVerts.length; i++, j++) {
    verticesColors[i] = moonVerts[j];
  }

  ballStart = i;
  for(j=0; j< ballVerts.length; i++, j++) {
    verticesColors[i] = ballVerts[j];
  }

  planetStart = i;
  for(j=0; j< planetVerts.length; i++, j++) {
    verticesColors[i] = planetVerts[j];
  }

  armStart = i;
  for(j=0; j< armVerts.length; i++, j++) {
    verticesColors[i] = armVerts[j];
  }

  // Create a vertex buffer object (VBO)
  var vertexColorbuffer = gl.createBuffer();
  if (!vertexColorbuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Write vertex information to buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;
  // Assign the buffer object to a_Position and enable the assignment
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);
  // Assign the buffer object to a_Color and enable the assignment
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  return mySiz/floatsPerVertex; // return # of vertices
}

function draw(gl) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // The Left Viewport
  gl.viewport(0,
              0,
              canvas.width/2,
              canvas.height);
  viewMatrix.setLookAt(g_EyeX, g_EyeY, g_EyeZ,
                        0, 0, 0,
                        0, 1, 0);
  projMatrix.setPerspective(40, (canvas.width) / (canvas.height), 1, 100);

  mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
  gl.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);

  drawLeftScene(gl, viewMatrix, projMatrix, modelMatrix, mvpMatrix, u_mvpMatrix);


  // The Right Viewport
  gl.viewport(canvas.width / 2,
              0,
              canvas.width / 2,
              canvas.height);
  viewMatrix.setLookAt(-g_EyeX, g_EyeY, g_EyeZ,
                      0, 0, 0,
                      0, 1, 0);
  projMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, 0.0, 2000.0);

  mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
  gl.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);

  drawRightScene(gl, viewMatrix, projMatrix, modelMatrix, mvpMatrix, u_mvpMatrix);
}

function drawLeftScene(myGL, myViewMatrix, myProjMatrix, myModelMatrix, myMvpMatrix, myU_MvpMatrix) {
  // // Draw the forest tree
  myModelMatrix.rotate(-90.0, 1,0,0);
  myModelMatrix.translate(0.2, 0.9, -1.);

  myMvpMatrix.set(myProjMatrix).multiply(myViewMatrix).multiply(myModelMatrix);
  myGL.uniformMatrix4fv(myU_MvpMatrix, false, myMvpMatrix.elements);

  myGL.drawArrays(myGL.TRIANGLES,
                forestStart/floatsPerVertex,
                forestVerts.length/floatsPerVertex);

  // Draw the moon
  myModelMatrix.rotate(-90.0, 1, 0, 0);
  myModelMatrix.translate(0.6, 0.8, -0.4);

  // myMvpMatrix.set(myProjMatrix).multiply(myViewMatrix).multiply(myModelMatrix);
  myGL.uniformMatrix4fv(myU_MvpMatrix, false, myMvpMatrix.elements);

  myGL.drawArrays(myGL.TRIANGLE_STRIP,
              moonStart/floatsPerVertex,
              moonVerts.length/floatsPerVertex);

  // Draw the ball
  myModelMatrix.rotate(-90.0, 1, 0, 0);
  myModelMatrix.translate(0.4, 0.6, -0.4);

  // myMvpMatrix.set(myProjMatrix).multiply(myViewMatrix).multiply(myModelMatrix);
  myGL.uniformMatrix4fv(myU_MvpMatrix, false, myMvpMatrix.elements);

  myGL.drawArrays(myGL.TRIANGLE_STRIP,
              ballStart/floatsPerVertex,
              ballVerts.length/floatsPerVertex);

  // Draw the planet
  myModelMatrix.rotate(-90.0, 1, 0, 0);
  myModelMatrix.translate(0.2, 0.8, -0.4);

  // myMvpMatrix.set(myProjMatrix).multiply(myViewMatrix).multiply(myModelMatrix);
  myGL.uniformMatrix4fv(myU_MvpMatrix, false, myMvpMatrix.elements);

  myGL.drawArrays(myGL.TRIANGLE_STRIP,
            planetStart/floatsPerVertex,
            planetVerts.length/floatsPerVertex);

  // Draw the ground plane grid
  myModelMatrix.rotate(-90.0, 1, 0, 0);
  myModelMatrix.translate(0.0, 0.0, 0.0);
  myModelMatrix.scale(0.4, 0.4,0.4);

  // myMvpMatrix.set(myProjMatrix).multiply(myViewMatrix).multiply(myModelMatrix);
  myGL.uniformMatrix4fv(myU_MvpMatrix, false, myMvpMatrix.elements);

  myGL.drawArrays(myGL.LINES,
                gndStart/floatsPerVertex,
                gndVerts.length/floatsPerVertex);
}

function drawRightScene(myGL, myViewMatrix, myProjMatrix, myModelMatrix, myMvpMatrix, myU_MvpMatrix) {
  g_modelMatrix.setTranslate(0.0, -12.0, 0.0);

  var segment1Length = 10;
  g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0);
  drawArmPart(myGL, 3.0, segment1Length, 3.0);

  var segment2Length = 10;
  g_modelMatrix.translate(0.0, segment1Length, 0.0);
  g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0);
  drawArmPart(myGL, 4.0, segment1Length, 4.0);

  var segment3Length = 10;
  g_modelMatrix.translate(0.0, segment2Length, 0.0);
  g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0);
  drawArmPart(myGL, 4.0, segment3Length, 6.0);

  var segment4Length = 10;
  g_modelMatrix.translate(0.0, segment3Length, 0.0);
  g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0);
  drawArmPart(myGL, 4.0, segment4Length, 8.0);

  g_modelMatrix.rotate(-90.0, 1, 0, 0);
  g_modelMatrix.translate(0.0, 0.0, -1.0);
  g_modelMatrix.scale(0.4, 0.4,0.4);

  myMvpMatrix.set(myProjMatrix).multiply(myViewMatrix).multiply(g_modelMatrix);
  myGL.uniformMatrix4fv(myU_MvpMatrix, false, myMvpMatrix.elements);

  // Draw the ground plane grid
  myGL.drawArrays(myGL.LINES,
                gndStart/floatsPerVertex,
                gndVerts.length/floatsPerVertex);

  g_modelMatrix = popMatrix();
}

var g_normalMatrix = new Matrix4();

function drawArmPart(gl, width, height, depth) {
  pushMatrix(g_modelMatrix);
  g_modelMatrix.scale(width, height, depth);

  mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(g_modelMatrix);
  gl.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);

  g_normalMatrix.setInverseOf(g_modelMatrix);
  g_normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);

  gl.drawElements(gl.TRIANGLES, armVerts.length / floatsPerVertex, gl.UNSIGNED_SHORT,armStart / floatsPerVertex);
  g_modelMatrix = popMatrix();
}