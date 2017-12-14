// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var CreditCards = function () {};

// Added by sephora-jsx-loader.js
CreditCards.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const { requireSignedInUser } = require('utils/decorators');
const utilityApi = require('services/api/utility');
const profileApi = require('services/api/profile');

CreditCards.prototype.ctrlr = function (user) {
    this.userProfileId = user.profileId;

    utilityApi.getCountryList().then(billingCountries => {
        this.billingCountries = billingCountries;
    });
};

CreditCards.prototype.showAddCardForm = function () {
    this.setState({
        isAddCard: true,
        isEditMode: false
    });
};

CreditCards.prototype.cancelAddOrEditCardCallback = function () {
    this.setState({
        isAddCard: false,
        isEditMode: false
    });
};

CreditCards.prototype.updateCardsCallback = function () {
    profileApi.getCreditCardsFromProfile(this.userProfileId).then(payments => {
        this.setState({
            creditCards: payments.creditCards,
            isAddCard: false,
            isEditMode: false
        });
    });
};

//takes full card string given from api and shortens it to just last 4 digits
CreditCards.prototype.shortenCardNumber = function (cardNumber) {
    return cardNumber.substr(cardNumber.length - 4);
};

CreditCards.prototype.chooseDefaultCreditCard = function (creditCardId) {
    profileApi.setDefaultCreditCardOnProfile(creditCardId).then(() => {
        profileApi.getCreditCardsFromProfile(this.userProfileId).then(payments => {
            this.setState({ creditCards: payments.creditCards });
        });
    });
};

CreditCards = requireSignedInUser(CreditCards);


// Added by sephora-jsx-loader.js
module.exports = CreditCards.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/Payments/CreditCards/CreditCards.c.js