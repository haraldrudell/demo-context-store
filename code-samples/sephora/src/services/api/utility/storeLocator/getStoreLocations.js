const refetch = require('Refetch');
const restApi = require('RestApi');


/**
 * Retrieve physical store locations based on input geo data.
 * @param storeId
 * @param params object {zipCode, radius, latitude, longitude,  city, state, country}
 * @returns {Promise}
 */
function getStoreLocations(storeId, params = {}) {
    let url = '/api/util/stores';
    let queryParams = [];
    if (storeId) {
        url += '/' + storeId;
    }

    if (params.zipCode) {
        queryParams.push('zipCode=' + params.zipCode);
    }

    if (params.radius) {
        queryParams.push('radius=' + params.radius);
    }

    if (params.latitude && params.longitude) {
        queryParams.push('latitude=' + params.latitude);
        queryParams.push('longitude=' + params.longitude);
    }

    if (params.city && params.state && params.country) {
        queryParams.push('city=' + params.city + '&state=' + params.state +
                            '&country=' + params.country);
    } else if (params.country) {
        queryParams.push('country=' + params.country);
    }

    let apiUrl = url + '?' + queryParams.join('&');
    return refetch.fetch(restApi.getRestLocation(apiUrl), {
        method: 'GET'
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = getStoreLocations;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/utility/storeLocator/getStoreLocations.js