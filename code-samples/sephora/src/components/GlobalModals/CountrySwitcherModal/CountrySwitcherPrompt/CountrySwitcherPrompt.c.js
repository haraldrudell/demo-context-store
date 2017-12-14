// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var CountrySwitcherPrompt = function () {};

// Added by sephora-jsx-loader.js
CountrySwitcherPrompt.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('store/Store');
const showCountrySwitcherPrompt = require('actions/Actions').showCountrySwitcherPrompt;
const showCountrySwitcherModal = require('actions/Actions').showCountrySwitcherModal;
const Locale = require('utils/LanguageLocale.js');
const switchCountry = require('actions/UserActions').switchCountry;

CountrySwitcherPrompt.prototype.ctrlr = function () {
    let currCtry = Locale.getCurrentCountry().toUpperCase();
    let currLang = Locale.getCurrentLanguage().toUpperCase();

    this.setState({
        currCtry: currCtry,
        currLang: currLang
    });
};

CountrySwitcherPrompt.prototype.closeCountryModal = function () {
    store.dispatch(showCountrySwitcherPrompt(false));
};

CountrySwitcherPrompt.prototype.switchCountry = function (ctry, lang) {
    store.dispatch(switchCountry(ctry, lang));
};

CountrySwitcherPrompt.prototype.open = function (ctry, lang) {
    let desiredCountry = ctry === Locale.COUNTRIES.US ? Locale.COUNTRIES.US : Locale.COUNTRIES.CA;
    let desiredLang = lang === Locale.LANGUAGES.FR ? Locale.LANGUAGES.FR : Locale.LANGUAGES.EN;
    let switchCountryName = ctry === Locale.COUNTRIES.US ? 'United States' : 'Canada';

    store.dispatch(
        showCountrySwitcherModal(
            true,
            desiredCountry,
            desiredLang,
            switchCountryName
        )
    );
};


// Added by sephora-jsx-loader.js
module.exports = CountrySwitcherPrompt.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/CountrySwitcherModal/CountrySwitcherPrompt/CountrySwitcherPrompt.c.js