'use strict';

/*
// TODO: Understand why calling "Shape()" in the browser console affects points, faces, colors globals
function Shape(points, faces, colors) {
    this.points = undefined === points ? [] : points;
    this.faces = undefined === faces ? [] : faces;
    this.colors = undefined === colors ? [] : colors;
}
*/

// This is the base-cube used to procedurally construct the full Rubik's Cube.
var cubie = {
    points: [
        new Point( 1, 1, 1), // 0
        new Point( 1, 1,-1), // 1
        new Point( 1,-1, 1), // 2
        new Point( 1,-1,-1), // 3
        new Point(-1, 1, 1), // 4
        new Point(-1, 1,-1), // 5
        new Point(-1,-1, 1), // 6
        new Point(-1,-1,-1)  // 7
    ],
    faces: [
        [0, 2, 6, 4], // Front
        [5, 7, 3, 1], // Back
        [1, 0, 4, 5], // Up
        [2, 3, 7, 6], // Down
        [4, 6, 7, 5], // Left
        [1, 3, 2, 0]  // Right
    ],
    colors: [
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
        'purple'
    ]
}


function makeCube() {
    var dx, dy, dz, cubieNum, i, point, face;
    var cube = {
        points: [],
        faces: [],
        colors: [],
        spatial: [] // element [x][y][z] is a list of the points that are in cubie position [x][y][z].
    }

    cubieNum = 0;
    for (dx = 0; dx < 3; dx++) {
        cube.spatial[dx] = [];
        for (dy = 0; dy < 3; dy++) {
            cube.spatial[dx][dy] = [];
            for (dz = 0; dz < 3; dz++) {
                cube.spatial[dx][dy][dz] = [];
                for (i = 0; i < cubie.points.length; i++) {
                    point = cubie.points[i].translate(dx*2-2, dy*2-2, dz*2-2);
                    point = point.scale(1/3);
                    cube.points.push(point);
                    cube.spatial[dx][dy][dz].push(cube.points.length-1)
                }
                for (i = 0; i < cubie.faces.length; i++) {
                    face = cubie.faces[i].map(function (idx) { return idx + 8 * cubieNum });
                    cube.faces.push(face);
                    cube.colors.push("hsl(" + Math.floor(Math.random() * 360) + ",100%,50%)");
                }
                cubieNum++;
            }
        }
    }
    return cube;
}

var cube = makeCube();
