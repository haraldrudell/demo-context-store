// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var TopNav = function () {};

// Added by sephora-jsx-loader.js
TopNav.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const updateCategories = require('actions/CategoryActions').updateCategories;
const trackNavClick = require('analytics/bindingMethods/pages/all/navClickBindings').trackNavClick;
const Events = require('utils/framework/Events');

TopNav.prototype.ctrlr = function () {
    Events.onLastLoadEvent(window, [Events.InPageCompsCtrlrsApplied], () => {
        this.setState({
            renderMenus: true
        });
    });
};

TopNav.prototype.resetMenu = function () {
    this.setState({
        categoryFlyout: false,
        currentMenu: null
    });

    this.clearCategories();
};

TopNav.prototype.clearCategories = function () {
    const categories = store.getState().category.categories;
    store.dispatch(updateCategories(categories));
};

TopNav.prototype.toggleFlyout = function (value) {
    this.setState({
        categoryFlyout: value ? value : !this.state.categoryFlyout
    });
};

TopNav.prototype.setMenu = function (e, index) {
    let value = index === this.state.currentMenu ? null : index;

    this.setState({
        currentMenu: value
    });

    if (e) {
        e.stopPropagation();
    }
};

TopNav.prototype.trackNavClick = trackNavClick;


// Added by sephora-jsx-loader.js
module.exports = TopNav.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/TopNav/TopNav.c.js