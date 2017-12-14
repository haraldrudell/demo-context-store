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
    Sephora.Util.InflatorComps.Comps['Interstice'] = function Interstice(){
        return IntersticeClass;
    }
}
const { zIndex } = require('style');
const Loader = require('components/Loader/Loader');

const Interstice = function () {
    this.state = {
        isVisible: false
    };
};

Interstice.prototype.render = function () {
    return (
        <Loader
            isFixed={true}
            isShown={this.state.isVisible}
            zIndex={zIndex.MAX} />
    );
};


// Added by sephora-jsx-loader.js
Interstice.prototype.path = 'Interstice';
// Added by sephora-jsx-loader.js
Object.assign(Interstice.prototype, require('./Interstice.c.js'));
var originalDidMount = Interstice.prototype.componentDidMount;
Interstice.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Interstice');
if (originalDidMount) originalDidMount.apply(this);
if (Interstice.prototype.ctrlr) Interstice.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Interstice');
// Added by sephora-jsx-loader.js
Interstice.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Interstice.prototype.class = 'Interstice';
// Added by sephora-jsx-loader.js
Interstice.prototype.getInitialState = function() {
    Interstice.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Interstice.prototype.render = wrapComponentRender(Interstice.prototype.render);
// Added by sephora-jsx-loader.js
var IntersticeClass = React.createClass(Interstice.prototype);
// Added by sephora-jsx-loader.js
IntersticeClass.prototype.classRef = IntersticeClass;
// Added by sephora-jsx-loader.js
Object.assign(IntersticeClass, Interstice);
// Added by sephora-jsx-loader.js
module.exports = IntersticeClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Interstice/Interstice.jsx