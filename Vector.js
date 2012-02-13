'use strict';

function Vector(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

Vector.prototype.dot = function (vec) {
    return this.x * vec.x + this.y * vec.y + this.z * vec.z;
};

Vector.prototype.cross = function (vec) {
    var x, y, z;
    x = this.x * vec.z - this.z * vec.y;
    y = this.z * vec.x - this.x * vec.z;
    z = this.x * vec.y - this.y * vec.x;
    return new Vector(x, y, z);
};
