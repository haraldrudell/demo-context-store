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
    Sephora.Util.InflatorComps.Comps['ProductFinderGrid'] = function ProductFinderGrid(){
        return ProductFinderGridClass;
    }
}
const space = require('style').space;
const Grid = require('components/Grid/Grid');
const ProductItem = require('components/Product/ProductItem/ProductItem');
const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;
const ProductFinderGrid = function () { };

// TODO 2017.6: This component needs style cc Jesse
ProductFinderGrid.prototype.render = function () {
    const isMobile = Sephora.isMobile();
    const { products } = this.props;
    return (
        <Grid
            gutter={space[5]}>
            {
                products.length && products.map((product, index) => {
                    return (
                        <Grid.Cell
                            display='flex'
                            marginY={isMobile ? space[4] : space[5]}
                            width={isMobile ? 1 / 2 : 1 / 4}>
                            <ProductItem
                                showMarketingFlags={true}
                                showReviews={true}
                                showLoves={true}
                                showPrice={true}
                                isUseAddToBasket={true}
                                disableLazyLoad={true}
                                imageSize={IMAGE_SIZES[135]}
                                key={index}
                                {...product} />
                        </Grid.Cell>
                    );
                })
            }
        </Grid>
    );
};


// Added by sephora-jsx-loader.js
ProductFinderGrid.prototype.path = 'ProductFinderGrid';
// Added by sephora-jsx-loader.js
ProductFinderGrid.prototype.class = 'ProductFinderGrid';
// Added by sephora-jsx-loader.js
ProductFinderGrid.prototype.getInitialState = function() {
    ProductFinderGrid.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ProductFinderGrid.prototype.render = wrapComponentRender(ProductFinderGrid.prototype.render);
// Added by sephora-jsx-loader.js
var ProductFinderGridClass = React.createClass(ProductFinderGrid.prototype);
// Added by sephora-jsx-loader.js
ProductFinderGridClass.prototype.classRef = ProductFinderGridClass;
// Added by sephora-jsx-loader.js
Object.assign(ProductFinderGridClass, ProductFinderGrid);
// Added by sephora-jsx-loader.js
module.exports = ProductFinderGridClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductFinderGrid/ProductFinderGrid.jsx