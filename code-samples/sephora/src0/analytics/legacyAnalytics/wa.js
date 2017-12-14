/*
** This file was previously wa.js and wa2.js which were
** script libraries in Signal. */

/* There are so many interdependencies that its too
** dangerous to convert this code all at once. This and
** other Signal libs will have to be converted as we go.
*/

module.exports = (function () {
    //Declare shorter references which can be used throughout.
    var ddPageInfo = digitalData.page.pageInfo;
    var ddUrsChannel = digitalData.page.attributes.ursChannelId;
    var cookieUtils = require('utils/Cookies');
    var urlUtils = require('utils/Url');
    var wa = {};

    wa.config = {};

    function isEmpty(a) {
        return a === null || typeof a == 'undefined' || a === '';
    };

    /*********************************************************
    **** The code below was wa2.js from the Signal Library ***
    *********************************************************/

    // creates marketing related wa variables
    function campaignVariables() {
        try {
            currentUrl = location.href.replace(/%3d/g, '=');
            ddPageInfo.referringURL = document.referrer; // referrer

            /* esv used to insert unique click ids into campaign codes
            ** this logic strips out these click ids if they exist */
            if (currentUrl.indexOf('us_search-') > 0 || currentUrl.indexOf('ca_search-') > 0) {
                if (currentUrl.indexOf('-gg-') > 0 || currentUrl.indexOf('-ya-') > 0 ||
                    currentUrl.indexOf('-msn-') > 0 || currentUrl.indexOf('-ask-') > 0) {

                    var target = 0;
                    if (currentUrl.indexOf('{esvcid}') > 0) {
                        target = currentUrl.indexOf('{esvcid}');
                    } else if (currentUrl.indexOf('_agi') > 0) {
                        target = currentUrl.indexOf('_agi');
                    }

                    if (target > 0) {
                        var endSlice = currentUrl.lastIndexOf('-_-', target);
                        currentUrl = currentUrl.slice(0, endSlice);
                    }
                }
            }

            // campaign tracking code
            if (urlUtils.getParamsByName('om_mmc', currentUrl)) {
                // current tracking code
                wa.campaign = urlUtils.getParamsByName('om_mmc', currentUrl).toLowerCase();
                if (wa.campaign.indexOf('ppc') != -1) {
                    //Days may need to be adjusted
                    cookieUtils.write('originPaidSearch', 'true', 7, true);
                }
            } else if (urlUtils.getParamsByName('cm_mmc', currentUrl)) {
                // depreciated coremetrics tracking code
                wa.campaign = urlUtils.getParamsByName('cm_mmc', currentUrl).toLowerCase();
            } else if (ddPageInfo.referringURL.toLowerCase().indexOf('blog.sephora.com') > -1) {
                // hard code campaign from blog.sephora.com
                wa.campaign = 'blog-sephora';
            } else if (!isEmpty(wa.pageCampaign)) {
                // allow campaign to be set on page
                wa.campaign = wa.pageCampaign;
            } else if (wa.iPadApp) {
                wa.campaign = 'iPadApp-' + wa.appVersion;
            } else if (wa.iPhoneApp) {
                wa.campaign = wa.platform;
            }

            digitalData.page.attributes.campaign = (wa.campaign || '');

            //**** URS logic
            if (!isEmpty(wa.campaign)) {
                // create channel variable if campaign
                if (urlUtils.getParamsByName('cm_mmc', currentUrl) &&
                    wa.campaign.indexOf('us_') === 0) {
                    var splitChannel = wa.campaign.split('_', 2);

                    if (typeof splitChannel[1] == 'undefined') {
                        splitChannel[1] = '';
                    }

                    ddUrsChannel = splitChannel[0] + '_' + splitChannel[1];
                } else {
                    splitChannel = (urlUtils.getParamsByName('cm_mmc', currentUrl)) ?
                        wa.campaign.split('_', 1) : wa.campaign.split('-', 1);

                    ddUrsChannel = splitChannel[0];
                }

                wa.ursCampaign = wa.campaign;
                if (ddUrsChannel.indexOf('esv') == 0) { //replace esvXXXXXXXX with esv
                    ddUrsChannel = 'esv';
                }
            }

            wa.rDomain = ddPageInfo.referringURL.replace(/(\/\/[^\/]+\/).*/, '$1');
            wa.rDomain = wa.rDomain.replace(/www.|http:|https:|\//g, '');
            if (wa.config.internalHosts.join(',').indexOf(wa.rDomain) >= 0) {

                //don't process internal domains as referrers
                ddPageInfo.referringURL = wa.rDomain = '';
            }

            if (!(isEmpty(wa.campaign) && isEmpty(wa.rDomain))) {
                var domainFound = '';

                for (var i = 0; i < wa.config.orgDomains.length; i += 1) {
                    if (domainFound != '') {
                        i = 0;//We could be 1 or more ahead no so reset to 0 before continuing
                        var orgParams = wa.config.orgDomains[i].split(',');

                        for (var j = 0; j < orgParams.length; j++) {
                            var parsekw =
                                urlUtils.getParamsByName(orgParams[j], ddPageInfo.referringURL);
                            if (parsekw) {
                                if (wa.ursCampaign) {
                                    wa.paidSearchKeyword = parsekw;
                                } else {
                                    wa.ursCampaign = wa.rDomain + ' [seo]';
                                    wa.naturalSearchKeyword = parsekw;
                                    ddUrsChannel = 'Natural Search or SEO';
                                }

                                //search keyword parameter was found--we can get out of the loop
                                break;
                            }
                        }

                        /* checks for google encrypted organic search (keyword is missing in
                        ** referring URL)*/
                        if (domainFound == 'google.' && !('ursCampaign' in wa)) {
                            wa.ursCampaign = wa.rDomain + ' [seo]';
                            wa.naturalSearchKeyword = parsekw = '[google encrypted]';
                            ddUrsChannel = 'Natural Search or SEO';
                        }

                        /* no search keyword parameter was found for this referring URL--we can
                        ** get out of the loop */
                        break;
                    }

                    if (wa.config.orgDomains[i].indexOf('.') >= 0 &&
                        ddPageInfo.referringURL.indexOf(wa.config.orgDomains[i]) >= 0) {
                        domainFound = wa.config.orgDomains[i];
                    }

                    if (parsekw) {
                        break;
                    }
                }

                if (!parsekw && !wa.campaign && wa.rDomain) {
                    wa.ursCampaign = wa.rDomain + ' [ref]';
                    ddUrsChannel = 'Referrals';
                }
            }

            if (ddUrsChannel) {digitalData.page.attributes.marketingChannel = ddUrsChannel;}
            /**** end URS logic*/

            // esv paid search tracking
            if (urlUtils.getParamsByName('om_kwpur', currentUrl)) {
                wa.keywordID = urlUtils.getParamsByName('om_kwpur', currentUrl);
            } else if (urlUtils.getParamsByName('mkwid', currentUrl)) {
                wa.keywordID = urlUtils.getParamsByName('mkwid', currentUrl);
            }

            if (urlUtils.getParamsByName('cid', currentUrl)) {
                wa.creativeID = urlUtils.getParamsByName('cid', currentUrl);
            }

            // email tracking ad integration
            if (urlUtils.getParamsByName('emtc', currentUrl)) {

                // tracking code
                wa.emailTrackingCode = urlUtils.getParamsByName('emtc', currentUrl);
            } else if (wa.ursCampaign) {
                wa.emailTrackingCode = 'non-email source';
            }

            //Harmony Deployment ID
            wa.emailHarmonyDeploymentId = urlUtils.getParamsByName('emtc2', currentUrl);

            //Harmony Link ID
            wa.emailHarmonyLinkId = urlUtils.getParamsByName('emlid', currentUrl);

            //Harmony Customer Key
            wa.emailHarmonyCustomerKey = urlUtils.getParamsByName('emcid', currentUrl);

            // Sephora ATG Id
            if (urlUtils.getParamsByName('ematg', currentUrl)) {
                wa.emailATGID = urlUtils.getParamsByName('ematg', currentUrl); // atg id
            }

            // isolate affiliate id
            if (!isEmpty(wa.campaign) && wa.campaign.toLowerCase().indexOf('aff-linkshare') > -1) {
                var affiliateMatch = wa.campaign.match(new RegExp('([^-]*)$'));
                if (!isEmpty(affiliateMatch) && affiliateMatch.length > 0) {
                    wa.affiliateId = affiliateMatch[0];
                }
            }

            // internal campaign
            if (urlUtils.getParamsByName('icid', currentUrl)) {
                wa.internalCampaign = wa.oldInternalCampaign = wa.removeSpecialChars(
                    urlUtils.getParamsByName('icid', currentUrl)
                );
            } else if (urlUtils.getParamsByName('icid2', currentUrl)) {
                wa.internalCampaign = wa.removeSpecialChars(
                    urlUtils.getParamsByName('icid2', currentUrl)
                );
                if (wa.internalCampaign.indexOf('_anaPath_') !== -1) {
                    var prevPath = digitalData.page.previousPageInfo.pageName || '';
                    wa.internalCampaign = wa.internalCampaign.replace(/_anaPath_/i, '_' +
                        prevPath + '_');
                }
            } else if (urlUtils.getParamsByName('int_cid', currentUrl)) {
                wa.internalCampaign = wa.oldInternalCampaign = wa.removeSpecialChars(
                    urlUtils.getParamsByName('int_cid', currentUrl)
                );
            }

            // google search rank
            if (ddPageInfo.referringURL.indexOf('.google.') >= 0) {
                if (urlUtils.getParamsByName('cd', ddPageInfo.referringURL)) {
                    wa.googleSearchDomain = wa.rDomain;
                    wa.googleSearchRank = urlUtils.getParamsByName('cd', ddPageInfo.referringURL);
                }
            }

        } catch (e) {}
    };

    // executes on every pageview
    wa.init = function () {
        wa.contentVariables();
        wa.platformVariables();
        wa.pageNamePrefix = '';

        // exclude certain useragents from making analytics calls
        wa.excludeUserAgent = false;
        wa.excludeUserAgent = (wa.userAgent.indexOf('GomezAgent') > -1) ?
            true : wa.excludeUserAgent;
        wa.excludeUserAgent = (wa.userAgent.indexOf('KTXN') > -1) ? true : wa.excludeUserAgent;
        wa.excludeUserAgent = (wa.userAgent.indexOf('Google Web Preview') > -1) ?
            true : wa.excludeUserAgent;

        // hack to prevent extra server calls for online reservations cross-domain iframes
        if (wa.cURL.indexOf('xdm_e=') != -1) {
            wa.allowPageView = false;
        }
    };
}());



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/legacyAnalytics/wa.js