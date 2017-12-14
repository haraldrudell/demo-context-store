// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var SamplesCallToAction = function () {};

// Added by sephora-jsx-loader.js
SamplesCallToAction.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const watch = require('redux-watch');
const fetchSamples = require('actions/SampleActions').fetchSamples;
const showSampleModal = require('Actions').showSampleModal;
const processEvent = require('analytics/processEvent');
const anaConsts = require('analytics/constants');

SamplesCallToAction.prototype.ctrlr = function () {
    let watchSamples = watch(store.getState, 'samples');

    store.dispatch(fetchSamples());

    store.subscribe(watchSamples((newSamples) => {
        this.setState({
            samplesList: newSamples.samples,
            allowedQtyPerOrder: newSamples.allowedQtyPerOrder,
            samplesMessage: newSamples.samplesPageMessage
        });
    }));

    store.setAndWatch('basket', null, (value) => {
        this.setState({
            addedSamplesList: value.basket.samples
        });
    });
};

SamplesCallToAction.prototype.openSamples = function (e) {
    e.preventDefault();

    if (Sephora.isMobile()) {
        store.dispatch(showSampleModal(
            true, this.state.samplesList,
            this.state.allowedQtyPerOrder,
            this.state.samplesMessage));

        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                eventStrings: [anaConsts.Event.EVENT_71],
                linkName: anaConsts.LinkData.SELECT_SAMPLES,
                actionInfo: anaConsts.LinkData.SELECT_SAMPLES
            }
        });
    }

};


// Added by sephora-jsx-loader.js
module.exports = SamplesCallToAction.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/Samples/SamplesCallToAction/SamplesCallToAction.c.js