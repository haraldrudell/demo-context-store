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
    Sephora.Util.InflatorComps.Comps['Hair'] = function Hair(){
        return HairClass;
    }
}
const { colors, space } = require('style');
const { Box, Grid, Image, Text } = require('components/display');
const Link = require('components/Link/Link');
const Checkbox = require('components/Inputs/Checkbox/Checkbox');
const ContentDivider = require('../ContentDivider');
const ContentHeading = require('../ContentHeading');

const Hair = function () {
    let biDataToSave = this.props.biDataToSave || {};
    let biAccountToSave = biDataToSave.biAccount || {};
    let personalizedInfoToSave = biAccountToSave.personalizedInformation || {};

    let savedConcerns = [];
    if (personalizedInfoToSave.hairConcerns) {
        savedConcerns = personalizedInfoToSave.hairConcerns;
    } else {
        let hairConcerns =
            this.props.biAccount.personalizedInformation.hairConcerns;
        hairConcerns.forEach(hairConcern => {
            if (hairConcern.isSelected) {
                savedConcerns.push(hairConcern.value);
            }
        });
    }

    let savedHairColor;
    if (personalizedInfoToSave.hairColor) {
        savedHairColor = personalizedInfoToSave.hairColor;
    } else {
        let hairColors =
            this.props.biAccount.personalizedInformation.hairColor;
        hairColors.forEach(hairColor => {
            if (hairColor.isSelected) {
                savedHairColor = hairColor.value;
            }
        });
    }

    let savedHairDescriptions = [];
    if (personalizedInfoToSave.hairDescrible) {
        savedHairDescriptions = personalizedInfoToSave.hairDescrible;
    } else {
        let hairDescriptions =
            this.props.biAccount.personalizedInformation.hairDescrible;
        hairDescriptions.forEach(hairDescription => {
            if (hairDescription.isSelected) {
                savedHairDescriptions.push(hairDescription.value);
            }
        });
    }

    this.state = {
        hairColor: savedHairColor,
        hairDescriptions: savedHairDescriptions,
        hairConcerns: savedConcerns
    };
};

Hair.prototype.render = function () {
    let {
        excludeHairColor,
        excludeHairDescribe,
        excludeHairConcerns
    } = this.props;
    let hairColors = this.props.biAccount.personalizedInformation.hairColor;
    let hairDescriptions = this.props.biAccount.personalizedInformation.hairDescrible;
    let hairConcerns = this.props.biAccount.personalizedInformation.hairConcerns;

    const gutter = space[4];
    const cellWidth = Sephora.isMobile() ? 1 / 2 : 1 / 3;

    return (
        <div>
            {excludeHairColor || <div>
                <ContentHeading
                    parens='select one'>
                    Hair color
                </ContentHeading>

                <Grid
                    gutter={gutter}>
                    {hairColors.map(hairColor => {
                        return (
                            <Grid.Cell
                                width={cellWidth}
                                marginTop={space[5]}>
                                <Link
                                    onClick={() => {
                                        this.setState({ hairColor: hairColor.value });
                                    }}
                                    display='block'
                                    isActive={this.state.hairColor === hairColor.value}>
                                    <Box
                                        display='inline-block'
                                        border={3}
                                        borderColor={
                                            this.state.hairColor === hairColor.value ?
                                                colors.black : 'transparent'
                                        }
                                        rounded={7}
                                        verticalAlign='middle'>
                                        <Image
                                            display='block'
                                             /*eslint max-len: [0]*/
                                            src={`/img/ufe/rich-profile/haircolor-${hairColor.value}.png`}
                                            width={36}
                                            height={36} />
                                    </Box>
                                    <Text marginLeft={space[4]}>
                                        {hairColor.displayName}
                                    </Text>
                                </Link>
                            </Grid.Cell>
                        );
                    }
                    )}
                </Grid>
            </div> }

            {excludeHairDescribe || <div>
                {excludeHairColor ||
                    <ContentDivider />
                }
                <ContentHeading
                    parens='select all that apply'>
                    Hair type
                </ContentHeading>
                <Grid
                    gutter={gutter}>
                    {hairDescriptions.map(hairDescription =>
                        <Grid.Cell
                            width={cellWidth}
                            marginTop={space[4]}>
                            <Checkbox
                                 /*eslint max-len: [0]*/
                                checked={this.state.hairDescriptions.indexOf(hairDescription.value) !== -1}
                                onChange={e => this.handleHairDescriptionSelect(hairDescription, e)}>
                                {hairDescription.displayName}
                            </Checkbox>
                        </Grid.Cell>
                    )}
                </Grid>
            </div> }

            {excludeHairConcerns || <div>
                {(!excludeHairColor || !excludeHairDescribe) &&
                    <ContentDivider />
                }
                <ContentHeading
                    parens='select all that apply'
                    isPrivate={true}>
                    Hair concerns
                </ContentHeading>
                <Grid
                    gutter={gutter}>
                    {hairConcerns.map(hairConcern => {
                        // Added this because the API is combining two different properties into one
                        // TODO: Remove this once the API is correct
                        if (hairConcern.displayName === 'Straightening/Smoothing') {
                            hairConcern.displayName = 'Straightening';
                        }

                        return (
                            <Grid.Cell
                                width={cellWidth}
                                marginTop={space[4]}>
                                <Checkbox
                                    checked={this.state.hairConcerns.indexOf(hairConcern.value) !== -1}
                                    onChange={e => this.handleHairConcernSelect(hairConcern, e)}>
                                    {hairConcern.displayName}
                                </Checkbox>
                            </Grid.Cell>
                        );
                    }
                    )}
                </Grid>
            </div> }

        </div>
    );
};


// Added by sephora-jsx-loader.js
Hair.prototype.path = 'RichProfile/EditMyProfile/Content/Hair';
// Added by sephora-jsx-loader.js
Object.assign(Hair.prototype, require('./Hair.c.js'));
var originalDidMount = Hair.prototype.componentDidMount;
Hair.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Hair');
if (originalDidMount) originalDidMount.apply(this);
if (Hair.prototype.ctrlr) Hair.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Hair');
// Added by sephora-jsx-loader.js
Hair.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Hair.prototype.class = 'Hair';
// Added by sephora-jsx-loader.js
Hair.prototype.getInitialState = function() {
    Hair.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Hair.prototype.render = wrapComponentRender(Hair.prototype.render);
// Added by sephora-jsx-loader.js
var HairClass = React.createClass(Hair.prototype);
// Added by sephora-jsx-loader.js
HairClass.prototype.classRef = HairClass;
// Added by sephora-jsx-loader.js
Object.assign(HairClass, Hair);
// Added by sephora-jsx-loader.js
module.exports = HairClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/EditMyProfile/Content/Hair/Hair.jsx