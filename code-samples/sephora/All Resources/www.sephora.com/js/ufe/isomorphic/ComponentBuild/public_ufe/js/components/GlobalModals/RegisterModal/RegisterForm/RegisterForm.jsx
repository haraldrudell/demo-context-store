// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
if (!Sephora.isRootRender) {
    Sephora.Util.InflatorComps.Comps['RegisterForm'] = function RegisterForm(){
        return RegisterFormClass;
    }
}
/* eslint-disable max-len */
const { modal, space } = require('style');
const { Box, Flex, Image, Text } = require('components/display');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const InputEmail = require('components/Inputs/InputEmail/InputEmail');
const InputSwitch = require('components/Inputs/InputSwitch/InputSwitch');
const TextInput = require('components/Inputs/TextInput/TextInput');
const HiddenInput = require('components/Inputs/HiddenInput/HiddenInput');
const InputDate = require('components/Inputs/InputDate/InputDate');
const Fieldset = require('components/Fieldset/Fieldset');
const FormValidator = require('utils/FormValidator');
const InputCaptcha = require('components/Inputs/InputCaptcha/InputCaptcha');
const Date = require('utils/Date');
const Checkbox = require('components/Inputs/Checkbox/Checkbox');
const BiRegisterForm = require('components/BiRegisterForm/BiRegisterForm');
const Locale = require('utils/LanguageLocale');
const SubscribeEmail = require('components/SubscribeEmail/SubscribeEmail');
const Divider = require('components/Divider/Divider');

const RegisterForm = function () {
    this.state = {
        presetLogin: this.props.presetLogin || '',
        isOpen: false,
        callback: this.props.callback,
        joinBICheckbox: this.props.isStoreUser || false,
        ssi: false,
        joinBI: false,
        inputsDisabled: false,
        errorMessages: null,
        captchaError: null,
        subscribeSephoraEmail: Locale.isUS(),
        sephoraEmailDisabled: false,
        inStoreUser: this.props.isStoreUser || false,
        storeUserEmail: (this.props.biData && this.props.biData.userEmail) || '',
        profileId: (this.props.biData && this.props.biData.profileId) || '',
        firstName: (this.props.biData && this.props.biData.firstName) || '',
        lastName: (this.props.biData && this.props.biData.lastName) || '',
        biData: this.props.biData || {}
    };

    this.emailInput = null;
    this.firstNameInput = null;
    this.lastNameInput = null;
    this.passwordInput = null;
    this.confirmPasswordInput = null;
    this.biRegForm = null;
    this.fraudnetHiddenInput = null;
    this.visualValidationAnswer = null;
    this.nearStoreZipCode = null;
    this.profileIdHidden = null;
    this.inStoreEmail = null;
};

RegisterForm.prototype.render = function () {
    const {
        isApplePaySignIn,
        applePayEmailInput,
        isEmailDisabled,
        isSSIEnabled,
        isCaptchaEnabled
    } = this.props;

    const FIELD_LENGTHS = {
        name: 33,
        password: 12,
        zipCode: 10,
        captcha: 10
    };
    return (
        <div>
            <script
                src={'/js/ufe/' + Sephora.buildMode + '/thirdparty/fraudnet/jscCollection.js'}>
            </script>
            <form>
                <Fieldset disabled={this.state.inputsDisabled}>
                    <HiddenInput
                        name='profile_id'
                        id='register_profile_id'
                        value={this.state.profileId}
                        ref={
                            (c) => {
                                if (c !== null) {
                                    this.profileIdHidden = c;
                                }
                            }
                        }
                    />

                    {
                        this.state.errorMessages ?
                            this.state.errorMessages.map((error, index) =>
                                <Text
                                    key={index}
                                    is='p'
                                    marginBottom={space[3]}
                                    color='error'
                                    fontSize='h5'>
                                    {error}
                                </Text>
                            )
                            :
                            null
                    }

                    {this.state.inStoreUser &&
                    <Text
                        is='p'
                        marginBottom={space[3]}
                        color='error'
                        fontSize='h5'>
                        We think you already registered for Beauty Insider in a Sephora
                        store because we recognize your email address
                        &nbsp;<strong>{this.state.storeUserEmail}</strong>.
                        Please fill out the information below to complete your profile.
                        <br /><br />
                        Not you? To clear the registration information and start over,
                        {' '}
                        <Text
                            textDecoration='underline'
                            onClick={this.handleReset}>
                            click here
                        </Text>.
                    </Text>
                    }

                    <input
                        name='AO_ATO_variable'
                        id='AO_ATO_variable'
                        type='hidden'
                    />

                    {!this.state.inStoreUser &&
                    isApplePaySignIn ?
                        <HiddenInput
                            name='email'
                            id='register_email'
                            value={applePayEmailInput}
                            ref={
                                (c) => {
                                    if (c !== null) {
                                        this.applePayEmailInput = c.getValue();
                                    }
                                }
                            }
                        />
                        :
                        !isApplePaySignIn && <InputEmail
                            label='Email address'
                            name='email'
                            id='register_email'
                            placeholder='Required'
                            login={this.state.presetLogin}
                            disabled={isEmailDisabled || this.state.inputsDisabled}
                            emptyEmailError='Please enter your email address.'
                            onKeyDown={this.handleKeyDown}

                            // jscs:disable maximumLineLength
                            invalidEmailError='Please enter an e-mail address in the format username@domain.com.'
                            ref={
                                (c) => {
                                    if (c !== null) {
                                        this.emailInput = c;
                                    }
                                }
                            }
                        />
                    }

                    {this.state.inStoreUser &&
                        <HiddenInput
                            name='storeEmail'
                            id='store_email_id'
                            value={this.state.storeUserEmail}
                            ref={
                                (c) => {
                                    if (c !== null) {
                                        this.inStoreEmail = c;
                                    }
                                }
                            }
                        />
                    }

                    <TextInput
                        label='First name'
                        type='text'
                        name='firstName'
                        disabled={this.state.inputsDisabled}
                        required={true}
                        placeholder='Required'
                        maxLength={FIELD_LENGTHS.name}
                        value={this.state.firstName}
                        onKeyDown={this.handleKeyDown}
                        ref={
                            (c) => {
                                if (c !== null) {
                                    this.firstNameInput = c;
                                }
                            }
                        }
                        validate={
                            (firstName) => {
                                if (FormValidator.isEmpty(firstName)) {
                                    return 'First Name Required. Please enter your first name.';
                                }

                                return null;
                            }
                        }
                    />

                    <TextInput
                        label='Last name'
                        type='text'
                        name='lastName'
                        disabled={this.state.inputsDisabled}
                        required={true}
                        placeholder='Required'
                        maxLength={FIELD_LENGTHS.name}
                        value={this.state.lastName}
                        onKeyDown={this.handleKeyDown}
                        ref={
                            (c) => {
                                if (c !== null) {
                                    this.lastNameInput = c;
                                }
                            }
                        }
                        validate={
                            (lastName) => {
                                if (FormValidator.isEmpty(lastName)) {
                                    return 'Last Name Required. Please enter your last name.';
                                }

                                return null;
                            }
                        }
                    />

                    <TextInput
                        label='Password'
                        type='password'
                        name='password'
                        disabled={this.state.inputsDisabled}
                        required={true}
                        placeholder='Required (6 to 12 characters)'
                        maxLength={FIELD_LENGTHS.password}
                        onKeyDown={this.handleKeyDown}
                        ref={
                            (c) => {
                                if (c !== null) {
                                    this.passwordInput = c;
                                }
                            }
                        }
                        validate={
                            (password) => {
                                if (FormValidator.isEmpty(password)
                                    || !FormValidator.isValidLength(password, 6, 12)
                                    || FormValidator.hasEmptySpaces(password)
                                ) {
                                    return 'Please enter a password between 6-12 characters (no spaces).';
                                }

                                return null;
                            }
                        }
                    />

                    <TextInput
                        label='Confirm password'
                        type='password'
                        name='confirmPassword'
                        disabled={this.state.inputsDisabled}
                        required
                        placeholder='Required'
                        maxLength={FIELD_LENGTHS.password}
                        onKeyDown={this.handleKeyDown}
                        ref={
                            (c) => {
                                if (c !== null) {
                                    this.confirmPasswordInput = c;
                                }
                            }
                        }
                        validate={
                            (confirmPassword) => {
                                if (FormValidator.isEmpty(confirmPassword) ||
                                    confirmPassword !== this.passwordInput.getValue()) {
                                    return '“Confirm Password” must match “Password”';
                                }

                                return null;
                            }
                        }
                    />

                    {isSSIEnabled &&
                    <Flex
                        justifyContent='flex-end'
                        alignItems='center'
                        marginBottom={space[3]}>
                        <Text
                            is='label'
                            htmlFor='register_ssi'
                            paddingRight={space[3]}>
                            Stay signed in
                        </Text>
                        <InputSwitch
                            name='stay_signed_in'
                            id='register_ssi'
                            checked={this.state.ssi}
                            onChange={
                                () => {
                                    this.setState({
                                        ssi: !this.state.ssi
                                    });
                                }
                            } />
                    </Flex>
                    }

                    {isApplePaySignIn && Locale.isCanada() &&
                        <div>
                            <Divider
                                height={space[2]}
                                color='nearWhite'
                                marginY={space[3]}
                                marginX={-modal.PADDING_MW} />
                            <Image
                                display='block'
                                src='/img/ufe/bi/logo-beauty-insider.svg'
                                width={184} height={28}
                                marginTop={space[4]}
                                marginX='auto' />
                            <Text
                                is='p'
                                marginY={space[3]}
                                textAlign='center'>
                                Become a Beauty Insider!
                                Join our free rewards program for free
                                deluxe samples, birthday gifts, and more.
                            </Text>
                            <BiRegisterForm
                                isStoreUser={this.state.inStoreUser}
                                isBiModal={false}
                                biData={this.state.biData}
                                callback={this.handleJoinBIClick}
                                handleKeyDown={this.handleKeyDown}
                                isApplePaySignIn={isApplePaySignIn}
                                ref={
                                    (c) => {
                                        if (c !== null) {
                                            this.biRegForm = c;
                                        }
                                    }
                                }
                            />
                            <SubscribeEmail
                                marginTop={space[1]}
                                checked={this.state.subscribeSephoraEmail}
                                disabled={this.state.sephoraEmailDisabled}
                                isApplePaySignIn={isApplePaySignIn}
                                ref={
                                    (c) => {
                                        if (c !== null) {
                                            this.subscribeEmailOnApplePay = c;
                                        }
                                    }
                                }
                            />
                            <Box marginTop={space[4]}>
                                <InputDate
                                    max={Date.getBiMaxDateString()}
                                    placeholder='Required'
                                    label='Birth date'
                                    onChange={(e) => this.updateBiData()}
                                    ref={
                                        (c) => {
                                            if (c !== null) {
                                                this.biBirthDate = c;
                                            }
                                        }
                                    } />
                            </Box>
                        </div>
                    }

                    {isCaptchaEnabled &&
                        <div>
                            {isApplePaySignIn &&
                                <Divider
                                    height={space[2]}
                                    color='nearWhite'
                                    marginY={space[4]}
                                    marginX={-modal.PADDING_MW}/>
                            }
                            <InputCaptcha
                                label='Security check'
                                name='visualValidationAnswer'
                                id='register_visual_validation'
                                required={true}
                                placeholder='Required'
                                maxLength={FIELD_LENGTHS.captcha}
                                onKeyDown={this.handleKeyDown}
                                ref={
                                    (c) => {
                                        if (c !== null) {
                                            this.visualValidationAnswer = c;
                                        }
                                    }
                                }
                                validate={
                                    (visualValidationAnswer) => {
                                        if (FormValidator.isEmpty(visualValidationAnswer)) {
                                            return 'You did not enter the characters. Please enter the correct code.';
                                        }

                                        return null;
                                    }
                                }
                            />
                        </div>
                    }

                    {this.state.captchaError !== null &&
                        <Text
                            is='p'
                            color='error'
                            fontSize='h5'>
                            {this.state.captchaError}
                        </Text>
                    }

                    {isApplePaySignIn ||
                        <Box marginTop={space[5]}>
                            <BiRegisterForm
                                isStoreUser={this.state.inStoreUser}
                                isBiModal={false}
                                biData={this.state.biData}
                                callback={this.handleJoinBIClick}
                                handleKeyDown={this.handleKeyDown}
                                ref={
                                    (c) => {
                                        if (c !== null) {
                                            this.biRegForm = c;
                                        }
                                    }
                                }
                            />
                        </Box>
                    }

                    <SubscribeEmail
                        display={isApplePaySignIn ? 'none' : null}
                        marginTop={space[5]}
                        checked={this.state.subscribeSephoraEmail}
                        disabled={this.state.sephoraEmailDisabled}
                        ref={
                            (c) => {
                                if (c !== null) {
                                    this.subscribeEmail = c;
                                }
                            }
                        }
                    />

                    {Sephora.isDesktop() && !isApplePaySignIn &&
                    <Box marginTop={space[2]}>
                        <TextInput
                            isInline={true}
                            label='Hear about store events near you'
                            width={84}
                            placeholder='Zip Code'
                            name='nearStoreZipCode'
                            maxLength={FIELD_LENGTHS.zipCode}
                            onKeyDown={this.handleKeyDown}
                            ref={
                                (c) => {
                                    if (c !== null) {
                                        this.nearStoreZipCode = c;
                                    }
                                }
                            }
                        />
                    </Box>
                    }

                    {isApplePaySignIn ||
                        <Box
                            marginTop={space[5]}
                            textAlign='right'>
                            <ButtonPrimary
                                type='submit'
                                onClick={this.register}>
                                Register
                            </ButtonPrimary>
                        </Box>
                    }
                </Fieldset>
            </form>
        </div>
    );
};


// Added by sephora-jsx-loader.js
RegisterForm.prototype.path = 'GlobalModals/RegisterModal/RegisterForm';
// Added by sephora-jsx-loader.js
Object.assign(RegisterForm.prototype, require('./RegisterForm.c.js'));
var originalDidMount = RegisterForm.prototype.componentDidMount;
RegisterForm.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: RegisterForm');
if (originalDidMount) originalDidMount.apply(this);
if (RegisterForm.prototype.ctrlr) RegisterForm.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: RegisterForm');
// Added by sephora-jsx-loader.js
RegisterForm.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
RegisterForm.prototype.class = 'RegisterForm';
// Added by sephora-jsx-loader.js
RegisterForm.prototype.getInitialState = function() {
    RegisterForm.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
RegisterForm.prototype.render = wrapComponentRender(RegisterForm.prototype.render);
// Added by sephora-jsx-loader.js
var RegisterFormClass = React.createClass(RegisterForm.prototype);
// Added by sephora-jsx-loader.js
RegisterFormClass.prototype.classRef = RegisterFormClass;
// Added by sephora-jsx-loader.js
Object.assign(RegisterFormClass, RegisterForm);
// Added by sephora-jsx-loader.js
module.exports = RegisterFormClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/RegisterModal/RegisterForm/RegisterForm.jsx