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
    Sephora.Util.InflatorComps.Comps['ItemMenu'] = function ItemMenu(){
        return ItemMenuClass;
    }
}
const { space } = require('style');
const { Box, Flex } = require('components/display');
const Chevron = require('components/Chevron/Chevron');

const ItemMenu = function () {};

ItemMenu.prototype.render = function () {
    return (
        <Box
            backgroundColor='white'
            position='absolute'
            zIndex={1}
            top={0} right={0} left={0}
            minHeight='100%'
            transition='transform .3s ease-in-out'
            transform={`translate3d(${this.props.isOpen ? '0' : '100%'},0,0)`}>
            <Flex
                alignItems='center'
                padding={space[4]}
                lineHeight={2}
                onClick={() => this.props.toggleSubmenu(false)}>
                <Chevron
                    direction='left'
                    marginRight={space[3]} />
                Back
            </Flex>
            {this.props.children}
        </Box>
    );
};


// Added by sephora-jsx-loader.js
ItemMenu.prototype.path = 'Header/Nav/Hamburger/HamburgerItem/ItemMenu';
// Added by sephora-jsx-loader.js
ItemMenu.prototype.class = 'ItemMenu';
// Added by sephora-jsx-loader.js
ItemMenu.prototype.getInitialState = function() {
    ItemMenu.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ItemMenu.prototype.render = wrapComponentRender(ItemMenu.prototype.render);
// Added by sephora-jsx-loader.js
var ItemMenuClass = React.createClass(ItemMenu.prototype);
// Added by sephora-jsx-loader.js
ItemMenuClass.prototype.classRef = ItemMenuClass;
// Added by sephora-jsx-loader.js
Object.assign(ItemMenuClass, ItemMenu);
// Added by sephora-jsx-loader.js
module.exports = ItemMenuClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/Hamburger/HamburgerItem/ItemMenu/ItemMenu.jsx