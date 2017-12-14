/**
 * Purpose: Handles things that need to happen after a particular event has occured.
 */

const anaConsts = require('analytics/constants');

module.exports = function (eventName) {

    switch (eventName) {
        case anaConsts.PAGE_LOAD:

            //ILLUPH-82807 - Fire "[PIXEL] DoubleClick Global Footer" 3 seconds after pageLoadEvent
            window.setTimeout(function () {
                Sephora.analytics.utils.fireEventForTagManager(anaConsts.DOUBLE_CLICK_FOOTER);
            }, 3000);

            if (digitalData.page.category.pageType === 'product') {
                Sephora.analytics.utils.fireEventForTagManager(anaConsts.PRODUCT_PAGE_LOAD);
                Sephora.analytics.utils.fireEventForTagManager(anaConsts.DOUBLE_CLICK_PRODUCT_PAGE);
            }

            break;

        default:

            //Do nothing
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/postProcessEvent.js