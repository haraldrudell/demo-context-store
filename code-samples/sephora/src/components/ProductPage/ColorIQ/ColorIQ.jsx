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
const { Box, Flex } = require('components/display');
const Link = require('components/Link/Link');

const ColorIQ = function () {
    this.state = {
        isColorIQMatch: false
    };
};

ColorIQ.prototype.render = function () {

    return (
        <Flex
            lineHeight={2}
            fontSize='h5'
            _css={Sephora.isMobile() ? {
                justifyContent: 'center',
                marginTop: space[1]
            } : {
                marginBottom: space[4]
            }}>
            {this.state.isColorIQMatch ?
                <Box
                    paddingX={space[2]}
                    paddingY={space[1]}
                    backgroundColor='nearWhite'
                    rounded={true}>
                    Your <b>Color iQ</b> SkinTone match.
                    {' '}
                    <Link
                        primary={true}
                        display={this.state.hasShadeCodeParam ? 'none' : ''}
                        padding={space[2]}
                        margin={-space[2]}
                        onClick={this.editColorIQ}>
                        Edit
                    </Link>
                </Box>
                :
                <Link
                    primary={true}
                    padding={space[2]}
                    margin={-space[2]}
                    onClick={this.goToColorIQMatch}>
                    See your Color iQ SkinTone match
                </Link>
            }
        </Flex>
    );
};


// Added by sephora-jsx-loader.js
ColorIQ.prototype.path = 'ProductPage/ColorIQ';
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
// ./public_ufe/js/components/ProductPage/ColorIQ/ColorIQ.jsx