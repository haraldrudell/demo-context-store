/**
 * This file just includes all the files needed for analytics.
 */

module.exports = (function () {
    // UFE analytics not used for legacy mode
    if (!Sephora.isLegacyMode) {
        //Create Promises
        require('analytics/promises');

        require('analytics/dataLayer/digitalData');

        //These are made globally accessible so they can be used within Signal
        Sephora.analytics.utils = require('analytics/utils');
        Sephora.analytics.config = require('analytics/configurations');
        Sephora.analytics.constants = require('analytics/constants');

        //ProcessEvent globally available for Third Parties
        Sephora.analytics.processEvent = require('analytics/processEvent');

        //Populate this property here to avoid problems with circular references.
        Sephora.analytics.constants.GET_MOST_RECENT_EVENT =
            Sephora.analytics.utils.getMostRecentEvent;

        //Load Legacy files which still set some things that we need
        require('analytics/legacyAnalytics/loadLegacyWebAnalytics');
    }
}());



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/loadAnalytics.js