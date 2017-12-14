const userUtils = require('utils/User');
const basketUtils = require('utils/Basket');
const skuUtils = require('utils/Sku');
const urlUtils = require('utils/Url');
const confirmModal = require('Actions').showInfoModal;

const getLovesList = require('actions/LoveActions').getLovesList;
const setLovesList = require('actions/LoveActions').setLovesList;
const showInterstice = require('Actions').showInterstice;
const showCountrySwitcherModal = require('Actions').showCountrySwitcherModal;
const showInfoModal = require('Actions').showInfoModal;
const updateCurrentUserSpecificProduct = require('actions/ProductActions').updateCurrentUserSpecificProduct;
const basketActions = require('actions/BasketActions');
const updateBasket = basketActions.updateBasket;
const updateWelcome = require('actions/WelcomePopupActions').updateWelcome;
const setTargeterResults = require('actions/TargeterActions').setResults;
const socialInfoActions = require('actions/SocialInfoActions');
const lithiumApi = require('services/api/thirdparty/Lithium');
const profileApi = require('services/api/profile');

const anaUtils = require('analytics/utils');
const processEvent = require('analytics/processEvent');
const anaConsts = require('analytics/constants');
const linkTrackingError = require('analytics/bindings/pages/all/linkTrackingError');
const scEvent = require('analytics/constants').Event;
const Locale = require('utils/LanguageLocale');
const Location = require('utils/Location');
const cookieUtils = require('utils/Cookies');
const basketApi = require('services/api/basket');
const biApi = require('services/api/beautyInsider');
const authenticationApi = require('services/api/authentication');

// (!) Until that issue is solved, AVOID USING DECORATORS in this module bc/ of
// the circular dependency on the Store that make a number of tests red.
// TODO Figure out what's wrong and how to address it properly.
// TODO After the above problem is solved, leverage withInterstice to eliminate
// showInterstice repetitions.
// const { withInterstice } = require('utils/decorators');

const LOCAL_STORAGE = require('utils/localStorage/Constants');
const LITHIUM_SESSION_KEY_COOKIE_NAME = 'LiSESSIONID';

//TODO: 17.6 LITHIUM_API_TOKEN_COOKIE_NAME cookie name will need to be updated
const LITHIUM_API_TOKEN_COOKIE_NAME = 'lithiumSSO:sephora.qa';
const TOKY_AUTH_COOKIE_NAME = 'toky_auth_sso';

const Storage = require('utils/localStorage/Storage');
const USER_DATA_EXPIRY = Storage.HOURS * 1;

const TYPES = {
    SIGN_IN: 'USER.SIGN_IN',
    UPDATE: 'USER.UPDATE',
    NOT_FOUND: 'USER.NOT_FOUND'
};

const ERROR_CODES = { STORE_REGISTERED_ERROR_CODE: 202 };

const MESSAGE_TYPES = { MERGED_BASKET: 'orderMergedMsg' };

const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

const FRAGMENT_FOR_UPDATE = {
    NAME: 'NAME',
    EMAIL: 'EMAIL',
    PASSWORD: 'PASSWORD',
    EMAIL_SUBSCRIPTION: 'EMAIL_SUBSCRIPTION'
};

/**
 * Sets user data to legacy MW jStorage cookie.  All information set via
* UserAction.update will be set directly in jStorage.userinfo.
 *
 * TODO: Remove once all legacy MW pages are converted.
 *
 * @param data
 */
function shimLegacyMW(data) {
    let jStorage = window.localStorage.getItem(LOCAL_STORAGE.LEGACY_MW_JSTORAGE);

    jStorage !== null ? jStorage = JSON.parse(jStorage) : jStorage = {};

    if (!jStorage.userinfo) {
        jStorage.userinfo = {};
    }

    Object.assign(jStorage.userinfo, data);

    try {
        window.localStorage.setItem(
            LOCAL_STORAGE.LEGACY_MW_JSTORAGE,
            JSON.stringify(jStorage)
        );
    } catch (e) {
        // Just silencing QuotaExceededError in Safari Incognito mode,
        // where localStorage is not working.
    }
}

function shimLegacyFS(data) {
    //TODO 17.2: populate necessary data in fullsite (Is there anything we need to do here -
    // set cookies, etc?
}

/**
 * Updates user profile information in local storage subsequently updates store.
 * @param  {object} data - user profile object
 * @param  {boolean} purgeUserCache - Whether to clear user data cache. This is set to true by
 * default except when the data comes from processUserFull, which is the cache's source of data.
 */
function update(data, purgeUserCache = true) {

    if (purgeUserCache) {
        Storage.local.removeItem(LOCAL_STORAGE.USER_DATA);
    }

    shimLegacyMW(data);
    shimLegacyFS(data);

    return {
        type: TYPES.UPDATE,
        data: data
    };
}

function updateUserFragment(optionParams, successCallback, failureCallback) {
    return (dispatch) => {
        dispatch(showInterstice(true));

        profileApi.updateProfile(optionParams).
            then(data => {
                let fragmentForUpdate = optionParams.fragmentForUpdate;

                if (fragmentForUpdate === FRAGMENT_FOR_UPDATE.EMAIL) {
                    data.login = optionParams.email;
                } else if (fragmentForUpdate === FRAGMENT_FOR_UPDATE.NAME) {
                    data.firstName = optionParams.firstName;
                    data.lastName = optionParams.lastName;
                } else if (fragmentForUpdate === FRAGMENT_FOR_UPDATE.EMAIL_SUBSCRIPTION) {
                    data.emailSubscriptionInfo = optionParams.emailSubscriptionInfo;
                }

                // note: for password, there is nothing in the user store to update
                dispatch(update(data));
                successCallback();
                dispatch(showInterstice(false));

            }).
            catch(reason => {
                if (reason.errorMessages || reason.responseStatus === 403) {
                    failureCallback(reason);
                }
            });
    };
}

/* process user full get api request, set new target information */
function processUserFull(userInfoData, showWelcome, dataIsFromCache = false) {
    return (dispatch) => {
        /* Cache response for logged-in and recognized users for 1 hour if data does not originate
        from cache */
        if (userInfoData.profile.profileStatus !== userUtils.PROFILE_STATUS.ANONYMOUS &&
            !dataIsFromCache) {
            Storage.local.setItem(LOCAL_STORAGE.USER_DATA, userInfoData, USER_DATA_EXPIRY);
        }

        // Load targeter data
        let targeterResult = userInfoData.targetersResult;
        if (targeterResult) {
            dispatch(setTargeterResults(targeterResult));
        }

        let nickname = userInfoData.profile.nickName;
        let profileId = userInfoData.profile.profileId;
        const LITHIUM_API_TOKEN = cookieUtils.read(LITHIUM_API_TOKEN_COOKIE_NAME);
        const LITHIUM_SESSION_KEY = cookieUtils.read(LITHIUM_SESSION_KEY_COOKIE_NAME);

        dispatch(update(userInfoData.profile, false));
        dispatch(updateBasket(userInfoData.basket));
        dispatch(setLovesList(userInfoData.shoppingList));

        userInfoData.product && dispatch(updateCurrentUserSpecificProduct(userInfoData.product));

        //Check that user has nickname before making any lithium calls
        if (nickname) {
            // when there is no token cookie, make sso token api call and set cookie
            let getLithiumSSOToken = new Promise(resolve => {
                if (!LITHIUM_API_TOKEN) {
                    profileApi.getLithiumSSOToken(profileId).then(lithiumSsoToken => {
                        cookieUtils.write(LITHIUM_API_TOKEN_COOKIE_NAME, lithiumSsoToken);
                        resolve(lithiumSsoToken);
                    });
                } else {
                    resolve();
                }
            });

            getLithiumSSOToken.
                then(() => lithiumApi.getAuthenticatedUserSocialInfo(nickname)).
                then(data => {
                    data.isLithiumSuccessful = true;
                    dispatch(socialInfoActions.setUserSocialInfo(data));
                }).
                catch(reason => {
                    console.debug('Lithium failed post user full call: ', reason);
                    dispatch(socialInfoActions.setLithiumSuccessStatus(false));
                });
        }

        if (showWelcome) {
            dispatch(updateWelcome(userInfoData.profile.welcomeMat || {}));
        }
    };
}

/** api call for full user profile. returns a promise so that during sign in, analytics
 * can sequentially get updated user info.
 */
function getUserFull(productPageData = null, callback) {
    return (dispatch) => {
        let targetersCsv = Sephora.targetersToInclude.substr('?includeTargeters='.length);

        let requestOptions = {};

        if (productPageData) {
            requestOptions.productId = productPageData.productId;
            requestOptions.preferedSku = productPageData.skuId;
        }

        if (targetersCsv.length) {
            requestOptions.includeTargeters = targetersCsv;
        }


        dispatch(showInterstice(true));

        return profileApi.getProfileFullInformation('current', requestOptions).
            then(data => {
                dispatch(processUserFull(data, false));
                callback && callback();
                dispatch(showInterstice(false));
            }).
            catch(reason => {
                dispatch(showInterstice(false));
            });
    };
}

function updateUserInformation(updatedInfo, successCallback, failureCallback) {
    return (dispatch) => {
        dispatch(showInterstice(true));

        profileApi.updateProfile(updatedInfo).
            then(data => {
                dispatch(showInterstice(false));
                successCallback(data);
            }).
            catch(reason => {
                failureCallback(reason);
            });

    };
}

function register(profileData, successCallback, failureCallback) {
    return (dispatch) => {
        dispatch(showInterstice(true));

        profileApi.createUser(profileData).
            then(data => {

                if (data.responseStatus === ERROR_CODES.STORE_REGISTERED_ERROR_CODE) {
                    profileApi.lookupProfileByLogin(profileData.userDetails.login).
                        then(data2 => {
                            failureCallback({
                                errorCode: ERROR_CODES.STORE_REGISTERED_ERROR_CODE,
                                data: data2
                            });
                            dispatch(showInterstice(false));
                        });

                } else {
                    data.firstName = profileData.userDetails.firstName;
                    data.lastName = profileData.userDetails.lastName;
                    data.login = profileData.userDetails.login;

                    dispatch(update(data));
                    dispatch(getLovesList(data.profileId));

                    //Analytics
                    let eventStrings = [
                        scEvent.CAPTCHA_ENTERED,
                        scEvent.REGISTRATION_SUCCESSFUL
                    ];
                    if (profileData.isJoinBi) {
                        eventStrings.push(scEvent.REGISTRATION_WITH_BI);
                    } else {
                        eventStrings.push(scEvent.REGISTRATION_WITHOUT_BI);
                    }

                    if (profileData.subscription &&
                        profileData.subscription.subScribeToEmails) {
                        eventStrings.push(scEvent.EMAIL_OPT_IN);
                    }

                    // Since popups overwrite page name with their title, we need to
                    // provide the initial page name here.
                    processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                        data: {
                            pageName:
                            digitalData.page.attributes.sephoraPageInfo.pageName,
                            pageType: digitalData.page.category.pageType,
                            pageDetail: digitalData.page.pageInfo.pageName,
                            eventStrings: eventStrings,
                            linkData: data.ssiToken ? anaConsts.LinkData.SSI : null,
                            navigationInfo: null
                        }
                    });

                    successCallback();

                    dispatch(showInterstice(false));
                }
            }).
            catch(reason => {
                if (reason.errorMessages) {
                    failureCallback(reason);

                    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                        data: {
                            bindingMethods: linkTrackingError,
                            errorMessages: reason.errorMessages,
                            eventStrings: [
                                scEvent.CAPTCHA_ENTERED,
                                scEvent.CAPTCHA_FAILED
                            ],
                            usePreviousPageName: true
                        }
                    });
                }

                dispatch(showInterstice(false));
            });
    };
}

function biRegister(biData, successCallback, failureCallback) {
    return (dispatch) => {
        dispatch(showInterstice(true));

        biApi.createBiAccount(biData).
            then(data => {
                dispatch(getUserFull());
                successCallback();

                processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                    data: {
                        pageName: digitalData.page.attributes.sephoraPageInfo.pageName,
                        pageDetail: digitalData.page.pageInfo.pageName,
                        pageType: digitalData.page.category.pageType,
                        eventStrings: [
                            scEvent.REGISTRATION_WITH_BI,
                            scEvent.REGISTRATION_SUCCESSFUL
                        ]
                    }
                });

                dispatch(showInterstice(false));
            }).
            catch(reason => {
                if (data.errorMessages) {
                    failureCallback(reason);
                }

                dispatch(showInterstice(false));
            });
    };
}

function showWarnings(response, dispatch) {
    if (response.warnings && response.warnings.length) {
        if (response.warnings.filter(message => basketUtils.isMergeBasketWarning(message)).length) {
            let message = response.warnings[0];
            dispatch(basketActions.showError({ orderMergedMsg: message }));
        } else {
            dispatch(showInfoModal(true, 'Warning', message));
        }
    }
}

function signInSuccess(dispatch, response, getState, successCallback) {
    // Analytics
    // Since popups overwrite page name with their title, provide the initial page name here.
    let analyticsData = {
        pageName: digitalData.page.attributes.sephoraPageInfo.pageName,
        pageDetail: digitalData.page.pageInfo.pageName,
        pageType: digitalData.page.category.pageType,
        eventStrings: [
            scEvent.SIGN_IN_ATTEMPT,
            scEvent.SIGN_IN_SUCCESS
        ],
        linkData: response.ssiToken ? anaConsts.LinkData.SSI : null
    };

    // Log user into toky woky if its on the current page and they are socially enabled
    if (window.toky && response.isSocialEnabled) {

        // Only call from here if user signs in from nav header
        if (!Sephora.TokyWoky.isSignInThroughChat && !Sephora.TokyWoky.CommunitySignIn) {
            const tokyWokyApi = require('services/api/thirdparty/tokyWoky');
            tokyWokyApi.getTokyWokySSOToken().then(data => {
                let tokyAuthData =
                    `${data.tokyWokyAuthPublicKey}:${data.tokyWokyAuthMessage}:` +
                    `${data.tokyWokyAuthHmac}:${data.tokyWokyAuthTimestamp}`;
                toky.utils.createCookie(TOKY_AUTH_COOKIE_NAME, tokyAuthData, 0);

                //reload tokywoky chat to update user in chat
                toky.utils.reloadFrameSrc(toky.html.frameToky.src);
            });
        }
    }

    //We must wait for userFull so that things like basket.items and user specific product details
    // are up to date
    let productPageData = skuUtils.getProductPageData();
    dispatch(getUserFull(productPageData)).then(function () {

        if (typeof successCallback === 'function') {
            successCallback(response);
        }

        //Enrich data if basket merge occurred
        /* eslint-disable array-callback-return */
        response.profileWarnings && response.profileWarnings.map(warning => {
            if (warning.messageContext === MESSAGE_TYPES.MERGED_BASKET) {
                if (digitalData.page.pageInfo.pageName === anaConsts.PAGE_NAMES.BASKET) {
                    analyticsData.eventStrings = analyticsData.eventStrings.concat(
                        [
                            anaConsts.Event.SC_VIEW,
                            anaConsts.Event.EVENT_37
                        ]
                    );
                    analyticsData.productStrings =
                        anaUtils.buildProductStrings(getState().basket.items);
                }
            }
        });

        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, { data: analyticsData });
    });

    //End Analytics

    // If a warning was found (like merge basket), display it as an InfoModal or inline for Basket
    showWarnings(response, dispatch);

    // TODO: play-specific cases (handle later)
    //     if (res.errorMessages && res.errorMessages.length > 0) {
    //         if (SM.env.isPlayQuiz) {
    //             $(window).trigger('btEvent.event_play_landing_error', res.errorMessages[0]);
    //         }
    //     } else {
    //             if (isPlay) {
    //                 if (SM.is.checkout()) {
    //                     SM.util.Location.location('/play');
    //                 } else {
    //                     playSpecificSuccess();
    //                 }
    //
    //             }
    //     }
}


function signIn(login, password, isKeepSignedIn, loginForCheckout,
                successCallback, failureCallback) {
    return (dispatch, getState) => {

        dispatch(showInterstice(true));

        authenticationApi.login(login, password, { loginForCheckout, isKeepSignedIn }).
            then(data => {

                /** Reload if a different locale.  Profile locale does not exist on POS user,
                 * so do not want to trigger page reload
                 */
                if (!data.isStoreBiMember && data.profileLocale !== getState().user.profileLocale) {
                    //Set successful login analytics events before reloading
                    anaUtils.setNextPageData({
                        events: [scEvent.SIGN_IN_ATTEMPT, scEvent.SIGN_IN_SUCCESS]
                    });
                    Location.reload();
                } else {
                    if (!data.isStoreBiMember) {
                        signInSuccess(dispatch, data, getState, successCallback);
                    }
                }

                dispatch(showInterstice(false));

            }).catch(reason => {

                failureCallback(reason);

                //Analytics
                processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                    data: {
                        bindingMethods: linkTrackingError,
                        errorMessages: reason.errorMessages,
                        eventStrings: [
                            scEvent.SIGN_IN_ATTEMPT,
                            scEvent.SIGN_IN_FAILED
                        ],
                        usePreviousPageName: true
                    }
                });

                dispatch(showInterstice(false));
            });
    };
}

//
// function playSpecificSuccess() {
//
//
//     var postData = {
//         profileId : SM.getUserId(),
//         "skuList": [
//             {
//                 "skuId": mainObj.activeSku,
//                 "qty": 1
//             }
//         ]
//     };
//     $.ajax({
//         url : SM.getRestLocation('/api/shopping-cart/playSubscription'),
//         processData : false,
//         contentType : 'application/json',
//         data : JSON.stringify(postData),
//         type : 'POST',
//         error : function(xhr, textStatus, err) {
//             if(xhr.status == 403) {
//                 SM.controller.Authenticate.lazyInjectAuth('/checkout');
//                 $('#modal-signin').modal('show');
//             } else {
//                 SM.util.RestInterceptor.handleRestError(xhr, textStatus, err);
//             }
//         },
//         success : SM.util.RestInterceptor.handleSuccess(true, function(o) {
//             if(o.subScriptionStatus === 'SUCCESS'){
//                 window.location = '/checkout';
//             }
//             if(o.errorCode && o.errorCode === 403){
//                 SM.controller.Authenticate.lazyInjectAuth('/checkout');
//                 $('#modal-signin').modal('show');
//             }
//         })
//     });
// }

function signOut(redirect, confirmed = false) {
    /* eslint-disable consistent-return */
    return (dispatch) => {
        // Throw a warning modal that the basket will be lost if only samples/rewards < 750 point
        if (!confirmed && !basketUtils.isEmpty() &&
            basketUtils.isOnlySamplesRewardsInBasket(true)) {
            return dispatch(
                confirmModal(
                    true,
                    'Confirmation',
                    'The following items will be removed: All non-merchandise except gift cards. ' +
                        'Are you sure you want to continue?',
                    'Continue',
                    () => {
                        dispatch(signOut(redirect, true));
                        dispatch(confirmModal(false));
                    }, true
                )
            );
        }

        if (!redirect || redirect === '') {
            redirect = '/';
        }

        authenticationApi.logout().
            then(() => {
                //if (res.errorMessages && res.errorMessages.length > 0) {
                //    // TODO: dispatch error
                //    //A.warning(res.errorMessages);
                //} else {

                /*
                ** Explicitly clearing cached TestTarget && user data so TestTarget service can
                ** accurately validate when loading if it depends on the
                ** userInfo service to execute.
                */
                Storage.local.removeItem(LOCAL_STORAGE.TARGET_PARAMS);
                Storage.local.removeItem(LOCAL_STORAGE.USER_DATA);
                Storage.local.removeItem(LOCAL_STORAGE.SVA_DATA);
                Storage.local.removeItem(LOCAL_STORAGE.BASKET);

                //set lithium session key to 0, to mimic delete
                cookieUtils.write(LITHIUM_SESSION_KEY_COOKIE_NAME, 0);

                //write toky cookies with empty string when user logs out from any page
                cookieUtils.write(TOKY_AUTH_COOKIE_NAME, '', 0, true);

                // Logout user from toky woky on pages with chat enabled then reload page, even if
                // error in toky woky code.
                if (window.toky) {
                    window.toky.api.logout().then(() => {
                        urlUtils.redirectTo(redirect);
                    }).catch(e => {
                        urlUtils.redirectTo(redirect);
                    });
                } else {
                    urlUtils.redirectTo(redirect);
                }

                //
                //    // TODO: discuss if we want http<-->https cleanup
                //    // only need if we're using locally stored user data to render page.
                //    // Not needed if only using that data for T&T.
                //    // Question is performance on mobile
                //    /*
                //     // CORS expunge only works on    http:
                //     if(window.location.protocol == 'http:') {
                //     let redirectTimeout = setTimeout(function() {
                //     SM.warn('expunge timeout hit');
                //     window.location = sRedirect;
                //     }, 5000);
                //     $(window).on('expungeComplete', function() {
                //     SM.info('Expunge complete');
                //     clearTimeout(redirectTimeout);
                //     if(typeof playCallback === 'function'){
                //     playCallback();
                //     return;
                //     }
                //     window.location = sRedirect;
                //     });
                //     SM.util.CrossOrigin.expunge();
                //     } else {
                //     _expungeUserData();
                //     if(typeof playCallback === 'function'){
                //     playCallback();
                //     return;
                //     } else {
                //     window.location = sRedirect + '#signout';
                //     }
                //     if (window.location.pathname == sRedirect){
                //     SM.util.Location.reload();
                //     }
                //     }
                //     */
                //}
            }).
            catch(reason => {
                // TODO: dispatch error
                //SM.util.RestInterceptor.handleRestError
            });
    };
}

function checkUser(login, successCallback, failureCallback) {
    return (dispatch) => {

        dispatch(showInterstice(true));

        profileApi.lookupProfileByLogin(login).
            then(data => {
                successCallback(data);
                dispatch(showInterstice(false));
            }).
            catch(reason => {
                failureCallback(reason);
                dispatch(showInterstice(false));
            });
    };
}

function sendForgotPassword(dispatch, login, successCallback, failureCallback) {
    dispatch(showInterstice(true));
    authenticationApi.resetPasswordByLogin(login).
        then(data => {
            successCallback(data);
            dispatch(showInterstice(false));
        }).catch(reason => {
            failureCallback(reason);
            dispatch(showInterstice(false));
        });
}

function forgotPassword(login, successCallback, failureCallback) {
    return (dispatch) => {

        dispatch(showInterstice(true));

        profileApi.getProfileForPasswordReset(login).
            then(() => {
                sendForgotPassword(dispatch, login, successCallback, failureCallback);
                dispatch(showInterstice(false));
            }).
            catch(reason => {
                failureCallback(reason);
                dispatch(showInterstice(false));
            });
    };
}

function switchCountry(ctry, lang) {
    return (dispatch) => {
        profileApi.switchCountry(ctry || Locale.COUNTRIES.US, lang || Locale.LANGUAGES.EN).
            then(data => {
                //Analytics
                anaUtils.setNextPageData({
                    navigationInfo: anaUtils.buildNavPath(['toolbar', 'change country',
                        data.profileLocale.toLowerCase() + '-' +
                        data.profileLanguage.toLowerCase()])
                });

                /**
                 * Clear basket and category data cache whenever user switches country due to
                 * restrictions that may appear per locale.
                 */
                Storage.local.removeItem(LOCAL_STORAGE.CATNAV);
                Storage.local.removeItem(LOCAL_STORAGE.BASKET);
                Storage.local.removeItem(LOCAL_STORAGE.USER_DATA);

                let redirect = () => {
                    if (data.redirectPath) {
                        urlUtils.redirectTo(data.redirectPath);
                    } else {
                        urlUtils.redirectTo(window.location.pathname);
                    }
                };

                // Show any warnings that occurred
                if (data.profileWarnings) {
                    let message = '';
                    for (var i = 0, n = data.profileWarnings.length; i < n; i++) {
                        message += data.profileWarnings[i].messages[0] + ' ';
                    }

                    dispatch(showCountrySwitcherModal(false));
                    dispatch(showInfoModal(true, 'Warning', message, null, redirect));
                } else {
                    redirect();
                }
            });
    };
}

function playSubscription(skuId, productId) {
    const setPlayProductCookie = function () {
        let date = new Date();
        date.setTime(date.getTime() + MILLISECONDS_IN_DAY);
        date = date.toUTCString();
        let playSubscriptionCookie =
            'playSubscribeNowClicked=' + productId + '; Expires' + date + ';path=/';
        document.cookie = playSubscriptionCookie;
    };
    const setPlayCookieAndCheckout = function (subscribeToPlay = false, authData) {
        // Set cookie to accessed from checkout page load
        setPlayProductCookie();
        if (subscribeToPlay) {
            basketApi.subscribeToPlay(skuId, authData).then(() => {
                urlUtils.redirectTo('/checkout');
            });
        } else {
            urlUtils.redirectTo('/checkout');
        }
    };

    return (dispatch) => {
        basketApi.subscribeToPlay(skuId).then(function (response) {
            const auth = require('utils/Authentication');
            if (response.subScriptionStatus === 'SUCCESS') {
                setPlayCookieAndCheckout();
            } else if (response.subScriptionStatus === 'NEEDS_LOG_IN') {
                auth.requireAuthentication(true, true).then((data) =>
                    setPlayCookieAndCheckout(true, data));
            }

            if (response.errorCode && response.errorCode === 403){
                auth.requireAuthentication(true, true).then((data) =>
                    setPlayCookieAndCheckout(true, data));
            } else if (response.errorCode) {
                urlUtils.redirectTo('/play');
            }

        }).catch(function (error) {
            // @ToDo: Capture error state
            console.log(error);
        });
    };
}

module.exports = {
    ERROR_CODES,
    TYPES,
    FRAGMENT_FOR_UPDATE,
    register,
    biRegister,
    update,
    signIn,
    signOut,
    processUserFull,
    checkUser,
    forgotPassword,
    switchCountry,
    updateUserInformation,
    updateUserFragment,
    getUserFull,
    playSubscription
};



// WEBPACK FOOTER //
// ./public_ufe/js/actions/UserActions.js