// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var BeautyInsider = function () {};

// Added by sephora-jsx-loader.js
BeautyInsider.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const decorators = require('utils/decorators');
const ensureUserIsAtLeastRecognized = decorators.ensureUserIsAtLeastRecognized;
const store = require('store/Store');
const userUtils = require('utils/User');
const Events = require('utils/framework/Events');

BeautyInsider.prototype.ctrlr = function () {
    Events.onLastLoadEvent(window, [Events.UserInfoReady], () => {
        store.setAndWatch('user', null, value => {
            this.setState({
                isUserBi: userUtils.isBI(),
                user: value.user
            });
        });
    });
};

BeautyInsider = ensureUserIsAtLeastRecognized(BeautyInsider);


// Added by sephora-jsx-loader.js
module.exports = BeautyInsider.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/BeautyInsider/BeautyInsider.c.js