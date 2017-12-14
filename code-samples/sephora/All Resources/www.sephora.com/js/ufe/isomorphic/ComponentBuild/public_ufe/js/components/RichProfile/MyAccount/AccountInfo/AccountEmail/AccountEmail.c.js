// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var AccountEmail = function () {};

// Added by sephora-jsx-loader.js
AccountEmail.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const formValidator = require('utils/FormValidator');
const store = require('Store');
const userActions = require('actions/UserActions');
const FRAGMENT_FOR_UPDATE = require('actions/UserActions').FRAGMENT_FOR_UPDATE;
const processEvent = require('analytics/processEvent');
const analyticsConsts = require('analytics/constants');
const linkTrackingError = require('analytics/bindings/pages/all/linkTrackingError');

AccountEmail.prototype.handleKeyDown = function (e) {
    if (e.keyCode === 13) {
        this.submitForm(e);
    }
};

AccountEmail.prototype.validateForm = function () {
    let emailError = this.emailInput.validateError();
    let confirmEmailError = this.confirmEmailInput.validateError();
    let fieldsForValidation = [this.emailInput, this.confirmEmailInput];

    let errors = formValidator.getErrors(fieldsForValidation);

    let result = { hasError: false };

    if (errors.fields.length) {
        result.hasError = true;
        if (errors.errorIndex) {
            result.errorField = fieldsForValidation[errors.errorIndex - 1];
        }

        //Analytics
        processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, {
            data: {
                bindingMethods: linkTrackingError,
                linkName: 'error',
                fieldErrors: errors.fields,
                errorMessages: errors.messages,
                eventStrings: [analyticsConsts.Event.EVENT_71],
                usePreviousPageName: true
            }
        });
    }

    return result;
};

AccountEmail.prototype.editSuccess = function (response) {
    this.setState({
        inputsDisabled: false
    });

    //close edit state
    this.props.setEditSection('');
};

AccountEmail.prototype.editFailure = function (response) {
    if (response.errorMessages) {
        this.setState({ errorMessages: response.errorMessages });
    }

    this.setState({ inputsDisabled: false });
};

AccountEmail.prototype.getOptionParams = function () {
    let emailInput = this.emailInput.getValue();
    let confirmEmailInput = this.confirmEmailInput.getValue();
    const optionParams = {
        fragmentForUpdate: FRAGMENT_FOR_UPDATE.EMAIL,
        email: emailInput,
        confirmEmail: confirmEmailInput
    };
    return optionParams;
};

AccountEmail.prototype.submitForm = function (e) {
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

        //Analytics
        processEvent.process(analyticsConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: digitalData.page.attributes.sephoraPageInfo.pageName,
                linkData: digitalData.page.category.pageType + ':my account:email:update',
                pageType: digitalData.page.category.pageType,
                pageDetail: digitalData.page.pageInfo.pageName
            }
        });

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
module.exports = AccountEmail.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/AccountInfo/AccountEmail/AccountEmail.c.js