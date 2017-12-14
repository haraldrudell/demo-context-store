// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var AllStoreServices = function () {};

// Added by sephora-jsx-loader.js
AllStoreServices.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const decorators = require('utils/decorators');
const profileApi = require('services/api/profile');
const dmgUtil = require('utils/dmg');
const Locale = require('utils/LanguageLocale');
const urlUtil = require('utils/Url');

AllStoreServices.prototype.ctrlr = function (user) {
    this.profileId = user.profileId;
    let redirectIfCanada = function () {
        if (Locale.isCanada()) {
            urlUtil.redirectTo('/profile/Lists');
        }
    };
    this.getProfileSamples(redirectIfCanada);

    // Analytics
    digitalData.page.category.pageType = 'user profile';
    digitalData.page.pageInfo.pageName = 'lists-services';
};

AllStoreServices.prototype.getProfileSamples = function (callback) {
    profileApi.getProfileSamplesByDMG(
        this.profileId,
        {
            itemsPerPage: dmgUtil.PAGE_SKUS_LIMIT + 1,
            includeInactiveSkus: true,
            currentPage: this.state.currentPage,
            limit: this.state.limit + 1
        }
    ).then(skus => {
        if (skus.length) {
            let formattedSkus;
            if (this.state.skus) {
                formattedSkus = this.state.skus.concat(skus.slice(0, dmgUtil.PAGE_SKUS_LIMIT));
            } else {
                formattedSkus = skus;
            }

            let services = dmgUtil.combineSkusIntoServices(formattedSkus);

            // limit is required by API so it increases with each api call, whereas pagination stays 
            // the same.  46 skus per page, but the upper limit increases until there are no more 
            // skus
            this.setState({
                services: services,
                skus: skus,
                shouldShowMore: skus.length > dmgUtil.PAGE_SKUS_LIMIT,
                currentPage: this.state.currentPage + 1,
                limit: this.state.limit + dmgUtil.PAGE_SKUS_LIMIT
            });
        } else {
            this.setState({
                isEmptyService: true
            });
            if (callback) {
                callback();
            }
        }
    });
};

AllStoreServices.prototype.showMoreServices = function(e) {
    e.preventDefault();
    this.getProfileSamples();
};

AllStoreServices = decorators.ensureUserIsAtLeastRecognized(AllStoreServices);


// Added by sephora-jsx-loader.js
module.exports = AllStoreServices.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/StoreServices/AllStoreServices.c.js