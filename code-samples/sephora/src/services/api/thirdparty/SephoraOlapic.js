// This is the API that we hand over to Olapic to leverage all of our wrappers.

const olapicLovesApi = require('services/api/thirdparty/OlapicLoves');
const cmsApi = require('services/api/cms');

const GALLERY_MARKETING_BANNER_MEDIA_ID = 36000018;

const { loveMedium,
        unloveMedium,
        validateSocialUser } = olapicLovesApi;


let getGalleryMarketingBanner = function () {
    return cmsApi.getMediaContent(GALLERY_MARKETING_BANNER_MEDIA_ID).
        then(data => {
            if (data.regions && data.regions.content) {
                return data.regions.content[0];
            } else {
                return Promise.reject('no-content');
            }
        });
};


module.exports = {
    loveMedium,
    unloveMedium,
    validateSocialUser,
    getGalleryMarketingBanner
};



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/thirdparty/SephoraOlapic.js