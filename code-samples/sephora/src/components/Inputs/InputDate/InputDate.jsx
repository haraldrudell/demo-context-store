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
    Sephora.Util.InflatorComps.Comps['InputDate'] = function InputDate(){
        return InputDateClass;
    }
}
const TextInput = require('components/Inputs/TextInput/TextInput');
const Date = require('utils/Date');

const InputDate = function () {
    this.state = {
        value: this.props.value ? this.props.value : ''
    };
    this.inputElement = null;
};

InputDate.prototype.render = function () {
    return (
        <TextInput
            {...this.props}
            type={this.props.type || 'date'}
            max={this.props.max}
            ref={
                (c) => {
                    if (c !== null) {
                        this.inputDate = c;
                    }
                }
            } />
    );
};


// Added by sephora-jsx-loader.js
InputDate.prototype.path = 'Inputs/InputDate';
// Added by sephora-jsx-loader.js
Object.assign(InputDate.prototype, require('./InputDate.c.js'));
var originalDidMount = InputDate.prototype.componentDidMount;
InputDate.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: InputDate');
if (originalDidMount) originalDidMount.apply(this);
if (InputDate.prototype.ctrlr) InputDate.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: InputDate');
// Added by sephora-jsx-loader.js
InputDate.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
InputDate.prototype.class = 'InputDate';
// Added by sephora-jsx-loader.js
InputDate.prototype.getInitialState = function() {
    InputDate.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
InputDate.prototype.render = wrapComponentRender(InputDate.prototype.render);
// Added by sephora-jsx-loader.js
var InputDateClass = React.createClass(InputDate.prototype);
// Added by sephora-jsx-loader.js
InputDateClass.prototype.classRef = InputDateClass;
// Added by sephora-jsx-loader.js
Object.assign(InputDateClass, InputDate);
// Added by sephora-jsx-loader.js
module.exports = InputDateClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Inputs/InputDate/InputDate.jsx