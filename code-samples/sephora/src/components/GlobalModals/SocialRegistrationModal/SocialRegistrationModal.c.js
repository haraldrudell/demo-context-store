// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var SocialRegistrationModal = function () {};

// Added by sephora-jsx-loader.js
SocialRegistrationModal.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const actions = require('Actions');
const profileActions = require('actions/ProfileActions');
const showSocialRegistrationModal = profileActions.showSocialRegistrationModal;
const socialInfoActions = require('actions/SocialInfoActions');
const userActions = require('actions/UserActions');
const getUserFull = userActions.getUserFull;
const profileApi = require('services/api/profile');
const biApi = require('services/api/beautyInsider');
const lithiumApi = require('services/api/thirdparty/Lithium');
const userUtils = require('utils/User');
const formValidator = require('utils/FormValidator');
const termsAndConditionsActions = require('actions/TermsAndConditionsActions');
const COMMUNITY_TERMS_AND_CONDITIONS_MEDIA_ID = 43900056;
const BI_TERMS_AND_CONDITIONS_MEDIA_ID = 28100020;
const TERMS_AND_CONDITIONS_TITLE = 'Terms & Conditions';
const watch = require('redux-watch');
const processEvent = require('analytics/processEvent');
const anaConsts = require('analytics/constants');
const anaUtils = require('analytics/utils');
const Locale = require('utils/LanguageLocale');

//Analytics
let isJoiningBI = false;

SocialRegistrationModal.prototype.openTermsAndConditions = function (isBiTerms) {
    let termsMediaId = isBiTerms ? BI_TERMS_AND_CONDITIONS_MEDIA_ID
        : COMMUNITY_TERMS_AND_CONDITIONS_MEDIA_ID;
    store.dispatch(
        termsAndConditionsActions.showModal(
            true,
            termsMediaId,
            TERMS_AND_CONDITIONS_TITLE)
    );
};

SocialRegistrationModal.prototype.handleAcceptCommunityClick = function (e) {
    this.setState({ isAcceptCommunity: e.target.checked });
};

SocialRegistrationModal.prototype.handleJoinBIClick = function (e) {
    this.setState({ isJoinBI: e.target.checked });
};

SocialRegistrationModal.prototype.handleJoinClick = function () {
    let createBiAccount;
    let setNickname;
    let hasFrontEndError = false;
    let isCanada = Locale.isCanada();

    if (!userUtils.isBI() && !this.state.isUserBI) {
        let optionParams = {};
        let validate = {};
        let biInfo = this.biForm.getBIDate();

        // Only validate birthday info if user selects one date field but does not select all
        // 3 since it isn't mandatory
        if (biInfo.birthMonth.length || biInfo.birthDay.length || biInfo.birthYear.length) {
            validate = this.biForm.validateForm();

        }

        optionParams.isJoinBi = isCanada ? this.state.isJoinBI : true;
        isJoiningBI = optionParams.isJoinBi; // Analytics

        if (!validate.hasError && optionParams.isJoinBi) {
            optionParams.biAccount = biInfo;
            if (isCanada) {
                optionParams.subscription = {
                    subScribeToEmails: this.subscribeEmail.getValue()
                };
            }

            // Return true if call was successful and false if rejected
            createBiAccount = () => {
                return biApi.createBiAccount(optionParams)
                    .then(() => {
                        this.setState({ isUserBI: true });
                        return true;
                    }).catch(e => {
                        return false;
                    });
            };
        } else {

            // If form did not pass front end validation, don't make the Api call
            // and just return false
            hasFrontEndError = true;
            createBiAccount = function () {
                return Promise.resolve(false);
            };
        }
    } else {

        // If user is already BI, just return true
        createBiAccount = function () {
            return Promise.resolve(true);
        };
    }

    if (!this.state.hasNickname) {

        // Clear previous errors
        if (this.state.errorMessages || this.state.invalidNickname) {
            this.setState({
                invalidNickname: false,
                errorMessages: null
            });
        }
        let errors = formValidator.getErrors([this.nicknameInput]);
        let isAcceptCommunity = isCanada ? this.state.isAcceptCommunity : true;
        if (!errors.fields.length && isAcceptCommunity) {

            // Return true if call was successful and false if rejected
            setNickname = () => {
                store.dispatch(actions.showInterstice(true));
                return profileApi.setNickname(
                        this.nicknameInput.getValue(),
                        this.props.socialRegistrationProvider)
                    .then(() => {
                        store.dispatch(actions.showInterstice(false));
                        this.setState({
                            hasNickname: true,
                            errorMessages: null,
                            invalidNickname: false
                        });
                        return true;
                    }).catch(e => {
                        store.dispatch(actions.showInterstice(false));
                        this.setState({
                            errorMessages: e.errorMessages,
                            invalidNickname: true,
                            displayJoinCommunityError: false,
                            displayJoinBIError: false
                        });
                        return false;
                    });
            };
        } else {

            // If nickname field did not pass front end validation, don't make the
            // Api call and just return false
            hasFrontEndError = true;
            setNickname = function () {
                return Promise.resolve(false);
            };
        }
    } else {

        // If first nickname call was successful, but there was an error in birthday
        // fields, just return true and don't make Api call
        setNickname = function () {
            return Promise.resolve(true);
        };
    }

    if (!hasFrontEndError) {
        Promise.all([
            createBiAccount(),
            setNickname()
        ]).then(values => {

            // Only call success callback if niether nickname or birthday returns an error
            let errors = values.filter(value => {
                return value === false;
            });
            if (!errors.length) {
                this.registrationSuccess();
            }
        });
    } else {
        this.setState({
            displayJoinCommunityError: isCanada && !this.state.isAcceptCommunity,
            displayJoinBIError: isCanada && !this.state.isUserBI && !this.state.isJoinBI
        });
    }

    Sephora.analytics.utils.fireEventForTagManager('joinCommunityButtonClick');
};

SocialRegistrationModal.prototype.registrationSuccess = function () {
    store.dispatch(showSocialRegistrationModal(false));
    store.dispatch(getUserFull());

    //wait for user full call to complete before lithium api call and callback
    let nicknameWatch = watch(store.getState, 'user.nickName');
    store.subscribe(nicknameWatch(newNickname => {
        lithiumApi.getAuthenticatedUserSocialInfo(newNickname).
        then(data => {
            store.dispatch(socialInfoActions.setUserSocialInfo(data));
            if (this.props.socialRegistrationCallback) {
                this.props.socialRegistrationCallback();
            }
        }).catch(data => {
            if (this.props.socialRegistrationCallback) {
                this.props.socialRegistrationCallback();
            }
        });
    }));

    //Analytics
    let pageDetail = 'nickname';
    let eventStrings = [anaConsts.Event.EVENT_71];

    if (isJoiningBI) {
        pageDetail += ' birthday';
        eventStrings.push(anaConsts.Event.REGISTRATION_WITH_BI);
    }

    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
        data: {
            linkName: 'social registration:' + pageDetail + ':success',
            actionInfo: 'social registration:' + pageDetail + ':success',
            eventStrings: eventStrings
        }
    });

    Sephora.analytics.utils.fireEventForTagManager('communityProfileCreationSuccess');
};

SocialRegistrationModal.prototype.close = function () {

    // If BI call is successful, but user errors on nickname and then closes the modal,
    // update the user to reflect that she is now BI
    if (this.state.isUserBI) {
        store.dispatch(getUserFull());

        //wait for userFull call to complete before socialRegistrationCallback
        if (this.props.cancellationCallback) {
            let biInfoWatch = watch(store.getState, 'user.beautyInsiderAccount');
            store.subscribe(biInfoWatch(newBiInfo => {
                store.dispatch(showSocialRegistrationModal(false));
                this.props.cancellationCallback();
            }));
        } else {
            store.dispatch(showSocialRegistrationModal(false));
        }
    } else if (userUtils.isBI()) {
        store.dispatch(showSocialRegistrationModal(false));
        if (this.props.cancellationCallback) {
            this.props.cancellationCallback();
        }
    } else {
        store.dispatch(showSocialRegistrationModal(false));
        if (this.props.cancellationCallback) {
            this.props.cancellationCallback();
        }
    }
};


// Added by sephora-jsx-loader.js
module.exports = SocialRegistrationModal.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/SocialRegistrationModal/SocialRegistrationModal.c.js