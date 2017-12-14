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
    Sephora.Util.InflatorComps.Comps['AccountName'] = function AccountName(){
        return AccountNameClass;
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
    FIRST_NAME: 'First name required.',
    LAST_NAME: 'Last name required.'
};

const AccountName = function () {
    this.state = {
        errorMessages: null,
        inputsDisabled: false,
        isEditMode: false
    };
};

AccountName.prototype.render = function () {
    const {
        user,
        isEditMode,
        setEditSection
    } = this.props;

    const displayBlock = <Grid
                            gutter={space[3]}>
                            <Grid.Cell width={Sephora.isMobile() ? 85 : 1 / 4}>
                                <Text fontWeight={700}>Name</Text>
                            </Grid.Cell>
                            <Grid.Cell width='fill'>
                                {user.firstName} {user.lastName}
                            </Grid.Cell>
                            <Grid.Cell width='fit'>
                                <Link
                                    primary={true}
                                    paddingY={space[2]}
                                    marginY={-space[2]}
                                    onClick={() => {
                                        setEditSection('name');
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
                            label='First name'
                            type='text'
                            name='firstName'
                            disabled={this.state.inputsDisabled}
                            placeholder='Required'
                            maxLength={FIELD_LENGTHS.name}
                            value={this.state.firstName}
                            onKeyDown={this.handleKeyDown}
                            ref={
                                (comp) => {
                                    if (comp !== null) {
                                        this.firstNameInput = comp;
                                    }
                                }
                            }
                            validate={
                                    (firstName) => {
                                        if (FormValidator.isEmpty(firstName)) {
                                            return ERROR_MESSAGES.FIRST_NAME;
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
                            placeholder='Required'
                            maxLength={FIELD_LENGTHS.name}
                            value={this.state.lastName}
                            onKeyDown={this.handleKeyDown}
                            ref={
                                (comp) => {
                                    if (comp !== null) {
                                        this.lastNameInput = comp;
                                    }
                                }
                            }
                            validate={
                                    (lastName) => {
                                        if (FormValidator.isEmpty(lastName)) {
                                            return ERROR_MESSAGES.LAST_NAME;
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
AccountName.prototype.path = 'RichProfile/MyAccount/AccountInfo/AccountName';
// Added by sephora-jsx-loader.js
Object.assign(AccountName.prototype, require('./AccountName.c.js'));
var originalDidMount = AccountName.prototype.componentDidMount;
AccountName.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: AccountName');
if (originalDidMount) originalDidMount.apply(this);
if (AccountName.prototype.ctrlr) AccountName.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: AccountName');
// Added by sephora-jsx-loader.js
AccountName.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
AccountName.prototype.class = 'AccountName';
// Added by sephora-jsx-loader.js
AccountName.prototype.getInitialState = function() {
    AccountName.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
AccountName.prototype.render = wrapComponentRender(AccountName.prototype.render);
// Added by sephora-jsx-loader.js
var AccountNameClass = React.createClass(AccountName.prototype);
// Added by sephora-jsx-loader.js
AccountNameClass.prototype.classRef = AccountNameClass;
// Added by sephora-jsx-loader.js
Object.assign(AccountNameClass, AccountName);
// Added by sephora-jsx-loader.js
module.exports = AccountNameClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/AccountInfo/AccountName/AccountName.jsx