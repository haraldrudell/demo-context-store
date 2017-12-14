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
    Sephora.Util.InflatorComps.Comps['BiProfileSlide'] = function BiProfileSlide(){
        return BiProfileSlideClass;
    }
}
/* eslint max-len: [2, 275] */
const { space } = require('style');
const { Box, Grid, Text } = require('components/display');
const userUtils = require('utils/User');

const BiProfileSlide = function () {};

BiProfileSlide.prototype.render = function () {
    const {
            skinTone,
            skinType,
            hairColor,
            eyeColor,
            skinColorIQ,
            birthMonth,
            birthDay,
            isPrivate,
            nickname
        } = this.props;

    let hasBiPersonalInfo = function () {
        return (skinTone && skinType) || hairColor || eyeColor || skinColorIQ;
    };

    let skinBlock = !(skinTone && skinType) ?
                        'N/A' :
                        <span>
                            { skinTone }
                            <br />
                            { skinType }
                        </span>;

    let privateEmptyContentMessage = 'Looking for products to help fight frizz? Searching for eye-popping eye shadow? Answer a few short beauty questions to get personalized recommendations.';
    let publicEmptyContentMessage = `${nickname} has not filled out a beauty profile yet.`;

    const isMobile = Sephora.isMobile();
    const cellWidth = 1 / 3;
    const cellMargin = isMobile ? space[5] : space[7];
    return (
        <Box
            fontSize={isMobile ? 'h4' : 'h3'}
            paddingY={isMobile ? space[4] : space[6]}
            paddingX={isMobile ? space[5] : space[6]}>
            { hasBiPersonalInfo() ?
                <Grid
                    gutter={space[4]}
                    lineHeight={2}>
                    <Grid.Cell
                        width={cellWidth}
                        marginBottom={cellMargin}>
                        <b>Skin</b>
                        <br />
                        { skinBlock }
                    </Grid.Cell>
                    <Grid.Cell
                        width={cellWidth}
                        marginBottom={cellMargin}>
                        <b>Hair</b>
                        <br />
                        { hairColor || 'N/A' }
                    </Grid.Cell>
                    <Grid.Cell
                        width={cellWidth}
                        marginBottom={cellMargin}>
                        <b>Eyes</b>
                        <br />
                        { eyeColor || 'N/A' }
                    </Grid.Cell>
                    <Grid.Cell
                        width={cellWidth}
                        marginBottom={cellMargin}>
                        <b>Color IQ</b>
                        <br />
                        { skinColorIQ || 'N/A' }
                    </Grid.Cell>
                </Grid>
                :
                <Text
                    is='p'
                    color='gray'>
                    { isPrivate ? privateEmptyContentMessage : publicEmptyContentMessage }
                </Text>
            }
        </Box>
    );
};


// Added by sephora-jsx-loader.js
BiProfileSlide.prototype.path = 'RichProfile/UserProfile/common/AboutMeSlideshow/BiProfileSlide';
// Added by sephora-jsx-loader.js
BiProfileSlide.prototype.class = 'BiProfileSlide';
// Added by sephora-jsx-loader.js
BiProfileSlide.prototype.getInitialState = function() {
    BiProfileSlide.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BiProfileSlide.prototype.render = wrapComponentRender(BiProfileSlide.prototype.render);
// Added by sephora-jsx-loader.js
var BiProfileSlideClass = React.createClass(BiProfileSlide.prototype);
// Added by sephora-jsx-loader.js
BiProfileSlideClass.prototype.classRef = BiProfileSlideClass;
// Added by sephora-jsx-loader.js
Object.assign(BiProfileSlideClass, BiProfileSlide);
// Added by sephora-jsx-loader.js
module.exports = BiProfileSlideClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/UserProfile/common/AboutMeSlideshow/BiProfileSlide/BiProfileSlide.jsx