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
    Sephora.Util.InflatorComps.Comps['HiddenInput'] = function HiddenInput(){
        return HiddenInputClass;
    }
}
const Base = require('components/Base/Base');

const HiddenInput = function () {
    this.state = {
        value: this.props.value,
    };
};

HiddenInput.prototype.render = function () {
    return (
        <Base
            {...this.props}
            is='input'
            type='hidden'
            value={this.state.value}
        />
    );
};


// Added by sephora-jsx-loader.js
HiddenInput.prototype.path = 'Inputs/HiddenInput';
// Added by sephora-jsx-loader.js
Object.assign(HiddenInput.prototype, require('./HiddenInput.c.js'));
var originalDidMount = HiddenInput.prototype.componentDidMount;
HiddenInput.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: HiddenInput');
if (originalDidMount) originalDidMount.apply(this);
if (HiddenInput.prototype.ctrlr) HiddenInput.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: HiddenInput');
// Added by sephora-jsx-loader.js
HiddenInput.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
HiddenInput.prototype.class = 'HiddenInput';
// Added by sephora-jsx-loader.js
HiddenInput.prototype.getInitialState = function() {
    HiddenInput.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
HiddenInput.prototype.render = wrapComponentRender(HiddenInput.prototype.render);
// Added by sephora-jsx-loader.js
var HiddenInputClass = React.createClass(HiddenInput.prototype);
// Added by sephora-jsx-loader.js
HiddenInputClass.prototype.classRef = HiddenInputClass;
// Added by sephora-jsx-loader.js
Object.assign(HiddenInputClass, HiddenInput);
// Added by sephora-jsx-loader.js
module.exports = HiddenInputClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Inputs/HiddenInput/HiddenInput.jsx