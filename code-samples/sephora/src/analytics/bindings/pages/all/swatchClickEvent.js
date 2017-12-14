const quickLookBindings = require('analytics/bindingMethods/pages/all/quickLookBindings');
const utils = require('analytics/utils');
const anaConsts = require('analytics/constants');
const deepExtend = require('deep-extend');

module.exports = function (data) {

    let currentEvent = utils.getMostRecentEvent(anaConsts.LINK_TRACKING_EVENT);

    deepExtend(currentEvent, {
        eventInfo: {
            attributes: {
                actionInfo: data.actionInfo ?
                    'quicklook_' + data.actionInfo : '',
                urlWithoutQuery: null,
                linkName: 'quicklook_' + data.linkName
            }
        }
    });
};



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/bindings/pages/all/swatchClickEvent.js