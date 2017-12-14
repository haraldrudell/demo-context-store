var utils = require('analytics/utils');
const anaConsts = require('analytics/constants');
var urlUtils = require('utils/Url');
var store = require('store/Store');

module.exports = (function () {
    //All Pages Binding Methods
    return {

        getATGID: function (user) {
            return (user.profileId || '');
        },

        getProfileStatus: function (user) {
            return (user.profileStatus || 0);
        },

        getWebAnalyticsCipher: function (user) {
            return (user.webAnalyticsCipher || '');
        },

        getWebAnalyticsHash: function (user) {
            return (user.webAnalyticsHash || '');
        },

        getTimeTradeBIStatus: function (user) {
            return (user.timeTradeBiStatus || '');
        },

        getBiStatus: function (user) {
            var beautyInsiderAccount = (user.beautyInsiderAccount || {});
            return (beautyInsiderAccount.vibSegment || 'non-bi').toLowerCase();
        },

        getBiPoints: function (user) {
            var beautyInsiderAccount = (user.beautyInsiderAccount || {});
            return beautyInsiderAccount.promotionPoints || 0;
        },

        getFlashStatus: function (user) {
            if (this.getSignInStatus(user) === 'unrecognized') {
                return 'non-flash';
            } else {
                var biStatus = (this.getBiStatus(user) === 'rouge') ? 'rouge' : 'non-rouge';
                return (biStatus + (user.isFlash ? '+flash' : '')).toLowerCase();
            }
        },

        getPlayStatus: function (user) {
            if (this.getSignInStatus(user) !== 'unrecognized') {
                let isPlay = utils.safelyReadProperty('subscriptionPrograms.play.isActive', user);

                return (isPlay ? 'play' : 'non play');
            } else {
                return null; // Only populate data element if user is not unrecognized
            }
        },

        getChannel: function () {
            return Sephora.isDesktop() ? 'full site' : 'mobile';

        },

        /**
         * Get the nickname of the user whose page you are viewing if it is not your page.
         * @param  {string} href The href of the current page.
         * @return {string}      The nickname.
         */
        getPageProfileId: (href, user) => {
            if (digitalData.page.category.pageType === anaConsts.PAGE_TYPES.COMMUNITY_PROFILE) {
                let hrefArray = href.split('/');
                let len = hrefArray.length;
                let nickName = hrefArray[len - 1].split('?')[0];

                if (hrefArray.indexOf('users') !== -1) {
                    if (user.nickName !== nickName) {
                        return nickName;
                    }
                }
            }

            return '';
        },

        getInternalCampaign: function () {
            var paramNames = ['icid', 'icid2', 'int_cid'];

            for (let name of paramNames) {

                let campaign = utils.getQueryParam(name);

                if (campaign) {
                    return require('utils/replaceSpecialCharacters')(campaign);
                }
            }

            return '';
        },

        /**
         * Determine page name. The result will be stored in digitalData.page.pageInfo.pageName
         * and will be used as one piece of SephoraPageName, which is what actually gets reported.
         * @param  {string} pageType This page's path.
         * @return {string}          The name of this page.
         */
        getPageName: function (path = [], options = {}) {
            let name = '';

            switch (digitalData.page.category.pageType){
                case anaConsts.PAGE_TYPES.USER_PROFILE:
                    name = path[path.length - 1];
                    if (path.indexOf('myaccount') !== -1) {
                        name = anaConsts.PAGE_NAMES.MY_ACCOUNT;
                    }

                    if ((options.rawPagePath || '').indexOf('RichProfile/BeautyInsider') !== -1) {
                        name = 'my beauty insider-';
                        if (utils.safelyReadProperty('user.profileStatus', options) === 4) {
                            name += 'signed in';
                        } else {
                            name += 'anonymous';
                        }

                    }

                    break;
                case anaConsts.PAGE_TYPES.COMMUNITY_PROFILE:
                    name = path[path.length - 1];
                    break;
                default:
                    name = path[0];
            }

            return utils.convertName(name);
        },

        getPageType: function (path = []) {
            let type = (path[1] || '');

            //Some page types need additional info to determine the page type
            if (type === 'richprofile') {
                if (path[2] && path[2] === 'profile') {
                    type = 'cmnty profile';
                }
            }

            return utils.convertType(type);
        },

        getAdditionalPageInfo: (path = []) => {
            let info = '';
            if (path.indexOf('myaccount') !== -1) {
                info = path[path.length - 1];

                // Clear 'info' if there was no additional info besides 'myaccount'
                if (info === 'myaccount') {
                    info = '';
                }
            }

            return utils.convertAdditionalInfo(info);
        },

        getPagePath: (pageType = '') => pageType.toLowerCase().split('/'),

        getPlatform: function (userAgent, isMobile) {
            userAgent = (userAgent || '').toLowerCase();
            if (isMobile) {
                return 'mobile';
            } else if (userAgent.match(/ipad|android/i) && !userAgent.match(/android.*mobile/i)) {
                return 'tablet web';
            } else {
                return 'desktop web';
            }
        },

        /**
         * Report on how the client got to this page.
         * ToDo: The point of this string and how it is determined needs further
         * clarification from analytics PdMs.
         * @return {string} A description of how the client found got to this page.

        productFindingMethod: function(){
            var type = digitalData.page.category.pageType,
                pagesTypes = ['basket', 'checkout', 'order confirmation', 'product'];

            for(let currentType of pagesTypes){
                if(currentType === type){
                    if(digitalData.page.pageInfo.referringURL && document.referrer){
                        return "";
                    }
                    else {
                        return "Direct Entry" + (digitalData.page.attributes.ursChannelId ? " by " +
                        digitalData.page.attributes.ursChannelId : "");
                    }
                }
            }
            return "D=pageName";
        },
        */

        //Determine which adobe report suite to send analytics data to
        getReportSuiteId: function () {
            let env = utils.safelyReadProperty('global.process.env.UFE_ENV');
            if (env === 'PROD') {
                return 'sephoracom';
            } else {
                return Sephora.isDesktop() ? 'sephorarenew' : 'sephoratomdev';
            }
        },

        /**
         * Build the page name.
         * Format is:
         * [PageType]:[PageDetail]:[ProductWorld]:*[ExtraString (if needed)]
         * @return {string} The assembled parts
         */
        getSephoraPageName: function () {
            let pageName = [
                digitalData.page.category.pageType,
                digitalData.page.pageInfo.pageName,
                (digitalData.page.attributes.world || 'n/a'),
                ('*' + digitalData.page.attributes.additionalPageInfo)
            ];

            return pageName.join(':').toLowerCase();
        },

        /**
         * Determine sign in status
         * @param  {object} user The current user object
         * @return {string}      The string reporting wants for each scenario
         */
        getSignInStatus: function (user) {
            switch (user.profileStatus) {
                case 4:
                    return 'signed in';
                case 2:
                    return 'recognized';
                default:
                    return 'unrecognized';
            }
        },

        /**
         * Check if the domain passed in is on our list of refererrs
         * @param  {string} referrerDomain Example: google.com
         * @return {bool}                  Whether or not the param was found on our list
         */
        referrerIsOnOurList: function (referrerDomain) {
            return anaConsts.REFERRER_DOMAINS.some(domains => {
                domains = domains.split(',');

                if (domains.length > 1) {
                    let allStringsWereFound = false;

                    //Only return true if every check is true
                    for (let domain of domains) {
                        if (referrerDomain.indexOf(domain) !== -1) {
                            allStringsWereFound = true;
                        } else {
                            return false;
                        }
                    }

                    return allStringsWereFound;
                } else {
                    return referrerDomain.indexOf(domains[0]) !== -1;
                }
            });
        },

        /**
         * Gets just the domain of a referrer
         * @param  {string} referrer Example: google.com/?search=blah
         * @return {string}          Example: google.com
         */
        getReferrerDomain: function (referrer) {
            var referrerDomain = referrer.split('?')[0];
            return referrerDomain.split('/')[0];
        },

        /**
         * Determine the URS Tracking code
         * @param  {string} url The url or search portion of a url
         * @return {string}     URS Tracking code
         */
        getUrsTrackingCode: function (url, referrer) {
            const sephoraRegExp = /.*\.sephora\..*/;
            var referrerDomain;

            var param = (urlUtils.getParamsByName('om_mmc', url) || [])[0];

            if (param) {
                return param;
            } else {
                referrerDomain = this.getReferrerDomain(referrer);
                if (referrerDomain && this.referrerIsOnOurList(referrerDomain)) {
                    return referrerDomain + '[seo]';
                } else if (referrer.search(sephoraRegExp) === -1) {
                    return referrerDomain ? referrerDomain + '[ref]' : '';
                }
            }

            return '';
        },

        /**
         * Determine the marketing channel
         * @param  {string} url The url or search portion of a url
         * @return {string}
         */
        getMarketingChannel: function (url, referrer) {
            const sephoraRegExp = /.*\.sephora\..*/;
            var referrerDomain;

            var param = (urlUtils.getParamsByName('om_mmc', url) || [])[0];

            if (param) {
                return param.split('-')[0];
            } else {
                referrerDomain = this.getReferrerDomain(referrer);
                if (referrerDomain && this.referrerIsOnOurList(referrerDomain)) {
                    return 'Natural Search or SEO';
                } else if (referrer.search(sephoraRegExp) === -1) {
                    return referrerDomain ? 'Referrals' : '';
                }
            }

            return '';
        },

        //This is a convenience method for updating multiple user props using current user data.
        setUserPropsWithCurrentData: function () {
            //Always get this here, so it's fresh
            var currentUser = store.getState().user;

            var segment = digitalData.user[0].segment;
            var profileInfo = digitalData.user[0].profile[0].profileInfo;

            segment.biStatus = this.getBiStatus(currentUser);
            segment.biPlusFlash = this.getFlashStatus(currentUser);
            segment.signInStatus = this.getSignInStatus(currentUser);
            segment.playStatus = this.getPlayStatus(currentUser);
            segment.timeTradeBiStatus = this.getTimeTradeBIStatus(currentUser);
            segment.biPoints = this.getBiPoints(currentUser);

            profileInfo.profileID = this.getATGID(currentUser);
            profileInfo.profileStatus = this.getProfileStatus(currentUser);
            profileInfo.webAnalyticsCipher = this.getWebAnalyticsCipher(currentUser);
            profileInfo.webAnalyticsHash = this.getWebAnalyticsHash(currentUser);
        },

        /**
         * Determines the current load page events
         * @param  {String} pageName - The current page name
         * @returns {Array} The current load page events
         */
        getPageEvents: function (pageName) {
            let events = [];

            switch (pageName) {
                case anaConsts.PAGE_NAMES.BASKET:
                    events.push(anaConsts.Event.SC_VIEW);
                    break;
                default:

                    //Do nothing
            }

            if (digitalData.page.attributes.previousPageData.prevSearchType) {
                events.push(anaConsts.Event.INTERNAL_SEARCH);
            }

            return events;
        },

        /**
         * Sets the productStrings property in digitalData
         * @param  {String} pageName - The current page name
         */
        setProductStrings: function (pageName) {
            if (pageName === anaConsts.PAGE_NAMES.BASKET) {
                const productString = utils.buildProductStrings(store.getState().basket.items);
                digitalData.page.attributes.productStrings = productString;
            }
        },

        getArrayOfPropValuesFromItems: function (items = [], property) {
            return items.map(function (item) {
                return item.sku[property];
            });
        }
    };
}());



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/bindingMethods/pages/all/generalBindings.js