// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var AboutMe = function () {};

// Added by sephora-jsx-loader.js
AboutMe.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const userUtils = require('utils/User');
const store = require('Store');
const ProfileActions = require('actions/ProfileActions');
const biUtils = require('utils/BiProfile');

AboutMe.prototype.ctrlr = function () {};

AboutMe.prototype.submitData = function () {
    let profileId = userUtils.getProfileId();
    let aboutMeData = this.getAboutMeData();
    if (aboutMeData) {
        let profileData = {
            biAccount: {}
        };
        profileData.biAccount.personalizedInformation = biUtils.completeProfileObject(
            aboutMeData, this.props.biAccount.personalizedInformation);
        profileData.profileId = profileId;
        store.dispatch(ProfileActions.updateBiAccount(profileData, () => {
            this.props.onSubmit();
        }));
    } else {
        this.props.onSubmit();
    }
};

AboutMe.prototype.componentWillReceiveProps = function (updatedProps) {
    this.setState(updatedProps);
};

AboutMe.prototype.getAboutMeData = function () {
    let skinData = (this.skin && this.skin.getData().biAccount.personalizedInformation);
    let hairData = (this.hair && this.hair.getData().biAccount.personalizedInformation);
    let eyeData = (this.eyes && this.eyes.getData().biAccount.personalizedInformation);
    let personalizedInformation = Object.assign({}, skinData, hairData, eyeData);
    let isEmpty = true;
    Object.keys(personalizedInformation).forEach(key => {
        let info = personalizedInformation[key];
        if (info instanceof Array) {
            if (info.length) {
                isEmpty = false;
            } else {
                delete personalizedInformation[key];
            }
        } else if (typeof info === 'object' && info !== null) {
            if (Object.keys(info).length) {
                isEmpty = false;
            } else {
                delete personalizedInformation[key];
            }
        } else if (!info) {
            delete personalizedInformation[key];
        } else {
            isEmpty = false;
        }
    });
    return !isEmpty && personalizedInformation;
};


// Added by sephora-jsx-loader.js
module.exports = AboutMe.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/AddReview/AboutMe/AboutMe.c.js