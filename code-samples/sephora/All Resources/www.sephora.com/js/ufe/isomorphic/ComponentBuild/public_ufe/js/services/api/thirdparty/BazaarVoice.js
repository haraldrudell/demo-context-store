const apiUtil = require('utils/Api');
const store = require('Store');
const userUtil = require('utils/User');
const Filters = require('utils/Filters');
const Constants = require('utils/framework/Constants');
const Location = require('utils/Location.js');

let settings = Sephora.configurationSettings.bvApi_rich_profile;
if (Location.isProductReviewsPage() || Location.isAddReviewPage()) {
    settings = Sephora.configurationSettings.bvApi_review_page;
} else if (Location.isProductPage()) {
    settings = Sephora.configurationSettings.bvApi_ppage;
}

const HOST = settings.host;
const PASSKEY = global.process.env.UFE_ENV === Constants.UFE_ENV_LOCAL ?
    'b4i86kr4vgzpnk5duninah9oh' : settings.token;
const VERSION = settings.version;
const IS_BAZAAR_ENABLED = Sephora.configurationSettings.isBazaarVoiceEnabled;

const BazaarVoiceApiRequestFailureReason = { BAZAAR_DISABLED: 'BazaarVoice is disabled' };
const SOCIAL_LOCKUP_DELIMITER = '|';
/*eslint camelcase: ["error", {properties: "never"}]*/


/**
 *
 * @returns NVPs containing arrays of values for each key.  Values are all converted to lower case
 */
let getContextDataValues = function (extraData) {
    let user = store.getState().user;
    let info =
        userUtil.biPersonalInfoDisplayCleanUp(user.beautyInsiderAccount.personalizedInformation);

    let contextDataValues = Filters.getContextDataValues(user, info, extraData);

    let keys = Object.keys(contextDataValues);

    // Convert all values to lowercase
    keys.forEach((key) => {
        // TODO: remove not to pickup first (DESC order) value when BazaarVoice supports
        // TODO: multi-values to be submitted
        let bvValue = contextDataValues[key].split(',');
        bvValue.sort((a, b) => {
            let A = a.toLowerCase();
            let B = b.toLowerCase();
            if (A < B) {
                return -1;
            } else if (A > B) {
                return 1;
            } else {
                return 0;
            }
        });
        contextDataValues[key] = bvValue[0];
    });

    return contextDataValues;

};


/* checks if it's a product id based on the existence of a 'p'
*  @params: string 
*  @return: boolean
*/
function isSkuId(id) {
    return id[0].toLowerCase() !== 'p';
}

/**
* pulls out and converts data that we need specifically for use in our codebase
* handles both populated data and user DNE data response
* @params object api response
* @returns object
**/
function reviewsDataAdapter(data, productId) {
    let copy = {};
    copy.totalResults = data.TotalResults;

    copy.results = data.Results.map(review => {
        let additionalFields = {
            socialLockUp: review.AdditionalFields.sociallockup ?
            {
                value: review.AdditionalFields.sociallockup.Value ?
                    review.AdditionalFields.sociallockup.Value : null
            } : null
        };
        let biTraits = {};
        let biTraitsOrder = [];
        review.ContextDataValuesOrder.forEach(key => {
            let convertedKey = Filters.convertFilterName(key);
            if (convertedKey) {
                biTraitsOrder.push(convertedKey);
                biTraits[convertedKey] = review.ContextDataValues[key];
            } else {
                biTraitsOrder.push(key);
                biTraits[key] = review.ContextDataValues[key];
            }
        });

        // Note of caution: review.ProductId can be either a skuId or a productId,
        // which is why there are subsequent adapters in most of the api calls
        return {
            reviewId: review.Id,
            productId: review.ProductId,
            rating: review.Rating,
            title: review.Title,
            reviewText: review.ReviewText,
            userNickname: review.UserNickname,
            location: review.UserLocation,
            submissionTime: new Date(review.SubmissionTime),
            totalNegativeFeedbackCount: review.TotalNegativeFeedbackCount,
            totalPositiveFeedbackCount: review.TotalPositiveFeedbackCount,
            isRecommended: review.IsRecommended,
            biTraits: biTraits,
            biTraitsOrder: biTraitsOrder,
            badges: review.Badges,
            photos: review.Photos,
            videos: review.Videos,
            badgesOrder: review.BadgesOrder,
            additionalFields: additionalFields
        };
    });

    if (data.Includes) {
        copy.includes = data.Includes;
    }

    return copy;
}

function userReviewsDataAdapter(data) {
    let copy = {
        totalResults: data.totalResults
    };
    /*
    * Logic to figure out what should the be the skuId and the productId on a review. 
    * Because BazaarVoice can send us back either the skuId for a swatch based color
    * product or an actual productId
    */ 
    copy.results = data.results.map(review => {
        let adaptedReview = Object.assign({}, review);
        if (isSkuId(review.productId)) {
            // we use the extraneous information provided in products to figure out 
            // the product 'family' the sku belongs to and assign the productId
            adaptedReview.productId = 
                data.includes.Products[review.productId].Attributes.BV_FE_FAMILY.Values[0].Value;
            adaptedReview.skuId = review.productId;
        } else {
            adaptedReview.productId = review.productId;
        }
        return adaptedReview;
    });

    return copy;
}

function productNStatsDataAdapter(data, productId) {
    let copy = {
        totalResults: data.totalResults
    };

    copy.results = data.results.map(review => {
        let adaptedReview = Object.assign({}, review);
        adaptedReview.productId = review.productId;
        if (isSkuId(review.productId)) {
            adaptedReview.skuId = review.productId;
        }
        return adaptedReview;
    });

    // can grab any of the subsidary products/skus from ProductsOrder because
    // ReviewStatistics object will be the same no matter what, so just happen
    // to be grabbing the first product
    if (data.includes.Products) {
        let id = data.includes.ProductsOrder[0];
        let ReviewStatistics = data.includes.Products[id].ReviewStatistics;
        copy.reviewStatistics = {
            ratingDistribution: ReviewStatistics.RatingDistribution,
            totalReviewCount: ReviewStatistics.TotalReviewCount,
            averageOverallRating: ReviewStatistics.AverageOverallRating,
            recommendedCount: ReviewStatistics.RecommendedCount,
            helpfulVoteCount: ReviewStatistics.HelpfulVoteCount,
            userContext: ReviewStatistics.ContextDataDistribution,
            notHelpfulVoteCount: ReviewStatistics.NotHelpfulVoteCount
        };
    }

    return copy;
}

function mediaDataAdapter(data) {
    let copy = {};
    if (data.Errors && data.Errors.length > 0) {
        copy.errors = data.Errors;
        return copy;
    }

    let photos = data.Photo ? data.Photo.Sizes : null;
    if (photos) {
        copy.thumbnailUrl = photos.thumbnail && photos.thumbnail.Url;
    }

    return copy;
}

function bazaarVoiceApiRequest(options) {
    if (!IS_BAZAAR_ENABLED) {
        return Promise.reject({ error: BazaarVoiceApiRequestFailureReason.BAZAAR_DISABLED });
    }

    let qsParams = Object.assign({}, options.qsParams, {
        passkey: PASSKEY,
        apiversion: VERSION
    });

    let opts = Object.assign({}, options, {
        url: 'https://' + HOST + options.url,
        qsParams
    });

    return new Promise((resolve, reject) => {
        apiUtil.request(opts).
            then(response => response.json()).
            then(data => {
                if (data.HasErrors) {
                    // structure of api errors
                    // "Errors": [
                    //     {
                    //       "Message": "The filter 'authorid:' must specify " +
                    //                  "a non-empty value.",
                    //       "Code": "ERROR_PARAM_INVALID_FILTER_ATTRIBUTE"
                    //     }
                    // ]
                    let extraErrors = [];
                    if (data.FormErrors && data.FormErrors.FieldErrors) {
                        (data.FormErrors.FieldErrorsOrder || []).forEach(field => {
                            let error = data.FormErrors.FieldErrors[field];
                            let contextDataValues = getContextDataValues();
                            Object.keys(contextDataValues).forEach(contextKey => {
                                if (contextKey.toLowerCase() === field.toLowerCase()) {
                                    error.Message += 'Field Value:' + contextDataValues[contextKey];
                                }
                            });
                            extraErrors.push(error);
                        });

                    }
                    reject({ errors: [].concat(data.Errors).concat(extraErrors) });
                } else {
                    resolve(data);
                }

            }).catch((error) => {
                reject(Object.assign({}, error, { apiFailed: true }));
            });
    });
}

function getUserReviews(profileId, limit) {
    return bazaarVoiceApiRequest({
        method: 'GET',
        url: '/data/reviews.json',
        qsParams: {
            limit: limit,
            Filter: `authorid:${profileId}`,
            Include: 'Products'
        }
    }).
    /* eslint-disable no-use-before-define */
    then(data => reviewsDataAdapter(data)).
    then(data => userReviewsDataAdapter(data)).
    catch(() => {
        return {
            totalResults: 0, results: []
        };
    });
}

/**
 * For more information look at:
 * https://developer.bazaarvoice.com/conversations-api/reference/v5.4/reviews/review-display
 * #requesting-all-reviews-for-a-particular-product-with-review-statistics-(inc.-average-rating)
 */
function getReviewsAndStats(productId, limit, filtersAndSorts = {}, offset) {
    let filters = [];
    let sorts = [];

    // Add all filter values to an aray of filters and all sort values to an array of sorts
    Object.keys(filtersAndSorts).forEach(filterKey => {
        let filterValues = filtersAndSorts[filterKey];
        let isSort = filterKey === Filters.REVIEW_FILTERS_TYPES.SORT;
        let bazaarVoiceFilter = Filters.getBazaarVoiceFilter(filterKey, filterValues, filters);
        if (bazaarVoiceFilter) {
            isSort ? sorts.push(bazaarVoiceFilter) : filters.push(bazaarVoiceFilter);
        }
    });

    let qsParams = {
        Filter: filters,
        Sort: sorts,
        Limit: limit,
        Offset: offset,
        Include: 'Products,Comments',
        Stats: 'Reviews'
    };

    let skuFilterValues = filtersAndSorts[Filters.REVIEW_FILTERS_TYPES.SKU];
    if (skuFilterValues && skuFilterValues.length) {
        filters.push('ProductId:' + skuFilterValues.join(','));
        qsParams.ExcludeFamily = 'True';
    } else {
        filters.push(`ProductId:${productId}`);
    }

    return bazaarVoiceApiRequest({
        method: 'GET',
        url: '/data/reviews.json',
        qsParams: qsParams
    })
    .then(data => reviewsDataAdapter(data))
    .then(data => productNStatsDataAdapter(data, productId));
}

let getSocialProfileParameter = function () {
    let user = store.getState().user;

    let param = null;

    let socialInfo = store.getState().socialInfo;

    if (user.nickName && socialInfo && socialInfo.socialProfile) {
        let socialProfile = socialInfo.socialProfile;

        // TODO: to be safe, any ampersands in these values should be escaped
        param = 'avatar=' + socialProfile.avatar + SOCIAL_LOCKUP_DELIMITER +
            'biBadgeUrl=' + socialProfile.biBadgeUrl + SOCIAL_LOCKUP_DELIMITER +
            'engagementBadgeUrl=' + socialProfile.engagementBadgeUrl + SOCIAL_LOCKUP_DELIMITER +
            'biTier=' + user.beautyInsiderAccount.vibSegment;
    }

    // TODO 2016: What do we do if there is no nickname (lithium is down)

    return param;

};

/**
 * Submit review API expects params to come in the body concatonated with &.
 * @param params
 * @returns String of &-concatonated params
 */
function generateSubmitReviewBody(params) {
    let body = '';

    let keys = Object.keys(params);

    keys.forEach((key, index) => {
        body += key + '=' + params[key];

        if (index !== keys.length - 1) {
            body += '&';
        }
    });

    return body;

}

function submitReview(config) {
    let {
        productId,
        title,
        rating,
        isRecommended,
        reviewText,
        userId,
        photos,
        isFreeSample,
        isSephoraEmployee
    } = config;

    let user = store.getState().user;

    let socialProfileParam = getSocialProfileParameter();

    //fp: null, //TODO: do we need this
    // TODO: HostedAuthentication params
    // TODO 2018: video
    // TODO 2018: photo
    let params = Object.assign({}, {
        Action: 'Submit',
        ProductId: productId,
        Title: title,
        Rating: rating,
        IsRecommended: isRecommended,
        ReviewText: reviewText,
        // TODO: AgreedToTermsAndConditions: true,
        UserId: userId,
        UserNickname: user.nickName,
        AdditionalField_sociallockup: socialProfileParam
    }, photos);

    let contextDataValues = getContextDataValues({
        isFreeSample,
        isSephoraEmployee
    });

    params = Object.assign(params, contextDataValues);

    return bazaarVoiceApiRequest({
        method: 'POST',
        url: '/data/submitreview.json',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        params: generateSubmitReviewBody(params)
    });
}

function uploadPhoto(imageContent) {
    // https://developer.bazaarvoice.com/conversations-api/tutorials/submission/photo-upload
    // BMP  PNG  GIF JPG
    const IMAGE_REG_EX = /image\/*\w+/g;

    // Return false if file is not an image
    if (!imageContent || !imageContent.type.match(IMAGE_REG_EX)) {
        return Promise.reject({
            errors: [{
                Message: `There was an issue with your upload.
         Your file extension must be .jpg, .jpeg, .png, .gif, or .bmp
         and your file size must not exceet 5MB.`
            }]
        });
    }

    let formData = new FormData();
    formData.append('photo', imageContent);

    return bazaarVoiceApiRequest({
        method: 'POST',
        url: '/data/uploadphoto.json',
        qsParams: { contenttype: 'Review' },
        params: formData,
        isMultiPart: true
    }).then(data => mediaDataAdapter(data));
}

/**
 * Submit feedback on whether a given ereview was helpful or unhelpful
 *
 * For more information:
 * https://developer.bazaarvoice.com/conversations-api/reference/v5.4/feedback/feedback-submission
 *
 * @param helpfulnessVote Valid votes are: Positive, Negative
 * @param reviewId
 */
function voteHelpfulness(helpfulnessVote, reviewId) {

    let params = {
        FeedbackType: 'helpfulness',
        Vote: helpfulnessVote,
        ContentId: reviewId,
        ContentType: 'review'
    };

    return bazaarVoiceApiRequest({
        method: 'POST',
        url: '/data/submitfeedback.json',
        qsParams: params
    });
}

module.exports = {
    getUserReviews,
    getReviewsAndStats,
    submitReview,
    voteHelpfulness,
    uploadPhoto
};



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/thirdparty/BazaarVoice.js