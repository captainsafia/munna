// Vertex shader
var VSHADER_SOURCE =
'uniform mat4 u_ModelMatrix;\n' +
'attribute vec4 a_Position;\n' +
'attribute vec4 a_Color;\n' +
'varying vec4 v_Color;\n' +
'void main() {\n' +
'  gl_Position = u_ModelMatrix * a_Position;\n' +
'  gl_PointSize = 10.0;\n' +
'  v_Color = a_Color;\n' +
'}\n';

// Fragment shader
var FSHADER_SOURCE =
'precision mediump float;\n' +
'varying vec4 v_Color;\n' +
'void main() {\n' +
'  gl_FragColor = v_Color;\n' +
'}\n';

// Global variables
var floatsPerVertex = 7;
var ANGLE_STEP = 45.0;
var CUBE_ANGLE_STEP = 45.0;

function makeSphere(sliceVertices) {
    var slices = 20;
    var sliceAngle = Math.PI / slices;

    var color = new Float32Array([0.8, 0.3, 0.01, 1]);

    var sphereVertices = new Float32Array(((slices * 2 * sliceVertices) - 2) * floatsPerVertex);

    var cos0 = 0.0;
    var sin0 = 0.0;
    var cos1 = 0.0;
    var sin1 = 0.0;

    var j = 0;
    var isLast = 0;
    var isFirst = 1;

    for(s = 0; s < slices; s++) {
        if(s == 0) {
            isFirst = 1;
            cos0 = 1.0;
            sin0 = 0.0;
        }
        else {
            isFirst = 0;
            cos0 = cos1;
            sin0 = sin1;
        }
        cos1 = Math.cos((s + 1) * sliceAngle);
        sin1 = Math.sin((s + 1) * sliceAngle);

        if(s == slices-1) isLast = 1;

        for(v = isFirst; v < 2 * sliceVertices - isLast; v++, j += floatsPerVertex) {
            if(v % 2 == 0) {
                sphereVertices[j] = sin0 * Math.cos(Math.PI * (v) /sliceVertices);
                sphereVertices[j + 1] = sin0 * Math.sin(Math.PI * (v) / sliceVertices);
                sphereVertices[j + 2] = cos0;
                sphereVertices[j + 3] = 1.0;
                sphereVertices[j + 4] = Math.random();
                sphereVertices[j + 5] = Math.random();
                sphereVertices[j + 6] = Math.random();
            }
            else {
                sphereVertices[j] = sin1 * Math.cos(Math.PI * (v - 1) / sliceVertices);
                sphereVertices[j + 1] = sin1 * Math.sin(Math.PI * (v - 1) / sliceVertices);
                sphereVertices[j + 2] = cos1;
                sphereVertices[j + 3] = 1.0;
                sphereVertices[j + 4] = Math.random();
                sphereVertices[j + 5] = Math.random();
                sphereVertices[j + 6] = Math.random();
            }
        }
    }
    return sphereVertices;
}

function initVertexBuffer(rendering) {
    planet = makeSphere(5);
    moon1 = makeSphere(7);
    moon2 = makeSphere(9);
    moon3 = makeSphere(11);

    var totalSize = planet.length + moon1.length + moon2.length + moon3.length;
    var totalVertices = totalSize / floatsPerVertex;
    var colorShapes = new Float32Array(totalSize);

    planetStart = 0;
    for(i = 0, j = 0; j < planet.length; i++, j++) {
        colorShapes[i] = planet[j];
    }

    moon1Start = i;
    for(j = 0; j < moon1.length; i++, j++) {
        colorShapes[i] = moon1[j];
    }

    moon2Start = i;
    for(j = 0; j < moon2.length; i++, j++) {
        colorShapes[i] = moon2[j];
    }

    moon3Start = i;
    for(j = 0; j < moon3.length; i++, j++) {
        colorShapes[i] = moon3[j];
    }

    var shapeBufferHandle = rendering.createBuffer();
    if (!shapeBufferHandle) {
        console.log('Failed to create the shape buffer object!');
        return false;
    }

    rendering.bindBuffer(rendering.ARRAY_BUFFER, shapeBufferHandle);
    rendering.bufferData(rendering.ARRAY_BUFFER, colorShapes, rendering.STATIC_DRAW);

    //Get graphics system's handle for our Vertex Shader's position-input variable:
    var a_Position = rendering.getAttribLocation(rendering.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position!');
        return -1;
    }

    var FSIZE = colorShapes.BYTES_PER_ELEMENT; // how many bytes per stored value?

    // Use handle to specify how to retrieve **POSITION** data from our VBO:
    rendering.vertexAttribPointer(
        a_Position,
        4,
        rendering.FLOAT,
        false,
        FSIZE * floatsPerVertex,
        0);
    rendering.enableVertexAttribArray(a_Position);

    // Get graphics system's handle for our Vertex Shader's color-input variable;
    var a_Color = rendering.getAttribLocation(rendering.program, 'a_Color');
    if(a_Color < 0) {
        console.log('Failed to get the storage location of a_Color!');
        return -1;
    }
    // Use handle to specify how to retrieve **COLOR** data from our VBO:
    rendering.vertexAttribPointer(
        a_Color,
        3,
        rendering.FLOAT,
        false,
        FSIZE * 7,
        FSIZE * 4);

    rendering.enableVertexAttribArray(a_Color);
    rendering.bindBuffer(rendering.ARRAY_BUFFER, null);

    return totalVertices;
}

function draw(gl, n, bodyAngle, modelMatrix, u_ModelMatrix) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Draw the planet
  modelMatrix.setTranslate(-0.6, -0.2, 0.0);
  modelMatrix.scale(0.1, 0.1, 0.1);
  modelMatrix.rotate(bodyAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, planetStart / floatsPerVertex, planet.length / floatsPerVertex);

  // Draw the first moon
  modelMatrix.setTranslate(-0.4, -0.6, 0.0);
  modelMatrix.scale(0.2, 0.2, 0.2);
  modelMatrix.rotate(bodyAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, moon1Start / floatsPerVertex, moon1.length / floatsPerVertex);

  // Draw the second moon
  modelMatrix.setTranslate(-0.2, 0.2, 0.0);
  modelMatrix.scale(0.2, 0.2, 0.2);
  modelMatrix.rotate(bodyAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, moon2Start / floatsPerVertex, moon2.length / floatsPerVertex);

  // Draw the third moon
  modelMatrix.setTranslate(0.0, 0.7, 0.0);
  modelMatrix.scale(0.1, 0.1, 0.1);
  modelMatrix.rotate(bodyAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, moon3Start / floatsPerVertex, moon3.length / floatsPerVertex);
}

var g_last = Date.now();

function animate(angle, opposite) {
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;

  if (opposite) {
    var newAngle = angle - (ANGLE_STEP * elapsed) / 1000.0;
  } else {
    var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  }
  return newAngle %= 360;
}

var s_last = Date.now();

function animateCube(angle) {
  var now = Date.now();
  var elapsed = now - s_last;
  s_last = now;

  var newAngle = angle + (CUBE_ANGLE_STEP * elapsed) / 1000.0;
  return newAngle %= 360;
}

$(document).ready(function() {
    // Set up a full-sized canvas
    var canvas = $('#webgl').get(0);

    // Configure WebGL on the canvas
    var rendering = getWebGLContext(canvas);
    if (!rendering) {
        throw new Error('Failed to get rendering context');
    }

    // Initialize buffers and shaders
    if (!initShaders(rendering, VSHADER_SOURCE, FSHADER_SOURCE)) {
        throw new Error('Failed to get rendering context');
    }

    // Draw the shapes on screen
    var vertices = initVertexBuffer(rendering);
    if (vertices < 0) {
        throw new Error('Failed to set the vertex information');
    }

    // Set canvas background
    rendering.clearColor(0.0, 0.0, 0.0, 1.0);
    rendering.enable(rendering.DEPTH_TEST);
    rendering.clear(rendering.COLOR_BUFFER_BIT);

    // Set up variables for matrix movements
    var u_ModelMatrix = rendering.getUniformLocation(rendering.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        throw new Error('Failed to get the storage location of u_ModelMatrix');
    }
    var modelMatrix = new Matrix4();
    var bodyAngle = 0.0;
    var planetsStopped = false;
    var isDragging = false;
    var wasDragging = false;
    var direction = false;

    // Update canvas at a certain time interval
    var tick = function() {
        // Check if the user has clicked on the canvas to halt the planets
        // or to restore the scene
        $(canvas).mousedown(function() {
            isDragging = false;
        }).mousemove(function() {
            planetsStopped = false;
            isDragging = true;
         }).mouseup(function() {
            wasDragging = isDragging;
            isDragging = false;
            if (wasDragging) {
              direction = !direction;
            }
        });

        $(canvas).click(function() {
          if (planetsStopped) {
            planetsStopped = false;
          } else {
            planetsStopped = true;
          }
        });
        if (!planetsStopped) {
          bodyAngle = animate(bodyAngle, direction);
        }

        draw(rendering, vertices, bodyAngle, modelMatrix, u_ModelMatrix);
        requestAnimationFrame(tick, canvas);
    };

    tick();
});