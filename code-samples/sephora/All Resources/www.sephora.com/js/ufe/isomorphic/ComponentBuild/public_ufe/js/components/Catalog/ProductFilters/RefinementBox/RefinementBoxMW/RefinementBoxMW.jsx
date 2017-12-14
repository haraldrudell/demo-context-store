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
    Sephora.Util.InflatorComps.Comps['RefinementBoxMW'] = function RefinementBoxMW(){
        return RefinementBoxMWClass;
    }
}
// jscs:disable
const RefinementItem = require('components/Catalog/ProductFilters/RefinementBox/RefinementItem/RefinementItem');

var RefinementBoxMW = function () {
	this.state = {
		isOpen: false
	}
};

RefinementBoxMW.prototype.render = function () {
	let className = 'panel-refine-checkboxes';
	let fieldSetClassName = '';
	let checkBoxesWrapperClassName = '';

	if (this.props.type === 'colors') {
		className = 'panel-refine-colors';
		fieldSetClassName = 'refine-colors';
		checkBoxesWrapperClassName = 'swatch-grid u-textCenter'
	}

	return (
		<div className={'panel panel-refine ' + className}>
			<div className={'panel__heading' + (this.state.isOpen ? '' : ' collapsed')} onClick={this.openRefinement}>
				<h4 className="panel__title">
					<span className="icon icon-expand"></span>
					{this.props.displayName} <span className="panel-refine-cnt"></span>
				</h4>
			</div>
			<div className={'panel__collapse collapse' + (this.state.isOpen ? 'in' : '')}>
				<div className="panel__body">
					<fieldset className={fieldSetClassName}>
						<div className={checkBoxesWrapperClassName}>
							{
								this.props.values.map( (value, index) =>{
									<RefinementItem label={value.refinementValueDisplayName}
										key={index}
										value={value.refinementValueId}
										handleOnChange={this.props.selectFilter}
										isChecked={this.props.isFilterSelected}
										type={this.props.type}/>
								})
							}
						</div>
					</fieldset>
				</div>
			</div>
		</div>
	);
};


// Added by sephora-jsx-loader.js
RefinementBoxMW.prototype.path = 'Catalog/ProductFilters/RefinementBox/RefinementBoxMW';
// Added by sephora-jsx-loader.js
Object.assign(RefinementBoxMW.prototype, require('./RefinementBoxMW.c.js'));
var originalDidMount = RefinementBoxMW.prototype.componentDidMount;
RefinementBoxMW.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: RefinementBoxMW');
if (originalDidMount) originalDidMount.apply(this);
if (RefinementBoxMW.prototype.ctrlr) RefinementBoxMW.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: RefinementBoxMW');
// Added by sephora-jsx-loader.js
RefinementBoxMW.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
RefinementBoxMW.prototype.class = 'RefinementBoxMW';
// Added by sephora-jsx-loader.js
RefinementBoxMW.prototype.getInitialState = function() {
    RefinementBoxMW.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
RefinementBoxMW.prototype.render = wrapComponentRender(RefinementBoxMW.prototype.render);
// Added by sephora-jsx-loader.js
var RefinementBoxMWClass = React.createClass(RefinementBoxMW.prototype);
// Added by sephora-jsx-loader.js
RefinementBoxMWClass.prototype.classRef = RefinementBoxMWClass;
// Added by sephora-jsx-loader.js
Object.assign(RefinementBoxMWClass, RefinementBoxMW);
// Added by sephora-jsx-loader.js
module.exports = RefinementBoxMWClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductFilters/RefinementBox/RefinementBoxMW/RefinementBoxMW.jsx