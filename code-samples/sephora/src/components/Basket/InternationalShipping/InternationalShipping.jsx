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
    Sephora.Util.InflatorComps.Comps['InternationalShipping'] = function InternationalShipping(){
        return InternationalShippingClass;
    }
}
const space = require('style').space;
const { Box, Flex, Image, Text } = require('components/display');
const Link = require('components/Link/Link');
const IconGlobe = require('components/Icon/IconGlobe');
const Locale = require('utils/LanguageLocale.js');

let InternationalShipping = function () {
    this.state = {
        countryCode: null
    };
};

InternationalShipping.prototype.render = function () {

    const iconWidth = '1.875em';
    const iconHeight = '1.25em';
    const iconMargin = space[2];

    if (this.state.countryCode) {
        switch (this.state.countryCode) {
            case Locale.COUNTRIES.US:
                return (
                    <Flex
                        justifyContent='space-between'>
                        <Link
                            arrowDirection='right'
                            padding={space[2]}
                            margin={-space[2]}
                            onClick={() => this.open()}>
                            <IconGlobe
                                fontSize={iconHeight}
                                marginRight={iconMargin} />
                            <Text>
                                Ship international
                            </Text>
                        </Link>
                        <Link
                            arrowDirection='right'
                            padding={space[2]}
                            margin={-space[2]}
                            onClick={() => this.showCountrySwitcherModal('CA')}>
                            <Image
                                src={'/contentimages/country-flags/icon-flag-ca.png'}
                                width={iconWidth}
                                height={iconHeight}
                                marginRight={iconMargin}
                                verticalAlign='text-bottom' />
                            <Text>
                                Canada checkout
                            </Text>
                        </Link>
                    </Flex>
                );
            case Locale.COUNTRIES.CA:
                return (
                    <Box textAlign='right'>
                        <Link
                            arrowDirection='right'
                            padding={space[2]}
                            margin={-space[2]}
                            onClick={() => this.showCountrySwitcherModal('US')}>
                            <Image
                                src={'/contentimages/country-flags/icon-flag-us.png'}
                                width={iconWidth}
                                height={iconHeight}
                                marginRight={iconMargin}
                                verticalAlign='text-bottom' />
                            <Text>
                                United States checkout
                            </Text>
                        </Link>
                    </Box>
                );
            default:
                return (
                    <Flex
                        justifyContent='space-between'>
                        <div>
                            <Image
                                src={'/contentimages/country-flags/icon-flag-' +
                            this.state.countryCode.toLowerCase() + '.png'}
                                width={iconWidth}
                                height={iconHeight}
                                marginRight={iconMargin}
                                verticalAlign='text-bottom' />
                            <Text>
                                Shipping to {this.state.countryLongName}
                            </Text>
                        </div>
                        <Link
                            primary={true}
                            padding={space[2]}
                            margin={-space[2]}
                            onClick={() => this.open()}>
                            Change country
                        </Link>
                    </Flex>
                );
        }
    } else {
        return <div></div>;
    }
};


// Added by sephora-jsx-loader.js
InternationalShipping.prototype.path = 'Basket/InternationalShipping';
// Added by sephora-jsx-loader.js
Object.assign(InternationalShipping.prototype, require('./InternationalShipping.c.js'));
var originalDidMount = InternationalShipping.prototype.componentDidMount;
InternationalShipping.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: InternationalShipping');
if (originalDidMount) originalDidMount.apply(this);
if (InternationalShipping.prototype.ctrlr) InternationalShipping.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: InternationalShipping');
// Added by sephora-jsx-loader.js
InternationalShipping.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
InternationalShipping.prototype.class = 'InternationalShipping';
// Added by sephora-jsx-loader.js
InternationalShipping.prototype.getInitialState = function() {
    InternationalShipping.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
InternationalShipping.prototype.render = wrapComponentRender(InternationalShipping.prototype.render);
// Added by sephora-jsx-loader.js
var InternationalShippingClass = React.createClass(InternationalShipping.prototype);
// Added by sephora-jsx-loader.js
InternationalShippingClass.prototype.classRef = InternationalShippingClass;
// Added by sephora-jsx-loader.js
Object.assign(InternationalShippingClass, InternationalShipping);
// Added by sephora-jsx-loader.js
module.exports = InternationalShippingClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/InternationalShipping/InternationalShipping.jsx