// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var VideoModal = function () {};

// Added by sephora-jsx-loader.js
VideoModal.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const Actions = require('Actions');

VideoModal.prototype.isDone = function (e) {
    store.dispatch(Actions.showVideoModal({
        isOpen: false
    }));
};


// Added by sephora-jsx-loader.js
module.exports = VideoModal.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/VideoModal/VideoModal.c.js