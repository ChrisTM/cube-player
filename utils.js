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
