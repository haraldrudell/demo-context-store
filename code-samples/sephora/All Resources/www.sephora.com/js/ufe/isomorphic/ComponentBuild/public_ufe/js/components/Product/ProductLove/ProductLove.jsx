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
    Sephora.Util.InflatorComps.Comps['ProductLove'] = function ProductLove(){
        return ProductLoveClass;
    }
}
var ProductLove = function () {
    this.state = {
        isActive: false,
        hover: false
    };
};

ProductLove.prototype.render = function () {
    let skuData = {
        loveSource: this.props.loveSource,
        skuId: this.props.skuId,
        analyticsContext: this.props.analyticsContext
    };

    return (
        <div>
        {
            React.Children.map(this.props.children, (child, index) => React.cloneElement(child,
                {
                    key: index,
                    handleOnClick: this.handleOnClick,
                    mouseEnter: this.mouseEnter,
                    mouseLeave: this.mouseLeave,
                    isActive: this.state.isActive,
                    hover: this.state.hover,
                    sku: skuData
                }
            ))
        }
        </div>
    );
};


// Added by sephora-jsx-loader.js
ProductLove.prototype.path = 'Product/ProductLove';
// Added by sephora-jsx-loader.js
Object.assign(ProductLove.prototype, require('./ProductLove.c.js'));
var originalDidMount = ProductLove.prototype.componentDidMount;
ProductLove.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ProductLove');
if (originalDidMount) originalDidMount.apply(this);
if (ProductLove.prototype.ctrlr) ProductLove.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ProductLove');
// Added by sephora-jsx-loader.js
ProductLove.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ProductLove.prototype.class = 'ProductLove';
// Added by sephora-jsx-loader.js
ProductLove.prototype.getInitialState = function() {
    ProductLove.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ProductLove.prototype.render = wrapComponentRender(ProductLove.prototype.render);
// Added by sephora-jsx-loader.js
var ProductLoveClass = React.createClass(ProductLove.prototype);
// Added by sephora-jsx-loader.js
ProductLoveClass.prototype.classRef = ProductLoveClass;
// Added by sephora-jsx-loader.js
Object.assign(ProductLoveClass, ProductLove);
// Added by sephora-jsx-loader.js
module.exports = ProductLoveClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Product/ProductLove/ProductLove.jsx