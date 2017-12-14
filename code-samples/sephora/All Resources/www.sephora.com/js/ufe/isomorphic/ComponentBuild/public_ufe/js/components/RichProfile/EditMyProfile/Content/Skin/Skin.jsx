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
    Sephora.Util.InflatorComps.Comps['Skin'] = function Skin(){
        return SkinClass;
    }
}
const { colors, modal, space } = require('style');
const { Box, Grid, Image, Text } = require('components/display');
const Link = require('components/Link/Link');
const Checkbox = require('components/Inputs/Checkbox/Checkbox');
const Radio = require('components/Inputs/Radio/Radio');
const ContentDivider = require('../ContentDivider');
const ContentHeading = require('../ContentHeading');

const Skin = function () {
    let biDataToSave = this.props.biDataToSave || {};
    let biAccountToSave = biDataToSave.biAccount || {};
    let personalizedInfoToSave = biAccountToSave.personalizedInformation || {};

    let savedConcerns = [];
    if (personalizedInfoToSave.skinConcerns) {
        savedConcerns = personalizedInfoToSave.skinConcerns;
    } else {
        let skinConcerns =
            this.props.biAccount.personalizedInformation.skinConcerns;
        skinConcerns.forEach(skinConcern => {
            if (skinConcern.isSelected) {
                savedConcerns.push(skinConcern.value);
            }
        });
    }

    let savedSkinTone;
    if (personalizedInfoToSave.skinTone) {
        savedSkinTone = personalizedInfoToSave.skinTone;
    } else {
        let skinTones =
            this.props.biAccount.personalizedInformation.skinTone;
        skinTones.forEach(skinTone => {
            if (skinTone.isSelected) {
                savedSkinTone = skinTone.value;
            }
        });
    }

    let savedSkinType;
    if (personalizedInfoToSave.skinType) {
        savedSkinType = personalizedInfoToSave.skinType;
    } else {
        let skinTypes =
            this.props.biAccount.personalizedInformation.skinType;
        skinTypes.forEach(skinType => {
            if (skinType.isSelected) {
                savedSkinType = skinType.value;
            }
        });
    }

    this.state = {
        skinTone: savedSkinTone,
        skinType: savedSkinType,
        skinConcerns: savedConcerns
    };
};

// Skeleton for Skin (edit screen), just for unblocking other developers so we
// have a shared general structure to work on
Skin.prototype.render = function () {
    let {
        excludeSkinType,
        excludeSkinConcerns,
        excludeSkinTone
    } = this.props;
    let skinTones =
        this.props.biAccount.personalizedInformation.skinTone;
    let skinTypes =
        this.props.biAccount.personalizedInformation.skinType;
    let skinConcerns =
        this.props.biAccount.personalizedInformation.skinConcerns;

    const gutter = space[4];
    const cellWidth = Sephora.isMobile() ? 1 / 2 : 1 / 3;

    return (
        <div>
            {excludeSkinTone || <div>
                <ContentHeading
                    parens='select one'>
                    Skin tone
                </ContentHeading>
                <Grid
                    gutter={gutter}>
                    {skinTones.map(skinTone =>
                        <Grid.Cell
                            width={cellWidth}
                            marginTop={space[5]}>
                            <Link
                                onClick={() => {
                                    this.setState({
                                        skinTone: skinTone.value
                                    });
                                }}
                                display='block'
                                isActive={this.state.skinTone === skinTone.value}>
                                <Box
                                    display='inline-block'
                                    border={3}
                                    borderColor={
                                        this.state.skinTone === skinTone.value ?
                                            colors.black : 'transparent'
                                    }
                                    rounded={7}
                                    verticalAlign='middle'>
                                    <Image
                                        display='block'
                                        src={`/img/ufe/rich-profile/skintone-${skinTone.value}.png`}
                                        width={36}
                                        height={36} />
                                </Box>
                                <Text marginLeft={space[4]}>
                                    {skinTone.displayName}
                                </Text>
                            </Link>
                        </Grid.Cell>
                    )}
                </Grid>
            </div> }

            {excludeSkinType || <div>
                {excludeSkinTone ||
                    <ContentDivider />
                }
                <ContentHeading
                    parens='select one'>
                    Skin type
                </ContentHeading>
                <Grid
                    gutter={gutter}>
                    {skinTypes.map(skinType =>
                        <Grid.Cell
                            width={cellWidth}
                            marginTop={space[4]}>
                            <Radio
                                checked={this.state.skinType === skinType.value}
                                onChange={
                                    e => this.setState({
                                        skinType: skinType.value
                                    })
                                }>
                                {skinType.displayName}
                            </Radio>
                        </Grid.Cell>
                    )}
                </Grid>
            </div> }

            {excludeSkinConcerns || <div>
                {(!excludeSkinType || !excludeSkinTone) &&
                    <ContentDivider />
                }
                <ContentHeading
                    parens='select all that apply'
                    isPrivate={true}>
                    Skincare concerns
                </ContentHeading>
                <Grid
                    gutter={gutter}>
                    {skinConcerns.map(skinConcern =>
                        <Grid.Cell
                            width={cellWidth}
                            marginTop={space[4]}>
                            <Checkbox
                                checked={this.state.skinConcerns.indexOf(skinConcern.value) !== -1}
                                onChange={
                                    e=> {
                                        this.handleSkinConcernSelect(skinConcern, e);
                                    }
                                }>
                                {skinConcern.displayName}
                            </Checkbox>
                        </Grid.Cell>
                    )}
                </Grid>
            </div> }
        </div>
    );
};


// Added by sephora-jsx-loader.js
Skin.prototype.path = 'RichProfile/EditMyProfile/Content/Skin';
// Added by sephora-jsx-loader.js
Object.assign(Skin.prototype, require('./Skin.c.js'));
var originalDidMount = Skin.prototype.componentDidMount;
Skin.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Skin');
if (originalDidMount) originalDidMount.apply(this);
if (Skin.prototype.ctrlr) Skin.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Skin');
// Added by sephora-jsx-loader.js
Skin.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Skin.prototype.class = 'Skin';
// Added by sephora-jsx-loader.js
Skin.prototype.getInitialState = function() {
    Skin.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Skin.prototype.render = wrapComponentRender(Skin.prototype.render);
// Added by sephora-jsx-loader.js
var SkinClass = React.createClass(Skin.prototype);
// Added by sephora-jsx-loader.js
SkinClass.prototype.classRef = SkinClass;
// Added by sephora-jsx-loader.js
Object.assign(SkinClass, Skin);
// Added by sephora-jsx-loader.js
module.exports = SkinClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/EditMyProfile/Content/Skin/Skin.jsx