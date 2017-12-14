// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var PanZoom = function () {};

// Added by sephora-jsx-loader.js
PanZoom.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const ZOOM = 0.5;

PanZoom.prototype.ctrlr = function () {
};

PanZoom.prototype.onPanStart = function (event) {
    this._startX = this.state.translate.x;
    this._startY = this.state.translate.y;
};

PanZoom.prototype.onPanEnd = function (event) {
};

PanZoom.prototype.onPan = function (event) {
    // Bug in Hammer with Chrome: https://github.com/hammerjs/hammer.js/issues/1050
    if (event.srcEvent.type !== 'pointercancel') {
        this.setState({
            translate: {
                x: this._startX + event.deltaX,
                y: this._startY + event.deltaY
            }
        });
    } else {
        this.setState({
            translate: {
                x: this._startX,
                y: this._startY
            }
        });
    }
};

PanZoom.prototype.onDoubleTap = function (event) {
    this.zoom(true);
};

PanZoom.prototype.zoom = function (isZoomIn) {
    let intervalId, scale, zoomStep;
    let animateScale = () => {
        let zoomFactor = isZoomIn ? this.state.scale + zoomStep : this.state.scale - zoomStep;
        if (Math.abs(this.state.scale - scale) < 0.01) {
            cancelAnimationFrame(intervalId);
        } else {
            this.setState({
                scale: zoomFactor
            });
            requestAnimationFrame(animateScale);
        }
    };
    scale = isZoomIn ? this.state.scale + ZOOM : this.state.scale - ZOOM;
    let zoomTime = 100;
    zoomStep = isZoomIn ? scale - this.state.scale : this.state.scale - scale;
    zoomStep /= zoomTime;
    intervalId = requestAnimationFrame(animateScale);
};


// Added by sephora-jsx-loader.js
module.exports = PanZoom.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/PanZoom/PanZoom.c.js