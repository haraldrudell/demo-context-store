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
    Sephora.Util.InflatorComps.Comps['BccStyleWrapper'] = function BccStyleWrapper(){
        return BccStyleWrapperClass;
    }
}
const { space } = require('style');
const Box = require('components/Box/Box');

let BccStyleWrapper = function () {};

BccStyleWrapper.prototype.render = function () {

    const {
        isTopNav,
        customStyle,
        ...props
    } = this.props;

    // convert style properties Array to Object
    let styleProps = {};
    customStyle && customStyle.map((property) => {
        styleProps[property] = true;
    });

    const verticalPadding = isTopNav ? space[4] :
        (Sephora.isMobile() ? space[6] : space[7]);

    let classes;
    if (styleProps.FR_CA_HIDE) {
        classes = 'OneLinkHide';
    } else if (styleProps.FR_CA_SHOW) {
        classes = 'OneLinkShow';
    }

    return (
        <Box
            {...props}
            className={classes}
            paddingTop={styleProps.TOP_PADDING ? verticalPadding : null}
            paddingBottom={styleProps.BOTTOM_PADDING ? verticalPadding : null} />
    );
};


// Added by sephora-jsx-loader.js
BccStyleWrapper.prototype.path = 'Bcc/BccStyleWrapper';
// Added by sephora-jsx-loader.js
BccStyleWrapper.prototype.class = 'BccStyleWrapper';
// Added by sephora-jsx-loader.js
BccStyleWrapper.prototype.getInitialState = function() {
    BccStyleWrapper.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BccStyleWrapper.prototype.render = wrapComponentRender(BccStyleWrapper.prototype.render);
// Added by sephora-jsx-loader.js
var BccStyleWrapperClass = React.createClass(BccStyleWrapper.prototype);
// Added by sephora-jsx-loader.js
BccStyleWrapperClass.prototype.classRef = BccStyleWrapperClass;
// Added by sephora-jsx-loader.js
Object.assign(BccStyleWrapperClass, BccStyleWrapper);
// Added by sephora-jsx-loader.js
module.exports = BccStyleWrapperClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Bcc/BccStyleWrapper/BccStyleWrapper.jsx