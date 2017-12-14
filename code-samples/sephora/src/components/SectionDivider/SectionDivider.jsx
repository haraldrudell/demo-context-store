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
    Sephora.Util.InflatorComps.Comps['SectionDivider'] = function SectionDivider(){
        return SectionDividerClass;
    }
}
const { site, space } = require('style');
const Divider = require('components/Divider/Divider');

const SectionDivider = function () {};

SectionDivider.prototype.render = function () {
    const {
        marginY = space[5],
        ...props
    } = this.props;

    return (
        Sephora.isMobile() ?
            <Divider
                {...props}
                color='nearWhite'
                height={space[2]}
                marginY={marginY}
                marginX={-site.PADDING_MW} />
        :
            <Divider
                {...props}
                marginY={marginY}
                color='lightGray' />
    );
};


// Added by sephora-jsx-loader.js
SectionDivider.prototype.path = 'SectionDivider';
// Added by sephora-jsx-loader.js
SectionDivider.prototype.class = 'SectionDivider';
// Added by sephora-jsx-loader.js
SectionDivider.prototype.getInitialState = function() {
    SectionDivider.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
SectionDivider.prototype.render = wrapComponentRender(SectionDivider.prototype.render);
// Added by sephora-jsx-loader.js
var SectionDividerClass = React.createClass(SectionDivider.prototype);
// Added by sephora-jsx-loader.js
SectionDividerClass.prototype.classRef = SectionDividerClass;
// Added by sephora-jsx-loader.js
Object.assign(SectionDividerClass, SectionDivider);
// Added by sephora-jsx-loader.js
module.exports = SectionDividerClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/SectionDivider/SectionDivider.jsx