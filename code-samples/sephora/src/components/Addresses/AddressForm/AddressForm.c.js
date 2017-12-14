// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var AddressForm = function () {};

// Added by sephora-jsx-loader.js
AddressForm.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const formValidator = require('utils/FormValidator');
const AddressActions = require('actions/AddressActions');
const COUNTRIES = require('utils/LanguageLocale.js').COUNTRIES;

AddressForm.prototype.ctrlr = function () {
    let country = this.props.country;

    // Flags that determine if the form has to be revalidated. One such case is when the
    // user changes countries and more inputs are added
    this.revalidateForm = false;
    this.hasErrors = false;
    (country === COUNTRIES.CA || country === COUNTRIES.US) &&
        AddressActions.getStateList(
            country,
            (states)=> this.setStateList(states, country)
        );

};

// Added validation after state is changed. This is to ensure validation is run again
// if the user changes country (as changing the country changes the form by adding / removing)
// inputs, so validation has to be updated
AddressForm.prototype.componentDidUpdate =  function(e) {
    // Only revalidate if needed AND if the form already has errors
    if (this.revalidateForm && this.hasErrors) {
        this.validateForm();

        // Don't keep revalidating, as validation changes the state and that triggers
        // componentDidUpdate, the function would create an endless loop
        this.revalidateForm = false;
    }
};

AddressForm.prototype.setStateList = function (states, country, isInternational) {
    if (this.props.isEditMode) {
        this.setState({
            stateList: states,
            selectedState: this.props.address.state
        });
    } else {
        this.setState({ stateList: states });
    }

    country && this.setState({ country: country });
    isInternational !== undefined && this.setState({ isInternational: isInternational });
};

AddressForm.prototype.handleStateSelect = function (e) {
    this.setState({
        selectedState: e.target.value
    });
};

AddressForm.prototype.resetCountryInfo = function () {
    this.setState({
        selectedState: ''
    });
    this.cityInput.setValue();
    this.zipCodeInput.setValue();
};

AddressForm.prototype.handleCountrySelect = function (e) {
    let country = e.target.value;
    let isInternational = country !== COUNTRIES.US;

    if (country !== this.state.country) {
        this.resetCountryInfo();
    }
    
    if (country === COUNTRIES.CA || country === COUNTRIES.US) {
        AddressActions.getStateList(
            country,
            (states) => this.setStateList(states, country, isInternational)
        );
    } else {
        this.setState({
            isInternational: isInternational,
            country: country
        });
    }

    // As changing country also changes the inputs, turn on the flag to revalidate form.
    // Using a flag instead of validating here in the code, because when the user changes
    // the country, the state is not immediately updated (and we need to check
    // "state.isInternational") and the call to validateForm has to be done AFTER finishing
    // rendering, so the correct inputs can be pushed to the validation array
    this.revalidateForm = true;
};

AddressForm.prototype.handleIsDefault = function (e) {
    this.setState({ isDefault: e.target.checked });
};

AddressForm.prototype.validateForm = function () {
    let fieldsForValidation = [];
    this.hasErrors = false;

    this.setState({ emptyState: false });

    fieldsForValidation.push(
        this.firstNameInput,
        this.lastNameInput,
        this.addressInput,
        this.zipCodeInput,
        this.cityInput
    );

    // Check if the current selected country is other than US or CA
    if (this.state.isInternational) {

        // This call has to be made after finishing rendering, or else this.regionInput would be
        // undefined
        fieldsForValidation.push(this.regionInput);
    }

    if (!this.props.isPhoneFieldHidden) {
        fieldsForValidation.push(this.phoneNumberInput);
    }

    let errors = formValidator.getErrors(fieldsForValidation);
    let isStateEmpty = (this.state.country === COUNTRIES.US ||
                        this.state.country === COUNTRIES.CA) &&
                       (!this.state.selectedState ||
                        !this.state.selectedState.length);

    if (errors.fields.length || isStateEmpty) {
        this.hasErrors = true; 
        this.setState({
            emptyState: isStateEmpty
        });
    }

    // Will return true if valid, false if not
    return !this.hasErrors;
};

AddressForm.prototype.handleResponseError = function (errorData) {
    this.setState({
        cityInvalid: errorData.errors.city,
        stateInvalid: errorData.errors.state,
        zipCodeInvalid: errorData.errors.postalCode
    });
};

AddressForm.prototype.getData = function () {
    let selectedState = this.state.isInternational && this.state.country !== 'CA' ?
        this.regionInput.getValue() : this.state.selectedState;
    let addressData = {
        address: {
            firstName: this.firstNameInput.getValue(),
            lastName: this.lastNameInput.getValue(),
            address1: this.addressInput.getValue(),
            address2: this.addressTwoInput.getValue(),
            postalCode: this.zipCodeInput.getValue(),
            city: this.cityInput.getValue(),
            state: selectedState,
            country: this.state.country
        }
    };

    if (!this.props.isPhoneFieldHidden) {
        addressData.address.phone = this.phoneNumberInput.getValue();
    }

    if (this.props.isEditMode) {
        addressData.address.addressId = this.props.address.addressId;
    }

    return addressData;
};


// Added by sephora-jsx-loader.js
module.exports = AddressForm.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Addresses/AddressForm/AddressForm.c.js