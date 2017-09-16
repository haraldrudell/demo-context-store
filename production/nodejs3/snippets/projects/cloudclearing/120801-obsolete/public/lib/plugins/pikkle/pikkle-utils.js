// common pikkle used methods
// this is included in the game html page and also in the weltmeister editor
// has to be included before everything else as it defines a global pikkle object and methods

// monkey patch a function onto the canvas
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x+r, y);
    this.arcTo(x+w, y,   x+w, y+h, r);
    this.arcTo(x+w, y+h, x,   y+h, r);
    this.arcTo(x,   y+h, x,   y,   r);
    this.arcTo(x,   y,   x+w, y,   r);
    this.closePath();
    return this;
};

/// utility class
pikkle = {};
pikkle.randomSign = function() {
    var f = (Math.random() < 0.5 ) ? 1 : -1;
    return f;
};

pikkle.randomInt = function(max) {
    var n = Math.round(Math.random() * max);
    return n;
}
