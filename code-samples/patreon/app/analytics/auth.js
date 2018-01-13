import { makeLogger, trackFacebookConversionEvent } from './logger'

export const AUTH_EVENTS = {
    DOMAIN: 'Auth',
    LANDED: 'Landed',
}

export const logAuthEvent = makeLogger(AUTH_EVENTS.DOMAIN)

export const SIGN_UP_EVENTS = {
    DOMAIN: 'Sign Up',

    LANDED: 'Landed',
    SUBMITTED: 'Submitted',
    ERROR: 'Error',
    SUCCESS: 'Success',
}

export const logSignupEvent = makeLogger(SIGN_UP_EVENTS.DOMAIN, eventName => {
    // Track the facebook conversion event depending on the type of signup event
    if (eventName === SIGN_UP_EVENTS.SUCCESS) {
        trackFacebookConversionEvent('CompleteRegistration')
    }
})

export const LOG_IN_EVENTS = {
    DOMAIN: 'Log In',

    LANDED: 'Landed',
    SUBMITTED: 'Submitted',
    ERROR: 'Error',
    SUCCESS: 'Success',
}

export const logLoginEvent = makeLogger(LOG_IN_EVENTS.DOMAIN)

export const LOG_OUT_EVENTS = {
    DOMAIN: 'Log Out',
}

export const logLogoutEvent = makeLogger(LOG_OUT_EVENTS.DOMAIN)

export const AUTH_METHODS = {
    EMAIL: 'email',
    FACEBOOK: 'facebook',
}

export const EXPIRED_PASSWORD_EVENTS = {
    DOMAIN: 'Expired Password',

    LANDED: 'Landed',
    CLICKED_SEND_RESET_EMAIL: 'Clicked Send Reset Email',
}

export const logExpiredPasswordEvent = makeLogger(
    EXPIRED_PASSWORD_EVENTS.DOMAIN,
)

export const FORGOT_PASSWORD_ENTER_EMAIL_EVENTS = {
    DOMAIN: 'Forgot Password : Enter Email',

    LANDED: 'Landed',
    SUBMITTED: 'Submitted',
    ERROR: 'Error',
    SUCCESS: 'Success',
}

export const logForgotPasswordEnterEmailEvent = makeLogger(
    FORGOT_PASSWORD_ENTER_EMAIL_EVENTS.DOMAIN,
)

export const FORGOT_PASSWORD_ENTER_PASSWORD_EVENTS = {
    DOMAIN: 'Forgot Password : Enter New Password',

    LANDED: 'Landed',
    SUBMITTED: 'Submitted',
    ERROR: 'Error',
    SUCCESS: 'Success',
    CLICKED_LOG_IN: 'Clicked Log In',
}

export const logForgotPasswordEnterPasswordEvent = makeLogger(
    FORGOT_PASSWORD_ENTER_PASSWORD_EVENTS.DOMAIN,
)



// WEBPACK FOOTER //
// ./app/analytics/auth.js