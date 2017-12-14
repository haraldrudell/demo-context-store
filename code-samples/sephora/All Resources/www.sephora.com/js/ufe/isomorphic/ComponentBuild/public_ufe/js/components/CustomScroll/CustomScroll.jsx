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
    Sephora.Util.InflatorComps.Comps['CustomScroll'] = function CustomScroll(){
        return CustomScrollClass;
    }
}
const colors = require('style').colors;
const Box = require('components/Box/Box');

/**
 * A custom scrollbar design (webkit only)
 */

const CustomScroll = function () {};

CustomScroll.prototype.render = function () {

    return (
        <Box
            {...this.props}
            baseStyle={{
                overflowY: 'auto',
                overflowX: 'hidden',
                '&::-webkit-scrollbar': {
                    width: 8,
                    height: 8,
                    backgroundColor: colors.lightGray,
                    borderRadius: 99999
                },
                '&::-webkit-scrollbar-thumb': {
                    minHeight: 8,
                    backgroundColor: colors.black,
                    borderRadius: 99999,
                    border: '2px solid transparent',
                    backgroundClip: 'content-box'
                }
            }} />
    );
};


// Added by sephora-jsx-loader.js
CustomScroll.prototype.path = 'CustomScroll';
// Added by sephora-jsx-loader.js
CustomScroll.prototype.class = 'CustomScroll';
// Added by sephora-jsx-loader.js
CustomScroll.prototype.getInitialState = function() {
    CustomScroll.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
CustomScroll.prototype.render = wrapComponentRender(CustomScroll.prototype.render);
// Added by sephora-jsx-loader.js
var CustomScrollClass = React.createClass(CustomScroll.prototype);
// Added by sephora-jsx-loader.js
CustomScrollClass.prototype.classRef = CustomScrollClass;
// Added by sephora-jsx-loader.js
Object.assign(CustomScrollClass, CustomScroll);
// Added by sephora-jsx-loader.js
module.exports = CustomScrollClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/CustomScroll/CustomScroll.jsx