const profileApi = require('services/api/profile');
const utilityApi = require('services/api/utility');


module.exports = {
    getSavedAddresses: function (profileId, successCallback) {
        profileApi.getShippingAddresses(profileId).
            then(data => successCallback(data.addressList));
    },

    setDefaultAddress: function (addressId, profileId, successCallback) {
        profileApi.setDefaultShippingAddress(addressId).
            then(() => profileApi.getShippingAddresses(profileId)).
            then(data => successCallback(data.addressList));
    },

    deleteAddress: function (addressId, profileId, successCallback, failureCallback) {
        profileApi.removeShippingAddress(profileId, addressId).
            then(successCallback).catch(failureCallback);
    },

    addNewAddress: function (addressData, successCallback, failureCallback) {
        profileApi.addShippingAddress(addressData).
            then(successCallback).
            catch(failureCallback);
    },

    updateAddress: function (addressData, successCallback, failureCallback) {
        profileApi.updateShippingAddress(addressData).
            then(successCallback).catch(failureCallback);
    },

    getStateList: function (countryCode, successCallback) {
        utilityApi.getStateList(countryCode).then(successCallback);
    },

    getShippingCountriesList: function (successCallback) {
        utilityApi.getShippingCountryList().then(successCallback);
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/actions/AddressActions.js