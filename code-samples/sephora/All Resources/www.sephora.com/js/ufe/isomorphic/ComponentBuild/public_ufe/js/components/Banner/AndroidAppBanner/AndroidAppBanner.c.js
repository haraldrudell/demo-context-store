// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var AndroidAppBanner = function () {};

// Added by sephora-jsx-loader.js
AndroidAppBanner.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const watch = require('redux-watch');
const urlUtils = require('utils/Url');
const cookieUtils = require('utils/Cookies');
const showBanner = require('actions/Actions').showStickyBanner;
const ReactDOM = require('react-dom');
const Location = require('utils/Location');
const APP_BANNER_COOKIE = 'appb';
const APP_BANNER_COOKIE_EXP_DAYS = 14;

AndroidAppBanner.prototype.componentDidUpdate = function () {
    const element = ReactDOM.findDOMNode(this);
    store.dispatch(showBanner(this.state.isOpen, element.clientHeight));
};

AndroidAppBanner.prototype.ctrlr = function () {
    this.setState({
        isOpen: this.shouldSeeBanner()
    });

    const searchWatch = watch(store.getState, 'search');
    store.subscribe(searchWatch((newState) => {
        this.setState({
            isOpen: !newState.focus && this.shouldSeeBanner()
        });
    }));
};

AndroidAppBanner.prototype.closeBanner = function () {
    cookieUtils.write(APP_BANNER_COOKIE, 'disabled', APP_BANNER_COOKIE_EXP_DAYS);
    this.setState({
        isOpen: false
    });
};

AndroidAppBanner.prototype.shouldSeeBanner = function () {

    if (navigator.userAgent.match(/Sephora\-androidApp/i)) {

        // Android native app
        return false;
    }else if (navigator.userAgent.match(/Android/i) && !Location.isBasketPage()) {

        // Android browser
        //TODO: Hide banner for Checkout and Order Confirmation page when they're available on UFE
        return !cookieUtils.read(APP_BANNER_COOKIE);
    } else {
        return false;
    }
};


// Added by sephora-jsx-loader.js
module.exports = AndroidAppBanner.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Banner/AndroidAppBanner/AndroidAppBanner.c.js