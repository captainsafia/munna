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

function makeCylinder(radius, faceRight) {
    // Create a white circle with 16 vertices at the top and a radius of 1.0
    var topVertices = 40;

    // Instaniate a list for the vertices of the cylinder which will consist of the
    // top and bottom caps and the body of the cylinder
    var cylinderVertices = new Float32Array(((topVertices * 6) - 2) * floatsPerVertex);

    // Create the top cap of the cylinder
    for (v = 1, j = 0; v < 2 * topVertices; v++, j += floatsPerVertex) {
        if (v % 2 == 0) {
            cylinderVertices[j] = 0.0;
            cylinderVertices[j + 1] = 0.0;
            cylinderVertices[j + 2] = 1.0;
            cylinderVertices[j + 3] = 1.0;
            cylinderVertices[j + 4] = Math.random();
            cylinderVertices[j + 5] = Math.random();
            cylinderVertices[j + 6] = Math.random();
        } else {
            cylinderVertices[j] = Math.cos(Math.PI * (v - 1) / topVertices);
            cylinderVertices[j + 1] = Math.sin(Math.PI * (v - 1) / topVertices);
            cylinderVertices[j + 2] = 1.0;
            cylinderVertices[j + 3] = 1.0;
            cylinderVertices[j + 4] = Math.random();
            cylinderVertices[j + 5] = Math.random();
            cylinderVertices[j + 6] = Math.random();
        }
    }

    // Create the tube of the cylinder
    for(v = 0; v < 2 * topVertices; v++, j += floatsPerVertex) {
        if (v % 2 == 0) {
            if (faceRight) {
              cylinderVertices[j] = radius * Math.cos(Math.PI * (v) / topVertices);
              cylinderVertices[j + 1] = radius * Math.sin(Math.PI * (v) / topVertices);
            } else {
              cylinderVertices[j] = Math.cos(Math.PI * (v) / topVertices);
              cylinderVertices[j + 1] = Math.sin(Math.PI * (v) / topVertices);
            }

            cylinderVertices[j + 2] = 1.0;
            cylinderVertices[j + 3] = 1.0;
            cylinderVertices[j + 4] = Math.random();
            cylinderVertices[j + 5] = Math.random();
            cylinderVertices[j + 6] = Math.random();
        }
        else {
            if (faceRight) {
              cylinderVertices[j] = Math.cos(Math.PI * (v - 1) / topVertices);
              cylinderVertices[j + 1] = Math.sin(Math.PI * (v - 1) / topVertices);
            } else {
              cylinderVertices[j] = radius * Math.cos(Math.PI * (v - 1) / topVertices);
              cylinderVertices[j + 1] = radius * Math.sin(Math.PI * (v - 1) / topVertices);
            }

            cylinderVertices[j + 2] = -1.0;
            cylinderVertices[j + 3] = 1.0;
            cylinderVertices[j + 4] = Math.random();
            cylinderVertices[j + 5] = Math.random();
            cylinderVertices[j + 6] = Math.random();
        }
    }

    // Create the bottom cap of the cylinder
    for(v = 0; v < (2 * topVertices - 1); v++, j += floatsPerVertex) {
        if(v % 2 == 0) {
            if (faceRight) {
              cylinderVertices[j] = 0.0;
              cylinderVertices[j + 1] = 0.0;
            } else {
              cylinderVertices[j] = radius * Math.cos(Math.PI * (v) / topVertices);
              cylinderVertices[j + 1] = radius * Math.sin(Math.PI * (v) / topVertices);
            }

            cylinderVertices[j + 2] = -1.0;
            cylinderVertices[j + 3] = 1.0;
            cylinderVertices[j + 4] = Math.random();
            cylinderVertices[j + 5] = Math.random();
            cylinderVertices[j + 6] = Math.random();
        }
        else {
            if (faceRight) {
              cylinderVertices[j] = Math.cos(Math.PI * (v - 1) / topVertices);
              cylinderVertices[j + 1] = Math.sin(Math.PI * (v - 1) / topVertices);
            } else {
              cylinderVertices[j] = 0.0;
              cylinderVertices[j + 1] = 0.0;
            }

            cylinderVertices[j + 2] = -1.0;
            cylinderVertices[j + 3] = 1.0;
            cylinderVertices[j + 4] = Math.random();
            cylinderVertices[j + 5] = Math.random();
            cylinderVertices[j + 6] = Math.random();
        }
    }
    return cylinderVertices;
}

function makeCube() {
  var c30 = Math.sqrt(0.75);
  var sq2 = Math.sqrt(2.0);

  var cubeVertices = new Float32Array([
     0.0,  0.0, sq2, 1.0,     1.0, 1.0, 1.0,
     c30, -0.5, 0.0, 1.0,     0.0, 0.0, 1.0,
     0.0,  1.0, 0.0, 1.0,     1.0, 0.0, 0.0,
     0.0,  0.0, sq2, 1.0,     1.0, 1.0, 1.0,
     0.0,  1.0, 0.0, 1.0,     1.0, 0.0, 0.0,
    -c30, -0.5, 0.0, 1.0,     0.0, 1.0, 0.0,
     0.0,  0.0, sq2, 1.0,     1.0, 1.0, 1.0,
    -c30, -0.5, 0.0, 1.0,     0.0, 1.0, 0.0,
     c30, -0.5, 0.0, 1.0,     0.0, 0.0, 1.0,
    -c30, -0.5, -0.2, 1.0,    0.0, 1.0, 0.0,
     0.0,  1.0, -0.2, 1.0,    1.0, 0.0, 0.0,
     c30, -0.5, -0.2, 1.0,    0.0, 0.0, 1.0,
     1.0, -1.0, -1.0, 1.0,    1.0, 0.0, 0.0,
     1.0,  1.0, -1.0, 1.0,    1.0, 0.0, 0.0,
     1.0,  1.0,  1.0, 1.0,    1.0, 0.0, 0.0,
     1.0,  1.0,  1.0, 1.0,    1.0, 0.1, 0.1,
     1.0, -1.0,  1.0, 1.0,    1.0, 0.1, 0.1,
     1.0, -1.0, -1.0, 1.0,    1.0, 0.1, 0.1,
    -1.0,  1.0, -1.0, 1.0,    0.0, 1.0, 0.0,
    -1.0,  1.0,  1.0, 1.0,    0.0, 1.0, 0.0,
     1.0,  1.0,  1.0, 1.0,    0.0, 1.0, 0.0,
     1.0,  1.0,  1.0, 1.0,    0.1, 1.0, 0.1,
     1.0,  1.0, -1.0, 1.0,    0.1, 1.0, 0.1,
    -1.0,  1.0, -1.0, 1.0,    0.1, 1.0, 0.1,
    -1.0,  1.0,  1.0, 1.0,    0.0, 0.0, 1.0,
    -1.0, -1.0,  1.0, 1.0,    0.0, 0.0, 1.0,
     1.0, -1.0,  1.0, 1.0,    0.0, 0.0, 1.0,
     1.0, -1.0,  1.0, 1.0,    0.1, 0.1, 1.0,
     1.0,  1.0,  1.0, 1.0,    0.1, 0.1, 1.0,
    -1.0,  1.0,  1.0, 1.0,    0.1, 0.1, 1.0,
    -1.0, -1.0,  1.0, 1.0,    0.0, 1.0, 1.0,
    -1.0,  1.0,  1.0, 1.0,    0.0, 1.0, 1.0,
    -1.0,  1.0, -1.0, 1.0,    0.0, 1.0, 1.0,
    -1.0,  1.0, -1.0, 1.0,    0.1, 1.0, 1.0,
    -1.0, -1.0, -1.0, 1.0,    0.1, 1.0, 1.0,
    -1.0, -1.0,  1.0, 1.0,    0.1, 1.0, 1.0,
     1.0, -1.0, -1.0, 1.0,    1.0, 0.0, 1.0,
     1.0, -1.0,  1.0, 1.0,    1.0, 0.0, 1.0,
    -1.0, -1.0,  1.0, 1.0,    1.0, 0.0, 1.0,
    -1.0, -1.0,  1.0, 1.0,    1.0, 0.1, 1.0,
    -1.0, -1.0, -1.0, 1.0,    1.0, 0.1, 1.0,
     1.0, -1.0, -1.0, 1.0,    1.0, 0.1, 1.0,
     1.0,  1.0, -1.0, 1.0,    1.0, 1.0, 0.0,
     1.0, -1.0, -1.0, 1.0,    1.0, 1.0, 0.0,
    -1.0, -1.0, -1.0, 1.0,    1.0, 1.0, 0.0,
    -1.0, -1.0, -1.0, 1.0,    1.0, 1.0, 0.1,
    -1.0,  1.0, -1.0, 1.0,    1.0, 1.0, 0.1,
     1.0,  1.0, -1.0, 1.0,    1.0, 1.0, 0.1,

  ]);
  return cubeVertices;
}

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
    cube1 = makeCube();
    cube2 = makeCube();
    cube3 = makeCube();
    wrist = makeCube();
    finger1 = makeCube();
    finger2 = makeCube();

    var totalSize = planet.length + moon1.length + moon2.length + moon3.length + cube1.length + cube2.length + cube3.length + wrist.length + finger1.length + finger2.length;
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

    cube1Start = i;
    for(j = 0; j < cube1.length; i++, j++) {
        colorShapes[i] = cube1[j];
    }

    cube2Start = i;
    for(j = 0; j < cube2.length; i++, j++) {
        colorShapes[i] = cube2[j];
    }

    cube3Start = i;
    for(j = 0; j < cube3.length; i++, j++) {
        colorShapes[i] = cube3[j];
    }

    wristStart = i;
    for(j = 0; j < wrist.length; i++, j++) {
        colorShapes[i] = wrist[j];
    }

    finger1Start = i;
    for(j = 0; j < finger1.length; i++, j++) {
        colorShapes[i] = finger1[j];
    }

    finger2Start = i;
    for(j = 0; j < finger2.length; i++, j++) {
        colorShapes[i] = finger2[j];
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

function draw(gl, n, bodyAngle, cube1Angle, cube2Angle, cube3Angle, finger1Angle, finger2Angle, modelMatrix, u_ModelMatrix) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Draw the planet
  modelMatrix.setTranslate(-0.6, -0.8, 0.0);
  modelMatrix.scale(0.1, 0.1, 0.1);
  modelMatrix.rotate(bodyAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, planetStart / floatsPerVertex, planet.length / floatsPerVertex);

  // Draw the first moon
  modelMatrix.setTranslate(-0.6, -0.3, 0.0);
  modelMatrix.scale(0.2, 0.2, 0.2);
  modelMatrix.rotate(bodyAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, moon1Start / floatsPerVertex, moon1.length / floatsPerVertex);

  // Draw the second moon
  modelMatrix.setTranslate(-0.6, 0.2, 0.0);
  modelMatrix.scale(0.2, 0.2, 0.2);
  modelMatrix.rotate(bodyAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, moon2Start / floatsPerVertex, moon2.length / floatsPerVertex);

  // Draw the third moon
  modelMatrix.setTranslate(-0.6, 0.7, 0.0);
  modelMatrix.scale(0.1, 0.1, 0.1);
  modelMatrix.rotate(bodyAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, moon3Start / floatsPerVertex, moon3.length / floatsPerVertex);

  // Draw the first cube
  modelMatrix.setTranslate(0.0, 0.2, 0.0);
  modelMatrix.scale(0.1, 0.1, 0.1);
  modelMatrix.rotate(cube1Angle, 0, 1, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, cube1Start / floatsPerVertex, cube1.length / floatsPerVertex);
  // Draw the second cube
  modelMatrix.setTranslate(0.0, 0.0, 0.0);
  modelMatrix.scale(0.1, 0.1, 0.1);
  modelMatrix.rotate(cube2Angle, 0, 1, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, cube2Start / floatsPerVertex, cube2.length / floatsPerVertex);
  // Draw the third cube
  modelMatrix.setTranslate(0.0, -0.2, 0.0);
  modelMatrix.scale(0.1, 0.1, 0.1);
  modelMatrix.rotate(cube3Angle, 0, 1, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, cube3Start / floatsPerVertex, cube3.length / floatsPerVertex);

  // Draw the arm base
  modelMatrix.setTranslate(0.5, 0.2, 0.0);
  modelMatrix.scale(0.3, 0.3, 0.3);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, wristStart / floatsPerVertex, wrist.length / floatsPerVertex);
  // Draw the first finger
  modelMatrix.setTranslate(0.3, 0.6, 0.0);
  modelMatrix.scale(0.1, 0.1, 0.1);
  modelMatrix.rotate(finger1Angle, 0, 0, 1);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, finger1Start / floatsPerVertex, finger1.length / floatsPerVertex);
  // Draw the second finger
  modelMatrix.setTranslate(0.7, 0.6, 0.0);
  modelMatrix.scale(0.1, 0.1, 0.1);
  modelMatrix.rotate(finger2Angle, 0, 0, 1);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, finger2Start / floatsPerVertex, finger2.length / floatsPerVertex);
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
    var cube1Angle = 0.0;
    var cube2Angle = 0.0;
    var cube3Angle = 0.0;
    var finger1Angle = 0.0;
    var finger2Angle = 0.0;
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
          console.log(wasDragging);
          bodyAngle = animate(bodyAngle, direction);
        }

        $(document).keypress(function(event) {
          if (event.which == 97) {
            cube1Angle = animateCube(cube1Angle);
          } else if (event.which == 115) {
            cube2Angle = animateCube(cube2Angle);
          } else if (event.which == 100) {
            cube3Angle = animateCube(cube3Angle);
          } else if (event.which == 102) {
            finger1Angle = animate(finger1Angle, false);
          } else if (event.which == 103) {
            finger2Angle = animate(finger2Angle, false);
          } else if (event.which == 104) {
            finger1Angle = animate(finger1Angle, true);
          } else if (event.which == 106) {
            finger2Angle = animate(finger2Angle, true);
          }
        });

        draw(rendering, vertices, bodyAngle, cube1Angle, cube2Angle, cube3Angle, finger1Angle, finger2Angle, modelMatrix, u_ModelMatrix);
        requestAnimationFrame(tick, canvas);
    };

    tick();
});