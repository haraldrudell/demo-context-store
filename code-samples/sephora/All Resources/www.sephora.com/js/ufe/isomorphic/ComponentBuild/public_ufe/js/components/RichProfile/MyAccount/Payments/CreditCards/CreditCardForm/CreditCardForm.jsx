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
    Sephora.Util.InflatorComps.Comps['CreditCardForm'] = function CreditCardForm(){
        return CreditCardFormClass;
    }
}
const { forms, space } = require('style');
const { Box, Flex, Grid, Text } = require('components/display');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const ButtonOutline = require('components/Button/ButtonOutline');
const Link = require('components/Link/Link');
const AddressForm = require('components/Addresses/AddressForm/AddressForm');
const TextInput = require('components/Inputs/TextInput/TextInput');
const FormValidator = require('utils/FormValidator');
const Select = require('components/Inputs/Select/Select');
const Checkbox = require('components/Inputs/Checkbox/Checkbox');
const Label = require('components/Inputs/Label/Label');
const Date = require('utils/Date');

const CreditCardForm = function () {
    this.state = {
        errorMessages: null,
        cardType: null,
        expMonth: null,
        expYear: null,
        billingCountries: null,
        defaultCountryCode: null,
        isDefault: false
    };
    this.cardNumberInput = null;
    this.cardTypes = {
        VISA: {
            name: 'visa',
            displayName: 'VISA'
        },
        MASTERCARD: {
            name: 'masterCard',
            displayName: 'MasterCard'
        },
        DISCOVER: {
            name: 'discover',
            displayName: 'Discover'
        },
        AMERICAN_EXPRESS: {
            name: 'americanExpress',
            displayName: 'American Express'
        },
        JCPENNEY: {
            name: 'JCPenney',
            displayName: 'JCPenney'
        }
    };
};

CreditCardForm.prototype.render = function () {
    const {
        isEditMode,
        creditCard,
        userProfileId,
        cancelAddOrEditCardCallback
    } = this.props;

    let isJCPCard = isEditMode ? creditCard.cardType === this.cardTypes.JCPENNEY.name :
        this.state.cardType === this.cardTypes.JCPENNEY.name;

    let expirationYear = this.state.expYear ? this.state.expYear.toString() : '';

    return (
        <Box
            is='form'
            action=''
            width={Sephora.isDesktop() ? '75%' : null}>
            <Text
                is='h2'
                fontSize='h3'
                fontWeight={700}
                marginBottom={space[5]}>
                {this.props.isEditMode ? 'Edit' : 'Add'} Credit Card
            </Text>
            {this.state.errorMessages ?
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
            {isEditMode ?
                <Text
                    is='p'
                    marginBottom={space[4]}>
                    <Label>Card type</Label>
                    <Flex
                        alignItems='center'
                        fontSize={forms.FONT_SIZE}
                        height={forms.HEIGHT}>
                        {creditCard.cardType}
                    </Flex>
                </Text>
                :
                <Select
                    label='Card type'
                    name='cardType'
                    value={this.state.cardType}
                    required={true}
                    invalid={this.state.cardTypeInvalid || this.state.emptyCardType}
                    onChange={this.handleCardTypeSelect}
                    onKeyDown={this.handleKeyDown}
                    message={this.state.emptyCardType ?
                        'Card type required.'
                    : null}>
                    <option value=''>Select a card</option>
                    {Object.keys(this.cardTypes).map((cardType, index) =>
                            <option
                                key={index}
                                value={this.cardTypes[cardType].name}>
                                {this.cardTypes[cardType].displayName}
                            </option>
                        )
                    }
                </Select>
            }
            {isEditMode ?
                <Text
                    is='p'
                    marginBottom={space[4]}>
                    <Label>Card number</Label>
                    <Flex
                        alignItems='center'
                        fontSize={forms.FONT_SIZE}
                        height={forms.HEIGHT}>
                        {creditCard.cardNumber}
                    </Flex>
                </Text>
                :
                <TextInput
                    name='cardNumber'
                    label='Card number'
                    required={true}
                    placeholder='Required'
                    type='tel'
                    maxLength={FormValidator.FIELD_LENGTHS.creditCard}
                    value={this.cardNumberInput && this.cardNumberInput.getValue()}
                    invalid={this.state.creditCardNumInvalid}
                    ref={comp => this.cardNumberInput = comp}
                    validate={
                        (cardNumber) => {
                            if (FormValidator.isEmpty(cardNumber)) {
                                return 'Credit card number required.';
                            }

                            return null;
                        }
                    } />
            }
            {!isJCPCard &&
                <Grid gutter={space[3]}>
                    <Grid.Cell width={ 1 / 2 }>
                        <Select
                            label='Expiration month'
                            name='expMonth'
                            value={this.state.expMonth}
                            required={true}
                            onChange={this.handleExpMonthSelect}
                            onKeyDown={this.handleKeyDown}
                            invalid={this.state.expMonthInvalid || this.state.emptyMonth}
                            message={this.state.emptyMonth ?
                                'Expiration month required.'
                            : null}>
                            <option value=''>Month</option>
                            {
                                Date.getNumericMonthArray().map((month, index) =>
                                     <option key={index} value={index + 1}>
                                        {month}
                                     </option>
                                )
                            }
                        </Select>
                    </Grid.Cell>
                    <Grid.Cell width={1 / 2}>
                        <Select
                            label='Expiration year'
                            name='expYear'
                            value={expirationYear}
                            required={true}
                            onKeyDown={this.handleKeyDown}
                            onChange={this.handleExpYearSelect}
                            invalid={this.state.expYearInvalid || this.state.emptyYear}
                            message={this.state.emptyYear ?
                                'Expiration year required.'
                            : null}>
                            <option value=''>Year</option>
                            { creditCard && creditCard.isExpired &&
                                <option value={creditCard.expirationYear}>
                                    {creditCard.expirationYear}
                                </option>
                            }
                            {
                                Date.getCreditCardExpYears().map((year, index) => {
                                    let selected = year === expirationYear ? 'selected': false;
                                    return <option
                                                key={index}
                                                selected={selected}
                                                value={year}>
                                                    {year}
                                            </option>;
                                })
                            }
                        </Select>
                    </Grid.Cell>
                </Grid>
            }
            <AddressForm
                isBillingAddress
                isEditMode={this.props.isEditMode}
                address={this.props.isEditMode ? this.props.creditCard.address : null}
                countryList={this.props.countryList}
                country={this.props.country}
                isInternational={this.props.isInternational}
                ref={comp => this.addressForm = comp}
            />
            <Checkbox
                checked={this.state.isDefault}
                onChange={this.handleIsDefault}
                name='is_default'>
                Set as default credit card
            </Checkbox>
            {this.props.isEditMode &&
                <Link
                    primary={true}
                    paddingY={space[2]}
                    marginTop={space[3]}
                    onClick={this.handleDeleteCardClick}>
                    Delete credit card
                </Link>
            }
            <Grid
                gutter={space[3]}
                marginTop={space[3]}>
                <Grid.Cell width={1 / 2}>
                    <ButtonOutline
                        block={true}
                        onClick={cancelAddOrEditCardCallback}>
                        Cancel
                    </ButtonOutline>
                </Grid.Cell>
                <Grid.Cell width={1 / 2}>
                    <ButtonPrimary
                        block={true}
                        type='submit'
                        onClick={this.validateCreditCardForm}>
                        {this.props.isEditMode ? 'Update' : 'Save'}
                    </ButtonPrimary>
                </Grid.Cell>
            </Grid>
        </Box>
    );
};


// Added by sephora-jsx-loader.js
CreditCardForm.prototype.path = 'RichProfile/MyAccount/Payments/CreditCards/CreditCardForm';
// Added by sephora-jsx-loader.js
Object.assign(CreditCardForm.prototype, require('./CreditCardForm.c.js'));
var originalDidMount = CreditCardForm.prototype.componentDidMount;
CreditCardForm.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: CreditCardForm');
if (originalDidMount) originalDidMount.apply(this);
if (CreditCardForm.prototype.ctrlr) CreditCardForm.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: CreditCardForm');
// Added by sephora-jsx-loader.js
CreditCardForm.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
CreditCardForm.prototype.class = 'CreditCardForm';
// Added by sephora-jsx-loader.js
CreditCardForm.prototype.getInitialState = function() {
    CreditCardForm.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
CreditCardForm.prototype.render = wrapComponentRender(CreditCardForm.prototype.render);
// Added by sephora-jsx-loader.js
var CreditCardFormClass = React.createClass(CreditCardForm.prototype);
// Added by sephora-jsx-loader.js
CreditCardFormClass.prototype.classRef = CreditCardFormClass;
// Added by sephora-jsx-loader.js
Object.assign(CreditCardFormClass, CreditCardForm);
// Added by sephora-jsx-loader.js
module.exports = CreditCardFormClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/Payments/CreditCards/CreditCardForm/CreditCardForm.jsx