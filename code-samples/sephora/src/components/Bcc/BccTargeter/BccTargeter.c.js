// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var BccTargeter = function () {};

// Added by sephora-jsx-loader.js
BccTargeter.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const processTargeters = require('utils/BCC').processTargeters;

BccTargeter.prototype.ctrlr = function () {
    processTargeters(this.props.targeterName, this.updateComponent);
};

BccTargeter.prototype.updateComponent = function (targeterResult) {
    if (targeterResult.length) {
        // Pass icid2 to components if source needs it
        if (this.props.isTrackByName) {
            targeterResult[0].isTrackByName = this.props.isTrackByName;
        }

        // Pass propsCallback to components if source needs it
        if (this.props.propsCallback !== 'undefined') {
            targeterResult[0].propsCallback = this.props.propsCallback;
        }

        this.setState({
            compProps: targeterResult
        });
    }
};


// Added by sephora-jsx-loader.js
module.exports = BccTargeter.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Bcc/BccTargeter/BccTargeter.c.js