// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Footer = function () {};

// Added by sephora-jsx-loader.js
Footer.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const watch = require('redux-watch');

Footer.prototype.ctrlr = function () {
    const bannerWatch = watch(store.getState, 'stickyBanner');
    let banner = store.getState().stickyBanner;
    if (banner && banner.height) {
        this.setState({
            marginBottom: banner.height
        });
    }

    store.subscribe(bannerWatch((newState) => {
        this.setState({
            marginBottom: newState.height
        });
    }));
};


// Added by sephora-jsx-loader.js
module.exports = Footer.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Footer/Footer.c.js