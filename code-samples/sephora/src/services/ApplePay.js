const store = require('store/Store');
const watch = require('redux-watch');
const orderActions = require('actions/OrderActions');
const basketActions = require('actions/BasketActions');
const checkoutUtils = require('utils/Checkout');
const Authentication = require('utils/Authentication');
const LegacyStorage = require('utils/localStorage/LegacyMW');
const localeUtils = require('utils/LanguageLocale');
const basketUtils = require('utils/Basket');
const enableApplePaySession = require('Actions').enableApplePaySession;
const userUtils = require('utils/User');
const urlUtils = require('utils/Url');
const Location = require('utils/Location');
const uIUtils = require('utils/UI');
const utilityApi = require('services/api/utility');
const checkoutApi = require('services/api/checkout');
const Actions = require('Actions');
const { withInterstice } = require('utils/decorators');


const TYPES = {
    ENABLED: 'ENABLED',
    DISABLED: 'DISABLED',
    HIDDEN: 'HIDDEN'
};

const CCARD_TYPES = ['amex', 'visa', 'masterCard'];

const CCARD_TYPES_US = ['discover'].concat(CCARD_TYPES);

const AMOUNT_TYPE = {
    FINAL: 'final',
    PENDING: 'pending'
};

const ERROR_CODES = { INVALID_ADDRESS_ERROR: -10170 };

const merchantIdentifier = Sephora.configurationSettings.applePayMerchantIdentifier;
const applePlaceholder = 'ApplePay';
const SESSION_ABORT_TIMEOUT = 2000;


module.exports = (function () {


    let orderDetails;
    let shippingMethods;
    let mergeBasketError;
    let sessionAborted;
    let session;
    let currentShippingMethodId;
    let savedAddress;

    function getOrderTotal() {
        let amount = basketUtils.removeCurrency(orderDetails ? orderDetails.priceInfo.orderTotal :
            store.getState().basket.subtotal);
        return {
            label: 'Estimated Total',
            amount: amount,
            type: AMOUNT_TYPE.FINAL
        };
    }

    function getShippingMethods() {
        let methods = (shippingMethods || []).
        map(function (group) {
            let description = group.shippingMethodDescription;

            // We need to cut "Delivery" part to win some space on ApplePay sheet
            // per https://jira.sephora.com/browse/ILLUPH-87511
            let cutIndex = description.toLowerCase().indexOf('days');
            if (cutIndex !== -1) {
                description = description.substring(0, cutIndex + 4) + ')';
            }

            return {
                label: group.shippingMethodType,
                detail: description,
                amount: basketUtils.removeCurrency(group.shippingFee),
                identifier: group.shippingMethodId
            };
        });

        /**
         * If Current Shipping Method is not the first in the list of methods,
         * Then we need to put it in the first place -
         * ApplePay always shows the first one as selected.
         */
        let methodId = methods.map(method => Number(method.identifier)).indexOf(currentShippingMethodId);
        if (methodId > 0) {
            let methodToShift = methods.splice(methodId, 1);
            methods.unshift(methodToShift[0]);
        }

        return methods;
    }

    function getShippingGroupFromOrder() {
        return orderDetails && orderDetails.shippingGroups ?
            orderDetails.shippingGroups.shippingGroupsEntries.
            filter(item => item.shippingGroupType === orderActions.SHIPPING_GROUPS.HARDGOOD)[0].
                shippingGroup : {
                    shippingGroupId: 0,
                    shippingMethod: { shippingMethodId: 0 }
                };
    }

    function getShippingMethodErrorMessage() {
        let shippingMethod = getShippingGroupFromOrder().shippingMethod;
        let shippingFee = shippingMethod.shippingFee;

        if (/^(C|CAD)?\$0.00/.test(shippingFee)) {
            shippingFee = 'FREE';
        }

        return 'Unfortunately, we can only ship to your address using ' +
            shippingMethod.shippingMethodType +
            ' (' + shippingFee + ')' +
            '. Please select this method or choose a different address on the Apple Pay sheet.';
    }

    function getLineItems() {

        let lineItems = [
            {
                label: 'Merchandise Subtotal',
                amount: basketUtils.removeCurrency(orderDetails.priceInfo.merchandiseSubtotal)
            },
            {
                label: 'Tax',
                amount: basketUtils.removeCurrency(orderDetails.priceInfo.tax)
            },
            {
                label: 'Shipping',
                amount: basketUtils.removeCurrency(orderDetails.priceInfo.totalShipping)
            }
        ];

        if (orderDetails.priceInfo.promotionDiscount) {
            lineItems.push({
                label: 'Discount',
                amount: '-' + basketUtils.removeCurrency(orderDetails.priceInfo.promotionDiscount)
            });
        }

        if (orderDetails.priceInfo.storeCardAmount) {
            lineItems.push({
                label: 'Store Credit Redeemed',
                amount: '-' + basketUtils.removeCurrency(
                    orderDetails.priceInfo.storeCardAmount)
            });
            if (orderDetails.priceInfo.creditCardAmount) {
                lineItems.push({
                    label: 'Credit Card Payment',
                    amount: '-' + basketUtils.removeCurrency(
                        orderDetails.priceInfo.creditCardAmount)
                });
            }
        }

        return lineItems;
    }

    function formatAddress(appleAddress, isBilling) {
        let addressLines = appleAddress.addressLines || [];
        let address = {
            address1: addressLines.join(' ') || applePlaceholder,
            address2: '',
            city: appleAddress.locality ?
                appleAddress.locality.toUpperCase() : applePlaceholder,
            state: appleAddress.administrativeArea,
            postalCode: appleAddress.postalCode,
            country: appleAddress.countryCode.toUpperCase(),
            phone: appleAddress.phoneNumber || '1234567890'
        };
        let firstName = appleAddress.givenName || applePlaceholder;
        let lastName = appleAddress.familyName || applePlaceholder;

        if (!isBilling) {
            address.firstName = firstName;
            address.lastName = lastName;
        }

        return isBilling ? {
            firstName: firstName,
            lastName: lastName,
            address: address
        } : address;
    }

    function formatCreditCard(payment) {
        return {
            paymentData: btoa(JSON.stringify(payment.token.paymentData)),
            paymentNetwork: payment.token.paymentMethod.network,
            paymentDisplayInfo: payment.token.paymentMethod.displayName,
            creditCard: formatAddress(payment.billingContact, true)
        };
    }

    function getShippingGroupIdFromOrder() {
        return getShippingGroupFromOrder().shippingGroupId;
    }

    function getShippingMethodIdFromOrder() {
        return Number(getShippingGroupFromOrder().shippingMethod.shippingMethodId);
    }

    function fillCanadaAddress(address) {
        let zipCode = address.postalCode;
        address.postalCode = zipCode.length === 3 ? zipCode + '1A1' : zipCode;
        return utilityApi.getStateAndCityForZipCode('CA', address.postalCode).
            then(function (data) {
                address.administrativeArea = data.state;
                address.locality = data.city;
            });
    }

    function preparePaymentData(payment) {

        // since billing contact from Apple doesn't have it's own phone
        payment.billingContact.phoneNumber = payment.shippingContact.phoneNumber;

        return new Promise(function (resolve, reject) {
            if (payment.shippingContact.countryCode !== 'ca' &&
                payment.billingContact.countryCode !== 'ca') {
                resolve();
            } else {
                if (payment.shippingContact.countryCode === 'ca') {
                    fillCanadaAddress(payment.shippingContact).then(function () {
                        if (payment.billingContact.countryCode === 'ca') {
                            fillCanadaAddress(payment.billingContact).then(resolve).catch(reject);
                        } else {
                            resolve();
                        }
                    }).catch(reject);
                } else {
                    fillCanadaAddress(payment.billingContact).then(resolve).catch(reject);
                }
            }
        });
    }

    function createApplePayPaymentRequest() {
        let country = localeUtils.getCurrentCountry();
        let currency = localeUtils.isCanada() ? 'CAD' : 'USD';
        let supportedCards = localeUtils.isUS() ? CCARD_TYPES_US : CCARD_TYPES;
        
        return {
            countryCode: country,
            currencyCode: currency,
            supportedNetworks: supportedCards,
            merchantCapabilities: ['supports3DS'],
            requiredShippingContactFields: ['postalAddress', 'name', 'phone'],
            requiredBillingContactFields: ['postalAddress', 'name'],
            lineItems: [],
            total: getOrderTotal()
        };
    }

    function validateApplePayMerchant(validationUrl) {
        return checkoutApi.validateApplePayMerchant(
            Location.getLocation().host,
            validationUrl
        ).then(function (data) {
            session.completeMerchantValidation(data);
        }).catch(function (reason) {
            console.log('ApplePay merchant validation failed', JSON.stringify(reason));
            session.abort();
        });
    }

    /**
     * The idea of this function is:
     * - to abort the ApplePay sheet after SESSION_ABORT_TIMEOUT secs
     * - and Show sticky ApplePay button instead of Checkout button,
     *      so ApplePay sheet will be accessible for user in one click
     * @param forceClose
     */
    function handleBasketError(forceClose) {
        let basket = store.getState().basket;
        if (!basket.showStickyApplePayBtn || forceClose) {
            store.dispatch(basketActions.showStickyApplePayBtn(true));
            setTimeout(() => {
                session.abort();
                store.dispatch(Actions.showInterstice(false));
                uIUtils.unlockBackgroundPosition();
            }, SESSION_ABORT_TIMEOUT);
        }

        uIUtils.scrollToTop();
    }

    function applePayPaymentAuthorized(request, event) {
        let payment = event.payment;
        sessionAborted = false;

        checkoutUtils.initializeCheckout({ isApplePayFlow: true }).
            then(() => {

                if (sessionAborted) {
                    session.begin();
                    return;
                }

                let shippingAddressToProcess = {
                    shippingGroupId: getShippingGroupIdFromOrder(),
                    address: formatAddress(payment.shippingContact)
                };

                withInterstice(checkoutApi.createShippingAddress)(shippingAddressToProcess).
                    then(addressData => withInterstice(checkoutApi.getOrderDetails)(orderDetails.header.orderId)).
                    then(data => {
                        let result;

                        orderDetails = data;
                        let newShippingMethodId = getShippingMethodIdFromOrder();
                        if (currentShippingMethodId !== newShippingMethodId) {
                            store.dispatch(basketActions.showError({ internalError: getShippingMethodErrorMessage() }));
                            savedAddress = Object.assign({}, payment.shippingContact);
                            handleBasketError(true);
                            session.completePayment(
                                ApplePaySession.STATUS_INVALID_SHIPPING_POSTAL_ADDRESS);
                            result = request;

                        } else {
                            savedAddress = null;
                            let postData = formatCreditCard(payment);

                            // TODO Refactor catches here to form a single pipeline.

                            withInterstice(checkoutApi.addCreditCardToOrder)(postData).
                            then(() => {

                                withInterstice(checkoutApi.placeOrder)({
                                    originOfOrder: 'mobileWeb',
                                    jscData: true
                                }).
                                then(data2 => {
                                    session.completePayment(
                                            window.ApplePaySession.STATUS_SUCCESS);
                                    setTimeout(()=> {
                                        store.dispatch(Actions.showInterstice(true));
                                        urlUtils.redirectTo(
                                                '/checkout/confirmation?orderId=' +
                                                data2.orderId);
                                    }, 2000);
                                }).
                                catch(reason => {
                                    session.completePayment(
                                        window.ApplePaySession.STATUS_FAILURE);
                                    setTimeout(()=> {
                                        session.abort();
                                    }, SESSION_ABORT_TIMEOUT);
                                });

                            }).catch(reason => {
                                /* eslint max-len: [2, 130] */
                                session.completePayment(ApplePaySession.STATUS_INVALID_BILLING_POSTAL_ADDRESS);
                            });
                        }

                        return result;
                    }).
                    catch(reason => {
                        if (reason.errorCode === ERROR_CODES.INVALID_ADDRESS_ERROR &&
                            reason.errors && reason.errors.phoneNumber) {
                            session.completePayment(
                                ApplePaySession.STATUS_INVALID_SHIPPING_CONTACT);
                        } else {
                            session.completePayment(
                                ApplePaySession.STATUS_INVALID_SHIPPING_POSTAL_ADDRESS);
                        }
                    });
            }).
            catch(reason => {
                store.dispatch(
                    basketActions.showError({ internalError: reason.errorMessages.join(' ') }));

                store.dispatch(basketActions.refreshBasket());

                handleBasketError(true);
            });
    }

    function applePayPaymentMethodSelected(request, event) {
        session.completePaymentMethodSelection(getOrderTotal(), getLineItems());
    }

    function applePayShippingContactSelected(request, event) {

        // Show Shipping Section in Error state if basket is Hazardous
        if (mergeBasketError) {
            handleBasketError();
            session.completeShippingContactSelection(
                ApplePaySession.STATUS_INVALID_SHIPPING_POSTAL_ADDRESS,
                getShippingMethods(), getOrderTotal(), getLineItems());
            return request;
        }

        let shippingContact = event.shippingContact;
        if (savedAddress && savedAddress.locality === shippingContact.locality) {
            shippingContact = savedAddress;
        }

        let shippingAddressToProcess = {
            shippingGroupId: getShippingGroupIdFromOrder(),
            address: formatAddress(shippingContact)
        };

        withInterstice(checkoutApi.createShippingAddress)(shippingAddressToProcess).
            then(addressData => withInterstice(checkoutApi.getOrderDetails)(orderDetails.header.orderId)).
            then(data => {
                orderDetails = data;
                currentShippingMethodId = getShippingMethodIdFromOrder();
                let shippingGroupId = getShippingGroupIdFromOrder();

                withInterstice(checkoutApi.getAvailableShippingMethods)
                    (orderDetails.header.orderId, shippingGroupId).
                then(data2 => {
                    shippingMethods = data2.shippingMethods;
                    session.completeShippingContactSelection(ApplePaySession.STATUS_SUCCESS,
                        getShippingMethods(), getOrderTotal(), getLineItems());
                });
            }).
            catch(reason => {
                if (reason.errors && reason.errors.restrictedShipping) {
                    handleBasketError();
                }

                session.completeShippingContactSelection(ApplePaySession.
                        STATUS_INVALID_SHIPPING_POSTAL_ADDRESS,
                    getShippingMethods(), getOrderTotal(), getLineItems());
                return request;
            });

        return request;
    }

    function applePayShippingMethodSelected(request, event) {

        let shippingMethodData = {
            shippingGroupId: getShippingGroupIdFromOrder(),
            shippingMethodId: event.shippingMethod.identifier
        };

        withInterstice(checkoutApi.setShippingMethod)(shippingMethodData).
            then(() => withInterstice(checkoutApi.getOrderDetails)(orderDetails.header.orderId)).
            then(data => {
                orderDetails = data;
                currentShippingMethodId = getShippingMethodIdFromOrder();
                session.completeShippingMethodSelection(
                    ApplePaySession.STATUS_SUCCESS, getOrderTotal(), getLineItems());
            }).
            catch(reason => {
                session.completeShippingMethodSelection(
                    ApplePaySession.STATUS_FAILURE, getOrderTotal(), getLineItems());
            });

        return request;
    }

    function prepareSession() {

        // Reset the default values for the Session
        let request = createApplePayPaymentRequest();
        session = new window.ApplePaySession(1, request);
        store.dispatch(enableApplePaySession(true));
        mergeBasketError = false;

        session.onvalidatemerchant = function (event) {
            let requiredForRecognized = true;
            let isNewUserFlow = false;
            Authentication.requireAuthentication(
                    requiredForRecognized, isNewUserFlow, null).
                then(() => validateApplePayMerchant(event.validationURL));
        };

        session.onpaymentmethodselected = function (event) {
            applePayPaymentMethodSelected(request, event);
        };

        session.onshippingcontactselected = function (event) {
            if (event.shippingContact.countryCode === 'ca') {
                fillCanadaAddress(event.shippingContact)
                    .then(() => applePayShippingContactSelected(request, event))
                    .catch(() => {
                        session.completeShippingContactSelection(ApplePaySession.
                                STATUS_INVALID_SHIPPING_POSTAL_ADDRESS,
                            getShippingMethods(), getOrderTotal(), getLineItems());
                    });
            } else {
                applePayShippingContactSelected(request, event);
            }
        };

        session.onshippingmethodselected = function (event) {
            applePayShippingMethodSelected(request, event);
        };

        session.onpaymentauthorized = function (event) {
            preparePaymentData(event.payment)
                .then(() => applePayPaymentAuthorized(request, event))
                .catch(() => session.completePayment(window.ApplePaySession.STATUS_FAILURE));
        };

        session.oncancel = function (event) {
            store.dispatch(Actions.showInterstice(false));
            store.dispatch(enableApplePaySession(false));
        };
    }

    function onApplePayClicked() {
        prepareSession();
        let requiredForRecognized = true;
        let isNewUserFlow = false;
        let isApplePaySignIn = true;
        let callback = (profileResponse) => {
            mergeBasketError = !!basketUtils.getMergeBasketWarning(profileResponse);
            let user = profileResponse ? profileResponse : store.getState().user;

            checkoutUtils.initializeCheckout({ isApplePayFlow: true, user }).
                then(order => {
                    // To keep legacy Play/Regular Checkout flow alive
                    if (Sephora.isMobile()) {
                        LegacyStorage.deleteLegacyJStorageItem('playUpdateOrderId');
                    }

                    withInterstice(checkoutApi.getOrderDetails)(order.orderId).
                        then(data => {
                            orderDetails = data;
                            session.begin();
                        });
                }).
                catch(checkoutUtils.initOrderFailure);
        };

        Authentication.requireAuthentication(requiredForRecognized,
            isNewUserFlow, null).then(callback);

        // If user became recognized - Abort current session
        let userWatch = watch(store.getState, 'user');
        store.subscribe(userWatch(() => {
            if (!userUtils.isSignedIn() && !sessionAborted) {
                sessionAborted = true;
                session.abort();
            }
        }));
    }

    function checkApplePayments(resolve) {
        if (window.ApplePaySession) {
            window.ApplePaySession.canMakePaymentsWithActiveCard(merchantIdentifier).
            then(canMakePayments => {
                resolve(canMakePayments ? TYPES.ENABLED : TYPES.HIDDEN);
            }).catch(() => {
                resolve(TYPES.HIDDEN);
            });
        } else {
            resolve(TYPES.HIDDEN);
        }
    }

    function getApplePaymentType(basket) {
        return new Promise((resolve, reject) => {
            if (basket.isInitialized && basket.isApplePayEnabled) {
                checkApplePayments((type) => {
                    if (type !== TYPES.HIDDEN) {
                        if (!basket.items.length) {
                            resolve(TYPES.DISABLED);
                        } else {
                            resolve(type);
                        }
                    } else {
                        resolve(TYPES.HIDDEN);
                    }
                });
            } else {
                resolve(TYPES.HIDDEN);
            }
        });

    }

    return {
        onApplePayClicked,
        getApplePaymentType,
        checkApplePayments,
        prepareSession,
        TYPES
    };

}());



// WEBPACK FOOTER //
// ./public_ufe/js/services/ApplePay.js