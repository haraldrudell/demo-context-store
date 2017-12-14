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
    Sephora.Util.InflatorComps.Comps['InputCaptcha'] = function InputCaptcha(){
        return InputCaptchaClass;
    }
}
/* eslint-disable max-len */
const { css } = require('glamor');
const { forms, space } = require('style');
const { Box, Grid, Image, Text } = require('components/display');
const ButtonOutline = require('components/Button/ButtonOutline');
const Label = require('components/Inputs/Label/Label');
const TextInput = require('components/Inputs/TextInput/TextInput');

const InputCaptcha = function () {
    this.state = {
        value: this.props.value ? this.props.value : '',
        error: null,
        message: this.props.message
    };
    this.captchaTextInput = null;
};

InputCaptcha.prototype.render = function () {
    const {
        label,
        name,
        ...props
    } = this.props;

    const captchaHeight = 35;
    const captchaBoxHeight = captchaHeight + 10;

    return (
        <div>
            <Label
                htmlFor={name}
                children={label} />
            <Grid
                marginBottom={space[2]}>
                <Grid.Cell width='fill'>
                    <Box
                        id='visualValidationImageContainer'
                        border={1}
                        borderColor={forms.BORDER_COLOR}
                        height={captchaBoxHeight}
                        rounded='left'>
                        <Image
                            disableLazyLoad={true}
                            display='block'
                            src={this.state.captchaChallengeText}
                            width={200}
                            height={captchaHeight}
                            marginX='auto'
                            marginTop={(captchaBoxHeight - captchaHeight) / 2} />
                    </Box>
                </Grid.Cell>
                <Grid.Cell width='fit'>
                    <ButtonOutline
                        paddingX={space[3]}
                        paddingY='0px'
                        lineHeight={0}
                        borderColor={forms.BORDER_COLOR}
                        hoverBorder={forms.BORDER_FOCUS_COLOR}
                        rounded='right'
                        marginLeft={-1}
                        height={captchaBoxHeight}
                        id='refreshVisualValidationImage'
                        onClick={this.refreshVisualValidation}>
                        <svg
                            viewBox='0 0 32 32'
                            className={css({
                                width: '2em',
                                height: '2em'
                            })}>
                            <path d='M27.497 8H22c-.553 0-1-.448-1-1s.447-1 1-1h5V1c0-.552.447-1 1-1s1 .448 1 1v5.497C29 7.327 28.326 8 27.497 8zM16 32C7.178 32 0 24.822 0 16S7.178 0 16 0c4.274 0 8.293 1.665 11.313 4.687.39.39.39 1.024 0 1.414-.39.392-1.023.392-1.414 0C23.255 3.457 19.74 2 16 2 8.28 2 2 8.28 2 16s6.28 14 14 14 14-6.28 14-14c0-.552.447-1 1-1s1 .448 1 1c0 8.822-7.178 16-16 16z'/>
                        </svg>
                    </ButtonOutline>
                </Grid.Cell>
            </Grid>

            <Text
                is='p'
                fontSize='h5'
                lineHeight={2}
                marginBottom={space[1]}>
                Security is a priority for Sephora.
                Enter the characters above to show you’re an authentic user.
            </Text>

            <TextInput
                {...props}
                name={name}
                ref={
                    (c) => {
                        if (c !== null) {
                            this.captchaTextInput = c;
                        }
                    }
                }
                hideLabel={true}
                autoOff={true}
                validate={this.props.validate}
                value={this.state.value} />
        </div>
    );
};


// Added by sephora-jsx-loader.js
InputCaptcha.prototype.path = 'Inputs/InputCaptcha';
// Added by sephora-jsx-loader.js
Object.assign(InputCaptcha.prototype, require('./InputCaptcha.c.js'));
var originalDidMount = InputCaptcha.prototype.componentDidMount;
InputCaptcha.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: InputCaptcha');
if (originalDidMount) originalDidMount.apply(this);
if (InputCaptcha.prototype.ctrlr) InputCaptcha.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: InputCaptcha');
// Added by sephora-jsx-loader.js
InputCaptcha.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
InputCaptcha.prototype.class = 'InputCaptcha';
// Added by sephora-jsx-loader.js
InputCaptcha.prototype.getInitialState = function() {
    InputCaptcha.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
InputCaptcha.prototype.render = wrapComponentRender(InputCaptcha.prototype.render);
// Added by sephora-jsx-loader.js
var InputCaptchaClass = React.createClass(InputCaptcha.prototype);
// Added by sephora-jsx-loader.js
InputCaptchaClass.prototype.classRef = InputCaptchaClass;
// Added by sephora-jsx-loader.js
Object.assign(InputCaptchaClass, InputCaptcha);
// Added by sephora-jsx-loader.js
module.exports = InputCaptchaClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Inputs/InputCaptcha/InputCaptcha.jsx