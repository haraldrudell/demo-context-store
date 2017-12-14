// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var TryItOnButton = function () {};

// Added by sephora-jsx-loader.js
TryItOnButton.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const Modiface = require('services/api/thirdparty/Modiface');
const VirtualArtistActions = require('actions/VirtualArtistActions');
const store = require('Store');

TryItOnButton.prototype.ctrlr = function () {};

TryItOnButton.prototype.tryItOn = function (e) {
    e.stopPropagation();
    Modiface.tryItOn();
    store.dispatch(VirtualArtistActions.showVirtualArtist(true));
};


// Added by sephora-jsx-loader.js
module.exports = TryItOnButton.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/VirtualArtist/TryItOnButton/TryItOnButton.c.js