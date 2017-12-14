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
    Sephora.Util.InflatorComps.Comps['Loader'] = function Loader(){
        return LoaderClass;
    }
}
const Box = require('components/Box/Box');

var Loader = function () {};

Loader.prototype.render = function () {
    const {
        isFixed,
        isShown,
        ...props
    } = this.props;

    return (
        <Box
            {...props}
            position={isFixed ? 'fixed' : 'absolute'}
            top={0} right={0} bottom={0} left={0}
            cursor='wait'
            backgroundImage='url(/img/ufe/loader.gif)'
            backgroundRepeat='no-repeat'
            backgroundPosition='center'
            backgroundColor='rgba(255,255,255,.75)'
            style={{
                display: !isShown ? 'none' : null
            }} />
    );
};

Loader.prototype.propTypes = {
    /** Fixed fullscreen overlay */
    isFixed: React.PropTypes.bool,
    /** Shows and hides Loader */
    isShown: React.PropTypes.bool
};


// Added by sephora-jsx-loader.js
Loader.prototype.path = 'Loader';
// Added by sephora-jsx-loader.js
Loader.prototype.class = 'Loader';
// Added by sephora-jsx-loader.js
Loader.prototype.getInitialState = function() {
    Loader.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Loader.prototype.render = wrapComponentRender(Loader.prototype.render);
// Added by sephora-jsx-loader.js
var LoaderClass = React.createClass(Loader.prototype);
// Added by sephora-jsx-loader.js
LoaderClass.prototype.classRef = LoaderClass;
// Added by sephora-jsx-loader.js
Object.assign(LoaderClass, Loader);
// Added by sephora-jsx-loader.js
module.exports = LoaderClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Loader/Loader.jsx