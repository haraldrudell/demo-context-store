// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var RegisterForm = function () {};

// Added by sephora-jsx-loader.js
RegisterForm.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const confirmModal = require('Actions').showInfoModal;
const showRegisterModal = require('Actions').showRegisterModal;
const showSignInModal = require('Actions').showSignInModal;
const register = require('actions/UserActions').register;
const processEvent = require('analytics/processEvent');
const anaConsts = require('analytics/constants');
const linkTrackingError = require('analytics/bindings/pages/all/linkTrackingError');
const errorCodes = require('actions/UserActions').ERROR_CODES;
const Locale = require('utils/LanguageLocale');
const formValidator = require('utils/FormValidator');

RegisterForm.prototype.requestClose = function () {
    this.props.isApplePaySignIn ? store.dispatch(showSignInModal(false))
    : store.dispatch(showRegisterModal(false));
};

RegisterForm.prototype.handleKeyDown = function (e) {
    if (e.keyCode === 13) {
        this.register(e);
    }
};

/** handle join bi click dependant on location */
RegisterForm.prototype.handleJoinBIClick = function (isBIChecked) {
    let isUSLocale = Locale.getCurrentCountry().toLowerCase() === 'us';
    let subscribeEmail = this.subscribeEmail;

    if (isUSLocale) {
        if (isBIChecked) {
            subscribeEmail.setChecked(true);
            this.setState({
                sephoraEmailDisabled: true
            });
        } else {
            subscribeEmail.setChecked(true);
            this.setState({
                sephoraEmailDisabled: false
            });
        }
    }
};

RegisterForm.prototype.trackErrors = function (errors = {}) {

    let eventData = {
        data: {
            linkName: 'register:modal:error',
            bindingMethods: linkTrackingError,
            eventStrings: ['event39', 'event65'],
            fieldErrors: errors.fields,
            errorMessages: errors.messages,
            previousPage: digitalData.page.attributes.sephoraPageInfo.pageName,
            usePreviousPageName: true
        }
    };

    processEvent.process(anaConsts.LINK_TRACKING_EVENT, eventData);

    return eventData;
};

RegisterForm.prototype.handleSubscribeSephoraEmail = function (e) {
    this.setState({
        subscribeSephoraEmail: e.target.checked
    });
};

/** collect fields with errors */
RegisterForm.prototype.validateForm = function () {

    let biFormValidator = this.biRegForm ?
        this.biRegForm.validateForm() : { hasError: false };

    let fieldsForValidation = [];

    if (!this.state.storeUserEmail) {
        fieldsForValidation.push(this.props.isApplePaySignIn ?
            this.props.applePayEmailInput : this.emailInput);
    }

    fieldsForValidation.push(
        this.firstNameInput,
        this.lastNameInput,
        this.passwordInput,
        this.confirmPasswordInput
    );

    if (this.props.isCaptchaEnabled) {
        fieldsForValidation.push(this.visualValidationAnswer);
    }

    let errors = formValidator.getErrors(fieldsForValidation);

    if (biFormValidator.hasError) {
        errors.fields.push(biFormValidator.errorField);
        errors.messages.push(biFormValidator.errorMsg);
    }

    //Analytics
    if (errors.fields.length) {
        RegisterForm.prototype.trackErrors(errors);
    }//End analytics

    let result = {};

    if (!errors.fields.length && !biFormValidator.hasError) {
        result.hasError = false;
    } else {
        result.hasError = true;

        if (this.props.isCaptchaEnabled && errors.fields.indexOf('visualValidationAnswer') >= -1) {
            this.visualValidationAnswer.refreshVisualValidation();
        }

        if (errors.errorIndex) {
            result.errorField = fieldsForValidation[errors.errorIndex - 1];
        }
    }

    return result;
};

RegisterForm.prototype.fraudnet = function () {
    util && util.parse('AO_ATO_variable');
    return document.getElementById('AO_ATO_variable').value;
};

/** reset the form if in store user */
RegisterForm.prototype.handleReset = function () {
    this.firstNameInput.empty();
    this.lastNameInput.empty();
    this.passwordInput.empty();
    this.confirmPasswordInput.empty();
    this.profileIdHidden.empty();

    if (this.state.inStoreUser) {
        this.inStoreEmail.empty();
    }

    if (this.props.isApplePaySignIn) {
        this.applePayEmailInput.empty();
        this.props.resetAppleSignInEmail();
    }

    if (this.props.isCaptchaEnabled) {
        this.visualValidationAnswer.empty();
    }

    if (Sephora.isDesktop()) {
        this.nearStoreZipCode.empty();
    }

    if (this.biRegForm) {
        this.biRegForm.setState({
            joinBICheckbox: false,
            biMonth: '',
            biDay: '',
            biYear: ''
        });
    }

    this.setState({
        presetLogin: '',
        isOpen: false,
        callback: null,
        ssi: false,
        joinBI: false,
        inputsDisabled: false,
        errorMessages: null,
        captchaError: null,
        inStoreUser: false,
        storeUserEmail: '',
        sephoraEmailDisabled: false,
        profileId: '',
        firstName: '',
        lastName: '',
        biData: {}
    });
};

/** fill user form data with pre-existing store user info */
RegisterForm.prototype.inStoreUserHandler = function (json) {
    this.passwordInput.empty();
    this.confirmPasswordInput.empty();

    if (this.props.isCaptchaEnabled) {
        this.visualValidationAnswer.empty();
        this.visualValidationAnswer.refreshVisualValidation();
    }

    if (!this.state.inStoreUser) {
        this.setState({
            inStoreUser: true,
            storeUserEmail: json.userName
        });
        if (json.beautyInsiderAccount && this.biRegForm) {
            this.biRegForm.setState({
                joinBICheckbox: true,
                biMonth: json.beautyInsiderAccount.birthMonth,
                biDay: json.beautyInsiderAccount.birthDay,
                biYear: json.beautyInsiderAccount.birthYear
            });
        }
    }

    this.firstNameInput.setValue(json.firstName);
    this.lastNameInput.setValue(json.lastName);
    this.profileIdHidden.setValue(json.profileId);
    this.inStoreEmail.setValue(json.userName);

    //Analytics - Hard code error, because the template error can change it shouldn't affect this
    RegisterForm.prototype.trackErrors({
        messages: ['We think you already registered for Beauty Insider in a Sephora store because' +
        ' we recognize your email address']
    });
};

/** callback for successful API registration */
RegisterForm.prototype.registerSuccess = function (response, isBI) {
    this.requestClose();

    if (Sephora.isMobile() && !this.props.isApplePaySignIn) {
        let confirmMessage;

        if (isBI) {
            confirmMessage = 'Congratulations! You are now a Beauty Insider';
        } else {
            confirmMessage = 'Thank you for registering with Sephora';
        }

        store.dispatch(
            confirmModal(
                true,
                'Registration Complete',
                confirmMessage,
                'Continue'
            )
        );
    }

    if (this.state.callback) {
        this.state.callback();
    }
};

/** callback for failed API registration */
RegisterForm.prototype.registerFailure = function (response) {
    this.setState({ inputsDisabled: false });
    let hasErrorFields = false;
    if (errorCodes.STORE_REGISTERED_ERROR_CODE === response.errorCode) {
        this.inStoreUserHandler(response.data);
    } else {
        if (response.errorMessages && response.errors) {
            if (this.props.isCaptchaEnabled) {
                this.visualValidationAnswer.refreshVisualValidation();
            }

            if (response.errors.challengeAnswer) {
                this.setState({
                    captchaError: response.errors.challengeAnswer.join()
                });

                if (this.props.isCaptchaEnabled) {
                    this.visualValidationAnswer.empty();
                }

                hasErrorFields = true;
            } else {
                this.setState({ captchaError: null });
            }

            if (response.errors.biBirthDayInput && this.biRegForm) {
                this.biRegForm.setErrorState(response.errors.biBirthDayInput.join());
                hasErrorFields = true;
            }

            if (!hasErrorFields) {
                this.setState({ errorMessages: response.errorMessages });
            }
        }

        return;
    }
};

RegisterForm.prototype.updateBiData = function () {
    this.biRegForm.setBiDate(this.biBirthDate.getValue());
};

/** Reformat user form data into params for API call
 * @param {object} BI date data
 */
RegisterForm.prototype.getOptionParams = function (biFormData, subscribeCheck) {
    let emailValue;

    emailValue = this.props.isApplePaySignIn ?
                    this.applePayEmailInput.getValue() :
                    !this.state.storeUserEmail ? this.emailInput.getValue() :
                    this.inStoreEmail.getValue();

    let fraudnet = this.fraudnet();

    const optionParams = {
        userDetails: {
            email: emailValue,
            login: emailValue,
            firstName: this.firstNameInput.getValue(),
            lastName: this.lastNameInput.getValue(),
            password: this.passwordInput.getValue(),
            confirmPassword: this.confirmPasswordInput.getValue()
        },
        registrationFrom: 'RegisterNormal',
        jscAOValue: fraudnet
    };

    if (this.props.isSSIEnabled) {
        optionParams.isKeepSignedIn = this.state.ssi;
    }

    if (this.props.isCaptchaEnabled) {
        optionParams.captchaAnswer = this.visualValidationAnswer.getValue();
        optionParams.captchaLocation = 'REGISTRATION_POPUP';
    }

    let profileId = this.profileIdHidden.getValue();
    if (profileId) {
        optionParams.userDetails.profileId = this.profileIdHidden.getValue();
    }

    if (biFormData && biFormData.birthDay) {
        optionParams.userDetails.biAccount = biFormData;
        optionParams.isJoinBi = true;
    } else if (this.state.inStoreUser) {

        // if inStoreUser didn't provide any data to form, then pass the default one
        optionParams.userDetails.biAccount = {
            birthMonth: '1',
            birthDay: '1',
            birthYear: '1800'
        };
        optionParams.isJoinBi = true;
    } else {
        optionParams.isJoinBi = false;
    }

    optionParams.subscription = {
        subScribeToEmails: subscribeCheck
    };

    if (Sephora.isDesktop()) {
        optionParams.subscription.zipCode = this.nearStoreZipCode.getValue();
    }

    return optionParams;
};

/** Register new user on form submit */
RegisterForm.prototype.register = function (e, callback) {
    e.preventDefault();

    let validate = this.validateForm();

    if (!validate.hasError) {
        let biFormData = this.biBirthDate ?
            this.biBirthDate.getValue() :
            (this.biRegForm ? this.biRegForm.getBIDate() : null);
        let subscribeCheck = this.subscribeEmailOnApplePay ?
            this.subscribeEmailOnApplePay.getValue() : this.subscribeEmail.getValue();
        let successCallback = (response) => {
            this.registerSuccess(response, biFormData);
        };

        let failureCallback = (response) => {
            this.registerFailure(response);
        };
        /** user can't submit anything, and API error messages get erased if
         * they exist from previous submission attempt
         */

        this.setState({
            inputsDisabled: true,
            callback: callback || this.state.callback,
            errorMessages: null
        });
        let optionParams = this.getOptionParams(biFormData, subscribeCheck);

        store.dispatch(
            register(
                optionParams,
                successCallback,
                failureCallback
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
module.exports = RegisterForm.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/RegisterModal/RegisterForm/RegisterForm.c.js