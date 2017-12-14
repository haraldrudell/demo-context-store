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
    Sephora.Util.InflatorComps.Comps['ColorIQ'] = function ColorIQ(){
        return ColorIQClass;
    }
}
const { space } = require('style');
const { Box, Flex, Text } = require('components/display');
const Divider = require('components/Divider/Divider');
const Link = require('components/Link/Link');
const Label = require('components/Inputs/Label/Label');
const TextInput = require('components/Inputs/TextInput/TextInput');
const ButtonPrimary = require('components/Button/ButtonPrimary');

const ColorIQ = function () {
    this.state = {
        showApplyButton: false,
        errorMessage: null
    };
};

ColorIQ.prototype.render = function () {

    const swatchHeight = 36;

    return (
        <div>

            {this.props.biAccount.skinTones &&
                this.props.biAccount.skinTones.slice(0, 5).map((skinTone, index) =>
                    <div>
                        <Flex
                            justifyContent='space-between'>
                            <Box
                                lineHeight={2}>
                                <Box
                                    display='inline-block'
                                    width={swatchHeight} height={swatchHeight}
                                    rounded={true}
                                    backgroundColor={skinTone.cssColor}
                                    verticalAlign='top' />
                                <Box
                                    display='inline-block'
                                    marginLeft={space[4]}>
                                    <b>
                                        {skinTone.shadeCode}
                                    </b>
                                    <Box
                                        color='silver'>
                                        Captured on {skinTone.creationDate} {skinTone.storeName ?
                                        ('at ' + skinTone.storeName) : null}
                                        {index === 0 &&
                                            <Box
                                                marginTop={space[2]}>
                                                Default Skintone
                                            </Box>
                                        }
                                    </Box>
                                </Box>
                            </Box>
                            {
                                /* TODO: add delete when api supports it
                                <Link
                                    paddingX={space[3]}
                                    marginX={-space[3]}
                                    primary={true}
                                    height={swatchHeight}>
                                    Delete
                                </Link>
                                */
                            }
                        </Flex>
                        <Divider
                            marginY={Sephora.isMobile() ? space[5] : space[6]}
                            marginX={Sephora.isDesktop() ? -space[5] : null} />
                    </div>
                )
            }
            <Label htmlFor='ciqNumber'>
                Add new Color IQ
            </Label>
            <Box
                is='form'
                name='ciqNumber'
                onSubmit={this.addColorIQ}
                overflow='hidden'
                position='relative'
                rounded={true}
                width={Sephora.isDesktop() ? '50%' : null}>
                <TextInput
                    noMargin={true}
                    invalid={this.state.errorMessage}
                    onKeyUp={this.handleKeyUp}
                    ref={
                        (c) => {
                            if (c !== null) {
                                this.colorIqInput = c;
                            }
                        }
                    }
                    placeholder='Enter skintone number'
                    message={this.state.errorMessage ? 'Invalid Color IQ' : null} />
                <Box
                    position='absolute'
                    top={0} right={0}
                    transition='transform .15s'
                    style={{
                        transform: `translate3d(${this.state.showApplyButton ? '0' : '100%'}, 0, 0)`
                    }}>
                    <ButtonPrimary
                        type='submit'
                        rounded='right'>
                        Add
                    </ButtonPrimary>
                </Box>
            </Box>

        </div>
    );
};


// Added by sephora-jsx-loader.js
ColorIQ.prototype.path = 'RichProfile/EditMyProfile/Content/ColorIQ';
// Added by sephora-jsx-loader.js
Object.assign(ColorIQ.prototype, require('./ColorIQ.c.js'));
var originalDidMount = ColorIQ.prototype.componentDidMount;
ColorIQ.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ColorIQ');
if (originalDidMount) originalDidMount.apply(this);
if (ColorIQ.prototype.ctrlr) ColorIQ.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ColorIQ');
// Added by sephora-jsx-loader.js
ColorIQ.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ColorIQ.prototype.class = 'ColorIQ';
// Added by sephora-jsx-loader.js
ColorIQ.prototype.getInitialState = function() {
    ColorIQ.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ColorIQ.prototype.render = wrapComponentRender(ColorIQ.prototype.render);
// Added by sephora-jsx-loader.js
var ColorIQClass = React.createClass(ColorIQ.prototype);
// Added by sephora-jsx-loader.js
ColorIQClass.prototype.classRef = ColorIQClass;
// Added by sephora-jsx-loader.js
Object.assign(ColorIQClass, ColorIQ);
// Added by sephora-jsx-loader.js
module.exports = ColorIQClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/EditMyProfile/Content/ColorIQ/ColorIQ.jsx