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
    Sephora.Util.InflatorComps.Comps['PlayProduct'] = function PlayProduct(){
        return PlayProductClass;
    }
}
const { space } = require('style');
const { Box, Grid, Text } = require('components/display');

const layout = require('components/ProductPage/settings').layout;
const HeroMediaList = require('components/ProductPage/HeroMediaList/HeroMediaList');
const Price = require('components/ProductPage/Price/Price');
const CallToActions = require('components/ProductPage/CallToActions/CallToActions');
const Info = require('components/ProductPage/Info/Info');
const LazyLoad = require('components/LazyLoad/LazyLoad');
const TokyWoky = require('components/TokyWoky/TokyWoky');
const CHANEL = 'CHANEL';


const PlayProduct = function () {
    this.state = this.props;
};

PlayProduct.prototype.render = function () {
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
            Monthly Subscription
        </Box>
    );
    let isBazaarVoiceEnabled = Sephora.configurationSettings.isBazaarVoiceEnabled;

    return (
        <div>
        {Sephora.isMobile() ?
            <div>
                <Box
                    marginY={space[4]}
                    textAlign='center'>
                    <Box
                        marginBottom={space[4]}>
                        {nameBlock}
                    </Box>
                    <Box
                        marginBottom={space[4]}>
                        <HeroMediaList product={currentProduct}/>
                    </Box>
                    <Price {...currentProduct}/> billed monthly
                </Box>
                <CallToActions {...currentProduct} />
                <Info {...currentProduct} />
            </div>

            :

            <div>
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
                            <Grid.Cell
                                width='fit'
                                lineHeight={2}>
                                <Price {...currentProduct}/>
                                billed monthly
                                <Box
                                    fontSize='h5'
                                    fontWeight={700}
                                    marginTop={space[2]}
                                    textTransform='uppercase'>
                                    free shipping
                                </Box>
                            </Grid.Cell>
                            <Grid.Cell width='15em'>
                                <CallToActions {...currentProduct} />
                            </Grid.Cell>
                        </Grid>
                        <Info {...currentProduct}/>
                    </Grid.Cell>
                </Grid>
            </div>
        }
        {!(currentProduct.brand && currentProduct.brand.displayName === CHANEL) &&
        <TokyWoky targetResolved={this.state.targetResolved}
                  targetResults={this.state.targetResults} />
        }
        </div>
    );
};


// Added by sephora-jsx-loader.js
PlayProduct.prototype.path = 'ProductPage/Type/PlayProduct';
// Added by sephora-jsx-loader.js
Object.assign(PlayProduct.prototype, require('./PlayProduct.c.js'));
var originalDidMount = PlayProduct.prototype.componentDidMount;
PlayProduct.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: PlayProduct');
if (originalDidMount) originalDidMount.apply(this);
if (PlayProduct.prototype.ctrlr) PlayProduct.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: PlayProduct');
// Added by sephora-jsx-loader.js
PlayProduct.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
PlayProduct.prototype.class = 'PlayProduct';
// Added by sephora-jsx-loader.js
PlayProduct.prototype.getInitialState = function() {
    PlayProduct.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
PlayProduct.prototype.render = wrapComponentRender(PlayProduct.prototype.render);
// Added by sephora-jsx-loader.js
var PlayProductClass = React.createClass(PlayProduct.prototype);
// Added by sephora-jsx-loader.js
PlayProductClass.prototype.classRef = PlayProductClass;
// Added by sephora-jsx-loader.js
Object.assign(PlayProductClass, PlayProduct);
// Added by sephora-jsx-loader.js
module.exports = PlayProductClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/Type/PlayProduct/PlayProduct.jsx