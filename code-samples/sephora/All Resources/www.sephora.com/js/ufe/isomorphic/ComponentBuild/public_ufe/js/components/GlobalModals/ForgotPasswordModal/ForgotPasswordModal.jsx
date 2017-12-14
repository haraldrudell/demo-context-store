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
    Sephora.Util.InflatorComps.Comps['ForgotPasswordModal'] = function ForgotPasswordModal(){
        return ForgotPasswordModalClass;
    }
}
const { modal, space } = require('style');
const { Box, Text } = require('components/display');
const Modal = require('components/Modal/Modal');
const InputEmail = require('components/Inputs/InputEmail/InputEmail');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const Fieldset = require('components/Fieldset/Fieldset');

const ForgotPasswordModal = function () {
    this.state = {
        isOpen: false,
        errorMessages: this.props.messages
    };

    this.loginInput = null;
};

ForgotPasswordModal.prototype.render = function () {
    return (

        <Modal
            open={this.props.isOpen}
            onDismiss={this.requestClose}
            width={modal.WIDTH.SM}>
            <Modal.Header>
                <Modal.Title>Reset password</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Text is='p' marginBottom={space[3]}>
                    To have your password reset, enter your email address below.
                    We will then send an email containing a link to reset your password.
                </Text>

                <form action=''>
                    <Fieldset disabled={this.state.inputsDisabled}>
                        {
                            this.state.errorMessages ?
                                this.state.errorMessages.map((error, index) =>
                                    <Text
                                        key={index}
                                        is='p' marginBottom={space[2]}
                                        color='error'
                                        fontSize='h5'>
                                        {error}
                                    </Text>
                                )
                            :
                                null
                        }

                        <InputEmail
                            hideLabel={true}
                            label='Email'
                            name='username'
                            id='forgotAnswer_email'
                            onKeyDown={this.handleKeyDown}
                            login={this.props.presetLogin}
                            ref={
                                (c) => {
                                    if (c !== null) {
                                        this.loginInput = c;
                                    }
                                }
                            }
                            showErrors={this.state.showErrors}/>

                        <ButtonPrimary
                            type='submit'
                            onClick={this.submit}>
                            Send Email
                        </ButtonPrimary>

                    </Fieldset>
                </form>

                <Text
                    is='p'
                    color='gray'
                    marginTop={space[5]}
                    fontSize='h5'>
                    <b>Still having trouble?</b>
                    <br />
                    If you’re unable to reset your password, please call Customer Service at
                    {' '}
                    <Box
                        display='inline'
                        href='tel:1-877-737-4672'>
                        1-877-SEPHORA (1-877-737-4672)
                    </Box> | TTY
                    {' '}
                    <Box
                        display='inline'
                        href='tel:1-888-866-9845'>
                        1-888-866-9845
                    </Box> for assistance.
                </Text>

            </Modal.Body>
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
ForgotPasswordModal.prototype.path = 'GlobalModals/ForgotPasswordModal';
// Added by sephora-jsx-loader.js
Object.assign(ForgotPasswordModal.prototype, require('./ForgotPasswordModal.c.js'));
var originalDidMount = ForgotPasswordModal.prototype.componentDidMount;
ForgotPasswordModal.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ForgotPasswordModal');
if (originalDidMount) originalDidMount.apply(this);
if (ForgotPasswordModal.prototype.ctrlr) ForgotPasswordModal.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ForgotPasswordModal');
// Added by sephora-jsx-loader.js
ForgotPasswordModal.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ForgotPasswordModal.prototype.class = 'ForgotPasswordModal';
// Added by sephora-jsx-loader.js
ForgotPasswordModal.prototype.getInitialState = function() {
    ForgotPasswordModal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ForgotPasswordModal.prototype.render = wrapComponentRender(ForgotPasswordModal.prototype.render);
// Added by sephora-jsx-loader.js
var ForgotPasswordModalClass = React.createClass(ForgotPasswordModal.prototype);
// Added by sephora-jsx-loader.js
ForgotPasswordModalClass.prototype.classRef = ForgotPasswordModalClass;
// Added by sephora-jsx-loader.js
Object.assign(ForgotPasswordModalClass, ForgotPasswordModal);
// Added by sephora-jsx-loader.js
module.exports = ForgotPasswordModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/ForgotPasswordModal/ForgotPasswordModal.jsx