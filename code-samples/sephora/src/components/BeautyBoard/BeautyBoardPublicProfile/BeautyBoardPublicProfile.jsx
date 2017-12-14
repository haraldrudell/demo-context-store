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
    Sephora.Util.InflatorComps.Comps['BeautyBoardPublicProfile'] = function BeautyBoardPublicProfile(){
        return BeautyBoardPublicProfileClass;
    }
}
const { space } = require('style');
const { Box, Image, Text } = require('components/display');
const LooksCarousel = require('../LooksCarousel/LooksCarousel');
const BeautyBoardSocialLookup = require('../BeautyBoardSocialLookup/BeautyBoardSocialLookup');
const Container = require('components/Container/Container');
const Divider = require('components/Divider/Divider');
const ButtonOutline = require('components/Button/ButtonOutline');
const { COMMUNITY_URLS } = require ('utils/Community');


function getUserRichProfileUrl(userNickname) {
    return `/users/${userNickname}`;
}

function BeautyBoardPublicProfile() {
    this.state = {
        initialUserLooks: null,
        initialUserLovedLooks: null,
        userNickname: null,
        avatarUrl: null,
        biBadgeUrl: null,
        engagementBadgeUrl: null,
        userLooksTotalNumber: 0,
        userLovedLooksTotalNumber: 0
    };
}

BeautyBoardPublicProfile.prototype.render = function () {
    const isMobile = Sephora.isMobile();

    return !Sephora.isRootRender &&
        <Container
            marginTop={!isMobile ? space[5] : null}>

            <BeautyBoardSocialLookup
                title='Gallery Activity'
                link={getUserRichProfileUrl(this.state.userNickname)}
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
                Looks
            </Text>

            {this.state.initialUserLooks &&
                this.state.initialUserLooks.length ?
                <LooksCarousel
                    totalNumber={this.state.userLooksTotalNumber}
                    initialLooks={this.state.initialUserLooks}
                    getNextLooksPage={this.getNextUserLooksPage.bind(this)} />
                :
                null
            }

            {this.state.initialUserLooks &&
                !this.state.initialUserLooks.length &&
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
                        fontWeight={700}>
                        {this.state.userNickname} doesn’t have any looks yet.
                    </Text>
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
                Loved Looks
            </Text>

            {this.state.initialUserLovedLooks &&
                this.state.initialUserLovedLooks.length ?
                <LooksCarousel
                    totalNumber={this.state.userLovedLooksTotalNumber}
                    initialLooks={this.state.initialUserLovedLooks}
                    getNextLooksPage={this.getNextUserLovedLooksPage.bind(this)} />
                :
                null
            }

            {this.state.initialUserLovedLooks &&
                !this.state.initialUserLovedLooks.length &&
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
                        fontWeight={700}
                        marginBottom={space[5]}>
                        {this.state.userNickname} hasn’t loved any looks yet.
                    </Text>
                    <ButtonOutline
                        block={isMobile}
                        href={COMMUNITY_URLS.GALLERY}>
                        Explore the Gallery
                    </ButtonOutline>
                </Box>
            }

        </Container> || null;
};


// Added by sephora-jsx-loader.js
BeautyBoardPublicProfile.prototype.path = 'BeautyBoard/BeautyBoardPublicProfile';
// Added by sephora-jsx-loader.js
Object.assign(BeautyBoardPublicProfile.prototype, require('./BeautyBoardPublicProfile.c.js'));
var originalDidMount = BeautyBoardPublicProfile.prototype.componentDidMount;
BeautyBoardPublicProfile.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BeautyBoardPublicProfile');
if (originalDidMount) originalDidMount.apply(this);
if (BeautyBoardPublicProfile.prototype.ctrlr) BeautyBoardPublicProfile.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BeautyBoardPublicProfile');
// Added by sephora-jsx-loader.js
BeautyBoardPublicProfile.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BeautyBoardPublicProfile.prototype.class = 'BeautyBoardPublicProfile';
// Added by sephora-jsx-loader.js
BeautyBoardPublicProfile.prototype.getInitialState = function() {
    BeautyBoardPublicProfile.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BeautyBoardPublicProfile.prototype.render = wrapComponentRender(BeautyBoardPublicProfile.prototype.render);
// Added by sephora-jsx-loader.js
var BeautyBoardPublicProfileClass = React.createClass(BeautyBoardPublicProfile.prototype);
// Added by sephora-jsx-loader.js
BeautyBoardPublicProfileClass.prototype.classRef = BeautyBoardPublicProfileClass;
// Added by sephora-jsx-loader.js
Object.assign(BeautyBoardPublicProfileClass, BeautyBoardPublicProfile);
// Added by sephora-jsx-loader.js
module.exports = BeautyBoardPublicProfileClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BeautyBoard/BeautyBoardPublicProfile/BeautyBoardPublicProfile.jsx