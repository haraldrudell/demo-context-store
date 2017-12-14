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
    Sephora.Util.InflatorComps.Comps['ItemHeader'] = function ItemHeader(){
        return ItemHeaderClass;
    }
}
const { fontSizes, lineHeights, space } = require('style');
const { Box } = require('components/display');
const trackNavClick = require('analytics/bindingMethods/pages/all/navClickBindings').trackNavClick;

const ItemHeader = function () {};

ItemHeader.prototype.render = function () {
    const styles = !this.props.isAccount ? {
        fontSize: fontSizes.h4,
        fontWeight: 700,
        lineHeight: lineHeights[2]
    } : {};
    return (
        <Box
            {...this.props}
            onClick={() => this.props.title && trackNavClick(this.props.title)}
            padding={space[4]}
            color='white'
            backgroundColor='black'
            _css={styles}
            width='100%' />
    );
};


// Added by sephora-jsx-loader.js
ItemHeader.prototype.path = 'Header/Nav/Hamburger/HamburgerItem/ItemHeader';
// Added by sephora-jsx-loader.js
ItemHeader.prototype.class = 'ItemHeader';
// Added by sephora-jsx-loader.js
ItemHeader.prototype.getInitialState = function() {
    ItemHeader.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ItemHeader.prototype.render = wrapComponentRender(ItemHeader.prototype.render);
// Added by sephora-jsx-loader.js
var ItemHeaderClass = React.createClass(ItemHeader.prototype);
// Added by sephora-jsx-loader.js
ItemHeaderClass.prototype.classRef = ItemHeaderClass;
// Added by sephora-jsx-loader.js
Object.assign(ItemHeaderClass, ItemHeader);
// Added by sephora-jsx-loader.js
module.exports = ItemHeaderClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/Hamburger/HamburgerItem/ItemHeader/ItemHeader.jsx