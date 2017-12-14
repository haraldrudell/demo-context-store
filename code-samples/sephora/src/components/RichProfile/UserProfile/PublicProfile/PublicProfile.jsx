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
    Sephora.Util.InflatorComps.Comps['PublicProfile'] = function PublicProfile(){
        return PublicProfileClass;
    }
}
/* eslint-disable max-len */
const { space } = require('style');
const { Box, Grid } = require('components/display');
const ButtonWhite = require('components/Button/ButtonWhite');
const Container = require('components/Container/Container');
const AboutMeSlideshow = require('../common/AboutMeSlideshow/AboutMeSlideshow');
const CommunityRibbon = require('../common/CommunityRibbon/CommunityRibbon');
const JoinCommunity = require('../common/JoinCommunity/JoinCommunity');
const Groups = require('../common/Groups/Groups');
const Conversations = require('../common/Conversations/Conversations');
const Looks = require('../common/Looks');
const RecentReviews = require('../common/RecentReviews/RecentReviews');
const SLIDE_WIDTH = Sephora.isDesktop() ? 665 : null;
const GROUPS_LIMIT = Sephora.isMobile() ? 2 : 4;
const CONVERSATIONS_LIMIT = Sephora.isMobile() ? 1 : 2;
const UrlUtils = require('utils/Url');
const communityUtils = require('utils/Community');


const PublicProfile = function () {
    this.state = {
        numUserPhotos: 0,
        socialInfo: {
            recentMessages: [],
            totalGroups: 0
        },
        userReviews: { totalResults: 0 },
        isFollowButtonDisabled: false,
        loggedInUser: {}
    };
};

PublicProfile.prototype.render = function () {
    const { nickname } = this.props;
    let skinTone;
    let skinType;
    let groupsData = this.state.socialInfo &&
        this.state.socialInfo.groupsData;
    let conversationsData = this.state.socialInfo &&
        this.state.socialInfo.conversationsData;
    let isOlapicBeautyBoardEnabled = Sephora.configurationSettings.isOlapicBeautyBoardEnabled;

    return (
        <div>
            {!Sephora.isRootRender && this.state.socialInfo.socialProfile &&
            <div>
                <AboutMeSlideshow
                    nickname={nickname}
                    socialProfile={this.state.socialInfo.socialProfile}
                    skinTone={this.state.user.skinTone}
                    skinType={this.state.user.skinType}
                    hairColor={this.state.user.hairColor}
                    eyeColor={this.state.user.eyeColor}
                    skinColorIQ={this.state.user.coloriq}
                    isPrivate={false}
                    slideWidth={SLIDE_WIDTH}
                    followerCount={this.state.followerCount}
                    isSocialEnabled={this.state.user.isSocialEnabled} />
                <CommunityRibbon
                    photoCount={this.state.numUserPhotos}
                    groupCount={this.state.socialInfo.groupsData.total}
                    postCount={this.state.socialInfo.conversationsData.total}
                    reviewCount={this.state.userReviews.totalResults}
                    userSocialId={this.state.socialInfo.socialProfile.id}
                    publicNickname={nickname}
                    publicId={this.state.publicId}
                    profileId={this.state.profileId} />
                <Box
                    paddingY={space[4]}
                    backgroundColor='nearWhite'>
                    <Container>
                        <Box
                            maxWidth={SLIDE_WIDTH}
                            marginX='auto'>
                            <Grid
                                gutter={space[4]}>
                                <Grid.Cell
                                    width={1 / 2}
                                    position='relative'>
                                    <ButtonWhite
                                        disabled={nickname === this.state.loggedInUser.nickName}
                                        size={Sephora.isDesktop() ? 'lg' : null}
                                        notCaps={true}
                                        onClick={() => {
                                            communityUtils.ensureUserIsReadyForSocialAction(communityUtils.PROVIDER_TYPES.lithium).
                                            then(() => {
                                                this.handleFollowClick();
                                            });
                                        }}
                                        block={true}>
                                        { this.state.isBeingFollowed ? 'Unfollow' : 'Follow' }
                                    </ButtonWhite>
                                    {this.state.isFollowButtonDisabled &&
                                        <Box
                                            position='absolute'
                                            top={0} right={0} bottom={0} left={0} />
                                    }
                                </Grid.Cell>
                                <Grid.Cell width={1 / 2}>
                                    <ButtonWhite
                                        disabled={nickname === this.state.loggedInUser.nickName}
                                        size={Sephora.isDesktop() ? 'lg' : null}
                                        notCaps={true}
                                        onClick={() => {
                                            communityUtils.socialCheckLink(
                                                `https://${Sephora.configurationSettings.communitySiteHost}/t5/notes/composepage/note-to-user-id/${this.state.socialInfo.socialProfile.id}`,
                                                communityUtils.PROVIDER_TYPES.lithium
                                            );
                                        }}
                                        block={true}>
                                        Send Message
                                    </ButtonWhite>
                                </Grid.Cell>
                            </Grid>
                        </Box>
                    </Container>
                </Box>

                <Groups
                    isPublic={true}
                    nickname={nickname}
                    groups={!groupsData.isFeaturedGroups &&
                        groupsData.groups.slice(0, GROUPS_LIMIT)} />

                <Conversations
                    isPrivate={false}
                    conversations={!conversationsData.isFeaturedConversation &&
                        conversationsData.conversations.slice(0, CONVERSATIONS_LIMIT)}
                    socialId={this.state.socialInfo.socialProfile.id}
                    nickname={nickname} />

                { this.state.looksMedia && isOlapicBeautyBoardEnabled &&
                    <Looks
                        isPublic={true}
                        nickname={nickname}
                        publicId={this.state.publicId}
                        media={this.state.looksMedia} />
                }

                { this.state.userReviews.totalResults !== 0 &&
                    <RecentReviews
                        reviews={this.state.userReviews.results}
                        nickname={nickname}
                        isPrivate={false}
                        profileId={this.state.profileId} /> }
            </div>
            }
        </div>
    );
};


// Added by sephora-jsx-loader.js
PublicProfile.prototype.path = 'RichProfile/UserProfile/PublicProfile';
// Added by sephora-jsx-loader.js
Object.assign(PublicProfile.prototype, require('./PublicProfile.c.js'));
var originalDidMount = PublicProfile.prototype.componentDidMount;
PublicProfile.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: PublicProfile');
if (originalDidMount) originalDidMount.apply(this);
if (PublicProfile.prototype.ctrlr) PublicProfile.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: PublicProfile');
// Added by sephora-jsx-loader.js
PublicProfile.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
PublicProfile.prototype.class = 'PublicProfile';
// Added by sephora-jsx-loader.js
PublicProfile.prototype.getInitialState = function() {
    PublicProfile.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
PublicProfile.prototype.render = wrapComponentRender(PublicProfile.prototype.render);
// Added by sephora-jsx-loader.js
var PublicProfileClass = React.createClass(PublicProfile.prototype);
// Added by sephora-jsx-loader.js
PublicProfileClass.prototype.classRef = PublicProfileClass;
// Added by sephora-jsx-loader.js
Object.assign(PublicProfileClass, PublicProfile);
// Added by sephora-jsx-loader.js
module.exports = PublicProfileClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/UserProfile/PublicProfile/PublicProfile.jsx