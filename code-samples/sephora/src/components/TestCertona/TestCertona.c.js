// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var TestCertona = function () {};

// Added by sephora-jsx-loader.js
TestCertona.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
var ReactDOM = require('react-dom');

TestCertona.prototype.ctrlr = function(){
    
    // var el = this.getDOMNode();
    var el = ReactDOM.findDOMNode(this);
    el.addEventListener('click', function(){
        alert('TestCertona!!!');
    });
};


// Added by sephora-jsx-loader.js
module.exports = TestCertona.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/TestCertona/TestCertona.c.js