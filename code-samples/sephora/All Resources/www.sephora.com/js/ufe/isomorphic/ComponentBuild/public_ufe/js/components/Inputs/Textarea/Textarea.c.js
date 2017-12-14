// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Textarea = function () {};

// Added by sephora-jsx-loader.js
Textarea.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const ReactDOM = require('react-dom');

Textarea.prototype.handleChange = function (event) {
    let input = event.target.value;
    let maxLength = this.props.maxLength;

    // maxLength prop doesn't work on Android browsers
    if (maxLength) {
        input = input.substr(0, maxLength);
    }

    this.setState({
        value: input,
        characterCount: input.length
    }, () => {
        this.props.handleChange && this.props.handleChange(input);
    });
};

Textarea.prototype.getValue = function () {
    return this.state.value;
};

Textarea.prototype.validateError = function () {
    let error = this.props.validate ? this.props.validate(this.state.value) : null;

    this.setState({
        error: error
    });

    return error;
};

Textarea.prototype.focus = function () {
    const element = ReactDOM.findDOMNode(this.inputElement);
    element.focus();
};


// Added by sephora-jsx-loader.js
module.exports = Textarea.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Inputs/Textarea/Textarea.c.js