// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var BiQualify = function () {};

// Added by sephora-jsx-loader.js
BiQualify.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const auth = require('utils/Authentication');
const showBiRegisterModal = require('Actions').showBiRegisterModal;
const userUtils = require('utils/User');
const watch = require('redux-watch');

BiQualify.prototype.ctrlr = function () {

    store.setAndWatch('user', null, () => {
        this.setState({
            isUserAnonymous: userUtils.isAnonymous(),
            isBiLevelQualifiedFor: userUtils.isBiLevelQualifiedFor(this.props.currentSku)
        });
    });
};

BiQualify.prototype.signInHandler = function () {
    auth.requireAuthentication();
};

BiQualify.prototype.biRegisterHandler = function () {
    // sign up for beauty insider modal needs to be implemented
    store.dispatch(showBiRegisterModal(true));
};


// Added by sephora-jsx-loader.js
module.exports = BiQualify.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BiQualify/BiQualify.c.js