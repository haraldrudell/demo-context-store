// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var InputCaptcha = function () {};

// Added by sephora-jsx-loader.js
InputCaptcha.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
InputCaptcha.prototype.ctrlr = function () {
    this.setState({
        captchaChallengeText: this.getCaptchaChallengeText()
    });
};

InputCaptcha.prototype.getValue = function () {
    return this.captchaTextInput.getValue();
};

InputCaptcha.prototype.empty = function () {
    return this.captchaTextInput.empty();
};

InputCaptcha.prototype.validateError = function () {
    return this.captchaTextInput.validateError();
};

InputCaptcha.prototype.getCaptchaChallengeText = function () {
    return '/challenge.png?' + Math.round(1000000000 * Math.random());
};

InputCaptcha.prototype.refreshVisualValidation = function () {
    this.captchaTextInput.empty();
    this.setState({
        captchaChallengeText: this.getCaptchaChallengeText()
    });
};

InputCaptcha.prototype.focus = function () {
    return this.captchaTextInput.focus();
};


// Added by sephora-jsx-loader.js
module.exports = InputCaptcha.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Inputs/InputCaptcha/InputCaptcha.c.js