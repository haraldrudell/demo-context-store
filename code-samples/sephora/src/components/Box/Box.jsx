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
    Sephora.Util.InflatorComps.Comps['Box'] = function Box(){
        return BoxClass;
    }
}
const Base = require('components/Base/Base');

const Box = function () {};

Box.prototype.render = function () {
    const {
        is,
        display,
        ...props
    } = this.props;

    const isFlex = display === 'flex' || display === 'inline-flex';

    let Component = 'div';

    if (is) {
        Component = is;
    } else if (this.props.href) {
        Component = 'a';
    /* NOTE: firefox 39 does not currently support flex layout on `button` */
    } else if (this.props.onClick && !isFlex) {
        Component = 'button';
    }

    const defaultDisplay = Component !== 'div' ? 'block' : null;

    return (
        <Base
            {...props}
            is={Component}
            display={display || defaultDisplay} />
    );
};


// Added by sephora-jsx-loader.js
Box.prototype.path = 'Box';
// Added by sephora-jsx-loader.js
Box.prototype.class = 'Box';
// Added by sephora-jsx-loader.js
Box.prototype.getInitialState = function() {
    Box.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Box.prototype.render = wrapComponentRender(Box.prototype.render);
// Added by sephora-jsx-loader.js
var BoxClass = React.createClass(Box.prototype);
// Added by sephora-jsx-loader.js
BoxClass.prototype.classRef = BoxClass;
// Added by sephora-jsx-loader.js
Object.assign(BoxClass, Box);
// Added by sephora-jsx-loader.js
module.exports = BoxClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Box/Box.jsx