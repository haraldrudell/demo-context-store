// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var ColorIQ = function () {};

// Added by sephora-jsx-loader.js
ColorIQ.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const watch = require('redux-watch');
const Debounce = require('utils/Debounce').debounce;
const DEBOUNCE_KEYUP = 100;
const updateBiAccount = require('actions/ProfileActions').updateBiAccount;
const anaConsts = require('analytics/constants');
const processEvent = require('analytics/processEvent');

ColorIQ.prototype.addColorIQ = function (e) {
    e.preventDefault();

    //check to see if user already has shadecode in profile
    let checkCurrentSkinTones;
    if (this.props.biAccount.skinTones) {
        checkCurrentSkinTones = this.props.biAccount.skinTones.filter(
            tone => tone.shadeCode === this.colorIqInput.getValue().toUpperCase());
    }

    if (!checkCurrentSkinTones || !checkCurrentSkinTones.length) {
        let colorIQ = this.colorIqInput.getValue();
        let data = {
            biAccount: {
                skinToneShadeCodes: [colorIQ]
            }
        };
        store.dispatch(updateBiAccount(data, null, this.errorHandler));

        // Analytics
        let eventString = [anaConsts.Event.EVENT_71, anaConsts.Event.EVENT_86];
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                linkName: 'D=c55',
                eventStrings: eventString,
                actionInfo: 'save coloriq to profile',
                colorIQ: colorIQ
            }
        });
    }
};

ColorIQ.prototype.errorHandler = function () {
    this.setState({
        errorMessage: true
    });
};

ColorIQ.prototype.keyUp = function () {
    let colorIQNumber = this.colorIqInput.getValue();
    this.setState({
        errorMessage: null,
        showApplyButton: colorIQNumber.length > 0
    });
};

ColorIQ.prototype.handleKeyUp = Debounce(ColorIQ.prototype.keyUp, DEBOUNCE_KEYUP);


// Added by sephora-jsx-loader.js
module.exports = ColorIQ.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/EditMyProfile/Content/ColorIQ/ColorIQ.c.js