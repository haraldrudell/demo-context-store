import get from 'lodash/get'

import {
    CAPTCHA_REQUIRED,
    EMAIL_REQUIRED_WITH_FACEBOOK,
    INVALID_TOKEN,
    LOGIN,
    SMS_TWO_FACTOR_REQUIRED,
    TOTP_TWO_FACTOR_REQUIRED,
    TWO_FACTOR_INVALID,
    TWO_FACTOR_REQUIRED,
    DEVICE_VERIFICATION_EMAIL_REQUIRED,
    PASSWORD_EXPIRED,
} from '../constants'

const getErrorCodeName = errorObject => {
    const requestErrors = get(errorObject, 'errors')
    return get(requestErrors, '[0].codeName')
}
const getErrorCodeDetail = errorObject => {
    const requestErrors = get(errorObject, 'errors')
    return get(requestErrors, '[0].detail')
}

const handleTwoFactorError = (auth, error) => {
    const errorCodeName = getErrorCodeName(error)
    const twoFactorRequiredError =
        errorCodeName === TWO_FACTOR_REQUIRED ||
        errorCodeName === TOTP_TWO_FACTOR_REQUIRED ||
        errorCodeName === SMS_TWO_FACTOR_REQUIRED

    auth.actions.setTwoFactorRequired(
        twoFactorRequiredError ||
            errorCodeName === INVALID_TOKEN ||
            errorCodeName === TWO_FACTOR_INVALID,
    )

    const errorMetaData = get(error, 'errors[0].meta')
    if (errorMetaData && errorCodeName === SMS_TWO_FACTOR_REQUIRED) {
        auth.actions.setSmsTwoFactorMetaData(errorMetaData)
    }

    return twoFactorRequiredError
}

const handleDeviceAuthError = (auth, error) => {
    const errorCodeName = getErrorCodeName(error)
    const deviceVerificationViaEmailRequired =
        errorCodeName === DEVICE_VERIFICATION_EMAIL_REQUIRED
    auth.actions.setDeviceVerificationViaEmailRequired(
        deviceVerificationViaEmailRequired,
    )

    const errorMetaData = get(error, 'errors[0].meta')
    if (errorMetaData && errorCodeName === DEVICE_VERIFICATION_EMAIL_REQUIRED) {
        auth.actions.setEmailFactorMetaData(errorMetaData)
    }

    return deviceVerificationViaEmailRequired
}

const handleCaptchaError = (auth, error) => {
    const errorCodeName = getErrorCodeName(error)
    const captchaIsRequired = errorCodeName === CAPTCHA_REQUIRED
    auth.actions.setCaptchaRequired(captchaIsRequired)
    return captchaIsRequired
}

const handleEmailRequiredWithFacebookError = (auth, error) => {
    const errorCodeName = getErrorCodeName(error)
    const emailIsRequiredWithFacebook =
        errorCodeName === EMAIL_REQUIRED_WITH_FACEBOOK
    auth.actions.setEmailRequiredWithFacebook(emailIsRequiredWithFacebook)
    return emailIsRequiredWithFacebook
}

const handlePasswordExpiredError = (auth, error) => {
    const errorCodeName = getErrorCodeName(error)
    const passwordResetRequired = errorCodeName === PASSWORD_EXPIRED
    auth.actions.setPasswordResetRequired(passwordResetRequired)

    const errorCodeDetail = getErrorCodeDetail(error)
    if (errorCodeDetail && errorCodeName === PASSWORD_EXPIRED) {
        auth.actions.setPasswordResetDetail(errorCodeDetail)
    }

    return passwordResetRequired
}

export const handleAuthError = (auth, error) => ({
    sms: handleTwoFactorError(auth, error),
    device: handleDeviceAuthError(auth, error),
    captcha: handleCaptchaError(auth, error),
    emailWithFacebook: handleEmailRequiredWithFacebookError(auth, error),
    passwordResetRequired: handlePasswordExpiredError(auth, error),
})

export default (dataKey, props) => ({
    dataKey,
    initialValue: {
        displayForm: !Boolean(props.displayForm) ? LOGIN : props.displayForm,
        facebookAuthToken: props.facebookAuthToken,

        captchaRequired: props.showRecaptcha,
        captchaVerificationData: undefined,
        twoFactorRequired: false,
        smsTwoFactorMetaData: undefined,
        emailRequiredWithFacebook: false,
        deviceVerificationViaEmailRequired: false,
        emailFactorMetaData: undefined,
        passwordResetRequired: false,
        passwordResetDetail: undefined,
    },
    actions: {
        setCaptchaRequired: (auth, captchaRequired) =>
            auth.set('captchaRequired', captchaRequired),
        setCaptchaVerificationData: (auth, captchaVerificationData) =>
            auth.set('captchaVerificationData', captchaVerificationData),
        setDisplayForm: (auth, displayForm) =>
            auth.set('displayForm', displayForm),
        setFacebookAuthToken: (auth, facebookAuthToken) =>
            auth.set('facebookAuthToken', facebookAuthToken),
        setTwoFactorRequired: (auth, twoFactorRequired) =>
            auth.set('twoFactorRequired', twoFactorRequired),
        setSmsTwoFactorMetaData: (auth, smsTwoFactorMetaData) =>
            auth.set('smsTwoFactorMetaData', smsTwoFactorMetaData),
        setEmailRequiredWithFacebook: (auth, emailRequiredWithFacebook) =>
            auth.set('emailRequiredWithFacebook', emailRequiredWithFacebook),
        setDeviceVerificationViaEmailRequired: (
            auth,
            deviceVerificationViaEmailRequired,
        ) =>
            auth.set(
                'deviceVerificationViaEmailRequired',
                deviceVerificationViaEmailRequired,
            ),
        setEmailFactorMetaData: (auth, emailFactorMetaData) =>
            auth.set('emailFactorMetaData', emailFactorMetaData),
        setPasswordResetRequired: (auth, passwordResetRequired) =>
            auth.set('passwordResetRequired', passwordResetRequired),
        setPasswordResetDetail: (auth, passwordResetDetail) =>
            auth.set('passwordResetDetail', passwordResetDetail),
    },
})



// WEBPACK FOOTER //
// ./app/features/Auth/mallard-declarations/auth.js