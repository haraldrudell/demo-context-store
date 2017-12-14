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
    Sephora.Util.InflatorComps.Comps['AboutMe'] = function AboutMe(){
        return AboutMeClass;
    }
}
const { space } = require('style');
const { Box, Text } = require('components/display');
const Link = require('components/Link/Link');
const Skin = require('components/RichProfile/EditMyProfile/Content/Skin/Skin');
const Hair = require('components/RichProfile/EditMyProfile/Content/Hair/Hair');
const Eyes = require('components/RichProfile/EditMyProfile/Content/Eyes/Eyes');
const ContentDivider = require('components/RichProfile/EditMyProfile/Content/ContentDivider');
const biUtils = require('utils/BiProfile');
const AddReviewTitle = require('components/AddReview/AddReviewTitle/AddReviewTitle');
const AddReviewNote = require('components/AddReview/AddReviewNote/AddReviewNote');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const Container = require('components/Container/Container');

const AboutMe = function () {
    this.state = this.props;
};

AboutMe.prototype.render = function () {
    let {
        aboutMeBiTraits,
        biAccount
    } = this.state;
    let isMobile = Sephora.isMobile();

    const excludeSkinType = aboutMeBiTraits.indexOf(biUtils.TYPES.SKIN_TYPE) < 0;
    const excludeSkinConcerns = aboutMeBiTraits.indexOf(biUtils.TYPES.SKIN_CONCERNS) < 0;
    const excludeSkinTone = aboutMeBiTraits.indexOf(biUtils.TYPES.SKIN_TONE) < 0;
    const excludeSkin = excludeSkinType && excludeSkinConcerns && excludeSkinTone;

    const excludeHairColor = aboutMeBiTraits.indexOf(biUtils.TYPES.HAIR_COLOR) < 0;
    const excludeHairDescribe = aboutMeBiTraits.indexOf(biUtils.TYPES.HAIR_DESCRIBE) < 0;
    const excludeHairConcerns = aboutMeBiTraits.indexOf(biUtils.TYPES.HAIR_CONCERNS) < 0;
    const excludeHair = excludeHairColor && excludeHairDescribe && excludeHairConcerns;

    return (
        <Container>
            <AddReviewTitle
                children='About You' />
            <Text
                is='p'
                textAlign='center'
                marginBottom={space[6]}>
                This optional information helps make your review more useful to other shoppers.
            </Text>
            <Box
                marginX='auto'
                maxWidth={!isMobile ? 475 : null}>
                {excludeSkin ||
                    <div>
                        <Skin
                            biAccount={biAccount}
                            ref={skin => this.skin = skin}
                            excludeSkinType={excludeSkinType}
                            excludeSkinConcerns={excludeSkinConcerns}
                            excludeSkinTone={excludeSkinTone}/>
                        <ContentDivider />
                    </div>
                }
                {excludeHair ||
                    <div>
                        <Hair
                            biAccount={biAccount}
                            ref={hair => this.hair = hair}
                            excludeHairColor={excludeHairColor}
                            excludeHairDescribe={excludeHairDescribe}
                            excludeHairConcerns={excludeHairConcerns}/>
                        <ContentDivider />
                    </div>
                }
                {aboutMeBiTraits.indexOf(biUtils.TYPES.EYE_COLOR) >=0 &&
                    <div>
                        <Eyes
                            ref={eyes => this.eyes = eyes}
                            biAccount={biAccount}/>
                        <ContentDivider />
                    </div>
                }
                <AddReviewNote />
                <ButtonPrimary
                    onClick={this.submitData}
                    width={isMobile ? '100%' : 165}>
                    Post Review
                </ButtonPrimary>
            </Box>
        </Container>
    );
};


// Added by sephora-jsx-loader.js
AboutMe.prototype.path = 'AddReview/AboutMe';
// Added by sephora-jsx-loader.js
Object.assign(AboutMe.prototype, require('./AboutMe.c.js'));
var originalDidMount = AboutMe.prototype.componentDidMount;
AboutMe.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: AboutMe');
if (originalDidMount) originalDidMount.apply(this);
if (AboutMe.prototype.ctrlr) AboutMe.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: AboutMe');
// Added by sephora-jsx-loader.js
AboutMe.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
AboutMe.prototype.class = 'AboutMe';
// Added by sephora-jsx-loader.js
AboutMe.prototype.getInitialState = function() {
    AboutMe.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
AboutMe.prototype.render = wrapComponentRender(AboutMe.prototype.render);
// Added by sephora-jsx-loader.js
var AboutMeClass = React.createClass(AboutMe.prototype);
// Added by sephora-jsx-loader.js
AboutMeClass.prototype.classRef = AboutMeClass;
// Added by sephora-jsx-loader.js
Object.assign(AboutMeClass, AboutMe);
// Added by sephora-jsx-loader.js
module.exports = AboutMeClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/AddReview/AboutMe/AboutMe.jsx