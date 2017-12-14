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
    Sephora.Util.InflatorComps.Comps['InputSwitch'] = function InputSwitch(){
        return InputSwitchClass;
    }
}
const { borderRadius, colors } = require('style');
const { Box, Flex } = require('components/display');

const InputSwitch = function () {};

InputSwitch.prototype.render = function () {
    const {
        name,
        checked,
        ...props
    } = this.props;

    const size = 30;
    const color = checked ? colors.green : colors.moonGray;
    const transform = checked ? `translateX(${size}px)` : 'translateX(0)';

    return (
        <Flex
            is='label'
            isInline={true}
            rounded={true}
            width={size * 2}
            height={size}
            backgroundColor={color}
            transition='background-color .1s ease-in'
            cursor='pointer'>
            <Box
                {...props}
                is='input'
                type='checkbox'
                position='absolute'
                opacity={0}
                value={props.value ? props.value : ''}
                name={name}
                checked={checked} />
            <Box
                width={size} height={size}
                transform={transform}
                rounded={borderRadius}
                boxShadow='inset 0 0 0 2px'
                color={color}
                backgroundColor='white'
                _css={{
                    transitionProperty: 'transform, color',
                    transitionDuration: '.1s',
                    transitionTimingFunction: 'ease-in'
                }} />
        </Flex>
    );
};


// Added by sephora-jsx-loader.js
InputSwitch.prototype.path = 'Inputs/InputSwitch';
// Added by sephora-jsx-loader.js
InputSwitch.prototype.class = 'InputSwitch';
// Added by sephora-jsx-loader.js
InputSwitch.prototype.getInitialState = function() {
    InputSwitch.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
InputSwitch.prototype.render = wrapComponentRender(InputSwitch.prototype.render);
// Added by sephora-jsx-loader.js
var InputSwitchClass = React.createClass(InputSwitch.prototype);
// Added by sephora-jsx-loader.js
InputSwitchClass.prototype.classRef = InputSwitchClass;
// Added by sephora-jsx-loader.js
Object.assign(InputSwitchClass, InputSwitch);
// Added by sephora-jsx-loader.js
module.exports = InputSwitchClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Inputs/InputSwitch/InputSwitch.jsx