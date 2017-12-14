const refetch = require('Refetch');
const restApi = require('RestApi');
const UrlUtils = require('utils/Url');


// Mweb TOM RestController.java getCategoryHierarchy => /api/shop/all


function dangerouslyAdaptData(data) {

    // Andrew Halfhill:
    // TODO: remove this once category template supports ufe components

    data.forEach(function (cat) {
        let leftContent =
                cat.content && cat.content.region1 ? cat.content.region1 : [];
        let bannerContent = cat.megaNavMarketingBanner;
        if (leftContent.length) {
            leftContent.forEach(function (linkGroup) {
                if (linkGroup.componentType === 9) {
                    linkGroup.componentType = 59;
                    linkGroup.displayTitle = linkGroup.title;
                    if (linkGroup.links && linkGroup.links.length) {
                        linkGroup.links.forEach(function (link) {
                            link.componentType = 58;
                            link.displayTitle = link.linkText;
                        });
                    }
                }
            });
        }

        if (bannerContent && bannerContent.length) {
            bannerContent.forEach(function (banner) {
                if (banner) {
                    banner.componentType = 53;
                }
            });
        }
    });

    return data;
}


function getCategoryHierarchy() {
    let url = '/api/shop/all';
    return refetch.fetch(restApi.getRestLocation(UrlUtils.getLink(url))).
        then(data => data.errorCode ?
                Promise.reject(data) : dangerouslyAdaptData(data));
}


module.exports = getCategoryHierarchy;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/legacy-mweb/getCategoryHierarchy.js