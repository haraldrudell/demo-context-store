const basketApi = require('services/api/basket');
const biApi = require('services/api/beautyInsider');

const basketUtils = require('utils/Basket');
const Locale = require('utils/LanguageLocale');
const skuUtils = require('utils/Sku');
const userUtils = require('utils/User');

const Actions = require('Actions');
const processEvent = require('analytics/processEvent');
const analyticsConsts = require('analytics/constants');
const addToBasketEvent = require('analytics/bindings/pages/all/addToBasketEvent');
const blueCore = require('analytics/bluecore');
const inlineBasketActions = require('./InlineBasketActions');
const Location = require('utils/Location');

const Storage = require('utils/localStorage/Storage');
const LOCAL_STORAGE = require('utils/localStorage/Constants');
const BASKET_EXPIRY = Storage.MINUTES * 15;

const TYPES = {
    UPDATE_BASKET: 'UPDATE_BASKET',
    SHOW_BASKET_ERROR: 'SHOW_BASKET_ERROR',
    SHOW_BASKET_WARNING: 'SHOW_BASKET_WARNING',
    SHOW_STICKY_APPLE_PAY_BTN: 'SHOW_STICKY_APPLE_PAY_BTN',
    SHOW_PAYPAL_RESTRICTED_MESSAGE: 'SHOW_PAYPAL_RESTRICTED_MESSAGE',
    ADD_PENDING_SKU: 'ADD_PENDING_SKU',
    CLEAR_PENDING_SKU: 'CLEAR_PENDING_SKU',
    REMOVE_PENDING_SKU: 'REMOVE_PENDING_SKU'
};

const HTTP_STATUS_ACCEPTED = 202;

const OPERATION = {
    ADDED_PRODUCT: 'ADDED_PRODUCT',
    UPDATED_PRODUCT: 'UPDATE_PRODUCT',
    ADDED_REWARD: 'ADD_REWARD'
};

const PROMO_TO_BE_REMOVED = -10102;

function updateBasket(basket) {
    /* We cache basket data each time the basket is updated with fresh API data so we do not have
    to call the user/full API on each page load. However, we set an expire time of 15 minutes. */
    Storage.local.setItem(LOCAL_STORAGE.BASKET, basket, BASKET_EXPIRY);

    let countryCode = userUtils.getShippingCountry().countryCode;

    if (basketUtils.isEmpty(basket) && countryCode !== Locale.COUNTRIES.US) {
        let defaultSubtotal = basketUtils.getDefaultSubtotal();

        basket.subtotal = defaultSubtotal;
        basket.rawSubTotal = defaultSubtotal;
    }

    basket.isInitialized = true;

    return {
        type: TYPES.UPDATE_BASKET,
        basket: basketUtils.separateItems(basket)
    };
}

function showError(error, items, errorMessages) {
    // errors array is empty for next case (that's why we use errorMessages):
    // errorCode: -1081
    // 'There is a limit of 10 per person for this item. We have added 0 item(s) to your basket.'
    let basketError = Object.assign({}, error);
    if (error) {
        if (error.errors && !Object.keys(error.errors).length) { // sometimes it is empty
            basketError.errorMessages = error.errorMessages;
        } else if (!Object.keys(error).length && errorMessages) {
            basketError.errorMessages = errorMessages;
        }
    }
    if (error && !basketError.errorMessages && (typeof error === 'object')) {
        basketError.errorMessages = Object.keys(error).map(errorKey => {
            if (error[errorKey] instanceof Array) {
                return error[errorKey].join(',');
            } else {
                return error[errorKey];
            }
        });
    }
    return {
        type: TYPES.SHOW_BASKET_ERROR,
        error: basketError,
        itemsAndErrors: items || null
    };
}

function addPendingProduct(skus) {
    let store = require('Store');

    if (!Array.isArray(skus)) {
        skus = [skus];
    }

    let pendingBasketSkus = store.getState().basket.pendingBasketSkus.concat(skus);
    return {
        type: TYPES.ADD_PENDING_SKU,
        pendingBasketSkus: pendingBasketSkus
    };
}

function removePendingProduct(sku) {
    let store = require('Store');
    let pendingBasketSkus = store.getState()
        .basket
        .pendingBasketSkus
        .filter(item => item.skuId !== sku.skuId || item.methodId !== sku.methodId);
    return {
        type: TYPES.REMOVE_PENDING_SKU,
        pendingBasketSkus: pendingBasketSkus
    };
}

function clearPendingProductList() {

    return {
        type: TYPES.CLEAR_PENDING_SKU,
        pendingBasketSkus: []
    };
}

function showWarning(basketItemWarnings) {
    return {
        type: TYPES.SHOW_BASKET_WARNING,
        basketItemWarnings: basketItemWarnings
    };
}

function refreshBasket (keepItemLevelErrors) {
    return (dispatch) => {
        return basketApi.getBasketDetails().
            then(data => {
                if (keepItemLevelErrors && data.items) {
                    let itemsAndErrs = basketUtils.catchItemLevelErrors(
                            keepItemLevelErrors, data);
                    if (itemsAndErrs) {
                        data = Object.assign({}, data, { items: itemsAndErrs });
                    }
                }
                return dispatch(updateBasket(data));

            }).catch(reason => {
                return dispatch(showError(data));
            });
    };
}


function confirmBasketUpdateModal(dispatch, message, callback, cancelCallback) {
    dispatch(
        Actions.showInfoModal(
            true,
            'Confirmation',
            message,
            'Continue',
            callback, true, null, null, null, cancelCallback
        )
    );
}

function showPaypalRestrictedMessage() {
    return {
        type: TYPES.SHOW_PAYPAL_RESTRICTED_MESSAGE,
        showPaypalRestrictedMessage: true
    };
}

function showStickyApplePayBtn(isSticky) {
    return {
        type: TYPES.SHOW_STICKY_APPLE_PAY_BTN,
        showStickyApplePayBtn: isSticky
    };
}

/**
 * Since the current API response sometimes retrieves errors inside the
 * basket and sometimes within a totally different format,
 * this method will check always for errors.lso this it will dispatch
 * different actions relevant to the operation that called this function.
 *
 * OPERATION.UPDATED_PRODUCT: dispatch updateBasket with the straight basket response.
 * OPERATION.ADDED_PRODUCT: calculate new basket object using the basket response.
 * Else for ADDED_REWARD: dispatch updateBasket with straight basket response.
 * NOTE:For the last 2 cases, if it comes the quantity param it dispatches addedProductsNotification
 */
function makeGenericAddUpdateProductToBasketSuccessHandler(
        dispatch, quantity, performedAction, successCallback) {
    return (data) => {
        if (typeof successCallback === 'function') {
            successCallback(data);
        }

        // operation-specifyc logic
        let updatedBasket = null;

        switch (performedAction){
            case OPERATION.UPDATED_PRODUCT:
                updatedBasket = updateBasket(data);
                break;
            case OPERATION.ADDED_PRODUCT:

                //When adding a product to basket,
                // the api response does not contain the full basket
                updatedBasket = updateBasket(basketUtils.calculateUpdatedBasket(data));
                break;
            case OPERATION.ADDED_REWARD:
            default:
                updatedBasket = updateBasket(data.basket);
                break;
        }

        dispatch(updatedBasket);

        if (quantity) {
            dispatch(inlineBasketActions.addedProductsNotification(quantity));
        }

        if (!Location.isBasketPage()) {
            dispatch(inlineBasketActions.showInlineBasket(true));
        }

        dispatch(showWarning(basketUtils.catchItemLevelMessages(data)));
        return updatedBasket;
    };
}

function makeGenericBasketOperationFailureHandler(dispatch) {
    return reason => {
        if (!Location.isBasketPage()) {
            dispatch(inlineBasketActions.showInlineBasket(true));
        }

        let itemsAndErrors = basketUtils.catchItemLevelErrors(reason);
        dispatch(showError(reason.errors, itemsAndErrors, reason.errorMessages));

        return Promise.reject(reason);
    };
}

function updateQuantities(skuList, successCallback, modifyConfirmed) {
    let orderId = basketUtils.getOrderId();

    return dispatch => {
        return basketApi.updateBasket({
            orderId,
            skuList,
            modifyConfirmed
        }).
        then(data => {
            let promise;

            if (data.responseStatus === HTTP_STATUS_ACCEPTED) {
                confirmBasketUpdateModal(dispatch, data.errorMessages.join('. '), () => {
                    dispatch(updateQuantities(skuList, () => {
                        if (data.errorCode === PROMO_TO_BE_REMOVED) {
                            const PromoActions = require('actions/PromoActions');
                            dispatch(PromoActions.removePromo(orderId));
                        }
                        successCallback.apply(null, arguments);
                    }, true));

                    dispatch(Actions.showInfoModal(false));
                }, () => {
                    dispatch(refreshBasket());
                });

                promise = Promise.resolve(null);
            } else {
                promise = Promise.resolve(data);
            }

            return promise;
        }).
        then(data => {
            // data can be null here because of 202 responseStatus in the above clause.
            let handler = data && makeGenericAddUpdateProductToBasketSuccessHandler(
                    dispatch, null, OPERATION.UPDATED_PRODUCT, successCallback);
            handler && handler(data);
        }).
        catch(makeGenericBasketOperationFailureHandler(dispatch));
    };
}

function addProductToBasket(sku, quantity, successCallback) {
    quantity = quantity || 1;

    return dispatch => {
        return basketApi.addToCart({
            orderId: basketUtils.getOrderId(),
            skuList: [{
                isAcceptTerms: skuUtils.isFlash(sku),
                qty: quantity,
                skuId: sku.skuId
            }]
        }).
        then(makeGenericAddUpdateProductToBasketSuccessHandler(
                dispatch, quantity, OPERATION.ADDED_PRODUCT, successCallback)).
        catch(makeGenericBasketOperationFailureHandler(dispatch));
    };
}

function addRewardToBasket(skuId, quantity, successCallback) {
    return dispatch => {
        return biApi.addBiRewardsToCart(skuId).
            then(makeGenericAddUpdateProductToBasketSuccessHandler(
                    dispatch, quantity, OPERATION.ADDED_REWARD, successCallback)).
            catch(makeGenericBasketOperationFailureHandler(dispatch));
    };
}

/**
 * Add analytics/bluecore to the originally passed in success callback
 * @param  {obj} sku - The sku that was added
 * @param  {function} originalCallback
 * @param  {string} analyticsContext - A string which we use later to make decisions
 * @return {function} - A new function that will be used as the success callback
 */
function createDecoratedSuccessCallback(
    sku, originalCallback, analyticsContext, productId, skuList = []) {
    return function () {
        //Analytics
        if (digitalData.page.attributes.tempProps.isEnrollToFlash) {
            analyticsContext = analyticsConsts.CONTEXT.ROUGE_ENROLL_FLASH;
        }
        processEvent.preprocess.commonInteractions(
            {
                bindingMethods: [addToBasketEvent],
                context: analyticsContext,
                sku: sku,
                skuList,
                eventName: analyticsConsts.EVENT_NAMES.ADD_TO_BASKET
            }
        );

        // Bluecore Add to Cart Trigger
        if (!!sku.type && sku.type.toLowerCase() === skuUtils.skuTypes.STANDARD) {
            blueCore.addToCartEvent(productId);
        }

        originalCallback && originalCallback.apply(null, arguments);
    };
}

function addMultipleSkusToBasket(
    skus, skusQuantity, successCallback, analyticsContext, productId, mainSku) {
    return dispatch => {
        return basketApi.addToCart({
            orderId: basketUtils.getOrderId(),
            skuList: skus.map(sku => {
                return {
                    qty: sku.qty,
                    skuId: sku.skuId,
                    isAcceptTerms: sku.isAcceptTerms

                };
            })
        }).
        then(makeGenericAddUpdateProductToBasketSuccessHandler(
                dispatch, skusQuantity, OPERATION.ADDED_PRODUCT, successCallback)).
        then(createDecoratedSuccessCallback(
            mainSku,
            () => {},
            analyticsContext,
            productId,
            skus)
        ).catch(makeGenericBasketOperationFailureHandler(dispatch));
    };
}

/**
 * Function to add a new sample to the basket
 * The 'Add Samples to Basket API' receives an array of samples sku.
 * If only one sku is added it will replace the list of samples added
 * previously
 * basketUtils.getSamplesInBasket returns an array of the current list of
 * samples in the basket, then pushes the new sku
 * @param sku
 * @param successCallback
 */
function addSampleToBasket(sku, successCallback) {
    return (dispatch) => {
        // basket.samples contains an array of Sample objects,
        // we only need an array of Sample skuId
        let store = require('Store');
        const sampleSkuIdList = store.getState().basket.samples.map(item => item.sku.skuId);
        sampleSkuIdList.push(sku.skuId);

        return basketApi.addSamplesToBasket(sampleSkuIdList).
            then(data => {
                successCallback(data);
                dispatch(showError());
                dispatch(updateBasket(data));
            }).catch(reason => {
                dispatch(showError(reason));
            });
    };
}

/**
 * Removes an Sku from the Basket
 * @param  {Object} sku - The sku to be removed
 * @param  {Boolean} samplePanel - Whether or not the item removed is in the sample panel (optional)
 * @param  {Boolean} trackAna - Whether or not to track the removal (optional)
 * @param  {Boolean} modifyConfirmed - Appends modifyConfirmed=true to the url.  This is used when
 * calling a second time following a 202 response from the server (see API docs for details)
 * @returns {Function} Action to be performed
 */
function removeProductFromBasket(
        sku, samplePanel = false, trackAna = true, modifyConfirmed = false) {

    return (dispatch) => {
        basketApi.removeSkuFromBasket(
                basketUtils.getOrderId(), sku.skuId, modifyConfirmed).
        then(data => {
            // Analytics
            if (trackAna) {
                const isSample = skuUtils.isSample(sku) && samplePanel;

                processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, {
                    data: {
                        bindingMethods: [require('analytics/bindings/pages/all/removeFromBasketEvent')],
                        eventStrings: ['scRemove'],
                        linkName: isSample ?
                            'Remove samples from Basket' : 'Remove From Basket',
                        sku: sku
                    }
                });

                // Bluecore event for remove product from cart
                blueCore.removeFromCartEvent(sku.productId);
            }

            if (skuUtils.isGwp(sku)) {
                data.promoApplied = false;
                if (basketUtils.getGwpPromoInBasket(data).length === 0) {
                    data.promoMessage = null;
                    data.promoWarning = null;
                }
            }

            dispatch(showError());

            dispatch(updateBasket(data));
        }).
        catch(reason => {
            if (reason.responseStatus === HTTP_STATUS_ACCEPTED) {
                let messages = reason.errorMessages;
                // Append a period and a line break to the last product
                if (Array.isArray(messages) && messages.length > 0) {
                    let lastProductName = messages[messages.length - 1];
                    lastProductName += '.';
                    messages[messages.length - 1] = lastProductName;
                    messages.push('');
                }
                messages.push('Are you sure you want to continue?');
                confirmBasketUpdateModal(dispatch, messages.join(''), () => {
                    dispatch(removeProductFromBasket(sku, samplePanel, trackAna, true));
                    dispatch(Actions.showInfoModal(false));
                });
            } else {

                dispatch(showError(reason));
            }
        });
    };
}

function removeRewardFromBasket(sku, successCallback) {
    return (dispatch) => {
        return biApi.removeBiRewardFromBasket(
                basketUtils.getOrderId(), sku.skuId).
        then(data => {
            if (typeof successCallback === 'function') {
                successCallback(data);
            }
            dispatch(updateBasket(data.basket));
        }).
        catch(reason => {
            let itemsAndErrors = basketUtils.catchItemLevelErrors(reason);
            dispatch(showError(reason.errors, itemsAndErrors, reason.errorMessages));
            return Promise.reject(reason);
        });
    };
}

/**
 * Determines the type of item to be removed and calls the corresponding action
 * @param  {Object} item - The item to be removed
 * @param  {Boolean} trackAna - Whether or not to track the removal (optional)
 * @returns {Function} Action to be performed
 */
function removeItemFromBasket(item, trackAna) {
    return (dispatch) => {
        let isReward = skuUtils.isBiReward(item);
        if (isReward) {
            return dispatch(removeRewardFromBasket(item.sku));
        } else if (skuUtils.isGwp(item.sku)) {
            const PromoActions = require('actions/PromoActions');
            return dispatch(PromoActions.removePromo(basketUtils.getOrderId()));
        } else {
            return dispatch(removeProductFromBasket(item.sku, false, trackAna));
        }
    };
}

function addToBasket(
        sku, quantity, successCallback, analyticsContext, samplePanel, productId) {

    let result;

    quantity = parseInt(quantity);

    if (skuUtils.isBiReward(sku)) {
        if (skuUtils.isInBasket(sku.skuId)) {
            result = removeRewardFromBasket(sku, successCallback);
        } else {
            result = addRewardToBasket(sku.skuId, quantity,
                createDecoratedSuccessCallback(sku, successCallback, analyticsContext));
        }
    } else if (skuUtils.isSample(sku)) {
        if (skuUtils.isInBasket(sku.skuId)) {
            result = removeProductFromBasket(sku, samplePanel);
        } else {
            result = addSampleToBasket(sku, createDecoratedSuccessCallback(
                    sku, successCallback, analyticsContext));
        }
    } else {
        result = addProductToBasket(
            sku,
            quantity,
            createDecoratedSuccessCallback(
                    sku, successCallback, analyticsContext, productId)
        );
    }

    return result;
}


module.exports = {
    TYPES: TYPES,

    // skuType-independent add sku to basket.
    addToBasket,

    // Fully update basket in store with the new data.
    updateBasket,

    // Fetch basket from server and put it into store. No parameters needed.
    refreshBasket,

    removePendingProduct,
    addPendingProduct,
    clearPendingProductList,

    updateQuantities,
    removeItemFromBasket,
    showError,
    showWarning,
    addMultipleSkusToBasket,

    showPaypalRestrictedMessage,
    showStickyApplePayBtn
};



// WEBPACK FOOTER //
// ./public_ufe/js/actions/BasketActions.js