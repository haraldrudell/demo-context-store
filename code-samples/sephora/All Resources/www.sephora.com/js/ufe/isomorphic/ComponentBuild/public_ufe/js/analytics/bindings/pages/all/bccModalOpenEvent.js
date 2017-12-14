const utils = require('analytics/utils');
const anaConsts = require('analytics/constants');
const deepExtend = require('deep-extend');

module.exports = function (data) {

    let currentEvent = utils.getMostRecentEvent(
        anaConsts.LINK_TRACKING_EVENT
    );

    let attributes = {
        linkName: data.bccComponentName,
        internalCampaign: data.bccComponentName,
        eventStrings: ['event71']
    };

    deepExtend(currentEvent, {
        eventInfo: {
            attributes: attributes
        }
    });
};



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/bindings/pages/all/bccModalOpenEvent.js