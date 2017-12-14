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
    Sephora.Util.InflatorComps.Comps['AccountEmail'] = function AccountEmail(){
        return AccountEmailClass;
    }
}
const { space } = require('style');
const { Box, Grid, Text } = require('components/display');
const InputEmail = require('components/Inputs/InputEmail/InputEmail');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const ButtonOutline = require('components/Button/ButtonOutline');
const Link = require('components/Link/Link');
const FormValidator = require('utils/FormValidator');

const AccountEmail = function () {
    this.state = {
        errorMessages: null,
        inputsDisabled: false
    };
};

AccountEmail.prototype.render = function () {
    const {
        user,
        isEditMode,
        setEditSection
    } = this.props;

    const emptyEmailMessage =
        'Please enter your email address.';
    const invalidConfirmationMessage =
        'The email addresses you entered do not match. Please fix to continue.';
    const invalidEmailMessage =
        'Please enter an e-mail address in the format username@domain.com.';

    const displayBlock = <Grid
                            gutter={space[3]}>
                            <Grid.Cell width={Sephora.isMobile() ? 85 : 1 / 4}>
                                <Text fontWeight={700}>Email</Text>
                            </Grid.Cell>
                            <Grid.Cell width='fill'>
                                {user.login}
                            </Grid.Cell>
                            <Grid.Cell width='fit'>
                                <Link
                                    primary={true}
                                    paddingY={space[2]}
                                    marginY={-space[2]}
                                    onClick={() => {
                                        setEditSection('email');
                                    }}>
                                    Edit
                                </Link>
                            </Grid.Cell>
                        </Grid>;

    const editBlock = <Box _css={Sephora.isDesktop() ? {
        maxWidth: '50%'
    } : null}>
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
                            : null
                        }
                        <InputEmail
                            label='Email'
                            name='email'
                            id='myaccount_email'
                            placeholder='Required'
                            onKeyDown={this.handleKeyDown}
                            disabled={this.state.inputsDisabled}
                            ref={
                                (comp) => {
                                    if (comp !== null) {
                                        this.emailInput = comp;
                                    }
                                }
                         } />

                        <InputEmail
                            label='Confirm Email'
                            name='confirmEmail'
                            id='myaccount_confirm_email'
                            placeholder='Required'
                            onKeyDown={this.handleKeyDown}
                            disabled={this.state.inputsDisabled}
                            ref={
                                (comp) => {
                                    if (comp !== null) {
                                        this.confirmEmailInput = comp;
                                    }
                                }
                            }
                            validate={
                                (confirmEmail) => {
                                    if (FormValidator.isEmpty(confirmEmail)) {
                                        return emptyEmailMessage;
                                    } else if (FormValidator.isEmpty(confirmEmail) ||
                                        confirmEmail !== this.emailInput.getValue()) {
                                        return invalidConfirmationMessage;
                                    } else if (!FormValidator.isValidEmailAddress(confirmEmail)) {
                                        return invalidEmailMessage;
                                    }

                                    return null;
                                }
                        } />

                        <Grid
                            gutter={space[3]}>
                            <Grid.Cell width={1 / 2}>
                                <ButtonOutline
                                    block={true}
                                    onClick={() => setEditSection('')}>
                                    Cancel
                                </ButtonOutline>
                            </Grid.Cell>
                            <Grid.Cell width={1 / 2}>
                                <ButtonPrimary
                                    block={true}
                                    onClick={this.submitForm}>
                                    Update
                                </ButtonPrimary>
                            </Grid.Cell>
                        </Grid>
                    </Box>;

    return isEditMode ? editBlock : displayBlock;
};


// Added by sephora-jsx-loader.js
AccountEmail.prototype.path = 'RichProfile/MyAccount/AccountInfo/AccountEmail';
// Added by sephora-jsx-loader.js
Object.assign(AccountEmail.prototype, require('./AccountEmail.c.js'));
var originalDidMount = AccountEmail.prototype.componentDidMount;
AccountEmail.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: AccountEmail');
if (originalDidMount) originalDidMount.apply(this);
if (AccountEmail.prototype.ctrlr) AccountEmail.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: AccountEmail');
// Added by sephora-jsx-loader.js
AccountEmail.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
AccountEmail.prototype.class = 'AccountEmail';
// Added by sephora-jsx-loader.js
AccountEmail.prototype.getInitialState = function() {
    AccountEmail.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
AccountEmail.prototype.render = wrapComponentRender(AccountEmail.prototype.render);
// Added by sephora-jsx-loader.js
var AccountEmailClass = React.createClass(AccountEmail.prototype);
// Added by sephora-jsx-loader.js
AccountEmailClass.prototype.classRef = AccountEmailClass;
// Added by sephora-jsx-loader.js
Object.assign(AccountEmailClass, AccountEmail);
// Added by sephora-jsx-loader.js
module.exports = AccountEmailClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/AccountInfo/AccountEmail/AccountEmail.jsx