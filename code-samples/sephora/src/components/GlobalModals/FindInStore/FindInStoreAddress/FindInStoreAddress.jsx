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
    Sephora.Util.InflatorComps.Comps['FindInStoreAddress'] = function FindInStoreAddress(){
        return FindInStoreAddressClass;
    }
}
const { space } = require('style');
const { Box, Text } = require('components/display');
const LanguageLocale = require('utils/LanguageLocale');
const Link = require('components/Link/Link');

const FindInStoreAddress = function () {};

FindInStoreAddress.prototype.render = function () {
    const store = this.props;
    return (
        <Box
            is='dl'
            lineHeight={2}>
            <Text
                is='dt'
                fontWeight={700}
                marginBottom={space[2]}>
                {store.displayName}
            </Text>
            <Text is='dd'>{store.address.address1}</Text>
            {store.address.address2 &&
            <Text is='dd'>{store.address.address2}</Text>
            }
            <Text is='dd'>
                {store.address.city}
                {', '}
                {store.address.state}
                {' '}
                {store.address.postalCode}
            </Text>
            <Text is='dd'>
                {store.address.country}
            </Text>
            <Text
                is='dd'>
                <Link
                    primary={true}
                    paddingY={space[2]}
                    href={`tel:${store.address.phone.replace(/[^0-9]+/g, '')}`}>
                    {store.address.phone}
                </Link>
            </Text>
            {Sephora.isMobile() &&
                <Text
                    is='dd'
                    color='gray'>
                    {store.distance}
                    {' '}
                    {LanguageLocale.isCanada() ? 'kilometer' : 'mile'}
                    {store.distance !== 1 ? 's' : ''} away
                </Text>
            }
        </Box>
    );
};


// Added by sephora-jsx-loader.js
FindInStoreAddress.prototype.path = 'GlobalModals/FindInStore/FindInStoreAddress';
// Added by sephora-jsx-loader.js
FindInStoreAddress.prototype.class = 'FindInStoreAddress';
// Added by sephora-jsx-loader.js
FindInStoreAddress.prototype.getInitialState = function() {
    FindInStoreAddress.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
FindInStoreAddress.prototype.render = wrapComponentRender(FindInStoreAddress.prototype.render);
// Added by sephora-jsx-loader.js
var FindInStoreAddressClass = React.createClass(FindInStoreAddress.prototype);
// Added by sephora-jsx-loader.js
FindInStoreAddressClass.prototype.classRef = FindInStoreAddressClass;
// Added by sephora-jsx-loader.js
Object.assign(FindInStoreAddressClass, FindInStoreAddress);
// Added by sephora-jsx-loader.js
module.exports = FindInStoreAddressClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/FindInStore/FindInStoreAddress/FindInStoreAddress.jsx