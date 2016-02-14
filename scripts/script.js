// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_mvpMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_mvpMatrix * a_Position;\n' +
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

var floatsPerVertex = 6;
var forestVerts, gndVerts, ballVerts, moonVerts, planetVerts;
var g_EyeX = 0.20, g_EyeY = 0.25, g_EyeZ = 4.25;

$(document).ready(function() {
  var canvas = document.getElementById('webgl');

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

  var u_mvpMatrix = gl.getUniformLocation(gl.program, 'u_mvpMatrix');
  if (!u_mvpMatrix) {
    console.log('Failed to get u_mvpMatrix!');
    return;
  }

  var viewMatrix = new Matrix4();
  var modelMatrix = new Matrix4();
  var projMatrix = new Matrix4();
  var mvpMatrix = new Matrix4();

  $(document).keypress(function(event) {
    if(ev.keyCode == 39) {
        g_EyeX += 0.1;
    } else
    if (ev.keyCode == 37) {
        g_EyeX -= 0.1;
    } else {
      return;
    }

    draw(gl, viewMatrix, projMatrix, modelMatrix, mvpMatrix, u_mvpMatrix);
  });

  draw(gl, viewMatrix, projMatrix, modelMatrix, mvpMatrix, u_mvpMatrix);
});


function initVertexBuffers(gl) {
  forestVerts = makeForestVertices();
  gndVerts = makeGroundGrid();
  moonVerts = makeSphere(10);
  ballVerts = makeSphere(5);
  planetVerts = makeSphere(7);

  mySiz = forestVerts.length + gndVerts.length + moonVerts.length + ballVerts.length + planetVerts.length;

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

function draw(gl, viewMatrix, projMatrix, modelMatrix, mvpMatrix, u_mvpMatrix) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // The Left Viewport
  gl.viewport(0,
              0,
              gl.drawingBufferWidth/2,
              gl.drawingBufferHeight/2);

  viewMatrix.setLookAt(g_EyeX, g_EyeY, g_EyeZ,
                        0, 0, 0,
                        0, 1, 0);

  projMatrix.setPerspective(40, (gl.drawingBufferWidth / 2) / (gl.drawingBufferHeight / 2), 1, 100);
  mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
  gl.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);

  drawLeftScene(gl, viewMatrix, projMatrix, modelMatrix, mvpMatrix, u_mvpMatrix);


  // The Right Viewport
  gl.viewport(gl.drawingBufferWidth/2,
              0,
              gl.drawingBufferWidth/2,
              gl.drawingBufferHeight/2);
  viewMatrix.setLookAt(-g_EyeX, g_EyeY, g_EyeZ,
                      0, 0, 0,
                      0, 1, 0);
  mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
  gl.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);
}

function drawLeftScene(myGL, myViewMatrix, myProjMatrix, myModelMatrix, myMvpMatrix, myU_MvpMatrix) {
  // Draw the forest tree
  myModelMatrix.rotate(-90.0, 1,0,0);
  myModelMatrix.translate(0.0, 0.0, -0.6);
  myModelMatrix.scale(0.4, 0.4,0.4);

  myMvpMatrix.set(myProjMatrix).multiply(myViewMatrix).multiply(myModelMatrix);
  myGL.uniformMatrix4fv(myU_MvpMatrix, false, myMvpMatrix.elements);

  myGL.drawArrays(myGL.TRIANGLES,
                forestStart/floatsPerVertex,
                forestVerts.length/floatsPerVertex);

  // Draw the moon
  myModelMatrix.rotate(-90.0, 1,0,0);
  myModelMatrix.translate(0.0, 0.0, -0.6);
  myModelMatrix.scale(0.4, 0.4,0.4);

  myMvpMatrix.set(myProjMatrix).multiply(myViewMatrix).multiply(myModelMatrix);
  myGL.uniformMatrix4fv(myU_MvpMatrix, false, myMvpMatrix.elements);

  myGL.drawArrays(myGL.TRIANGLE_STRIP,
              moonStart/floatsPerVertex,
              moonVerts.length/floatsPerVertex);

  // Draw the ball
  myModelMatrix.rotate(-90.0, 1,0,0);
  myModelMatrix.translate(0.0, 0.0, -0.6);
  myModelMatrix.scale(0.4, 0.4,0.4);

  myMvpMatrix.set(myProjMatrix).multiply(myViewMatrix).multiply(myModelMatrix);
  myGL.uniformMatrix4fv(myU_MvpMatrix, false, myMvpMatrix.elements);

  myGL.drawArrays(myGL.TRIANGLE_STRIP,
              ballStart/floatsPerVertex,
              ballVerts.length/floatsPerVertex);

  // Draw the planet
  myModelMatrix.rotate(-90.0, 1,0,0);
  myModelMatrix.translate(0.0, 0.0, -0.6);
  myModelMatrix.scale(0.4, 0.4,0.4);

  myMvpMatrix.set(myProjMatrix).multiply(myViewMatrix).multiply(myModelMatrix);
  myGL.uniformMatrix4fv(myU_MvpMatrix, false, myMvpMatrix.elements);

  myGL.drawArrays(myGL.TRIANGLE_STRIP,
            planetStart/floatsPerVertex,
            planetVerts.length/floatsPerVertex);

  // Draw the ground plane grid
  myModelMatrix.rotate(-90.0, 1,0,0);
  myModelMatrix.translate(0.0, 0.0, -0.6);
  myModelMatrix.scale(0.4, 0.4,0.4);

  myMvpMatrix.set(myProjMatrix).multiply(myViewMatrix).multiply(myModelMatrix);
  myGL.uniformMatrix4fv(myU_MvpMatrix, false, myMvpMatrix.elements);

  myGL.drawArrays(myGL.LINES,
                gndStart/floatsPerVertex,
                gndVerts.length/floatsPerVertex);
}

function drawRightScene(myGL, myViewMatrix, myProjMatrix, myModelMatrix, myMvpMatrix, myU_MvpMatrix) {
  myGL.drawArrays(myGL.LINES,
                gndStart/floatsPerVertex,
                gndVerts.length/floatsPerVertex);
}