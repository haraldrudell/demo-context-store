// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var LeftNav = function () {};

// Added by sephora-jsx-loader.js
LeftNav.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const toggleSearch = require('actions/SearchActions').toggleSearch;
const showHamburgerMenu = require('actions/Actions').showHamburgerMenu;

LeftNav.prototype.ctrlr = function () {};

LeftNav.prototype.handleSearchClick = function () {
    store.dispatch(toggleSearch());
};

LeftNav.prototype.handleMenuClick = function () {
    store.dispatch(showHamburgerMenu(true));
};


// Added by sephora-jsx-loader.js
module.exports = LeftNav.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/LeftNav/LeftNav.c.js