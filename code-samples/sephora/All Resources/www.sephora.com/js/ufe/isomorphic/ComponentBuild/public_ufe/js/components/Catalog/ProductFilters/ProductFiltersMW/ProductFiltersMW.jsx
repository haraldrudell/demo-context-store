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
    Sephora.Util.InflatorComps.Comps['ProductFiltersMW'] = function ProductFiltersMW(){
        return ProductFiltersMWClass;
    }
}
var RefinementBox = require('../RefinementBox/RefinementBox.jsx');
var Container = require('../../../Container/Container');

//jscs:disable
var ProductFiltersMW = function () {
    this.state = {
        showFilters: false,
        totalProducts: 0
    };
};

ProductFiltersMW.prototype.render = function () {
    let className = 'page has-fixed-navbars fade ' + (this.state.showFilters ? 'active in' : '');

    return (
     <div id="refine-main" className={className}>
			<div className="page__head">
				<div className="navbar navbar--fixed-top">
					<a href="#" className="u-hidden" id="go-to-search-results" onClick={e => this.toggleShowFilters(e)}>Done</a>
					<Container>
						<a href="" className="navbar__arrow" onClick={e => this.toggleShowFilters(e)}>
							<span className="icon icon-arrow-left"></span>
						</a>
						<a href="#main" className="u-hidden btn navbar__btn navbar__btn--primary">Done</a>
						<span className="navbar-title">Refine</span>
					</Container>
				</div>
				<div className="well refine-count u-textMuted u-textCenter">
					<b>{this.state.totalProducts}</b> results for {this.props.displayName}
				</div>
			</div>
			<div className="page__body">
				<Container>
					<p className="u-textMuted refine-note small">When you make a filter selection below it may
						impact other options available.</p>
				</Container>
				<div id="panels-refine" className="panel__group">
					{
         this.props.refinements.map((refinement, index) => {
            <RefinementBox {...refinement}
             key={index}
             isFiltered={this.props.isFiltered}
             isFilterSelected={this.props.isFilterSelected}
             clearRefinementsBox={this.props.clearRefinementsBox}
             selectFilter={this.props.selectFilter}/>;
        })
        }
				</div>
			</div>
			<div className="page__foot">
				<div className="navbar navbar--fixed-bottom">
					<Container>
						<button
          type="button"
          className="btn btn-default"
          onClick={this.clearAllFilters}
          disabled={!this.props.isFiltered}>Clear all
						</button>
						<button type="button" className="btn btn-primary" onClick={this.toggleShowFilters}>Apply
							Filters
						</button>
					</Container>
				</div>
			</div>
		</div>
    );
};


// Added by sephora-jsx-loader.js
ProductFiltersMW.prototype.path = 'Catalog/ProductFilters/ProductFiltersMW';
// Added by sephora-jsx-loader.js
Object.assign(ProductFiltersMW.prototype, require('./ProductFiltersMW.c.js'));
var originalDidMount = ProductFiltersMW.prototype.componentDidMount;
ProductFiltersMW.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ProductFiltersMW');
if (originalDidMount) originalDidMount.apply(this);
if (ProductFiltersMW.prototype.ctrlr) ProductFiltersMW.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ProductFiltersMW');
// Added by sephora-jsx-loader.js
ProductFiltersMW.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ProductFiltersMW.prototype.class = 'ProductFiltersMW';
// Added by sephora-jsx-loader.js
ProductFiltersMW.prototype.getInitialState = function() {
    ProductFiltersMW.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ProductFiltersMW.prototype.render = wrapComponentRender(ProductFiltersMW.prototype.render);
// Added by sephora-jsx-loader.js
var ProductFiltersMWClass = React.createClass(ProductFiltersMW.prototype);
// Added by sephora-jsx-loader.js
ProductFiltersMWClass.prototype.classRef = ProductFiltersMWClass;
// Added by sephora-jsx-loader.js
Object.assign(ProductFiltersMWClass, ProductFiltersMW);
// Added by sephora-jsx-loader.js
module.exports = ProductFiltersMWClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductFilters/ProductFiltersMW/ProductFiltersMW.jsx