'use strict';

var canvax, ctx;

function initializeCanvas(canvas) {
    canvas = canvas;
    ctx = canvas.getContext('2d');

    var scale = Math.min(canvas.width, canvas.height);
    ctx.translate(canvas.width/2, canvas.height/2); // put origin in center of canvas
    ctx.scale(scale, scale); // normalize the shortest canvas-dimension to 1 unit
    ctx.lineWidth = 1/scale; // make lineWidth one pixel again
}


/** Backface culling check to see if the face is visible 
 * face -- list of point indices for the given face. Must be given in
 *     clockwise order.
 */
 //TODO change to take shape and face Idx
function isBackFacing(face, points) {
    var pt0, pt1, pt2, vecA, vecB, camVec, normal, dotProd;
    pt0 = points[face[0]];
    pt1 = points[face[1]];
    pt2 = points[face[2]];
    vecA = new Vector(pt1.x - pt0.x,
                      pt1.y - pt0.y,
                      pt1.z - pt0.z);
    vecB = new Vector(pt2.x - pt0.x,
                      pt2.y - pt0.y,
                      pt2.z - pt0.z);
    normal = vecA.cross(vecB);

    camVec = new Vector(0, 0, -4);
    dotProd = normal.dot(camVec);
    return (dotProd > 0);
}

/** Return indices of faces in order of farthest face to closest face.
 * This info is used for painter's algorithm.
 */
function getFaceOrder(shape) {
    var face_order, faceIdx, face, metric, i;
    face_order = [];
    for (faceIdx = 0; faceIdx < shape.faces.length; faceIdx++) {
        face = shape.faces[faceIdx];
        metric = 0;
        for (i = 0; i < face.length; i++) {
            metric += shape.points[face[i]].z;
        }
        face_order.push({idx: faceIdx, dist: metric });
    }
    face_order.sort(function (a, b) { return a.dist - b.dist });
    return face_order.map(function (a) {return a.idx});
};

function drawShape(shape, rotX, rotY, rotZ) {
    var faceIndices, faceIdx, face; // used for painter's algo
    var i, j, point;

    ctx.clearRect(-0.5, -0.5, 1, 1);

    shape = shape.tumble(rotX, rotY, rotZ);
    shape = shape.project(4, Math.PI/4);

    // get distance-sorted face indices for painter's algorithm
    faceIndices = getFaceOrder(shape);

    // draw the faces
    for (i = 0; i < faceIndices.length; i++) {
        faceIdx = faceIndices[i];
        face = shape.faces[faceIdx];

        // skip faces facing away from camera
        if (isBackFacing(face, shape.points) === false) {
            continue;
        }

        // draw the face
        ctx.beginPath();
        for (j = 0; j < face.length; j++) {
            point = shape.points[face[j]];
            ctx.lineTo(point.x, point.y);
        }
        ctx.fillStyle = shape.colors[faceIdx];
        ctx.fill();
    }
}
