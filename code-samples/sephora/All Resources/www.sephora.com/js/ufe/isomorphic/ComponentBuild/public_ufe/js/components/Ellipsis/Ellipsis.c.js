// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Ellipsis = function () {};

// Added by sephora-jsx-loader.js
Ellipsis.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const { fontSizes, lineHeights } = require('style');
const ReactDOM = require('react-dom');

Ellipsis.prototype.ctrlr = function () {
    const element = ReactDOM.findDOMNode(this);
    const {
        lineHeight = lineHeights[3],
        fontSize = fontSizes.BASE,
        numberOfLines
    } = this.props;

    const height = lineHeight * fontSize * numberOfLines;

    if (element.scrollHeight > height) {
        this.setState({
            showEllipsis: true,
            height: height
        });
    }
};

Ellipsis.prototype.toggle = function () {
    this.setState({
        showEllipsis: !this.state.showEllipsis,
        height: this.props.isFixedHeight ? 'auto' : 'none'
    });
};


// Added by sephora-jsx-loader.js
module.exports = Ellipsis.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Ellipsis/Ellipsis.c.js