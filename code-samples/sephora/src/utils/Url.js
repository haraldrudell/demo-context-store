/* eslint consistent-return: [0] */

const Location = require('utils/Location');

const absolutePathRegExp = /^https?:\/\/|^\/\//i;
const protocolRegExp = /^https?:/i;
const localHostedPrefixRegExp = /^\/img\//i;
const captchaRegExp = /^\/challenge.png/i;

function isAbsoluteUrl(url) {
    return absolutePathRegExp.test(url);
}

function isImageHostedBySelf(url) {
    return localHostedPrefixRegExp.test(url) || captchaRegExp.test(url);
}

/**
 * Returns an object containing all params as queryParamKey:[array of values]
 */
function getParams(urlSearch = Location.getLocation().search) {
    let params = {};

    //Not a global since regexp with 'g' flag will have state
    let queryParamRegexp = /([^?&]+)=([^&]*)/g;

    let result;
    while (!!(result = queryParamRegexp.exec(urlSearch))) {
        let key = result[1];
        let value = result[2];

        let existingValue = params[key];

        if (existingValue) {
            existingValue.push(decodeURIComponent(value));
            params[key] = existingValue;
        } else {
            params[key] = [decodeURIComponent(value)];
        }
    }

    return params;
}

var urlUtils = {
    getParams: getParams,

    /**
     * Add a parameter to an existing URL after any existing parameters
     * but before a hash tag if one exists.
     * @param {string} url        The url to add to
     * @param {string} paramToAdd The parameter to add
     * @return {string} The original url with the new param added to it
     */
    addParam: function (url, paramName, value) {

        if (typeof url !== 'string') {
            return url;
        }

        var parts = url.split('#');
        var delimiter;
        var paramToAdd = paramName + '=' + (value || '').toLowerCase();

        if (parts.length < 3) {
            delimiter = (parts[0].indexOf('?') !== -1) ? '&' : '?';

            url = parts[0] + delimiter + paramToAdd + (parts[1] ? '#' + parts[1] : '');
        }

        return url;
    },

    addInternalTracking: function (url, values) {
        values = values || [];

        if (!values.length) {
            return url;
        }

        return this.addParam(url, 'icid2', values.join(':'));
    },

    /**
     * Builds a query string out of a Map. If multiple values are included
     * for the same param, then they should be separate items in the array.
     *
     * @param {map} queryParams - Map with query params
     * @returns {string} - query string
     */
    buildQuery: function (queryParams) {
        let index = 0;
        let queryString = [];

        if (queryParams) {
            queryString.push('?');
            queryParams.forEach((value, key) => {
                if (index > 0) {
                    queryString.push('&');
                }

                if (Array.isArray(value)) {
                    value.forEach((paramValue, paramIndex) => {
                        if (paramIndex > 0) {
                            queryString.push('&');
                        }

                        queryString.push(key + '=' + paramValue);
                    });
                } else {
                    queryString.push(key + '=' + value);
                }

                index++;
            });
        }

        return queryString.join('');
    },

    getLink: function (link) {
        if (Sephora.isThirdPartySite && typeof link !== 'undefined' &&
            link !== null && link.indexOf('http') < 0) {
            // TODO: replace domain strings with variables.
            if (global.process && global.process.env &&
                global.process.env.UFE_ENV) {
                if (global.process.env.UFE_ENV === 'QA') {
                    return '//qa.sephora.com' + link;
                } else {
                    return '//www.sephora.com' + link;
                }
            }
        } else {
            return link;
        }
    },

    getParamValueAsSingleString: (name, url = null) => {
        let valueAsArray = urlUtils.getParamsByName(name, url);

        return (valueAsArray || []).join();
    },

    getParamsByName: function (name, url = Location.getLocation().search) {
        return getParams(url)[name];
    },

    /**
     * Update the queryparams in the store and also updates the actual browser url if the url params
     * don't match.  Browser location changes default to replaceState
     * @param queryString Should include leading ?
     * @param hash Should include leading #
     * @param isReplaceState
     */
    updateURL: function (queryString, hash, isReplaceState = true) {
        let url = window.location.origin + window.location.pathname;

        url = url + (queryString || '') + (hash || '');

        if (window.history) {
            if (isReplaceState) {
                window.history.replaceState({}, null, url);
            } else {
                window.history.pushState({}, null, url);
            }
        }
    },

    isAbsoluteUrl: function (url) {
        return !!url && (url.indexOf('http://') === 0 || url.indexOf('https://') === 0);
    },

    isDataUrl: function (url) {
        return !!url && (url.indexOf('data:') === 0);
    },

    getImagePath: function (url) {
        return this.isAbsoluteUrl(url) || this.isDataUrl(url) ? url :
            (Sephora.configurationSettings.imgFixURL || '') +
            (urlUtils.getLink(url) || '').replace(protocolRegExp, '');
    },

    /**
     * Function is created to be able to mock this call for unit-tests,
     * otherwise your tests will fail with attempt of reload the page
    */
    redirectTo: function (url) {
        window.location = url;
    },

    /**
     * Converts an object into a query parameters string
     * @param  {Object} params - The object to be converted to a query string
     * @return {String} - The query string
     */
    makeQueryString: function(params) {
        let pairs = [];

        for (let key in params) {
            if (params.hasOwnProperty(key)) {
                let value = params[key];

                if (Array.isArray(value)) {
                    value.forEach((subValue) => {
                        pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(subValue));
                    });
                } else if (value !== undefined) {
                    pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
                }
            }
        }

        return pairs.join('&');
    }
};

module.exports = urlUtils;



// WEBPACK FOOTER //
// ./public_ufe/js/utils/Url.js