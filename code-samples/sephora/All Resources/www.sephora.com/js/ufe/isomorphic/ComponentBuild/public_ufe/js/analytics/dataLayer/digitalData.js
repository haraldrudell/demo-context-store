/*
** This is the analytics data layer for UFE.
**/
const deepExtend = require('deep-extend');

(function () {

    //W3C Spec Data Layer - Declare basic defaults
    let digitalData = {
        cart: {
            attributes: {
                isPlayOrder: false,
                productIds: [],
                skuIds: [],
                shipCountry: '',
                doubleClick: {
                    allowedItems: [],
                    skuIds: [],
                    brandNames: [],
                    skuPrices: [],
                    ratings: []
                }
            },
            item: [],
            profile: {},
            total: {}
        },
        event: [],
        page: {
            attributes: {
                additionalPageInfo: '',
                campaigns: {
                    emailATGID: '',
                    emailHarmonyDeploymentId: '',
                    emailHarmonyLinkId: '',
                    emailHarmonyCustomerKey: '',
                    emailTrackingCode: '',
                    marketingChannel: '',
                    ursTrackingCode: ''
                },
                contentPillars: '',
                date: {
                    localDate: '',
                    dayName: '',
                    time: ''
                },
                eligibility: {
                    applePayEligibility: null
                },
                eventStrings: [],
                featureVariantKeys: [],
                productStrings: [],
                experience: '',
                externalRecommendations: {
                    audienceId: '',
                    experienceId: '',
                    vendor: ''
                },
                isPlayOrder: false,
                isTablet: false,
                isVisitorApiPresent: false,
                languageLocale: '',
                paidSearchCampaignId: '',
                path: [],
                platform: '',
                previousPageData: {
                    pageName: '',
                    linkData: '',
                    navigationInfo: '',
                    beautyTalkNavigationInfo: '',
                    events: [],
                    recInfo: {}
                },
                reportSuiteId: '',
                sephoraPageInfo: {
                    pageName: '',
                    contentCountry: ''
                },
                ursChannelId: '',
                world: '',
                tempProps: {
                    isEnrollToFlash: false
                }
            },
            category: {
                primaryCategory: '',
                pageType: '',
                doubleClickCategory: ''
            },
            pageInfo: {
                pageID: '',
                pageName: '',
                destinationURL: '',
                referringURL: '',
                breadcrumbs: [],
                language: '',
                sysEnv: '',
                country: ''
            }
        },
        pageInstanceId: '',
        /* Already declared in headScript.js */
        product: [],
        transaction: {
            attributes: {
                firstTransactionOnline: false,
                isPlayOrder: false,
                productIds: [],
                skuIds: []
            },
            item: [],
            profile: {},
            total: {
                transactionTotal: 0
            },
            transactionID: ''
        },
        user: [{
            profile: [{
                profileInfo: {
                    profileID: '',
                    profileStatus: '',
                    userName: ''
                }
            }],
            segment: {
                biStatus: '',
                biPlusFlash: '',
                biPoints: ''
            }
        }]
    };

    //We already declare and set some things that need to happen early, so now extend that
    window.digitalData = deepExtend(digitalData, window.digitalData);

})();



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/dataLayer/digitalData.js