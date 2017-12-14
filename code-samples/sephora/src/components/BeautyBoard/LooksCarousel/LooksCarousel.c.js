// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var LooksCarousel = function () {};

// Added by sephora-jsx-loader.js
LooksCarousel.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
LooksCarousel.prototype.ctrlr = function () {
    if (this.props.initialLooks) {
        this.setState({
            looks: this.props.initialLooks
        });
    }
};

LooksCarousel.prototype.getNextLooksPage = function () {
    if (typeof this.props.getNextLooksPage === 'function') {
        this.props.getNextLooksPage()
            .then(newLooks => {
                if (newLooks.length) {
                    this.setState({
                        looks: this.state.looks.concat(newLooks)
                    });
                }
            });
    }
};


// Added by sephora-jsx-loader.js
module.exports = LooksCarousel.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BeautyBoard/LooksCarousel/LooksCarousel.c.js