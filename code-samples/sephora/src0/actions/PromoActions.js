const updateBasket = require('actions/BasketActions').updateBasket;
const processEvent = require('analytics/processEvent');
const anaConsts = require('analytics/constants');
const showPromoModal = require('actions/Actions').showPromoModal;
const skuUtils = require('utils/Sku');
const userUtils = require('utils/User');
const basketApi = require('services/api/basket');

const TYPES = {
    SET_PROMOS: 'SET_PROMOS',
    APPLY_PROMO_AFTER_LOGIN: 'APPLY_PROMO_AFTER_LOGIN',
    UPDATE_MSG_PROMO_LIST: 'UPDATE_MSG_PROMO_LIST',
    REMOVE_PROMOS: 'REMOVE_PROMOS',
    SHOW_PROMOS_ERROR: 'SHOW_PROMOS_ERROR'
};

function setPromo(promo, promoCode) {
    return {
        type: TYPES.SET_PROMOS,
        promo: promo,
        promoCode: promoCode,
        promoApplied: true,
        promoWarningMessage: null,
        promoErrorMessage: null
    };
}

function applyPromoAfterLogin(promoCode) {
    return {
        type: TYPES.APPLY_PROMO_AFTER_LOGIN,
        promoCode: promoCode
    };
}

function deletePromo() {
    return {
        type: TYPES.REMOVE_PROMOS,
        promo: null,
        promoApplied: false
    };
}

function updateMsgPromosList(msgPromosSkuList, promoCode) {
    return {
        type: TYPES.UPDATE_MSG_PROMO_LIST,
        msgPromosSkuList: msgPromosSkuList,
        promoCode: promoCode
    };
}

function showPromoError(promoError) {
    return {
        type: TYPES.SHOW_PROMOS_ERROR,
        promoErrorMessage: promoError.errorMessages[0]
    };
}

function applyPromo(promoCode, successCallback, failureCallback) {
    failureCallback = failureCallback || successCallback;

    return (dispatch) => {
        basketApi.applyPromotion(promoCode).
            then(data => {
                if (data.responseStatus === 202) {
                    dispatch(setPromo(data, promoCode));
                    dispatch(showPromoModal(
                            true, data.items, data.maxMsgSkusToSelect,
                            data.instructions, promoCode));
                } else {
                    dispatch(setPromo(data, promoCode));
                    dispatch(updateBasket(data));
                    successCallback && successCallback();
                }

                let analyticsData = {
                    eventStrings: [anaConsts.Event.EVENT_71],
                    linkName: 'Enter Promo Code',
                    actionInfo: 'Enter Promo Code',
                    userInput: promoCode
                };

                processEvent.process(
                        anaConsts.LINK_TRACKING_EVENT, { data: analyticsData });
            }).
            catch(reason => {
                if (userUtils.isAnonymous()) {
                    dispatch(applyPromoAfterLogin(promoCode));
                }

                failureCallback && failureCallback(reason);

                analyticsData = Object.assign({}, analyticsData, {
                    serverResponse: reason.errorMessages.join(','),
                    fieldErrors: ['promo'],
                    errorMessages: reason.errorMessages
                });
            });
    };
}

function removePromo(orderId, successCallback, failureCallback) {
    return (dispatch) => {
        basketApi.removePromotion(orderId).
            then(data => {
                dispatch(deletePromo(data));
                data.promoMessage =
                        data.promoMessage ? data.promoMessage : null;
                data.promoWarning =
                        data.promoWarning ? data.promoWarning : null;
                dispatch(updateBasket(data));
            }).
            catch(failureCallback);
    };
}

function updateMsgPromo(sku) {
    return (dispatch, getState) => {
        let msgPromosSkuList = getState().promo.msgPromosSkuList;
        let promoCode = getState().promo.promoCode;
        if (!skuUtils.isInMsgPromoSkuList(sku.skuId)) {
            msgPromosSkuList.push(sku.skuId);
        } else {
            msgPromosSkuList = msgPromosSkuList.filter(elem => elem !== sku.skuId);
        }

        dispatch(updateMsgPromosList(msgPromosSkuList, promoCode));
    };
}

function submitMsgPromos() {
    return (dispatch, getState) => {
        let couponCode = getState().promo.promoCode;
        let sampleSkuIdList = getState().promo.msgPromosSkuList;

        basketApi.addMsgPromotionToBasket(couponCode, sampleSkuIdList).
            then(data => {
                data.promoMessage = !data.promoMessage ? null : data.promoMessage;
                data.promoWarning = !data.promoWarning ? null : data.promoWarning;
                dispatch(showPromoModal(false));
                dispatch(updateBasket(data));
            }).
            catch(reason => {
                dispatch(showPromoError(reason));
            });
    };
}

module.exports = {
    TYPES,
    applyPromo,
    removePromo,
    updateMsgPromo,
    submitMsgPromos
};



// WEBPACK FOOTER //
// ./public_ufe/js/actions/PromoActions.js