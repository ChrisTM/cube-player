'use strict';

function Cube(points, faces, colors, position) {
    this.points = points === undefined ? [] : points;
    this.faces = faces === undefined ? [] : faces;
    this.colors = colors === undefined ? [] : colors;
    // position[x][y][z] is a list of the points at that logical place in
    // the cube. position[i][j][2] (for all i,j in 0..2) are indinces to the
    // front-layer points.
    this.position = position === undefined ? [[[],[],[]]
                                             ,[[],[],[]]
                                             ,[[],[],[]]] : position;
}

// I currently make the assumption that this.faces and this.colors never ever
// change, so we don't clone them.
Cube.prototype.tumble = function (rotX, rotY, rotZ) {
    var newPoints = this.points.map(
        compose(rotateZ(rotZ), rotateY(rotY), rotateX(rotX))
    );
    return new Cube(newPoints, this.faces, this.colors);
};

Cube.prototype.project = function (dist, halfAngle) {
    var newPoints = this.points.map(project(dist, halfAngle));
    return new Cube(newPoints, this.faces, this.colors);
};

Cube.prototype.clone = function () {
    return new Cube(this.points.clone(), this.faces, this.colors, this.position.clone());
};


// This is the base-cube used to procedurally construct the full Rubik's Cube.
var cubie = new Cube(
    [
        new Point( 1, 1, 1), // 0
        new Point( 1, 1,-1), // 1
        new Point( 1,-1, 1), // 2
        new Point( 1,-1,-1), // 3
        new Point(-1, 1, 1), // 4
        new Point(-1, 1,-1), // 5
        new Point(-1,-1, 1), // 6
        new Point(-1,-1,-1)  // 7
    ],
    [
        [0, 2, 6, 4], // Front
        [5, 7, 3, 1], // Back
        [1, 0, 4, 5], // Up
        [2, 3, 7, 6], // Down
        [4, 6, 7, 5], // Right
        [1, 3, 2, 0]  // Left
    ],
    [
        'red',    // Front
        'orange', // Back
        'yellow', // Up
        'green',  // Down
        'blue',   // Right
        'purple'  // Left
    ]
);

var cube = function () {
    var x, y, z, transform, cubieNum, i, point, face, shape;
    var result = new Cube();

    cubieNum = 0;
    for (x = 0; x < 3; x++) {
        for (y = 0; y < 3; y++) {
            for (z = 0; z < 3; z++) {
                transform = compose(scale(1/3), translate(x*2-2, y*2-2, z*2-2), scale(0.90));
                result.points = result.points.concat(cubie.points.map(transform));
                for (i = 0; i < cubie.faces.length; i++) {
                    result.colors.push(cubie.colors[i]);
                    result.faces.push(cubie.faces[i].map(function (idx) { return idx + 8 * cubieNum }));
                }
                result.position[x][y][z] = function () {
                    var indices = [];
                    for (var i = 0; i < 8; i++) {
                        indices.push(i + 8 * cubieNum);
                    }
                    return indices;
                }();
                cubieNum++;
            }
        }
    }
    return result; 
}();

// Given a face ('U', 'D', etc.), return a list of 3D indices that represent
// the cubies in that face. These indices are used to lookup the points in
// the 3D array `cube.position`.
var getCubieIndices = function (face) {
    var xMin = 0; var xMax = 2;
    var yMin = 0; var yMax = 2;
    var zMin = 0; var zMax = 2;

    // lock the ranges so they select only the given face
    switch(face) {
        case 'U': yMin = yMax = 2; break;
        case 'D': yMin = yMax = 0; break;
        case 'R': xMin = xMax = 0; break;
        case 'L': xMin = xMax = 2; break;
        case 'F': zMin = zMax = 2; break;
        case 'B': zMin = zMax = 0; break;
        default: throw new Error('Invalid face');
    }
    var indices = [];
    for (var x = xMin; x <= xMax; x++) {
        for (var y = yMin; y <= yMax; y++) {
            for (var z = zMin; z <= zMax; z++) {
                // this isn't actually a point, but it's terribly convienent to
                // think and use it as such.
                indices = indices.concat(new Point(x, y, z));
            }
        }
    }
    return indices;
};

var selectPointIndices = function (cube, face) {
    var cubieIndices = getCubieIndices(face);
    var pointIndices = [];
    for (var i = 0; i < cubieIndices.length; i++) {
        var idx = cubieIndices[i];
        pointIndices = pointIndices.concat(cube.position[idx.x][idx.y][idx.z]);
    }
    return pointIndices;
}

var move = function(cube, move) {
    var result, move, forward, backward;
    result = cube.clone();

    switch(move.face) {
        case 'U': forward = rotateY( move.angle); backward = rotateY(-move.angle); break;
        case 'D': forward = rotateY(-move.angle); backward = rotateY( move.angle); break;
        case 'R': forward = rotateX( move.angle); backward = rotateX(-move.angle); break;
        case 'L': forward = rotateX(-move.angle); backward = rotateX( move.angle); break;
        case 'F': forward = rotateZ( move.angle); backward = rotateZ(-move.angle); break;
        case 'B': forward = rotateZ(-move.angle); backward = rotateZ( move.angle); break;
        default: 
            throw new Error("Invalid face");
    }

    var indices = selectPointIndices(cube, move.face);
    for (var i = 0; i < indices.length; i++) {
        var idx = indices[i];
        result.points[idx] = forward(cube.points[idx]);
    }

    var idxTran = compose(round, translate(1,1,1), backward, translate(-1,-1,-1));
    var cubieIndices = getCubieIndices(move.face);
    for (var i = 0; i < cubieIndices.length; i++) {
        var idx = cubieIndices[i];
        var revIdx = idxTran(idx);
        result.position[idx.x][idx.y][idx.z] = cube.position[revIdx.x][revIdx.y][revIdx.z];
    }


    return result;
};
