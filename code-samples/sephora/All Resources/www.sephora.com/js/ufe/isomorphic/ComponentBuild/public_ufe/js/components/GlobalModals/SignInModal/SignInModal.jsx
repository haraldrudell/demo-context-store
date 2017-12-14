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
    Sephora.Util.InflatorComps.Comps['SignInModal'] = function SignInModal(){
        return SignInModalClass;
    }
}
const { forms, modal, space } = require('style');
const { Box, Flex, Grid, Image, Text } = require('components/display');
const Modal = require('components/Modal/Modal');
const InputEmail = require('components/Inputs/InputEmail/InputEmail');
const TextInput = require('components/Inputs/TextInput/TextInput');
const InputSwitch = require('components/Inputs/InputSwitch/InputSwitch');
const ButtonOutline = require('components/Button/ButtonOutline');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const RegisterForm = require('components/GlobalModals/RegisterModal/RegisterForm/RegisterForm');
const Radio = require('components/Inputs/Radio/Radio');
const Link = require('components/Link/Link');
const Divider = require('components/Divider/Divider');
const FormValidator = require('utils/FormValidator');

const SignInModal = function () {
    this.state = {
        presetLogin: '',
        isOpen: false,
        callback: this.props.callback,
        ssi: this.props.loginStatus === 1,
        errorMessages: this.props.messages,
        userExists: false,
        isRecognized: false,
        inStoreUser: false,
        isEmailDisabled: this.props.isEmailDisabled || false
    };

    this.loginInput = null;
    this.passwordInput = null;
};

SignInModal.prototype.render = function () {
    return (

        <Modal
            is='form'
            action='https://www.sephora.com/loginForm'
            method='post'
            open={this.props.isOpen}
            onDismiss={this.requestClose}
            onSubmit={()=>{
                return false;
            }}
            width={modal.WIDTH.SM}>
            <Modal.Header>
                <Modal.Title>Please sign in to Sephora</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {this.state.isApplePaySignIn &&
                    <Text
                        is='p'
                        marginBottom={space[5]}>
                        Sign in or create a Sephora account to
                        complete your order with Apple Pay.
                    </Text>
                }
                {
                    this.state.errorMessages ?
                            this.state.errorMessages.map((error, index) =>
                                <Text
                                    data-at={Sephora.debug.dataAt('sign_in_error')}
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
                <Box
                    marginBottom={space[2]}
                    fontWeight={700}
                    lineHeight={2}>
                    {
                        /* TODO: isPlaySubscriptionOrder === isPlayQuiz ?*/
                        this.props.isPlaySubscriptionOrder
                            ? 'Email address'
                            : <span>{this.state.isRecognized ? '' : '1. '}
                            What is your email address?</span>
                    }
                </Box>

                <Box
                    position='relative'
                    marginTop={space[2]}>
                    <InputEmail
                        hideLabel={true}
                        label='Email'
                        name='username'
                        id='signin_username'
                        onKeyDown={this.handleKeyDown}
                        login={this.state.presetLogin}
                        disabled={this.state.isEmailDisabled}
                        ref={
                            (c) => {
                                if (c !== null) {
                                    this.loginInput = c;
                                }
                            }
                        }

                        // jscs:disable maximumLineLength
                        message={this.state.isRecognized ? '' :
                            'Have a Beauty Insider account? Use the email you signed up with.'}
                    />
                    {this.state.isRecognized &&
                        <Link
                            tabIndex='-1'
                            onClick={this.signOut}
                            paddingX={space[3]}
                            position='absolute'
                            top={0} right={0}
                            height={forms.HEIGHT}
                            fontSize='h5'>
                            Not you?
                        </Link>
                    }
                </Box>

                <Box
                    marginTop={space[5]}
                    marginBottom={space[2]}
                    fontWeight={700}
                    lineHeight={2}>
                    {
                        /* TODO: isPlaySubscriptionOrder === isPlayQuiz ?*/
                        this.props.isPlaySubscriptionOrder
                            ? 'Password'
                            : <span>{this.state.isRecognized ? '' : '2. '}
                            Do you have a sephora.com password?</span>
                    }
                </Box>

                {!this.state.isRecognized &&
                <div>
                    <Radio
                        name='userExists'
                        tabIndex='-1'
                        checked={!this.state.userExists}
                        onChange={
                            () => {
                                this.setState({
                                    userExists: false
                                }, this.applePayRegister());
                            }
                        }>
                        No, I am new to the website
                    </Radio>
                    <Radio
                        name='userExists'
                        tabIndex='-1'
                        checked={this.state.userExists}
                        onChange={
                            () => {
                                this.setState({
                                    userExists: true,
                                    isEmailDisabled: false
                                });
                            }
                        }>
                        Yes, I have a password
                    </Radio>
                </div>
                }

                {this.state.userExists &&
                /* TODO: add dontChangeUserName validation */
                <Box
                    position='relative'
                    marginTop={space[2]}
                    marginLeft={ this.props.isPlaySubscriptionOrder || this.state.isRecognized ?
                        0 : space[5]}>
                    <TextInput
                        noMargin={true}
                        type='password'
                        name='password'
                        placeholder='Password'
                        id='signin_password'
                        onKeyDown={this.handleKeyDown}
                        _css={{
                            paddingRight: '4.75em'
                        }}
                        ref={
                            (c) => {
                                if (c !== null) {
                                    this.passwordInput = c;
                                }
                            }
                        }
                        validate={
                            (password) => {
                                if (FormValidator.isEmpty(password)) {
                                    return 'Please enter your password.';
                                }

                                return null;
                            }
                        }
                    />
                    <Link
                        tabIndex='-1'
                        onClick={this.forgotPassword}
                        paddingX={space[3]}
                        position='absolute'
                        top={0} right={0}
                        height={forms.HEIGHT}
                        fontSize='h5'>
                        Forgot?
                    </Link>
                    {this.props.isSSIEnabled && Sephora.isMobile() &&
                        <Flex
                            justifyContent='flex-end'
                            alignItems='center'
                            marginTop={space[3]}>
                            <Text
                                is='label'
                                htmlFor='signin_ssi'
                                paddingRight={space[3]}>
                                Stay signed in
                            </Text>
                            <InputSwitch
                                name='stay_signed_in'
                                tabIndex='-1'
                                id='signin_ssi'
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
                </Box>
                }

                {(!this.state.userExists && this.state.isApplePaySignIn) &&
                    <div>
                        <Divider
                            height={space[2]}
                            color='nearWhite'
                            marginY={space[4]}
                            marginX={-modal.PADDING_MW} />
                        <Text
                            is='h2' fontSize='h2'
                            marginBottom={space[3]}
                            paddingBottom={space[1]}
                            fontWeight={700}>
                            Create your Sephora account
                        </Text>
                        <RegisterForm
                            isCaptchaEnabled={true}
                            applePayEmailInput={this.loginInput ? this.loginInput : null}
                            isSSIEnabled={true}
                            resetAppleSignInEmail={this.resetAppleSignInEmail}
                            inStoreUser={this.state.inStoreUser}
                            isApplePaySignIn={this.state.isApplePaySignIn}
                            ref={
                                (c) => {
                                    if (c !== null) {
                                        this.registerForm = c;
                                    }
                                }
                            }/>
                        <Divider
                            height={space[2]}
                            color='nearWhite'
                            marginX={-modal.PADDING_MW}
                            marginBottom={-modal.PADDING_MW} />
                    </div>
                }
            </Modal.Body>
            <Modal.Footer>
                {this.state.isApplePaySignIn &&
                    <Box
                        textAlign='left'>
                        {this.state.userExists ||
                        <Text
                            is='p'
                            marginBottom={space[3]}
                            fontSize='h5'>
                            By tapping “Buy with Apple Pay,” you are registering for Sephora.com,
                            and you agree to our
                            {' '}
                            <Link primary={true} onClick={(e)=>this.showPrivacyPolicy(e)}>
                                Privacy Policy
                            </Link>
                            {' '}
                            and
                            {' '}
                            <Link primary={true} onClick={(e)=>this.showTermsOfUse(e)}>
                                Sephora Terms of Use
                            </Link>.
                            {
                                this.state.locale === 'us' ?
                                ' You will automatically receive emails from Sephora.' : null
                            }
                        </Text>
                        }
                        <Text
                            is='p'
                            marginBottom={space[3]}
                            fontSize='h6'
                            color='gray'>
                            Gift cards/reward cards cannot be combined with Apple Pay.
                        </Text>
                    </Box>
                }
                <Grid
                    gutter={modal.ACTIONS_GUTTER}
                    _css={Sephora.isDesktop() ? {
                        width: modal.ACTIONS_WIDTH,
                        marginLeft: 'auto'
                    } : {}}>
                    <Grid.Cell width={1 / 2}>
                        <ButtonOutline
                            block={true}
                            tabIndex='-1'
                            onClick={this.requestClose}>
                            Cancel
                        </ButtonOutline>
                    </Grid.Cell>
                    <Grid.Cell width={1 / 2}>
                        <ButtonPrimary
                            block={true}
                            paddingY='0px'
                            type='button'
                            onClick={this.state.isApplePaySignIn ?
                                this.applePaySignInOrRegister : this.signIn}>
                            {this.state.isApplePaySignIn ?
                                <Flex
                                    isInline={true}
                                    alignItems='center'>
                                    <Text
                                        marginRight={space[2]}
                                        fontWeight={400}
                                        letterSpacing={0}
                                        textTransform='none'>
                                        Buy with
                                    </Text>
                                    <Image
                                        src='/img/ufe/logo-apple-pay.svg'
                                        width={42}
                                        height={20} />
                                </Flex>
                                : 'Continue'
                            }
                        </ButtonPrimary>
                    </Grid.Cell>
                </Grid>
            </Modal.Footer>
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
SignInModal.prototype.path = 'GlobalModals/SignInModal';
// Added by sephora-jsx-loader.js
Object.assign(SignInModal.prototype, require('./SignInModal.c.js'));
var originalDidMount = SignInModal.prototype.componentDidMount;
SignInModal.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: SignInModal');
if (originalDidMount) originalDidMount.apply(this);
if (SignInModal.prototype.ctrlr) SignInModal.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: SignInModal');
// Added by sephora-jsx-loader.js
SignInModal.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
SignInModal.prototype.class = 'SignInModal';
// Added by sephora-jsx-loader.js
SignInModal.prototype.getInitialState = function() {
    SignInModal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
SignInModal.prototype.render = wrapComponentRender(SignInModal.prototype.render);
// Added by sephora-jsx-loader.js
var SignInModalClass = React.createClass(SignInModal.prototype);
// Added by sephora-jsx-loader.js
SignInModalClass.prototype.classRef = SignInModalClass;
// Added by sephora-jsx-loader.js
Object.assign(SignInModalClass, SignInModal);
// Added by sephora-jsx-loader.js
module.exports = SignInModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/SignInModal/SignInModal.jsx