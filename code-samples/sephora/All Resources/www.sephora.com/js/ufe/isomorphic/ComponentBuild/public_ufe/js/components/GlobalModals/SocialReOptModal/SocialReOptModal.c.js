// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var SocialReOptModal = function () {};

// Added by sephora-jsx-loader.js
SocialReOptModal.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('store/Store');
const ProfileActions = require('actions/ProfileActions');
const userActions = require('actions/UserActions');
const termsAndConditionsActions = require('actions/TermsAndConditionsActions');
const Locale = require('utils/LanguageLocale.js');
const watch = require('redux-watch');
const processEvent = require('analytics/processEvent');
const anaConsts = require('analytics/constants');
const anaUtils = require('analytics/utils');

const TERMS_AND_CONDITIONS_MEDIA_ID = 11300018;
const TERMS_AND_CONDITIONS_TITLE = 'Terms & Conditions';

SocialReOptModal.prototype.close = function () {
    store.dispatch(ProfileActions.showSocialReOptModal(false));

    if (this.props.cancellationCallback) {
        this.props.cancellationCallback();
    }
};

SocialReOptModal.prototype.handleClick = function () {
    if (Locale.isCanada() && !this.state.hasAcceptedTerms) {
        this.setState({
            displayErrorMessage: true
        });
    } else {
        let data = {
            fragmentForUpdate: 'SOCIAL',
            isAcceptCommunity: true
        };

        store.dispatch(
            userActions.updateUserFragment(
                data,
                this.handleClickSuccessCallback
            )
        );
    }
};

SocialReOptModal.prototype.handleClickSuccessCallback = function () {
    store.dispatch(ProfileActions.showSocialReOptModal(false));
    store.dispatch(userActions.getUserFull());

    //wait for userFull call to complete before calling socialReOptCallback
    let isSocialEnabledWatch = watch(store.getState, 'user.isSocialEnabled');
    store.subscribe(isSocialEnabledWatch(newIsSocialEnabled => {
        if (this.props.socialReOptCallback) {
            this.props.socialReOptCallback();
        }
    }));

    //Analytics
    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
        data: {
            linkName: 'social registration:re-opt in:success',
            actionInfo: 'social registration:re-opt in:success',
            eventStrings: [anaConsts.Event.EVENT_71]
        }
    });
};

SocialReOptModal.prototype.handleAcceptCommunityClick = function (e) {
    this.setState({
        hasAcceptedTerms: e.target.checked,
        displayErrorMessage: false
    });
};

SocialReOptModal.prototype.openTermsAndConditions = function () {
    store.dispatch(
        termsAndConditionsActions.showModal(
            true,
            TERMS_AND_CONDITIONS_MEDIA_ID,
            TERMS_AND_CONDITIONS_TITLE)
    );
};


// Added by sephora-jsx-loader.js
module.exports = SocialReOptModal.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/SocialReOptModal/SocialReOptModal.c.js