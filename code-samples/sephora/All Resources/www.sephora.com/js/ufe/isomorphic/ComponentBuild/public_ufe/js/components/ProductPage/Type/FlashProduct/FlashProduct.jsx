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
    Sephora.Util.InflatorComps.Comps['FlashProduct'] = function FlashProduct(){
        return FlashProductClass;
    }
}
const { space } = require('style');
const { Box, Grid, Text } = require('components/display');

const layout = require('components/ProductPage/settings').layout;
const HeroMediaList = require('components/ProductPage/HeroMediaList/HeroMediaList');
const Price = require('components/ProductPage/Price/Price');
const CallToActions = require('components/ProductPage/CallToActions/CallToActions');
const Info = require('components/ProductPage/Info/Info');

const FlashProduct = function () {
    this.state = this.props;
};

FlashProduct.prototype.render = function () {
    let currentProduct = this.state.currentProduct;

    const nameBlock = (
        <Box
            fontSize='h3'
            lineHeight={2}>
            <Text
                is='h1'
                fontWeight={700}>
                {currentProduct.displayName}
            </Text>
            Free 2-day shipping for one year
        </Box>
    );

    return (
        <div>
        {Sephora.isMobile() ?
            <div>
                <Box
                    marginY={space[4]}
                    textAlign='center'>
                    {nameBlock}
                    <Box
                        marginY={space[4]}>
                        <HeroMediaList product={currentProduct}/>
                    </Box>
                    <Price {...currentProduct}/>
                </Box>
                <Info {...currentProduct} />

                <CallToActions {...currentProduct} />
            </div>

            :

            <Grid
                marginTop={layout.TOP_MARGIN}
                justifyContent='space-between'>
                <Grid.Cell width={layout.SIDEBAR_WIDTH}>
                    <HeroMediaList product={currentProduct}/>
                </Grid.Cell>
                <Grid.Cell width={layout.MAIN_WIDTH}>
                    <Grid
                        gutter={space[5]}
                        marginBottom={space[7]}>
                        <Grid.Cell width='fill'>
                            {nameBlock}
                        </Grid.Cell>
                        <Grid.Cell width='fit'>
                            <Price {...currentProduct}/>
                        </Grid.Cell>
                        <Grid.Cell width='15em'>
                            <CallToActions {...currentProduct} />
                        </Grid.Cell>
                    </Grid>
                    <Info {...currentProduct} />
                </Grid.Cell>
            </Grid>
        }
        </div>
    );
};


// Added by sephora-jsx-loader.js
FlashProduct.prototype.path = 'ProductPage/Type/FlashProduct';
// Added by sephora-jsx-loader.js
Object.assign(FlashProduct.prototype, require('./FlashProduct.c.js'));
var originalDidMount = FlashProduct.prototype.componentDidMount;
FlashProduct.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: FlashProduct');
if (originalDidMount) originalDidMount.apply(this);
if (FlashProduct.prototype.ctrlr) FlashProduct.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: FlashProduct');
// Added by sephora-jsx-loader.js
FlashProduct.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
FlashProduct.prototype.class = 'FlashProduct';
// Added by sephora-jsx-loader.js
FlashProduct.prototype.getInitialState = function() {
    FlashProduct.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
FlashProduct.prototype.render = wrapComponentRender(FlashProduct.prototype.render);
// Added by sephora-jsx-loader.js
var FlashProductClass = React.createClass(FlashProduct.prototype);
// Added by sephora-jsx-loader.js
FlashProductClass.prototype.classRef = FlashProductClass;
// Added by sephora-jsx-loader.js
Object.assign(FlashProductClass, FlashProduct);
// Added by sephora-jsx-loader.js
module.exports = FlashProductClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/Type/FlashProduct/FlashProduct.jsx