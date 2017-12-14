// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var BccModal = function () {};

// Added by sephora-jsx-loader.js
BccModal.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const processEvent = require('analytics/processEvent');
const anaConsts = require('analytics/constants');

BccModal.prototype.ctrlr = function () {
    if (this.props.modalState) {
        this.trackOpenEvent();
    }
};

BccModal.prototype.toggleOpen = function () {
    if (this.props.modalState === true) {
        this.props.toggleFromParent();
    } else {
        let isOpen = !this.state.isOpen;
        if (isOpen) {
            this.trackOpenEvent();
        }

        this.setState({
            isOpen: isOpen
        });
    }
};

BccModal.prototype.trackOpenEvent = function () {
    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
        data: {
            bindingMethods: [require('analytics/bindings/pages/all/bccModalOpenEvent')],
            bccComponentName: this.props.name
        }
    });
};


// Added by sephora-jsx-loader.js
module.exports = BccModal.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Bcc/BccModal/BccModal.c.js