import t from 'prop-types'
import React, { Component } from 'react'
import Recaptcha from 'react-recaptcha'
import reform from 'libs/reform'
import { withState } from 'recompose'
import get from 'lodash/get'

import Button from 'components/Button'
import ButtonWithIcon from 'components/ButtonWithIcon'
import Input from 'components/Form/Input'
import Text from 'components/Text'
import Card from 'components/Card'
import Block from 'components/Layout/Block'
import TextButton from 'components/TextButton'

import loginForm from '../../reform-declarations/login'
import {
    FACEBOOK_LOGIN,
    FORGOT_PASSWORD,
    LOGIN,
    RECAPTCHA_KEY,
    SIGNUP,
} from '../../constants'

const inputs = [
    {
        type: 'email',
        name: 'email',
        placeHolder: 'Email',
        autoFocus: true,
        icon: {
            type: 'email',
            size: 'xs',
            color: 'gray3',
        },
    },
    {
        type: 'password',
        name: 'password',
        placeHolder: 'Password',
        icon: {
            type: 'key',
            size: 'xs',
            color: 'gray3',
        },
    },
    {
        type: 'text',
        name: 'twoFactorCode',
        placeHolder: 'Two-Factor Code',
        autoFocus: true,
        icon: {
            type: 'lock',
            size: 'xs',
            color: 'gray3',
        },
    },
]

@reform(loginForm('login'))
@withState('recaptchaVerified', 'setRecaptchaVerified', false)
export default class LoginForm extends Component {
    static propTypes = {
        error: t.string,
        hideTitle: t.bool,
        isLoading: t.bool,
        onChangeContext: t.func,
        onRecaptchaVerified: t.func,
        onResendCode: t.func,
        onSubmit: t.func,
        recaptchaVerified: t.bool.isRequired,
        setRecaptchaVerified: t.func.isRequired,
        showRecaptcha: t.bool.isRequired,
        smsTwoFactorMetaData: t.object,
        twoFactorRequired: t.bool,
        reform: t.shape({
            login: t.shape({
                model: t.shape({
                    email: t.string.isRequired,
                    password: t.string.isRequired,
                }).isRequired,
                bindInput: t.func.isRequired,
                // TODO: more specificity
                dirtyState: t.object.isRequired,
                validation: t.object.isRequired,
            }).isRequired,
        }).isRequired,
    }

    submitHandler = (e, authType) => {
        e.preventDefault()
        const model = this.props.reform.login.model
        this.props.onSubmit(model, authType)
        return false
    }

    contextHandler = (e, authType) => {
        e.preventDefault()
        this.props.onChangeContext(authType)
        return false
    }

    onCaptchaVerify = response => {
        const { setRecaptchaVerified, onRecaptchaVerified } = this.props
        setRecaptchaVerified(true)
        if (onRecaptchaVerified) {
            onRecaptchaVerified(response)
        }
    }

    isProbablyNotABot = () => {
        const { recaptchaVerified, showRecaptcha } = this.props
        return !showRecaptcha || !!recaptchaVerified
    }

    render() {
        const {
            error,
            hideTitle,
            isLoading,
            onResendCode,
            showRecaptcha,
            smsTwoFactorMetaData,
            twoFactorRequired,
        } = this.props
        const {
            bindInput,
            dirtyState,
            model,
            validation,
        } = this.props.reform.login

        const twoFactorInputs = input => input.name === 'twoFactorCode'
        const loginInputs = input =>
            input.name === 'email' || input.name === 'password'

        const inputElements = inputs
            .filter(twoFactorRequired ? twoFactorInputs : loginInputs)
            .map((input, i) => {
                const field = validation.fields[input.name]
                const errorMessage = get(field, 'errors[0]', undefined)
                const dataEntered = input.name in model
                const hasBlurred = get(
                    dirtyState,
                    `${input.name}.hasBlurred`,
                    false,
                )
                // @TODO: Change placeholder to label when we actually launch rebrand
                return (
                    <Block mb={1} key={`input-${input.name}`}>
                        <Input
                            {...bindInput(input.name)}
                            autoFocus={!!input.autoFocus}
                            type={input.type}
                            label={input.placeHolder}
                            icon={input.icon}
                            error={hasBlurred && dataEntered && errorMessage}
                        />
                    </Block>
                )
            })

        const last3 = get(smsTwoFactorMetaData, 'phoneLastThree')
        const twoFactorTitle = last3
            ? `We sent an SMS authentication code to your phone number ending in ${last3}`
            : 'Two-Factor authentication required'

        const actionText = twoFactorRequired ? 'Verify' : 'Log in'
        const errorColor = twoFactorRequired ? 'gray1' : 'error'
        const stepDisabled = !validation.isValid && !twoFactorRequired

        return (
            <div>
                {!hideTitle && (
                    <Text align="center" scale="2" el="h1" weight="bold">
                        Log in
                    </Text>
                )}
                <Block mb={5}>
                    <Card>
                        {!twoFactorRequired && (
                            <span>
                                <ButtonWithIcon
                                    icon="socialRoundedFacebook"
                                    color="facebookBlue"
                                    size="md"
                                    iconSize="xs"
                                    onClick={e =>
                                        this.submitHandler(e, FACEBOOK_LOGIN)}
                                    fluid
                                    block
                                    disabled={isLoading}
                                >
                                    Continue with Facebook
                                </ButtonWithIcon>
                                <Block mv={4}>
                                    <Text align="center" el="p" color="gray3">
                                        or log in with email
                                    </Text>
                                </Block>
                            </span>
                        )}
                        {twoFactorRequired && (
                            <Block mb={4}>
                                <Text
                                    align="center"
                                    scale="1"
                                    el="p"
                                    color={errorColor}
                                >
                                    {twoFactorTitle}
                                </Text>
                            </Block>
                        )}
                        {error &&
                            error !== 'Two Factor Auth Required' && (
                                <Text
                                    align="center"
                                    scale="1"
                                    el="p"
                                    color="error"
                                    data-tag="login-error"
                                >
                                    {error}
                                </Text>
                            )}
                        <form
                            onSubmit={e => this.submitHandler(e, LOGIN)}
                            data-tag="login-form"
                        >
                            {inputElements}
                            {!twoFactorRequired && (
                                <Block mv={3}>
                                    <Text align="right" el="div">
                                        <TextButton
                                            onClick={e =>
                                                this.contextHandler(
                                                    e,
                                                    FORGOT_PASSWORD,
                                                )}
                                        >
                                            Forgot Password?
                                        </TextButton>
                                    </Text>
                                </Block>
                            )}
                            <Block mv={2}>
                                <span>
                                    {showRecaptcha && (
                                        <Recaptcha
                                            render="explicit"
                                            onloadCallback={() => {}}
                                            verifyCallback={
                                                this.onCaptchaVerify
                                            }
                                            sitekey={RECAPTCHA_KEY}
                                        />
                                    )}
                                </span>
                            </Block>
                            <Block mv={2}>
                                <Button
                                    color="blue"
                                    type="submit"
                                    disabled={stepDisabled}
                                    fluid
                                    block
                                    isLoading={isLoading}
                                >
                                    {actionText}
                                </Button>
                            </Block>
                        </form>
                        {!twoFactorRequired && (
                            <Text align="center" el="div">
                                <Text>New to Patreon? </Text>
                                <TextButton
                                    onClick={e =>
                                        this.contextHandler(e, SIGNUP)}
                                >
                                    Sign Up
                                </TextButton>
                            </Text>
                        )}
                        {!!twoFactorRequired &&
                            !!smsTwoFactorMetaData && (
                                <Text align="center" el="div">
                                    <TextButton onClick={e => onResendCode()}>
                                        Resend verification code
                                    </TextButton>
                                </Text>
                            )}
                    </Card>
                </Block>
            </div>
        )
    }
}



// WEBPACK FOOTER //
// ./app/features/Auth/components/Login/index.jsx