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
    Sephora.Util.InflatorComps.Comps['ProductGrid'] = function ProductGrid(){
        return ProductGridClass;
    }
}
const {
 space 
} = require('style');

const ProductItem = require('components/Product/ProductItem/ProductItem');
const Grid = require('components/Grid/Grid');

var ProductGrid = function () {
    this.state = {
        currentPage: 1,
        products: this.props.products,
        categoryId: this.props.categoryId
    };
};

const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;

ProductGrid.prototype.render = function () {
    const cellSize = Sephora.isMobile() ? 2 : 4;
    return (
     <Grid gutter={space[5]}>
			{
       this.state.products
        ?
         this.state.products.map(product => {
             <Grid.Cell
                key={product.productId}
                display='flex'
                width={1 / cellSize}
                paddingY={space[7]}>
                <ProductItem

                // 162 images will appear once they are added
                imageSize={IMAGE_SIZES[162]}
                key={product.productId}
                skuImages={{
                    image42: product.image42,
                    image67: product.image67,
                    image97: product.image97,
                    image135: product.image135,
                    image162: product.image162,
                    image250: product.image250,
                    image450: product.image450 
                }}
                {...product} />
            </Grid.Cell>;
         })

        :
         'NO RESULTS'
      }
		</Grid>
    );
};


// Added by sephora-jsx-loader.js
ProductGrid.prototype.path = 'Catalog/ProductGrid';
// Added by sephora-jsx-loader.js
Object.assign(ProductGrid.prototype, require('./ProductGrid.c.js'));
var originalDidMount = ProductGrid.prototype.componentDidMount;
ProductGrid.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ProductGrid');
if (originalDidMount) originalDidMount.apply(this);
if (ProductGrid.prototype.ctrlr) ProductGrid.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ProductGrid');
// Added by sephora-jsx-loader.js
ProductGrid.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ProductGrid.prototype.class = 'ProductGrid';
// Added by sephora-jsx-loader.js
ProductGrid.prototype.getInitialState = function() {
    ProductGrid.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ProductGrid.prototype.render = wrapComponentRender(ProductGrid.prototype.render);
// Added by sephora-jsx-loader.js
var ProductGridClass = React.createClass(ProductGrid.prototype);
// Added by sephora-jsx-loader.js
ProductGridClass.prototype.classRef = ProductGridClass;
// Added by sephora-jsx-loader.js
Object.assign(ProductGridClass, ProductGrid);
// Added by sephora-jsx-loader.js
module.exports = ProductGridClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductGrid/ProductGrid.jsx