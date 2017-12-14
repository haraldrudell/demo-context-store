function fetchSuccess(response, options, resolve, url) {
    // jscs:disable maximumLineLength
    let Authentication = require('./Authentication'); // Do not bubble up, it causes circular dependency
    if (options.isRawResponse) {
        resolve(response);
    } else {
        let json = response.json();
        let responseStatus = response.status;
        json.then(jsonResponse => {
            if (response.status === 403) {
                switch (jsonResponse.errorCode) {
                    case 407:
                        Authentication.ssiExpiredSignIn(
                            url,
                            options,
                            resolve,
                            response
                        );
                        return;
                    case 409:
                        Authentication.autoLogin(url, options, resolve, response);
                        return;
                    default:

                        // jscs:disable maximumLineLength
                        if (response.profileStatus !== undefined && response.profileStatus === 0) {

                            // TODO
                            //Authentication.sessionTimeoutAnonymous();
                            let profileStatus = response.profileStatus;
                        } else {
                            Authentication.sessionTimeout(
                                url,
                                options,
                                resolve,
                                response
                            );
                        }

                        return;
                }
            } else if ((response.errorCode || response.errorMessages) &&
                response.showMessages !== false) {

                // TODO: Show Errors
                let errorMessages = response.errorMessages;
            } else if (jsonResponse.errorCode == 409) {
                Authentication.autoLogin(url, options, resolve, response);
                return;
            } else if (jsonResponse.errorCode == 407) {
                Authentication.ssiExpiredSignIn(
                    url,
                    options,
                    resolve,
                    response
                );
                return;
            }

            jsonResponse.responseStatus = responseStatus;
            resolve(jsonResponse);
        });
    }
}

module.exports = {
    /**
     *
     * @param url
     * @param options (can include:
     *  method (if not provided, is set to 'GET)
     *  credentials (if not provided, is set to 'include').
     *  timeout (default 10 seconds)
     *  retries (defaults to 3)
     * @returns {Promise}
     */
    fetch: function (url, options) {
        var retries = 3;
        var timeout = 10000;

        if (typeof options === 'undefined') {
            options = {};
        }

        if (options.retries) {
            retries = options.retries;
        }

        if (options.timeout) {
            timeout = options.timeout;
        }

        if (!options.method) {
            options.method = 'GET';
        }

        if (typeof options.credentials === 'undefined') {
            options.credentials = 'include';
        }

        return new Promise(function (resolve, reject) {
            var wrappedFetch = function (n) {
                fetch(url, options)
                    .then(response => fetchSuccess(response, options, resolve, url))
                    .catch(function (error) {
                        // jscs:disable maximumLineLength
                        if (error instanceof TypeError &&
                            error.message === 'Network request failed') {
                            if (n > 0) {
                                setTimeout(function () {
                                    wrappedFetch(--n);
                                }, timeout);
                            } else {
                                reject(error);
                            }
                        }
                    });
            };

            wrappedFetch(retries);
        });
    },

    /**
     * Helper function for basic response status handling
     * TODO: Actual optimistic UI updating functionality
     * @param response
     * @param {function} success callback
     * @param {function} error callback
     */
    handleResponse: function (response, success, error) {
        if (response.responseStatus === 200) {
            success();
        } else {
            if (error) {
                error();
            }
        }
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/utils/Refetch.js