const Location = require('utils/Location.js');

const pageHasCertona = () => {
    return Location.isBasketPage() ||
           Location.isHomePage() ||
           Location.isProductPage();
};

const shouldServiceRun = {
    certona: function () {
        if (!Sephora.isLegacyMode &&
            pageHasCertona() &&
            Sephora.Certona &&
            Sephora.Certona.isEnabled === 'true') {
            return true;
        } else {
            return false;
        }
    },

    testTarget: function () {
        return Sephora.isThirdPartySite ? false : true;
    }
};

const POST_LOAD_TIMEOUT = 20000 ;

module.exports = {
    shouldServiceRun,
    POST_LOAD_TIMEOUT
};



// WEBPACK FOOTER //
// ./public_ufe/js/utils/Services.js