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
    Sephora.Util.InflatorComps.Comps['BeautyMatchBadge'] = function BeautyMatchBadge(){
        return BeautyMatchBadgeClass;
    }
}
const { space } = require('style');
const { Flex, Text } = require('components/display');
const IconVenn = require('components/Icon/IconVenn');

const BeautyMatchBadge = function () {};

BeautyMatchBadge.prototype.render = function () {
    const {
        isVerticalAlign,
        isPlural,
        ...props
    } = this.props;
    return (
        <Flex
            {...props}
            isInline={true}
            alignItems='center'
            rounded={true}
            fontSize='h5'
            fontWeight={700}
            lineHeight={1}
            backgroundColor='nearWhite'
            paddingX={space[2]}
            paddingY={space[1]}
            marginY={isVerticalAlign ? -space[1] : null}>
            <IconVenn
                fontSize='1.083em' />
            <Text
                marginLeft={space[1]}>
                Beauty Match{isPlural && 'es'}
            </Text>
        </Flex>
    );
};


// Added by sephora-jsx-loader.js
BeautyMatchBadge.prototype.path = 'BeautyMatchBadge';
// Added by sephora-jsx-loader.js
BeautyMatchBadge.prototype.class = 'BeautyMatchBadge';
// Added by sephora-jsx-loader.js
BeautyMatchBadge.prototype.getInitialState = function() {
    BeautyMatchBadge.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BeautyMatchBadge.prototype.render = wrapComponentRender(BeautyMatchBadge.prototype.render);
// Added by sephora-jsx-loader.js
var BeautyMatchBadgeClass = React.createClass(BeautyMatchBadge.prototype);
// Added by sephora-jsx-loader.js
BeautyMatchBadgeClass.prototype.classRef = BeautyMatchBadgeClass;
// Added by sephora-jsx-loader.js
Object.assign(BeautyMatchBadgeClass, BeautyMatchBadge);
// Added by sephora-jsx-loader.js
module.exports = BeautyMatchBadgeClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BeautyMatchBadge/BeautyMatchBadge.jsx