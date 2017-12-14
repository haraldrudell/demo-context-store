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
    Sephora.Util.InflatorComps.Comps['Arrow'] = function Arrow(){
        return ArrowClass;
    }
}
const Box = require('components/Box/Box');

/** Arrow for use in dropdowns and other UI elements */
const Arrow = function () {};

Arrow.prototype.render = function () {
    const {
        direction = 'down',
        ...props
    } = this.props;

    const solid = '.4375em solid';
    const trans = '.375em solid transparent';

    const styles = {
        width: 0,
        height: 0,
        verticalAlign: 'middle',
        color: 'inherit',
        borderLeft: direction === 'right'
            ? solid
            : direction === 'left'
                ? 0
                : trans,
        borderRight: direction === 'left'
            ? solid
            : direction === 'right'
                ? 0
                : trans,
        borderTop: direction === 'down'
            ? solid
            : direction === 'up'
                ? 0
                : trans,
        borderBottom: direction === 'up'
            ? solid
            : direction === 'down'
                ? 0
                : trans
    };
    return (
        <Box
            {...props}
            is='span'
            display='inline-block'
            baseStyle={styles} />
    );
};

Arrow.prototype.propTypes = {
    direction: React.PropTypes.oneOf(['up', 'down', 'left', 'right'])
};


// Added by sephora-jsx-loader.js
Arrow.prototype.path = 'Arrow';
// Added by sephora-jsx-loader.js
Arrow.prototype.class = 'Arrow';
// Added by sephora-jsx-loader.js
Arrow.prototype.getInitialState = function() {
    Arrow.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Arrow.prototype.render = wrapComponentRender(Arrow.prototype.render);
// Added by sephora-jsx-loader.js
var ArrowClass = React.createClass(Arrow.prototype);
// Added by sephora-jsx-loader.js
ArrowClass.prototype.classRef = ArrowClass;
// Added by sephora-jsx-loader.js
Object.assign(ArrowClass, Arrow);
// Added by sephora-jsx-loader.js
module.exports = ArrowClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Arrow/Arrow.jsx