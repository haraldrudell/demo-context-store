const processEvent = require('analytics/processEvent');
const anaConsts = require('analytics/constants');
const anaUtils = require('analytics/utils');

const TYPES = {
    LOAD_MORE_PRODUCTS: 'LOAD_MORE_PRODUCTS',
    UPDATE_PRODUCT_SORT: 'UPDATE_PRODUCT_SORT',
    SHOW_HAMBURGER_MENU: 'SHOW_HAMBURGER_MENU',
    SHOW_BCC_MODAL: 'SHOW_BCC_MODAL',
    SHOW_SIGN_IN_MODAL: 'SHOW_SIGN_IN_MODAL',
    SHOW_REGISTER_MODAL: 'SHOW_REGISTER_MODAL',
    SHOW_BI_REGISTER_MODAL: 'SHOW_BI_REGISTER_MODAL',
    SHOW_FORGOT_PASSWORD_MODAL: 'SHOW_FORGOT_PASSWORD_MODAL',
    SHOW_INFO_MODAL: 'SHOW_INFO_MODAL',
    SHOW_SAMPLE_MODAL: 'SHOW_SAMPLE_MODAL',
    SHOW_VIDEO_MODAL: 'SHOW_VIDEO_MODAL',
    SHOW_PROMO_MODAL: 'SHOW_PROMO_MODAL',
    SHOW_REWARD_MODAL: 'SHOW_REWARD_MODAL',
    SHOW_QUICK_LOOK_MODAL: 'SHOW_QUICK_LOOK_MODAL',
    SHOW_MEDIA_MODAL: 'SHOW_MEDIA_MODAL',
    SHOW_COLOR_IQ_MODAL: 'SHOW_COLOR_IQ_MODAL',
    SHOW_STICKY_BANNER: 'SHOW_STICKY_BANNER',
    UPDATE_QUICK_LOOK: 'UPDATE_QUICK_LOOK',
    SHOW_COUNTRY_SWITCHER_MODAL: 'SHOW_COUNTRY_SWITCHER_MODAL',
    SHOW_COUNTRY_SWITCHER_PROMPT: 'SHOW_COUNTRY_SWITCHER_PROMPT',
    SHOW_INTERNATIONAL_SHIPPING_MODAL: 'SHOW_INTERNATIONAL_SHIPPING_MODAL',
    SHOW_EMAIL_WHEN_IN_STOCK_MODAL: 'SHOW_EMAIL_WHEN_IN_STOCK_MODAL',
    SHOW_INTERSTICE: 'SHOW_INTERSTICE',
    ENABLE_APPLEPAY_SESSION: 'ENABLE_APPLEPAY_SESSION',
    SHOW_SHARE_LINK_MODAL: 'SHOW_SHARE_LINK_MODAL',
    SHOW_PRODUCT_FINDER_MODAL: 'SHOW_PRODUCT_FINDER_MODAL',
    SHOW_FIND_IN_STORE_MODAL: 'SHOW_FIND_IN_STORE_MODAL',
    SHOW_FIND_IN_STORE_MAP_MODAL: 'SHOW_FIND_IN_STORE_MAP_MODAL'
};

const wrapForLegacyAction = require('actions/Legacy').wrapForLegacyAction;

module.exports = {
    TYPES: TYPES,

    loadMoreProducts: function (products) {
        return {
            type: TYPES.LOAD_MORE_PRODUCTS,
            products: products
        };
    },

    updateProductSort: function (sortOption) {
        return {
            type: TYPES.UPDATE_PRODUCT_SORT,
            sortOption: sortOption
        };
    },

    // Hamburger Menu
    showHamburgerMenu: wrapForLegacyAction(
        Sephora.legacy && Sephora.legacy.Actions && Sephora.legacy.Actions.showHamburgerMenu ?
            Sephora.legacy.Actions.showHamburgerMenu.bind(null, TYPES.SHOW_HAMBURGER_MENU) : null,
        function (isOpen) {
            if (isOpen) {
                processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                    data: {
                        eventStrings: ['event71'],
                        linkName: anaUtils.buildNavPath(['left nav', 'hamburger']),
                        navigationInfo: anaUtils.buildNavPath(['left nav', 'hamburger'])
                    }
                });
            }

            return {
                type: TYPES.SHOW_HAMBURGER_MENU,
                isOpen: isOpen
            };
        }
    ),

    // Modals
    showBccModal: wrapForLegacyAction(
        Sephora.legacy && Sephora.legacy.Actions ? Sephora.legacy.Actions.showBccModal : null,
        function (isOpen, bccModalTemplate, bccParentComponentName) {
            return {
                type: TYPES.SHOW_BCC_MODAL,
                isOpen: isOpen,
                bccModalTemplate: bccModalTemplate,
                bccParentComponentName: bccParentComponentName
            };
        }
    ),

    //TODO: refactor these aprameters getting passed through.  It's super hacky and will only get
    // worse as we add more special cases relating to signin
    // jscs:disable maximumLineLength
    showSignInModal: wrapForLegacyAction(
        Sephora.legacy && Sephora.legacy.Actions ? Sephora.legacy.Actions.showSignInModal : null,
        function (isOpen, messages, callback, isNewUserFlow = false, analyticsData = {}, errback) {

            //Analytics - Track Sign-In Modal
            let signInData = {
                pageName: 'sign in:sign in:n/a:*',
                pageType: 'sign in',
                pageDetail: 'sign in'
            };

            if (isOpen) {
                Object.assign(signInData, analyticsData);

                processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                    data: signInData
                });
            }
            //end Analtytics

            return {
                type: TYPES.SHOW_SIGN_IN_MODAL,
                isOpen: isOpen,
                isNewUserFlow: isNewUserFlow,
                messages: messages,
                callback: callback,
                errback: errback
            };
        }
    ),

    showForgotPasswordModal: wrapForLegacyAction(
        Sephora.legacy && Sephora.legacy.Actions && Sephora.legacy.Actions.showInfoModal ?
            Sephora.legacy.Actions.showInfoModal : null,
        function (isOpen, email) {
            return {
                type: TYPES.SHOW_FORGOT_PASSWORD_MODAL,
                isOpen: isOpen,
                email: email
            };
        }
    ),

    /*
        ARGUMENTS FOR SHOW INFO MODAL
        isOpen: boolean
        title: string for title section of modal (optional)
        message: string for body of modal
        buttonText: string for the button text (Yes, Confirm) (optional)
        callback: function to run after user clicks the confirm button (optional)
        showCancelButton: boolean, displays optional cancel button (optional, defaults to false)
        cancelText: string for the cancel button text (showCancelButton needs to be true)
        isHtml: boolean for whether the message is html or not (optional, defaults to false)
        confirmMsgObj: contains title and message for a confirmation modal
            that is launched after click confirm or yes button (optional)
    */
    showInfoModal: wrapForLegacyAction(
        Sephora.legacy && Sephora.legacy.Actions && Sephora.legacy.Actions.showInfoModal ?
            Sephora.legacy.Actions.showInfoModal : null,
        function (
            isOpen,
            title,
            message,
            buttonText,
            callback,
            showCancelButton,
            cancelText,
            isHtml,
            confirmMsgObj,
            cancelCallback) {
            return {
                type: TYPES.SHOW_INFO_MODAL,
                isOpen: isOpen,
                title: title,
                message: message,
                buttonText: buttonText,
                callback: callback,
                showCancelButton: showCancelButton,
                cancelText: cancelText,
                isHtml: isHtml,
                confirmMsgObj: confirmMsgObj,
                cancelCallback: cancelCallback
            };
        }
    ),

    showMediaModal: function (isOpen, mediaId, title, modalClose) {
        return {
            type: TYPES.SHOW_MEDIA_MODAL,
            isOpen: isOpen,
            mediaId: mediaId,
            title: title,
            modalClose: modalClose
        };
    },

    showColorIQModal: function (isOpen, callback) {
        return {
            type: TYPES.SHOW_COLOR_IQ_MODAL,
            isOpen: isOpen,
            callback: callback
        };
    },

    // jscs:disable maximumLineLength
    showRegisterModal: wrapForLegacyAction(
        Sephora.legacy && Sephora.legacy.Actions ? Sephora.legacy.Actions.showRegisterModal : null,
        function (isOpen, message, callback, userEmail, isStoreUser, biData, errback) {
            return {
                type: TYPES.SHOW_REGISTER_MODAL,
                isOpen: isOpen,
                message: message,
                callback: callback,
                presetLogin: userEmail,
                isStoreUser: isStoreUser,
                biData: biData,
                errback: errback
            };
        }
    ),

    showBiRegisterModal: wrapForLegacyAction(
        Sephora.legacy && Sephora.legacy.Actions && Sephora.legacy.Actions.showBiRegisterModal ?
            Sephora.legacy.Actions.showBiRegisterModal : null,
        function (isOpen, callback, isCommunity, cancellationCallback = null) {
            return {
                type: TYPES.SHOW_BI_REGISTER_MODAL,
                isOpen: isOpen,
                callback: callback,
                cancellationCallback: cancellationCallback,
                isCommunity: isCommunity
            };
        }
    ),

    forceRegisterModal: wrapForLegacyAction(
        Sephora.legacy && Sephora.legacy.Actions && Sephora.legacy.Actions.forceRegisterModal ?
            Sephora.legacy.Actions.forceRegisterModal : null,
        function (isOnlyBI) {
            if (isOnlyBI) {
                // User is already registered, show BI Register Modal
                return {
                    type: TYPES.SHOW_BI_REGISTER_MODAL,
                    isOpen: true
                };
            } else {
                return {
                    type: TYPES.SHOW_REGISTER_MODAL,
                    isOpen: true
                };
            }
        }
    ),

    showSampleModal: function (isOpen, sampleList, allowedQtyPerOrder, samplesMessage) {
        return {
            type: TYPES.SHOW_SAMPLE_MODAL,
            isOpen: isOpen,
            sampleList: sampleList,
            allowedQtyPerOrder: allowedQtyPerOrder,
            samplesMessage: samplesMessage
        };
    },

    showVideoModal: function (config) {
        return {
            type: TYPES.SHOW_VIDEO_MODAL,
            isOpen: config.isOpen,
            videoTitle: config.videoTitle,
            videoModalUpdated: config.videoModalUpdated,
            video: config.video
        };
    },

    showPromoModal: function (isOpen, promosList, maxMsgSkusToSelect, instructions, promoCode) {
        return {
            type: TYPES.SHOW_PROMO_MODAL,
            isOpen: isOpen,
            promoCode: promoCode,
            promosList: promosList,
            maxMsgSkusToSelect: maxMsgSkusToSelect,
            instructions: instructions
        };
    },

    showRewardModal: function (isOpen) {
        return {
            type: TYPES.SHOW_REWARD_MODAL,
            isOpen: isOpen
        };
    },

    showQuickLookModal: function (isOpen, skuType, sku, isCertonaProduct) {
        return {
            type: TYPES.SHOW_QUICK_LOOK_MODAL,
            isOpen: isOpen,
            skuType: skuType,
            sku: sku,
            isCertonaProduct: isCertonaProduct
        };
    },

    showStickyBanner: function (isOpen, height) {
        return {
            type: TYPES.SHOW_STICKY_BANNER,
            isOpen: isOpen,
            height: isOpen ? height : 0
        };
    },

    enableApplePaySession: function (isActive) {
        return {
            type: TYPES.ENABLE_APPLEPAY_SESSION,
            isActive: isActive
        };
    },

    showEmailMeWhenInStockModal: wrapForLegacyAction(
        Sephora.legacy && Sephora.legacy.Actions &&
            Sephora.legacy.Actions.showEmailMeWhenInStockModal ?
            Sephora.legacy.Actions.showEmailMeWhenInStockModal : null,
        function (isOpen, product, currentSku, isQuickLook) {
            return {
                type: TYPES.SHOW_EMAIL_WHEN_IN_STOCK_MODAL,
                isOpen: isOpen,
                product: product,
                currentSku: currentSku,
                isQuickLook: isQuickLook
            };
        }
    ),

    updateQuickLookContent: function (product, sku) {
        return {
            type: TYPES.UPDATE_QUICK_LOOK,
            quickLookProduct: product,
            sku: sku
        };
    },

    // jscs:disable maximumLineLength
    showCountrySwitcherModal: wrapForLegacyAction(
        Sephora.legacy && Sephora.legacy.Actions ?
            Sephora.legacy.Actions.showCountrySwitcherModal :
            null,
        function (isOpen, ctry, lang, ctryName) {
            return {
                type: TYPES.SHOW_COUNTRY_SWITCHER_MODAL,
                isOpen: isOpen,
                desiredCountry: ctry,
                desiredLang: lang,
                switchCountryName: ctryName
            };
        }
    ),

    showCountrySwitcherPrompt: wrapForLegacyAction(
        Sephora.legacy && Sephora.legacy.Actions ?
            Sephora.legacy.Actions.showCountrySwitcherPrompt :
            null,
        function (isOpen) {
            // MW Hamburger Menu modal
            return {
                type: TYPES.SHOW_COUNTRY_SWITCHER_PROMPT,
                isOpen: isOpen
            };
        }
    ),

    showInternationalShippingModal: function (isOpen) {
        return {
            type: TYPES.SHOW_INTERNATIONAL_SHIPPING_MODAL,
            isOpen: isOpen
        };
    },

    // Interstice

    showInterstice: function (isVisible) {
        return {
            type: TYPES.SHOW_INTERSTICE,
            isVisible: isVisible
        };
    },

    showShareLinkModal: function (isOpen, title, shareUrl) {
        return {
            type: TYPES.SHOW_SHARE_LINK_MODAL,
            isOpen: isOpen,
            title: title,
            shareUrl: shareUrl
        };
    },

    showProductFinderModal: function (isOpen, bccData) {
        return {
            type: TYPES.SHOW_PRODUCT_FINDER_MODAL,
            isOpen: isOpen,
            bccData: bccData
        };
    },

    showFindInStoreModal: function (isOpen, currentProduct, zipCode,
                                    searchedDistance, storesToShow) {
        return {
            type: TYPES.SHOW_FIND_IN_STORE_MODAL,
            isOpen: isOpen,
            currentProduct: currentProduct,
            zipCode: zipCode,
            searchedDistance: searchedDistance,
            storesToShow: storesToShow
        };
    },

    showFindInStoreMapModal: function (isOpen, currentProduct, selectedStore,
                                       zipCode, searchedDistance, storesToShow) {
        return {
            type: TYPES.SHOW_FIND_IN_STORE_MAP_MODAL,
            isOpen: isOpen,
            currentProduct: currentProduct,
            selectedStore: selectedStore,
            zipCode: zipCode,
            searchedDistance: searchedDistance,
            storesToShow: storesToShow
        };
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/actions/Actions.js