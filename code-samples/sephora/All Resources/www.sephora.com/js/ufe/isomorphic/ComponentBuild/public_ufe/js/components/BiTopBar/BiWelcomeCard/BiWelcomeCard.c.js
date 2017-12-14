// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var BiWelcomeCard = function () {};

// Added by sephora-jsx-loader.js
BiWelcomeCard.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const auth = require('utils/Authentication');
const Actions = require('Actions');
const showBiRegisterModal = Actions.showBiRegisterModal;
const store = require('Store');

BiWelcomeCard.prototype.signIn = function (e) {
    e.preventDefault();
    auth.requireAuthentication();
};

BiWelcomeCard.prototype.joinBi = function (e) {
    e.preventDefault();
    store.dispatch(showBiRegisterModal(true));
};


// Added by sephora-jsx-loader.js
module.exports = BiWelcomeCard.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BiTopBar/BiWelcomeCard/BiWelcomeCard.c.js