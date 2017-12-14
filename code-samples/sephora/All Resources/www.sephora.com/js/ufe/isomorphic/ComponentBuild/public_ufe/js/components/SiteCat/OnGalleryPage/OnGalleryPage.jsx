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
    Sephora.Util.InflatorComps.Comps['OnGalleryPage'] = function OnGalleryPage(){
        return OnGalleryPageClass;
    }
}
function OnGalleryPage() {}
OnGalleryPage.prototype.render = () => null;


// Added by sephora-jsx-loader.js
OnGalleryPage.prototype.path = 'SiteCat/OnGalleryPage';
// Added by sephora-jsx-loader.js
Object.assign(OnGalleryPage.prototype, require('./OnGalleryPage.c.js'));
var originalDidMount = OnGalleryPage.prototype.componentDidMount;
OnGalleryPage.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: OnGalleryPage');
if (originalDidMount) originalDidMount.apply(this);
if (OnGalleryPage.prototype.ctrlr) OnGalleryPage.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: OnGalleryPage');
// Added by sephora-jsx-loader.js
OnGalleryPage.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
OnGalleryPage.prototype.class = 'OnGalleryPage';
// Added by sephora-jsx-loader.js
OnGalleryPage.prototype.getInitialState = function() {
    OnGalleryPage.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
OnGalleryPage.prototype.render = wrapComponentRender(OnGalleryPage.prototype.render);
// Added by sephora-jsx-loader.js
var OnGalleryPageClass = React.createClass(OnGalleryPage.prototype);
// Added by sephora-jsx-loader.js
OnGalleryPageClass.prototype.classRef = OnGalleryPageClass;
// Added by sephora-jsx-loader.js
Object.assign(OnGalleryPageClass, OnGalleryPage);
// Added by sephora-jsx-loader.js
module.exports = OnGalleryPageClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/SiteCat/OnGalleryPage/OnGalleryPage.jsx