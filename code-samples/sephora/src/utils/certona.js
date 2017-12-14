const loadScripts = require('utils/LoadScripts');
const Locale = require('utils/LanguageLocale.js');
const Perf = require('utils/framework/Perf');

let CERTONA_DATA_AT_VALUES = {
    addToBasket: 'add_to_basket',
    addToBasketRecs: 'add_to_basket_recs',
    qlAddToBasket: 'add_to_basket_ql',
    qlAddToBasketRecs: 'add_to_basket_recs_ql',
    qlLoves: 'add_to_loves_ql',
    qlButton: 'ql'
};

const injectCertona = function (envPrefix) {

    let topLevelDom = Locale.getCurrentCountry().toUpperCase() === 'US' ||
        Sephora.isMobile() ? 'com' : 'ca';
    let script = '//edge1.certona.net/cd/1e15a405/' +
        (envPrefix ? envPrefix : Sephora.isMobile() ? 'm.' : '') +
        'sephora.' + topLevelDom + '/scripts/resonance.js';

    loadScripts([script], () => {
        Sephora.Util.InflatorComps.services.loadEvents.CertonaLoaded = true;
        Perf.report('Certona loaded');
    });
};

const getApplicationId = function () {
    let appId;

    if (Locale.getCurrentCountry().toUpperCase() === 'US') {
        appId = Sephora.isDesktop() ? 'Sephora01' : 'Sephora03';
    } else {
        appId = Sephora.isDesktop() ? 'Sephora02' : 'Sephora04';
    }

    return appId;
};

module.exports = {
    CERTONA_DATA_AT_VALUES,
    injectCertona,
    getApplicationId
};



// WEBPACK FOOTER //
// ./public_ufe/js/utils/certona.js