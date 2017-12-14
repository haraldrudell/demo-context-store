// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var TextInput = function () {};

// Added by sephora-jsx-loader.js
TextInput.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const ReactDOM = require('react-dom');

TextInput.prototype.ctrlr = function () {};

TextInput.prototype.componentWillReceiveProps = function (newProps) {
    if (newProps.value !== this.props.value) {
        this.setValue(newProps.value);
    }

    if (newProps.message !== this.props.message) {
        this.setState({
            message: newProps.message
        });
    }
};

TextInput.prototype.getValue = function () {
    return this.state.value;
};

TextInput.prototype.setValue = function (value, callback) {
    //set error to null when setting new value
    this.setState({
        value: value,
        error: null
    }, () => {
        callback && callback(this.state.value);
    });
};

TextInput.prototype.empty = function () {
    this.setValue('');
};

TextInput.prototype.validateError = function () {
    let error = this.props.validate ? this.props.validate(this.state.value) : null;

    this.setState({
        error: error
    });

    return error;
};

TextInput.prototype.focus = function () {
    const element = ReactDOM.findDOMNode(this.inputElement);
    element.focus();
};


// Added by sephora-jsx-loader.js
module.exports = TextInput.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Inputs/TextInput/TextInput.c.js