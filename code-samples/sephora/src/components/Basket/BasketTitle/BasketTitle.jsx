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
    Sephora.Util.InflatorComps.Comps['BasketTitle'] = function BasketTitle(){
        return BasketTitleClass;
    }
}
const {
    space
} = require('style');
const Flex = require('components/Flex/Flex');
const Text = require('components/Text/Text');
const Image = require('components/Image/Image');
const Locale = require('utils/LanguageLocale.js');

const BasketTitle = function () {
    this.state = {
        shipCountry: null
    };
};

BasketTitle.prototype.render = function () {
    return (
        <Flex
            alignItems='center'
            marginBottom={space[3]}>
            <Text
                is='h1' fontSize='h1'
                lineHeight={1}
                serif={true}>
                My Basket
            </Text>
            {
                this.state.shipCountry && this.state.shipCountry !== Locale.COUNTRIES.US &&
                <Image
                    src={'/contentimages/country-flags/icon-flag-' +
                        this.state.shipCountry.toLowerCase() + '.png'}
                    width='3em'
                    height='2em'
                    marginLeft={space[4]} />
            }
        </Flex>
    );
};


// Added by sephora-jsx-loader.js
BasketTitle.prototype.path = 'Basket/BasketTitle';
// Added by sephora-jsx-loader.js
Object.assign(BasketTitle.prototype, require('./BasketTitle.c.js'));
var originalDidMount = BasketTitle.prototype.componentDidMount;
BasketTitle.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BasketTitle');
if (originalDidMount) originalDidMount.apply(this);
if (BasketTitle.prototype.ctrlr) BasketTitle.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BasketTitle');
// Added by sephora-jsx-loader.js
BasketTitle.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BasketTitle.prototype.class = 'BasketTitle';
// Added by sephora-jsx-loader.js
BasketTitle.prototype.getInitialState = function() {
    BasketTitle.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BasketTitle.prototype.render = wrapComponentRender(BasketTitle.prototype.render);
// Added by sephora-jsx-loader.js
var BasketTitleClass = React.createClass(BasketTitle.prototype);
// Added by sephora-jsx-loader.js
BasketTitleClass.prototype.classRef = BasketTitleClass;
// Added by sephora-jsx-loader.js
Object.assign(BasketTitleClass, BasketTitle);
// Added by sephora-jsx-loader.js
module.exports = BasketTitleClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/BasketTitle/BasketTitle.jsx