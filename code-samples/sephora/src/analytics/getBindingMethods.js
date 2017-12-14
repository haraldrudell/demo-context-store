module.exports = (function () {
    /**
    * Determine which binding methods we need.
    * @param  {string} pageType  The current page type
    * @param  {string} eventName The name of this event
    * @return {array}  data Additional data to help determine which bindings to use
    */
    var getBindingMethods = function (pageType, eventName, data = {}) {

        var methodsToCallOnEvent = [];
        const anaConsts = require('analytics/constants');

        pageType = (pageType || '').toLowerCase();

        /* Add binding methods that happen on any page load. Any undesired result
        ** from this can be overwritten by more specific bindings. */
        switch (eventName) {
            case anaConsts.PAGE_LOAD:
                methodsToCallOnEvent.push(require('analytics/bindings/pages/all/pageLoadEvent'));
                break;
            case anaConsts.ASYNC_PAGE_LOAD:
                methodsToCallOnEvent.push(
                    require('analytics/bindings/pages/all/asyncPageLoadEvent')
                );
                break;

            case anaConsts.LINK_TRACKING_EVENT:
                methodsToCallOnEvent.push(
                    require('analytics/bindings/pages/all/linkTrackingEvent')
                );
                break;
            default:
                break;
        }

        //Add any binding methods that were passed in
        if (data.bindingMethods) {
            methodsToCallOnEvent = methodsToCallOnEvent.concat(data.bindingMethods);
        }

        //Add page specific PAGE LOAD bindings and promises
        if (eventName === anaConsts.PAGE_LOAD) {
            if (pageType === 'basket/basketpage' || pageType === 'basket') {
                methodsToCallOnEvent.push(
                    require('analytics/bindings/pages/basket/basketPageLoad')
                );
            } else if (pageType === 'product/productpage' || pageType === 'product') {
                methodsToCallOnEvent.push(
                    require('analytics/bindings/pages/product/productPageLoad')
                );
            } else if (pageType === 'reviews' || pageType === 'product/productreviewspage') {
                methodsToCallOnEvent.push(Sephora.analytics.promises.productDataReady);
            }
        }

        return methodsToCallOnEvent;
    };

    return getBindingMethods;

}());




// WEBPACK FOOTER //
// ./public_ufe/js/analytics/getBindingMethods.js