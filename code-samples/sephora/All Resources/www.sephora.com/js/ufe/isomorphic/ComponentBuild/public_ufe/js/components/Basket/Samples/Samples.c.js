// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Samples = function () {};

// Added by sephora-jsx-loader.js
Samples.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const watch = require('redux-watch');

Samples.prototype.ctrlr = function () {
    let samplesObj = store.getState().samples;
    let watchSamples = watch(store.getState, 'samples');

    if (samplesObj) {
        this.setState({
            samplesList: samplesObj.samples,
            allowedQtyPerOrder: samplesObj.allowedQtyPerOrder
        });
    }

    store.subscribe(watchSamples((newSamples) => {
        this.setState({
            samplesList: newSamples.samples,
            allowedQtyPerOrder: newSamples.allowedQtyPerOrder
        });
    }));
};



// Added by sephora-jsx-loader.js
module.exports = Samples.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/Samples/Samples.c.js