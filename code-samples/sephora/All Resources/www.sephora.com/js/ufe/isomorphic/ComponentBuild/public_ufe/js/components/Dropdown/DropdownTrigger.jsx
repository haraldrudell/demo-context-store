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
    Sephora.Util.InflatorComps.Comps['DropdownTrigger'] = function DropdownTrigger(){
        return DropdownTriggerClass;
    }
}
const Base = require('components/Base/Base');

const DropdownTrigger = function () {};

DropdownTrigger.prototype.render = function () {
    const {
        open,
        isHover,
        triggerDropdown,
        ...props
    } = this.props;

    return (
        <Base
            {...props} />
    );
};


// Added by sephora-jsx-loader.js
DropdownTrigger.prototype.path = 'Dropdown';
// Added by sephora-jsx-loader.js
DropdownTrigger.prototype.class = 'DropdownTrigger';
// Added by sephora-jsx-loader.js
DropdownTrigger.prototype.getInitialState = function() {
    DropdownTrigger.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
DropdownTrigger.prototype.render = wrapComponentRender(DropdownTrigger.prototype.render);
// Added by sephora-jsx-loader.js
var DropdownTriggerClass = React.createClass(DropdownTrigger.prototype);
// Added by sephora-jsx-loader.js
DropdownTriggerClass.prototype.classRef = DropdownTriggerClass;
// Added by sephora-jsx-loader.js
Object.assign(DropdownTriggerClass, DropdownTrigger);
// Added by sephora-jsx-loader.js
module.exports = DropdownTriggerClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Dropdown/DropdownTrigger.jsx