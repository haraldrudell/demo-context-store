// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var ForgotPasswordModal = function () {};

// Added by sephora-jsx-loader.js
ForgotPasswordModal.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const showForgotPasswordModal = require('Actions').showForgotPasswordModal;
const showInfoModal = require('Actions').showInfoModal;
const forgotPassword = require('actions/UserActions').forgotPassword;

ForgotPasswordModal.prototype.requestClose = function (e) {
    store.dispatch(showForgotPasswordModal(false));
};

ForgotPasswordModal.prototype.handleKeyDown = function (e) {
    if (e.keyCode === 13) {
        this.submit(e);
    }
};

ForgotPasswordModal.prototype.isValid = function () {
    let loginError = this.loginInput.validateError();

    //Analytics
    let fieldsToCheck = [loginError];

    let errors = fieldsToCheck.filter((value) => !!value);

    if (errors.length) {
        // TODO: For 17.1 Mike Mendez
        require('analytics/processEvent').process(
            require('analytics/constants').LINK_TRACKING_EVENT,
            {
                data: {
                    bindingMethods: require('analytics/bindings/pages/all/linkTrackingError'),
                    eventStrings: ['event140', 'event141'],
                    fieldErrors: errors,
                    usePreviousPageName: true
                }
            }
        );
    }//End analytics

    return fieldsToCheck.filter((value) => !!value).length === 0;

};

ForgotPasswordModal.prototype.submit = function (e) {
    let successCallback = (response) => {
        let login = this.loginInput.getValue();

        this.requestClose();

        this.setState({
            inputsDisabled: false,
            errorMessages: []
        });

        // TODO: For 17.2 Mike Mendez
        require('analytics/utils').setNextPageData({ events: ['event140', 'event100'] });

        let message = 'We have sent an email to ' + login +
            '. Please check your inbox and click on the link to reset your password.';

        store.dispatch(showInfoModal(true, 'Reset password', message));
    };

    let failureCallback = (response) => {
        this.setState({ inputsDisabled: false });

        if (response.errorMessages) {
            this.setState({ errorMessages: response.errorMessages });

            // TODO: For 17.2 Mike Mendez
            require('analytics/processEvent').process(
                require('analytics/constants').LINK_TRACKING_EVENT,
                {
                    data: {
                        bindingMethods: require('analytics/bindings/pages/all/linkTrackingError'),
                        errorMessages: response.errorMessages,
                        eventStrings: ['event140', 'event141'],
                        usePreviousPageName: true
                    }
                }
            );
        }
    };

    e.preventDefault();

    if (this.isValid()) {
        let loginValue = this.loginInput.getValue();

        store.dispatch(
            forgotPassword(
                loginValue,
                (json) => {successCallback(json);},

                (json) => {failureCallback(json);}
            )
        );
    } else {
        this.setState({ showErrors: true });
    }
};


// Added by sephora-jsx-loader.js
module.exports = ForgotPasswordModal.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/ForgotPasswordModal/ForgotPasswordModal.c.js