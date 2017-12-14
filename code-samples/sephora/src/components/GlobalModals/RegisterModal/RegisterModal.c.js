// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var RegisterModal = function () {};

// Added by sephora-jsx-loader.js
RegisterModal.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store             = require('Store');
const showRegisterModal = require('Actions').showRegisterModal;

RegisterModal.prototype.requestClose = function (e) {
    store.dispatch(showRegisterModal(false));

    //currently errback passed in only from requireLoggedInAuthentication function
    if (this.props.errback) {
        this.props.errback();
    }
};


// Added by sephora-jsx-loader.js
module.exports = RegisterModal.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/RegisterModal/RegisterModal.c.js