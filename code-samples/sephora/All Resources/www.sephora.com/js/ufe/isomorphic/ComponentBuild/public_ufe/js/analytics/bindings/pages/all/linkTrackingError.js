const anaUtils = require('analytics/utils');
const anaConsts = require('analytics/constants');

/**
 * Merge the properties set here into the
 * event object that was created earlier.
 * @param  {object} data Event specific data
 */
module.exports = function (data) {

    let previousEventData = anaUtils.getMostRecentEvent(anaConsts.LINK_TRACKING_EVENT);

    var newEventData = { eventInfo: { attributes: {
        eVar63: 'D=g',
        languageLocale: digitalData.page.attributes.languageLocale,

        //This gets reset (or not) earlier, so just pass the current value
        pageName: s.pageName,
        experience: digitalData.page.attributes.experience,
        previousPage: data.previousPage || digitalData.page.attributes.previousPageData.pageName,
        platform: digitalData.page.attributes.platform,
        urlWithoutQuery: window.location.host,
        pageType: anaConsts.SIGN_IN_PAGE_TYPE_DETAIL,
        pageDetail: anaConsts.SIGN_IN_PAGE_TYPE_DETAIL
    } } };
    //Update old data with new
    require('deep-extend')(previousEventData, anaUtils.removeUndefinedItems(newEventData));
};



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/bindings/pages/all/linkTrackingError.js