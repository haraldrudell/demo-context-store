// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var PromotionalEmailsPrefs = function () {};

// Added by sephora-jsx-loader.js
PromotionalEmailsPrefs.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const profileApi = require('services/api/profile');
const Locale = require('utils/LanguageLocale');
const userCountry = Locale.getCurrentCountry().toUpperCase();
const { requireSignedInUser } = require('utils/decorators');

const COUNTRIES_THAT_REQUIRE_ZIP_POSTAL_CODE = ['US', 'CA', 'PR'];

PromotionalEmailsPrefs.prototype.ctrlr = function (user) {
    this._userProfileId = user.profileId;
    profileApi.getPromotionalEmailPreferences(this._userProfileId).
        then(prefs => {
            this.setState({
                editMode: false,
                shouldShowZipPostalCodeInput:
                    COUNTRIES_THAT_REQUIRE_ZIP_POSTAL_CODE.
                        indexOf(prefs.country) >= 0,
                editedPrefs: null,
                prefs: prefs,
                formErrors: {}
            });
        });
};

PromotionalEmailsPrefs.prototype.switchToEditMode = function () {
    this.setState({
        editedPrefs: Object.assign({}, this.state.prefs),
        editMode: true
    });
    this.props.onExpand();
};

PromotionalEmailsPrefs.prototype.switchToViewMode = function () {
    this.setState({
        editedPrefs: null,
        editMode: false
    });
};

PromotionalEmailsPrefs.prototype.handleStatusChange = function (e) {
    const subscribed = e.currentTarget.value === '1';
    const countrySelected = this.state.editedPrefs.country;
    this.setState({
        editedPrefs: Object.assign({}, this.state.editedPrefs, { subscribed }),
        shouldShowZipPostalCodeInput:
            COUNTRIES_THAT_REQUIRE_ZIP_POSTAL_CODE.indexOf(countrySelected) >= 0
    });
};

PromotionalEmailsPrefs.prototype.handleFrequencyChange = function (e) {
    this.setState({
        editedPrefs: Object.assign({}, this.state.editedPrefs, {
            frequency: e.currentTarget.value
        })
    });
};

PromotionalEmailsPrefs.prototype.handleCountryChange = function (e) {
    const countrySelected = e.currentTarget.value;

    this.setState({
        editedPrefs: Object.assign({}, this.state.editedPrefs, {
            country: countrySelected,
            zipPostalCode: null
        }),
        shouldShowZipPostalCodeInput:
            COUNTRIES_THAT_REQUIRE_ZIP_POSTAL_CODE.indexOf(countrySelected) >= 0
    });

    this._zipPostalCodeInput && this._zipPostalCodeInput.setValue(null);
};

PromotionalEmailsPrefs.prototype.handleSeeSampleEmailClick = function (e) {
    this.setState({
        showSampleEmail: true
    });
};

PromotionalEmailsPrefs.prototype.handleSeeSampleEmailDismiss = function (e) {
    this.setState({
        showSampleEmail: false
    });
};

PromotionalEmailsPrefs.prototype.handleCancelClick = function (e) {
    this.setState({
        editedPrefs: null
    });
    this.switchToViewMode();
};

PromotionalEmailsPrefs.prototype.handleUpdateClick = function (e) {
    this.setState({
        formErrors: {}
    });

    let isFormValid = this.validateForm();
    if (isFormValid) {
        this.save();
    }
};

PromotionalEmailsPrefs.prototype.validateForm = function () {
    if (this.state.shouldShowZipPostalCodeInput && this.state.editedPrefs.subscribed) {
        return this._zipPostalCodeInput.validateError() === null;
    } else {
        return true;
    }
};

PromotionalEmailsPrefs.prototype.getPrefsFromForm = function () {
    return Object.assign({}, this.state.editedPrefs, {
        zipPostalCode: this.state.shouldShowZipPostalCodeInput &&
            this._zipPostalCodeInput.getValue() || null
    });
};

PromotionalEmailsPrefs.prototype.save = function () {
    // https://jira.sephora.com/wiki/display/ILLUMINATE/Update+Profile+API
    let UPDATE_PROFILE_API_GENERAL_ERROR_CODE = -10300;

    var prefs = this.getPrefsFromForm();

    profileApi.setPromotionalEmailPreferences(this._userProfileId, prefs).then(() => {
        this.setState({ prefs });
        this.switchToViewMode();
    }, (data) => {
        if (data.errorCode === UPDATE_PROFILE_API_GENERAL_ERROR_CODE) {
            this.setState({
                formErrors: {
                    zipPostalCode: data.errorMessages
                }
            });
            this.validateForm();
        }

    });
};

PromotionalEmailsPrefs.prototype.shouldShowCanadaLegalCopy = function () {
    return userCountry === 'CA';
};

PromotionalEmailsPrefs = requireSignedInUser(PromotionalEmailsPrefs);


// Added by sephora-jsx-loader.js
module.exports = PromotionalEmailsPrefs.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/MailingPrefs/PromotionalEmailsPrefs/PromotionalEmailsPrefs.c.js