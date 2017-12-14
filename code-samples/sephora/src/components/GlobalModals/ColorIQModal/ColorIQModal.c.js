// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var ColorIQModal = function () {};

// Added by sephora-jsx-loader.js
ColorIQModal.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const showColorIQModal = require('Actions').showColorIQModal;

ColorIQModal.prototype.ctrlr = function () {
    store.setAndWatch({
        'user.beautyInsiderAccount': 'biAccount'
    }, this);
};

ColorIQModal.prototype.requestClose = function (e) {
    this.props.callback && this.props.callback();
    store.dispatch(showColorIQModal(false));
};


// Added by sephora-jsx-loader.js
module.exports = ColorIQModal.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/ColorIQModal/ColorIQModal.c.js