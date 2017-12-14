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
    Sephora.Util.InflatorComps.Comps['RefinementItem'] = function RefinementItem(){
        return RefinementItemClass;
    }
}
// jscs:disable
var CheckBoxStandard = require('./CheckBoxStandard/CheckBoxStandard');
var CheckBoxColor = require('./CheckBoxColor/CheckBoxColor');

var RefinementItem = function () {

};

RefinementItem.prototype.render = function () {
	return (
		<div>
			{
				(this.props.type === 'checkboxes') ?
					<CheckBoxStandard
						label={this.props.label}
						value={this.props.value}
						handleOnChange={this.handleOnChange}
						isChecked={this.isChecked}/> : null


			}

			{
				(Sephora.isMobile() && this.props.type === 'colors') ?
					<CheckBoxColor
						label={this.props.label}
						value={this.props.value}
						handleOnChange={this.handleOnChange}
						isChecked={this.isChecked}/> : null
			}
		</div>
	);
};


// Added by sephora-jsx-loader.js
RefinementItem.prototype.path = 'Catalog/ProductFilters/RefinementBox/RefinementItem';
// Added by sephora-jsx-loader.js
Object.assign(RefinementItem.prototype, require('./RefinementItem.c.js'));
var originalDidMount = RefinementItem.prototype.componentDidMount;
RefinementItem.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: RefinementItem');
if (originalDidMount) originalDidMount.apply(this);
if (RefinementItem.prototype.ctrlr) RefinementItem.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: RefinementItem');
// Added by sephora-jsx-loader.js
RefinementItem.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
RefinementItem.prototype.class = 'RefinementItem';
// Added by sephora-jsx-loader.js
RefinementItem.prototype.getInitialState = function() {
    RefinementItem.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
RefinementItem.prototype.render = wrapComponentRender(RefinementItem.prototype.render);
// Added by sephora-jsx-loader.js
var RefinementItemClass = React.createClass(RefinementItem.prototype);
// Added by sephora-jsx-loader.js
RefinementItemClass.prototype.classRef = RefinementItemClass;
// Added by sephora-jsx-loader.js
Object.assign(RefinementItemClass, RefinementItem);
// Added by sephora-jsx-loader.js
module.exports = RefinementItemClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductFilters/RefinementBox/RefinementItem/RefinementItem.jsx