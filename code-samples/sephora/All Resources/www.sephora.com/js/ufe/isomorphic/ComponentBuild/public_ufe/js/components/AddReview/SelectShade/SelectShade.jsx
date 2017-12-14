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
    Sephora.Util.InflatorComps.Comps['SelectShade'] = function SelectShade(){
        return SelectShadeClass;
    }
}
const { space } = require('style');
const { Box, Grid } = require('components/display');
const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;
const Swatches = require('components/ProductPage/Swatches/Swatches');
const ProductImage = require('components/Product/ProductImage/ProductImage');
const DisplayName = require('components/ProductPage/DisplayName/DisplayName');
const ProductVariation = require('components/Product/ProductVariation/ProductVariation');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const Divider = require('components/Divider/Divider');
const Container = require('components/Container/Container');
const AddReviewTitle = require('components/AddReview/AddReviewTitle/AddReviewTitle');

const SelectShade = function () {
    this.state = this.props;
};

SelectShade.prototype.render = function () {
    let product = this.state.product;
    let isMobile = Sephora.isMobile();
    let isDesktop = Sephora.isDesktop();
    let activeSku = this.state.product.hoveredSku || this.state.product.currentSku;
    return (
        <Container>
            <AddReviewTitle
                children='Select a Shade' />
            <Grid
                marginX={isDesktop ? space[6] : null}
                gutter={!isMobile ? space[7] : null}>
                <Grid.Cell
                    width={isDesktop ? 'fit' : null}>
                    <ProductImage
                        marginX='auto'
                        skuImages={activeSku.skuImages}
                        size={isMobile ? IMAGE_SIZES[162] : IMAGE_SIZES[300]}
                        disableLazyLoad={true}/>
                </Grid.Cell>
                <Grid.Cell
                    width={isDesktop ? 'fill' : null}
                    textAlign={isMobile ? 'center' : null}>
                    <Box
                        marginTop={isMobile ? space[4] : null}
                        marginBottom={isMobile ? space[2] : space[5]}>
                        <DisplayName {...product} />
                    </Box>
                    <ProductVariation
                        hasMinHeight={true}
                        product={product}
                        sku={activeSku} />
                    <Swatches {...product} />
                    {isDesktop &&
                        <Divider
                            marginY={space[5]} />
                    }
                    <ButtonPrimary
                        onClick={() => this.props.onNext()}
                        marginTop={isMobile ? space[4] : null}
                        width={isMobile ? '100%' : 165}>
                        Next
                    </ButtonPrimary>
                </Grid.Cell>
            </Grid>
        </Container>
    );
};


// Added by sephora-jsx-loader.js
SelectShade.prototype.path = 'AddReview/SelectShade';
// Added by sephora-jsx-loader.js
Object.assign(SelectShade.prototype, require('./SelectShade.c.js'));
var originalDidMount = SelectShade.prototype.componentDidMount;
SelectShade.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: SelectShade');
if (originalDidMount) originalDidMount.apply(this);
if (SelectShade.prototype.ctrlr) SelectShade.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: SelectShade');
// Added by sephora-jsx-loader.js
SelectShade.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
SelectShade.prototype.class = 'SelectShade';
// Added by sephora-jsx-loader.js
SelectShade.prototype.getInitialState = function() {
    SelectShade.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
SelectShade.prototype.render = wrapComponentRender(SelectShade.prototype.render);
// Added by sephora-jsx-loader.js
var SelectShadeClass = React.createClass(SelectShade.prototype);
// Added by sephora-jsx-loader.js
SelectShadeClass.prototype.classRef = SelectShadeClass;
// Added by sephora-jsx-loader.js
Object.assign(SelectShadeClass, SelectShade);
// Added by sephora-jsx-loader.js
module.exports = SelectShadeClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/AddReview/SelectShade/SelectShade.jsx