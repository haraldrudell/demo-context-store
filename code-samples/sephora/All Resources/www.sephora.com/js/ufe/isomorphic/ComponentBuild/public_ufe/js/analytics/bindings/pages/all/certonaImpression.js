const utils = require('analytics/utils');
const anaConsts = require('analytics/constants');
const deepExtend = require('deep-extend');

/**
* Return the productIds for the first 5 products in Certona recommendations.
* @param  {Array} products The products to get IDs from
* @return {String}          A pipe delimited string of product IDs
*/
function getFirstFivePIDs(items) {
    let PIDs = [];

    for (let i = 0; i < 5; i++) {
        if (items[i].id) {
            PIDs.push(items[i].id);
        } else {
            i = 5; //Stop the loop
        }
    }

    return PIDs.join('|');
}

function populateExternalRecsObject(items) {
    let externalRecs = window.digitalData.page.attributes.externalRecommendations;

    //Yes, we use these immediately below, but we also need to store them for other things
    externalRecs.audienceId = items[0].certona_audience_id;
    externalRecs.experienceId = items[0].certona_experience_id;
    externalRecs.vendor = 'certona';
    externalRecs.firstFivePIDs = getFirstFivePIDs(items);
}

function getFirstVisibleSetOfItems(schemes) {
    for (let scheme of schemes) {
        //Check for === 'yes' because the string 'no' can be inferred as true
        if (scheme.display === 'yes') {
            if ((scheme.items || []).length) {
                return scheme.items;
            }
        }
    }
}

module.exports = function (data) {

    let currentEvent = utils.getMostRecentEvent(anaConsts.LINK_TRACKING_EVENT);
    let externalRecs = window.digitalData.page.attributes.externalRecommendations;
    let schemes = utils.safelyReadProperty('recs.resonance.schemes', data) || [];
    let firstVisibleSetOfItems = [];

    firstVisibleSetOfItems = getFirstVisibleSetOfItems(schemes);

    if (firstVisibleSetOfItems.length) {
        populateExternalRecsObject(firstVisibleSetOfItems);
    }

    deepExtend(currentEvent, {
        eventInfo: {
            attributes: {
                audienceId: externalRecs.audienceId,
                firstFivePIDs: externalRecs.firstFivePIDs,

                //This gets reset (or not) earlier, so just pass the current value
                pageName: utils.safelyReadProperty('s.pageName'),
                urlWithoutQuery: null,
                linkName: 'certona_impression'
            }
        }
    });

    // This return object is purely for unit testing
    return {
        currentEvent: currentEvent,
        externalRecs: externalRecs
    };
};



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/bindings/pages/all/certonaImpression.js