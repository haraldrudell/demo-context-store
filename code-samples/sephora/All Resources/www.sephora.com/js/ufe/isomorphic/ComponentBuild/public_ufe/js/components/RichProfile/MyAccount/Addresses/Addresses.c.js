// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Addresses = function () {};

// Added by sephora-jsx-loader.js
Addresses.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const watch = require('redux-watch');
const AddressActions = require('actions/AddressActions');
const showInfoModal = require('Actions').showInfoModal;
const Authentication = require('utils/Authentication');
const getUser = require('utils/User').getUser;
const { ensureUserIsSignedIn } = require('utils/decorators');

Addresses.prototype.ctrlr = function (user) {
    this.profileId = user.profileId;
    AddressActions.getSavedAddresses(this.profileId, this.setSavedAddresses);
};

Addresses.prototype.setSavedAddresses = function (addresses) {
    this.setState({ addresses: addresses });
};

Addresses.prototype.chooseDefaultAddress = function (addressId) {
    AddressActions.setDefaultAddress(addressId, this.profileId, this.setSavedAddresses);
};

Addresses.prototype.deleteSavedAddressCallback = function () {
    this.setState({
        isEditMode: false,
        editAddressId: ''
    });
    AddressActions.getSavedAddresses(this.profileId, this.setSavedAddresses);
};

Addresses.prototype.showAddAddressForm = function () {
    if (this.state.addresses.length < 10) {
        this.setState({
            isAddAddress: !this.state.isAddAddress,
            isEditMode: false
        });
    } else {
        let title = 'Delete Address';
        let message = 'You can have up to 10 addresses. Please delete one and try to add again';
        let buttonText = 'Continue';
        store.dispatch(showInfoModal(true, title, message, buttonText));
    }
};

Addresses.prototype.showEditAddress = function (addressId) {
    this.setState({
        isEditMode: true,
        isAddAddress: false,
        editAddressId: addressId
    });
};

Addresses.prototype.addAddressCallback = function () {
    this.setState({ isAddAddress: false });
    AddressActions.getSavedAddresses(this.profileId, this.setSavedAddresses);
};

Addresses.prototype.updateAddressCallback = function () {
    this.setState({
        isEditMode: false,
        editAddressId: ''
    });
    AddressActions.getSavedAddresses(this.profileId, this.setSavedAddresses);
};

Addresses.prototype.cancelAddAddressCallback = function () {
    this.setState({ isAddAddress: false });
};

Addresses.prototype.cancelEditAddressCallback = function () {
    this.setState({
        isEditMode: false,
        editAddressId: ''
    });
};

Addresses = ensureUserIsSignedIn(Addresses);


// Added by sephora-jsx-loader.js
module.exports = Addresses.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/Addresses/Addresses.c.js