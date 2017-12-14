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
    Sephora.Util.InflatorComps.Comps['ProductBadges'] = function ProductBadges(){
        return ProductBadgesClass;
    }
}
const { colors } = require('style');
const { Box, Flex } = require('components/display');
const skuUtils = require('utils/Sku');

const ProductBadges = function () {};

ProductBadges.prototype.render = function () {
    let {
        sku,
        left,
        isSmall
    } = this.props;

    const biExclusiveLevel = sku.biExclusiveLevel;
    const badgeStyle = {
        backgroundColor: colors.black,
        lineHeight: 1,
        height: isSmall ? 19 : 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: isSmall ? 4 : 8
    };
    return (
        <Box
            position='absolute'
            top={0}
            left={left || 0}
            color='white'
            fontWeight={700}
            fontSize={isSmall ? 9 : 12}
            width='5em'>
            {sku.isNew &&
                <Flex
                    fontSize={isSmall ? 10 : null}
                    _css={badgeStyle}>
                    NEW
                </Flex>
            }
            {(biExclusiveLevel === skuUtils.biExclusiveLevels.ROUGE ||
              biExclusiveLevel === skuUtils.biExclusiveLevels.VIB ||
              biExclusiveLevel === skuUtils.biExclusiveLevels.BI) &&
                <Flex
                    color='red'
                    _css={badgeStyle}>
                    ROUGE
                </Flex>
            }
            {(biExclusiveLevel === skuUtils.biExclusiveLevels.VIB ||
              biExclusiveLevel === skuUtils.biExclusiveLevels.BI) &&
                <Flex
                    _css={badgeStyle}>
                    VIB
                </Flex>
            }
            {biExclusiveLevel === skuUtils.biExclusiveLevels.BI &&
                <Flex
                    _css={badgeStyle}>
                    INSIDER
                </Flex>
            }
        </Box>
    );
};


// Added by sephora-jsx-loader.js
ProductBadges.prototype.path = 'Product/ProductBadges';
// Added by sephora-jsx-loader.js
ProductBadges.prototype.class = 'ProductBadges';
// Added by sephora-jsx-loader.js
ProductBadges.prototype.getInitialState = function() {
    ProductBadges.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ProductBadges.prototype.render = wrapComponentRender(ProductBadges.prototype.render);
// Added by sephora-jsx-loader.js
var ProductBadgesClass = React.createClass(ProductBadges.prototype);
// Added by sephora-jsx-loader.js
ProductBadgesClass.prototype.classRef = ProductBadgesClass;
// Added by sephora-jsx-loader.js
Object.assign(ProductBadgesClass, ProductBadges);
// Added by sephora-jsx-loader.js
module.exports = ProductBadgesClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Product/ProductBadges/ProductBadges.jsx