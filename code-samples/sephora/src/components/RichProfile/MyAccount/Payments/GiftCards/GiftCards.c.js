// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var GiftCards = function () {};

// Added by sephora-jsx-loader.js
GiftCards.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const utilityApi = require('services/api/utility');
const formValidator = require('utils/FormValidator');

GiftCards.prototype.ctrlr = function () { };

GiftCards.prototype.validate = function (e) {
    e.preventDefault();

    // Clear errors previous and gift card balance
    this.setState({
        error: null,
        gcBalance: null
    });

    let hasErrors = false;
    let errors = formValidator.getErrors([this.gcCardNumberInput, this.gcPinNumberInput]);

    if (errors.fields && errors.fields.length) {
        hasErrors = true;
        return;
    }

    if (!hasErrors) {
        this.checkBalance();
    }
};

GiftCards.prototype.checkBalance = function () {
    let giftCardInfo = {
        gcNumber: this.gcCardNumberInput.getValue(),
        gcPin: this.gcPinNumberInput.getValue()
    };

    utilityApi.getGiftCardBalance(giftCardInfo).then(response => {
        this.setState({ gcBalance: response.giftCardBalance });
    }).catch(reponseError => {
        this.setState({ error: reponseError.errorMessages[0] });
    });
};


// Added by sephora-jsx-loader.js
module.exports = GiftCards.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/Payments/GiftCards/GiftCards.c.js