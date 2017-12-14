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
    Sephora.Util.InflatorComps.Comps['AcctAddressForm'] = function AcctAddressForm(){
        return AcctAddressFormClass;
    }
}
const { space } = require('style');
const { Box, Grid, Text } = require('components/display');
const ButtonOutline = require('components/Button/ButtonOutline');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const Checkbox = require('components/Inputs/Checkbox/Checkbox');
const AddressForm = require('components/Addresses/AddressForm/AddressForm');
const Link = require('components/Link/Link');

const AcctAddressForm = function () {
    this.state = {
        isDefault: false,
        errorMessages: '',
        countryList: null
    };
};

AcctAddressForm.prototype.render = function () {
    let cancelCallback = this.props.cancelAddAddressCallback ||
        this.props.cancelEditAddressCallback;
    return (
        <Box
            is='form'
            action=''
            width={Sephora.isDesktop() ? 1 / 2 : null}>
            <Text
                is='h2'
                fontSize='h3'
                fontWeight={700}
                marginBottom={space[5]}>
                {this.props.isEditMode ? 'Edit' : 'Add'} Address
            </Text>
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

            <AddressForm
                isEditMode={this.props.isEditMode}
                address={this.props.address}
                countryList={this.state.countryList}
                country={this.props.country}
                isInternational={this.props.isInternational}
                ref={
                    (comp) => {
                        if (comp !== null) {
                            this.addressForm = comp;
                        }
                    }
                }
            />
            <Checkbox
                checked={this.state.isDefault}
                onChange={this.handleIsDefault}
                name='is_default'>
                Set as default address
            </Checkbox>
            {this.props.isEditMode &&
                <Link
                    primary={true}
                    paddingY={space[2]}
                    marginTop={space[3]}
                    onClick={this.showDeleteAddressModal}>
                    Remove address
                </Link>
            }
            <Grid
                gutter={space[3]}
                marginTop={space[3]}>
                <Grid.Cell width={1 / 2}>
                    <ButtonOutline
                        block={true}
                        onClick={cancelCallback}>
                        Cancel
                    </ButtonOutline>
                </Grid.Cell>
                <Grid.Cell width={1 / 2}>
                    <ButtonPrimary
                        block={true}
                        type='submit'
                        onClick={this.validateAddressForm}>
                        {this.props.isEditMode ? 'Update' : 'Save'}
                    </ButtonPrimary>
                </Grid.Cell>
            </Grid>
        </Box>
    );
};


// Added by sephora-jsx-loader.js
AcctAddressForm.prototype.path = 'RichProfile/MyAccount/Addresses/AcctAddressForm';
// Added by sephora-jsx-loader.js
Object.assign(AcctAddressForm.prototype, require('./AcctAddressForm.c.js'));
var originalDidMount = AcctAddressForm.prototype.componentDidMount;
AcctAddressForm.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: AcctAddressForm');
if (originalDidMount) originalDidMount.apply(this);
if (AcctAddressForm.prototype.ctrlr) AcctAddressForm.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: AcctAddressForm');
// Added by sephora-jsx-loader.js
AcctAddressForm.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
AcctAddressForm.prototype.class = 'AcctAddressForm';
// Added by sephora-jsx-loader.js
AcctAddressForm.prototype.getInitialState = function() {
    AcctAddressForm.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
AcctAddressForm.prototype.render = wrapComponentRender(AcctAddressForm.prototype.render);
// Added by sephora-jsx-loader.js
var AcctAddressFormClass = React.createClass(AcctAddressForm.prototype);
// Added by sephora-jsx-loader.js
AcctAddressFormClass.prototype.classRef = AcctAddressFormClass;
// Added by sephora-jsx-loader.js
Object.assign(AcctAddressFormClass, AcctAddressForm);
// Added by sephora-jsx-loader.js
module.exports = AcctAddressFormClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/Addresses/AcctAddressForm/AcctAddressForm.jsx