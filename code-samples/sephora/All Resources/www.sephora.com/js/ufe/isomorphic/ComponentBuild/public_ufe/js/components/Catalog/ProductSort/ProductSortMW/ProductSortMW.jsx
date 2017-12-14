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
    Sephora.Util.InflatorComps.Comps['ProductSortMW'] = function ProductSortMW(){
        return ProductSortMWClass;
    }
}
var SortItem = require('./SortItem/SortItem');

var ProductSortMW = function () {
    this.state = {
        isActive: false
    };
};

ProductSortMW.prototype.render = function () {
    const dropdownClasses = this.state.isActive ?
            'dropdown search-sort u-floatRight open'
        :
            'dropdown search-sort u-floatRight';
    return (
        <div className={dropdownClasses}>
            <button
            type="button"
            className="btn btn-default dropdown-toggle"
            data-toggle="dropdown"
            onClick={() => this.handleOnClick()}>Sort:</button>
                <ul className="dropdown-menu sort-menu">
                    {
                        this.props.sortOptions.map((option, index) =>
                            <SortItem
                                key={index}
                                options={option}
                                closeMenu={this.handleOnClick}
                                handleSort={this.props.handleSort}>
                                </SortItem>
                        )
                    }
                </ul>
        </div>
    );
};


// Added by sephora-jsx-loader.js
ProductSortMW.prototype.path = 'Catalog/ProductSort/ProductSortMW';
// Added by sephora-jsx-loader.js
Object.assign(ProductSortMW.prototype, require('./ProductSortMW.c.js'));
var originalDidMount = ProductSortMW.prototype.componentDidMount;
ProductSortMW.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ProductSortMW');
if (originalDidMount) originalDidMount.apply(this);
if (ProductSortMW.prototype.ctrlr) ProductSortMW.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ProductSortMW');
// Added by sephora-jsx-loader.js
ProductSortMW.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ProductSortMW.prototype.class = 'ProductSortMW';
// Added by sephora-jsx-loader.js
ProductSortMW.prototype.getInitialState = function() {
    ProductSortMW.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ProductSortMW.prototype.render = wrapComponentRender(ProductSortMW.prototype.render);
// Added by sephora-jsx-loader.js
var ProductSortMWClass = React.createClass(ProductSortMW.prototype);
// Added by sephora-jsx-loader.js
ProductSortMWClass.prototype.classRef = ProductSortMWClass;
// Added by sephora-jsx-loader.js
Object.assign(ProductSortMWClass, ProductSortMW);
// Added by sephora-jsx-loader.js
module.exports = ProductSortMWClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductSort/ProductSortMW/ProductSortMW.jsx