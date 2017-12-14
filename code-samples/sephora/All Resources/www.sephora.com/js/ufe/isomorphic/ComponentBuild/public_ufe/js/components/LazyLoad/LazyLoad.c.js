// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var LazyLoad = function () {};

// Added by sephora-jsx-loader.js
LazyLoad.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const LazyLoader = require('utils/framework/LazyLoad');

LazyLoad.prototype.ctrlr = function () {
    if (Sephora.isLazyLoadEnabled) {
        LazyLoader.addLazyComponent(this, this.load.bind(this));
    } else {
        this.load(this);
    }
};

LazyLoad.prototype.load = function () {
    this.setState({ component: Sephora.Util.InflatorComps.Comps[this.props.componentClass]() });
};


// Added by sephora-jsx-loader.js
module.exports = LazyLoad.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/LazyLoad/LazyLoad.c.js