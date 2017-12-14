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
    Sephora.Util.InflatorComps.Comps['SizeAndItemNumber'] = function SizeAndItemNumber(){
        return SizeAndItemNumberClass;
    }
}
const { space } = require('style');
const { Box, Text } = require('components/display');
const skuUtils = require('utils/Sku');

const SizeAndItemNumber = function () {};

SizeAndItemNumber.prototype.render = function () {
    let {
        sku,
        ...props
    } = this.props;

    return (
        <Box
            {...props}
            color='gray'>
            {(sku.size &&
              sku.variationType !== skuUtils.skuVariationType.SIZE) &&
                <span>
                    SIZE {sku.size}
                    <Text marginX='.5em'>•</Text>
                </span>
            }
            ITEM {sku.skuId}
        </Box>
    );
};


// Added by sephora-jsx-loader.js
SizeAndItemNumber.prototype.path = 'Product/SizeAndItemNumber';
// Added by sephora-jsx-loader.js
SizeAndItemNumber.prototype.class = 'SizeAndItemNumber';
// Added by sephora-jsx-loader.js
SizeAndItemNumber.prototype.getInitialState = function() {
    SizeAndItemNumber.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
SizeAndItemNumber.prototype.render = wrapComponentRender(SizeAndItemNumber.prototype.render);
// Added by sephora-jsx-loader.js
var SizeAndItemNumberClass = React.createClass(SizeAndItemNumber.prototype);
// Added by sephora-jsx-loader.js
SizeAndItemNumberClass.prototype.classRef = SizeAndItemNumberClass;
// Added by sephora-jsx-loader.js
Object.assign(SizeAndItemNumberClass, SizeAndItemNumber);
// Added by sephora-jsx-loader.js
module.exports = SizeAndItemNumberClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Product/SizeAndItemNumber/SizeAndItemNumber.jsx