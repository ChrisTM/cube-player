'use strict';

function Point(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

/** Project a 3D point into the xy view-plane.
 * dist -- how far camera is from origin (on z axis)
 * halfAngle -- like a FOV
 */
Point.prototype.project = function (dist, halfAngle) {
    var scale = Math.tan(halfAngle) / (this.z - dist);
    var x = this.x * scale;
    var y = this.y * scale;
    return new Point(x, y, this.z);
};

/** Rotate point `rads` radians along the x axis. 
 * The following derivation uses `hyp` as distance of this from origin,
 * angle as angle of `this` from x-axis, and `delta` as desired rotation
 * angle):
 *
 * this.x = hyp * cos(angle)
 * this.y = hyp * sin(angle)
 * newX = hyp * cos(angle + delta) 
 *      = hyp * cos(angle) * cos(delta) - hyp * sin(angle) * sin(delta) 
 *      = this.x * cos(delta) - this.y * sin(delta)
 * newY = hyp * sin(angle + delta) 
 *      = hyp * sin(angle) * cos(delta) + hyp * cos(angle) * sin(delta) 
 *      = this.y * cos(delta) - this.x * sin(delta)
 */
Point.prototype.rotateZ = function (rads) {
    var cosTheta = Math.cos(rads);
    var sinTheta = Math.sin(rads);
    var x = this.x * cosTheta - this.y * sinTheta;
    var y = this.y * cosTheta + this.x * sinTheta;
    return new Point(x, y, this.z);
};

Point.prototype.rotateX = function (rads) {
    var cosTheta = Math.cos(rads);
    var sinTheta = Math.sin(rads);
    var y = this.y * cosTheta - this.z * sinTheta;
    var z = this.z * cosTheta + this.y * sinTheta;
    return new Point(this.x, y, z);
};

Point.prototype.rotateY = function (rads) {
    var cosTheta = Math.cos(rads);
    var sinTheta = Math.sin(rads);
    var z = this.z * cosTheta - this.x * sinTheta;
    var x = this.x * cosTheta + this.z * sinTheta;
    return new Point(x, this.y, z);
};

Point.prototype.round = function () {
    return new Point(Math.round(this.x), Math.round(this.y), Math.round(this.z));
};

Point.prototype.translate = function (deltaX, deltaY, deltaZ) {
    return new Point(this.x + deltaX, this.y + deltaY, this.z + deltaZ);
};
