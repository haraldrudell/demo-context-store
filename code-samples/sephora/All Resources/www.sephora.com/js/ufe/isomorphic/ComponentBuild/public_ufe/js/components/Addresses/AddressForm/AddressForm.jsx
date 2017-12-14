// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
if (!Sephora.isRootRender) {
    Sephora.Util.InflatorComps.Comps['AddressForm'] = function AddressForm(){
        return AddressFormClass;
    }
}
const { space } = require('style');
const ButtonOutline = require('components/Button/ButtonOutline');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const TextInput = require('components/Inputs/TextInput/TextInput');
const FormValidator = require('utils/FormValidator');
const Select = require('components/Inputs/Select/Select');
const Checkbox = require('components/Inputs/Checkbox/Checkbox');
const Text = require('components/Text/Text');
const COUNTRIES = require('utils/LanguageLocale.js').COUNTRIES;

const AddressForm = function () {
    this.state = {
        selectedState: '',
        country: this.props.country,
        stateList: [],
        isDefault: false,
        zipCodeInvalid: false,
        cityInvalid: false,
        stateInvalid: false,
        countryInvalid: false,
        isInternational: this.props.isInternational,
        errorMessages: ''
    };
};

AddressForm.prototype.render = function () {
    const {
            isEditMode,
            address,
            isFirstNameFieldDisabled,
            isLastNameFieldDisabled,
            isPhoneFieldHidden,
            isBillingAddress,
            ...props
} = this.props;

    //TODO: Update this when an improvement story comes on later sprint
    let countryList = this.props.countryList;

    if (Sephora.isMobile() && !isBillingAddress) {
        let mobileCountryList = [
            {
                countryCode: 'CA',
                countryLongName: 'Canada'
            },
            {
                countryCode: 'US',
                countryLongName: 'United States'
            }
        ];
        countryList = mobileCountryList;
    }

    return (
        <form action=''>
            {this.state.errorMessages.length ?
                this.state.errorMessages.map(errorMessage =>
                    <Text
                        is='p'
                        color='error'
                        fontSize='h5'
                        marginBottom={space[3]}>
                        {errorMessage}
                    </Text>
                )
                : null
            }
            <TextInput
                name='firstName'
                label='First name'
                required={true}
                maxLength={FormValidator.FIELD_LENGTHS.name}
                placeholder='Required'
                disabled={isFirstNameFieldDisabled}
                value={isEditMode ? address.firstName :
                    this.firstNameInput && this.firstNameInput.getValue()}
                ref={comp => this.firstNameInput = comp}
                validate={
                    (firstName) => {
                        if (FormValidator.isEmpty(firstName)) {
                            return 'First name required.';
                        }

                        return null;
                    }
                } />
            <TextInput
                name='lastName'
                label='Last name'
                required={true}
                maxLength={FormValidator.FIELD_LENGTHS.name}
                placeholder='Required'
                disabled={isLastNameFieldDisabled}
                value={isEditMode ? address.lastName :
                    this.lastNameInput && this.lastNameInput.getValue()}
                ref={comp => this.lastNameInput = comp}
                validate={
                    (lastName) => {
                        if (FormValidator.isEmpty(lastName)) {
                            return 'Last name required.';
                        }

                        return null;
                    }
                } />
            <TextInput
                name='address1'
                label='Address line 1'
                required={true}
                maxLength={FormValidator.FIELD_LENGTHS.address}
                placeholder='Required'
                value={isEditMode ? address.address1 :
                    this.addressInput && this.addressInput.getValue()}
                ref={comp => this.addressInput = comp}
                validate={
                    (addressValidation) => {
                        if (FormValidator.isEmpty(addressValidation)) {
                            return 'Address required.';
                        }

                        return null;
                    }
                } />
            <TextInput
                name='addressTwo'
                label='Address line 2'
                maxLength={FormValidator.FIELD_LENGTHS.address}
                placeholder='Optional'
                value={!this.addressTwoInput && isEditMode ? address.address2 :
                    this.addressTwoInput && this.addressTwoInput.getValue()}
                ref={comp => this.addressTwoInput = comp} />
            <TextInput
                name='postalCode'
                type={this.state.isInternational ? 'text' : 'tel'}
                label={this.state.isInternational ? 'Postal code' : 'ZIP code'}
                required={true}
                maxLength={this.state.isInternational ? null : FormValidator.FIELD_LENGTHS.zipCode}
                placeholder='Required'
                value={isEditMode ? address.postalCode :
                    this.zipCodeInput && this.zipCodeInput.getValue()}
                invalid={this.state.zipCodeInvalid}
                ref={comp => this.zipCodeInput = comp}
                validate={
                    (zipCode) => {
                        if (FormValidator.isEmpty(zipCode)) {
                            // jscs:disable maximumLineLength
                            return 'Zip or postal code required.';
                        }

                        return null;
                    }
                } />
            {this.state.zipCodeInvalid &&
                <Text
                    is='p'
                    color='error'
                    fontSize='h5'>
                    {this.state.zipCodeInvalid}
                </Text>
            }
            <TextInput
                name='city'
                label='City'
                required={true}
                maxLength={FormValidator.FIELD_LENGTHS.city}
                invalid={this.state.cityInvalid}
                placeholder='Required'
                value={isEditMode ? address.city :
                    this.cityInput && this.cityInput.getValue()}
                ref={comp => this.cityInput = comp}
                validate={
                    (city) => {
                        if (FormValidator.isEmpty(city)) {
                            return 'City required.';
                        }

                        return null;
                    }
                } />
            {this.state.cityInvalid &&
                <Text
                    is='p'
                    color='error'
                    fontSize='h5'>
                    {this.state.cityInvalid}
                </Text>
            }

            {this.state.isInternational && this.state.country !== COUNTRIES.CA ?
                <TextInput
                    name='region'
                    label='Region'
                    placeholder='Optional'
                    value={this.state.selectedState}
                    onKeyDown={this.handleKeyDown}
                    ref={comp => this.regionInput = comp} /> :
                <Select
                    label={this.state.country === COUNTRIES.CA ? 'Province' : 'State/region'}
                    name='state'
                    value={this.state.selectedState}
                    required={true}
                    invalid={this.state.stateInvalid || this.state.emptyState}
                    onChange={this.handleStateSelect}
                    onKeyDown={this.handleKeyDown}
                    message={this.state.emptyState ?
                        this.state.country === COUNTRIES.CA ?
                            'Province required.' :
                            'State/region required.'
                    : null}>
                    {this.state.stateList && this.state.stateList.length &&
                        this.state.stateList.map((state, index) =>
                            <option
                                hidden={index === 0}
                                key={index}
                                value={state.name}>
                                {state.description}
                            </option>
                        )
                    }
                </Select>
            }
            <Select
                name='country'
                label='Country'
                value={this.state.country}
                invalid={this.state.countryInvalid}
                onChange={this.handleCountrySelect}
                onKeyDown={this.handleKeyDown}>
                {countryList && countryList.length &&
                    countryList.map((country, index) =>
                        <option key={index}
                            value={country.countryCode}>
                            {country.countryLongName}
                        </option>
                    )
                }
            </Select>
            {!isPhoneFieldHidden &&
                <TextInput
                    name='phoneNumber'
                    label='Phone'
                    type='tel'
                    maxLength={
                        this.state.isInternational && this.state.country !== COUNTRIES.CA ?
                            FormValidator.FIELD_LENGTHS.internationalPhone :
                            FormValidator.FIELD_LENGTHS.phone
                    }
                    required={true}
                    invalid={this.state.phoneInvalid}
                    placeholder='Required'
                    value={isEditMode ? address.phone :
                        this.phoneNumberInput && this.phoneNumberInput.getValue()}
                    ref={comp => this.phoneNumberInput = comp}
                    onKeyDown={!Sephora.isMobile() && FormValidator.inputAcceptOnlyNumbers}
                    validate={
                        (phoneNumber) => {
                            if (FormValidator.isEmpty(phoneNumber) ||
                                (!this.state.isInternational && phoneNumber.length !== 10)) {
                                return 'Phone number required.';
                            }
                            return null;
                        }
                    } />
            }
        </form>
    );
};


// Added by sephora-jsx-loader.js
AddressForm.prototype.path = 'Addresses/AddressForm';
// Added by sephora-jsx-loader.js
Object.assign(AddressForm.prototype, require('./AddressForm.c.js'));
var originalDidMount = AddressForm.prototype.componentDidMount;
AddressForm.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: AddressForm');
if (originalDidMount) originalDidMount.apply(this);
if (AddressForm.prototype.ctrlr) AddressForm.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: AddressForm');
// Added by sephora-jsx-loader.js
AddressForm.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
AddressForm.prototype.class = 'AddressForm';
// Added by sephora-jsx-loader.js
AddressForm.prototype.getInitialState = function() {
    AddressForm.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
AddressForm.prototype.render = wrapComponentRender(AddressForm.prototype.render);
// Added by sephora-jsx-loader.js
var AddressFormClass = React.createClass(AddressForm.prototype);
// Added by sephora-jsx-loader.js
AddressFormClass.prototype.classRef = AddressFormClass;
// Added by sephora-jsx-loader.js
Object.assign(AddressFormClass, AddressForm);
// Added by sephora-jsx-loader.js
module.exports = AddressFormClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Addresses/AddressForm/AddressForm.jsx