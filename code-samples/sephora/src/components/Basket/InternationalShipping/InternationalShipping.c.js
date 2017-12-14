// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var InternationalShipping = function () {};

// Added by sephora-jsx-loader.js
InternationalShipping.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('store/Store');
const showInternationalShippingModal = require('Actions').showInternationalShippingModal;
const showCountrySwitcherModal = require('Actions').showCountrySwitcherModal;
const Locale = require('utils/LanguageLocale.js');
const userUtils = require('utils/User.js');

InternationalShipping.prototype.ctrlr = function () {
    this.setState(userUtils.getShippingCountry());
};

InternationalShipping.prototype.open = function () {
    store.dispatch(showInternationalShippingModal(true));
};

InternationalShipping.prototype.showCountrySwitcherModal = function (country) {
    let switchCountryName = country === Locale.COUNTRIES.US ? 'United States' : 'Canada';

    store.dispatch(
        showCountrySwitcherModal(
            true,
            country,
            Locale.LANGUAGES.EN,
            switchCountryName
        )
    );

};


// Added by sephora-jsx-loader.js
module.exports = InternationalShipping.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/InternationalShipping/InternationalShipping.c.js