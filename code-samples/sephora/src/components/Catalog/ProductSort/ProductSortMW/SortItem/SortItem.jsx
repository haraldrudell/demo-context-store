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
    Sephora.Util.InflatorComps.Comps['SortItem'] = function SortItem(){
        return SortItemClass;
    }
}
var SortItem = function () {
    this.state = {
        isActive: false
    };
};

SortItem.prototype.render = function () {
    const classes = this.state.isActive ? 'active' : '';

    return (
        <li className={classes}>
            <a data-at={Sephora.debug.dataAt('sort-button-elements')}
               onClick={() => this.handleOnClick()}>
            {this.props.options.name}</a>
        </li>
    );
};


// Added by sephora-jsx-loader.js
SortItem.prototype.path = 'Catalog/ProductSort/ProductSortMW/SortItem';
// Added by sephora-jsx-loader.js
Object.assign(SortItem.prototype, require('./SortItem.c.js'));
var originalDidMount = SortItem.prototype.componentDidMount;
SortItem.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: SortItem');
if (originalDidMount) originalDidMount.apply(this);
if (SortItem.prototype.ctrlr) SortItem.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: SortItem');
// Added by sephora-jsx-loader.js
SortItem.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
SortItem.prototype.class = 'SortItem';
// Added by sephora-jsx-loader.js
SortItem.prototype.getInitialState = function() {
    SortItem.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
SortItem.prototype.render = wrapComponentRender(SortItem.prototype.render);
// Added by sephora-jsx-loader.js
var SortItemClass = React.createClass(SortItem.prototype);
// Added by sephora-jsx-loader.js
SortItemClass.prototype.classRef = SortItemClass;
// Added by sephora-jsx-loader.js
Object.assign(SortItemClass, SortItem);
// Added by sephora-jsx-loader.js
module.exports = SortItemClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductSort/ProductSortMW/SortItem/SortItem.jsx