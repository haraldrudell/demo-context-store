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
    Sephora.Util.InflatorComps.Comps['ColorsWrapper'] = function ColorsWrapper(){
        return ColorsWrapperClass;
    }
}
const space = require('style').space;
var ColorRefinement = require('./ColorRefinement/ColorRefinement');
const Grid = require('components/Grid/Grid');

var ColorsWrapper = function () {};

ColorsWrapper.prototype.render = function () {
    return (
     <Grid gutter={1}>
			{
       this.props.values.map((value, index) =>
            (
                <Grid.Cell
                    width={1 / 6}
                    marginTop={space[3]}>
                    <ColorRefinement
                    key={index}
                    label={value.refinementValueDisplayName}
                    value={value.refinementValueId}
                    handleOnClick={this.props.handleOnClick}
                    isFilterSelected={this.props.isFilterSelected(value.refinementValueId)}/>
                </Grid.Cell>
            )
       )
      }
		</Grid>
    );
};


// Added by sephora-jsx-loader.js
ColorsWrapper.prototype.path = 'Catalog/ProductFilters/RefinementBox/RefinementBoxFS/ColorsWrapper';
// Added by sephora-jsx-loader.js
ColorsWrapper.prototype.class = 'ColorsWrapper';
// Added by sephora-jsx-loader.js
ColorsWrapper.prototype.getInitialState = function() {
    ColorsWrapper.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ColorsWrapper.prototype.render = wrapComponentRender(ColorsWrapper.prototype.render);
// Added by sephora-jsx-loader.js
var ColorsWrapperClass = React.createClass(ColorsWrapper.prototype);
// Added by sephora-jsx-loader.js
ColorsWrapperClass.prototype.classRef = ColorsWrapperClass;
// Added by sephora-jsx-loader.js
Object.assign(ColorsWrapperClass, ColorsWrapper);
// Added by sephora-jsx-loader.js
module.exports = ColorsWrapperClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductFilters/RefinementBox/RefinementBoxFS/ColorsWrapper/ColorsWrapper.jsx