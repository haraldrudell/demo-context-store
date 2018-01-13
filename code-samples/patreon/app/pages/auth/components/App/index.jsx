import t from 'prop-types'
import React, { Component } from 'react'
import { createStructuredSelector } from 'reselect'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { withState } from 'recompose'
import get from 'lodash/get'

import { selectPreset } from 'libs/with-preset'

import Grid from 'components/Layout/Grid'

import {
    SIGNUP,
    LOGIN,
    DEVICE_VERIFICATION,
    PASSWORD_EXPIRATION,
} from 'features/Auth/constants'
import sanitizeUrl from 'utilities/sanitize-url'

const LOGIN_ROUTE = '/login'
const SIGNUP_ROUTE = '/signup'
const DEVICE_VERIFICATION_ROUTE = '/auth/verify-device'
const HOME_ROUTE = '/home'

import { AUTH_EVENTS } from 'analytics'
import { logAuthEvent } from 'shared/events/auth'

const mapStateToProps = createStructuredSelector({
    mainServer: selectPreset('mainServer'),
    redirectUrl: selectPreset('redirectUrl', '/home'),
    showRecaptcha: selectPreset('showCaptcha', false),
})

@connect(mapStateToProps)
@withState('isRedirecting', 'setIsRedirecting', false)
class App extends Component {
    static propTypes = {
        children: t.node,
        isRedirecting: t.bool,
        mainServer: t.string,
        redirectUrl: t.string,
        setIsRedirecting: t.func,
        showRecaptcha: t.bool,
    }

    constructor(props) {
        super(props)
        logAuthEvent(AUTH_EVENTS.LANDED, {
            page: 'auth',
        })
    }

    onAuthSuccess = user => {
        const { redirectUrl, mainServer, setIsRedirecting } = this.props
        const campaign = get(user, 'campaign')
        const publishedAt = get(campaign, 'publishedAt')

        setIsRedirecting(true)

        let url = redirectUrl
        if (!url && campaign && publishedAt) {
            url = HOME_ROUTE
        }

        let finalUrl = `${mainServer}${url}`
        if (url.indexOf('https://') === 0 || url.indexOf('http://') === 0) {
            finalUrl = url
        }

        window.location.href = sanitizeUrl(finalUrl)
    }

    onChangeContext = type => {
        if (type === LOGIN) {
            browserHistory.push(LOGIN_ROUTE)
        } else if (type === PASSWORD_EXPIRATION) {
            browserHistory.push(LOGIN_ROUTE)
        } else if (type === DEVICE_VERIFICATION) {
            browserHistory.push(DEVICE_VERIFICATION_ROUTE)
        } else {
            browserHistory.push(SIGNUP_ROUTE)
        }
    }

    render() {
        const { showRecaptcha, isRedirecting } = this.props
        const route = this.props.children
        let displayForm = LOGIN
        if (route.props.location.pathname === SIGNUP_ROUTE) {
            displayForm = SIGNUP
        } else if (
            route.props.location.pathname === DEVICE_VERIFICATION_ROUTE
        ) {
            displayForm = DEVICE_VERIFICATION
        }

        const stepProps = {
            hideTitle: false,
            onSuccess: this.onAuthSuccess,
            onChangeContext: this.onChangeContext,
            isRedirecting,
            displayForm,
            showRecaptcha,
        }

        const step = route && React.cloneElement(route, stepProps)
        return (
            <div className="containerInner fullWidthMobile">
                <Grid maxWidth="sm" ph={{ xs: 0, sm: 0 }} pv={{ xs: 2, sm: 2 }}>
                    {step}
                </Grid>
            </div>
        )
    }
}

export default App



// WEBPACK FOOTER //
// ./app/pages/auth/components/App/index.jsx