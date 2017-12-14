// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

var TestCertona = function () {};

TestCertona.prototype.asyncRender = 'Certona';

TestCertona.prototype.render = function () {
    return (
        <div
        data-root-comp={this.class}
        style={{ width: '200px', height: '200px', backgroundColor: '#FFAAAA' }}>
            TestCertonaing!!! isRootRender: {Sephora.isRootRender.toString()}
        </div>
    );
};


// Added by sephora-jsx-loader.js
TestCertona.prototype.path = 'TestCertona';
// Added by sephora-jsx-loader.js
Object.assign(TestCertona.prototype, require('./TestCertona.c.js'));
var originalDidMount = TestCertona.prototype.componentDidMount;
TestCertona.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: TestCertona');
if (originalDidMount) originalDidMount.apply(this);
if (TestCertona.prototype.ctrlr) TestCertona.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: TestCertona');
// Added by sephora-jsx-loader.js
TestCertona.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
TestCertona.prototype.class = 'TestCertona';
// Added by sephora-jsx-loader.js
TestCertona.prototype.getInitialState = function() {
    TestCertona.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
TestCertona.prototype.render = wrapComponentRender(TestCertona.prototype.render);
// Added by sephora-jsx-loader.js
var TestCertonaClass = React.createClass(TestCertona.prototype);
// Added by sephora-jsx-loader.js
TestCertonaClass.prototype.classRef = TestCertonaClass;
// Added by sephora-jsx-loader.js
Object.assign(TestCertonaClass, TestCertona);
// Added by sephora-jsx-loader.js
module.exports = TestCertonaClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/TestCertona/TestCertona.jsx