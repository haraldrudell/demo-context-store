//Bind Data that needs to be ready before the 'load' event which triggers all the rest

/* This is also in loadAnalytics.js so order is explicit, but its also here in-case this file
** is ever required before that file runs. */
require('analytics/dataLayer/digitalData');

const bindingMethods = require('analytics/bindingMethods/pages/all/generalBindings');
const utils = require('analytics/utils');
const langLocaleUtils = require('utils/LanguageLocale');
const ApplePay = require('services/ApplePay');
const Location = require('utils/Location');
const store = require('store/Store');
const currentUser = store.getState().user;

/* Prerequisites *
** These need to be set first because some bindings depend on them.
** The order of these prerequisites matters as well, and they are numbered accordingly */

// 1.
digitalData.page.attributes.path = bindingMethods.getPagePath(
    utils.safelyReadProperty('Sephora.analytics.backendData.pageType')
);

// 2. Don't try to set pageType if it already exists
if (!digitalData.page.category.pageType) {
    digitalData.page.category.pageType =
        bindingMethods.getPageType(digitalData.page.attributes.path);
}

// 3. Don't try to set pageName if it already exists
if (!digitalData.page.pageInfo.pageName) {
    digitalData.page.pageInfo.pageName = bindingMethods.getPageName(
        digitalData.page.attributes.path,
        {
            user: currentUser,
            rawPagePath: Sephora.analytics.backendData.pageType
        }
    );
}

if (!digitalData.page.attributes.additionalPageInfo) {
    digitalData.page.attributes.additionalPageInfo =
        bindingMethods.getAdditionalPageInfo(digitalData.page.attributes.path);
}

digitalData.page.pageInfo.language = langLocaleUtils.getCurrentLanguage();

/**** End Prerequisites *****/

if (!digitalData.page.attributes.sephoraPageInfo.pageName) {
    digitalData.page.attributes.sephoraPageInfo.pageName = bindingMethods.getSephoraPageName();
}

bindingMethods.setUserPropsWithCurrentData();

//Account - SiteCatalyst :: Account ID
digitalData.page.attributes.reportSuiteId = bindingMethods.getReportSuiteId();

//Check for Apple Pay Eligibility
if (Sephora.isMobile() && Location.isBasketPage()) {
    ApplePay.checkApplePayments(canMakePayments => {
        digitalData.page.attributes.eligibility.applePayEligibility =
            (canMakePayments === ApplePay.TYPES.ENABLED) ? 'eligible' : 'not eligible';
    });
}



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/dataLayer/preLoadEventBindings.js