'use strict';

function compose() {
    var fns = arguments;
    return function () {
        var i = fns.length-1;
        var result = fns[i--].apply(this, arguments);
        while (i >= 0) {
            result = fns[i--].call(this, result);
        }
        return result;
    };
}

Array.prototype.clone = function() {
    var result = this.slice();
    for (var i = 0; i < this.length; i++) {
        if (this[i].clone) {
            result[i] = this[i].clone();
        }
    }
    return result;
}
