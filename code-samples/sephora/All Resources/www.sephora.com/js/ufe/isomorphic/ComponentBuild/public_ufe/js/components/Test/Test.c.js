// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Test = function () {};

// Added by sephora-jsx-loader.js
Test.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
var ReactDOM = require('react-dom');

/* onClick Handler */
Test.prototype.click = function(){
    alert(this.class + '!!! YEAHHH!');
    this.setState({}, () => console.log('re-Rendered'));
};

/* This is run by componentDidMount() if you are using react */
Test.prototype.ctrlr = function(){
    
    // var el = this.getDOMNode();
    var el = ReactDOM.findDOMNode(this);
};

/* You can use any react lifecycle functions by attaching them to the prototype */
Test.prototype.componentWillMount = function(){
    console.log('Test Component is about to Mount');
};


// Added by sephora-jsx-loader.js
module.exports = Test.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Test/Test.c.js