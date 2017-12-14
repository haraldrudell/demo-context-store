// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var InfoModal = function () {};

// Added by sephora-jsx-loader.js
InfoModal.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const showInfoModal = require('Actions').showInfoModal;

InfoModal.prototype.requestClose = function (e) {
    this.props.cancelCallback && this.props.cancelCallback();
    store.dispatch(showInfoModal(false));
};

InfoModal.prototype.handleClick = function () {
    this.requestClose();

    if (this.props.callback) {
        this.props.callback();
    }

    if (this.props.confirmMsgObj) {

        let confirmButtonText = 'done';
        let isMessageHTML = true;

        store.dispatch(
            showInfoModal(
                true,
                this.props.confirmMsgObj.title,
                this.props.confirmMsgObj.message,
                confirmButtonText,
                null,
                false,
                null,
                isMessageHTML)
        );
    }
};


// Added by sephora-jsx-loader.js
module.exports = InfoModal.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/InfoModal/InfoModal.c.js