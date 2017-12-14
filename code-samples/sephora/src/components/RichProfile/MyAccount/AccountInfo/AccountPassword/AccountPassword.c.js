// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var AccountPassword = function () {};

// Added by sephora-jsx-loader.js
AccountPassword.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const formValidator = require('utils/FormValidator');
const store = require('Store');
const userActions = require('actions/UserActions');
const FRAGMENT_FOR_UPDATE = require('actions/UserActions').FRAGMENT_FOR_UPDATE;

AccountPassword.prototype.handleKeyDown = function (e) {
    if (e.keyCode === 13) {
        this.submitForm(e);
    }
};

AccountPassword.prototype.validateForm = function () {
    let passwordError = this.passwordInput.validateError();
    let confirmPasswordError = this.confirmPasswordInput.validateError();
    let fieldsForValidation = [this.passwordInput, this.confirmPasswordInput];

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

AccountPassword.prototype.editSuccess = function (response) {
    this.setState({
        inputsDisabled: false
    });

    //close edit state
    this.props.setEditSection('');
};

AccountPassword.prototype.editFailure = function (response) {
    if (response.errorMessages) {
        this.setState({ errorMessages: response.errorMessages });
    }

    this.setState({ inputsDisabled: false });
};

AccountPassword.prototype.getOptionParams = function () {
    let passwordInput = this.passwordInput.getValue();
    let confirmPasswordInput = this.confirmPasswordInput.getValue();
    const optionParams = {
            fragmentForUpdate: FRAGMENT_FOR_UPDATE.PASSWORD,
            password: passwordInput,
            confirmPassword: confirmPasswordInput
        };
    return optionParams;
};

AccountPassword.prototype.submitForm = function (e) {
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
module.exports = AccountPassword.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/AccountInfo/AccountPassword/AccountPassword.c.js