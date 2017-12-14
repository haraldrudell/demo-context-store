// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var NotificationsAndRemindersPrefs = function () {};

// Added by sephora-jsx-loader.js
NotificationsAndRemindersPrefs.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const profileApi = require('services/api/profile');
const Locale = require('utils/LanguageLocale');
const userCountry = Locale.getCurrentCountry().toUpperCase();
const { requireSignedInUser } = require('utils/decorators');

NotificationsAndRemindersPrefs.prototype.ctrlr = function (user) {
    profileApi.getNotificationsAndRemindersPreferences(user.profileId).
        then(prefs => {
            this.setState({
                editMode: false,
                editedPrefs: null,
                prefs: prefs
            });
        });
};

NotificationsAndRemindersPrefs.prototype.switchToEditMode = function () {
    this.setState({
        editedPrefs: Object.assign({}, this.state.prefs),
        editMode: true
    });
    this.props.onExpand();
};

NotificationsAndRemindersPrefs.prototype.switchToViewMode = function () {
    if (this.state.editMode) {
        this.setState({
            editedPrefs: null,
            editMode: false
        });
    }
};

NotificationsAndRemindersPrefs.prototype.handleStatusChange = function (e) {
    this.setState({
        editedPrefs: Object.assign({}, this.state.editedPrefs, {
            subscribed: e.currentTarget.value === '1'
        })
    });
};

NotificationsAndRemindersPrefs.prototype.handleSeeSampleEmailClick = function (e) {
    this.setState({
        showSampleEmail: true
    });
};

NotificationsAndRemindersPrefs.prototype.handleSeeSampleEmailDismiss = function (e) {
    this.setState({
        showSampleEmail: false
    });
};

NotificationsAndRemindersPrefs.prototype.handleCancelClick = function (e) {
    this.setState({
        editedPrefs: null
    });
    this.switchToViewMode();
};

NotificationsAndRemindersPrefs.prototype.handleUpdateClick = function (e) {
    profileApi.setNotificationsAndRemindersPreferences(this.state.editedPrefs).
        then(() => {
            this.setState({
                prefs: this.state.editedPrefs
            });
            this.switchToViewMode();
        });
};

NotificationsAndRemindersPrefs.prototype.shouldShowCanadaLegalCopy = function () {
    return userCountry === 'CA';
};

NotificationsAndRemindersPrefs =
    requireSignedInUser(NotificationsAndRemindersPrefs);


// Added by sephora-jsx-loader.js
module.exports = NotificationsAndRemindersPrefs.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/MailingPrefs/NotificationsAndRemindersPrefs/NotificationsAndRemindersPrefs.c.js