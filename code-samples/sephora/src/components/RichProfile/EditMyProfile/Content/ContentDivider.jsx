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
    Sephora.Util.InflatorComps.Comps['ContentDivider'] = function ContentDivider(){
        return ContentDividerClass;
    }
}
const { modal, space } = require('style');
const Divider = require('components/Divider/Divider');

const ContentDivider = function () {};

ContentDivider.prototype.render = function () {
    return (
        Sephora.isMobile() ?
            <Divider
                marginY={space[4]}
                marginX={-modal.PADDING_MW}
                height={space[2]}
                color='nearWhite' />
        :
            <Divider
                marginY={space[6]}
                marginX={-space[5]} />

    );
};


// Added by sephora-jsx-loader.js
ContentDivider.prototype.path = 'RichProfile/EditMyProfile/Content';
// Added by sephora-jsx-loader.js
ContentDivider.prototype.class = 'ContentDivider';
// Added by sephora-jsx-loader.js
ContentDivider.prototype.getInitialState = function() {
    ContentDivider.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ContentDivider.prototype.render = wrapComponentRender(ContentDivider.prototype.render);
// Added by sephora-jsx-loader.js
var ContentDividerClass = React.createClass(ContentDivider.prototype);
// Added by sephora-jsx-loader.js
ContentDividerClass.prototype.classRef = ContentDividerClass;
// Added by sephora-jsx-loader.js
Object.assign(ContentDividerClass, ContentDivider);
// Added by sephora-jsx-loader.js
module.exports = ContentDividerClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/EditMyProfile/Content/ContentDivider.jsx