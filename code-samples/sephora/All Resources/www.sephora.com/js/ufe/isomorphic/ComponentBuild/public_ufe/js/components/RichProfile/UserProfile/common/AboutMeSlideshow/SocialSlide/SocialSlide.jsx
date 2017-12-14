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
    Sephora.Util.InflatorComps.Comps['SocialSlide'] = function SocialSlide(){
        return SocialSlideClass;
    }
}
/* eslint max-len: [2, 275] */
const { colors, space } = require('style');
const { Box, Flex, Text } = require('components/display');
const Link = require('components/Link/Link');
const IconInstagram = require('components/Icon/IconInstagram');
const IconYoutube = require('components/Icon/IconYoutube');
const IconShare = require('components/Icon/IconShare');

const SocialSlide = function () { };

SocialSlide.prototype.render = function () {
    const {
        nickname,
        instagramUrl,
        youtubeUrl,
        biography,
        isPrivate
    } = this.props;

    let privateBioEmptyMessage = 'Are you a Virgo with an addiction to lip gloss? Click edit to describe yourself in a sentence or two.';
    let privateFullEmptyMessage = 'Are you a Virgo with an addiction to lip gloss? Click edit to describe yourself in a sentence or two and add your Instagram and YouTube handles.';
    let publicEmptyMessage = `${nickname} hasn't added a bio yet.`;

    const isMobile = Sephora.isMobile();

    const styles = {
        socialIcon: {
            padding: isMobile ? 6 : 8,
            fontSize: isMobile ? 18 : 20,
            marginRight: space[2],
            borderRadius: 99999,
            lineHeight: 0,
            color: colors.white,
            backgroundColor: colors.black
        }
    };

    return (
        <Flex
            _css={styles.root}
            fontSize={isMobile ? 'h4' : 'h3'}
            paddingY={isMobile ? space[4] : space[6]}
            paddingX={isMobile ? space[5] : space[6]}
            height='100%'>
            {biography || youtubeUrl || instagramUrl
                ?
                <Flex
                    flexDirection='column'
                    justifyContent='space-between'
                    width={1}
                    lineHeight={isMobile ? 2 : null}>
                    {biography ?
                        <Text
                            is='p'>
                            {biography}
                        </Text> :
                        <Text
                            is='p'
                            color='gray'>
                            {isPrivate ? privateBioEmptyMessage : publicEmptyMessage}
                        </Text>
                    }
                    <Flex
                        alignItems='center'
                        justifyContent='space-between'>
                        <div>
                            {youtubeUrl &&
                                <Link
                                    href={youtubeUrl}>
                                    <Box _css={styles.socialIcon}>
                                        <IconYoutube />
                                    </Box>
                                </Link>
                            }
                            {instagramUrl &&
                                <Link
                                    href={instagramUrl}>
                                    <Box _css={styles.socialIcon}>
                                        <IconInstagram />
                                    </Box>
                                </Link>
                            }
                        </div>


                        {nickname &&
                            <Link
                                onClick={this.launchSocialShareModal}>
                                <IconShare fontSize='1.25em' />
                                <Text marginLeft={space[2]}>/{nickname}</Text>
                            </Link>
                        }
                    </Flex>
                </Flex>
                :
                <Flex
                    flexDirection='column'
                    justifyContent='space-between'
                    width={1}
                    lineHeight={isMobile ? 2 : null}>
                    <Text
                        is='p'
                        color='gray'>
                        {isPrivate ? privateFullEmptyMessage : publicEmptyMessage}
                    </Text>
                    <Flex
                        alignItems='center'
                        justifyContent='space-between'>
                        {nickname &&
                            <Link
                                onClick={this.launchSocialShareModal}>
                                <IconShare fontSize='1.25em' />
                                <Text marginLeft={space[2]}>/{nickname}</Text>
                            </Link>
                        }
                    </Flex>
                </Flex>
            }
        </Flex>
    );
};


// Added by sephora-jsx-loader.js
SocialSlide.prototype.path = 'RichProfile/UserProfile/common/AboutMeSlideshow/SocialSlide';
// Added by sephora-jsx-loader.js
Object.assign(SocialSlide.prototype, require('./SocialSlide.c.js'));
var originalDidMount = SocialSlide.prototype.componentDidMount;
SocialSlide.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: SocialSlide');
if (originalDidMount) originalDidMount.apply(this);
if (SocialSlide.prototype.ctrlr) SocialSlide.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: SocialSlide');
// Added by sephora-jsx-loader.js
SocialSlide.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
SocialSlide.prototype.class = 'SocialSlide';
// Added by sephora-jsx-loader.js
SocialSlide.prototype.getInitialState = function() {
    SocialSlide.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
SocialSlide.prototype.render = wrapComponentRender(SocialSlide.prototype.render);
// Added by sephora-jsx-loader.js
var SocialSlideClass = React.createClass(SocialSlide.prototype);
// Added by sephora-jsx-loader.js
SocialSlideClass.prototype.classRef = SocialSlideClass;
// Added by sephora-jsx-loader.js
Object.assign(SocialSlideClass, SocialSlide);
// Added by sephora-jsx-loader.js
module.exports = SocialSlideClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/UserProfile/common/AboutMeSlideshow/SocialSlide/SocialSlide.jsx