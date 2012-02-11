'use strict';

function Shape(points, faces, colors) {
    this.points = undefined === points ? [] : points;
    this.faces = undefined === faces ? [] : faces;
    this.colors = undefined === colors ? [] : colors;
}

var points = [
    new Point( 1, 1, 1), // 0
    new Point( 1, 1,-1), // 1
    new Point( 1,-1, 1), // 2
    new Point( 1,-1,-1), // 3
    new Point(-1, 1, 1), // 4
    new Point(-1, 1,-1), // 5
    new Point(-1,-1, 1), // 6
    new Point(-1,-1,-1)  // 7
];
var faces = [
    [0, 2, 6, 4], // Front
    [5, 7, 3, 1], // Back
    [1, 0, 4, 5], // Up
    [2, 3, 7, 6], // Down
    [4, 6, 7, 5], // Left
    [1, 3, 2, 0]  // Right
];
var colors = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'purple'
];
