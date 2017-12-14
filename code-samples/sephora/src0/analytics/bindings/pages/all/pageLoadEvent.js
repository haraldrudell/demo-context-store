/**
* This module is a property of the Sephora.analytics object.
* Its purpose is to hold methods which process data related
* to analytics.
*
* Dependencies: DataLayer.js
*/
const utils = require('analytics/utils');
const dateUtils = require('utils/Date');
const urlUtils = require('utils/Url');
const anaConsts = require('analytics/constants');
const deepExtend = require('deep-extend');
const langLocaleUtils = require('utils/LanguageLocale');
const store = require('Store');
const watch = require('redux-watch');

module.exports = (function () {
    const bindingMethods = require('analytics/bindingMethods/pages/all/generalBindings');
    const digitalData = window.digitalData;
    const now = new Date();
    const currentUser = store.getState().user;

    /**
     * These are the bindings that will take place on all pages when the
     * page load event occurs.
     */
    const pageLoadBindings = function (data) {

        const basketContents = store.getState().basket;

        var previousPageData = utils.getPreviousPageData(true);
        /* Used for:
        ** prop55 - Previous link data
        ** events - Event strings **/
        if (previousPageData) { //Merge into exisiting defaults if there was saved data
            deepExtend(digitalData.page.attributes.previousPageData, previousPageData);
        }

        //Account - SiteCatalyst :: Account ID
        digitalData.page.attributes.reportSuiteId = bindingMethods.getReportSuiteId();

        //Channel
        digitalData.page.pageInfo.sysEnv = bindingMethods.getChannel();

        //s.campaign - Campaign :: Marketing Channel
        digitalData.page.attributes.campaigns.marketingChannel =
            bindingMethods.getMarketingChannel(window.location.search, document.referrer) || '';

        //eVar44 - Campaign :: URS :: Channel
        digitalData.page.attributes.campaigns.ursTrackingCode =
            bindingMethods.getUrsTrackingCode(window.location.search, document.referrer) || '';

        //Page :: Experience
        digitalData.page.attributes.experience = Sephora.isDesktop() ? 'web' : 'mobile';

        //Page :: Platform
        digitalData.page.attributes.platform = bindingMethods.getPlatform(
            window.navigator && window.navigator.userAgent,
            Sephora.isMobile()
        );

        //eVar2 - Internal Campaign
        digitalData.page.attributes.internalCampaign = bindingMethods.getInternalCampaign();

        //prop13 - Country of the page's content
        digitalData.page.attributes.sephoraPageInfo.contentCountry =
            'content:' + Sephora.renderQueryParams.country.toLowerCase();

        //eVar39 - Page :: Day Name
        digitalData.page.attributes.date.dayName = dateUtils.getDayOfWeek(now);

        //eVar62 - Page :: Language/Locale
        digitalData.page.attributes.languageLocale = langLocaleUtils.getCurrentCountry() + '-' +
            langLocaleUtils.getCurrentLanguage();

        //c70 - Page :: Country
        digitalData.page.pageInfo.country = langLocaleUtils.getCurrentCountry();

        // Get Previous and Current pages events
        const previousPageEvents = digitalData.page.attributes.previousPageData.events;
        const currentPageEvents = bindingMethods.getPageEvents(digitalData.page.pageInfo.pageName);

        //Page :: Event Strings
        digitalData.page.attributes.eventStrings = previousPageEvents.concat(currentPageEvents);

        //Product String :: On-load
        bindingMethods.setProductStrings(digitalData.page.pageInfo.pageName);

        //prop25 - Page :: Date
        digitalData.page.attributes.date.localDate = dateUtils.getLocalDate(now);

        /* prop8 - BI Status
        ** prop9 - ATG ID
        ** prop27 - Sign In Status */
        bindingMethods.setUserPropsWithCurrentData();

        var userWatch = watch(store.getState, 'user');

        store.subscribe(userWatch(() => {
            bindingMethods.setUserPropsWithCurrentData();
        }));

        // prop36 - Community Profile Id
        // The nickname of the user whose community page you are viewing
        Sephora.analytics.utils.setIfPresent(
            digitalData.page.attributes,
            'othersCommunityProfileId',
            (bindingMethods.getPageProfileId(location.href, currentUser) || null)
        );

        //eVar45 - Epsilon Deployment ID
        digitalData.page.attributes.campaigns.emailHarmonyDeploymentId =
            urlUtils.getParamValueAsSingleString('emtc2');

        //eVar46 - Harmony Link ID
        digitalData.page.attributes.campaigns.emailHarmonyLinkId =
            urlUtils.getParamValueAsSingleString('emlid');

        //eVar47 - Harmony Customer Key
        digitalData.page.attributes.campaigns.emailHarmonyCustomerKey =
            urlUtils.getParamValueAsSingleString('emcid');

        //eVar48 - Campaign :: Email Tracking Code
        digitalData.page.attributes.campaigns.emailTrackingCode =
            urlUtils.getParamValueAsSingleString('emtc') || 'non-email source';

        //eVar49 - Sephora ATG Id
        digitalData.page.attributes.campaigns.emailATGID =
            urlUtils.getParamValueAsSingleString('ematg');

        //eVar80 - Beauty Talk Navigation Info
        digitalData.page.attributes.previousPageData.beautyTalkNavigationInfo =
            urlUtils.getParamValueAsSingleString('cmnty-sc');

        digitalData.cart.item = basketContents.items;

        digitalData.cart.attributes.productIds =
            bindingMethods.getArrayOfPropValuesFromItems(basketContents.items, 'productId');

        digitalData.cart.attributes.skuIds =
            bindingMethods.getArrayOfPropValuesFromItems(basketContents.items, 'skuId');

        /*
        ** These bindings need to take place after the above bindings because they
        ** rely on the data set above.
        */
        utils.setNextPageData(
            {
                pageName: digitalData.page.attributes.sephoraPageInfo.pageName,
                pageType: digitalData.page.category.pageType
            }
        );

        /*
        ** Google Double Click Pixel Bindings
        */

        // DoubleClick :: Category
        digitalData.page.category.doubleClickCategory = utils.getDoubleClickCategory('footer');
    };

    return pageLoadBindings;
}());



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/bindings/pages/all/pageLoadEvent.js