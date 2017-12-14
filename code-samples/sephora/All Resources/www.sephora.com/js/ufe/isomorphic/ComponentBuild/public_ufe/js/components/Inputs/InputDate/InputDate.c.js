// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var InputDate = function () {};

// Added by sephora-jsx-loader.js
InputDate.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
InputDate.prototype.getValue = function (raw = false) { // Raw if return new Date().toString() value
    if (raw === true) {
        return this.inputDate.getValue();
    } else {
        let date = new Date(this.inputDate.getValue());
        let day = date.getDate() + 1;
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        return {
            birthMonth: month,
            birthDay: day,
            birthYear: year
        };
    }
};

InputDate.prototype.setValue = function (value) {
    this.inputDate.setValue(value, () => this.setState({
        value: value
    }));
};

InputDate.prototype.empty = function () {
    this.setValue('');
};

InputDate.prototype.focus = function () {
    const element = ReactDOM.findDOMNode(this.inputDate);
    element.focus();
};


// Added by sephora-jsx-loader.js
module.exports = InputDate.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Inputs/InputDate/InputDate.c.js