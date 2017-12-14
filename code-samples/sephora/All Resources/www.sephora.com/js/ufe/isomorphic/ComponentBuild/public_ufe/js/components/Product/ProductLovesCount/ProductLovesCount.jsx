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
    Sephora.Util.InflatorComps.Comps['ProductLovesCount'] = function ProductLovesCount(){
        return ProductLovesCountClass;
    }
}
/* eslint-disable eqeqeq */

const { colors, space } = require('style');
const { Text } = require('components/display');
const IconLove = require('components/Icon/IconLove');

const ProductLovesCount = function () {
    this.state = {
        lovesCount: this.props.product.lovesCount
    };
};

ProductLovesCount.prototype.render = function () {
    return (
        <span>
            <Text fontSize='1.125em'>
                <IconLove
                    outline={this.state.lovesCount == 0}
                    color={this.state.lovesCount == 0 ? colors.black : colors.red} />
            </Text>
            <Text
                marginLeft={space[2]}
                data-at={Sephora.debug.dataAt(this.props.dataAt)}>
                {this.state.lovesCount}
            </Text>
            {this.state.lovesCount == 1
                ? ' love'
                : ' loves'
            }
        </span>
    );
};


// Added by sephora-jsx-loader.js
ProductLovesCount.prototype.path = 'Product/ProductLovesCount';
// Added by sephora-jsx-loader.js
Object.assign(ProductLovesCount.prototype, require('./ProductLovesCount.c.js'));
var originalDidMount = ProductLovesCount.prototype.componentDidMount;
ProductLovesCount.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ProductLovesCount');
if (originalDidMount) originalDidMount.apply(this);
if (ProductLovesCount.prototype.ctrlr) ProductLovesCount.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ProductLovesCount');
// Added by sephora-jsx-loader.js
ProductLovesCount.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ProductLovesCount.prototype.class = 'ProductLovesCount';
// Added by sephora-jsx-loader.js
ProductLovesCount.prototype.getInitialState = function() {
    ProductLovesCount.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ProductLovesCount.prototype.render = wrapComponentRender(ProductLovesCount.prototype.render);
// Added by sephora-jsx-loader.js
var ProductLovesCountClass = React.createClass(ProductLovesCount.prototype);
// Added by sephora-jsx-loader.js
ProductLovesCountClass.prototype.classRef = ProductLovesCountClass;
// Added by sephora-jsx-loader.js
Object.assign(ProductLovesCountClass, ProductLovesCount);
// Added by sephora-jsx-loader.js
module.exports = ProductLovesCountClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Product/ProductLovesCount/ProductLovesCount.jsx