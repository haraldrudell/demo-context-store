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
    Sephora.Util.InflatorComps.Comps['BasketItem'] = function BasketItem(){
        return BasketItemClass;
    }
}
const { space } = require('style');
const { Box, Grid, Text } = require('components/display');
const ProductImage = require('components/Product/ProductImage/ProductImage');
const Link = require('components/Link/Link');
const Divider = require('components/Divider/Divider');
const ProductVariation = require('components/Product/ProductVariation/ProductVariation');
const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;

const BasketItem = function () {
    this.state = {
        isHover: false
    };
};

BasketItem.prototype.render = function () {
    const {
        item,
        itemWidth,
        index
    } = this.props;

    const displayName = (
        <div>
            <Box
                fontWeight={700}
                textTransform='uppercase'>
                {item.sku.brandName}
            </Box>
            {item.sku.productName}
        </div>
    );

    return (
        <Box
            fontSize='h5'
            lineHeight={2}
            width={itemWidth}
            onMouseEnter={this.onMouseEnterHandler}
            onMouseLeave={this.onMouseLeaveHandler}>
            {index > 0 &&
                <Divider />
            }
            <Grid paddingY={space[3]}>
                <Grid.Cell
                    width='fit'
                    marginRight={space[2]}>
                    <Box
                        href={item.sku.targetUrl}>
                        <ProductImage
                            skuImages={item.sku.skuImages}
                            size={IMAGE_SIZES[62]}
                            disableLazyLoad={true}/>
                    </Box>
                </Grid.Cell>
                <Grid.Cell
                    width='fill'>
                    {item.sku.targetUrl ?
                        <Link
                            display='block'
                            href={item.sku.targetUrl}
                            data-at={Sephora.debug.dataAt('inline_basket_sku_name')}>
                            {displayName}
                        </Link>
                    : displayName}
                    <Box
                        marginTop={space[1]}
                        fontSize='h6'
                        color='gray'>
                        <span data-at={Sephora.debug.dataAt('inline_basket_sku_id')}>
                            ITEM {item.sku.skuId}
                        </span>
                        <Text marginX={space[2]}>•</Text>
                        <span data-at={Sephora.debug.dataAt('inline_basket_sku_qty')}>
                            QTY {item.qty}
                        </span>
                    </Box>
                    <ProductVariation
                        sku={item.sku}
                        marginTop={space[1]}
                        fontSize='h6'
                        data-at={Sephora.debug.dataAt('inline_basket_sku_variation')} />
                    {item.sku.isOutOfStock &&
                        <Text
                            fontWeight={700}
                            color='red'
                            data-at={Sephora.debug.dataAt('inline_basket_sku_out_of_stock')}>
                            out of stock
                        </Text>
                    }
                </Grid.Cell>
                <Grid.Cell
                    display='flex'
                    flexDirection='column'
                    width='fit'
                    marginLeft={space[2]}
                    lineHeight={2}
                    fontWeight={700}
                    textAlign='right'
                    data-at={Sephora.debug.dataAt('inline_basket_sku_price')}>
                    {item.sku.salePrice ?
                        <Text
                            fontWeight={400}
                            color='midGray'
                            textDecoration='line-through'
                            whiteSpace='nowrap'
                            data-at={Sephora.debug.dataAt('inline_basket_sku_total_price')}>
                            {item.listPriceSubtotal}
                        </Text>
                        : item.listPriceSubtotal
                    }
                    {item.sku.salePrice &&
                        <Text
                            color='red'
                            whiteSpace='nowrap'
                            data-at={Sephora.debug.dataAt('inline_basket_sku_sale_price')}>
                            {item.salePriceSubtotal}
                        </Text>
                    }
                    <Box
                        marginX={-space[3]}
                        textAlign='right'
                        marginTop='auto'
                        transition='opacity .2s'
                        style={{
                            opacity: this.state.isHover || Sephora.isTouch ? 1 : 0
                        }}>
                        <Link
                            padding={space[3]}
                            marginBottom={-space[3]}
                            muted={true}
                            textTransform='uppercase'
                            fontSize='h6'
                            fontWeight={700}
                            onClick={this.removeItemFromBasket}>
                            Remove
                        </Link>
                    </Box>
                </Grid.Cell>
            </Grid>
        </Box>
    );
};


// Added by sephora-jsx-loader.js
BasketItem.prototype.path = 'InlineBasket/BasketDesktop';
// Added by sephora-jsx-loader.js
Object.assign(BasketItem.prototype, require('./BasketItem.c.js'));
var originalDidMount = BasketItem.prototype.componentDidMount;
BasketItem.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BasketItem');
if (originalDidMount) originalDidMount.apply(this);
if (BasketItem.prototype.ctrlr) BasketItem.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BasketItem');
// Added by sephora-jsx-loader.js
BasketItem.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BasketItem.prototype.class = 'BasketItem';
// Added by sephora-jsx-loader.js
BasketItem.prototype.getInitialState = function() {
    BasketItem.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BasketItem.prototype.render = wrapComponentRender(BasketItem.prototype.render);
// Added by sephora-jsx-loader.js
var BasketItemClass = React.createClass(BasketItem.prototype);
// Added by sephora-jsx-loader.js
BasketItemClass.prototype.classRef = BasketItemClass;
// Added by sephora-jsx-loader.js
Object.assign(BasketItemClass, BasketItem);
// Added by sephora-jsx-loader.js
module.exports = BasketItemClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/InlineBasket/BasketDesktop/BasketItem.jsx