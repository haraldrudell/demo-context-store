// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var MobileSamplesList = function () {};

// Added by sephora-jsx-loader.js
MobileSamplesList.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('store/Store');
const watch = require('redux-watch');
const basketUtils = require('utils/Basket');
const showSampleModal = require('Actions').showSampleModal;

MobileSamplesList.prototype.ctrlr = function () {
    store.setAndWatch('basket', null, (value) => {
        let samples = value.basket.samples;
        this.setState({
            basketSamplesList: samples,
            basketSamplesCount: samples.length,
            sampleAllowedQty: value.basket.maxSamplesAllowedPerOrder
        });
    });

    store.setAndWatch('samples', null, (value) => {
        const samplesObj = value.samples;
        this.setState({
            samplesList: samplesObj.samples,
            samplesMessage: samplesObj.samplesPageMessage
        });
    });

};

MobileSamplesList.prototype.openSamples = function (e) {
    e.preventDefault();

    store.dispatch(showSampleModal(
            true, this.state.samplesList,
            this.state.sampleAllowedQty,
            this.state.samplesMessage));

};



// Added by sephora-jsx-loader.js
module.exports = MobileSamplesList.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/Samples/MobileSamplesList/MobileSamplesList.c.js