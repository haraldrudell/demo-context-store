module.exports = (function () {
    var asyncPageLoadBindings = function (data) {

        /* All of this data is specific to this event and should therefor be
        ** passed in an event item rather than stored in digitalData. */
        Sephora.analytics.utils.addNewItemFromSpec('event', {
            eventInfo: {
                eventName: require('analytics/constants').ASYNC_PAGE_LOAD,
                attributes: {
                    eventStrings: data.eventStrings,
                    pageDetail: data.pageDetail,
                    pageName: data.pageName,
                    pageType: data.pageType,
                    productStrings: data.productStrings,
                    navigationInfo: data.navigationInfo,
                    linkData: data.linkData,
                    world: data.world
                }
            }
        });

    };

    return asyncPageLoadBindings;
}());



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/bindings/pages/all/asyncPageLoadEvent.js