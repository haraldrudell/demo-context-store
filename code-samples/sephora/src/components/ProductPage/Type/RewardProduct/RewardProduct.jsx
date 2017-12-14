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
    Sephora.Util.InflatorComps.Comps['RewardProduct'] = function RewardProduct(){
        return RewardProductClass;
    }
}
const { site, space } = require('style');
const { Box, Grid } = require('components/display');

const layout = require('components/ProductPage/settings').layout;
const HeroMediaList = require('components/ProductPage/HeroMediaList/HeroMediaList');
const ProductBadges = require('components/Product/ProductBadges/ProductBadges');
const Price = require('components/ProductPage/Price/Price');
const CallToActions = require('components/ProductPage/CallToActions/CallToActions');
const Info = require('components/ProductPage/Info/Info');
const DisplayName = require('components/ProductPage/DisplayName/DisplayName');
const MarketingFlags = require('components/Product/MarketingFlags/MarketingFlags');
const SizeAndItemNumber = require('components/Product/SizeAndItemNumber/SizeAndItemNumber');
const TokyWoky = require('components/TokyWoky/TokyWoky');
const CHANEL = 'CHANEL';

/**
 * The reward product page is both sku and user specific.  It will be updated as
 * quickly as possible (asyncRender = Immediate) for re-rendering with the sku-specific data
 *
 * @constructor
 */
const RewardProduct = function () {
    this.state = {
        isSkuReady: false,
        ...this.props
    };
};

RewardProduct.prototype.render = function () {
    let currentProduct = this.state.currentProduct;
    let {
        currentSku
    } = currentProduct;

    return (
        <div>
            {Sephora.isMobile() ?
                <div>
                    <Box
                        textAlign='center'
                        className={ !this.state.isSkuReady ? 'isDefault' : null }
                    >
                        <Box
                            marginY={space[4]}>
                            <DisplayName {...currentProduct} />
                            <MarketingFlags
                                marginTop={space[2]}
                                sku={currentSku}/>
                        </Box>
                        <Box
                            position='relative'
                            marginBottom={space[4]}>
                            <HeroMediaList product={currentProduct}/>
                        </Box>
                        <Price {...currentProduct} />
                        <SizeAndItemNumber
                            sku={currentSku}
                            fontSize='h5'
                            marginTop={space[1]}/>
                    </Box>
                    <Info {...currentProduct} />

                    <CallToActions basket={this.state.basket}
                                   {...currentProduct} />
                </div>

                :

                <Grid
                    marginTop={layout.TOP_MARGIN}
                    justifyContent='space-between'>
                    <Grid.Cell
                        position='relative'
                        width={layout.SIDEBAR_WIDTH}>
                        <HeroMediaList product={currentProduct}/>
                        <ProductBadges
                            sku={currentSku}/>
                    </Grid.Cell>
                    <Grid.Cell width={layout.MAIN_WIDTH}>
                        <Grid
                            gutter={space[4]}
                            marginBottom={space[7]}>
                            <Grid.Cell width='fill'>
                                <DisplayName {...currentProduct} />
                                <SizeAndItemNumber
                                    sku={currentSku}
                                    fontSize='h5'
                                    marginTop={space[1]}
                                    marginBottom={space[3]}/>
                                <MarketingFlags
                                    sku={currentSku}/>
                            </Grid.Cell>
                            <Grid.Cell width='fit'>
                                <Price {...currentProduct}/>
                            </Grid.Cell>
                            <Grid.Cell width='fit'>
                                <Box width={layout.ACTIONS_WIDTH}>
                                    <CallToActions basket={this.state.basket}
                                                   {...currentProduct} />
                                </Box>
                            </Grid.Cell>
                        </Grid>
                        <Info {...currentProduct} />
                    </Grid.Cell>
                </Grid>
            }
            {!(currentProduct.brand && currentProduct.brand.displayName === CHANEL) &&
            <TokyWoky targetResolved={this.state.targetResolved}
                      targetResults={this.state.targetResults} />
            }
        </div>
    );
};


// Added by sephora-jsx-loader.js
RewardProduct.prototype.path = 'ProductPage/Type/RewardProduct';
// Added by sephora-jsx-loader.js
Object.assign(RewardProduct.prototype, require('./RewardProduct.c.js'));
var originalDidMount = RewardProduct.prototype.componentDidMount;
RewardProduct.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: RewardProduct');
if (originalDidMount) originalDidMount.apply(this);
if (RewardProduct.prototype.ctrlr) RewardProduct.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: RewardProduct');
// Added by sephora-jsx-loader.js
RewardProduct.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
RewardProduct.prototype.class = 'RewardProduct';
// Added by sephora-jsx-loader.js
RewardProduct.prototype.getInitialState = function() {
    RewardProduct.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
RewardProduct.prototype.render = wrapComponentRender(RewardProduct.prototype.render);
// Added by sephora-jsx-loader.js
var RewardProductClass = React.createClass(RewardProduct.prototype);
// Added by sephora-jsx-loader.js
RewardProductClass.prototype.classRef = RewardProductClass;
// Added by sephora-jsx-loader.js
Object.assign(RewardProductClass, RewardProduct);
// Added by sephora-jsx-loader.js
module.exports = RewardProductClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/Type/RewardProduct/RewardProduct.jsx