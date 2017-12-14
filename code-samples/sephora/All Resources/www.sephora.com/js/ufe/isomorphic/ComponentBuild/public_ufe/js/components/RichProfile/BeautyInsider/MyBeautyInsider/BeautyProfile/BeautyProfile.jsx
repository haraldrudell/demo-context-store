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
    Sephora.Util.InflatorComps.Comps['BeautyProfile'] = function BeautyProfile(){
        return BeautyProfileClass;
    }
}
/* eslint-disable max-len */
const { fontSizes, space } = require('style');
const { Box, Text } = require('components/display');
const Divider = require('components/Divider/Divider');
const Link = require('components/Link/Link');
const userUtils = require('utils/User');
const dateUtils = require('utils/Date');

const BeautyProfile = function () {};

BeautyProfile.prototype.render = function () {
    const { biAccount } = this.props;
    let colorIQString;
    let colorIQUrl;

    let personalInfo = userUtils.biPersonalInfoDisplayCleanUp(biAccount.personalizedInformation);
    let isEmptyState = !(personalInfo.skinTone || personalInfo.skinType ||
        personalInfo.skinConcerns || personalInfo.hairColor || personalInfo.hairDescrible ||
        personalInfo.hairConcerns || personalInfo.eyeColor || biAccount.skinTones);

    if (biAccount.skinTones) {
        let shadeCode = biAccount.skinTones[0].shadeCode;
        let colorIQDate = dateUtils.formatDateMDY(biAccount.skinTones[0].creationDate);
        colorIQString = `${shadeCode} (added ${colorIQDate})`;
        colorIQUrl = Sephora.isDesktop() ?
            `/IQ/color/results.jsp?coloriq=true&shade_code=${shadeCode}` : '/color-iq';
    }

    const sectionDivider =
        <Divider marginY={space[4]} />;

    const styles = {
        subhead: {
            fontSize: fontSizes.h3,
            marginBottom: space[1],
            fontWeight: 700
        }
    };

    const PHONE_WORD = '1-877-SEPHORA';

    return (
        <div>
            {isEmptyState ?
                <Box
                    maxWidth={Sephora.isDesktop() ? '26em' : null}>
                    <Text
                        is='p'
                        marginBottom='1em'>
                        Edit your profile to see personalized recommendations based on your skin, hair, and eye characteristics and concerns.
                    </Text>
                </Box>
                :
                <div>
                    <Text
                        is='h3'
                        _css={styles.subhead}>
                        My Skin
                    </Text>
                    <div>
                        <b>Skin tone</b> { personalInfo.skinTone }
                    </div>
                    <div>
                        <b>Skin type</b> { personalInfo.skinType }
                    </div>
                    <div>
                        <b>Skin concerns</b> { personalInfo.skinConcerns }
                    </div>

                    {sectionDivider}

                    <Text
                        is='h3'
                        _css={styles.subhead}>
                        My Hair
                    </Text>
                    <div>
                        <b>Hair color</b> { personalInfo.hairColor }
                    </div>
                    <div>
                        <b>Hair type</b> { personalInfo.hairDescrible }
                    </div>
                    <div>
                        <b>Hair concerns</b> { personalInfo.hairConcerns }
                    </div>

                    {sectionDivider}

                    <Text
                        is='h3'
                        _css={styles.subhead}>
                        My Eyes
                    </Text>
                    <div>
                        <b>Eye color</b> { personalInfo.eyeColor }
                    </div>

                    {sectionDivider}

                    <Text
                        is='h3'
                        _css={styles.subhead}>
                        My Color IQ
                    </Text>
                    <Box
                        marginBottom={space[1]}>
                        { colorIQString }
                    </Box>
                    <Link
                        fontSize='h5'
                        arrowDirection='right'
                        margin={-space[2]}
                        padding={space[2]}
                        href={colorIQUrl}>
                        View Color IQ matches
                    </Link>
                </div>
            }
            <div>

                {sectionDivider}

                <Text
                    is='h3'
                    _css={styles.subhead}>
                    My Birthday
                </Text>
                <div>
                    { dateUtils.getLongMonth(biAccount.birthMonth) } { biAccount.birthDay }, {biAccount.birthYear}
                </div>

                <Text
                    is='p'
                    fontSize='h5'
                    marginTop={space[1]}>
                    If you need to change your birth date, please call Sephora at
                    {' '}
                    <Link
                        primary={true}
                        href='tel:18777374672'>
                        {PHONE_WORD}
                    </Link>
                </Text>
            </div>
        </div>
    );
};


// Added by sephora-jsx-loader.js
BeautyProfile.prototype.path = 'RichProfile/BeautyInsider/MyBeautyInsider/BeautyProfile';
// Added by sephora-jsx-loader.js
BeautyProfile.prototype.class = 'BeautyProfile';
// Added by sephora-jsx-loader.js
BeautyProfile.prototype.getInitialState = function() {
    BeautyProfile.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BeautyProfile.prototype.render = wrapComponentRender(BeautyProfile.prototype.render);
// Added by sephora-jsx-loader.js
var BeautyProfileClass = React.createClass(BeautyProfile.prototype);
// Added by sephora-jsx-loader.js
BeautyProfileClass.prototype.classRef = BeautyProfileClass;
// Added by sephora-jsx-loader.js
Object.assign(BeautyProfileClass, BeautyProfile);
// Added by sephora-jsx-loader.js
module.exports = BeautyProfileClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/BeautyInsider/MyBeautyInsider/BeautyProfile/BeautyProfile.jsx