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


// given a string of moves, return a list of move objects
var parseMoves = function (movesString) {
    var moveRegex = /(2?)([UDFBLR])('?)/g;
    var moves = [];
    var match;
    while ((match = moveRegex.exec(movesString)) !== null) {
        var face = match[2];
        var angle = (match[1]) ? Math.PI : Math.PI/2.0; // check for the 2
        if (match[3]) { // check for the prime
            angle = -angle;
        }
        moves.push({ face: face, angle: angle });
    }
    return moves;
}
