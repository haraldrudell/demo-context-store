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
    Sephora.Util.InflatorComps.Comps['OlapicComponent'] = function OlapicComponent(){
        return OlapicComponentClass;
    }
}
function OlapicComponent() {}

OlapicComponent.prototype.render = function () {
    return <div id={this.props.containerId}></div>;
};


// Added by sephora-jsx-loader.js
OlapicComponent.prototype.path = 'BeautyBoard/OlapicComponent';
// Added by sephora-jsx-loader.js
Object.assign(OlapicComponent.prototype, require('./OlapicComponent.c.js'));
var originalDidMount = OlapicComponent.prototype.componentDidMount;
OlapicComponent.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: OlapicComponent');
if (originalDidMount) originalDidMount.apply(this);
if (OlapicComponent.prototype.ctrlr) OlapicComponent.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: OlapicComponent');
// Added by sephora-jsx-loader.js
OlapicComponent.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
OlapicComponent.prototype.class = 'OlapicComponent';
// Added by sephora-jsx-loader.js
OlapicComponent.prototype.getInitialState = function() {
    OlapicComponent.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
OlapicComponent.prototype.render = wrapComponentRender(OlapicComponent.prototype.render);
// Added by sephora-jsx-loader.js
var OlapicComponentClass = React.createClass(OlapicComponent.prototype);
// Added by sephora-jsx-loader.js
OlapicComponentClass.prototype.classRef = OlapicComponentClass;
// Added by sephora-jsx-loader.js
Object.assign(OlapicComponentClass, OlapicComponent);
// Added by sephora-jsx-loader.js
module.exports = OlapicComponentClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BeautyBoard/OlapicComponent/OlapicComponent.jsx