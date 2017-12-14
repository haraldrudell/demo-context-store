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
    Sephora.Util.InflatorComps.Comps['ProductFiltersFS'] = function ProductFiltersFS(){
        return ProductFiltersFSClass;
    }
}
var RefinementBox = require('../RefinementBox/RefinementBox.jsx');
var ClearAllFilters = require('./ClearAllFilters/ClearAllFilters');

var ProductFiltersFS = function () {
};

ProductFiltersFS.prototype.render = function () {
    return (
     <div>
			<div className="u-mt4 u-mb4">
				<h3 className="u-h6 u-lhh u-mb2 u-ls1 u-ttu">Filter by:</h3>
				<ClearAllFilters handleOnClick={this.props.clearAllFilters}/>
			</div>
			{
       this.props.refinements.map((refinement, index) => {
        <RefinementBox {...refinement}
         key={index}
         isFiltered={this.props.isFiltered}
         selectFilter={this.props.selectFilter}
         isFilterSelected={this.props.isFilterSelected}
         clearRefinementsBox={this.props.clearRefinementsBox}/>;
    })
      }
			<ClearAllFilters handleOnClick={this.props.clearAllFilters}/>
		</div>
    );
};


// Added by sephora-jsx-loader.js
ProductFiltersFS.prototype.path = 'Catalog/ProductFilters/ProductFiltersFS';
// Added by sephora-jsx-loader.js
ProductFiltersFS.prototype.class = 'ProductFiltersFS';
// Added by sephora-jsx-loader.js
ProductFiltersFS.prototype.getInitialState = function() {
    ProductFiltersFS.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ProductFiltersFS.prototype.render = wrapComponentRender(ProductFiltersFS.prototype.render);
// Added by sephora-jsx-loader.js
var ProductFiltersFSClass = React.createClass(ProductFiltersFS.prototype);
// Added by sephora-jsx-loader.js
ProductFiltersFSClass.prototype.classRef = ProductFiltersFSClass;
// Added by sephora-jsx-loader.js
Object.assign(ProductFiltersFSClass, ProductFiltersFS);
// Added by sephora-jsx-loader.js
module.exports = ProductFiltersFSClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductFilters/ProductFiltersFS/ProductFiltersFS.jsx