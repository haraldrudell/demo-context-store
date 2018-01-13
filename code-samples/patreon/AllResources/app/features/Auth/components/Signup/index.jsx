import t from 'prop-types'
import React, { Component } from 'react'
import get from 'lodash/get'
import reform from 'libs/reform'
import Recaptcha from 'react-recaptcha'
import { withState } from 'recompose'

import Button from 'components/Button'
import Block from 'components/Layout/Block'
import Card from 'components/Card'
import Input from 'components/Form/Input'
import Text from 'components/Text'
import TextButton from 'components/TextButton'
import Checkbox from 'components/Form/Checkbox'
import ButtonWithIcon from 'components/ButtonWithIcon'

import signupForm from '../../reform-declarations/signup'
import {
    FACEBOOK_SIGNUP,
    LOGIN,
    RECAPTCHA_KEY,
    SIGNUP,
    TERMS,
} from '../../constants'

const inputs = [
    {
        type: 'text',
        name: 'name',
        label: 'Full Name',
        icon: {
            type: 'profile',
            size: 'xs',
            color: 'gray3',
        },
    },
    {
        type: 'email',
        name: 'email',
        label: 'Email',
        icon: {
            type: 'email',
            size: 'xs',
            color: 'gray3',
        },
    },
    {
        type: 'email',
        name: 'confirmEmail',
        label: 'Confirm Email',
        icon: {
            type: 'email',
            size: 'xs',
            color: 'gray3',
        },
    },
    {
        type: 'password',
        name: 'password',
        label: 'Password',
        icon: {
            type: 'key',
            size: 'xs',
            color: 'gray3',
        },
    },
]

const defaultTitle = 'or sign up with e-mail'
const facebookTitle =
    'Finish signing up with Facebook by entering your e-mail address.'

@reform(signupForm('signup'))
@withState('termsIsChecked', 'setTermIsChecked', false)
@withState('recaptchaVerified', 'setRecaptchaVerified', false)
export default class SignupForm extends Component {
    static propTypes = {
        error: t.object,
        facebookEnabled: t.bool,
        hideTitle: t.bool,
        isLoading: t.bool,
        onRecaptchaVerified: t.func,
        onChangeContext: t.func,
        onSubmit: t.func.isRequired,
        recaptchaVerified: t.bool.isRequired,
        setRecaptchaVerified: t.func.isRequired,
        setTermIsChecked: t.func.isRequired,
        showRecaptcha: t.bool.isRequired,
        termsIsChecked: t.bool.isRequired,
        reform: t.shape({
            signup: t.shape({
                model: t.shape({
                    email: t.string.isRequired,
                    confirmEmail: t.string.isRequired,
                    name: t.string.isRequired,
                    password: t.string.isRequired,
                }).isRequired,
                bindInput: t.func.isRequired,
                // TODO: more specificity
                dirtyState: t.object.isRequired,
                validation: t.object.isRequired,
            }),
        }).isRequired,
    }

    submitHandler = (e, authType) => {
        e.preventDefault()
        const model = this.props.reform.signup.model
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
            facebookEnabled,
            hideTitle,
            isLoading,
            onChangeContext,
            setTermIsChecked,
            showRecaptcha,
            termsIsChecked,
        } = this.props
        const {
            bindInput,
            dirtyState,
            validation,
            model,
        } = this.props.reform.signup
        const ctaMessage = facebookEnabled ? facebookTitle : defaultTitle
        const validEmail = validation.fields.email.isValid

        const signupOrFacebookInputs = input =>
            (facebookEnabled && input.name === 'name') ||
            (facebookEnabled && input.name === 'password')
                ? false
                : true

        const inputElements = inputs
            .filter(signupOrFacebookInputs)
            .map((input, i) => {
                const field = validation.fields[input.name]
                const errorMessage = get(field, 'errors[0]', undefined)
                const dataEntered = input.name in model
                const hasBlurred = get(
                    dirtyState,
                    `${input.name}.hasBlurred`,
                    false,
                )
                return (
                    <Block pb={1} key={input.name}>
                        <Input
                            {...bindInput(input.name)}
                            type={input.type}
                            label={input.label}
                            icon={input.icon}
                            error={hasBlurred && dataEntered && errorMessage}
                        />
                    </Block>
                )
            })

        return (
            <div>
                {!hideTitle && (
                    <Text align="center" scale="2" el="h1" weight="bold">
                        Sign Up
                    </Text>
                )}
                <Block mb={5}>
                    <Card>
                        {!facebookEnabled && (
                            <ButtonWithIcon
                                icon="socialRoundedFacebook"
                                color="facebookBlue"
                                size="md"
                                iconSize="xs"
                                onClick={e =>
                                    this.submitHandler(e, FACEBOOK_SIGNUP)}
                                fluid
                                block
                                disabled={isLoading}
                            >
                                Sign up with Facebook
                            </ButtonWithIcon>
                        )}
                        <Block mv={4}>
                            <Text align="center" el="p" color="gray3">
                                {ctaMessage}
                            </Text>
                        </Block>
                        {error && (
                            <Text align="center" scale="1" el="p" color="error">
                                {error}
                            </Text>
                        )}
                        <form
                            onSubmit={e => this.submitHandler(e, SIGNUP)}
                            className="mb-md"
                        >
                            {inputElements}
                            <Block pv={2}>
                                <Checkbox
                                    noMargin
                                    checked={termsIsChecked}
                                    onChange={e =>
                                        setTermIsChecked(!termsIsChecked)}
                                    name="tosagree"
                                    description={
                                        <span>
                                            <Text>
                                                You agree to our{' '}
                                                <TextButton
                                                    onClick={e =>
                                                        onChangeContext(TERMS)}
                                                >
                                                    Terms of Use
                                                </TextButton>
                                            </Text>
                                        </span>
                                    }
                                />
                            </Block>
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
                                    id="patreon-normal-signup-button"
                                    disabled={
                                        !termsIsChecked ||
                                        !this.isProbablyNotABot() ||
                                        (!facebookEnabled &&
                                            !validation.isValid) ||
                                        (!!facebookEnabled && !validEmail)
                                    }
                                    fluid
                                    block
                                    isLoading={isLoading}
                                >
                                    Sign up
                                </Button>
                            </Block>
                        </form>
                        <Text align="center" el="div">
                            <TextButton
                                onClick={e => this.contextHandler(e, LOGIN)}
                            >
                                Log in
                            </TextButton>
                        </Text>
                    </Card>
                </Block>
            </div>
        )
    }
}



// WEBPACK FOOTER //
// ./app/features/Auth/components/Signup/index.jsx