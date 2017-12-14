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
    Sephora.Util.InflatorComps.Comps['Test'] = function Test(){
        return TestClass;
    }
}
var Test = function () {
    this.state = {};
};

Test.prototype.getTestContent = function () {
    return 'Hello ' + this.props.greeting;
};

Test.prototype.render = function () {
    return (
        <div onClick={this.click}><h1>{this.getTestContent()}</h1></div>
    );
};



// Added by sephora-jsx-loader.js
Test.prototype.path = 'Test';
// Added by sephora-jsx-loader.js
Object.assign(Test.prototype, require('./Test.c.js'));
var originalDidMount = Test.prototype.componentDidMount;
Test.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Test');
if (originalDidMount) originalDidMount.apply(this);
if (Test.prototype.ctrlr) Test.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Test');
// Added by sephora-jsx-loader.js
Test.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Test.prototype.class = 'Test';
// Added by sephora-jsx-loader.js
Test.prototype.getInitialState = function() {
    Test.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Test.prototype.render = wrapComponentRender(Test.prototype.render);
// Added by sephora-jsx-loader.js
var TestClass = React.createClass(Test.prototype);
// Added by sephora-jsx-loader.js
TestClass.prototype.classRef = TestClass;
// Added by sephora-jsx-loader.js
Object.assign(TestClass, Test);
// Added by sephora-jsx-loader.js
module.exports = TestClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Test/Test.jsx