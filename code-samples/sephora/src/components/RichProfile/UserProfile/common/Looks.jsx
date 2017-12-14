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
    Sephora.Util.InflatorComps.Comps['Looks'] = function Looks(){
        return LooksClass;
    }
}
const { space } = require('style');
const { Box, Grid, Image, Text } = require('components/display');
const Link = require('components/Link/Link');
const Divider = require('components/Divider/Divider');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const IconCameraOutline = require('components/Icon/IconCameraOutline');
const IconPlay = require('components/Icon/IconPlay');
const SectionContainer = require('./SectionContainer/SectionContainer');
const communityUtils = require('utils/Community');
const SOCIAL_PROVIDERS = communityUtils.PROVIDER_TYPES;
const COMMUNITY_URLS = communityUtils.COMMUNITY_URLS;

const Looks = function () {};

const BEAUTY_BOARD_POST_PHOTO_URL = COMMUNITY_URLS.ADD_PHOTO;
const BEAUTY_BOARD_URL = COMMUNITY_URLS.GALLERY;
const BEAUTY_BOARD_PRIVATE_PROFILE_URL = COMMUNITY_URLS.MY_LOOKS_PROFILE;

Looks.prototype.render = function () {
    const {
        isFeaturedLooks,
        isPublic,
        nickname,
        media,
        publicId
    } = this.props;

    const title = isFeaturedLooks ? 'Featured Looks' : isPublic ? 'Looks' :
        'My Looks';

    const BEAUTY_BOARD_PUBLIC_PROFILE_URL = `${COMMUNITY_URLS.PUBLIC_LOOKS_PROFILE}${publicId}`;

    return (
        <SectionContainer
            hasDivider={true}
            title={title}
            link={isPublic ?
                    !media.length ?
                        null :
                        BEAUTY_BOARD_PUBLIC_PROFILE_URL :
                    ( isFeaturedLooks ?
                        BEAUTY_BOARD_URL :
                        BEAUTY_BOARD_PRIVATE_PROFILE_URL )}
            intro={isFeaturedLooks ?
                `See and be seen. Post and browse looks and videos from other
                Beauty Insider members.`
            : null}>

            {isPublic && !media.length ?
                <Box
                    fontSize={Sephora.isMobile() ? 'h4' : 'h3'}
                    textAlign={Sephora.isMobile() ? 'left' : 'center'}>
                    <Text
                        is='p'
                        color='gray'
                        marginBottom='1em'>
                        {nickname} hasn’t added any photos or videos yet.
                    </Text>
                    <Link
                        padding={space[3]}
                        margin={-space[3]}
                        arrowDirection='right'
                        href={BEAUTY_BOARD_URL}>
                        Explore all looks
                    </Link>
                </Box>
                :
                <div>
                    <Grid
                        gutter={Sephora.isMobile() ? space[4] : space[5]}>
                        {media.map((medium) =>
                            <Grid.Cell
                                width={Sephora.isMobile() ? 1 / 2 : 1 / 4}>
                                <Box
                                    href={Looks.getMediumBeautyBoardUrl(medium)}
                                    position='relative'
                                    paddingBottom='100%'
                                    _css={Sephora.isTouch || {
                                        transition: 'opacity .2s',
                                        ':hover': {
                                            opacity: 0.5
                                        }
                                    }}
                                    backgroundPosition='center'
                                    backgroundSize='cover'
                                    style={{
                                        backgroundImage: `url(${medium.url.normal})`
                                    }}>
                                    {medium.isVideo() &&
                                        <IconPlay
                                            color='white'
                                            width='30%' height='30%'
                                            position='absolute'
                                            top='35%' left='35%' />
                                    }
                                </Box>
                            </Grid.Cell>
                        )}
                    </Grid>
                    {Sephora.isMobile() &&
                        <Divider marginY={space[4]} />
                    }
                    <Box
                        textAlign='center'
                        marginTop={Sephora.isDesktop() ? space[6] : null}>

                        <ButtonPrimary
                            size={Sephora.isDesktop() ? 'lg' : null}
                            minWidth={Sephora.isDesktop() ? '20em' : null}
                            block={Sephora.isMobile()}
                            onClick={()=>
                                communityUtils.socialCheckLink(
                                    BEAUTY_BOARD_POST_PHOTO_URL,
                                    SOCIAL_PROVIDERS.olapic)
                            }>
                            <IconCameraOutline
                                fontSize='1.375em'
                                marginRight='.75em' />
                            Add a Look
                        </ButtonPrimary>

                    </Box>
                </div>
            }

        </SectionContainer>
    );
};

Looks.getMediumBeautyBoardUrl = function (medium) {
    return '/gallery?opi=' + medium.id;
};


// Added by sephora-jsx-loader.js
Looks.prototype.path = 'RichProfile/UserProfile/common';
// Added by sephora-jsx-loader.js
Looks.prototype.class = 'Looks';
// Added by sephora-jsx-loader.js
Looks.prototype.getInitialState = function() {
    Looks.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Looks.prototype.render = wrapComponentRender(Looks.prototype.render);
// Added by sephora-jsx-loader.js
var LooksClass = React.createClass(Looks.prototype);
// Added by sephora-jsx-loader.js
LooksClass.prototype.classRef = LooksClass;
// Added by sephora-jsx-loader.js
Object.assign(LooksClass, Looks);
// Added by sephora-jsx-loader.js
module.exports = LooksClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/UserProfile/common/Looks.jsx