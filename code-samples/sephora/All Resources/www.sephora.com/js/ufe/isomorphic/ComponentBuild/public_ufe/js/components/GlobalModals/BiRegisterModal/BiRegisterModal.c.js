// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var BiRegisterModal = function () {};

// Added by sephora-jsx-loader.js
BiRegisterModal.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const showBiRegisterModal = require('actions/Actions').showBiRegisterModal;
const confirmModal = require('Actions').showInfoModal;
const biRegister = require('actions/UserActions').biRegister;
const Locale = require('utils/LanguageLocale');
const profileActions = require('actions/ProfileActions');
const userUtils = require('utils/User');
const profileApi = require('services/api/profile');
const { withInterstice } = require('utils/decorators');


BiRegisterModal.prototype.ctrlr = function () {
    if (Locale.getCurrentCountry() === 'ca') {
        withInterstice(profileApi.getCurrentProfileEmailSubscriptionStatus)().
            then(subscribed => {
                if (subscribed) {
                    this.subscribeEmail.setChecked(true);
                }
            });
    }
};

BiRegisterModal.prototype.handleKeyDown = function (e) {
    if (e.keyCode === 13) {
        this.biRegister(e);
    }
};

BiRegisterModal.prototype.requestClose = function (e) {
    store.dispatch(showBiRegisterModal(false));

    if (this.props.cancellationCallback) {
        this.props.cancellationCallback();
    }
};

/** success callback for register, close modal */
BiRegisterModal.prototype.biRegisterSuccess = function (response) {
    this.requestClose();

    if (this.props.isCommunity && userUtils.needsSocialReOpt()) {
        store.dispatch(profileActions.showSocialReOptModal(
            true, this.props.callback, true, this.props.cancellationCallback
        ));
    } else if (this.props.callback) {
        this.props.callback();
    }

    if (Sephora.isMobile()) {
        store.dispatch(
            confirmModal(
                true,
                'Registration Complete',
                'Congratulations! You are now a Beauty Insider',
                'Continue'
            )
        );
    }
};

/** failure callback for register */
BiRegisterModal.prototype.biRegisterFailure = function (response) {
    if (response.errors.biBirthDayInput) {
        this.biRegForm.setErrorState(response.errors.biBirthDayInput.join());
    }
};

/** Reformat user bi form data into params for API call
 * @param {object} BI date data
 */
BiRegisterModal.prototype.getOptionParams = function (biFormData) {
    const optionParams = {};
    if (Locale.getCurrentCountry() === 'ca') {
        optionParams.subscription = {
            subScribeToEmails: this.subscribeEmail.getValue()
        };
    }

    optionParams.isJoinBi = !!biFormData;
    optionParams.biAccount = biFormData;
    return optionParams;
};

/** Register user as BI on form submit */
BiRegisterModal.prototype.biRegister = function (e) {
    e.preventDefault();
    let biFormData = this.biRegForm.getBIDate();
    let validate = this.biRegForm.validateForm();
    if (!validate.hasError) {

        let optionParams = this.getOptionParams(biFormData);

        store.dispatch(
            biRegister(
                optionParams,
                this.biRegisterSuccess,
                this.biRegisterFailure
            )
        );
    }
};


// Added by sephora-jsx-loader.js
module.exports = BiRegisterModal.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/BiRegisterModal/BiRegisterModal.c.js