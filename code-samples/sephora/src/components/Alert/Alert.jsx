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
    Sephora.Util.InflatorComps.Comps['Alert'] = function Alert(){
        return AlertClass;
    }
}
var Alert = function () {
    this.state = {
        messages: this.props.messages,
        type: this.props.type
    };
};

Alert.prototype.render = function () {

    return (
      <div>
      <div>
        {this.props.messages.map(function (message, index) {
            return <div key={index}>{message}</div>;
        })
        }
    </div>
    </div>
    );
};


// Added by sephora-jsx-loader.js
Alert.prototype.path = 'Alert';
// Added by sephora-jsx-loader.js
Object.assign(Alert.prototype, require('./Alert.c.js'));
var originalDidMount = Alert.prototype.componentDidMount;
Alert.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Alert');
if (originalDidMount) originalDidMount.apply(this);
if (Alert.prototype.ctrlr) Alert.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Alert');
// Added by sephora-jsx-loader.js
Alert.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Alert.prototype.class = 'Alert';
// Added by sephora-jsx-loader.js
Alert.prototype.getInitialState = function() {
    Alert.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Alert.prototype.render = wrapComponentRender(Alert.prototype.render);
// Added by sephora-jsx-loader.js
var AlertClass = React.createClass(Alert.prototype);
// Added by sephora-jsx-loader.js
AlertClass.prototype.classRef = AlertClass;
// Added by sephora-jsx-loader.js
Object.assign(AlertClass, Alert);
// Added by sephora-jsx-loader.js
module.exports = AlertClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Alert/Alert.jsx