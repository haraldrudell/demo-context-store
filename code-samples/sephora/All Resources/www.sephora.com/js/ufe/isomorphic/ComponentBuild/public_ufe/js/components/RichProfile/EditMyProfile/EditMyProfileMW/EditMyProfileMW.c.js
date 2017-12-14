// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var EditMyProfileMW = function () {};

// Added by sephora-jsx-loader.js
EditMyProfileMW.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const profileActions = require('actions/ProfileActions');
const actions = require('Actions');
const userUtils = require('utils/User');
const communityUtils = require('utils/Community');
const authentication = require('utils/Authentication');
const SOCIAL_PROVIDERS = communityUtils.PROVIDER_TYPES;

EditMyProfileMW.prototype.clickHandler = function (e, index) {
    e.preventDefault();

    const content = this.props.getCategoryContent(index);

    //social profile only needed for BioProfile sections
    const biAccount = index === 0 ? null : this.props.biAccount;
    const socialProfile = index === 0 ? this.props.socialProfile : null;

    //check if section is accessible for user, if not launch correct modal
    let launchCommunityRegistration = (index === 0 && !socialProfile);
    let launchCommunityReOptIn = (index === 0 && userUtils.needsSocialReOpt());

    if (launchCommunityRegistration) {
        authentication.requireLoggedInAuthentication().
        then(() => {
            store.dispatch(profileActions.showSocialRegistrationModal(
                true, null, null, SOCIAL_PROVIDERS.lithium)
            );
        }).catch(() => {
            console.debug('user sign in required');
        });
    } else if (launchCommunityReOptIn) {
        authentication.requireLoggedInAuthentication().
        then(() => {
            store.dispatch(profileActions.showSocialReOptModal(true));
        }).catch(() => {
            console.debug('user sign in required');
        });
    } else {
        store.dispatch(profileActions.showEditFlowModal(
            true,
            this.props.linksList[index],
            content,
            biAccount,
            socialProfile,
            this.props.saveProfileCallback
        ));
    }
};


// Added by sephora-jsx-loader.js
module.exports = EditMyProfileMW.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/EditMyProfile/EditMyProfileMW/EditMyProfileMW.c.js