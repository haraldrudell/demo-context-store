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
    Sephora.Util.InflatorComps.Comps['ShowFilters'] = function ShowFilters(){
        return ShowFiltersClass;
    }
}
var ShowFilters = function () {

};

ShowFilters.prototype.render = function () {
    return (
     <button className="btn btn-default"
       onClick={this.handleOnClick}>Filter</button>
    );
};


// Added by sephora-jsx-loader.js
ShowFilters.prototype.path = 'Catalog/ProductFilters/ProductFiltersMW/ShowFilters';
// Added by sephora-jsx-loader.js
Object.assign(ShowFilters.prototype, require('./ShowFilters.c.js'));
var originalDidMount = ShowFilters.prototype.componentDidMount;
ShowFilters.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ShowFilters');
if (originalDidMount) originalDidMount.apply(this);
if (ShowFilters.prototype.ctrlr) ShowFilters.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ShowFilters');
// Added by sephora-jsx-loader.js
ShowFilters.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ShowFilters.prototype.class = 'ShowFilters';
// Added by sephora-jsx-loader.js
ShowFilters.prototype.getInitialState = function() {
    ShowFilters.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ShowFilters.prototype.render = wrapComponentRender(ShowFilters.prototype.render);
// Added by sephora-jsx-loader.js
var ShowFiltersClass = React.createClass(ShowFilters.prototype);
// Added by sephora-jsx-loader.js
ShowFiltersClass.prototype.classRef = ShowFiltersClass;
// Added by sephora-jsx-loader.js
Object.assign(ShowFiltersClass, ShowFilters);
// Added by sephora-jsx-loader.js
module.exports = ShowFiltersClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductFilters/ProductFiltersMW/ShowFilters/ShowFilters.jsx