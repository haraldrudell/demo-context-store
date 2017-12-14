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
    Sephora.Util.InflatorComps.Comps['Empty'] = function Empty(){
        return EmptyClass;
    }
}
let Empty = function () {
    return null;
};

Empty.prototype.getInitialState = Empty;

Empty.prototype.render = function () {
    return null;
};



// Added by sephora-jsx-loader.js
Empty.prototype.path = 'Empty';
// Added by sephora-jsx-loader.js
Empty.prototype.class = 'Empty';
// Added by sephora-jsx-loader.js
Empty.prototype.getInitialState = function() {
    Empty.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Empty.prototype.render = wrapComponentRender(Empty.prototype.render);
// Added by sephora-jsx-loader.js
var EmptyClass = React.createClass(Empty.prototype);
// Added by sephora-jsx-loader.js
EmptyClass.prototype.classRef = EmptyClass;
// Added by sephora-jsx-loader.js
Object.assign(EmptyClass, Empty);
// Added by sephora-jsx-loader.js
module.exports = EmptyClass;


// WEBPACK FOOTER //
// ./public_ufe/js/pages/Empty/Empty.jsx