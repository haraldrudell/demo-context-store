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
    Sephora.Util.InflatorComps.Comps['CatalogHeaderMW'] = function CatalogHeaderMW(){
        return CatalogHeaderMWClass;
    }
}
var ProductSort = require('components/Catalog/ProductSort/ProductSort');
var ShowFilters = require('components/Catalog/ProductFilters/ProductFiltersMW/ShowFilters/ShowFilters');
var Container = require('components/Container/Container');

var CatalogHeaderMW = function () {
};

CatalogHeaderMW.prototype.render = function () {
    var totalResultsString = typeof this.props.productsQuantity === 'undefined' ? '0'
        : this.props.productsQuantity;
    totalResultsString += ' result';
    totalResultsString += this.props.productsQuantity !== 1 ? 's' : '';
    totalResultsString += ' for ';

    if (this.props.keyword) {
        totalResultsString += this.props.keyword;
    } else if (this.props.displayName) {
        totalResultsString += this.props.displayName;
    } else if (this.props.shortName) {
        totalResultsString += this.props.shortName;
    }

    var searchType = '';
    var id = '';
    if (this.props.categoryId) {
        searchType = 'category';
        id = this.props.categoryId;
    } else if (this.props.brandId) {
        searchType = 'brand';
        id = this.props.brandId;
    } else if (this.props.keyword) {
        searchType = 'keyword';
        id = this.props.keyword;
    }

    return (
     <div className="u-bgNearWhite">
				<Container>
						<div className="u-py3 u-flex u-flexJustifyBetween u-flexAlignItemsCenter u-mxn2">
								<div className="u-px2 u-gray">
										{totalResultsString}
								</div>
								<div className="u-px2 u-flex">
										<ProductSort/>
										<ShowFilters/>
								</div>
						</div>
				</Container>
		</div>
    );
};


// Added by sephora-jsx-loader.js
CatalogHeaderMW.prototype.path = 'Catalog/CatalogHeader/CatalogHeaderMW';
// Added by sephora-jsx-loader.js
CatalogHeaderMW.prototype.class = 'CatalogHeaderMW';
// Added by sephora-jsx-loader.js
CatalogHeaderMW.prototype.getInitialState = function() {
    CatalogHeaderMW.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
CatalogHeaderMW.prototype.render = wrapComponentRender(CatalogHeaderMW.prototype.render);
// Added by sephora-jsx-loader.js
var CatalogHeaderMWClass = React.createClass(CatalogHeaderMW.prototype);
// Added by sephora-jsx-loader.js
CatalogHeaderMWClass.prototype.classRef = CatalogHeaderMWClass;
// Added by sephora-jsx-loader.js
Object.assign(CatalogHeaderMWClass, CatalogHeaderMW);
// Added by sephora-jsx-loader.js
module.exports = CatalogHeaderMWClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/CatalogHeader/CatalogHeaderMW/CatalogHeaderMW.jsx