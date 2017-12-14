// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var AcctAddressForm = function () {};

// Added by sephora-jsx-loader.js
AcctAddressForm.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const formValidator = require('utils/FormValidator');
const AddressActions = require('actions/AddressActions');
const showInfoModal = require('Actions').showInfoModal;
const store = require('Store');

AcctAddressForm.prototype.ctrlr = function () {
    if (this.props.isEditMode && this.props.address.isDefault) {
        this.setState({ isDefault: true });
    }

    AddressActions.getShippingCountriesList((countryList) => {
        this.setState({
            countryList: countryList
        });
    });
};

AcctAddressForm.prototype.handleIsDefault = function (e) {
    this.setState({ isDefault: e.target.checked });
};

AcctAddressForm.prototype.showDeleteAddressModal = function (e) {
    e.preventDefault();

    //variable declaration here for clarity
    let title = 'Delete address';
    let message = 'Are you sure you would like to permanently delete your address?';
    let confirmButtonText = 'Yes';
    let callback = this.deleteAddressModalCallback;
    let hasCancelButton = true;
    let cancelButtonText = 'No';

    store.dispatch(
        showInfoModal(
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

AcctAddressForm.prototype.deleteAddressModalCallback = function () {
    AddressActions.deleteAddress(this.props.address.addressId, this.props.profileId,
        this.props.deleteSavedAddressCallback, this.handleResponseError);
};

AcctAddressForm.prototype.validateAddressForm = function (e) {
    e.preventDefault();
    this.setState({
        errorMessages: ''
    });
    let isValid = this.addressForm.validateForm();

    if (isValid) {
        this.createAddress();
    }
};

AcctAddressForm.prototype.handleResponseError = function (errorData) {
    this.setState({
        errorMessages: errorData.errorMessages
    });
    this.addressForm.handleResponseError(errorData);
};

AcctAddressForm.prototype.createAddress = function () {
    let newAddressData = this.addressForm.getData();
    let optionParams = Object.assign({}, newAddressData, {
        isDefaultAddress: this.state.isDefault
    });

    if (this.props.isEditMode) {
        AddressActions.updateAddress(
            optionParams, this.props.updateAddressCallback, this.handleResponseError);
    } else {
        AddressActions.addNewAddress(
            optionParams, this.props.addAddressCallback, this.handleResponseError);
    }
};


// Added by sephora-jsx-loader.js
module.exports = AcctAddressForm.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/Addresses/AcctAddressForm/AcctAddressForm.c.js