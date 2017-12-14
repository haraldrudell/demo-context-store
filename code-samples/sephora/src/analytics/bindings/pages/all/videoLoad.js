var utils = require('analytics/utils');

module.exports = (function () {
    var videoLoadBindings = function (data) {

        var currentEvent = require('analytics/utils').getMostRecentEvent(
            require('analytics/constants').LINK_TRACKING_EVENT
        );

        /* Extend the base event object with these specifics */
        require('deep-extend')(
            currentEvent,
            {
                eventInfo: {
                    attributes: {
                        eVar63: 'D=g',
                        experience: digitalData.page.attributes.experience,
                        pageName: digitalData.page.attributes.sephoraPageInfo.pageName,
                        previousPage: digitalData.page.attributes.previousPageData.pageName,
                        platform: digitalData.page.attributes.platform,
                        videoName: [
                            digitalData.page.attributes.sephoraPageInfo.pageName,
                            data.videoName[0],
                            data.videoName[1]
                        ].join('_'),
                        urlWithoutQuery: window.location.host
                    }
                }
            }
        );

    };

    return videoLoadBindings;
}());



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/bindings/pages/all/videoLoad.js