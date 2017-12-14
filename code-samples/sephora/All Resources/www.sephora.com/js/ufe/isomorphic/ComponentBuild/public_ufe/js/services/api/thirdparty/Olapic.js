/* eslint-disable camelcase */ // The Olapic API requests do have underscored params.
const apiUtil = require('utils/Api');
const biUtils = require('utils/BiProfile');
const cacheConcern = require('services/api/cache');

const OLAPIC_API_HOST = Sephora.configurationSettings.olapicApi.host;
const OLAPIC_AUTH_TOKEN = Sephora.configurationSettings.olapicApi.token;
const OLAPIC_CUSTOMER_ID = Sephora.configurationSettings.olapicApi.customerId;
const OLAPIC_API_VERSION = Sephora.configurationSettings.olapicApi.version;
const DEFAULT_MEDIA_PAGE_SIZE = 20;
const IS_OLAPIC_ENABLED = Sephora.configurationSettings.isOlapicBeautyBoardEnabled;
const COMMUNITY_SITE_HOST = Sephora.configurationSettings.communitySiteHost;

const OlapicApiRequestFailureReason = {
    HTTP_NOT_FOUND: 'http-not-found',
    UNKNOWN: 'unknown',
    OLAPIC_DISABLED: 'Olapic is disabled'
};

const OLAPIC_SEARCH_PARAMS = {
    PUBLIC_ID: 'publicId',
    PRODUCT_ID: 'productId',
    SKU_ID: 'skuId'
};

const SEARCH_PARAM_PREFIXES = {
    [OLAPIC_SEARCH_PARAMS.PUBLIC_ID]: 'user-',
    [OLAPIC_SEARCH_PARAMS.PRODUCT_ID]: 'product-',
    [OLAPIC_SEARCH_PARAMS.SKU_ID]: 'sku-',
    [biUtils.TYPES.HAIR_COLOR]: 'og-hair_color-',
    [biUtils.TYPES.EYE_COLOR]: 'og-eye_color-',
    [biUtils.TYPES.SKIN_TONE]: 'og-skin_tone-',
    [biUtils.TYPES.SKIN_TYPE]: 'og-skin_type-'
};

function olapicApiRequest(options) {
    if (!IS_OLAPIC_ENABLED) {
        return Promise.reject({
            error: OlapicApiRequestFailureReason.OLAPIC_DISABLED
        });
    }

    let qsParams = Object.assign({}, options.qsParams, {
        auth_token: OLAPIC_AUTH_TOKEN,
        version: 'v' + OLAPIC_API_VERSION
    });
    let opts = Object.assign({}, options, {
        url: '//' + OLAPIC_API_HOST + options.url,
        qsParams
    });

    return apiUtil.request(opts).
        then(response => response.json()).
        then(data => {
            let result;
            if (data.metadata.code === 200) {
                result = data.data;
            } else if (data.metadata.code === 404) {
                result = Promise.reject(
                            OlapicApiRequestFailureReason.HTTP_NOT_FOUND);
            } else {
                result = Promise.reject(
                            OlapicApiRequestFailureReason.UNKNOWN);
            }
            return result;
        }).
        catch(reason => {
            console.error(reason);
            return Promise.reject(reason);
        });
}

function getOlapicMediumStreamInfo(id) {
    return olapicApiRequest({ method: 'GET', url: '/media/' + id + '/streams' });
}

function getMediumGroupData(streamData) {
    let groupData;

    for (let i = 0; i < streamData.length; i++) {
        if (streamData[i].tag_based_key.indexOf('og-group') !== -1) {
            //TODO: remove replace after Olapic updates api
            //currently returning : "Group - Example Group Name"
            let groupName = streamData[i].name.replace('Group - ', '');

            //manipulate groupName to create lithiumId for url,
            //possible for groupname to contain & and !
            let lithiumId = groupName.replace(' &', '');
            lithiumId = lithiumId.replace('!', '');
            lithiumId = lithiumId.split(' ').join('-');
            let groupUrl =
                `https://${COMMUNITY_SITE_HOST}/t5/${lithiumId}/bd-p/${lithiumId.toLowerCase()}`;

            groupData = {
                name: groupName,
                url: groupUrl
            };

            break;
        }
    }

    return groupData;
}

function OlapicMedium(rawData) {
    Object.assign(this, rawData);

    let [caption, description] = this.caption.split('^|');

    this.caption = caption;
    this.description = description;
    this.datePublished = this.date_published;
    this.dateSubmitted = this.date_submitted;
    this.originalImageHeight = this.original_image_height;
    this.originalImageWidth = this.original_image_width;
    this.shareUrl = this.share_url;
    this.videoUrl = this.video_url;
    this.isFavorite = this.favorite;
    this.numLikes = this.likes;
    this.url = this.images;

    getOlapicMediumStreamInfo(rawData.id).then((data) => {
        this.groupData = getMediumGroupData(data._embedded.stream);
    });

    delete this.date_published;
    delete this.date_submitted;
    delete this.original_image_height;
    delete this.original_image_width;
    delete this.share_url;
    delete this.video_url;
    delete this.source_id;
    delete this.favorite;
    delete this.likes;
    delete this.images;

    delete this.request_id;
    delete this.original_source;
    delete this.sonar_place;
    delete this.location;

    delete this._analytics;
    delete this._embedded;
    delete this._fixed;
    delete this._forms;
    delete this._links;
}

OlapicMedium.prototype.isVideo = function () {
    // Per Ashley McCollum, we currently allow video uploads from YouTube only.
    // It would be normal if this.type was 'VIDEO', but it is 'IMAGE'. This may
    // be a bug on Olapic side.
    return this.source === 'youtube';
};

OlapicMedium.prototype.getSephoraUrl = function () {
    return `/community/gallery?opi=${this.id}`;
};

let _getRawOlapicUserRequest = function (
            sephoraUserPublicId, sephoraUserSocialNickname = null) {

    let screenName = sephoraUserSocialNickname ?
            sephoraUserSocialNickname : sephoraUserPublicId;
    return olapicApiRequest({
        method: 'POST',
        url: '/users',
        qsParams: {
            email: sephoraUserPublicId + '@fake.sephora.com',
            screen_name: screenName
        }
    });
};

let userLookupConcern = (() => {
    // There is no nickname in a medium object and thus, to get the nickname, we
    // need to do some manipulations with the Olapic user object.
    // Obviously, this may not be needed after Olapic improvements if they ever
    // happen.

    const olapicUserIdToNicknameMap = {};

    function decorateGetRawOlapicUser(getMethod) {
        if (getMethod !== _getRawOlapicUserRequest) {
            throw new Error('userLookupConcern#decorate method is only ' +
                            'for _getRawOlapicUserRequest method decoration!');
        }
        return function (...args) {
            return getMethod(...args).then(data => {
                let olapicUserId = data.id;
                let olapicUserNickname = data.name;
                olapicUserIdToNicknameMap[olapicUserId] = olapicUserNickname;
                return data;
            });
        };
    }

    // TO SEPHORA ENGINEERS OF THE FUTURE: Having this around will eliminate
    // the stress. The whole concern is about this method. Although it is not
    // used for the time being, from the retrospective of Olapic integration
    // on Legacy MWEB, this is going to be needed when we step into further
    // BeautyBoard improvements or porting to UFE.
    let getOlapicUserNicknameById = (id) => olapicUserIdToNicknameMap[id];

    return {
        decorate: decorateGetRawOlapicUser,
        getOlapicUserNicknameById
    };
})();


_getRawOlapicUserRequest = userLookupConcern.decorate(_getRawOlapicUserRequest);
_getRawOlapicUserRequest = cacheConcern.decorate('bbUser', _getRawOlapicUserRequest);


let _getRawOlapicUserMediaRequest = function (
            olapicUserId, pageNumber = 1, numPerPage = DEFAULT_MEDIA_PAGE_SIZE) {
    return olapicApiRequest({
        method: 'GET',
        url: '/users/' + olapicUserId + '/media/recent',
        qsParams: {
            // The page is going to be cached by its number.
            page_number: pageNumber,
            count: numPerPage
        }
    });
};

function getUserPhotosNum(publicId, nickname) {
    return _getRawOlapicUserRequest(publicId, nickname).
        then(olapicUser => _getRawOlapicUserMediaRequest(
                olapicUser.id, 1, DEFAULT_MEDIA_PAGE_SIZE)).
        then(data => parseInt(data.total)).
        catch(() => 0);
}

let _getOlapicUserMediaRequest = function (olapicUserId, pageNumber, numPerPage) {
    return _getRawOlapicUserMediaRequest(olapicUserId, pageNumber, numPerPage).
        then(data => data._embedded.media.map(one => new OlapicMedium(one))).
        catch(reason => {
            let result;
            if (reason === OlapicApiRequestFailureReason.HTTP_NOT_FOUND) {
                result = [];
            } else {
                result = Promise.reject(reason);
            }
            return result;
        });
};

// Customer is a per-environment entity that all the media flows into.
let getOlapicCustomerMedia = function (
            olapicCustomerId, pageNumber = 1, numPerPage = DEFAULT_MEDIA_PAGE_SIZE) {
    return olapicApiRequest({
        method: 'GET',
        url: '/customers/' + olapicCustomerId + '/media/recent',
        qsParams: {
            // The page is going to be cached by its number.
            page_number: pageNumber,
            count: numPerPage
        }
    }).
    then(data => data._embedded.media.map(one => new OlapicMedium(one))).
    catch(reason => {
        let result;
        if (reason === OlapicApiRequestFailureReason.HTTP_NOT_FOUND) {
            result = [];
        } else {
            result = Promise.reject(reason);
        }
        return result;
    });
};

let getRawOlapicStreamMedia = function (
        olapicStreamId, pageNumber = 1, numPerPage = DEFAULT_MEDIA_PAGE_SIZE) {
    return olapicApiRequest({
        method: 'GET',
        url: '/streams/' + olapicStreamId + '/media/recent',
        qsParams: {
            page_number: pageNumber,
            count: numPerPage
        }
    });
};

getRawOlapicStreamMedia = cacheConcern.decorate('bbStreamMedia', getRawOlapicStreamMedia);

let getRawOlapicStreamSearch = function (
        searchObj, pageNumber = 1, numPerPage = DEFAULT_MEDIA_PAGE_SIZE) {

    let searchParams = [];
    Object.keys(searchObj).forEach(key => {
        let value = searchObj[key];
        if (value) {
            let prefix = SEARCH_PARAM_PREFIXES[key];
            searchParams.push(Array.isArray(value) ?
                value.map(val => prefix + val).join('|') :
                prefix + value);
        }
    });

    return olapicApiRequest({
        method: 'GET',
        url: '/media/search',
        qsParams: {
            'tbk[]': searchParams,
            page_number: pageNumber,
            count: numPerPage
        }
    });
};

getRawOlapicStreamSearch = cacheConcern.decorate('bbStreamSearch', getRawOlapicStreamSearch);

let getProductMedia = function (
        productParams, pageNumber, numPerPage) {
    return getRawOlapicStreamSearch(productParams, pageNumber, numPerPage).
        then(data => data._embedded.media.map(one => new OlapicMedium(one))).
        catch(reason => {
            if (reason === OlapicApiRequestFailureReason.HTTP_NOT_FOUND) {
                return Promise.resolve([]);
            } else {
                return Promise.reject(reason);
            }
        });
};

let getProductMediaNum = function (productParams) {
    return getRawOlapicStreamSearch(productParams, 1, DEFAULT_MEDIA_PAGE_SIZE).
        then(data => parseInt(data.total)).
        catch(() => 0);
};

let getUserMedia = function (publicId, nickname, pageNumber, numPerPage) {
    return _getRawOlapicUserRequest(publicId, nickname).then(olapicUser =>
            _getOlapicUserMediaRequest(olapicUser.id, pageNumber, numPerPage));
};
getUserMedia = cacheConcern.decorate('bbUserMedia', getUserMedia);

function getFeaturedMedia(pageNumber, numPerPage) {
    return getOlapicCustomerMedia(OLAPIC_CUSTOMER_ID, pageNumber, numPerPage);
}


// - - - - -

function getRawOlapicMediumById(id) {
    return olapicApiRequest({ method: 'GET', url: '/media/' + id });
}

function getOlapicMediumById(id) {
    // (!) Although as of now we don't care what's the reason for the request
    // failure, we may need to handle that later.
    // Null is okay for the time being for those requests that yield 403 or 404.
    return getRawOlapicMediumById(id).
        then(data => new OlapicMedium(data)).
        catch(reason => null);
}

function getOlapicMediaByIds(mediaIds) {
    // (!) Filtering out the nulls (results of failed requests).
    return Promise.all(mediaIds.map(id => getOlapicMediumById(id))).
        then(olapicMedia => olapicMedia.filter(one => !!one));
}

// - - - - -


function deleteOlapicMediaById(mediaId, publicId) {
    let qsParams = {
        'reason': 'ClientDelete',
        'email': publicId + '@fake.sephora.com'
    };
    return olapicApiRequest({
        method: 'POST',
        url: '/media/' + mediaId + '/reports',
        qsParams: qsParams
    });
}

module.exports = {
    DEFAULT_MEDIA_PAGE_SIZE,
    getUserPhotosNum,
    getUserMedia,
    getProductMedia,
    getProductMediaNum,
    getFeaturedMedia,
    getOlapicMediaByIds,
    deleteOlapicMediaById
};



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/thirdparty/Olapic.js