import { makeLogger } from './logger'

export const PAYMENT_SETTINGS_EVENTS = {
    DOMAIN: 'Payment Settings',
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

    CLICKED_DELETE: 'Clicked Delete : Open',
    CLICKED_DELETE_CONFIRM: 'Clicked Delete : Confirm',
    CLICKED_DELETE_SUCCESS: 'Clicked Delete : Success',
    CLICKED_DELETE_ERROR: 'Clicked Delete : Error',
}

export const PAYOUT_SETTINGS_EVENTS = {
    DOMAIN: 'Payout Settings',
    LANDED: 'Landed',

    SWITCHED_LOCATION: 'Switched Location',
    SWITCHED_IDENTITY: 'Switched Identity',
    SWITCH_PAYMENT_METHOD: 'Switched Payment Method',
    TOGGLED_AUTO_PAY: 'Toggled Auto Pay',

    CLICKED_SETUP_PAYONEER: 'Clicked Setup Payoneer',
    DELETED_STRIPE_PAYMENT_METHOD: 'Deleted Stripe Payment Method',
    CLICKED_UPDATE_BANK: 'Clicked Update Bank',
    CLICKED_UPDATE_CORPORATE: ' Clicked Update Corporate',
    CLICKED_SAVE_PREFERENCES: 'Clicked Save Preferences',
    CLICKED_PAYOUT: 'Clicked Payout',
    CLICKED_TAX_BUTTON: 'Clicked Tax Button',
    CLICKED_UPLOAD_IDENTITY_DOCUMENT: 'Clicked Upload Identity Document',
    IDENTITY_DOCUMENT_SUCCESSFULLY_UPLOADED: 'Identity Document Successfully Uploaded'
}

export const SETTINGS_PAGE_EVENTS = {
    DOMAIN: 'Settings',
    LANDED: 'Landed',

    CLICKED_SUBPAGE: 'Clicked Subpage',

    UPDATE_AVATAR_BEGAN: 'Update Avatar Began',
    UPDATE_AVATAR_FINISHED: 'Update Avatar Finished',

    PATCH_PROFILE_BEGAN: 'Patch Profile Began',
    PATCH_PROFILE_FINISHED: 'Patch Profile Finished',

    REVERT_TO_PATRON_BEGAN: 'Revert to Patron Began',
    REVERT_TO_PATRON_FINISHED: 'Revert to Patron Finished',

    PATCH_EMAIL_SETTINGS_BEGAN: 'Patch Email Settings Began',
    PATCH_EMAIL_SETTINGS_FINISHED: 'Patch Email Settings Finished',

    UPDATE_PASSWORD_BEGAN: 'Update Password Began',
    UPDATE_PASSWORD_FINISHED: 'Update Password Finished',

    UPDATE_FACEBOOK_CONNECT_BEGAN: 'Update Facebook Connect Began',
    UPDATE_FACEBOOK_CONNECT_FINISHED: 'Update Facebook Connect Finished',

    UPDATE_TWO_FACTOR_AUTH_OPENED: 'Update Two-Factor Auth Opened',
    UPDATE_TWO_FACTOR_AUTH_BEGAN: 'Update Two-Factor Auth Began',
    UPDATE_TWO_FACTOR_AUTH_FINISHED: 'Update Two-Factor Auth Finished',

    ENABLED_INLINE_IMAGES: 'Enabled Inline Images',
    DISABLED_INLINE_IMAGES: 'Disabled Inline Images'
}

export const logSettingsEvent = makeLogger(SETTINGS_PAGE_EVENTS.DOMAIN)
export const logPayoutSettingsEvent = makeLogger(PAYOUT_SETTINGS_EVENTS.DOMAIN)
export const logPaymentSettingsEvent = makeLogger(PAYMENT_SETTINGS_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/settings.js