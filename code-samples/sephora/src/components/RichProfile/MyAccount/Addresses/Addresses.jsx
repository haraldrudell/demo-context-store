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
    Sephora.Util.InflatorComps.Comps['Addresses'] = function Addresses(){
        return AddressesClass;
    }
}
const AccountLayout = require('components/RichProfile/MyAccount/AccountLayout/AccountLayout');
const { space } = require('style');
const { Box, Flex, Grid, Text } = require('components/display');
const Divider = require('components/Divider/Divider');
const Checkbox = require('components/Inputs/Checkbox/Checkbox');
const IconCross = require('components/Icon/IconCross');
const AcctAddressForm = require('components/RichProfile/MyAccount/Addresses/AcctAddressForm/AcctAddressForm');
const Link = require('components/Link/Link');
const PleaseSignInBlock = require('components/RichProfile/MyAccount/PleaseSignIn');
const Locale = require('utils/LanguageLocale.js');
const COUNTRIES = Locale.COUNTRIES;
const Address = require('components/Addresses/Address');

const Addresses = function () {
    this.state = {
        addresses: [],
        isAddAddress: false,
        isEditMode: false,
        editAddressId: ''
    };
};

Addresses.prototype.render = function () {
    return (
        <AccountLayout
            section='account'
            page='saved addresses'
            title='Saved Addresses'>

            {!Sephora.isRootRender && this.isUserReady() &&
            <div>
                {!this.isUserAuthenticated() &&
                <PleaseSignInBlock />
                }

                {this.isUserAuthenticated() &&
                <Box marginTop={space[5]}>
                    {this.state.addresses && this.state.addresses.length ?
                        this.state.addresses.map(address =>
                            this.state.isEditMode && (address.addressId === this.state.editAddressId) ?
                            <div>
                                <AcctAddressForm
                                    isEditMode
                                    profileId={this.profileId}
                                    address={address}
                                    country={address.country}
                                    cancelEditAddressCallback={this.cancelEditAddressCallback}
                                    updateAddressCallback={this.updateAddressCallback}
                                    deleteSavedAddressCallback={this.deleteSavedAddressCallback}
                                    isInternational={address.country !== COUNTRIES.US}/>
                                <Divider marginY={space[5]} />
                            </div>
                            :
                            <div>
                                <Grid
                                    gutter={space[3]}>
                                    <Grid.Cell width='fill'>
                                        <Address address={address} />
                                        <Box marginTop={space[2]}>
                                            {address.isDefault ?
                                                <Text
                                                    is='p'
                                                    color='silver'>
                                                    Default shipping address
                                                </Text>
                                                :
                                                <Checkbox
                                                    onChange={
                                                        e => this.chooseDefaultAddress(address.addressId)
                                                    }>
                                                    Set as default address
                                                </Checkbox>
                                            }
                                        </Box>
                                    </Grid.Cell>
                                    <Grid.Cell width='fit'>
                                        <Link
                                            primary={true}
                                            paddingY={space[2]}
                                            marginY={-space[2]}
                                            onClick={e => this.showEditAddress(address.addressId)}>
                                            Edit
                                        </Link>
                                    </Grid.Cell>
                                </Grid>
                                <Divider marginY={space[5]} />
                            </div>
                        )
                        : null
                    }
                    {!this.state.isAddAddress ?
                        <Link
                            padding={space[2]}
                            margin={-space[2]}
                            onClick={this.showAddAddressForm}>
                            <Flex alignItems='center'>
                                <IconCross fontSize='h3' />
                                <Text marginLeft={space[2]}>
                                    Add shipping address
                                </Text>
                            </Flex>
                        </Link>
                        :
                        <AcctAddressForm
                            cancelAddAddressCallback={this.cancelAddAddressCallback}
                            addAddressCallback={this.addAddressCallback}
                            country={Locale.getCurrentCountry().toUpperCase()}
                            isInternational={Locale.getCurrentCountry().toUpperCase() !== COUNTRIES.US} />
                    }
                </Box>
                }
            </div>
            }
        </AccountLayout>
    );
};


// Added by sephora-jsx-loader.js
Addresses.prototype.path = 'RichProfile/MyAccount/Addresses';
// Added by sephora-jsx-loader.js
Object.assign(Addresses.prototype, require('./Addresses.c.js'));
var originalDidMount = Addresses.prototype.componentDidMount;
Addresses.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Addresses');
if (originalDidMount) originalDidMount.apply(this);
if (Addresses.prototype.ctrlr) Addresses.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Addresses');
// Added by sephora-jsx-loader.js
Addresses.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Addresses.prototype.class = 'Addresses';
// Added by sephora-jsx-loader.js
Addresses.prototype.getInitialState = function() {
    Addresses.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Addresses.prototype.render = wrapComponentRender(Addresses.prototype.render);
// Added by sephora-jsx-loader.js
var AddressesClass = React.createClass(Addresses.prototype);
// Added by sephora-jsx-loader.js
AddressesClass.prototype.classRef = AddressesClass;
// Added by sephora-jsx-loader.js
Object.assign(AddressesClass, Addresses);
// Added by sephora-jsx-loader.js
module.exports = AddressesClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/Addresses/Addresses.jsx