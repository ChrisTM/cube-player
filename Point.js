'use strict';

function Point(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

Point.prototype.clone = function () {
    return new Point(this.x, this.y, this.z);
}

/** Return a function that rotates a point `rads` radians along the z axis. 
 *
 * The following derivation uses `hyp` as distance of point from origin, angle
 * as angle of point from x-axis, and `delta` as desired rotation angle).
 *
 * point.x = hyp * cos(angle)
 * point.y = hyp * sin(angle)
 * newX = hyp * cos(angle + delta) 
 *      = hyp * cos(angle) * cos(delta) - hyp * sin(angle) * sin(delta) 
 *      = point.x * cos(delta) - point.y * sin(delta)
 * newY = hyp * sin(angle + delta) 
 *      = hyp * sin(angle) * cos(delta) + hyp * cos(angle) * sin(delta) 
 *      = point.y * cos(delta) - point.x * sin(delta)
 */
function rotateZ(rads) {
    var cosTheta, sinTheta;
    cosTheta = Math.cos(rads);
    sinTheta = Math.sin(rads);
    return function (point) {
        var x = point.x * cosTheta - point.y * sinTheta;
        var y = point.y * cosTheta + point.x * sinTheta;
        return new Point(x, y, point.z);
    };
}

function rotateX(rads) {
    var cosTheta, sinTheta;
    cosTheta = Math.cos(-rads);
    sinTheta = Math.sin(-rads);
    return function (point) {
        var y = point.y * cosTheta - point.z * sinTheta;
        var z = point.z * cosTheta + point.y * sinTheta;
        return new Point(point.x, y, z);
    };
}

function rotateY(rads) {
    var cosTheta, sinTheta;
    cosTheta = Math.cos(rads);
    sinTheta = Math.sin(rads);
    return function (point) {
        var z = point.z * cosTheta - point.x * sinTheta;
        var x = point.x * cosTheta + point.z * sinTheta;
        return new Point(x, point.y, z);
    };
}

/** Return a function that project a 3D point into the xy view-plane.
 * Arguments:
 *     dist -- how far camera is from origin (on z axis)
 *     halfAngle -- like a FOV
 */
function project(dist, halfAngle) {
    var tan = Math.tan(halfAngle);
    return function (point) {
        var x = (point.x * tan) / (point.z - dist);
        var y = (point.y * tan) / (point.z - dist);
        return new Point(x, y, point.z);
    };
}

function translate(deltaX, deltaY, deltaZ) {
    return function (point) {
        return new Point(point.x + deltaX, point.y + deltaY, point.z + deltaZ);
    };
}

function scale(factor) {
    return function (point) {
        return new Point(point.x * factor, point.y * factor, point.z * factor);
    };
};

