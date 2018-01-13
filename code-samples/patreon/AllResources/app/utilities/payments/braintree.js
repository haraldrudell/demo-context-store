let braintreeInstance = undefined
let _stagedCallback = null
let _braintreeIsSetup = false

export const getBraintreeIsSetup = () => _braintreeIsSetup

export const initBraintree = (token, locale, tokenCallback) => {
    if (!window.braintree) {
        console.error('Braintree library not loaded, while trying to init.')
        return
    }
    // prevent loading twice
    if (_braintreeIsSetup) {
        return
    }
    _braintreeIsSetup = true

    window.braintree.setup(token, 'custom', {
        paypal: {
            locale,
            singleUse: false,
            enableShippingAddress: false,
            headless: true
        },
        dataCollector: {
            paypal: true
        },
        onReady: (btInstance) => {
            braintreeInstance = btInstance
        },
        onPaymentMethodReceived: (response) => {
            const result = tokenCallback(response.nonce, braintreeInstance.deviceData)
            result.then && result.then((cards) => _stagedCallback && _stagedCallback(cards))
        }
    })
}

export const addBraintreePayment = (callback) => {
    if (typeof callback === 'function') {
        _stagedCallback = callback
    }
    if (!braintreeInstance) {
        console.error('Braintree has not been initialized.')
        return
    }
    braintreeInstance.paypal.initAuthFlow()
}



// WEBPACK FOOTER //
// ./app/utilities/payments/braintree.js