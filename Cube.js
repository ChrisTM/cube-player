'use strict';

function Cube(points, faces, colors, position) {
    this.points = points === undefined ? [] : points;
    this.faces = faces === undefined ? [] : faces;
    this.colors = colors === undefined ? [] : colors;
    // position[dx][dy][dz] is a list of the points at that logical place in
    // the cube. position[i][j][2] (for all i,j in 0..2) are indinces to the
    // front-layer points.
    this.position = position === undefined ? [[[],[],[]]
                                             ,[[],[],[]]
                                             ,[[],[],[]]] : position;
}

// I currently make the assumption that this.faces and this.colors never ever
// change, so we don't copy them.
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
    return new Cube(this.points.clone(), this.faces, this.colors);
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
    var dx, dy, dz, transform, cubieNum, i, point, face, shape;
    var result = new Cube();

    cubieNum = 0;
    for (dx = 0; dx < 3; dx++) {
        for (dy = 0; dy < 3; dy++) {
            for (dz = 0; dz < 3; dz++) {
                transform = compose(scale(1/3), translate(dx*2-2, dy*2-2, dz*2-2), scale(0.90));
                result.points = result.points.concat(cubie.points.map(transform));
                for (i = 0; i < cubie.faces.length; i++) {
                    result.colors.push(cubie.colors[i]);
                    result.faces.push(cubie.faces[i].map(function (idx) { return idx + 8 * cubieNum }));
                }
                result.position[dx][dy][dz] = new function () {
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

var moveU = function(cube) {
    // There are few enough points to allow iteration over all points. A better
    // implementation might keep the points in a 3D matrix or just maintain a
    // single 3D matrix with values being indices to the pointsarray.
    // filter the UP points
    // rotate UP points 90degY, rotate UP locations -90degY.

    var result = cube.clone();

    var cw90y = rotateY(Math.PI/2);
    var ccw90y = rotateY(-Math.PI/2);

    var dy = 2;
    for (var dx = 0; dx < 3; dx++) {
        for (var dz = 0; dz < 3; dz++) {
            var indices = cube.position[dx][dy][dz];
            for (var i = 0; i < indices.length; i++) {
                result.points[indices[i]] = cw90y(cube.points[indices[i]]);
            }
        }
    }

    return result;
}
