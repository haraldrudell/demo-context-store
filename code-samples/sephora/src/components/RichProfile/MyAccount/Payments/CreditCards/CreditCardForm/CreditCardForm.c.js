// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var CreditCardForm = function () {};

// Added by sephora-jsx-loader.js
CreditCardForm.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const actions = require('actions/Actions');
const formValidator = require('utils/FormValidator');
const profileApi = require('services/api/profile');

CreditCardForm.prototype.ctrlr = function () {
    let isEditMode = this.props.isEditMode;
    let card = this.props.creditCard;
    this.setState({
        expMonth: isEditMode ? card.expirationMonth : null,
        expYear: isEditMode ? card.expirationYear : null,
        isDefault: isEditMode ? card.isDefault : false,
        expYearInvalid: isEditMode && card.isExpired
    });
};

CreditCardForm.prototype.handleCardTypeSelect = function (e) {
    this.setState({ cardType: e.target.value });
};

CreditCardForm.prototype.handleExpMonthSelect = function (e) {
    this.setState({ expMonth: e.target.value });
};

CreditCardForm.prototype.handleExpYearSelect = function (e) {
    let creditCard = this.props.creditCard;
    let isExpYearInvalid = this.props.isEditMode && creditCard.isExpired &&
        e.target.value === this.props.creditCard.expirationYear;

    this.setState({
        expYear: e.target.value,
        expYearInvalid: isExpYearInvalid
    });
};

CreditCardForm.prototype.handleIsDefault = function (e) {
    this.setState({ isDefault: e.target.checked });
};

CreditCardForm.prototype.handleDeleteCardClick = function (e) {
    e.preventDefault();

    //variable declaration here for clarity
    let title = 'Delete credit card';
    let message = 'Are you sure you would like to permanently delete your credit card?';
    let confirmButtonText = 'Yes';
    let callback = this.deleteCreditCard;
    let hasCancelButton = true;
    let cancelButtonText = 'No';

    store.dispatch(
        actions.showInfoModal(
            true,
            title,
            message,
            confirmButtonText,
            callback,
            hasCancelButton,
            cancelButtonText
        )
    );
};

CreditCardForm.prototype.deleteCreditCard = function () {
    if (this.props.creditCard.isDefault && this.props.allCreditCards[1]) {
        //need to set next card in list to default before deleting.
        profileApi.setDefaultCreditCardOnProfile(this.props.allCreditCards[1].creditCardId).
            then(() => {
                profileApi.removeCreditCardFromProfile(
                    this.props.userProfileId,
                    this.props.creditCard.creditCardId).then(() => {
                        this.props.updateCardsCallback();
                    }
                );
            });
    } else {
        profileApi.removeCreditCardFromProfile(
            this.props.userProfileId,
            this.props.creditCard.creditCardId).then(() => {
                this.props.updateCardsCallback();
            }
        );
    }
};

CreditCardForm.prototype.validateCreditCardForm = function (e) {
    e.preventDefault();

    // Clear out previous errors
    let hasErrors = false;
    this.setState({
        errorMessages: null,
        emptyCardType: false,
        emptyMonth: false,
        emptyYear: false
    });

    let isAddressValid = this.addressForm.validateForm();

    let errors = !this.props.isEditMode ? formValidator.getErrors([this.cardNumberInput]) : {};

    if (errors.fields && errors.fields.length) {
        hasErrors = true;
    }

    let isJCPCard = this.state.cardType === this.cardTypes.JCPENNEY.name ||
        this.props.isEditMode && this.props.creditCard.cardType === this.cardTypes.JCPENNEY.name;

    // Check if card type is blank if not in edit mode, also check if expiration month and year
    // are blank for all cards except JCPenney
    let emptyCardTypeOrExpiration = (!this.state.cardType && !this.props.isEditMode) ||
    (!isJCPCard && (!this.state.expMonth || !this.state.expYear));

    if (emptyCardTypeOrExpiration) {
        hasErrors = true;
        this.setState({
            emptyCardType: !this.state.cardType,
            emptyMonth: !this.state.expMonth,
            emptyYear: !this.state.expYear
        });
    }

    if (isAddressValid && !hasErrors) {
        this.createOrUpdateCreditCard();
    }
};

CreditCardForm.prototype.createOrUpdateCreditCard = function () {
    let addressData = this.addressForm.getData().address;

    let creditCardInfo = {
        isMarkAsDefault: this.state.isDefault,
        creditCard: {
            firstName: addressData.firstName,
            lastName: addressData.lastName,
            address: {
                address1: addressData.address1,
                address2: addressData.address2,
                city: addressData.city,
                state: addressData.state,
                postalCode: addressData.postalCode,
                country: addressData.country,
                phone: addressData.phone
            }
        }
    };

    if (this.state.cardType !== this.cardTypes.JCPENNEY.name) {
        creditCardInfo.creditCard.expirationMonth = this.state.expMonth;
        creditCardInfo.creditCard.expirationYear = this.state.expYear;
    }

    if (this.props.isEditMode) {
        creditCardInfo.creditCard.creditCardId = this.props.creditCard.creditCardId;
    } else {
        creditCardInfo.creditCard.cardType = this.state.cardType;
        creditCardInfo.creditCard.cardNumber = this.cardNumberInput.getValue();
    }

    let method = creditCardInfo &&
            creditCardInfo.creditCard && creditCardInfo.creditCard.creditCardId ?
                profileApi.updateCreditCardOnProfile : profileApi.addCreditCardToProfile;

    method(creditCardInfo).then(() => {
        this.props.updateCardsCallback();
    }).catch((errorData) => {
        this.setState({
            errorMessages: errorData.errorMessages,
            expMonthInvalid: errorData.errors.expirationMonth,
            creditCardNumInvalid: errorData.errors.creditCardNumber
        });
        this.addressForm.handleResponseError(errorData);
    });
};


// Added by sephora-jsx-loader.js
module.exports = CreditCardForm.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/Payments/CreditCards/CreditCardForm/CreditCardForm.c.js