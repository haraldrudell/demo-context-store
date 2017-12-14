// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var BiBarcode = function () {};

// Added by sephora-jsx-loader.js
BiBarcode.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const biApi = require('services/api/beautyInsider');
const BARCODE_WIDTH = 3.2;
const BARCODE_HEIGHT = 1;

BiBarcode.prototype.ctrlr = function () {
    biApi.getBiDigitalCardNumber(this.props.profileId).then(data => {
        this.createBarcode(data.biDigitalCardNumber);
    });
};

//uses a PDF417 array to construct the barcode image in pixels
BiBarcode.prototype.createBarcode = function (biCardNumber) {
    let ratio = window.devicePixelRatio || 1;
    PDF417.init(biCardNumber);
    let barcode = PDF417.getBarcodeArray();
    let canvas = this.canvas;
    canvas.width = (BARCODE_WIDTH * barcode.num_cols) * ratio;
    canvas.height = (BARCODE_HEIGHT * barcode.num_rows) * ratio;
    canvas.style.width = canvas.width / ratio + 'px';
    canvas.style.height = canvas.height / ratio + 'px';
    let ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);
    let y = 0;
    for (let r = 0; r < barcode.num_rows; ++r) {
        let x = 0;
        for (let c = 0; c < barcode.num_cols; ++c) {
            if (barcode.bcode[r][c] === '1') {
                ctx.fillRect(x, y, BARCODE_WIDTH, BARCODE_HEIGHT);
            }

            x += BARCODE_WIDTH;
        }

        y += BARCODE_HEIGHT;
    }
};


// Added by sephora-jsx-loader.js
module.exports = BiBarcode.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BiBarcode/BiBarcode.c.js