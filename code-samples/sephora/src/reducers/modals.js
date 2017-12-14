var ACTION_TYPES = require('../actions/Actions').TYPES;
var RESERVATION_ACTION_TYPES = require('../actions/ReservationActions').TYPES;
var PROFILE_ACTION_TYPES = require('../actions/ProfileActions').TYPES;

const initialState = {
    showBccModal: false,
    showRegisterModal: false,
    showSignInModal: false,
    showBiRegisterModal: false,
    showForgotPasswordModal: false,
    showInfoModal: false,
    infoModalTitle: '',
    infoModalMessage: '',
    infoModalButtonText: '',
    infoModalCallback: null,
    showInfoModalCancelButton: false,
    infoModalCancelText: '',
    infoModalMessageIsHtml: false,
    confirmMsgObj: {},
    showMediaModal: false,
    mediaModalId: '',
    mediaModalTitle: '',
    mediaModalClose: null,
    showSampleModal: false,
    showVideoModal: false,
    showRewardModal: false,
    sampleList: null,
    allowedQtyPerOrder: 0,
    samplesMessage: '',
    showPromoModal: false,
    showColorIQModal: false,
    colorIQModalCallback: null,
    promoCode: null,
    promosList: null,
    maxMsgSkusToSelect: 0,
    instructions: '',
    showFindInStoreModal: false,
    showFindInStoreMapModal: false,
    storesToShow: null,
    zipCode: null,
    searchedDistance: null,
    currentProduct: null,
    showCountrySwitcherModal: false,
    showCountrySwitcherPrompt: false,
    showInternationalShippingModal: false,
    bccModalTemplate: null,
    signInMessages: null,
    signInCallback: null,
    signInErrback: null,
    registerCallback: null,
    registerErrback: null,
    biRegisterCallback: null,
    biRegisterCancellationCallback: null,
    showQuickLookModal: false,
    quickLookProduct: null,
    skuType: null,
    quickLookSku: null,
    desiredCountry: null,
    desiredLang: null,
    presetLogin: null,
    switchCountryName: null,
    showEmailMeWhenInStockModal: false,
    showMoreReservationsModal: false,
    showTimeTradeModal: false,
    reservationInfo: {},
    showEditMyProfileModal: false,
    showEditFlowModal: false,
    editFlowTitle: '',
    editFlowContent: null,
    biAccount: null,
    socialProfile: null,
    saveProfileCallback: null,
    showShareLinkModal: false,
    showSocialRegistrationModal: false,
    socialRegistrationProvider: null,
    socialRegistrationCallback: null,
    showSocialReOptModal: false,
    socialReOptCallback: null,
    isEditProfileFlow: false,
    isCommunity: false,
    showProductFinderModal: false,
    guidedSellingData: null
};

module.exports = function (state = initialState, action = {}) {
    switch (action.type) {
        case ACTION_TYPES.SHOW_BCC_MODAL:
            return Object.assign({}, state, {
                showBccModal: action.isOpen,
                bccModalTemplate: action.bccModalTemplate
            });

        case ACTION_TYPES.SHOW_SIGN_IN_MODAL:
            return Object.assign({}, state, {
                showSignInModal: action.isOpen,
                signInMessages: action.messages,
                isNewUserFlow: action.isNewUserFlow,
                signInCallback: action.callback,
                signInErrback: action.errback
            });

        case ACTION_TYPES.SHOW_FORGOT_PASSWORD_MODAL:
            return Object.assign({}, state, {
                showForgotPasswordModal: action.isOpen,
                presetLogin: action.email
            });

        case ACTION_TYPES.SHOW_INFO_MODAL:
            return Object.assign({}, state, {
                showInfoModal: action.isOpen,
                infoModalTitle: action.title,
                infoModalMessage: action.message,
                infoModalCallback: action.callback,
                infoModalButtonText: action.buttonText,
                showInfoModalCancelButton: action.showCancelButton,
                infoModalCancelText: action.cancelText,
                infoModalMessageIsHtml: action.isHtml,
                confirmMsgObj: action.confirmMsgObj,
                infoModalCancelCallback: action.cancelCallback
            });

        case ACTION_TYPES.SHOW_MEDIA_MODAL:
            return Object.assign({}, state, {
                showMediaModal: action.isOpen,
                mediaModalId: action.mediaId,
                mediaModalTitle: action.title,
                mediaModalClose: action.modalClose
            });

        case ACTION_TYPES.SHOW_SAMPLE_MODAL:
            return Object.assign({}, state, {
                showSampleModal: action.isOpen,
                sampleList: action.sampleList,
                allowedQtyPerOrder: action.allowedQtyPerOrder,
                samplesMessage: action.samplesMessage
            });

        case ACTION_TYPES.SHOW_VIDEO_MODAL:
            return Object.assign({}, state, {
                showVideoModal: action.isOpen,
                videoTitle: action.videoTitle,
                videoModalUpdated: action.videoModalUpdated,
                video: action.video
            });

        case ACTION_TYPES.SHOW_PROMO_MODAL:
            return Object.assign({}, state, {
                showPromoModal: action.isOpen,
                promoCode: action.promoCode,
                promosList: action.promosList,
                maxMsgSkusToSelect: action.maxMsgSkusToSelect,
                instructions: action.instructions
            });

        case ACTION_TYPES.SHOW_COLOR_IQ_MODAL:
            return Object.assign({}, state, {
                showColorIQModal: action.isOpen,
                colorIQModalCallback: action.callback
            });

        case ACTION_TYPES.SHOW_REWARD_MODAL:
            return Object.assign({}, state, { showRewardModal: action.isOpen });

        case ACTION_TYPES.SHOW_REGISTER_MODAL:
            return Object.assign({}, state, {
                showRegisterModal: action.isOpen,
                presetLogin: action.presetLogin,
                registerCallback: action.callback,
                isStoreUser: action.isStoreUser,
                biData: action.biData,
                registerErrback: action.errback
            });

        case ACTION_TYPES.SHOW_BI_REGISTER_MODAL:
            return Object.assign({}, state, {
                showBiRegisterModal: action.isOpen,
                biRegisterCallback: action.callback,
                biRegisterCancellationCallback: action.cancellationCallback,
                isCommunity: action.isCommunity
            });

        case ACTION_TYPES.SHOW_QUICK_LOOK_MODAL:
            return Object.assign({}, state, {
                showQuickLookModal: action.isOpen,
                skuType: action.skuType,
                quickLookSku: action.sku,
                isCertonaProduct: action.isCertonaProduct
            });

        case ACTION_TYPES.SHOW_EMAIL_WHEN_IN_STOCK_MODAL:
            return Object.assign({}, state, {
                showQuickLookModal: false,
                showEmailMeWhenInStockModal: action.isOpen,
                emailInStockProduct: action.product,
                emailInStockSku: action.currentSku,
                isQuickLook: action.isQuickLook
            });

        case ACTION_TYPES.UPDATE_QUICK_LOOK:
            return Object.assign({}, state, {
                quickLookProduct: action.quickLookProduct,
                sku: action.sku
            });

        case ACTION_TYPES.SHOW_COUNTRY_SWITCHER_MODAL:
            return Object.assign({}, state, {
                showCountrySwitcherModal: action.isOpen,
                desiredCountry: action.desiredCountry,
                desiredLang: action.desiredLang,
                switchCountryName: action.switchCountryName
            });

        case ACTION_TYPES.SHOW_COUNTRY_SWITCHER_PROMPT:
            return Object.assign({}, state, { showCountrySwitcherPrompt: action.isOpen });

        case RESERVATION_ACTION_TYPES.SHOW_MORE_RESERVATIONS_MODAL:
            return Object.assign({}, state, {
                showMoreReservationsModal: action.reservationInfo.isOpen,
                upcomingReservations: action.reservationInfo.upcomingReservations,
                previousReservations: action.reservationInfo.previousReservations,
                addReservationUrl: action.reservationInfo.addReservationUrl,
                editReservationUrl: action.reservationInfo.editReservationUrl
            });

        case RESERVATION_ACTION_TYPES.SHOW_TIME_TRADE_MODAL:
            return Object.assign({}, state, {
                showTimeTradeModal: action.reservationInfo.isOpen,
                timeTradeUrl: action.reservationInfo.timeTradeUrl,
                appointmentId: action.reservationInfo.appointmentId,
                clientLastName: action.reservationInfo.clientLastName
            });

        case ACTION_TYPES.SHOW_INTERNATIONAL_SHIPPING_MODAL:
            return Object.assign({}, state, { showInternationalShippingModal: action.isOpen });

        case PROFILE_ACTION_TYPES.SHOW_EDIT_MY_PROFILE_MODAL:
            return Object.assign({}, state, { showEditMyProfileModal: action.isOpen });

        case PROFILE_ACTION_TYPES.SHOW_EDIT_FLOW_MODAL:
            return Object.assign({}, state, {
                showEditFlowModal: action.isOpen,
                editFlowTitle: action.title,
                editFlowContent: action.content,
                biAccount: action.biAccount,
                socialProfile: action.socialProfile,
                saveProfileCallback: action.saveProfileCallback
            });

        case ACTION_TYPES.SHOW_SHARE_LINK_MODAL:
            return Object.assign({}, state, {
                showShareLinkModal: action.isOpen,
                title: action.title,
                shareUrl: action.shareUrl
            });

        case ACTION_TYPES.SHOW_PRODUCT_FINDER_MODAL:
            return Object.assign({}, state, {
                showProductFinderModal: action.isOpen,
                guidedSellingData: action.bccData
            });

        case ACTION_TYPES.SHOW_FIND_IN_STORE_MODAL:
            return Object.assign({}, state, {
                showFindInStoreModal: action.isOpen,
                currentProduct: action.currentProduct,
                zipCode: action.zipCode,
                searchedDistance: action.searchedDistance,
                storesToShow: action.storesToShow
            });

        case ACTION_TYPES.SHOW_FIND_IN_STORE_MAP_MODAL:
            return Object.assign({}, state, {
                showFindInStoreMapModal: action.isOpen,
                currentProduct: action.currentProduct,
                selectedStore: action.selectedStore,
                zipCode: action.zipCode,
                searchedDistance: action.searchedDistance,
                storesToShow: action.storesToShow
            });

        case PROFILE_ACTION_TYPES.SHOW_SOCIAL_REGISTRATION_MODAL:
            return Object.assign({}, state, {
                showSocialRegistrationModal: action.isOpen,
                socialRegistrationProvider: action.socialRegistrationProvider,
                socialRegistrationCallback: action.socialRegistrationCallback,
                socialRegistrationCancellationCallback:
                    action.socialRegistrationCancellationCallback
            });

        case PROFILE_ACTION_TYPES.SHOW_SOCIAL_REOPT_MODAL:
            return Object.assign({}, state, {
                showSocialReOptModal: action.isOpen,
                socialReOptCallback: action.socialReOptCallback,
                socialReOptCancellationCallback: action.cancellationCallback
            });

        default:
            return state;
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/reducers/modals.js