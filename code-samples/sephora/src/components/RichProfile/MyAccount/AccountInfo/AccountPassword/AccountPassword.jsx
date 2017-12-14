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
    Sephora.Util.InflatorComps.Comps['AccountPassword'] = function AccountPassword(){
        return AccountPasswordClass;
    }
}
const { space } = require('style');
const { Box, Grid, Text } = require('components/display');
const TextInput = require('components/Inputs/TextInput/TextInput');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const ButtonOutline = require('components/Button/ButtonOutline');
const Link = require('components/Link/Link');
const FormValidator = require('utils/FormValidator');
const FIELD_LENGTHS = FormValidator.FIELD_LENGTHS;
const ERROR_MESSAGES = {
    PASSWORD: 'Please enter a password between 6-12 characters (no spaces).',
    CONFIRM_PASSWORD: 'The passwords you entered do not match. Please fix to continue.'
};

const AccountPassword = function () {
    this.state = {
        errorMessages: null,
        inputsDisabled: false,
        isEditMode: false
    };
};

AccountPassword.prototype.render = function () {
    const {
        isEditMode,
        setEditSection
    } = this.props;

    const displayBlock = <Grid
                            gutter={space[3]}>
                            <Grid.Cell width={Sephora.isMobile() ? 85 : 1 / 4}>
                                <Text fontWeight={700}>Password</Text>
                            </Grid.Cell>
                            <Grid.Cell width='fill'>
                                <Text>&bull;&bull;&bull;&bull;&bull;&bull;&bull;</Text>
                            </Grid.Cell>
                            <Grid.Cell width='fit'>
                                <Link
                                    primary={true}
                                    paddingY={space[2]}
                                    marginY={-space[2]}
                                    onClick={() => {
                                        setEditSection('password');
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
                        <TextInput
                            autoOff={true}
                            label='Password'
                            type='password'
                            name='password'
                            disabled={this.state.inputsDisabled}
                            required
                            placeholder='Required (6 to 12 characters)'
                            maxLength={FIELD_LENGTHS.password}
                            onKeyDown={this.handleKeyDown}
                            ref={
                                (comp) => {
                                    if (comp !== null) {
                                        this.passwordInput = comp;
                                    }
                                }
                            }
                            validate={
                                (password) => {
                                    if (FormValidator.isEmpty(password)
                                        || !FormValidator.isValidLength(password, 6, 12)
                                        || FormValidator.hasEmptySpaces(password)
                                    ) {
                                        return ERROR_MESSAGES.PASSWORD;
                                    }

                                    return null;
                                }
                            }
                        />

                        <TextInput
                            autoOff={true}
                            label='Confirm password'
                            type='password'
                            name='confirmPassword'
                            disabled={this.state.inputsDisabled}
                            required
                            placeholder='Required'
                            maxLength={FIELD_LENGTHS.password}
                            onKeyDown={this.handleKeyDown}
                            ref={
                                (comp) => {
                                    if (comp !== null) {
                                        this.confirmPasswordInput = comp;
                                    }
                                }
                            }
                            validate={
                                (confirmPassword) => {
                                    if (FormValidator.isEmpty(confirmPassword)
                                        || !FormValidator.isValidLength(confirmPassword, 6, 12)
                                        || FormValidator.hasEmptySpaces(confirmPassword)
                                    ) {
                                        return ERROR_MESSAGES.PASSWORD;
                                    } else if (confirmPassword !== this.passwordInput.getValue()) {
                                        return ERROR_MESSAGES.CONFIRM_PASSWORD;
                                    }

                                    return null;
                                }
                            }
                        />

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
AccountPassword.prototype.path = 'RichProfile/MyAccount/AccountInfo/AccountPassword';
// Added by sephora-jsx-loader.js
Object.assign(AccountPassword.prototype, require('./AccountPassword.c.js'));
var originalDidMount = AccountPassword.prototype.componentDidMount;
AccountPassword.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: AccountPassword');
if (originalDidMount) originalDidMount.apply(this);
if (AccountPassword.prototype.ctrlr) AccountPassword.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: AccountPassword');
// Added by sephora-jsx-loader.js
AccountPassword.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
AccountPassword.prototype.class = 'AccountPassword';
// Added by sephora-jsx-loader.js
AccountPassword.prototype.getInitialState = function() {
    AccountPassword.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
AccountPassword.prototype.render = wrapComponentRender(AccountPassword.prototype.render);
// Added by sephora-jsx-loader.js
var AccountPasswordClass = React.createClass(AccountPassword.prototype);
// Added by sephora-jsx-loader.js
AccountPasswordClass.prototype.classRef = AccountPasswordClass;
// Added by sephora-jsx-loader.js
Object.assign(AccountPasswordClass, AccountPassword);
// Added by sephora-jsx-loader.js
module.exports = AccountPasswordClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/AccountInfo/AccountPassword/AccountPassword.jsx