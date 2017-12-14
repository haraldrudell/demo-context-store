// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var EmailSignUp = function () {};

// Added by sephora-jsx-loader.js
EmailSignUp.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const ReactDOM = require('react-dom');
const profileApi = require('services/api/profile');


EmailSignUp.prototype.ctrlr = function () {
    this.inputEl = ReactDOM.findDOMNode(this).querySelectorAll('input')[0];
};

EmailSignUp.prototype.handleOnClick = function (e) {
    e.preventDefault();

    if (this.isValid()) {

        this.setState({
            showLoading: true
        });

        let email = this.input.getValue();

        profileApi.enrollToSephoraEmails(email).
            then(() => this.showSuccess()).
            catch(() => this.showError());

    } else {
        this.showError();
    }
};

EmailSignUp.prototype.isValid = function () {
    return !this.input.validateError();
};

EmailSignUp.prototype.showSuccess = function () {
    this.inputEl.value = null;

    this.setState({
        showError: false,
        showSuccess: true,
        showLoading: false
    }, () => this.inputEl.blur());
};

EmailSignUp.prototype.showError = function () {
    this.setState({
        showError: true,
        showSuccess: false,
        showLoading: false
    }, () => this.inputEl.focus());
};


// Added by sephora-jsx-loader.js
module.exports = EmailSignUp.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/EmailSignUp/EmailSignUp.c.js