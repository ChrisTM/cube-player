'use strict';

function Shape(points, faces, colors) {
    this.points = points === undefined ? [] : points;
    this.faces = faces === undefined ? [] : faces;
    this.colors = colors === undefined ? [] : colors;
}

Shape.prototype.tumble = function (rotX, rotY, rotZ) {
    var result = new Shape([], this.faces.slice(), this.colors.slice());
    for (var i = 0; i < this.points.length; i++) {
        result.points.push(
                this.points[i].rotateX(rotX).rotateY(rotY).rotateZ(rotZ)
        );
    }
    return result;
};

Shape.prototype.project = function (dist, halfAngle) {
    var result = new Shape([], this.faces.slice(), this.colors.slice());
    for (var i = 0; i < this.points.length; i++) {
        result.points.push(
                this.points[i].project(dist, halfAngle)
        );
    }
    return result;
};



// This is the base-cube used to procedurally construct the full Rubik's Cube.
var cubie = new Shape(
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
        [4, 6, 7, 5], // Left
        [1, 3, 2, 0]  // Right
    ],
    [
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
        'purple'
    ]
);

var cube = function () {
    var dx, dy, dz, cubieNum, i, point, face, shape;
    var points = [];
    var faces = [];
    var colors = [];
    // element [x][y][z] is a list of the points that are in cubie position [x][y][z].
    var spatial = [];

    cubieNum = 0;
    for (dx = 0; dx < 3; dx++) {
        spatial[dx] = [];
        for (dy = 0; dy < 3; dy++) {
            spatial[dx][dy] = [];
            for (dz = 0; dz < 3; dz++) {
                spatial[dx][dy][dz] = [];
                for (i = 0; i < cubie.points.length; i++) {
                    point = cubie.points[i].scale(0.95).translate(dx*2-2, dy*2-2, dz*2-2);
                    point = point.scale(1/3);
                    points.push(point);
                    spatial[dx][dy][dz].push(points.length-1);
                }
                for (i = 0; i < cubie.faces.length; i++) {
                    face = cubie.faces[i].map(function (idx) { return idx + 8 * cubieNum });
                    faces.push(face);
                    colors.push("hsl(" + Math.floor(Math.random() * 360) + ",100%,50%)");
                }
                cubieNum++;
            }
        }
    }
    shape = new Shape(points, faces, colors); 
    shape.spatial = spatial;
    return shape;
}();
