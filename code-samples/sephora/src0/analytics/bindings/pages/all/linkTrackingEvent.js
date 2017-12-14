const utils = require('analytics/utils');

module.exports = function (data) {

    if (!data.usePreviousPageName) {
        /* Restore pagename to its original value so that any async page
        ** name is removed, and we are back to the main page's page name.*/
        s.pageName =
            window.digitalData.page.attributes.sephoraPageInfo.pageName;
    }

    var attributes = {
        // Whenever we need to remove an attribute for a specific
        // event in derived events, we'll have to set it to an empty string.

        errorMessages: data.errorMessages,
        eventStrings: data.eventStrings,
        fieldErrors: data.fieldErrors,

        // list1
        filterSelections: data.filterSelections,

        // eVar75
        internalCampaign: Array.isArray(data.internalCampaign) ?
            data.internalCampaign.join(':') : data.internalCampaign,

        // eVar19, all platform: "desktop web", "tablet web", "mobile"
        platform: window.digitalData.page.attributes.platform,

        // eVar20
        photoId: data.photoId,

        // eVar21, platform: "web", "mobile"
        experience: window.digitalData.page.attributes.experience,

        // eVar23
        colorIQ: data.colorIQ,

        // eVar62, language locale
        languageLocale: window.digitalData.page.attributes.languageLocale,

        // D=g is a so called Adobe Dynamic Variable
        eVar63: 'D=g',

        // eVar65, user Input field
        userInput: data.userInput,

        // eVar66, server response
        serverResponse: data.serverResponse,

        // eVar93, page type
        pageType: window.digitalData.page.category.pageType,

        // eVar94, page detail
        pageDetail: window.digitalData.page.pageInfo.pageName,

        // eVar95, page world
        pageWorld: window.digitalData.page.attributes.world || 'n/a',

        // eVar96, page url wo/ query string
        urlWithoutQuery: window.location.href.split('?')[0],

        // eVar97, page name
        pageName: window.digitalData.page.attributes.sephoraPageInfo.pageName,

        // pev2, link name
        linkName: data.linkName,

        // eVar64, previous navigation information
        navigationInfo: data.navigationInfo,

        //prop55
        actionInfo: data.actionInfo || null,

        //Used to differentiate two calls of the same type that happen at the same time
        specificEventName: data.specificEventName
    };

    if (data.sku && data.sku.skuId) {
        attributes.productStrings = utils.buildSingleProductString(data.sku);
    }

    // prop6
    var prevPage = window.digitalData.page.attributes.previousPageData;
    if (prevPage) {
        attributes.previousPage = prevPage.pageName;
    }

    /* All of this data is specific to this event and should therefor be
    ** passed in an event item rather than stored in digitalData. */
    let thisEvent = utils.addNewItemFromSpec('event', {
        eventInfo: {
            eventName: Sephora.analytics.constants.LINK_TRACKING_EVENT,
            type: Sephora.analytics.constants.LINK_TRACKING_EVENT,
            attributes: attributes
        }
    });

    //Turn this into a function later if we need it more often.
    if (!thisEvent.eventInfo.attributes.internalCampaign) {
        s && delete s.eVar75;
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/bindings/pages/all/linkTrackingEvent.js