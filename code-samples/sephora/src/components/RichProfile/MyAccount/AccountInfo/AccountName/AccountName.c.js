// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var AccountName = function () {};

// Added by sephora-jsx-loader.js
AccountName.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const formValidator = require('utils/FormValidator');
const store = require('Store');
const userActions = require('actions/UserActions');
const FRAGMENT_FOR_UPDATE = require('actions/UserActions').FRAGMENT_FOR_UPDATE;

AccountName.prototype.handleKeyDown = function (e) {
    if (e.keyCode === 13) {
        this.submitForm(e);
    }
};

AccountName.prototype.validateForm = function () {
    let firstNameError = this.firstNameInput.validateError();
    let lastNameError = this.lastNameInput.validateError();
    let fieldsForValidation = [this.firstNameInput, this.lastNameInput];

    let errors = formValidator.getErrors(fieldsForValidation);

    let result = { hasError: false };

    if (errors.fields.length) {
        result.hasError = true;
        if (errors.errorIndex) {
            result.errorField = fieldsForValidation[errors.errorIndex - 1];
        }
    }

    return result;
};

AccountName.prototype.editSuccess = function (response) {
    this.setState({
        inputsDisabled: false
    });

    //close edit state
    this.props.setEditSection('');
};

AccountName.prototype.editFailure = function (response) {
    if (response.errorMessages) {
        this.setState({ errorMessages: response.errorMessages });
    }

    this.setState({ inputsDisabled: false });
};

AccountName.prototype.getOptionParams = function () {
    let firstNameInput = this.firstNameInput.getValue();
    let lastNameInput = this.lastNameInput.getValue();
    const optionParams = {
            fragmentForUpdate: FRAGMENT_FOR_UPDATE.NAME,
            firstName: firstNameInput,
            lastName: lastNameInput
        };
    return optionParams;
};

AccountName.prototype.submitForm = function (e) {
    e.preventDefault();

    let validate = this.validateForm();

    if (!validate.hasError) {
        let optionParams = this.getOptionParams();

        this.setState({
                inputsDisabled: true,
                errorMessages: null
            });

        store.dispatch(
            userActions.updateUserFragment(
                optionParams,
                this.editSuccess,
                this.editFailure
            )
        );

    } else {
        this.setState({
            errorMessages: null
        }, () => {
            if (validate.errorField) {
                validate.errorField.focus();
            }
        });
    }
};


// Added by sephora-jsx-loader.js
module.exports = AccountName.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/AccountInfo/AccountName/AccountName.c.js