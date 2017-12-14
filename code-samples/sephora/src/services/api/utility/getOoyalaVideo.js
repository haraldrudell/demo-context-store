const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Ooyala+Content+API

function getOoyalaVideo(ooyalaVideoId) {
    const url = '/api/util/ooyala?videoId=' + ooyalaVideoId;
    return refetch.fetch(restApi.getRestLocation(url)).
        then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = getOoyalaVideo;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/utility/getOoyalaVideo.js