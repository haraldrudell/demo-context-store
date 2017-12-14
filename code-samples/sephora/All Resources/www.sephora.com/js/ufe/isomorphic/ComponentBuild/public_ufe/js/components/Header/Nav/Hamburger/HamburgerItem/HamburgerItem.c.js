// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var HamburgerItem = function () {};

// Added by sephora-jsx-loader.js
HamburgerItem.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('store/Store');
const watch = require('redux-watch');

HamburgerItem.prototype.ctrlr = function () {
    const hamburgerWatch = watch(store.getState, 'hamburger');
    store.subscribe(hamburgerWatch((newVal, oldVal, objectPath) => {

        // Clears all layered sub-menus when main menu is closed.
        if (!newVal.isOpen) {
            this.setState({
                isOpen: false
            });
        } else {
            return;
        }
    }));
};

HamburgerItem.prototype.toggleSubmenu = function (val, callback) {
    const scrollContainer = document.querySelector('#HamburgerMenuScrollContainer');
    this.setState({
        isOpen: val
    }, () => {
        if (scrollContainer) {
            // Scroll inner container back to top when menu changes
            scrollContainer.scrollTop = 0;
        }
    });

    if (callback) {
        callback();
    }
};


// Added by sephora-jsx-loader.js
module.exports = HamburgerItem.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/Hamburger/HamburgerItem/HamburgerItem.c.js