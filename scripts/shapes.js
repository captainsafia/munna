var floatsPerVertex = 6;

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
                sphereVertices[j + 3] = Math.random();
                sphereVertices[j + 4] = Math.random();
                sphereVertices[j + 5] = Math.random();
            }
            else {
                sphereVertices[j] = sin1 * Math.cos(Math.PI * (v - 1) / sliceVertices);
                sphereVertices[j + 1] = sin1 * Math.sin(Math.PI * (v - 1) / sliceVertices);
                sphereVertices[j + 2] = cos1;
                sphereVertices[j + 3] = Math.random();
                sphereVertices[j + 4] = Math.random();
                sphereVertices[j + 5] = Math.random();
            }
        }
    }
    return sphereVertices;
}

function makeGroundGrid() {
  var xcount = 100;
  var ycount = 100;
  var xymax = 50.0;
  var xColr = new Float32Array([1.0, 1.0, 0.3]);
  var yColr = new Float32Array([0.5, 1.0, 0.5]);

  var gndVerts = new Float32Array(floatsPerVertex*2*(xcount+ycount));

  var xgap = xymax/(xcount-1);
  var ygap = xymax/(ycount-1);

  for(v=0, j=0; v<2*xcount; v++, j+= floatsPerVertex) {
    if(v%2==0) {
      gndVerts[j  ] = -xymax + (v  )*xgap;
      gndVerts[j+1] = -xymax;
      gndVerts[j+2] = 0.0;
    }
    else {
      gndVerts[j  ] = -xymax + (v-1)*xgap;
      gndVerts[j+1] = xymax;
      gndVerts[j+2] = 0.0;
    }
    gndVerts[j+3] = xColr[0];
    gndVerts[j+4] = xColr[1];
    gndVerts[j+5] = xColr[2];
  }

  for(v=0; v<2*ycount; v++, j+= floatsPerVertex) {
    if(v%2==0) {
      gndVerts[j  ] = -xymax;
      gndVerts[j+1] = -xymax + (v  )*ygap;
      gndVerts[j+2] = 0.0;
    }
    else {
      gndVerts[j  ] = xymax;
      gndVerts[j+1] = -xymax + (v-1)*ygap;
      gndVerts[j+2] = 0.0;
    }
    gndVerts[j+3] = yColr[0];
    gndVerts[j+4] = yColr[1];
    gndVerts[j+5] = yColr[2];
  }

  return gndVerts;
}

function makeForestVertices() {
    return new Float32Array([
     0.0,  0.5,  -0.4,  0.4,  1.0,  0.4,
    -0.5, -0.5,  -0.4,  0.4,  1.0,  0.4,
     0.5, -0.5,  -0.4,  1.0,  0.4,  0.4,

     0.5,  0.4,  -0.2,  1.0,  0.4,  0.4,
    -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,
     0.0, -0.6,  -0.2,  1.0,  1.0,  0.4,

     0.0,  0.5,   0.0,  0.4,  0.4,  1.0,
    -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,
     0.5, -0.5,   0.0,  1.0,  0.4,  0.4,
  ]);
}

function makeArmVertices() {
  return new Float32Array([
    0.5, 1.0, 0.5, -0.5, 1.0, 0.5, -0.5, 0.0, 0.5,  0.5, 0.0, 0.5,
    0.5, 1.0, 0.5,  0.5, 0.0, 0.5,  0.5, 0.0,-0.5,  0.5, 1.0,-0.5,
    0.5, 1.0, 0.5,  0.5, 1.0,-0.5, -0.5, 1.0,-0.5, -0.5, 1.0, 0.5,
   -0.5, 1.0, 0.5, -0.5, 1.0,-0.5, -0.5, 0.0,-0.5, -0.5, 0.0, 0.5,
   -0.5, 0.0,-0.5,  0.5, 0.0,-0.5,  0.5, 0.0, 0.5, -0.5, 0.0, 0.5,
    0.5, 0.0,-0.5, -0.5, 0.0,-0.5, -0.5, 1.0,-0.5,  0.5, 1.0,-0.5
  ]);
}