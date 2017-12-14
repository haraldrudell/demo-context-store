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
    Sephora.Util.InflatorComps.Comps['AboutMeSlideshow'] = function AboutMeSlideshow(){
        return AboutMeSlideshowClass;
    }
}
const { forms, space } = require('style');
const { Box } = require('components/display');
const Carousel = require('components/Carousel/Carousel');
const ButtonWhite = require('components/Button/ButtonWhite');
const AboutMeSlide = require('./AboutMeSlide/AboutMeSlide');
const BiProfileSlide = require('./BiProfileSlide/BiProfileSlide');
const SocialSlide = require('./SocialSlide/SocialSlide');


const AboutMeSlideshow = function () {
    this.state = {};
};

AboutMeSlideshow.prototype.render = function () {
    const {
            socialProfile,
            skinTone,
            skinType,
            hairColor,
            eyeColor,
            skinColorIQ,
            isPrivate,
            slideWidth,
            followerCount,
            isSocialEnabled
        } = this.props;

    let nickname = isPrivate && this.state.nickname ? this.state.nickname : this.props.nickname;

    let slideArray = [
        <AboutMeSlide
            nickname={nickname}
            followerCount={followerCount}
            followingCount={socialProfile.following}
            avatarPhotoUrl={socialProfile.avatar}
            rankBadge={socialProfile.engagementBadgeUrl}
            biBadge={socialProfile.biBadgeUrl} />,
        <SocialSlide
            instagramUrl={socialProfile.instagram}
            youtubeUrl={socialProfile.youtube}
            biography={socialProfile.aboutMe}
            isPrivate={isPrivate}
            nickname={nickname} />
    ];

    if (isSocialEnabled) {
        let biProfileSlide = <BiProfileSlide
            skinTone={skinTone}
            skinType={skinType}
            eyeColor={eyeColor}
            hairColor={hairColor}
            skinColorIQ={skinColorIQ}
            isPrivate={isPrivate}
            nickname={nickname} />;
        slideArray.splice(1, 0, biProfileSlide);
    }

    const slideBg = 'rgba(255,255,255,.95)';
    const slideHeight = Sephora.isMobile() ? 152 : 231;
    const slideTopPad = Sephora.isMobile() ? 55 : 103;
    const slideBotPad = Sephora.isMobile() ? space[5] : space[6];

    return (
        <Box
            position='relative'
            data-at={Sephora.debug.dataAt(`background_picture_${socialProfile.background}`)}
            backgroundPosition='center'
            backgroundSize='cover'
            style={{
                backgroundImage: `url(${socialProfile.background})`
            }}>
            <Carousel
                slideshow={true}
                showArrows={Sephora.isDesktop()}
                showTouts={true}
                displayCount={1}
                controlHeight='auto'
                controlStyles={{
                    top: slideTopPad,
                    bottom: slideBotPad,
                    padding: space[5],
                    backgroundColor: 'rgba(255,255,255,.75)',
                    transition: 'background-color .2s',
                    ':hover': {
                        backgroundColor: slideBg
                    }
                }}
                totalItems={slideArray.length}>
                {slideArray.map(slideContent =>
                    <Box
                        paddingTop={slideTopPad}
                        paddingBottom={slideBotPad}
                        width={slideWidth}
                        marginX={Sephora.isMobile() ? space[2] : 'auto'}>
                        <Box
                            position='relative'
                            backgroundColor={slideBg}
                            boxShadow='0 0 12px 0 rgba(150,150,150,0.25)'
                            height={slideHeight}>
                            {slideContent}
                        </Box>
                    </Box>
                )}
            </Carousel>
            <Box
                position='absolute'
                _css={Sephora.isMobile() ? {
                    top: space[3],
                    right: space[2]
                } : {
                    top: (slideTopPad - forms.HEIGHT - space[3]),
                    left: 0,
                    right: 0
                }}>
                <Box
                    textAlign='right'
                    width={slideWidth}
                    marginX='auto'>
                    {isPrivate &&
                        <ButtonWhite
                            size={Sephora.isMobile() ? 'sm' : null}
                            onClick={() => this.handleOpenEditMyProfileClick()
                            }>
                            Edit
                        </ButtonWhite>
                    }
                </Box>
            </Box>
        </Box>
    );
};


// Added by sephora-jsx-loader.js
AboutMeSlideshow.prototype.path = 'RichProfile/UserProfile/common/AboutMeSlideshow';
// Added by sephora-jsx-loader.js
Object.assign(AboutMeSlideshow.prototype, require('./AboutMeSlideshow.c.js'));
var originalDidMount = AboutMeSlideshow.prototype.componentDidMount;
AboutMeSlideshow.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: AboutMeSlideshow');
if (originalDidMount) originalDidMount.apply(this);
if (AboutMeSlideshow.prototype.ctrlr) AboutMeSlideshow.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: AboutMeSlideshow');
// Added by sephora-jsx-loader.js
AboutMeSlideshow.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
AboutMeSlideshow.prototype.class = 'AboutMeSlideshow';
// Added by sephora-jsx-loader.js
AboutMeSlideshow.prototype.getInitialState = function() {
    AboutMeSlideshow.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
AboutMeSlideshow.prototype.render = wrapComponentRender(AboutMeSlideshow.prototype.render);
// Added by sephora-jsx-loader.js
var AboutMeSlideshowClass = React.createClass(AboutMeSlideshow.prototype);
// Added by sephora-jsx-loader.js
AboutMeSlideshowClass.prototype.classRef = AboutMeSlideshowClass;
// Added by sephora-jsx-loader.js
Object.assign(AboutMeSlideshowClass, AboutMeSlideshow);
// Added by sephora-jsx-loader.js
module.exports = AboutMeSlideshowClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/UserProfile/common/AboutMeSlideshow/AboutMeSlideshow.jsx