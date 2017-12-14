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
    Sephora.Util.InflatorComps.Comps['CustomSets'] = function CustomSets(){
        return CustomSetsClass;
    }
}
/* eslint-disable max-len */
const { swatch, space, zIndex } = require('style');
const { Box, Flex, Grid, Image, Text } = require('components/display');
const ButtonRed = require('components/Button/ButtonRed');
const Price = require('components/ProductPage/Price/Price');
const ProductImage = require('components/Product/ProductImage/ProductImage');
const ProductVariation = require('components/Product/ProductVariation/ProductVariation');
const ProductSwatchItem = require('components/Product/ProductSwatchItem/ProductSwatchItem');
const SkuQuantity = require('components/Product/SkuQuantity/SkuQuantity');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const ButtonOutline = require('components/Button/ButtonOutline');
const Link = require('components/Link/Link');
const Container = require('components/Container/Container');
const Divider = require('components/Divider/Divider');
const skuUtils = require('utils/Sku');
const uiUtils = require('utils/UI');
const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;
const CUSTOM_SETS_TYPE = skuUtils.CUSTOM_SETS_TYPE;

const SKU_IMG_SIZE_MOBILE = 50;

const CustomSets = function () {
    let currentProduct = Object.assign({}, this.props);
    let {
        currentSku
    } = currentProduct;
    let {
        configurableOptions = {}
    } = currentSku;
    let {
        groupedSkuOptions = []
    } = configurableOptions;

    let skuOptions = configurableOptions.skuOptions || [];
    this.state = {
        type: skuOptions.length ? CUSTOM_SETS_TYPE.SINGLE_SKU :
            (groupedSkuOptions.length ? CUSTOM_SETS_TYPE.GROUPED_SKU :
                CUSTOM_SETS_TYPE.UNKNOWN_SKU),
        choices: []
    };
    this.groupedSwatches = [];
    switch (this.state.type) {
        case CUSTOM_SETS_TYPE.SINGLE_SKU:
            this.state.skuOptions = skuOptions;
            break;
        case CUSTOM_SETS_TYPE.GROUPED_SKU:
            this.state.skuOptions = groupedSkuOptions.map(groupedSkuOption => {
                groupedSkuOption.selectedSku = groupedSkuOption.skuOptions[0];
                groupedSkuOption.selectedSku.primaryProduct = {
                    brand: {
                        displayName: groupedSkuOption.groupProduct.brand.displayName
                    },
                    displayName: groupedSkuOption.groupProduct.displayName
                };
                groupedSkuOption.isExpanded = false;
                return groupedSkuOption;
            });
            break;
        default:
            this.state.skuOptions = [];
    }
};

CustomSets.prototype.render = function () {
    let currentProduct = Object.assign({}, this.props);
    let {
        currentSku
    } = currentProduct;
    let hasChoices = this.state.choices.length;
    return (
        <div>
            {Sephora.isMobile() &&
                <Box
                    position='fixed'
                    zIndex={zIndex.HEADER}
                    right={0} bottom={0} left={0}
                    padding={space[4]}
                    backgroundImage='linear-gradient(to bottom, rgba(255,255,255,.75), rgba(255,255,255,1))'
                    _css={{ backfaceVisibility: 'hidden' }}>
                    <Grid
                        gutter={space[4]}
                        alignItems='center'>
                        <Grid.Cell
                            width='fit'>
                            <ProductImage
                                skuImages={currentSku.skuImages}
                                size={IMAGE_SIZES[97]}
                                width={SKU_IMG_SIZE_MOBILE} />
                        </Grid.Cell>
                        <Grid.Cell
                            width='fill'>
                            <Price
                                textAlign='left'
                                fontSize='h4'
                                {...currentProduct}/>
                        </Grid.Cell>
                        <Grid.Cell
                            width='fit'>
                            <ButtonRed
                                disabled={!hasChoices ? 'true' : null }
                                onClick={this.addToBasket}>
                                Add all to Basket
                            </ButtonRed>
                        </Grid.Cell>
                    </Grid>
                </Box>
            }
            {this.getMainBody(currentSku, currentProduct)}
        </div>
    );
};

CustomSets.prototype.getMainBody = function (currentSku, currentProduct) {
    const isMobile = Sephora.isMobile();
    let hasChoices = this.state.choices.length;
    let yourChoicesType = this.getCustomSetsRenderType(true);
    return (
        <Box
            paddingY={space[4]}>
            {hasChoices ?
                <div>
                    <Text
                        is='h3'
                        fontSize='h3'
                        fontWeight={700}
                        lineHeight={2}
                        marginBottom={space[4]}>
                        Your choices
                    </Text>
                    {this.state.type === CUSTOM_SETS_TYPE.GROUPED_SKU &&
                        <Grid
                            gutter={isMobile ? space[4] : space[5]}
                            marginBottom={isMobile ? space[4] : space[3]}>
                            <Grid.Cell
                                width='fit'>
                                <ProductImage
                                    skuImages={currentSku.skuImages}
                                    size={IMAGE_SIZES[97]}
                                    width={isMobile ? SKU_IMG_SIZE_MOBILE : null} />
                            </Grid.Cell>
                            <Grid.Cell
                                width='fill'
                                lineHeight={2}>
                                <Box
                                    fontWeight={700}
                                    textTransform='uppercase'>
                                    {currentProduct.brand.displayName}
                                </Box>
                                {currentProduct.displayName}
                            </Grid.Cell>
                        </Grid>
                    }
                    {this.getYourChoices(this.state.choices)}
                    {this.state.skuOptions.length > 0 &&
                        <Box
                            backgroundColor='lightGray'
                            marginY={space[4]}
                            height={isMobile ? space[2] : 1}
                            marginX={isMobile ? -space[4] : null} />
                    }
                    <div>{this.getCustomSetImageCopy(this.state.choices, currentSku)}</div>
                </div>
            : null}
            {(currentSku.configurableOptions.description &&
                this.state.skuOptions.length > 0) &&
                <Text
                    is='h3'
                    fontSize='h3'
                    lineHeight={2}
                    fontWeight={700}>
                    {currentSku.configurableOptions.description}
                </Text>
            }
            { this.state.type === CUSTOM_SETS_TYPE.SINGLE_SKU ?
                this.getSingleSkuList(this.state.skuOptions, this.state.choices) :
                this.state.type === CUSTOM_SETS_TYPE.GROUPED_SKU ?
                    this.getGroupedSkuList(this.state.skuOptions, currentProduct) :
                    <div>NO SELECTIONS AVAILABLE</div>
            }
        </Box>
    );
};

CustomSets.prototype.getCustomSetsRenderType = function (isYourChoice) {
    if (isYourChoice) {
        return this.state.type.YOUR_CHOICES;
    } else {
        return this.state.type.SKU_LIST;
    }
};

CustomSets.prototype.getYourChoices = function (choices) {
    let type = this.getCustomSetsRenderType(true);
    return this.renderSkus(choices, true, choices, type);
};

CustomSets.prototype.getSingleSkuList = function (skuOptions, choices) {
    let type = this.getCustomSetsRenderType();
    return this.renderSkus(skuOptions, false, choices, type);
};

CustomSets.prototype.renderSkus = function (skus, isSelected, choices, type) {
    switch (type) {
        case CUSTOM_SETS_TYPE.SINGLE_SKU.YOUR_CHOICES:
        case CUSTOM_SETS_TYPE.GROUPED_SKU.YOUR_CHOICES:
            return skus.map((sku, index) => {
                return this.getSkuItem(sku, index, type, true);
            });
        case CUSTOM_SETS_TYPE.SINGLE_SKU.SKU_LIST:
            return (
                <Grid gutter={space[5]}>
                    {skus.map((sku, index) => {
                        let isCurrentSelected = choices.filter(choiceSku =>
                        choiceSku.skuId === sku.skuId).length;
                        return (
                            <Grid.Cell
                                display='flex'
                                textAlign='center'
                                width={Sephora.isMobile() ? '50%' : '25%'}
                                paddingY={space[4]}>
                                {this.getSkuItem(sku, index, type, isCurrentSelected)}
                            </Grid.Cell>
                        );
                    })}
                </Grid>
            );
        case CUSTOM_SETS_TYPE.GROUPED_SKU.SKU_LIST:
            return this.getGroupedSkuList(skus);
        default:
            return null;
    }
};

CustomSets.prototype.getSkuItem = function (sku, index, type, isCurrentSelected) {

    const isMobile = Sephora.isMobile();
    const imageSize = IMAGE_SIZES[97];

    const skuDescription = (
        <Box lineHeight={2}>
            <Box
                fontWeight={700}
                textTransform='uppercase'>
                {sku.primaryProduct.brand.displayName}
            </Box>
            {sku.primaryProduct.displayName}
            {(sku.variationType && sku.variationType !== skuUtils.skuVariationType.NONE) &&
                <Box
                    marginTop={space[2]}>
                    <Text
                        marginRight={space[1]}
                        textTransform='uppercase'>
                        {sku.variationType}:
                    </Text>
                    <span className='OneLinkNoTx'>
                        {sku.variationValue}
                    </span>
                </Box>
            }
        </Box>
    );

    switch (type) {
        case CUSTOM_SETS_TYPE.SINGLE_SKU.YOUR_CHOICES:
        case CUSTOM_SETS_TYPE.GROUPED_SKU.YOUR_CHOICES:
            return (
                <Box
                    key={index}
                    fontSize='h5'>
                    {isMobile &&
                        <Divider
                            marginY={space[4]}
                            color='lightGray' />
                    }
                    <Box
                        paddingY={!isMobile ? space[3] : null}>
                        <Grid gutter={isMobile ? space[4] : space[5]}>
                            <Grid.Cell
                                width='fit'>
                                <ProductImage
                                    skuImages={sku.skuImages}
                                    size={imageSize}
                                    width={isMobile ? SKU_IMG_SIZE_MOBILE : null} />
                            </Grid.Cell>
                            <Grid.Cell
                                width='fill'>
                                {skuDescription}
                            </Grid.Cell>
                            <Grid.Cell
                                width='fit'>
                                <Link
                                    muted={true}
                                    fontSize='h5'
                                    fontWeight={700}
                                    textTransform='uppercase'
                                    padding={space[3]}
                                    margin={-space[3]}
                                    onClick={()=> this.removeSingleSku(sku, index, type)}>
                                    Remove
                                </Link>
                            </Grid.Cell>
                        </Grid>
                    </Box>
                </Box>
            );
        case CUSTOM_SETS_TYPE.SINGLE_SKU.SKU_LIST:
        case CUSTOM_SETS_TYPE.GROUPED_SKU.SKU_LIST:
            return (
                <Flex
                    key={index}
                    width={1}
                    fontSize='h5'
                    lineHeight={2}
                    flexDirection='column'>
                    <div>
                        <ProductImage
                            skuImages={sku.skuImages}
                            size={imageSize}
                            width={isMobile ? SKU_IMG_SIZE_MOBILE : null}
                            marginX='auto' />
                        <Box marginTop={space[2]}>
                            {skuDescription}
                        </Box>
                    </div>
                    <Box
                        marginTop='auto'
                        paddingTop={space[2]}>
                        <ButtonOutline
                            size={Sephora.isMobile() ? 'sm' : null}
                            onClick={()=> this.selectSingleSku(sku, index, type)}>
                            Select
                        </ButtonOutline>
                    </Box>
                </Flex>
            );
        default:
            return null;
    }
};

CustomSets.prototype.getGroupedSkuList = function (groupedSkuOptions, currentProduct) {
    let type = this.getCustomSetsRenderType();
    let isMobile = Sephora.isMobile();
    return groupedSkuOptions.map((groupedSkuOption, groupedIndex) => {
        let currentSku = groupedSkuOption.selectedSku;
        let skuSelectorType = currentSku.variationType === skuUtils.skuVariationType.COLOR ?
            skuUtils.skuSwatchType.IMAGE : skuUtils.skuSwatchType.TEXT;
        let groupCurrentProduct = Object.assign(groupedSkuOption.groupProduct, {
            skuSelectorType: skuSelectorType,
            swatchType: 'Image - 36',
            currentSku: currentSku
        });
        const swatchSize = uiUtils.swatchSize(groupCurrentProduct);
        const swatchHeight = swatchSize.height + swatch.PADDING * 2 + swatch.BORDER_WIDTH * 2;
        const swatchOutdent = swatch.PADDING + swatch.BORDER_WIDTH;
        const selectButton = (
            <Box marginTop={space[4]}>
                <ButtonOutline
                    block={!isMobile}
                    onClick={()=> this.addToSetGroupedSku(groupedIndex)}>
                    Select
                </ButtonOutline>
            </Box>
        );
        const swatchesBlock = currentSku.variationType &&
            currentSku.variationType !== skuUtils.skuVariationType.NONE ? (
            <Box
                marginTop={space[4]}>
                <ProductVariation
                    product={currentProduct}
                    sku={currentSku} />
                <Box
                    marginTop={isMobile ? space[3] : space[4]}
                    ref={ c => {
                        this.groupedSwatches[groupedIndex] = this.groupedSwatches[groupedIndex] || {};
                        this.groupedSwatches[groupedIndex].component = c;
                    }}
                    _css={!groupedSkuOption.isExpanded ? {
                        marginLeft: isMobile ? -space[4] : null,
                        marginRight: isMobile ? -space[4] : null,
                        paddingLeft: isMobile ? space[4] : null,
                        paddingRight: isMobile ? space[4] : null,
                        height: swatchHeight,
                        whiteSpace: 'nowrap',
                        overflowY: 'hidden',
                        overflowX: 'auto',
                        '&::-webkit-scrollbar': { display: 'none' }
                    } : {}}>
                    {groupedSkuOption.skuOptions.map((sku, index) =>
                        <ProductSwatchItem
                            key={index}
                            product={groupCurrentProduct}
                            sku={sku}
                            size={swatchSize}
                            activeSku={currentSku}
                            handleSkuOnClick={clickedSku => this.handleGroupedSkuOnClick(clickedSku,
                                groupedIndex)}
                            handleSkuOnMouseEnter={()=>{}}
                            handleSkuOnMouseLeave={()=>{}}/>
                    )}
                </Box>
                {this.getViewButton(groupedSkuOption, groupedIndex)}
            </Box>
        ) : null;
        return (
            <Box
                lineHeight={2}>
                <Divider marginY={space[4]} />
                <Grid
                    key={groupedIndex}
                    gutter={space[5]}>
                    <Grid.Cell
                        width='fit'>
                        <ProductImage
                            skuImages={currentSku.skuImages}
                            size={IMAGE_SIZES[97]} />
                        {isMobile || selectButton}
                    </Grid.Cell>
                    <Grid.Cell
                        width='fill'>
                        <Box
                            fontWeight={700}
                            textTransform='uppercase'>
                            {groupCurrentProduct.brand.displayName}
                        </Box>
                        {groupCurrentProduct.displayName}
                        {isMobile ? selectButton : swatchesBlock}
                    </Grid.Cell>
                </Grid>
                {isMobile && swatchesBlock}
            </Box>
        );
    });
};

CustomSets.prototype.getViewButton = function (groupedSkuOption, groupedIndex) {
    let groupedSwatch = this.groupedSwatches[groupedIndex];
    // Have to wait for first rendering on front-end to calculate size of horizontal bar
    if (groupedSwatch && typeof groupedSwatch.hasHorizontalScrollBar !== 'boolean') {
        groupedSwatch.hasHorizontalScrollBar =
            uiUtils.hasHorizontalScrollBar(groupedSwatch.component);
    }
    return (
        groupedSkuOption.isExpanded || (groupedSwatch && groupedSwatch.hasHorizontalScrollBar)
            ?
            <Box
                textAlign='right'
                marginTop={space[3]}>
                <Link
                    padding={space[2]}
                    margin={-space[2]}
                    arrowDirection={groupedSkuOption.isExpanded ? 'up' : 'down'}
                    textAlign='right'
                    onClick={() => this.toggleExpand(groupedIndex)}>
                    View
                    {' '}
                    {groupedSkuOption.isExpanded ? 'less ' : 'all '}
                    {groupedSkuOption.groupProduct.variationType}
                </Link>
            </Box> : null
    );
};

CustomSets.prototype.getCustomSetImageCopy = function (skus, currentSku) {
    if (!this.state.currentSkuQuantity || this.state.type === CUSTOM_SETS_TYPE.SINGLE_SKU) {
        return null;
    }
    let insufficientSkusMessages = [];
    let title = currentSku.configurableOptions.imageCopy;
    if (title) {
        for (let i = 0; i < Math.max(this.state.currentSkuQuantity - skus.length, 0); i++) {
            insufficientSkusMessages.push(
                <Box paddingBottom={60}>{title}</Box>);
        }
    }
    return insufficientSkusMessages;
};


// Added by sephora-jsx-loader.js
CustomSets.prototype.path = 'ProductPage/CustomSets';
// Added by sephora-jsx-loader.js
Object.assign(CustomSets.prototype, require('./CustomSets.c.js'));
var originalDidMount = CustomSets.prototype.componentDidMount;
CustomSets.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: CustomSets');
if (originalDidMount) originalDidMount.apply(this);
if (CustomSets.prototype.ctrlr) CustomSets.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: CustomSets');
// Added by sephora-jsx-loader.js
CustomSets.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
CustomSets.prototype.class = 'CustomSets';
// Added by sephora-jsx-loader.js
CustomSets.prototype.getInitialState = function() {
    CustomSets.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
CustomSets.prototype.render = wrapComponentRender(CustomSets.prototype.render);
// Added by sephora-jsx-loader.js
var CustomSetsClass = React.createClass(CustomSets.prototype);
// Added by sephora-jsx-loader.js
CustomSetsClass.prototype.classRef = CustomSetsClass;
// Added by sephora-jsx-loader.js
Object.assign(CustomSetsClass, CustomSets);
// Added by sephora-jsx-loader.js
module.exports = CustomSetsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/CustomSets/CustomSets.jsx