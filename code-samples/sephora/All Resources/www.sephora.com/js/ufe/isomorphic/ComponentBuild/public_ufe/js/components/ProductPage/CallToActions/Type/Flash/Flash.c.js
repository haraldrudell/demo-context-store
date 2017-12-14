// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Flash = function () {};

// Added by sephora-jsx-loader.js
Flash.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const actions = require('Actions');
const userUtils = require('utils/User');
const profileApi = require('services/api/profile');
const processEvent = require('analytics/processEvent');
const anaConsts = require('analytics/constants');
const buttonCTA = {
    'ENROLLED': 'YOU ARE ENROLLED IN FLASH',
    'ENROLL_NOW': 'ENROLL NOW',
    'ADD_TO_BASKET': 'ADD TO BASKET'
};

Flash.prototype.ctrlr = function () {
    store.setAndWatch('user', null, () => {
        this.setButtonTextAndStatus(userUtils.isFlash(),
                                    userUtils.isRouge(),
                                    userUtils.isFlashAutoRenewed());
    });
};

Flash.prototype.setButtonTextAndStatus = function (isFlash, isRouge, isFlashAutoRenewed) {
    let buttonText;
    let enrolled = false;
    let showError = false;

    if (isFlash) {
        // TODO: Determine with product team how to unify mobile and desktop
        if (Sephora.isMobile()) {
            buttonText = buttonCTA.ENROLLED;
        } else {
            buttonText = buttonCTA.ENROLL_NOW;
            if (!isFlashAutoRenewed) {
                buttonText = buttonCTA.ADD_TO_BASKET;
                showError = true;
            }
        }
        enrolled = true;
    } else if (isRouge) {
        buttonText = buttonCTA.ENROLL_NOW;
        showError = true;
    } else {
        buttonText = buttonCTA.ADD_TO_BASKET;
        showError = true;
    }

    this.setState({
        buttonText: buttonText,
        enrolled: enrolled,
        showError: showError
    });
};

Flash.prototype.handleAcceptTerms = function (e) {
    let isTermsChecked = e.target.checked;

    this.setState({
        acceptTerms: isTermsChecked,
        showError: !this.state.showError
    });

    //Analytics
    const acceptActionValue = 'flash ppage:accept terms';
    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
        data: {
            linkName: acceptActionValue,
            eventStrings: [anaConsts.Event.EVENT_71],
            actionInfo: acceptActionValue
        }
    });
};

Flash.prototype.showFlashTermsModal = function (e) {
    e.preventDefault();
    const FLASH_TERMS_MEDIA_ID = 18100038;
    const tcTitle = 'Flash Terms & Conditions';
    const showTermsConditions = require('actions/TermsAndConditionsActions').showModal;
    store.dispatch(showTermsConditions(true, FLASH_TERMS_MEDIA_ID, tcTitle));
};

Flash.prototype.isRestrictedEnrollmentType = function () {
    let restricted = Sephora.isMobile() ? this.state.enrolled : userUtils.isFlashAutoRenewed();
    return restricted;
};

Flash.prototype.enrollToFlash = function () {
    let data = {
        'fragmentForUpdate': 'flash',
        'isAcceptTerms': true
    };

    //Analytics
    const enrollActionValue = `${anaConsts.PAGE_TYPES.PRODUCT}:flash rouge enroll`;
    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
        data: {
            linkName: enrollActionValue,
            eventStrings: [Sephora.analytics.constants.Event.EVENT_71, 'event128'],
            actionInfo: enrollActionValue
        }
    });
    
    store.dispatch(actions.showInterstice(true));
    return profileApi.updateProfile(data).then(resp => {
        store.dispatch(actions.showInterstice(false));
        let confirmMessage = 'Congratulations, you\'ve successfully enrolled in our ' +
            'free FLASH shipping program! Anticipate your confirmation ' +
            'email within 24 hours.';
        this.setState({
            enrolled: true,
            showMessage: true,
            message: confirmMessage
        });
    }).catch(e => {
        store.dispatch(actions.showInterstice(false));
        console.log(e);
    });
};


// Added by sephora-jsx-loader.js
module.exports = Flash.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/CallToActions/Type/Flash/Flash.c.js