// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var EditMyProfileFS = function () {};

// Added by sephora-jsx-loader.js
EditMyProfileFS.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const actions = require('Actions');
const profileActions = require('actions/ProfileActions');
const ReactDOM = require('react-dom');
const userUtils = require('utils/User');
const communityUtils = require('utils/Community');
const authentication = require('utils/Authentication');
const SOCIAL_PROVIDERS = communityUtils.PROVIDER_TYPES;

EditMyProfileFS.prototype.ctrlr = function () {
    if (userUtils.needsSocialReOpt() || !userUtils.isSocial()) {
        this.setState({
            active: 1
        });
    }
};

EditMyProfileFS.prototype.componentWillReceiveProps = function (updatedProps) {
    if (!updatedProps.isLithiumSuccessful) {
        this.setState({
            active: 1
        });
    } else if (updatedProps.socialProfile !== this.state.lithiumDataToSave) {
        this.setState({
            lithiumDataToSave: updatedProps.socialProfile
        });
    }
};

EditMyProfileFS.prototype.clickHandler = function (evt, index) {
    //check if section is accessible for user, if not launch correct modal
    let launchCommunityRegistration = (index === 0 && !this.props.socialProfile);
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
        let el = ReactDOM.findDOMNode(this.scrollContainer);
        el.scrollTop = 0;
        let dataToSave = this.tabContent.getData && this.tabContent.getData();

        //If user clicks on tab from biAccount edit tab
        //then merge BI data already to be saved with new BI data to be saved
        //and set biDataToSave state to new biDataToSave.
        //Else if user clicks on tab from bio profile tab (lithium data)
        //then set lithiumDataToSave state to new lithium data to save.
        //Else user has clicked on new tab from either birthday or color iq tab
        //there will not be any data to save from either of these tabs.
        if (dataToSave && dataToSave.biAccount) {
            let biDataToSave = this.mergeBiDataToSave(dataToSave);
            this.setState({
                active: index,
                biDataToSave: biDataToSave
            });
        } else if (dataToSave !== undefined) {
            this.setState({
                active: index,
                lithiumDataToSave: dataToSave
            });
        } else {
            this.setState({
                active: index
            });
        }
    }
};

EditMyProfileFS.prototype.mergeBiDataToSave = function (newData) {
    let mergedDataToSave = Object.assign(
        {},
        this.state.biDataToSave.biAccount.personalizedInformation,
        newData.biAccount.personalizedInformation
    );

    let biDataToSave = { biAccount: { personalizedInformation: mergedDataToSave } };
    return biDataToSave;
};


EditMyProfileFS.prototype.saveData = function () {
    let dataToSave = this.tabContent.getData && this.tabContent.getData();
    let isBioProfileSection = (this.state.active === 0);
    let biDataToSave = this.state.biDataToSave;
    let lithiumDataToSave = this.state.lithiumDataToSave;

    if (dataToSave) {
        if (isBioProfileSection) {
            lithiumDataToSave = dataToSave;
        } else {
            biDataToSave = this.mergeBiDataToSave(dataToSave);
        }
    }

    if (Object.keys(biDataToSave).length !== 0) {
        this.props.saveProfileCallback(
            biDataToSave,
            null,
            false);
    }

    if (lithiumDataToSave !== null) {
        this.props.saveProfileCallback(
            lithiumDataToSave,
            null,
            true);
    }
};


// Added by sephora-jsx-loader.js
module.exports = EditMyProfileFS.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/EditMyProfile/EditMyProfileFS/EditMyProfileFS.c.js