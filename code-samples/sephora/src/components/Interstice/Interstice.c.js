// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Interstice = function () {};

// Added by sephora-jsx-loader.js
Interstice.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
var React = require('react'),
    store = require('Store');

Interstice.prototype.ctrlr = function(){
    let watch = require('redux-watch');

    let w = watch(store.getState, 'interstice');

    store.subscribe(w((newVal, oldVal, objectPath) => {
        this.setState({
            isVisible: newVal.isVisible
        });
    }));

    // console.log('Interstice Initialized');
};


// Added by sephora-jsx-loader.js
module.exports = Interstice.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Interstice/Interstice.c.js