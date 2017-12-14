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
    Sephora.Util.InflatorComps.Comps['StickyBanner'] = function StickyBanner(){
        return StickyBannerClass;
    }
}
const { shade, zIndex } = require('style');
const Box = require('components/Box/Box');

const StickyBanner = function () {};

StickyBanner.prototype.render = function () {

    const {
        isOpen,
        animated,
        ...props
    } = this.props;

    return (
        <Box
            {...props}
            position='fixed'
            zIndex={zIndex.HEADER}
            right={0} bottom={0} left={0}
            boxShadow={`0 -4px 8px 0 ${shade[2]}`}
            backgroundColor='white'
            transition='transform .3s'
            style={{
                transform: isOpen ? 'translate3d(0, 0, 0)' : 'translate3d(0, 105%, 0)'
            }} />
    );
};


// Added by sephora-jsx-loader.js
StickyBanner.prototype.path = 'Banner/StickyBanner';
// Added by sephora-jsx-loader.js
StickyBanner.prototype.class = 'StickyBanner';
// Added by sephora-jsx-loader.js
StickyBanner.prototype.getInitialState = function() {
    StickyBanner.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
StickyBanner.prototype.render = wrapComponentRender(StickyBanner.prototype.render);
// Added by sephora-jsx-loader.js
var StickyBannerClass = React.createClass(StickyBanner.prototype);
// Added by sephora-jsx-loader.js
StickyBannerClass.prototype.classRef = StickyBannerClass;
// Added by sephora-jsx-loader.js
Object.assign(StickyBannerClass, StickyBanner);
// Added by sephora-jsx-loader.js
module.exports = StickyBannerClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Banner/StickyBanner/StickyBanner.jsx