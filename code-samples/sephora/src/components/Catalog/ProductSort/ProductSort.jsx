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
    Sephora.Util.InflatorComps.Comps['ProductSort'] = function ProductSort(){
        return ProductSortClass;
    }
}
const ProductSortFS = require('components/Catalog/ProductSort/ProductSortFS/ProductSortFS');
const ProductSortMW = require('components/Catalog/ProductSort/ProductSortMW/ProductSortMW');

let ProductSort = function () {};

ProductSort.prototype.sortValues = function () {
    let options = [
        {
            name: 'best selling',
            key: 'P_BEST_SELLING',
            values: [1, 0]
        },
        {
            name: 'new',
            key: 'P_NEW',
            values: [1, 0]
        },
        {
            name: 'top rated',
            key: 'P_RATING',
            values: [1, 0]
        },
        {
            name: 'exclusive',
            key: 'P_SEPH_EXCLUSIVE',
            values: [1, 0]
        },
        {
            name: 'price high to low',
            key: 'price',
            values: [1]
        },
        {
            name: 'price low to high',
            key: 'price',
            values: [0]
        },
        {
            name: 'brand name',
            key: 'P_BRAND_NAME',
            values: [0, 1]
        }
    ];

    if (Sephora.isMobile()) {
        options.unshift({
            name: 'relevancy',
            key: '',
            values: ['']
        });
    }

    for (let i = 0, len = options.length; i < len; i += 1) {
        let sort = options[i];
        let sortArgument = [];
        let argumentDelimiter = ':';
        /**
         * Construct rest call sort param using sort criteria + delimiter + sort direction.
         * Sort direction might be ascendent or descendent, which is defined by the chosen element from the sort's values array. Call defaults to first value as of the moment, however, it should be able support flippable sorting behavior once a UI toggle exists.
         */
        if (sort.key && sort.values) {
            sortArgument.push(sort.key, argumentDelimiter, sort.values[0]);
        }

        sort.sortParam = sortArgument.join('');
    }

    return options;
};

ProductSort.prototype.render = function () {
    return (
        <div>
            { Sephora.isMobile() ?
                <ProductSortMW handleSort={this.handleSort} sortOptions={this.sortValues.call()}/>
                :
                <ProductSortFS handleSort={this.handleSort} sortOptions={this.sortValues.call()}/>
            }
        </div>
    );
};


// Added by sephora-jsx-loader.js
ProductSort.prototype.path = 'Catalog/ProductSort';
// Added by sephora-jsx-loader.js
Object.assign(ProductSort.prototype, require('./ProductSort.c.js'));
var originalDidMount = ProductSort.prototype.componentDidMount;
ProductSort.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ProductSort');
if (originalDidMount) originalDidMount.apply(this);
if (ProductSort.prototype.ctrlr) ProductSort.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ProductSort');
// Added by sephora-jsx-loader.js
ProductSort.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ProductSort.prototype.class = 'ProductSort';
// Added by sephora-jsx-loader.js
ProductSort.prototype.getInitialState = function() {
    ProductSort.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ProductSort.prototype.render = wrapComponentRender(ProductSort.prototype.render);
// Added by sephora-jsx-loader.js
var ProductSortClass = React.createClass(ProductSort.prototype);
// Added by sephora-jsx-loader.js
ProductSortClass.prototype.classRef = ProductSortClass;
// Added by sephora-jsx-loader.js
Object.assign(ProductSortClass, ProductSort);
// Added by sephora-jsx-loader.js
module.exports = ProductSortClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductSort/ProductSort.jsx