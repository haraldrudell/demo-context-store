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
    Sephora.Util.InflatorComps.Comps['Eyes'] = function Eyes(){
        return EyesClass;
    }
}
const {
    colors, space
} = require('style');
const { Box, Grid, Image, Text } = require('components/display');
const Link = require('components/Link/Link');
const ContentHeading = require('../ContentHeading');

const Eyes = function () {
    let biDataToSave = this.props.biDataToSave || {};
    let biAccountToSave = biDataToSave.biAccount || {};
    let personalizedInfoToSave = biAccountToSave.personalizedInformation || {};

    if (personalizedInfoToSave.eyeColor) {
        this.state = {
            eyeColor: personalizedInfoToSave.eyeColor
        };
    } else {
        const eyeColors = this.props.biAccount.personalizedInformation.eyeColor;

        let selectedColor = eyeColors.filter(eyeColor => eyeColor.isSelected);

        if (selectedColor.length === 0) {
            selectedColor = null;
        } else {
            selectedColor = selectedColor[0].value;
        }

        this.state = {
            eyeColor: selectedColor
        };
    }
};

Eyes.prototype.render = function () {
    const { biAccount } = this.props;

    const eyeColors = biAccount.personalizedInformation.eyeColor;

    return (
        <div>
            <ContentHeading
                parens='select one'>
                Eye color
            </ContentHeading>
            <Grid
                gutter={space[4]}>
                {eyeColors.map(eyeColor => {
                    let eyeColorFile = eyeColor.displayName.toLowerCase();

                    return (
                        <Grid.Cell
                            width={Sephora.isMobile() ? 1 / 2 : 1 / 3}
                            marginTop={space[5]}>
                            <Link
                                onClick={() => {
                                    this.setState({ eyeColor: eyeColor.value });
                                }}
                                display='block'
                                isActive={this.state.eyeColor === eyeColor.value}>
                                <Box
                                    display='inline-block'
                                    border={3}
                                    borderColor={
                                        this.state.eyeColor === eyeColor.value
                                            ?
                                            colors.black
                                            :
                                            'transparent'
                                    }
                                    rounded={7}
                                    verticalAlign='middle'>
                                    <Image
                                        display='block'
                                        src={`/img/ufe/rich-profile/eyecolor-${eyeColorFile}.png`}
                                        width={36}
                                        height={36} />
                                </Box>
                                <Text marginLeft={space[4]}>
                                    {eyeColor.displayName}
                                </Text>
                            </Link>
                        </Grid.Cell>
                    );
                }
                )}
            </Grid>

        </div>
    );
};


// Added by sephora-jsx-loader.js
Eyes.prototype.path = 'RichProfile/EditMyProfile/Content/Eyes';
// Added by sephora-jsx-loader.js
Object.assign(Eyes.prototype, require('./Eyes.c.js'));
var originalDidMount = Eyes.prototype.componentDidMount;
Eyes.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Eyes');
if (originalDidMount) originalDidMount.apply(this);
if (Eyes.prototype.ctrlr) Eyes.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Eyes');
// Added by sephora-jsx-loader.js
Eyes.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Eyes.prototype.class = 'Eyes';
// Added by sephora-jsx-loader.js
Eyes.prototype.getInitialState = function() {
    Eyes.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Eyes.prototype.render = wrapComponentRender(Eyes.prototype.render);
// Added by sephora-jsx-loader.js
var EyesClass = React.createClass(Eyes.prototype);
// Added by sephora-jsx-loader.js
EyesClass.prototype.classRef = EyesClass;
// Added by sephora-jsx-loader.js
Object.assign(EyesClass, Eyes);
// Added by sephora-jsx-loader.js
module.exports = EyesClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/EditMyProfile/Content/Eyes/Eyes.jsx