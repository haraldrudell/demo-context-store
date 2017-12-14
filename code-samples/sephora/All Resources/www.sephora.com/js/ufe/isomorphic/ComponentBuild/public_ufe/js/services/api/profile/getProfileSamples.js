const refetch = require('Refetch');
const restApi = require('RestApi');
const urlUtils = require('utils/Url');

// https://jira.sephora.com/wiki/display/ILLUMINATE/Profile+Samples+List+API

const PROFILE_SAMPLE_SOURCES = {
    BI: 'biReward',
    DMG: 'dmg',
    IN_STORE: 'inStore',
    ONLINE: 'online',
    PLAY: 'play',
    RECENT: 'recent'
};

/**
 * Returns a list of samples from users profile for logged in or recognized users
 * @param {String} profileId - profile Id of user to retrieve samples for
 * @param {Array} sampleSources - any combination of one or more samples sources to be retrieved
 * @oparam {Object} options - can include any of the params listed in the api above
*/

// ignorign jshint because jshint does not have object literal with spread syntax support
/* jshint ignore:start */
function getProfileSamples(profileId, sampleSources, options = {}) {
    let url = `/api/users/profiles/${profileId}/samples`;

    let qsParams = {
        sampleSources: sampleSources.join(','),
        ...options
    };

    url += '?' + urlUtils.makeQueryString(qsParams);

    return refetch.fetch(restApi.getRestLocation(url), { method: 'GET' })
        .then(data => data.errorCode ? Promise.reject(data) : data);
}
/* jshint ignore:end */

function getProfileSamplesByDMG(profileId, options) {
    return getProfileSamples(
        profileId,
        [PROFILE_SAMPLE_SOURCES.DMG],
        options
    ).then(data => data.dmg);
}

//currently not exporting generic getProfileSamples, please change if needed
module.exports = {
    getProfileSamplesByDMG,
    getProfileSamples
};



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/getProfileSamples.js