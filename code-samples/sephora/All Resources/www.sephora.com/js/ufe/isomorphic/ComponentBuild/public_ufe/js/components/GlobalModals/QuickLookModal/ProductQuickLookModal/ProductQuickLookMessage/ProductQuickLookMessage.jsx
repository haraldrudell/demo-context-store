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
    Sephora.Util.InflatorComps.Comps['ProductQuickLookMessage'] = function ProductQuickLookMessage(){
        return ProductQuickLookMessageClass;
    }
}
const { colors } = require('style');
const { Box, Text } = require('components/display');
const skuUtils = require('utils/Sku');
const Link = require('components/Link/Link');

const ProductQuickLookMessage = function () {
    this.setState({
        isUserAnonymous: true,
        isUserSignedIn: false,
        isUserBI: false,
        isUserRecognized: false,
        isBiLevelQualifiedFor: false,
        loginStatus: null
    });
};

ProductQuickLookMessage.prototype.render = function () {
    let {
        currentSku
    } = this.props;

    /* TODO TBD: Replace logic with BIQualify component when QL ACs are updated to match PDP */

    //changes BI Qualification user message dependent on bi level of sku
    let userLabel = 'Beauty Insider';
    let userColor = colors.black;
    let learnMoreUrl = '/about-beauty-insider';
    if (currentSku.biExclusiveLevel === 'Rouge') {
        userLabel = 'VIB Rouge';
        userColor = colors.rouge;
        learnMoreUrl = '/rouge';
    } else if (currentSku.biExclusiveLevel === 'VIB') {
        userLabel = 'VIB Rouge or VIB';
        learnMoreUrl = '/vib';
    }

    //changes interaction depending on user status for BI Qualification
    let userHandler;
    let userActionText;
    if (this.state.isUserAnonymous) {
        userHandler = this.signInHandler;
        userActionText = 'sign in';
    } else if ((this.state.isUserSignedIn || this.state.isUserRecognized) &&
        !this.state.isUserBI) {
        userHandler = this.biRegisterHandler;
        userActionText = 'sign up';
    }

    if (this.state.profileStatus === null) {
        return null;
    } else if (!this.state.isBiLevelQualifiedFor) {
        return (
            <Box lineHeight={2}>
                You must be a
                {' '}
                <Text
                    fontWeight={700}
                    color={userColor}>
                    {userLabel}
                </Text>
                {' '}
                to qualify for this product.
                <br />
                <Link
                    fontWeight={700}
                    onClick={userHandler}
                    textDecoration='underline'>
                    {userActionText}
                </Link>
                {userActionText && ' or '}
                <Link
                    fontWeight={700}
                    href={learnMoreUrl}
                    textDecoration='underline'>
                    learn more
                </Link>
            </Box>
        );
    } else {
        return (
            <Box
                textTransform='uppercase'
                fontWeight={700}
                fontSize='h6' lineHeight={2}>
                {(currentSku.freeShippingMessage &&
                  currentSku.isFreeShippingSku &&
                  !currentSku.isOutOfStock) &&
                    currentSku.freeShippingMessage
                }
            </Box>
        );
    }
};


// Added by sephora-jsx-loader.js
ProductQuickLookMessage.prototype.path = 'GlobalModals/QuickLookModal/ProductQuickLookModal/ProductQuickLookMessage';
// Added by sephora-jsx-loader.js
Object.assign(ProductQuickLookMessage.prototype, require('./ProductQuickLookMessage.c.js'));
var originalDidMount = ProductQuickLookMessage.prototype.componentDidMount;
ProductQuickLookMessage.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ProductQuickLookMessage');
if (originalDidMount) originalDidMount.apply(this);
if (ProductQuickLookMessage.prototype.ctrlr) ProductQuickLookMessage.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ProductQuickLookMessage');
// Added by sephora-jsx-loader.js
ProductQuickLookMessage.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ProductQuickLookMessage.prototype.class = 'ProductQuickLookMessage';
// Added by sephora-jsx-loader.js
ProductQuickLookMessage.prototype.getInitialState = function() {
    ProductQuickLookMessage.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ProductQuickLookMessage.prototype.render = wrapComponentRender(ProductQuickLookMessage.prototype.render);
// Added by sephora-jsx-loader.js
var ProductQuickLookMessageClass = React.createClass(ProductQuickLookMessage.prototype);
// Added by sephora-jsx-loader.js
ProductQuickLookMessageClass.prototype.classRef = ProductQuickLookMessageClass;
// Added by sephora-jsx-loader.js
Object.assign(ProductQuickLookMessageClass, ProductQuickLookMessage);
// Added by sephora-jsx-loader.js
module.exports = ProductQuickLookMessageClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/QuickLookModal/ProductQuickLookModal/ProductQuickLookMessage/ProductQuickLookMessage.jsx