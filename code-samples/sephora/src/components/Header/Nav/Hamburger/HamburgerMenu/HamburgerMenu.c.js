// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var HamburgerMenu = function () {};

// Added by sephora-jsx-loader.js
HamburgerMenu.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const watch = require('redux-watch');
const showHamburgerMenu = require('Actions').showHamburgerMenu;
const showCountrySwitcherPrompt = require('actions/Actions').showCountrySwitcherPrompt;
const Locale = require('utils/LanguageLocale.js');
const anaUtils = require('analytics/utils');

HamburgerMenu.prototype.ctrlr = function () {
    const hamburgerWatch = watch(store.getState, 'hamburger');
    const currLang = Locale.getCurrentLanguage().toUpperCase();
    const user = store.getState('user');
    const userWatch = watch(store.getState, 'user');

    this.setState({
        isOpen: false,
        openItem: null,
        currLang: currLang,
        user: user.user
    });

    store.subscribe(hamburgerWatch(newVal => {
        this.setState({
            isOpen: newVal.isOpen
        });
    }));

    store.subscribe(userWatch(newVal => {
        this.setState({
            user: newVal
        });
    }));
};

HamburgerMenu.prototype.close = function () {
    store.dispatch(showHamburgerMenu(false));
};

HamburgerMenu.prototype.changeCountry = function () {
    store.dispatch(showCountrySwitcherPrompt(true));
};

HamburgerMenu.prototype.trackOrderClick = function () {

    // Analytics
    anaUtils.setNextPageData({
        navigationInfo: anaUtils.buildNavPath(['toolbar', 'track order'])
    });
};

HamburgerMenu.prototype.trackFindAStoreClick = function () {

    // Analytics
    anaUtils.setNextPageData({
        navigationInfo: anaUtils.buildNavPath(['toolbar', 'find a store'])
    });
};


// Added by sephora-jsx-loader.js
module.exports = HamburgerMenu.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/Hamburger/HamburgerMenu/HamburgerMenu.c.js