const apiUtils = require('utils/Api');
const userUtils = require('utils/User');
const cacheConcern = require('services/api/cache');
const olapicApi = require('./Olapic');
const refetch = require('Refetch');
const restApi = require('RestApi');
const communityUtils = require('utils/Community');


let temporaryLovesStore = (function () {
    // Because just loved/unloved media are not reflected immediately in
    // API responses of related calls (due to known API limitations),
    // to count those media in we need to remember them for a discussed
    // period (one hour) while they become reflected.

    let storage = window.sessionStorage;
    let ONE_HOUR_MS = 60 * 60 * 1000;
    let LOVED_KEY_PREFIX_CHAR = 'L';
    let UNLOVED_KEY_PREFIX_CHAR = 'U';

    function getNow() {
        return new Date().getTime();
    }

    function isLovedKey(key) {
        return key[0] === LOVED_KEY_PREFIX_CHAR;
    }

    function isUnlovedKey(key) {
        return key[0] === UNLOVED_KEY_PREFIX_CHAR;
    }

    function isRelatedKey(key) {
        return isLovedKey(key) || isUnlovedKey(key);
    }

    function getAllRelatedKeys() {
        let keys = [];
        for (let i = 0, l = storage.length; i < l; i++) {
            let key = storage.key(i);
            if (isRelatedKey(key)) {
                keys.push(key);
            }
        }
        return keys;
    }

    function makeLovedKeyForTimestamp(timestamp) {
        return LOVED_KEY_PREFIX_CHAR + timestamp;
    }

    function makeUnlovedKeyForTimestamp(timestamp) {
        return UNLOVED_KEY_PREFIX_CHAR + timestamp;
    }

    function getTimestampFromKey(key) {
        return key.substr(1);
    }

    function getActualKeys() {
        let nowTimestampMs = getNow();
        let tresholdTimestampMs = nowTimestampMs - ONE_HOUR_MS;
        let allKeys = getAllRelatedKeys();
        return allKeys.filter(function (key) {
            let keyTimestampMs = getTimestampFromKey(key);
            return keyTimestampMs > tresholdTimestampMs;
        });
    }

    function getActualLovedKeys() {
        return getActualKeys().filter(isLovedKey);
    }

    function getActualUnlovedKeys() {
        return getActualKeys().filter(isUnlovedKey);
    }

    function findLovedKeyForMediumId(mediumId) {
        return getActualLovedKeys().find(function (key) {
            let storedValue = storage.getItem(key);
            return storedValue === mediumId.toString();
        });
    }

    function findUnlovedKeyForMediumId(mediumId) {
        return getActualUnlovedKeys().find(function (key) {
            let storedValue = storage.getItem(key);
            return storedValue === mediumId.toString();
        });
    }

    function getInactualKeys() {
        let nowTimestampMs = getNow();
        let tresholdTimestampMs = nowTimestampMs - ONE_HOUR_MS;
        let allKeys = getAllRelatedKeys();
        return allKeys.filter(function (key) {
            let keyTimestampMs = getTimestampFromKey(key);
            return keyTimestampMs <= tresholdTimestampMs;
        });
    }

    return {
        getRecentlyLovedMediaIds: function () {
            return getActualLovedKeys().map(function (key) {
                return storage.getItem(key);
            });
        },

        getRecentlyUnlovedMediaIds: function () {
            return getActualUnlovedKeys().map(function (key) {
                return storage.getItem(key);
            });
        },

        purgeInactualRecords: function () {
            getInactualKeys().forEach(function (key) {
                storage.removeItem(key);
            });
        },

        // Actual here means "not yet reflected in API response".
        getStillActualLovedMediaIds: function () {
            return getActualLovedKeys().map(function (key) {
                return parseInt(storage.getItem(key), 10);
            });
        },

        rememberLovedMedium: function (mediumId) {
            let nowTimestampMs = getNow();
            let key = makeLovedKeyForTimestamp(nowTimestampMs);
            storage.setItem(key, mediumId);
        },

        rememberUnlovedMedium: function (mediumId) {
            let nowTimestampMs = getNow();
            let key = makeUnlovedKeyForTimestamp(nowTimestampMs);
            storage.setItem(key, mediumId);
        },

        purgeLovedMediumRecord: function (mediumId) {
            let key = findLovedKeyForMediumId(mediumId);
            storage.removeItem(key);
        },

        purgeUnlovedMediumRecord: function (mediumId) {
            let key = findUnlovedKeyForMediumId(mediumId);
            storage.removeItem(key);
        }
    };
})();

let displayingLovesConcern = (function () {

    function decorateLoveMediumMethod(loveMediumMethod) {
        return function (mediumId) {
            return loveMediumMethod.apply(null, arguments).
                then(() => {
                    temporaryLovesStore.purgeUnlovedMediumRecord(mediumId);
                    temporaryLovesStore.rememberLovedMedium(mediumId);
                    cacheConcern.clearCache('bbUserLoves');
                });
        };
    }

    function decorateUnloveMediumMethod(unloveMediumMethod) {
        return function (mediumId) {
            return unloveMediumMethod.apply(null, arguments).
                then(() => {
                    temporaryLovesStore.rememberUnlovedMedium(mediumId);
                    temporaryLovesStore.purgeLovedMediumRecord(mediumId);
                    cacheConcern.clearCache('bbUserLoves');
                });
        };
    }

    function decorateGetLovedMediaDataMethod(getLovedMediaDataMethod) {
        return function (publicId, mediaIds) {
            return getLovedMediaDataMethod.apply(null, arguments).
                then(data => {
                    let lovesCountsMap = Object.assign({}, data.lovesCountsMap);

                    let recentlyUnlovedMediaIds = temporaryLovesStore.
                            getRecentlyUnlovedMediaIds();
                    let recentlyLovedMediaIds = temporaryLovesStore.
                            getRecentlyLovedMediaIds();

                    /* eslint-disable guard-for-in */
                    for (let mediumId in lovesCountsMap) {
                        let numLoves = lovesCountsMap[mediumId];
                        let wasRecentlyUnloved = recentlyUnlovedMediaIds.
                                indexOf(mediumId) >= 0;
                        let wasRecentlyLoved = recentlyLovedMediaIds.
                                indexOf(mediumId) >= 0;
                        let isLovedByUser = data.lovedByUser.
                                indexOf(mediumId) >= 0;

                        // In practice, (isLovedByUser && numLoves
                        // === 0) is enough, but this is worth to be double
                        // checked.
                        if ((wasRecentlyLoved || isLovedByUser) &&
                                numLoves === 0) {
                            lovesCountsMap[mediumId] = 1;
                        } else if (wasRecentlyUnloved && numLoves === 1) {
                            lovesCountsMap[mediumId] = 0;
                        }
                    }

                    return {
                        lovesCountsMap,
                        lovedByUser: data.lovedByUser
                    };
                });
        };
    }

    function decorateGetUserLovedMediaIdsMethod(getUserLovedMediaIdsMethod) {
        return function (publicId, mediaIds, offset, limit) {
            temporaryLovesStore.purgeInactualRecords();
            return getUserLovedMediaIdsMethod.apply(null, arguments);
        };
    }

    return {
        decorateLoveMediumMethod,
        decorateUnloveMediumMethod,
        decorateGetLovedMediaDataMethod,
        decorateGetUserLovedMediaIdsMethod
    };
})();


let _getUserLovedMediaIds = function (publicId, mediaIds, offset, limit) {
    let url = '/api/gallery/profiles/' + publicId + '/likes';
    let method = 'GET';
    let qsParams = {};

    if (mediaIds) {
        qsParams.ids = mediaIds.join(',');
    }

    if (limit) {
        qsParams.offset = offset || 0;
        qsParams.limit = limit;
    }

    return apiUtils.request({ url, method, qsParams }).
        then(response => response.json()).
        then(data =>
                data && data.assets ? data.assets.map(one => one.assetId): []);
};

let _getUserRawLovedMedia = function (
        publicId, offset = 0, limit = olapicApi.DEFAULT_MEDIA_PAGE_SIZE
    ) {
    let url = '/api/gallery/profiles/' + publicId + '/likes';
    let method = 'GET';
    let params = {};
    let qsParams = {};

    if (limit) {
        qsParams.offset = offset || 0;
        qsParams.limit = limit;
    }

    return apiUtils.request({ url, method, qsParams, params }).
        then(response => response.json());
};

_getUserLovedMediaIds =
    displayingLovesConcern.decorateGetUserLovedMediaIdsMethod(_getUserLovedMediaIds);


let _getLovesCountsMapForSpecificMedia = function (mediaIds) {
    let url = '/api/gallery/likes';
    let qsParams = { ids: mediaIds.join(',') };
    let method = 'GET';

    return apiUtils.request({ method, url, qsParams }).
        then(response => response.json()).
        then(data => {
            let lovesCountsMap = {};

            for (let asset of data.assets) {
                lovesCountsMap[asset.assetId] = asset.lovesCount;
            }

            for (let mediaId of mediaIds) {
                if (!(mediaId in lovesCountsMap)) {
                    lovesCountsMap[mediaId] = 0;
                }
            }

            return lovesCountsMap;
        }).catch(reason => {
            let result;
            if (reason.errorCode === 404) {
                result = {};
            }
            return result;
        });
};

let getLovedMediaData = function (publicId, mediaIds) {
    let getLovesCountsMap = _getLovesCountsMapForSpecificMedia(mediaIds);
    let getUserLoves = _getUserLovedMediaIds(publicId, mediaIds);
    return Promise.all([getLovesCountsMap, getUserLoves]).then(values => {
        return {
            lovesCountsMap: values[0],
            lovedByUser: values[1]
        };
    });
};

getLovedMediaData =
    displayingLovesConcern.decorateGetLovedMediaDataMethod(getLovedMediaData);


function getUsersLovedMedia(publicId,
            pageNumber = 1, numPerPage = olapicApi.DEFAULT_MEDIA_PAGE_SIZE) {

    let offset = (pageNumber - 1) * numPerPage;

    return _getUserLovedMediaIds(publicId, null, offset, numPerPage).
        then(lovedMediaIds => olapicApi.getOlapicMediaByIds(lovedMediaIds));
}

function getLovedPhotosNum(publicId) {
    return _getUserRawLovedMedia(publicId).
        then(data => parseInt(data.totalNumber)).
        catch(() => 0);
}

let validateSocialUser = function() {
    return communityUtils.ensureUserIsReadyForSocialAction(
        communityUtils.PROVIDER_TYPES.olapic);
};

let decorateToEnsureSocialAction = function (decoratedMethod) {
    return function (...args) {
        return validateSocialUser().
            then(() => decoratedMethod.apply(null, args));
    };
};


let _loveMediumRequest = function(mediumId) {
    let url = '/api/gallery/profiles/likes';
    let params = { assetId: mediumId };
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'POST',
        body: JSON.stringify(params)
    });
};


let loveMedium = decorateToEnsureSocialAction(_loveMediumRequest);
loveMedium = displayingLovesConcern.decorateLoveMediumMethod(loveMedium);


let _unloveMediumRequest = function (publicId, mediumId) {
    let url = `/api/gallery/profiles/${publicId}/likes/${mediumId}`;
    return refetch.fetch(restApi.getRestLocation(url), { method: 'DELETE' });
};

let unloveMedium = function (mediumId) {
    return userUtils.getUser().
        then(user => user.publicId).
        then(userPublicId => _unloveMediumRequest(userPublicId, mediumId));
};

unloveMedium = decorateToEnsureSocialAction(unloveMedium);
unloveMedium = displayingLovesConcern.decorateUnloveMediumMethod(unloveMedium);


module.exports = {
    getUsersLovedMedia,
    getLovedMediaData,
    loveMedium,
    unloveMedium,
    getLovedPhotosNum,
    validateSocialUser
};



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/thirdparty/OlapicLoves.js