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
    Sephora.Util.InflatorComps.Comps['ClearAllFilters'] = function ClearAllFilters(){
        return ClearAllFiltersClass;
    }
}
const ButtonOutline = require('components/Button/ButtonOutline');

const ClearAllFilters = function () {};

ClearAllFilters.prototype.render = function () {
	return (
		<ButtonOutline size="sm" onClick={this.handleOnClick}>
			Clear All Filters
		</ButtonOutline>
	);
};


// Added by sephora-jsx-loader.js
ClearAllFilters.prototype.path = 'Catalog/ProductFilters/ProductFiltersFS/ClearAllFilters';
// Added by sephora-jsx-loader.js
Object.assign(ClearAllFilters.prototype, require('./ClearAllFilters.c.js'));
var originalDidMount = ClearAllFilters.prototype.componentDidMount;
ClearAllFilters.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ClearAllFilters');
if (originalDidMount) originalDidMount.apply(this);
if (ClearAllFilters.prototype.ctrlr) ClearAllFilters.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ClearAllFilters');
// Added by sephora-jsx-loader.js
ClearAllFilters.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ClearAllFilters.prototype.class = 'ClearAllFilters';
// Added by sephora-jsx-loader.js
ClearAllFilters.prototype.getInitialState = function() {
    ClearAllFilters.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ClearAllFilters.prototype.render = wrapComponentRender(ClearAllFilters.prototype.render);
// Added by sephora-jsx-loader.js
var ClearAllFiltersClass = React.createClass(ClearAllFilters.prototype);
// Added by sephora-jsx-loader.js
ClearAllFiltersClass.prototype.classRef = ClearAllFiltersClass;
// Added by sephora-jsx-loader.js
Object.assign(ClearAllFiltersClass, ClearAllFilters);
// Added by sephora-jsx-loader.js
module.exports = ClearAllFiltersClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductFilters/ProductFiltersFS/ClearAllFilters/ClearAllFilters.jsx