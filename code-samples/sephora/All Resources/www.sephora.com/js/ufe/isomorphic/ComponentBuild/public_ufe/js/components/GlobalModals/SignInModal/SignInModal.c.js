// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var SignInModal = function () {};

// Added by sephora-jsx-loader.js
SignInModal.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const showSignInModal = require('Actions').showSignInModal;
const showRegisterModal = require('Actions').showRegisterModal;
const showForgotPasswordModal = require('Actions').showForgotPasswordModal;
const showTermsConditions = require('actions/TermsAndConditionsActions').showModal;
const signIn = require('actions/UserActions').signIn;
const signOut = require('actions/UserActions').signOut;
const checkUser = require('actions/UserActions').checkUser;
const showInterstice = require('Actions').showInterstice;
const watch = require('redux-watch');
const formValidator = require('utils/FormValidator');
const userUtils = require('utils/User');
const ApplePay = require('services/ApplePay');
const Locale = require('utils/LanguageLocale');

const Storage = require('utils/localStorage/Storage');
const LOCAL_STORAGE = require('utils/localStorage/Constants');

//Analytics
const processEvent = require('analytics/processEvent');
const anaConsts = require('analytics/constants');
const anaUtils = require('analytics/utils');
const linkTrackingError = require('analytics/bindings/pages/all/linkTrackingError');

SignInModal.prototype.requestClose = function () {
    store.dispatch(showSignInModal(false));

    //currently errback passed in only from requireLoggedInAuthentication function
    if (this.props.errback) {
        this.props.errback();
    }
};

SignInModal.prototype.resetAppleSignInEmail = function () {
    this.setState({
        isEmailDisabled: false
    });
};

SignInModal.prototype.ctrlr = function () {
    let w = watch(store.getState, 'user');

    store.subscribe(w((newVal, oldVal, objectPath) => {
        this.setState({
            presetLogin: newVal.login,
            loginStatus: newVal.loginStatus,
            isRecognized: userUtils.isRecognized(),
            ssi: Sephora.isMobile() && newVal.loginStatus === 1
        });
    }));

    let cachedUserData = Storage.local.getItem(LOCAL_STORAGE.USER_DATA);
    let applePaySession = store.getState().applePaySession;

    this.setState({
        userExists: true,
        isRecognized: userUtils.isRecognized(),
        presetLogin: cachedUserData ? cachedUserData.login : null,
        isApplePaySignIn: applePaySession.isActive,
        inStoreUser: false,
        locale: Locale.getCurrentCountry()
    });
};

SignInModal.prototype.handleKeyDown = function (e) {
    if (e.keyCode === 13) {
        this.signIn(e);
    }
};

SignInModal.prototype.applePaySignInOrRegister = function (e) {
    ApplePay.prepareSession();
    if (this.state.userExists) {
        this.signIn(e);
    } else {
        this.registerForm.register(e, this.state.callback);
    }
};

SignInModal.prototype.forgotPassword = function (e) {
    e.preventDefault();

    store.dispatch(showSignInModal(false));
    store.dispatch(showForgotPasswordModal(true, this.loginInput.getValue()));

    processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
        data: {
            pageName: 'sign in:reset password:n/a:*',
            pageType: 'sign in',
            pageDetail: 'reset password'
        }
    });
};

SignInModal.prototype.signOut = function (e) {
    e.preventDefault();

    store.dispatch(signOut());
};

SignInModal.prototype.isValid = function () {
    let fieldsForValidation = [
        this.loginInput
    ];

    if (this.state.userExists) {
        fieldsForValidation.push(this.passwordInput);
    }

    let errors = formValidator.getErrors(fieldsForValidation);

    //Analytics
    if (errors.fields.length) {
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                linkName: 'signin:modal:error',
                bindingMethods: linkTrackingError,
                eventStrings: ['event140', 'event141'],
                fieldErrors: errors.fields,
                errorMessages: errors.messages,
                previousPage: digitalData.page.attributes.sephoraPageInfo.pageName,
                usePreviousPageName: true
            }
        });
    }//End analytics

    return !errors.fields.length;
};

/** analytics for opening registration modal */
SignInModal.prototype.trackOpenRegisterModal = () => {
    processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
        data: {
            linkData: 'sign-in_new-to-website-register_click',
            navigationInfo: anaUtils.buildNavPath(['top nav', 'account', 'register']),
            pageName: 'register:register:n/a:*',
            pageType: 'register',
            pageDetail: 'register',
            eventStrings: [anaConsts.Event.REGISTRATION_STEP_1]
        }
    });
};

/** reformat API json bi data for register modal
 * params: API object, login email string
 */
SignInModal.prototype.registerBiStoreMember = function (json, loginValue) {
    let bDay = json.beautyInsiderAccount ? json.beautyInsiderAccount.birthDay : '';
    let bMon = json.beautyInsiderAccount ? json.beautyInsiderAccount.birthMonth : '';
    let bYear = json.beautyInsiderAccount ? json.beautyInsiderAccount.birthYear : '';
    let biData = {
        userEmail: json.userName,
        profileId: json.profileId,
        firstName: json.firstName,
        lastName: json.lastName,
        bDay: bDay,
        bMon: bMon,
        bYear: bYear
    };

    let callback = this.props.callback || null;
    store.dispatch(showRegisterModal(true,
        null,
        this.state.callback,
        loginValue,
        true,
        biData,
        this.props.errback
    ));
    this.trackOpenRegisterModal();
};

SignInModal.prototype.signIn = function (e) {
    e.preventDefault();

    let loginValue = this.loginInput.getValue();

    if (this.isValid()) {
        if (this.state.userExists) {

            // TODO: why is loginForCheckout always true?
            store.dispatch(
                signIn(
                    loginValue,
                    this.passwordInput.getValue(),
                    this.state.ssi, true,
                    (json) => {
                        store.dispatch(showSignInModal(false));

                        if (json.isStoreBiMember) {
                            this.registerBiStoreMember(json, loginValue);
                        } else {
                            this.state.callback && this.state.callback(json);

                            this.setState({
                                password: '',
                                errorMessages: [],
                                callback: null,
                                message: null
                            });
                        }
                    },

                    (json) => {
                        if (json.errorMessages) {
                            this.setState({
                                errorMessages: json.errorMessages
                            });
                        }
                    }
                )
            );
        } else {
            // Attempted new user.  Confirm they don't exist and show register modal
            store.dispatch(checkUser(loginValue,
                (json) => {
                    if (json.isPosMember && this.props.isNewUserFlow &&
                        typeof this.state.callback === 'function') {
                        store.dispatch(showSignInModal(false));
                        json.isNewUserFlow = true;
                        this.state.callback(json);
                    } else if (!json.isStoreBiMember) {
                        this.setState({
                            errorMessages: ['An account already exists for ' +
                                loginValue + '. Please sign in or choose another e-mail address.']
                        });

                    // Store registered user - needs to register online.
                    } else {
                        store.dispatch(showSignInModal(false));
                        this.registerBiStoreMember(json, loginValue);
                    }
                },

                (json) => {
                    store.dispatch(showSignInModal(false));

                    if (json.errorCode === 404) {
                        if (this.props.isNewUserFlow) {
                            if (typeof this.state.callback === 'function') {
                                this.state.callback({
                                    userName: loginValue,
                                    isNewUserFlow: true
                                });
                            }
                        } else {
                            let callback = this.props.callback || null;
                            store.dispatch(showRegisterModal(true,
                                null,
                                this.state.callback,
                                loginValue,
                                null,
                                null,
                                this.props.errback)
                            );
                            this.trackOpenRegisterModal();
                        }
                    }
                }
            ));
        }

    }
};

/** check POS user and analytics for opening registration modal from ApplePay signin */
SignInModal.prototype.applePayRegister = function () {
    if (this.state.isApplePaySignIn) {

        let userEmail = this.loginInput.getValue();

        if (userEmail) {
            store.dispatch(checkUser(userEmail,
                (json) => {
                    if (!json.isStoreBiMember) {
                        this.setState({
                            userExists: true,
                            errorMessages: ['An account already exists for ' +
                                userEmail + '. Please sign in or choose another e-mail address.']
                        });
                    } else {
                        this.setState({
                            errorMessages: [],
                            userExists: false,
                            inStoreUser: true,
                            isEmailDisabled: true
                        }, this.registerForm.inStoreUserHandler(json));
                    }

                }, () => {
                    this.setState({
                        errorMessages: [],
                        userExists: false
                    });
                    store.dispatch(showInterstice(false));
                }
            ));
        }

        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: 'register:register:n/a:*',
                linkData: 'sign-in_new-to-website-register_click',
                pageType: 'register',
                pageDetail: 'register'
            }
        });
    }
};

SignInModal.prototype.showPrivacyPolicy = function (e) {
    e.preventDefault();
    const mediaId = '12300066';
    const title = 'Privacy Policy';
    store.dispatch(showTermsConditions(true, mediaId, title));
};

SignInModal.prototype.showTermsOfUse = function (e) {
    e.preventDefault();
    const mediaId = '11300018';
    const title = 'Sephora Terms of Use';
    store.dispatch(showTermsConditions(true, mediaId, title));
};


// Added by sephora-jsx-loader.js
module.exports = SignInModal.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/SignInModal/SignInModal.c.js