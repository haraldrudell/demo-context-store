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
    Sephora.Util.InflatorComps.Comps['CatNavHeading'] = function CatNavHeading(){
        return CatNavHeadingClass;
    }
}
const { colors, space } = require('style');
const { Box } = require('components/display');

const CatNavHeading = function () { };

CatNavHeading.prototype.render = function () {
    const {
        href,
        marginBottom,
        ...props
    } = this.props;

    return (
        <Box
            {...props}
            fontWeight={700}
            paddingY={space[2]}
            marginTop={-space[2]}
            marginBottom={marginBottom || space[4]}
            hoverColor={href && colors.gray}
            href={href} />
    );
};


// Added by sephora-jsx-loader.js
CatNavHeading.prototype.path = 'Header/Nav/CatNav/CatNavChild/CatNavHeading';
// Added by sephora-jsx-loader.js
CatNavHeading.prototype.class = 'CatNavHeading';
// Added by sephora-jsx-loader.js
CatNavHeading.prototype.getInitialState = function() {
    CatNavHeading.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
CatNavHeading.prototype.render = wrapComponentRender(CatNavHeading.prototype.render);
// Added by sephora-jsx-loader.js
var CatNavHeadingClass = React.createClass(CatNavHeading.prototype);
// Added by sephora-jsx-loader.js
CatNavHeadingClass.prototype.classRef = CatNavHeadingClass;
// Added by sephora-jsx-loader.js
Object.assign(CatNavHeadingClass, CatNavHeading);
// Added by sephora-jsx-loader.js
module.exports = CatNavHeadingClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/CatNav/CatNavChild/CatNavHeading/CatNavHeading.jsx