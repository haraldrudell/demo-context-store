const analyticsUtils = require('analytics/utils');

module.exports = {

    addToCartEvent: function (productId) {
        if (analyticsUtils.safelyReadProperty('Sephora.analytics.promises.bluecoreReady')) {
            Sephora.analytics.promises.bluecoreReady.then(function () {
                if (typeof triggermail !== 'undefined') {
                    triggermail.add_to_cart({ id: productId });
                }
            });
        }
    },

    removeFromCartEvent: function (productId) {
        if (analyticsUtils.safelyReadProperty('Sephora.analytics.promises.bluecoreReady')) {
            Sephora.analytics.promises.bluecoreReady.then(function () {
                if (typeof triggermail !== 'undefined') {
                    bluecore.track('remove_from_cart', { id: productId });
                }
            });
        }
    },

    productViewedEvent: function (productId) {
        if (analyticsUtils.safelyReadProperty('Sephora.analytics.promises.bluecoreReady')) {
            Sephora.analytics.promises.bluecoreReady.then(function () {
                if (typeof triggermail !== 'undefined') {
                    triggermail.view({ id: productId }, {partial: true});
                }
            });
        }
    }

};



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/bluecore.js