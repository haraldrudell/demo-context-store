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
    Sephora.Util.InflatorComps.Comps['BccLinkWrapper'] = function BccLinkWrapper(){
        return BccLinkWrapperClass;
    }
}
const { colors, site } = require('style');
const { Box } = require('components/display');
const BccLink = require('components/Bcc/BccLink/BccLink');

const BccLinkWrapper = function () { };

BccLinkWrapper.prototype.render = function () {
    const { linkIndex } = this.props;

    return (
        <Box
            key={linkIndex}
            is='li' lineHeight={2}
            marginLeft={Sephora.isMobile() ? site.PADDING_MW : null}
            _css={linkIndex > 0 ? {
                borderTopWidth: 1,
                borderColor: colors.lightGray
            } : null}>
            <BccLink {...this.props} />
        </Box>
    );
};


// Added by sephora-jsx-loader.js
BccLinkWrapper.prototype.path = 'Bcc/BccLinkGroup';
// Added by sephora-jsx-loader.js
BccLinkWrapper.prototype.class = 'BccLinkWrapper';
// Added by sephora-jsx-loader.js
BccLinkWrapper.prototype.getInitialState = function() {
    BccLinkWrapper.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BccLinkWrapper.prototype.render = wrapComponentRender(BccLinkWrapper.prototype.render);
// Added by sephora-jsx-loader.js
var BccLinkWrapperClass = React.createClass(BccLinkWrapper.prototype);
// Added by sephora-jsx-loader.js
BccLinkWrapperClass.prototype.classRef = BccLinkWrapperClass;
// Added by sephora-jsx-loader.js
Object.assign(BccLinkWrapperClass, BccLinkWrapper);
// Added by sephora-jsx-loader.js
module.exports = BccLinkWrapperClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Bcc/BccLinkGroup/BccLinkWrapper.jsx