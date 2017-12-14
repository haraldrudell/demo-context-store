const utils = require('analytics/utils');
const analyticsConsts = require('analytics/constants');
const deepExtend = require('deep-extend');

module.exports = function (data) {

    let currentEvent = utils.getMostRecentEvent(analyticsConsts.LINK_TRACKING_EVENT);

    let existingEventStrings = currentEvent.eventInfo.attributes.eventStrings || [];

    let newEventStrings = [analyticsConsts.Event.EVENT_17, analyticsConsts.Event.EVENT_61];

    if (existingEventStrings.length) {
        newEventStrings = existingEventStrings.concat(newEventStrings);
    }

    deepExtend(currentEvent, {
        eventInfo: {
            attributes: {
                previousPage: 'view samples checkout interstitial larger',
                actionInfo: 'Add Sample To Basket',
                linkName: 'Add Sample To Basket',
                eventStrings: newEventStrings
            }
        }
    });
};



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/bindings/pages/basket/addSampleToBasket.js