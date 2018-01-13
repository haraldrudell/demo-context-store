import { makeLogger } from './logger'

export const PAYMENT_DECLINED_EVENTS = {
    DOMAIN: 'Payment Declined',
    LANDED: 'Landed',

    CLICKED_ADD_CARD: 'Clicked Add Card',
    CLICKED_ADD_PAYPAL: 'Clicked Add PayPal',
    CLICKED_ADD_CARD_OPEN: 'Clicked Add Card : Open',
    CLICKED_ADD_CARD_SUCCESS: 'Clicked Add Card : Success',

    CLICKED_RETRY: 'Clicked Retry',
    CLICKED_RETRY_SUCCESS: 'Clicked Retry : Success',
    CLICKED_RETRY_ERROR: 'Clicked Retry : Error',

    CLICKED_TRANSFER: 'Clicked Transfer : Open',
    CLICKED_TRANSFER_CONFIRM: 'Clicked Transfer : Confirm',
    CLICKED_TRANSFER_SUCCESS: 'Clicked Transfer : Success',
    CLICKED_TRANSFER_ERROR: 'Clicked Transfer : Error',
}

export const logPaymentDeclinedEvent = makeLogger(PAYMENT_DECLINED_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/payment-declined.js