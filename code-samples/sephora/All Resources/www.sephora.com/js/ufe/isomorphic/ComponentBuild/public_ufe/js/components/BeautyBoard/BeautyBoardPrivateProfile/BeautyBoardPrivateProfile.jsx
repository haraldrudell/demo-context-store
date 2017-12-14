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
    Sephora.Util.InflatorComps.Comps['BeautyBoardPrivateProfile'] = function BeautyBoardPrivateProfile(){
        return BeautyBoardPrivateProfileClass;
    }
}
const { space } = require('style');
const { Box, Image, Text } = require('components/display');

const LooksCarousel = require('../LooksCarousel/LooksCarousel');
const BeautyBoardGalleryNavigation = require('../BeautyBoardGalleryNavigation/BeautyBoardGalleryNavigation');
const BeautyBoardSocialLookup = require('../BeautyBoardSocialLookup/BeautyBoardSocialLookup');
const Container = require('components/Container/Container');
const Divider = require('components/Divider/Divider');
const ButtonOutline = require('components/Button/ButtonOutline');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const IconLove = require('components/Icon/IconLove');
const communityUtils = require('utils/Community');
const SOCIAL_PROVIDERS = communityUtils.PROVIDER_TYPES;
const COMMUNITY_URLS = communityUtils.COMMUNITY_URLS;

function BeautyBoardPrivateProfile() {
    this.state = {
        initialMyLooks: null,
        initialMyLovedLooks: null,
        userNickname: null,
        avatarUrl: null,
        biBadgeUrl: null,
        engagementBadgeUrl: null,
        myLooksTotalNumber: 0,
        myLovedLooksTotalNumber: 0
    };
}

const RICH_PROFILE_URL = '/profile/me';

BeautyBoardPrivateProfile.prototype.render = function () {
    const isMobile = Sephora.isMobile();
    const buttonMinWidth = !isMobile ? '17em' : null;

    return !Sephora.isRootRender && <div>
        <BeautyBoardGalleryNavigation />

        <Container>

            <BeautyBoardSocialLookup
                title='My Gallery Activity'
                link={RICH_PROFILE_URL}
                userNickname={this.state.userNickname}
                avatarUrl={this.state.avatarUrl}
                biBadgeUrl={this.state.biBadgeUrl}
                engagementBadgeUrl={this.state.engagementBadgeUrl} />

            <Text
                is='h2'
                fontSize='h1'
                serif={true}
                lineHeight={2}
                marginBottom={isMobile ? space[4] : space[5]}
                textAlign={!isMobile ? 'center' : null}>
                My Looks
            </Text>

            {this.state.initialMyLooks &&
                this.state.initialMyLooks.length ?
                <LooksCarousel
                    totalNumber={this.state.myLooksTotalNumber}
                    initialLooks={this.state.initialMyLooks}
                    getNextLooksPage={this.getNextMyLooksPage.bind(this)}
                    isMyLooks={true}/>
                :
                null
            }

            {this.state.initialMyLooks &&
                !this.state.initialMyLooks.length &&
                <Box
                    textAlign='center'>
                    <Image
                        src='/img/ufe/gallery/no-looks.svg'
                        display='block'
                        marginX='auto'
                        width={128} height={97}
                        marginY={isMobile ? space[5] : space[6]} />
                    <Text
                        is='p'
                        marginBottom={space[5]}>
                        <b>You don’t have any looks yet.</b>
                        <br />
                        Upload a photo or video to get started.
                    </Text>
                    <ButtonPrimary
                        block={isMobile}
                        minWidth={buttonMinWidth}
                        onClick={() =>
                            communityUtils.socialCheckLink(
                                '/community/gallery/add-photo',
                                SOCIAL_PROVIDERS.olapic)
                        }>
                        Add a Look
                    </ButtonPrimary>
                </Box>
            }

            {isMobile ?
                <Divider
                    height={space[2]}
                    color='nearWhite'
                    marginY={space[5]}
                    marginX={-space[4]} />
                :
                <Divider
                    marginY={space[6]} />
            }

            <Text
                is='h2'
                fontSize='h1'
                serif={true}
                lineHeight={2}
                marginBottom={isMobile ? space[4] : space[5]}
                textAlign={!isMobile ? 'center' : null}>
                My Loved Looks
            </Text>

            {this.state.initialMyLovedLooks &&
                this.state.initialMyLovedLooks.length ?
                <LooksCarousel
                    totalNumber={this.state.myLovedLooksTotalNumber}
                    initialLooks={this.state.initialMyLovedLooks}
                    getNextLooksPage={this.getNextMyLovedLooksPage.bind(this)} />
                :
                null
            }

            {this.state.initialMyLovedLooks &&
                !this.state.initialMyLovedLooks.length &&
                <Box
                    textAlign='center'>
                    <Image
                        src='/img/ufe/gallery/no-loves.svg'
                        display='block'
                        marginX='auto'
                        width={128} height={97}
                        marginY={isMobile ? space[5] : space[6]} />
                    <Text
                        is='p'
                        marginBottom={space[5]}>
                        <b>You haven’t loved any looks yet.</b>
                        <br />
                        Collect your favorite looks by clicking on the
                        {' '}
                        <IconLove outline={true} />.
                    </Text>
                    <ButtonOutline
                        block={isMobile}
                        href={COMMUNITY_URLS.GALLERY}
                        minWidth={buttonMinWidth}>
                        Explore the Gallery
                    </ButtonOutline>
                </Box>
            }
        </Container>

    </div> || null;
};


// Added by sephora-jsx-loader.js
BeautyBoardPrivateProfile.prototype.path = 'BeautyBoard/BeautyBoardPrivateProfile';
// Added by sephora-jsx-loader.js
Object.assign(BeautyBoardPrivateProfile.prototype, require('./BeautyBoardPrivateProfile.c.js'));
var originalDidMount = BeautyBoardPrivateProfile.prototype.componentDidMount;
BeautyBoardPrivateProfile.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BeautyBoardPrivateProfile');
if (originalDidMount) originalDidMount.apply(this);
if (BeautyBoardPrivateProfile.prototype.ctrlr) BeautyBoardPrivateProfile.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BeautyBoardPrivateProfile');
// Added by sephora-jsx-loader.js
BeautyBoardPrivateProfile.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BeautyBoardPrivateProfile.prototype.class = 'BeautyBoardPrivateProfile';
// Added by sephora-jsx-loader.js
BeautyBoardPrivateProfile.prototype.getInitialState = function() {
    BeautyBoardPrivateProfile.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BeautyBoardPrivateProfile.prototype.render = wrapComponentRender(BeautyBoardPrivateProfile.prototype.render);
// Added by sephora-jsx-loader.js
var BeautyBoardPrivateProfileClass = React.createClass(BeautyBoardPrivateProfile.prototype);
// Added by sephora-jsx-loader.js
BeautyBoardPrivateProfileClass.prototype.classRef = BeautyBoardPrivateProfileClass;
// Added by sephora-jsx-loader.js
Object.assign(BeautyBoardPrivateProfileClass, BeautyBoardPrivateProfile);
// Added by sephora-jsx-loader.js
module.exports = BeautyBoardPrivateProfileClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BeautyBoard/BeautyBoardPrivateProfile/BeautyBoardPrivateProfile.jsx