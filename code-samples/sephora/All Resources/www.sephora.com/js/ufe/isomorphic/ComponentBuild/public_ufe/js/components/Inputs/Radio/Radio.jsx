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
    Sephora.Util.InflatorComps.Comps['Radio'] = function Radio(){
        return RadioClass;
    }
}
const { colors, forms } = require('style');
const { Box, Flex } = require('components/display');

const Radio = function () {};

Radio.prototype.render = function () {
    const {
        isSmall,
        children,
        name,
        checked,
        disabled,
        paddingY = '.375em',
        ...props
    } = this.props;

    const radioSize = isSmall ? forms.RADIO_SIZE_SM : forms.RADIO_SIZE;
    const radioMargin = isSmall ? forms.RADIO_MARGIN_SM : forms.RADIO_MARGIN;

    const styles = {
        dot: {
            width: radioSize,
            height: radioSize,
            marginTop: '-.0625em',
            marginRight: radioMargin,
            borderWidth: 2,
            borderColor: checked && !disabled
                ? colors.black
                : colors.lightSilver,
            backgroundColor: colors.white,
            opacity: disabled ? 0.6 : null
        },
        dotInner: {
            width: '100%',
            borderWidth: 3,
            borderColor: colors.white,
            backgroundColor: checked
                ? disabled
                    ? colors.lightSilver
                    : colors.black
                : null
        }
    };
    return (
        <Flex
            is='label'
            position='relative'
            fontSize={isSmall ? 'h5' : 'h4'}
            paddingY={paddingY}
            lineHeight={2}
            cursor={disabled ? 'not-allowed' : 'pointer'}>
            <Box
                {...props}
                is='input'
                position='absolute'
                zIndex={-1}
                opacity={0}
                value={props.value ? props.value : ''}
                name={name}
                checked={checked}
                disabled={disabled}
                type='radio' />
            <Flex
                circle={true}
                flexShrink={0}
                _css={styles.dot}>
                <Box
                    circle={true}
                    _css={styles.dotInner} />
            </Flex>
            {children}
        </Flex>
    );
};

Radio.prototype.propTypes = {
    /** Name attribute for form element */
    name: React.PropTypes.string.isRequired
};


// Added by sephora-jsx-loader.js
Radio.prototype.path = 'Inputs/Radio';
// Added by sephora-jsx-loader.js
Radio.prototype.class = 'Radio';
// Added by sephora-jsx-loader.js
Radio.prototype.getInitialState = function() {
    Radio.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Radio.prototype.render = wrapComponentRender(Radio.prototype.render);
// Added by sephora-jsx-loader.js
var RadioClass = React.createClass(Radio.prototype);
// Added by sephora-jsx-loader.js
RadioClass.prototype.classRef = RadioClass;
// Added by sephora-jsx-loader.js
Object.assign(RadioClass, Radio);
// Added by sephora-jsx-loader.js
module.exports = RadioClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Inputs/Radio/Radio.jsx