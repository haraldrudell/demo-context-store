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
    Sephora.Util.InflatorComps.Comps['BccTargeter'] = function BccTargeter(){
        return BccTargeterClass;
    }
}
const BccComponentList = require('components/Bcc/BccComponentList/BccComponentList');
const Base = require('components/Base/Base');
const Container = require('components/Container/Container');
const COMPONENT_NAMES = require('utils/BCC').COMPONENT_NAMES;

const BccTargeter = function () {
    this.state = {
        compProps: this.props || null,
        propsCallback: this.props.propsCallback || null,
    };
};

BccTargeter.prototype.render = function () {
    let isBccComponentExceptTargeter = () =>
    Array.isArray(this.state.compProps) ||
            this.state.compProps.componentType !== COMPONENT_NAMES.TARGETER;

    let WrapComp = Base;
    if (this.props.isContained && this.state.compProps.length) {
        if (COMPONENT_NAMES.MARKDOWN !== this.state.compProps[0].componentType) {
            WrapComp = Container;
        }
    }

    return (
        isBccComponentExceptTargeter() ?
            <WrapComp>
                <BccComponentList
                    items={this.state.compProps}
                    propsCallback={this.state.propsCallback}
                    nested={this.props.nested} />
            </WrapComp>
        : null
    );
};


// Added by sephora-jsx-loader.js
BccTargeter.prototype.path = 'Bcc/BccTargeter';
// Added by sephora-jsx-loader.js
Object.assign(BccTargeter.prototype, require('./BccTargeter.c.js'));
var originalDidMount = BccTargeter.prototype.componentDidMount;
BccTargeter.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BccTargeter');
if (originalDidMount) originalDidMount.apply(this);
if (BccTargeter.prototype.ctrlr) BccTargeter.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BccTargeter');
// Added by sephora-jsx-loader.js
BccTargeter.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BccTargeter.prototype.class = 'BccTargeter';
// Added by sephora-jsx-loader.js
BccTargeter.prototype.getInitialState = function() {
    BccTargeter.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BccTargeter.prototype.render = wrapComponentRender(BccTargeter.prototype.render);
// Added by sephora-jsx-loader.js
var BccTargeterClass = React.createClass(BccTargeter.prototype);
// Added by sephora-jsx-loader.js
BccTargeterClass.prototype.classRef = BccTargeterClass;
// Added by sephora-jsx-loader.js
Object.assign(BccTargeterClass, BccTargeter);
// Added by sephora-jsx-loader.js
module.exports = BccTargeterClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Bcc/BccTargeter/BccTargeter.jsx