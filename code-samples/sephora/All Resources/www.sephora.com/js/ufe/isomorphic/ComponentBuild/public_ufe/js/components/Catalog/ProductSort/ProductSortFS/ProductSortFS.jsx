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
    Sephora.Util.InflatorComps.Comps['ProductSortFS'] = function ProductSortFS(){
        return ProductSortFSClass;
    }
}
// jscs:disable
const Select = require('components/Inputs/Select/Select');

var ProductSortFS = function() {
    this.state = {
        currentSort: null
    };
};

ProductSortFS.prototype.render = function () {
    return (
        <Select
            isInline={true}
            noMargin={true}
            label="sort by"
            value={this.state.currentSort || this.props.sortOptions[0].sortParam}
            onChange={(e) => this.handleOnChange(e)}>
            {
                this.props.sortOptions.map(function(option, index){
                    return <option key={index} value={option.sortParam}>
                        {option.name}
                    </option>
                })
            }
        </Select>
    )
};


// Added by sephora-jsx-loader.js
ProductSortFS.prototype.path = 'Catalog/ProductSort/ProductSortFS';
// Added by sephora-jsx-loader.js
Object.assign(ProductSortFS.prototype, require('./ProductSortFS.c.js'));
var originalDidMount = ProductSortFS.prototype.componentDidMount;
ProductSortFS.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ProductSortFS');
if (originalDidMount) originalDidMount.apply(this);
if (ProductSortFS.prototype.ctrlr) ProductSortFS.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ProductSortFS');
// Added by sephora-jsx-loader.js
ProductSortFS.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ProductSortFS.prototype.class = 'ProductSortFS';
// Added by sephora-jsx-loader.js
ProductSortFS.prototype.getInitialState = function() {
    ProductSortFS.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ProductSortFS.prototype.render = wrapComponentRender(ProductSortFS.prototype.render);
// Added by sephora-jsx-loader.js
var ProductSortFSClass = React.createClass(ProductSortFS.prototype);
// Added by sephora-jsx-loader.js
ProductSortFSClass.prototype.classRef = ProductSortFSClass;
// Added by sephora-jsx-loader.js
Object.assign(ProductSortFSClass, ProductSortFS);
// Added by sephora-jsx-loader.js
module.exports = ProductSortFSClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductSort/ProductSortFS/ProductSortFS.jsx