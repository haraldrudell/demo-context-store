import PropTypes from 'prop-types'
import React, { Component } from 'react'
import get from 'lodash/get'

import Block from 'components/Layout/Block'
import Button from 'components/Button'
import CardWithHeader from 'components/CardWithHeader'
import Text from 'components/Text'

import { EXPIRED_PASSWORD_EVENTS, logExpiredPasswordEvent } from 'analytics'

const REASON_PASSWORD_LEAK = 'password_leak'
const REASON_SUSPICIOUS_ACTIVITY = 'suspicious_activity'

export default class ExpiredPasswordReset extends Component {
    static propTypes = {
        email: PropTypes.string.isRequired,
        forgotPassword: PropTypes.object.isRequired,
        expireReason: PropTypes.string,
    }

    renderReason = () => {
        if (this.props.expireReason === REASON_PASSWORD_LEAK) {
            return (
                <div>
                    <Text el="p">
                        To be super clear — your Patreon account is safe and
                        sound, and we’re just expiring your password as a
                        proactive security measure.
                    </Text>
                    <Text el="p">
                        We found that your same username/password combination
                        may have been compromised during a leak on another
                        service. We hope you take this opportunity to create a
                        new, stronger password for Patreon that is different
                        from your passwords elsewhere.
                    </Text>
                </div>
            )
        }
        if (this.props.expireReason === REASON_SUSPICIOUS_ACTIVITY) {
            return (
                <Text el="p">
                    We expire passwords from time to time as a proactive
                    security measure. We detected suspicious activity in your
                    account. To keep your account secure, we expired your
                    password.
                </Text>
            )
        }
        return (
            <Text el="p">
                We expire passwords from time to time as a proactive security
                measure. To keep your account secure, we expired your password.
            </Text>
        )
    }

    renderInfoLink = () => {
        if (this.props.expireReason === REASON_PASSWORD_LEAK) {
            return (
                <Block mt={2}>
                    <Text el="p">
                        <a
                            href="https://patreon.zendesk.com/hc/en-us/articles/115005625346"
                            target="_blank"
                        >
                            Learn more about protecting your password
                        </a>
                    </Text>
                </Block>
            )
        }
        return null
    }

    renderSuccess = () => {
        return (
            <Block>
                <Text el="p">
                    <Text weight="bold">Success!</Text>
                </Text>
                <Text el="p">
                    We sent a password reset link to{' '}
                    <Text weight="bold">{this.props.email}</Text>. This email
                    may take a few minutes to arrive in your inbox.
                </Text>
                {this.renderInfoLink()}
            </Block>
        )
    }

    renderPrompt = () => {
        const isLoading = get(this.props.forgotPassword, 'request.isLoading')
        return (
            <div>
                <Block mb={2}>
                    <Text el="h1" size={2}>
                        Please create a new password. Safety first!
                    </Text>
                </Block>
                <Block mb={4}>{this.renderReason()}</Block>
                <Button
                    color="blue"
                    type="submit"
                    fluid
                    block
                    isLoading={isLoading}
                    onClick={this.handleClick}
                >
                    Create New Password
                </Button>
            </div>
        )
    }

    handleClick = () => {
        logExpiredPasswordEvent({
            title: EXPIRED_PASSWORD_EVENTS.CLICKED_SEND_RESET_EMAIL,
        })

        this.props.forgotPassword.actions.post({
            data: {
                email: this.props.email,
                expired_password_email: true,
            },
        })
    }

    render() {
        const emailSent = get(this.props.forgotPassword, 'request.isLoaded')
        return (
            <CardWithHeader title="Password Expired" size="md" hasHeaderBorder>
                {emailSent ? this.renderSuccess() : this.renderPrompt()}
            </CardWithHeader>
        )
    }
}



// WEBPACK FOOTER //
// ./app/features/Auth/components/ExpiredPasswordReset/index.jsx