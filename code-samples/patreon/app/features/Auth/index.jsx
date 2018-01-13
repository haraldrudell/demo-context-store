import t from 'prop-types'
import React, { Component } from 'react'

import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import get from 'lodash/get'

import { setCsrfSignature } from 'utilities/csrf'
import mallard from 'libs/mallard'
import { selectResourceForKey } from 'libs/reform'

import nion from 'nion'
import { buildUrl, JsonApiPayload } from 'utilities/json-api'

import { facebookAuth } from 'actions/facebook'
import { GOOGLE_ANALYTICS_CONVERSION } from 'constants/google-analytics'
import authModel, { handleAuthError } from './mallard-declarations/auth'
import Signup from './components/Signup'
import Login from './components/Login'
import DeviceVerification from './components/DeviceVerification'
import ExpiredPasswordReset from './components/ExpiredPasswordReset'

import {
    FACEBOOK_LOGIN,
    FACEBOOK_SIGNUP,
    FORGOT_PASSWORD,
    LOGIN,
    SIGNUP,
    TERMS,
    DEVICE_VERIFICATION,
    PASSWORD_EXPIRATION,
} from './constants'

import {
    LOG_IN_EVENTS,
    SIGN_UP_EVENTS,
    AUTH_METHODS,
    EXPIRED_PASSWORD_EVENTS,
    logSignupEvent,
    logLoginEvent,
    logExpiredPasswordEvent,
} from 'analytics'
import { logBlogGoogleAnalyticsEvent } from 'analytics/logger'

const getFacebookAuthToken = state => get(state, 'facebook.accessToken', null)
const getRedirectParam = state => get(state, 'routing.location.query.ru', null)
const getEmailFromLoginForm = state =>
    get(selectResourceForKey('login')(state), 'model.email', null)

const mapStateToProps = createStructuredSelector({
    facebookAuthToken: getFacebookAuthToken,
    redirectParam: getRedirectParam,
    emailFromLoginForm: getEmailFromLoginForm,
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return {
        ...ownProps,
        ...stateProps,
        ...dispatchProps,
    }
}

@nion({
    currentUser: {
        endpoint: buildUrl('/user', {}),
    },
    smsVerification: {
        endpoint: buildUrl('/phones/send-verification'),
        apiType: 'api',
    },
    deviceVerificationViaEmail: {
        endpoint: buildUrl('/device-verification/email/resend'),
        apiType: 'api',
    },
    forgotPassword: {
        endpoint: buildUrl('/auth/forgot-password'),
    },
})
@connect(mapStateToProps, () => ({}), mergeProps)
@mallard(props => ({
    auth: authModel('auth', props),
}))
class Auth extends Component {
    static propTypes = {
        mallard: t.shape({
            auth: t.shape({
                value: t.shape({
                    captchaRequired: t.bool.isRequired,
                    captchaVerificationData: t.string,
                    displayForm: t.string.isRequired,
                    facebookAuthToken: t.string,
                    twoFactorRequired: t.bool.isRequired,
                    smsTwoFactorMetaData: t.object,
                    emailRequiredWithFacebook: t.bool.isRequired,
                    emailFactorMetaData: t.object,
                    passwordResetRequired: t.bool.isRequired,
                    passwordResetDetail: t.string,
                }).isRequired,
                actions: t.shape({
                    setDisplayForm: t.func.isRequired,
                    setCaptchaRequired: t.func.isRequired,
                    setCaptchaVerificationData: t.func.isRequired,
                    setEmailRequiredWithFacebook: t.func.isRequired,
                    setFacebookAuthToken: t.func.isRequired,
                    setSmsTwoFactorMetaData: t.func.isRequired,
                    setTwoFactorRequired: t.func.isRequired,
                    setDeviceVerificationViaEmailRequired: t.func.isRequired,
                    setEmailFactorMetaData: t.func.isRequired,
                    setPasswordResetRequired: t.func.isRequired,
                    setPasswordResetDetail: t.func.isRequired,
                }).isRequired,
            }),
        }).isRequired,
        hideTitle: t.bool,
        onChangeContext: t.func,
        isRedirecting: t.bool,
        redirectParam: t.string,
        emailFromLoginForm: t.string,
        onSuccess: t.func,
    }

    static defaultProps = {
        hideTitle: true,
    }

    callLogEvent = (logFn, title, authMethod) => {
        const logObj = { title }
        if (authMethod) {
            logObj['info'] = {
                method: authMethod,
            }
        }
        logFn(logObj)
    }

    callGoogleAnalyticsEvent = eventCategory => {
        logBlogGoogleAnalyticsEvent(eventCategory, GOOGLE_ANALYTICS_CONVERSION)
    }

    componentWillReceiveProps(nextProps) {
        /*
            this is sort of a workaround, nion promises do not return meta data
            we will add that, but it's fairly large change as the response signatures
            of every nion action promise would need to be modified so that we can return
            objects that can be destructured w/ mulitple arguments
        */
        const csrfCignature = get(
            this.props.nion,
            'currentUser.meta.csrf_token',
            get(this.props.nion, 'currentUser.extra.meta.csrf_token', null),
        )
        if (csrfCignature) {
            setCsrfSignature(csrfCignature)
        }
    }

    signup(newUserPayload, authMethod) {
        const { currentUser } = this.props.nion

        this.callLogEvent(logSignupEvent, SIGN_UP_EVENTS.SUBMITTED, authMethod)

        currentUser.actions
            .post(newUserPayload.toRequest(), {
                endpoint: buildUrl('/user', {
                    include: ['campaign'],
                }),
            })
            .then(newUser => {
                this.callLogEvent(
                    logSignupEvent,
                    SIGN_UP_EVENTS.SUCCESS,
                    authMethod,
                )
                this.props.onSuccess(newUser)
                this.callGoogleAnalyticsEvent(SIGN_UP_EVENTS.DOMAIN)
            })
            .catch(error => {
                const {
                    sms: twoFactorRequiredError,
                    captcha: captchaRequiredError,
                    device: deviceVerificationRequriedError,
                } = handleAuthError(this.props.mallard.auth, error)

                if (twoFactorRequiredError) {
                    // in the case a user is using the signup form to login and 2fa is required
                    // change the view state to LOGIN to be prompted for 2fa code entry
                    this.changeContext(LOGIN)
                    window.scrollTo(0, 0)
                    return
                }

                if (deviceVerificationRequriedError) {
                    this.changeContext(DEVICE_VERIFICATION)
                    window.scrollTo(0, 0)
                    return
                }

                if (captchaRequiredError) {
                    return
                }

                this.callLogEvent(
                    logSignupEvent,
                    SIGN_UP_EVENTS.ERROR,
                    authMethod,
                )
            })
    }

    login(userPayload, authMethod) {
        const { currentUser } = this.props.nion

        this.callLogEvent(logLoginEvent, LOG_IN_EVENTS.SUBMITTED, authMethod)

        currentUser.actions
            .post(userPayload.toRequest(), {
                endpoint: buildUrl('/login', {
                    include: ['campaign'],
                }),
            })
            .then(user => {
                this.callLogEvent(
                    logLoginEvent,
                    LOG_IN_EVENTS.SUCCESS,
                    authMethod,
                )
                this.props.onSuccess(user)
            })
            .catch(error => {
                const {
                    sms: twoFactorRequiredError,
                    captcha: captchaRequiredError,
                    device: deviceVerificationRequriedError,
                    passwordResetRequired: passwordExpiredError,
                } = handleAuthError(this.props.mallard.auth, error)

                // don't log two factor required as an error and scroll to top of page
                if (twoFactorRequiredError || captchaRequiredError) {
                    window.scrollTo(0, 0)
                    return
                }

                if (deviceVerificationRequriedError) {
                    this.changeContext(DEVICE_VERIFICATION)
                    window.scrollTo(0, 0)
                    return
                }

                if (passwordExpiredError) {
                    this.changeContext(PASSWORD_EXPIRATION)
                    window.scrollTo(0, 0)
                    return
                }

                this.callLogEvent(
                    logLoginEvent,
                    LOG_IN_EVENTS.ERROR,
                    authMethod,
                )
            })
    }

    handleAuth(model, type) {
        const {
            captchaVerificationData,
            facebookAuthToken,
            twoFactorRequired,
        } = this.props.mallard.auth.value
        const { setFacebookAuthToken } = this.props.mallard.auth.actions
        const { redirectParam } = this.props

        const authRequestPayload = new JsonApiPayload('user', {
            email: Boolean(model.email) ? model.email : undefined,
            password: Boolean(model.password) ? model.password : undefined,
        })

        if (captchaVerificationData) {
            authRequestPayload.addAttribute(
                'recaptcha_response_field',
                captchaVerificationData,
            )
        }

        if (facebookAuthToken) {
            authRequestPayload.addAttribute(
                'fb_access_token',
                facebookAuthToken,
            )
        }

        if (twoFactorRequired) {
            authRequestPayload.addAttribute(
                'two_factor_code',
                model.twoFactorCode,
            )
        }

        if (redirectParam) {
            authRequestPayload.addMetaAttribute(
                'redirect_target',
                redirectParam,
            )
        }

        if (type === SIGNUP) {
            authRequestPayload.addAttribute('name', model.name)
            this.signup(authRequestPayload, AUTH_METHODS.EMAIL)
        }

        if (type === LOGIN) {
            this.login(authRequestPayload, AUTH_METHODS.EMAIL)
        }

        if (type === FACEBOOK_LOGIN) {
            facebookAuth().then(authResponse => {
                const accessToken = get(authResponse, 'accessToken')
                setFacebookAuthToken(accessToken)
                authRequestPayload.addAttribute('fb_access_token', accessToken)
                this.login(authRequestPayload, AUTH_METHODS.FACEBOOK)
            })
        }

        if (type === FACEBOOK_SIGNUP) {
            facebookAuth().then(authResponse => {
                const accessToken = get(authResponse, 'accessToken')
                if (!accessToken) {
                    // TODO: show error auth state
                }

                setFacebookAuthToken(accessToken)
                authRequestPayload.addAttribute('email', model.email)
                authRequestPayload.addAttribute('fb_access_token', accessToken)

                if (model.password) {
                    authRequestPayload.addAttribute('password', model.password)
                }

                this.signup(authRequestPayload, AUTH_METHODS.FACEBOOK)
            })
        }
    }

    changeContext(type) {
        const { setDisplayForm } = this.props.mallard.auth.actions
        if (type === LOGIN) {
            this.callLogEvent(logLoginEvent, LOG_IN_EVENTS.LANDED)
            setDisplayForm(LOGIN)
        }

        if (type === SIGNUP) {
            this.callLogEvent(logSignupEvent, SIGN_UP_EVENTS.LANDED)
            setDisplayForm(SIGNUP)
        }

        if (type === DEVICE_VERIFICATION) {
            this.callLogEvent(logSignupEvent, SIGN_UP_EVENTS.LANDED)
            setDisplayForm(DEVICE_VERIFICATION)
        }

        if (type === PASSWORD_EXPIRATION) {
            this.callLogEvent(
                logExpiredPasswordEvent,
                EXPIRED_PASSWORD_EVENTS.LANDED,
            )
            setDisplayForm(PASSWORD_EXPIRATION)
        }

        if (type === TERMS) {
            window.open('/legal', '_blank')
        }

        if (type === FORGOT_PASSWORD) {
            window.open('/forgetPass', '_blank')
        }

        if (this.props.onChangeContext) {
            this.props.onChangeContext(type)
        }
    }

    isLoading = () => {
        const { isRedirecting } = this.props
        const {
            smsVerification,
            currentUser,
            deviceVerificationViaEmail,
        } = this.props.nion
        const requestIsLoading = get(currentUser, 'request.isLoading', false)
        const smsResendIsLoading = get(
            smsVerification,
            'request.isLoading',
            false,
        )
        const emailResendIsLoading = get(
            deviceVerificationViaEmail,
            'request.isLoading',
            false,
        )
        return (
            requestIsLoading ||
            smsResendIsLoading ||
            emailResendIsLoading ||
            isRedirecting
        )
    }

    onResendCode = () => {
        const { smsTwoFactorMetaData } = this.props.mallard.auth.value
        const { smsVerification } = this.props.nion
        smsVerification.actions.post({
            data: {
                phone_last_three: smsTwoFactorMetaData.phoneLastThree,
                phone_number_id: smsTwoFactorMetaData.phoneNumberId,
                timestamp: smsTwoFactorMetaData.timestamp,
                token: smsTwoFactorMetaData.token,
            },
        })
    }

    onResendEmailToken = () => {
        const { emailFactorMetaData } = this.props.mallard.auth.value
        if (!emailFactorMetaData) {
            return
        }
        const { deviceVerificationViaEmail } = this.props.nion
        deviceVerificationViaEmail.actions.post({
            data: {
                verification_factor_email_id:
                    emailFactorMetaData.verificationFactorEmailId,
                timestamp: emailFactorMetaData.timestamp,
                checksum: emailFactorMetaData.checksum,
                context: emailFactorMetaData.context,
                redirect_target: emailFactorMetaData.redirectTarget,
            },
        })
    }

    onCaptchaVerified = responseData => {
        const { setCaptchaVerificationData } = this.props.mallard.auth.actions
        if (responseData) {
            setCaptchaVerificationData(responseData)
        }
    }

    getError() {
        const hasError = get(this.props.nion.currentUser, 'request.isError')
        const requestErrors = get(this.props.nion.currentUser, 'request.errors')
        const errorMessage =
            get(requestErrors, '[0].detail') || get(requestErrors, '[0].title')

        if (hasError && errorMessage) {
            return errorMessage
        } else if (hasError) {
            return 'Something went wrong. We were unable to create or login your account.'
        }
    }

    render() {
        const { hideTitle } = this.props
        const {
            captchaRequired,
            displayForm,
            emailRequiredWithFacebook,
            smsTwoFactorMetaData,
            twoFactorRequired,
        } = this.props.mallard.auth.value

        const _onSubmit = (model, type) => this.handleAuth(model, type)
        const _onChangeContext = type => this.changeContext(type)

        if (displayForm === SIGNUP) {
            return (
                <Signup
                    onSubmit={_onSubmit}
                    onChangeContext={_onChangeContext}
                    isLoading={this.isLoading()}
                    error={this.getError()}
                    facebookEnabled={emailRequiredWithFacebook}
                    twoFactorRequired={twoFactorRequired}
                    hideTitle={hideTitle}
                    showRecaptcha={captchaRequired}
                    onRecaptchaVerified={this.onCaptchaVerified}
                />
            )
        } else if (displayForm === DEVICE_VERIFICATION) {
            return (
                <DeviceVerification
                    onResendEmailToken={this.onResendEmailToken}
                    isLoading={this.isLoading()}
                    redirectParam={this.props.redirectParam}
                    email={this.props.emailFromLoginForm}
                />
            )
        } else if (displayForm === PASSWORD_EXPIRATION) {
            return (
                <ExpiredPasswordReset
                    email={this.props.emailFromLoginForm}
                    forgotPassword={this.props.nion.forgotPassword}
                    expireReason={
                        this.props.mallard.auth.value.passwordResetDetail
                    }
                />
            )
        }
        return (
            <Login
                onSubmit={_onSubmit}
                onChangeContext={_onChangeContext}
                isLoading={this.isLoading()}
                error={this.getError()}
                hideTitle={hideTitle}
                twoFactorRequired={twoFactorRequired}
                smsTwoFactorMetaData={smsTwoFactorMetaData}
                onResendCode={this.onResendCode}
                showRecaptcha={captchaRequired}
                onRecaptchaVerified={this.onCaptchaVerified}
            />
        )
    }
}

export default Auth



// WEBPACK FOOTER //
// ./app/features/Auth/index.jsx