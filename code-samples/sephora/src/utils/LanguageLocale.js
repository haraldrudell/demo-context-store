// Manage Language and Locale

const COOKIE_UTILS = require('utils/Cookies');
const LOCALE_COOKIE_KEY = 'site_locale';
const LANGUAGE_COOKIE_KEY = 'site_language';
const COUNTRIES = { US: 'US', CA: 'CA' };
const LANGUAGES = { EN: 'EN', FR: 'FR' };
const COUNTRY_LONG_NAMES = {
    US: 'United States',
    CA: 'Canada'
};

const ISO_CURRENCY = {
    US: 'USD',
    CA: 'CAD',
    JP: 'JPY',
    KR: 'KRW',
    NL: 'EUR',
    GB: 'GBP',
    DE: 'EUR',
    NO: 'NOK'
};

module.exports = {
    COUNTRIES,
    COUNTRY_LONG_NAMES,
    ISO_CURRENCY,
    LANGUAGES,

    // return the current country such as "us" or "canada"
    getCurrentCountry: function () {
        return Sephora.renderQueryParams.country.toUpperCase() || COUNTRIES.US;
    },

    setCurrentCountry: function (country) {
        COOKIE_UTILS.write(LOCALE_COOKIE_KEY, country);
    },

    getCurrentLanguage: function () {
        return COOKIE_UTILS.read(LANGUAGE_COOKIE_KEY) || LANGUAGES.EN;
    },

    setCurrentLanguage: function (language) {
        COOKIE_UTILS.write(LANGUAGE_COOKIE_KEY, language);
    },

    isCanada: function () {
        return this.getCurrentCountry().toUpperCase() === COUNTRIES.CA;
    },

    isUS: function () {
        return this.getCurrentCountry().toUpperCase() === COUNTRIES.US;
    },

    flags: {
        US: '/contentimages/country-flags/icon-flag-us.png',
        CA: '/contentimages/country-flags/icon-flag-ca.png'
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/utils/LanguageLocale.js