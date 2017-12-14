// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var PostalMailPrefs = function () {};

// Added by sephora-jsx-loader.js
PostalMailPrefs.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const profileApi = require('services/api/profile');
const Locale = require('utils/LanguageLocale');
const js = require('utils/javascript');
const userCountry = Locale.getCurrentCountry().toUpperCase();
const { requireSignedInUser } = require('utils/decorators');

const SUPPORTED_COUNTRIES_CODES =
        js.getObjectValuesSlowNDirty(Locale.COUNTRIES);
const DEFAULT_COUNTRY_CODE = 'US';

PostalMailPrefs.prototype.ctrlr = function (user) {
    profileApi.getPostalMailPreferences(user.profileId).then(prefs => {

        //if there is no address, adapt the data
        if (Object.keys(prefs.address).length === 0) {
            prefs.address.firstName = user.firstName;
            prefs.address.lastName = user.lastName;
        }

        this.setState({
            editMode: false,
            editedPrefs: null,
            prefs: prefs,
            shouldShowCanadaLegalCopy: userCountry === 'CA',
            defaultCountryCode:
                SUPPORTED_COUNTRIES_CODES.indexOf(userCountry) >= 0 ?
                    userCountry : 'US'
        });
    });
};

PostalMailPrefs.prototype.switchToEditMode = function () {
    this.setState({
        editedPrefs: Object.assign({}, this.state.prefs),
        editMode: true
    });
    this.props.onExpand();
};

PostalMailPrefs.prototype.switchToViewMode = function () {
    this.setState({
        editedPrefs: null,
        editMode: false
    });
};

PostalMailPrefs.prototype.handleStatusChange = function (e) {
    this.setState({
        editedPrefs: Object.assign({}, this.state.editedPrefs, {
            subscribed: e.currentTarget.value === '1'
        })
    });
};

PostalMailPrefs.prototype.handleCancelClick = function (e) {
    this.setState({
        editedPrefs: null
    });
    this.switchToViewMode();
};

PostalMailPrefs.prototype.getPrefsFromForm = function (e) {
    return {
        subscribed: this.state.editedPrefs.subscribed,
        address: this._addressFormComponent &&
            this._addressFormComponent.getData().address || {}
    };
};

PostalMailPrefs.prototype.handleUpdateClick = function (e) {
    let prefs = this.getPrefsFromForm();

    if (!prefs.subscribed && !this.state.prefs.subscribed) {
        this.switchToViewMode();
    } else {
        let isAddressFormValid = false;

        if (prefs.subscribed) {
            isAddressFormValid = this._addressFormComponent &&
                this._addressFormComponent.validateForm();
        }

        if (!prefs.subscribed || (prefs.subscribed && isAddressFormValid)) {
            profileApi.setPostalMailPreferences(prefs).
                then(() => {
                    this.setState({
                        prefs: prefs
                    });
                    this.switchToViewMode();
                }).catch(r => {
                    this._addressFormComponent.setState({
                        errorMessages: r.errorMessages
                    });
                });
        }
    }
};

PostalMailPrefs = requireSignedInUser(PostalMailPrefs);


// Added by sephora-jsx-loader.js
module.exports = PostalMailPrefs.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/MailingPrefs/PostalMailPrefs/PostalMailPrefs.c.js