// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var StarRating = function () {};

// Added by sephora-jsx-loader.js
StarRating.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const ReactDOM = require('react-dom');

StarRating.prototype.ctrlr = function () {
};

StarRating.prototype.starClick = function(starClicked) {
    this.setState({
        rating: starClicked
    }, () => {
        this.props.starClick && this.props.starClick(starClicked);
    });
};

StarRating.prototype.getRating = function() {
    return this.state.rating;
};

StarRating.prototype.validateError = function () {
    let error = this.props.validate ? this.props.validate(this.state.value) : null;

    this.setState({
        error: error
    });

    return error;
};

StarRating.prototype.focus = function () {
    const element = ReactDOM.findDOMNode(this.inputElement);
    element.focus();
};


// Added by sephora-jsx-loader.js
module.exports = StarRating.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/StarRating/StarRating.c.js