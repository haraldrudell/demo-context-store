import formatCurrency from 'utilities/format-currency-from-cents-force-decimals'

const STRIPE_LOGO_IMAGE =
    'https://c5.patreon.com/external/logo/downloads_logomark_color_on_coral.png'
let _stripeCheckout = undefined
let _stagedCallback = null

export const initStripeCheckout = (stripeKey, tokenCallback) => {
    if (!window.StripeCheckout) {
        console.error(
            'StripeCheckout library not loaded, while trying to init.',
        )
        return
    }
    // prevent loading twice
    if (_stripeCheckout) {
        return
    }
    if (typeof stripeKey !== 'string') {
        console.error(
            'StripeCheckout was not provided a valid key upon initialization.',
        )
    }

    _stripeCheckout = window.StripeCheckout.configure({
        locale: 'auto',
        key: stripeKey,
        image: STRIPE_LOGO_IMAGE,
        zipCode: true,
        token: token => {
            const result = tokenCallback(token)
            result.then &&
                result.then(cards => _stagedCallback && _stagedCallback(cards))
        },
    })
}

export const addCreditCard = (
    amountCents,
    email,
    requireAddress,
    panelLabel,
    callback,
) => {
    if (!_stripeCheckout) {
        console.error('StripeCheckout has not been initialized.')
        return
    }

    if (typeof callback === 'function') {
        _stagedCallback = callback
    }

    let options = {
        email,
        address: requireAddress,
        panelLabel,
    }
    if (amountCents !== undefined) {
        options = {
            ...options,
            amountCents,
            amountDollarString: formatCurrency(amountCents),
        }
    }

    _stripeCheckout.open(options)
}



// WEBPACK FOOTER //
// ./app/utilities/payments/stripe.js