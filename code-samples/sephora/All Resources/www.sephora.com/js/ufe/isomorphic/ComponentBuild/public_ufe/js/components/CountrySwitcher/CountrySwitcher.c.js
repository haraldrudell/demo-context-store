// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var CountrySwitcher = function () {};

// Added by sephora-jsx-loader.js
CountrySwitcher.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('store/Store');
const Locale = require('utils/LanguageLocale.js');
const showCountrySwitcherModal = require('Actions').showCountrySwitcherModal;
const switchCountry = require('actions/UserActions').switchCountry;
const anaUtils = require('analytics/utils');
const LOCAL_STORAGE_CATNAV = require('utils/localStorage/Constants').CATNAV;

CountrySwitcher.prototype.ctrlr = function () {
    let currCtry = Locale.getCurrentCountry().toUpperCase();
    let currLang = Locale.getCurrentLanguage().toUpperCase();
    let flagSrc = '';
    let countryText = '';
    if (currCtry == Locale.COUNTRIES.US) {
        flagSrc = this.usImg;
        countryText = 'US';
    } else if (currCtry == Locale.COUNTRIES.CA) {
        flagSrc = this.canImg;
        countryText = (currLang == Locale.LANGUAGES.EN) ? 'ENG' : 'FR';
    }

    this.setState({
        currCtry: currCtry || Locale.COUNTRIES.US,
        currLang: currLang || Locale.LANGUAGES.EN,
        flagSrc: flagSrc,
        countryText: countryText
    });
};

CountrySwitcher.prototype.open = function (ctry, lang) {
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

CountrySwitcher.prototype.switchCountry = function (ctry, lang) {
    store.dispatch(switchCountry(ctry, lang));
};


// Added by sephora-jsx-loader.js
module.exports = CountrySwitcher.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/CountrySwitcher/CountrySwitcher.c.js