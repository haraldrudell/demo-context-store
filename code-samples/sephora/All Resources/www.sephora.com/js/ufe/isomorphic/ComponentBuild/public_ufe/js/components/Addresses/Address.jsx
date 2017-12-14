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
    Sephora.Util.InflatorComps.Comps['Address'] = function Address(){
        return AddressClass;
    }
}
const Text = require('components/Text/Text');

const Address = function () {};

Address.prototype.render = function () {
    const { address } = this.props;
    return (
        <Text is='p'>
            <Text
                textTransform='capitalize'>
                {address.firstName} {address.lastName}
            </Text>
            <br />
            {address.address1}
            <br />
            {address.address2 &&
                <span>
                    {address.address2}
                    <br />
                </span>
            }
            {address.city}, {address.state} {address.postalCode}
            <br />
            {address.country}
            <br />
            {address.country === 'US' || address.country === 'CA' ?
                address.phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
                : address.phone
            }
        </Text>
    );
};


// Added by sephora-jsx-loader.js
Address.prototype.path = 'Addresses';
// Added by sephora-jsx-loader.js
Address.prototype.class = 'Address';
// Added by sephora-jsx-loader.js
Address.prototype.getInitialState = function() {
    Address.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Address.prototype.render = wrapComponentRender(Address.prototype.render);
// Added by sephora-jsx-loader.js
var AddressClass = React.createClass(Address.prototype);
// Added by sephora-jsx-loader.js
AddressClass.prototype.classRef = AddressClass;
// Added by sephora-jsx-loader.js
Object.assign(AddressClass, Address);
// Added by sephora-jsx-loader.js
module.exports = AddressClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Addresses/Address.jsx