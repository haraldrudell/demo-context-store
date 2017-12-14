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
    Sephora.Util.InflatorComps.Comps['OnProductPage'] = function OnProductPage(){
        return OnProductPageClass;
    }
}
function OnProductPage() {}
OnProductPage.prototype.render = () => null;


// Added by sephora-jsx-loader.js
OnProductPage.prototype.path = 'SiteCat/OnProductPage';
// Added by sephora-jsx-loader.js
Object.assign(OnProductPage.prototype, require('./OnProductPage.c.js'));
var originalDidMount = OnProductPage.prototype.componentDidMount;
OnProductPage.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: OnProductPage');
if (originalDidMount) originalDidMount.apply(this);
if (OnProductPage.prototype.ctrlr) OnProductPage.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: OnProductPage');
// Added by sephora-jsx-loader.js
OnProductPage.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
OnProductPage.prototype.class = 'OnProductPage';
// Added by sephora-jsx-loader.js
OnProductPage.prototype.getInitialState = function() {
    OnProductPage.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
OnProductPage.prototype.render = wrapComponentRender(OnProductPage.prototype.render);
// Added by sephora-jsx-loader.js
var OnProductPageClass = React.createClass(OnProductPage.prototype);
// Added by sephora-jsx-loader.js
OnProductPageClass.prototype.classRef = OnProductPageClass;
// Added by sephora-jsx-loader.js
Object.assign(OnProductPageClass, OnProductPage);
// Added by sephora-jsx-loader.js
module.exports = OnProductPageClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/SiteCat/OnProductPage/OnProductPage.jsx