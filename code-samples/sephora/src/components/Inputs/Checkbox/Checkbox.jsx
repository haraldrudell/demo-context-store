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
    Sephora.Util.InflatorComps.Comps['Checkbox'] = function Checkbox(){
        return CheckboxClass;
    }
}
const css = require('glamor').css;
const { colors, forms } = require('style');
const { Box, Flex } = require('components/display');

const Checkbox = function () {};

Checkbox.prototype.render = function () {
    const {
        isInline,
        isSmall,
        hasCenteredBox,
        checked,
        children,
        disabled,
        paddingY = '.375em',
        ...props
    } = this.props;

    const checkSize = isSmall ? forms.RADIO_SIZE_SM : forms.RADIO_SIZE;
    const checkMargin = isSmall ? forms.RADIO_MARGIN_SM : forms.RADIO_MARGIN;

    const styles = {
        box: {
            width: checkSize,
            height: checkSize,
            marginTop: '-.0625em',
            marginRight: checkMargin,
            backgroundColor: checked
                ? colors.black
                : 'transparent',
            borderWidth: 2,
            borderColor: colors.black,
            opacity: disabled ? 0.25 : null
        },
        icon: {
            display: checked ? null : 'none',
            width: '75%',
            height: '75%',
            marginTop: 1,
            fill: colors.white
        }
    };

    return (
        <Flex
            isInline={isInline}
            is='label'
            position='relative'
            fontSize={isSmall ? 'h5' : 'h4'}
            paddingY={paddingY}
            lineHeight={2}
            alignItems={hasCenteredBox ? 'center' : null}
            cursor={disabled ? 'not-allowed' : 'pointer'}>
            <Box
                {...props}
                is='input'
                position='absolute'
                zIndex={-1}
                opacity={0}
                value={props.value ? props.value : ''}
                checked={checked}
                disabled={disabled}
                type='checkbox' />
            <Flex
                rounded={true}
                alignItems='center'
                justifyContent='center'
                flexShrink={0}
                _css={styles.box}>
                <svg
                    viewBox='0 0 32 32'
                    className={css(styles.icon)}>
                    <path d='M1 14 L5 10 L13 18 L27 4 L31 8 L13 26 z' />
                </svg>
            </Flex>
            {children}
        </Flex>
    );
};


// Added by sephora-jsx-loader.js
Checkbox.prototype.path = 'Inputs/Checkbox';
// Added by sephora-jsx-loader.js
Checkbox.prototype.class = 'Checkbox';
// Added by sephora-jsx-loader.js
Checkbox.prototype.getInitialState = function() {
    Checkbox.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Checkbox.prototype.render = wrapComponentRender(Checkbox.prototype.render);
// Added by sephora-jsx-loader.js
var CheckboxClass = React.createClass(Checkbox.prototype);
// Added by sephora-jsx-loader.js
CheckboxClass.prototype.classRef = CheckboxClass;
// Added by sephora-jsx-loader.js
Object.assign(CheckboxClass, Checkbox);
// Added by sephora-jsx-loader.js
module.exports = CheckboxClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Inputs/Checkbox/Checkbox.jsx