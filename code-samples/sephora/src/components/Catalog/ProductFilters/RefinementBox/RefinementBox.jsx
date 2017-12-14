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
    Sephora.Util.InflatorComps.Comps['RefinementBox'] = function RefinementBox(){
        return RefinementBoxClass;
    }
}
var RefinementBoxMW = require('./RefinementBoxMW/RefinementBoxMW');
var RefinementBoxFS = require('./RefinementBoxFS/RefinementBoxFS');

var RefinementBox = function () {
    this.state = {
        filters: []
    };
};

RefinementBox.prototype.render = function () {
    return (
     <div>
			{
       Sephora.isMobile() ?
        <RefinementBoxMW
         {...this.props}
         filters={this.state.filters}
         clearRefinementsBox={this.clearRefinementsBox}
         selectFilter={this.selectFilter}/> :
        <RefinementBoxFS
         {...this.props}
         filters={this.state.filters}
         clearRefinementsBox={this.clearRefinementsBox}
         selectFilter={this.selectFilter}/>
      }
		</div>
    );
};


// Added by sephora-jsx-loader.js
RefinementBox.prototype.path = 'Catalog/ProductFilters/RefinementBox';
// Added by sephora-jsx-loader.js
Object.assign(RefinementBox.prototype, require('./RefinementBox.c.js'));
var originalDidMount = RefinementBox.prototype.componentDidMount;
RefinementBox.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: RefinementBox');
if (originalDidMount) originalDidMount.apply(this);
if (RefinementBox.prototype.ctrlr) RefinementBox.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: RefinementBox');
// Added by sephora-jsx-loader.js
RefinementBox.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
RefinementBox.prototype.class = 'RefinementBox';
// Added by sephora-jsx-loader.js
RefinementBox.prototype.getInitialState = function() {
    RefinementBox.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
RefinementBox.prototype.render = wrapComponentRender(RefinementBox.prototype.render);
// Added by sephora-jsx-loader.js
var RefinementBoxClass = React.createClass(RefinementBox.prototype);
// Added by sephora-jsx-loader.js
RefinementBoxClass.prototype.classRef = RefinementBoxClass;
// Added by sephora-jsx-loader.js
Object.assign(RefinementBoxClass, RefinementBox);
// Added by sephora-jsx-loader.js
module.exports = RefinementBoxClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductFilters/RefinementBox/RefinementBox.jsx