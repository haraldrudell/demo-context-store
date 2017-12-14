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
    Sephora.Util.InflatorComps.Comps['Swatches'] = function Swatches(){
        return SwatchesClass;
    }
}
const { space, swatch } = require('style');
const { Box, Flex, Text } = require('components/display');
const ProductSwatchItem = require('components/Product/ProductSwatchItem/ProductSwatchItem');
const uiUtils = require('utils/UI');
const skuUtils = require('utils/Sku');
const Chevron = require('components/Chevron/Chevron');
const Price = require('components/ProductPage/Price/Price');
const Link = require('components/Link/Link');
const layout = require('components/ProductPage/settings').layout;
const SALE_GROUP_NAME = 'Sale';
const REFINEMENT_LABELS = {
    SIZE: ' size',
    FINISH: ' finish',
    STANDARD: 'Standard'
};
const COLLAPSED_SWATCHES_LINES = 3;

let getSkus = function (product) {
    let { regularChildSkus = [],
        onSaleChildSkus = [] } = product;
    return regularChildSkus.concat(onSaleChildSkus);
};

const Swatches = function () {
    let currentProduct = this.props;
    this.state = {
        refinementGroups: this.getRefinementGroups(currentProduct),
        showSaleBadge: this.isShowSaleBadge(currentProduct),
        expandedRefinementGroups: [],
        expandable: false
    };
    this.groupedSwatches = [];
};

Swatches.prototype.render = function () {
    let currentProduct = this.props;
    let { currentSku } = currentProduct;
    let selectorType = currentProduct.skuSelectorType;
    if (!selectorType || selectorType === skuUtils.skuSwatchType.NONE) {
        return null;
    } else {
        const swatchOutdent = swatch.PADDING + swatch.BORDER_WIDTH;
        const swatchSize = uiUtils.swatchSize(currentProduct);
        const swatchHeight =
            selectorType === skuUtils.skuSwatchType.TEXT ||
            selectorType === skuUtils.skuSwatchType.SIZE
                ?
                    swatch.FONT_SIZE +
                    (swatch.TEXT_PADDING_VERT * 2) +
                    (swatch.TEXT_BORDER_WIDTH * 2) +
                    (swatch.PADDING * 2) +
                    (swatch.BORDER_WIDTH * 2)
                :
                    swatchSize.height +
                    (swatch.PADDING * 2) +
                    (swatch.BORDER_WIDTH * 2);
        let showSaleBadge = this.state.showSaleBadge;
        let height = showSaleBadge ? swatchHeight + (swatch.SALE_BADGE_HEIGHT / 2) : swatchHeight;
        swatchSize.fullSize = height;

        let refinementGroups = this.state.refinementGroups;
        return (
            <Box
                textAlign='left'
                marginY={Sephora.isMobile() ? space[4] : null}>
                {refinementGroups &&
                 !this.isShowRefinements() &&
                 !this.state.isExpanded ?
                    <Box
                        marginBottom={space[1]}>
                        {this.currentSkuRefinementName}
                    </Box>
                : null}
                <Box
                    _css={Sephora.isMobile() &&
                        !this.state.isExpanded ? {
                            marginLeft: -space[4],
                            marginRight: -space[4],
                            paddingLeft: space[4],
                            paddingRight: space[4],
                            height: height,
                            whiteSpace: 'nowrap',
                            overflowY: 'hidden',
                            overflowX: 'auto',
                            WebkitOverflowScrolling: 'touch',
                            '&::-webkit-scrollbar': { display: 'none' }
                        } : {}}>
                    {refinementGroups && this.isShowRefinements() ?
                        refinementGroups.map((group, index) =>
                            <Box position='relative'>
                                {group.refinementName &&
                                    <Flex
                                        marginTop={index > 0 ? space[3] : null}
                                        marginBottom={space[1]}>
                                        {group.refinementName}
                                        {group.refinementName === SALE_GROUP_NAME &&
                                            <Box
                                                marginLeft={space[2]}>
                                                <Text
                                                    color='silver'
                                                    textDecoration='line-through'>
                                                    {currentSku.listPrice}
                                                </Text>
                                                {' '}
                                                <Text
                                                    fontWeight={700}
                                                    color='red'>
                                                    {this.getSaleGroupRange(group)}
                                                </Text>
                                            </Box>
                                        }
                                    </Flex>
                                }
                                {this.getRefinementProductSwatchGroup(currentProduct, group, height,
                                    this.state.expandedRefinementGroups[index],
                                    swatchOutdent, swatchSize, currentSku,
                                    showSaleBadge, index)}
                                {this.getExpandRefinementGroupButton(group, index, swatchSize)}
                            </Box>
                        )
                        :
                        this.getProductSwatchGroup(currentProduct, getSkus(currentProduct), height,
                            this.state.isExpanded, swatchOutdent, swatchSize, currentSku,
                            showSaleBadge, 0)
                    }
                </Box>
                {Sephora.isMobile() &&
                    this.getViewButton(currentSku, getSkus(currentProduct).length)}
            </Box>
        );
    }
};

Swatches.prototype.getRefinementProductSwatchGroup = function (currentProduct, group, height,
    isExpanded, swatchOutdent, swatchSize, currentSku, showSaleBadge, index) {
    let groupSkus = [];
    group.groupEntries.forEach(groupEntry => groupSkus = groupSkus.concat(getSkus(groupEntry)));
    return this.getProductSwatchGroup(currentProduct, groupSkus, height,
        isExpanded, swatchOutdent, swatchSize, currentSku,
        showSaleBadge, index);
};

Swatches.prototype.getProductSwatchGroup = function (currentProduct, skus, height, isExpanded,
    swatchOutdent, swatchSize, currentSku, showSaleBadge, groupedIndex) {
    if (skuUtils.isFragrance(currentProduct, currentSku) && Sephora.isDesktop()) {
        height = null;
        isExpanded = true;
        swatchOutdent = space[1];
    }
    return skus.length ? <Box
        ref={ c => {
            this.groupedSwatches[groupedIndex] = c;
        }}
        fontSize={0}
        marginX={-swatchOutdent}
        _css={this.getSwatchesBlockStyles(height, isExpanded, skus.length)}>
        {skus.map((sku, index) =>
            <ProductSwatchItem
                useFragranceSwatch={true}
                key={index}
                product={currentProduct}
                sku={sku}
                size={swatchSize}
                activeSku={currentSku}
                showSaleBadge={showSaleBadge}
                showColorMatchBadge={this.props.showColorMatch}
                handleSkuOnClick={this.handleSkuOnClick}
                handleSkuOnMouseEnter={this.handleSkuOnMouseEnter}
                handleSkuOnMouseLeave={this.handleSkuOnMouseLeave}
                disableLazyLoad={true}/>
        )}
    </Box> : null;
};

Swatches.prototype.getSwatchesBlockStyles = function (swatchHeight, isExpanded, numSkus) {
    return !isExpanded && Sephora.isDesktop() ? {
        height: swatchHeight * (this.isSwatchBlockPartInvisible(numSkus, swatchHeight) ?
            COLLAPSED_SWATCHES_LINES : Math.ceil(numSkus * swatchHeight /
            layout.MAIN_WIDTH)),
        overflow: 'hidden'
    } : {};
};

Swatches.prototype.isShowRefinements = function () {
    return !Sephora.isMobile() || this.state.isExpanded;
};

Swatches.prototype.getViewButton = function (currentSku, numberOfSkus) {
    if (!this.groupedSwatches[0]) {
        setTimeout(() => this.forceUpdate(), 1);
        return null;
    }
    let variationTypeText = currentSku.variationType ? currentSku.variationType + 's' : '';
    return (
        numberOfSkus && this.state.expandable ?
        <Box
            textAlign='right'
            marginTop={space[3]}>
            <Link
                padding={space[2]}
                margin={-space[2]}
                textAlign='right'
                arrowDirection={this.state.isExpanded ? 'up' : 'down'}
                onClick={this.toggleExpand}>
                View
                {' '}
                {this.state.isExpanded ? 'less ' : 'all '}
                {' '}
                {variationTypeText.toLowerCase()}
            </Link>
        </Box> : null
    );
};

Swatches.prototype.isSwatchBlockPartInvisible = function (numSkus, swatchHeight) {
    return (numSkus * swatchHeight /
        (layout.MAIN_WIDTH * COLLAPSED_SWATCHES_LINES)) > 1;
};

Swatches.prototype.getExpandRefinementGroupButton = function (group, index, swatchSize) {
    let numSkus = 0;
    group.groupEntries.forEach((groupEntry) => {
        numSkus += groupEntry.onSaleChildSkus.length;
        numSkus += groupEntry.regularChildSkus.length;
    });
    let isExpanded = this.state.expandedRefinementGroups[index];
    let isPartOfGroupNotVisible = this.isSwatchBlockPartInvisible(numSkus, swatchSize.fullSize);
    return (
        numSkus && isPartOfGroupNotVisible && Sephora.isDesktop() &&
            <Box
                onClick={() => this.toggleRefinementGroupExpand(index)}
                position={!isExpanded ? 'absolute' : 'relative'}
                left={0}
                bottom={0}
                width='100%'
                marginTop={space[1]}>
                <Flex
                    alignItems='center'
                    justifyContent='center'
                    fontSize='h5'
                    lineHeight={1}
                    paddingY={space[2]}
                    marginLeft={-(swatch.PADDING + swatch.BORDER_WIDTH)}
                    backgroundColor='hsla(0,0%,93%,.8)'
                    _css={!Sephora.isTouch ? {
                        ':hover': {
                            backgroundColor: 'hsla(0,0%,93%,.9)'
                        }
                    } : {}}>
                    <Text
                        fontWeight={700}
                        textTransform='uppercase'>
                        View {isExpanded ? 'less ' : 'more '}
                    </Text>
                    <Chevron
                        marginLeft='.5em'
                        direction={isExpanded ? 'up' : 'down'} />
                </Flex>
            </Box>
    );
};

Swatches.prototype.isShowSaleBadge = function (currentProduct) {
    let { regularChildSkus = [],
        onSaleChildSkus = [] } = currentProduct;
    return Sephora.isMobile() && !!(onSaleChildSkus.length ||
        regularChildSkus.filter(item => item.salePrice).length);
};

Swatches.prototype.getRefinementGroups = function (currentProduct) {
    let {
        currentSku = {},
        regularChildSkus = [],
        onSaleChildSkus = []
    } = currentProduct;
    let refinementTypes = [].concat(this.sortSkusByRefinement(regularChildSkus,
        'regularChildSkus', currentSku));
    refinementTypes = refinementTypes.concat(this.sortSkusByRefinement(onSaleChildSkus,
        'onSaleChildSkus', currentSku));
    return refinementTypes.length && refinementTypes;
};

Swatches.prototype.sortSkusByRefinement = function (productSkus, skuType, currentSku) {
    let refinementGroups = [];
    let isShowSizeName = !!productSkus.filter(sku => sku.refinements &&
        sku.refinements.sizeRefinements && sku.refinements.sizeRefinements.length).length;
    productSkus.forEach(loopedSku => {
        if (loopedSku.refinements) {
            let skuFinishRefinementTypes = loopedSku.refinements.finishRefinements || [null];
            let skuSizeRefinementTypes = loopedSku.refinements.sizeRefinements ||
                [REFINEMENT_LABELS.STANDARD];
            if (skuType === 'onSaleChildSkus') {
                loopedSku.refinementName = this.getRefinementName(loopedSku);
                if (loopedSku.skuId === currentSku.skuId) {
                    this.currentSkuRefinementName = loopedSku.refinementName;
                }

                this.addSkuToRefinementGroup(loopedSku, SALE_GROUP_NAME, refinementGroups, skuType);
            } else {
                skuSizeRefinementTypes.forEach(sizeType => {
                    skuFinishRefinementTypes.forEach(finishType => {
                        loopedSku.refinementName = this.getRefinementName(loopedSku,
                            isShowSizeName, sizeType, finishType);
                        if (loopedSku.skuId === currentSku.skuId) {
                            this.currentSkuRefinementName = loopedSku.refinementName;
                        }

                        this.addSkuToRefinementGroup(loopedSku, loopedSku.refinementName,
                            refinementGroups, skuType);
                    });
                });
            }
        } else {
            let refinementName = loopedSku.type === 'Standard' && loopedSku.size ?
                                    REFINEMENT_LABELS.STANDARD + REFINEMENT_LABELS.SIZE :
                                    '';
            this.addSkuToRefinementGroup(loopedSku, refinementName, refinementGroups, skuType);
        }
    });
    refinementGroups.sort(this.sortRefinementGroups);
    return refinementGroups;

};

Swatches.prototype.sortRefinementGroups = function (group1, group2) {
    let groupName1 = group1.refinementName;
    let groupName2 = group2.refinementName;
    if (groupName1 === SALE_GROUP_NAME) {
        return 1;
    } else if (groupName2 === SALE_GROUP_NAME) {
        return -1;
    } else if (groupName1.indexOf('Standard') > -1) {
        return -1;
    } else if (groupName2.indexOf('Standard') > -1) {
        return 1;
    } else if (!groupName1) {
        return 1;
    } else if (!groupName2) {
        return -1;
    } else if (groupName1 && !groupName2) {
        return -1;
    } else if (groupName2 && !groupName1) {
        return 1;
    } else {
        return groupName1 >= groupName2;
    }
};

Swatches.prototype.addSkuToRefinementGroup = function (loopedSku, groupName, groups, skuType) {
    if (skuType === 'onSaleChildSkus') {
        groupName = SALE_GROUP_NAME;
    }

    let refinementGroup = groups.filter(refGroup => groupName === refGroup.refinementName);
    refinementGroup = refinementGroup.length ? refinementGroup[0] : null;
    let entries = refinementGroup ? refinementGroup.groupEntries[0] : { onSaleChildSkus: [],
        regularChildSkus: [] };
    let skuTypedEntries = entries[skuType];
    skuTypedEntries.push(loopedSku);
    entries[skuType] = skuTypedEntries;
    if (!refinementGroup) {
        refinementGroup = {
            refinementName: groupName,
            groupEntries: [entries]
        };
        if (refinementGroup.refinementName === SALE_GROUP_NAME) {
            refinementGroup.saleMinPrice = skuUtils.parsePrice(loopedSku.salePrice);
            refinementGroup.saleMaxPrice = skuUtils.parsePrice(loopedSku.salePrice);
            refinementGroup.currencyPrefix = loopedSku.salePrice.match(/^\D+/)[0];
        }
        groups.push(refinementGroup);
    }
    if (refinementGroup.refinementName === SALE_GROUP_NAME) {
        refinementGroup.saleMinPrice = Math.min(
            refinementGroup.saleMinPrice,
            skuUtils.parsePrice(loopedSku.salePrice));
        refinementGroup.saleMaxPrice = Math.max(
            refinementGroup.saleMaxPrice,
            skuUtils.parsePrice(loopedSku.salePrice));
    }
};

Swatches.prototype.getRefinementName = function (refineSku, isShowSizeName, sizeType, finishType) {
    let refinement;
    if (refineSku.salePrice) {
        refinement = SALE_GROUP_NAME;
    } else if (isShowSizeName) {
        refinement = sizeType + REFINEMENT_LABELS.SIZE;
        refinement = finishType ? refinement + ': ' + finishType + REFINEMENT_LABELS.FINISH :
            refinement;
    } else {
        refinement = finishType ? finishType + REFINEMENT_LABELS.FINISH : '';
    }

    return refinement;
};

Swatches.prototype.getSaleGroupRange = function (group) {
    if (group.saleMinPrice === group.saleMaxPrice) {
        return <span>{group.currencyPrefix}{group.saleMinPrice.toFixed(2)}</span>;
    } else {
        return <span>
            {group.currencyPrefix}{group.saleMinPrice.toFixed(2)} - {group.currencyPrefix}
            {group.saleMaxPrice.toFixed(2)}</span>;
    }
};


// Added by sephora-jsx-loader.js
Swatches.prototype.path = 'ProductPage/Swatches';
// Added by sephora-jsx-loader.js
Object.assign(Swatches.prototype, require('./Swatches.c.js'));
var originalDidMount = Swatches.prototype.componentDidMount;
Swatches.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Swatches');
if (originalDidMount) originalDidMount.apply(this);
if (Swatches.prototype.ctrlr) Swatches.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Swatches');
// Added by sephora-jsx-loader.js
Swatches.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Swatches.prototype.class = 'Swatches';
// Added by sephora-jsx-loader.js
Swatches.prototype.getInitialState = function() {
    Swatches.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Swatches.prototype.render = wrapComponentRender(Swatches.prototype.render);
// Added by sephora-jsx-loader.js
var SwatchesClass = React.createClass(Swatches.prototype);
// Added by sephora-jsx-loader.js
SwatchesClass.prototype.classRef = SwatchesClass;
// Added by sephora-jsx-loader.js
Object.assign(SwatchesClass, Swatches);
// Added by sephora-jsx-loader.js
module.exports = SwatchesClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/Swatches/Swatches.jsx