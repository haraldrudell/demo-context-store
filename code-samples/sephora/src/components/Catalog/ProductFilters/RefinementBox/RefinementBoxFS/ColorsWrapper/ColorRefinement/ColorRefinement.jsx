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
    Sephora.Util.InflatorComps.Comps['ColorRefinement'] = function ColorRefinement(){
        return ColorRefinementClass;
    }
}
const Tooltip = require('components/Tooltip/Tooltip');

var ColorRefinement = function () {};

ColorRefinement.prototype.render = function () {
    const size = '23';

    let imagePath = '/images/colors/' + this.props.label.toLocaleLowerCase() + '.png';

    return (
     <Tooltip bottom title={this.props.label}>
			<button type="button"
        style={{ padding: '1px', borderWidth: '2px' }}
        className={'u-db u-ba ' + (this.props.isFilterSelected ? 'u-b--black' : 'u-b--white')}
        onClick={(e) => this.handleOnClick(e, this.props.value, this.props.isFilterSelected)}>
				<img
        width={size}
        height={size}
        alt={this.props.label}
        src={imagePath}/>
			</button>
		</Tooltip>
    );
};


// Added by sephora-jsx-loader.js
ColorRefinement.prototype.path = 'Catalog/ProductFilters/RefinementBox/RefinementBoxFS/ColorsWrapper/ColorRefinement';
// Added by sephora-jsx-loader.js
Object.assign(ColorRefinement.prototype, require('./ColorRefinement.c.js'));
var originalDidMount = ColorRefinement.prototype.componentDidMount;
ColorRefinement.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ColorRefinement');
if (originalDidMount) originalDidMount.apply(this);
if (ColorRefinement.prototype.ctrlr) ColorRefinement.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ColorRefinement');
// Added by sephora-jsx-loader.js
ColorRefinement.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ColorRefinement.prototype.class = 'ColorRefinement';
// Added by sephora-jsx-loader.js
ColorRefinement.prototype.getInitialState = function() {
    ColorRefinement.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ColorRefinement.prototype.render = wrapComponentRender(ColorRefinement.prototype.render);
// Added by sephora-jsx-loader.js
var ColorRefinementClass = React.createClass(ColorRefinement.prototype);
// Added by sephora-jsx-loader.js
ColorRefinementClass.prototype.classRef = ColorRefinementClass;
// Added by sephora-jsx-loader.js
Object.assign(ColorRefinementClass, ColorRefinement);
// Added by sephora-jsx-loader.js
module.exports = ColorRefinementClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductFilters/RefinementBox/RefinementBoxFS/ColorsWrapper/ColorRefinement/ColorRefinement.jsx