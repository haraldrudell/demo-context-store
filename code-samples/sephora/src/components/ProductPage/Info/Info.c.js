// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Info = function () {};

// Added by sephora-jsx-loader.js
Info.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const INTERNATIONAL_SHIPPHING_MEDIA_ID = 20600018;
const US_SHIPPING_TERMS_MEDIA_ID = 12300026;
const CA_SHIPPING_TERMS_MEDIA_ID = 12300050;
const FLASH_SHIPPING_TERMS_MEDIA_ID = 18100078;
const store = require('Store');
const showTermsConditions = require('actions/TermsAndConditionsActions').showModal;
const Locale = require('utils/LanguageLocale');
const UserUtils = require('utils/User');
const tcTitle = 'Shipping & Handling Information';

Info.prototype.ctrlr = function () {
    this.setState({
        isUS: Locale.isUS()
    });
};

Info.prototype.showShippingTerms = function () {
    let isFlashUser = false;
    let shippingMediaId;

    store.setAndWatch('user', null, () => {
        isFlashUser = UserUtils.isFlash();
    });

    shippingMediaId = Locale.isCanada() ?
            CA_SHIPPING_TERMS_MEDIA_ID
        : isFlashUser ? FLASH_SHIPPING_TERMS_MEDIA_ID : US_SHIPPING_TERMS_MEDIA_ID;

    store.dispatch(showTermsConditions(true, shippingMediaId, tcTitle));
};

Info.prototype.showInternationalShippingTerms = function () {
    store.dispatch(showTermsConditions(true, INTERNATIONAL_SHIPPHING_MEDIA_ID, tcTitle));
};

Info.prototype.toggleTabs = function (value) {
    this.setState({
        expandedTab: value === this.state.expandedTab ?
            Sephora.isMobile() ? null : value : value
    });
};


// Added by sephora-jsx-loader.js
module.exports = Info.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/Info/Info.c.js