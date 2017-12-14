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
    Sephora.Util.InflatorComps.Comps['ProductFilters'] = function ProductFilters(){
        return ProductFiltersClass;
    }
}
var ProductFiltersFS = require('./ProductFiltersFS/ProductFiltersFS');
var ProductFiltersMW = require('./ProductFiltersMW/ProductFiltersMW');

var ProductFilters = function () {
    this.state = {
        refinements: [],
        isFiltered: false
    };
};

ProductFilters.prototype.render = function () {
    return (
     <div>
			{
       Sephora.isMobile() ?
        <ProductFiltersMW
         refinements={this.state.refinements}
         isFiltered={this.state.isFiltered}
         clearAllFilters={this.clearAllFilters}
         clearRefinementsBox={this.clearRefinementsBox}
         selectFilter={this.selectFilter}
         isFilterSelected={this.isFilterSelected}/> :
        <ProductFiltersFS
         refinements={this.state.refinements}
         isFiltered={this.state.isFiltered}
         clearAllFilters={this.clearAllFilters}
         clearRefinementsBox={this.clearRefinementsBox}
         selectFilter={this.selectFilter}
         isFilterSelected={this.isFilterSelected}/>
      }
		</div>
    );
};


// Added by sephora-jsx-loader.js
ProductFilters.prototype.path = 'Catalog/ProductFilters';
// Added by sephora-jsx-loader.js
Object.assign(ProductFilters.prototype, require('./ProductFilters.c.js'));
var originalDidMount = ProductFilters.prototype.componentDidMount;
ProductFilters.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ProductFilters');
if (originalDidMount) originalDidMount.apply(this);
if (ProductFilters.prototype.ctrlr) ProductFilters.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ProductFilters');
// Added by sephora-jsx-loader.js
ProductFilters.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ProductFilters.prototype.class = 'ProductFilters';
// Added by sephora-jsx-loader.js
ProductFilters.prototype.getInitialState = function() {
    ProductFilters.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ProductFilters.prototype.render = wrapComponentRender(ProductFilters.prototype.render);
// Added by sephora-jsx-loader.js
var ProductFiltersClass = React.createClass(ProductFilters.prototype);
// Added by sephora-jsx-loader.js
ProductFiltersClass.prototype.classRef = ProductFiltersClass;
// Added by sephora-jsx-loader.js
Object.assign(ProductFiltersClass, ProductFilters);
// Added by sephora-jsx-loader.js
module.exports = ProductFiltersClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductFilters/ProductFilters.jsx