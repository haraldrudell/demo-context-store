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
    Sephora.Util.InflatorComps.Comps['CheckBoxColor'] = function CheckBoxColor(){
        return CheckBoxColorClass;
    }
}
// jscs:disable
var CheckBoxColor = function () {
};

CheckBoxColor.prototype.render = function () {
	const size = '50';

	return (
		<span>
			<input type="checkbox"
				   id={'refine-swatch-' + this.props.value}
				   value={this.props.value}
				   className="u-hidden"
				   checked={this.props.isChecked(this.props.value)}
				   onChange={e => this.props.handleOnChange(e)}/>
			<label htmlFor={'refine-swatch-' + this.props.value}>
				<img
					src={'/img/colors/color-' + this.props.label.toLowerCase() + '.png'}
					width={size}
					height={size}/>
				<span className="refine-name">{this.props.label}</span>
			</label>
		</span>
	);
};


// Added by sephora-jsx-loader.js
CheckBoxColor.prototype.path = 'Catalog/ProductFilters/RefinementBox/RefinementItem/CheckBoxColor';
// Added by sephora-jsx-loader.js
CheckBoxColor.prototype.class = 'CheckBoxColor';
// Added by sephora-jsx-loader.js
CheckBoxColor.prototype.getInitialState = function() {
    CheckBoxColor.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
CheckBoxColor.prototype.render = wrapComponentRender(CheckBoxColor.prototype.render);
// Added by sephora-jsx-loader.js
var CheckBoxColorClass = React.createClass(CheckBoxColor.prototype);
// Added by sephora-jsx-loader.js
CheckBoxColorClass.prototype.classRef = CheckBoxColorClass;
// Added by sephora-jsx-loader.js
Object.assign(CheckBoxColorClass, CheckBoxColor);
// Added by sephora-jsx-loader.js
module.exports = CheckBoxColorClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductFilters/RefinementBox/RefinementItem/CheckBoxColor/CheckBoxColor.jsx