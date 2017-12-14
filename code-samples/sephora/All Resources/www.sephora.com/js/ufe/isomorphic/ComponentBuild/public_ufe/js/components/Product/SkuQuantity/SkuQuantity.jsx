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
    Sephora.Util.InflatorComps.Comps['SkuQuantity'] = function SkuQuantity(){
        return SkuQuantityClass;
    }
}
const Select = require('components/Inputs/Select/Select');
const LineItem = require('utils/LineItem');
const Debounce = require('utils/Debounce');

var SkuQuantity = function () {
    this.state = {
        quantities: []
    };
};

SkuQuantity.prototype.render = function () {
    let isOutOfStock = this.props.currentSku.isOutOfStock;
    return (
        <Select
            isInline={true}
            noMargin={true}
            hideLabel={this.props.hideLabel}
            label='QTY'
            value={isOutOfStock ? LineItem.OOS_QTY : this.props.skuQuantity}
            disabled={this.props.disabled}

            // Using debounce to work around a defect in react-lite which causes onChange
            // to fire twice for selects.  See https://github.com/Lucifier129/react-lite/issues/99
            // TODO: remove once react-lite fix is live
            onChange={Debounce.throttle((e) => this.props.handleSkuQuantity(e.target.value), 100)}
            _css={{
                minWidth: 54
            }}
            data-at={Sephora.debug.dataAt('sku_qty')}>

            {
                this.state.quantities.concat(isOutOfStock ? [LineItem.OOS_QTY] : []).
                    map((option, index) =>
                    this.props.skuQuantity === option ?
                    <option key={index} value={option} selected>{option}</option> :
                    <option key={index} value={option}>{option}</option>
                )
            }
        </Select>
    );
};


// Added by sephora-jsx-loader.js
SkuQuantity.prototype.path = 'Product/SkuQuantity';
// Added by sephora-jsx-loader.js
Object.assign(SkuQuantity.prototype, require('./SkuQuantity.c.js'));
var originalDidMount = SkuQuantity.prototype.componentDidMount;
SkuQuantity.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: SkuQuantity');
if (originalDidMount) originalDidMount.apply(this);
if (SkuQuantity.prototype.ctrlr) SkuQuantity.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: SkuQuantity');
// Added by sephora-jsx-loader.js
SkuQuantity.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
SkuQuantity.prototype.class = 'SkuQuantity';
// Added by sephora-jsx-loader.js
SkuQuantity.prototype.getInitialState = function() {
    SkuQuantity.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
SkuQuantity.prototype.render = wrapComponentRender(SkuQuantity.prototype.render);
// Added by sephora-jsx-loader.js
var SkuQuantityClass = React.createClass(SkuQuantity.prototype);
// Added by sephora-jsx-loader.js
SkuQuantityClass.prototype.classRef = SkuQuantityClass;
// Added by sephora-jsx-loader.js
Object.assign(SkuQuantityClass, SkuQuantity);
// Added by sephora-jsx-loader.js
module.exports = SkuQuantityClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Product/SkuQuantity/SkuQuantity.jsx