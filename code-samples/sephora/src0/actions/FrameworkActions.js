let urlUtils = require('utils/Url');

const TYPES = {
    UPDATE_QUERY_PARAMS: 'UPDATE_QUERY_PARAMS'
};

/**
 *
 * Updates queryparams in both the store and the url
 *
 * @param queryParams object of key:[array_of_values]
 * @param isReplaceState
 * @returns {{type: string, queryParams: *}}
 */
let updateQueryParams = function (queryParams, isReplaceState = true) {
    if (JSON.stringify(urlUtils.getParams()) !== JSON.stringify(queryParams)) {
        const params = new Map();

        // TODO 17.7: Update url utils so they all use Map and remove this conversion
        Object.keys(queryParams).forEach(key => {
            params.set(key, queryParams[key]);
        });

        urlUtils.updateURL(urlUtils.buildQuery(params), '', isReplaceState);
    }

    return {
        type: TYPES.UPDATE_QUERY_PARAMS,
        queryParams: queryParams
    };
};

/**
 *
 * Update only a single query param
 *
 * @param queryParam Key for query param
 * @param value Array of values or a single value
 * @param isReplaceState
 * @returns {{type: string, queryParams: *}}
 */
let updateQueryParam = function (queryParam, value, isReplaceState) {
    let queryParams = urlUtils.getParams();
    queryParams[queryParam] = value;

    return updateQueryParams(queryParams, isReplaceState);
};

module.exports = {
    TYPES: TYPES,
    updateQueryParams: updateQueryParams,
    updateQueryParam: updateQueryParam
};



// WEBPACK FOOTER //
// ./public_ufe/js/actions/FrameworkActions.js