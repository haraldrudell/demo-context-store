import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import { withProps } from 'recompose'
import { withPreset } from 'libs/with-preset'
import { withRouting } from 'libs/with-routing'
import Block from 'components/Layout/Block'
import Card from 'components/Card'
import Text from 'components/Text'
import LoadingSpinner from 'components/LoadingSpinner'
import TextButton from 'components/TextButton'
import Icon from 'components/Icon'
import withRedirect from 'utilities/with-redirect'

@withRouting
@withProps(props => ({
    isAttemptingVerification: Boolean(get(props, 'location.query.token')),
}))
@withPreset('verificationTokenExpired')
@withPreset('otherDeviceVerified')
class DeviceVerification extends Component {
    static propTypes = {
        isAttemptingVerification: PropTypes.bool.isRequired,
        email: PropTypes.string,
        redirectParam: PropTypes.string,
        verificationTokenExpired: PropTypes.bool,
        otherDeviceVerified: PropTypes.bool,
        onResendEmailToken: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
    }

    renderVerificationAttemptFailure = () => {
        const { redirectParam, verificationTokenExpired } = this.props
        const message = verificationTokenExpired
            ? 'The verification link you opened has expired.'
            : 'We don\u2019t recognize the verification link you opened.'
        const logInLink = redirectParam
            ? withRedirect('/login', redirectParam)
            : '/login'
        return (
            <div>
                <Block textAlign="center" mb={2}>
                    <Icon
                        type="warningLg"
                        size="xxxl"
                        color={['navy', 'coral']}
                    />
                </Block>
                <Block mb={2}>
                    <Text align="center" el="p">
                        {message}
                    </Text>
                </Block>
                <Text align="center" el="div">
                    <TextButton href={logInLink}>Log in</TextButton> or{' '}
                    <TextButton href="https://patreon.zendesk.com/hc/en-us/requests/new">
                        contact support
                    </TextButton>.
                </Text>
            </div>
        )
    }

    renderVerificationSent = () => {
        const { email, isLoading, onResendEmailToken } = this.props
        return (
            <div>
                <Block textAlign="center" mb={2}>
                    <Icon
                        type="devicesLg"
                        size="xxxl"
                        color={['navy', 'coral']}
                    />
                </Block>
                <Block mb={2}>
                    <Text align="center" el="p">
                        We need to verify this device to keep your account
                        secure.{' '}
                        {email ? (
                            <span>
                                We&rsquo;ve sent an email to{' '}
                                <Text weight="bold">{email}</Text>.
                            </span>
                        ) : (
                            'We\u2019ve sent you an email.'
                        )}{' '}
                        Open the link in the email to continue.
                    </Text>
                </Block>
                <Block mb={2}>
                    <Text align="center" el="div">
                        This email may take up to 5 minutes to be sent.
                    </Text>
                </Block>
                <Text align="center" el="div">
                    Can&rsquo;t find the verification email?
                </Text>
                <Text align="center" el="div">
                    {isLoading ? (
                        <Block display="inline-block" mr={1}>
                            <LoadingSpinner
                                size="sm"
                                color="gray2"
                                center={false}
                            />
                        </Block>
                    ) : null}
                    <TextButton href="https://patreon.zendesk.com/hc/en-us/articles/115003578386-Not-receiving-emails-from-Patreon">
                        Review your email filters
                    </TextButton>{' '}
                    or{' '}
                    <TextButton
                        onClick={() => onResendEmailToken()}
                        disabled={isLoading}
                    >
                        Resend verification email
                    </TextButton>{' '}
                </Text>
            </div>
        )
    }

    renderVerificationRequired = () => {
        const { isAttemptingVerification } = this.props
        return (
            <div>
                <Text align="center" scale="2" el="h1" weight="bold">
                    Verify this device
                </Text>
                <Card>
                    {isAttemptingVerification
                        ? this.renderVerificationAttemptFailure()
                        : this.renderVerificationSent()}
                </Card>
            </div>
        )
    }

    renderOtherDeviceVerified = () => {
        return (
            <div>
                <Text align="center" scale="2" el="h1" weight="bold">
                    Device verified
                </Text>
                <Card>
                    <Block textAlign="center" mb={2}>
                        <Icon
                            type="devicesLg"
                            size="xxxl"
                            color={['navy', 'coral']}
                        />
                    </Block>
                    <Text align="center" el="p">
                        We&rsquo;ve successfully verified your other device. Log
                        in again on the original device to continue.
                    </Text>
                </Card>
            </div>
        )
    }

    render() {
        return this.props.otherDeviceVerified
            ? this.renderOtherDeviceVerified()
            : this.renderVerificationRequired()
    }
}

export default DeviceVerification



// WEBPACK FOOTER //
// ./app/features/Auth/components/DeviceVerification/index.jsx