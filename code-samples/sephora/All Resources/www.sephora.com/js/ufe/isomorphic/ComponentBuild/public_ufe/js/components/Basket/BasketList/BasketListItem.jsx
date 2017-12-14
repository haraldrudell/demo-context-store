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
    Sephora.Util.InflatorComps.Comps['BasketListItem'] = function BasketListItem(){
        return BasketListItemClass;
    }
}
const { space } = require('style');
const { Box, Flex, Grid, Text } = require('components/display');
const Link = require('components/Link/Link');
const Popover = require('components/Popover/Popover');
const skuUtils = require('utils/Sku');
const ItemSkuQuantity = require('components/Product/SkuQuantity/SkuQuantity');
const ProductImage = require('components/Product/ProductImage/ProductImage');
const ProductVariation = require('components/Product/ProductVariation/ProductVariation');
const SizeAndItemNumber = require('components/Product/SizeAndItemNumber/SizeAndItemNumber');
const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;
const { PROP_65_MSG } = require('components/constants');

const BasketListItem = function () {
    this.state = {
        showPaypalRestrictedMessage: false
    };
};

BasketListItem.prototype.render = function () {
    const {
        item,
        updateBasket,
        allowQuantityChange = true,
        isUS
    } = this.props;

    const isMobile = Sephora.isMobile();

    const imageSize = IMAGE_SIZES[97];

    const displayName = (
        <Box lineHeight={2}>
            <Box
                textTransform='uppercase'
                fontWeight={700}
                data-at={Sephora.debug.dataAt('bsk_sku_brand')}>
                {item.sku.brandName}
            </Box>
            <span data-at={Sephora.debug.dataAt('bsk_sku_name')}>{item.sku.productName}</span>
        </Box>
    );

    const isValidMessage = itemLevelMessages =>
        Array.isArray(itemLevelMessages) &&
        Array.isArray(itemLevelMessages[0].messages);

    const isHazMatMessageOrProp65 = itemLevelMessages =>
        (itemLevelMessages[0].messageContext === 'item.hazmatSku' ||
        (itemLevelMessages[0].messageContext === 'item.californiaRestricted'));
    return (
        <div>
            {
                //hazmat message will be displayed in a popover and not here
                // avoid prop65 to be duplicated
                isValidMessage(item.itemLevelMessages) &&
                (!item.sku.isPaypalRestricted ||
                    this.state.showPaypalRestrictedMessage ||
                    item.itemLevelMessages.length > 1) &&
                !isHazMatMessageOrProp65(item.itemLevelMessages) ?
                <Text
                    is='p'
                    color='error'
                    lineHeight={2}
                    marginBottom={space[2]}
                    fontSize='h5'>
                    {item.itemLevelMessages[0].messages[0]}
                </Text>
                : null
            }
            {item.sku.isHazmat &&
            <Popover
                content={` Due to shipping regulations, this item and
                    the rest of your order must ship ground
                    (2-8 days total delivery time).
                    This includes FLASH and expedited orders. `}
                    placement='top'
                    _css={{
                        left: -space[4],
                        marginLeft: 0
                    }}
                    arrowStyle={{
                        left: 0,
                        marginLeft: 52
                    }}>
                    <Link
                        muted={true}
                        lineHeight={2}
                        onClick={(e)=>this.handleShipRestrictionsClick(e)}
                        paddingBottom={space[2]}
                        textDecoration='underline'>
                        Shipping Restrictions
                    </Link>
                </Popover>
            }
            {
                /*
                    it ensures that everytime an item is prop65
                    it will display the error in the right place
                 */
                isUS && item.sku.isProp65 &&
                <Text
                    is='p'
                    color='error'
                    marginBottom={space[2]}
                    fontSize='h5'>
                    {PROP_65_MSG}
                </Text>
            }
            <Grid
                gutter={isMobile ? space[4] : space[5]}>
                <Grid.Cell
                    width='fit'>
                    <Box
                        href={item.sku.targetUrl}
                        _css={{
                            '@media (max-width: 374px)': {
                                width: IMAGE_SIZES[62]
                            }
                        }}>
                        <ProductImage
                            skuImages={item.sku.skuImages}
                            size={IMAGE_SIZES[97]} />
                    </Box>
                </Grid.Cell>
                <Grid.Cell
                    display='flex'
                    width='fill'>
                    <Grid
                        width={1}>
                        <Grid.Cell
                            width={!isMobile ? 'fill' : null}>
                            <Box
                                fontSize={isMobile ? 'h5' : 'h4'}>
                                {item.sku.targetUrl ?
                                    <Link
                                        display='block'
                                        href={item.sku.targetUrl}>
                                        {displayName}
                                    </Link>
                                    : displayName}
                            </Box>
                            <Box
                                marginTop={space[1]}
                                lineHeight={2}>
                                <SizeAndItemNumber
                                    sku={item.sku}
                                    fontSize={isMobile ? 'h6' : 'h5'} />
                                <ProductVariation
                                    sku={item.sku}
                                    fontSize={isMobile ? 'h6' : 'h5'}
                                    marginTop={space[1]}
                                    data-at={Sephora.debug.dataAt('bsk_sku_var')} />
                                {item.sku.isOutOfStock &&
                                    <Text
                                        is='p'
                                        fontWeight={700}
                                        color='red'
                                        marginTop={space[1]}>
                                        out of stock
                                    </Text>
                                }
                            </Box>
                        </Grid.Cell>
                        <Grid.Cell
                            display='flex'
                            flexDirection='column'
                            _css={isMobile ? {
                                marginTop: space[2]
                            } : {
                                width: 196,
                                paddingLeft: space[4]
                            }}>
                            <Flex
                                width={1}
                                alignItems={isMobile ? 'center' : null}
                                justifyContent='space-between'>
                                <div>
                                    {allowQuantityChange && !skuUtils.isFlash(item.sku) &&
                                    <ItemSkuQuantity
                                        hideLabel={true}
                                        currentSku={item.sku}
                                        skuQuantity={this.props.item.qty}
                                        disabled={!skuUtils.isChangeableQuantity(item.sku)}
                                        handleSkuQuantity={value =>
                                            this.handleSkuQuantity(value, item, updateBasket)
                                        }
                                        source='qty'/>
                                    }
                                </div>
                                <Box
                                    fontWeight={700}
                                    lineHeight={2}
                                    fontSize={isMobile ? 'h5' : 'h4'}>
                                    {item.sku.salePrice ?
                                        <Text
                                            fontWeight={400}
                                            color='midGray'
                                            textDecoration='line-through'
                                            whiteSpace='nowrap'
                                            data-at={Sephora.debug.dataAt('bsk_sku_price')}>
                                            {item.listPriceSubtotal}
                                        </Text>
                                        : <Text
                                            whiteSpace='nowrap'
                                            data-at={Sephora.debug.dataAt('bsk_sku_price')}>
                                            {item.listPriceSubtotal}
                                        </Text>
                                    }
                                    {item.sku.salePrice &&
                                    <Text
                                        is='div'
                                        color='red'
                                        whiteSpace='nowrap'
                                        data-at={Sephora.debug.dataAt('bsk_sale_price')}>
                                        {item.salePriceSubtotal}
                                    </Text>
                                    }
                                </Box>
                            </Flex>
                            <Box
                                textTransform='uppercase'
                                marginX={-space[2]}
                                textAlign={isMobile ? 'left' : 'right'}
                                fontWeight={700}
                                fontSize={isMobile ? 'h6' : 'h5'}
                                _css={allowQuantityChange || !isMobile ? {
                                    marginTop: 'auto', paddingTop: space[4]
                                } : {
                                    marginTop: '-1.25em'
                                }}>
                                {!skuUtils.isGwp(item.sku) &&
                                    <Link
                                        padding={space[2]}
                                        marginY={-space[2]}
                                        muted={true}
                                        onClick={() => this.removeItemFromBasket(item)}
                                        data-at={Sephora.debug.dataAt('bsk_sku_remove')}>
                                        Remove
                                    </Link>
                                }
                                {item.sku.actionFlags && !skuUtils.isSample(item.sku) &&
                                item.sku.actionFlags.myListStatus !== 'notApplicable' &&
                                <Box
                                    display='inline-block'
                                    marginLeft={space[1]}
                                    paddingLeft={space[1]}
                                    borderLeft={1}
                                    borderColor='moonGray'>
                                    {item.sku.actionFlags.myListStatus === 'notAdded' ?
                                        <Link
                                            padding={space[2]}
                                            marginY={-space[2]}
                                            muted={true}
                                            onClick={e => this.handleMoveToLoveClick(e, item)}
                                            data-at={Sephora.debug.dataAt('bsk_sku_love')}>
                                            Move to Loves
                                        </Link>
                                        :
                                        <Box
                                            display='inline-block'
                                            color='gray'
                                            padding={space[2]}
                                            marginY={-space[2]}>
                                            Loved
                                        </Box>
                                    }
                                </Box>
                                }
                            </Box>
                        </Grid.Cell>
                    </Grid>
                </Grid.Cell>
            </Grid>
        </div>
    );
};


// Added by sephora-jsx-loader.js
BasketListItem.prototype.path = 'Basket/BasketList';
// Added by sephora-jsx-loader.js
Object.assign(BasketListItem.prototype, require('./BasketListItem.c.js'));
var originalDidMount = BasketListItem.prototype.componentDidMount;
BasketListItem.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BasketListItem');
if (originalDidMount) originalDidMount.apply(this);
if (BasketListItem.prototype.ctrlr) BasketListItem.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BasketListItem');
// Added by sephora-jsx-loader.js
BasketListItem.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BasketListItem.prototype.class = 'BasketListItem';
// Added by sephora-jsx-loader.js
BasketListItem.prototype.getInitialState = function() {
    BasketListItem.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BasketListItem.prototype.render = wrapComponentRender(BasketListItem.prototype.render);
// Added by sephora-jsx-loader.js
var BasketListItemClass = React.createClass(BasketListItem.prototype);
// Added by sephora-jsx-loader.js
BasketListItemClass.prototype.classRef = BasketListItemClass;
// Added by sephora-jsx-loader.js
Object.assign(BasketListItemClass, BasketListItem);
// Added by sephora-jsx-loader.js
module.exports = BasketListItemClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/BasketList/BasketListItem.jsx