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
    Sephora.Util.InflatorComps.Comps['PrivateProfile'] = function PrivateProfile(){
        return PrivateProfileClass;
    }
}
/* eslint-disable max-len */
const { space } = require('style');
const { Box, Grid, Text } = require('components/display');
const Container = require('components/Container/Container');
const AboutMeSlideshow = require('../common/AboutMeSlideshow/AboutMeSlideshow');
const CommunityRibbon = require('../common/CommunityRibbon/CommunityRibbon');
const JoinCommunity = require('../common/JoinCommunity/JoinCommunity');
const Groups = require('../common/Groups/Groups');
const Conversations = require('../common/Conversations/Conversations');
const Looks = require('../common/Looks');
const RecentReviews = require('../common/RecentReviews/RecentReviews');
const RecentPurchases = require('../common/RecentPurchases/RecentPurchases');
const ProductRecommendations = require('../common/ProductRecommendations/ProductRecommendations');
const ButtonWhite = require('components/Button/ButtonWhite');
const userUtils = require('utils/User');
const SLIDE_WIDTH = Sephora.isDesktop() ? 665 : null;
const CONVERSATIONS_LIMIT = Sephora.isMobile() ? 1 : 2;
const GROUPS_LIMIT = Sephora.isMobile() ? 2 : 4;
const communitySiteHost = Sephora.configurationSettings.communitySiteHost;
const NOTIFICATIONS_URL = '//' + communitySiteHost + '/t5/notificationfeed/page';
const MESSAGES_URL = '//' + communitySiteHost + '/t5/notes/privatenotespage';
const UrlUtils = require('utils/Url');
const communityUtils = require('utils/Community');
const SOCIAL_PROVIDERS = communityUtils.PROVIDER_TYPES;
const Link = require('components/Link/Link');

const PrivateProfile = function () {
    this.state = {
        userReviews: { totalResults: 0 },
        showPleaseSignInBlock: true
    };
};

PrivateProfile.prototype.render = function () {
    let skinTone;
    let skinType;
    let hairColor;
    let eyeColor;
    let birthDay;
    let birthMonth;
    let skinColorIQ;

    if (this.state.biAccount) {
        let biAccount = this.state.biAccount;
        let biPersonalInfo = userUtils.biPersonalInfoDisplayCleanUp(
                                biAccount.personalizedInformation
                            );
        skinTone = biPersonalInfo.skinTone;
        skinType = biPersonalInfo.skinType;
        hairColor = biPersonalInfo.hairColor;
        eyeColor = biPersonalInfo.eyeColor;
        skinColorIQ = biAccount.skinTones && biAccount.skinTones[0].shadeCode;
    }

    return (
        <div>
            {(!Sephora.isRootRender && this.isUserReady()) &&
                <div>

                {(!this.isUserAtleastRecognized() && this.state.showPleaseSignInBlock) &&
                    <Container
                        paddingY={space[5]}>
                        <Text
                            is='h2'
                            fontSize='h3'
                            marginY={space[5]}>
                            To view your profile, please
                            {' '}
                            <Link
                                primary={true}
                                onClick={this.signInHandler}>
                                sign in
                            </Link>
                            .
                        </Text>
                    </Container>
                }

                {(this.isUserAtleastRecognized() && this.state.socialInfo) &&
                    <div>
                        <AboutMeSlideshow
                            nickname={this.state.user.nickName}
                            socialProfile={this.state.socialInfo.socialProfile}
                            skinTone={skinTone}
                            skinType={skinType}
                            hairColor={hairColor}
                            skinColorIQ={skinColorIQ}
                            eyeColor={eyeColor}
                            slideWidth={SLIDE_WIDTH}
                            followerCount={this.state.socialInfo.socialProfile.follower}
                            isSocialEnabled={this.state.user.isSocialEnabled}
                            isPrivate />
                        <CommunityRibbon
                            photoCount={this.state.numUserPhotos}
                            groupCount={this.state.socialInfo.groupsData.total}
                            postCount={this.state.socialInfo.conversationsData.total}
                            reviewCount={this.state.userReviews.totalResults}
                            userSocialId={this.state.socialInfo.socialProfile.id}
                            profileId={this.state.user.profileId} />

                        <Box
                            paddingY={space[4]}
                            backgroundColor='nearWhite'>
                            <Container>
                                <Box
                                    maxWidth={SLIDE_WIDTH}
                                    marginX='auto'>
                                    <Grid
                                        gutter={space[4]}>
                                        <Grid.Cell width={1 / 2}>
                                            <ButtonWhite
                                                size={Sephora.isDesktop() ? 'lg' : null}
                                                notCaps={true}
                                                block={true}
                                                onClick={() => {
                                                    communityUtils.socialCheckLink(
                                                        NOTIFICATIONS_URL,
                                                        SOCIAL_PROVIDERS.lithium
                                                    );
                                                }}>
                                                Notifications
                                            </ButtonWhite>
                                        </Grid.Cell>
                                        <Grid.Cell width={1 / 2}>
                                            <ButtonWhite
                                                size={Sephora.isDesktop() ? 'lg' : null}
                                                notCaps={true}
                                                block={true}
                                                onClick={() => {
                                                    communityUtils.socialCheckLink(
                                                        MESSAGES_URL,
                                                        SOCIAL_PROVIDERS.lithium
                                                    );
                                                }}>
                                                Messages
                                            </ButtonWhite>
                                        </Grid.Cell>
                                    </Grid>
                                </Box>
                            </Container>
                        </Box>

                        {!this.state.user.nickName &&
                            <JoinCommunity />
                        }

                        <Groups
                            groups={this.state.socialInfo.groupsData.groups.slice(0, GROUPS_LIMIT)}
                            isFeaturedGroups={this.state.socialInfo.groupsData.isFeaturedGroups} />

                        <Conversations
                            conversations={this.state.socialInfo.conversationsData.conversations.
                                slice(0, CONVERSATIONS_LIMIT)}
                            isPrivate={true}
                            isFeatured={this.state.socialInfo.conversationsData.isFeaturedConversation}
                            socialId={this.state.socialInfo.socialProfile.id} />

                        { this.state.looksData &&
                            <Looks
                                isFeaturedLooks={this.state.looksData.isFeaturedLooks}
                                media={this.state.looksData.media} />
                        }

                        { this.state.userReviews.totalResults !== 0 &&
                            <RecentReviews
                                reviews={this.state.userReviews.results}
                                isPrivate
                                profileId={this.state.user.profileId} />
                        }
                        { this.state.recentPurchases &&
                            <RecentPurchases
                                recentPurchases={this.state.recentPurchases} />
                        }
                        {/* hiding certona carousel until we have profile page specific certona carousel
                            <ProductRecommendations />
                        */}
                    </div>
                }
                </div>
            }
        </div>
    );
};


// Added by sephora-jsx-loader.js
PrivateProfile.prototype.path = 'RichProfile/UserProfile/PrivateProfile';
// Added by sephora-jsx-loader.js
Object.assign(PrivateProfile.prototype, require('./PrivateProfile.c.js'));
var originalDidMount = PrivateProfile.prototype.componentDidMount;
PrivateProfile.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: PrivateProfile');
if (originalDidMount) originalDidMount.apply(this);
if (PrivateProfile.prototype.ctrlr) PrivateProfile.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: PrivateProfile');
// Added by sephora-jsx-loader.js
PrivateProfile.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
PrivateProfile.prototype.class = 'PrivateProfile';
// Added by sephora-jsx-loader.js
PrivateProfile.prototype.getInitialState = function() {
    PrivateProfile.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
PrivateProfile.prototype.render = wrapComponentRender(PrivateProfile.prototype.render);
// Added by sephora-jsx-loader.js
var PrivateProfileClass = React.createClass(PrivateProfile.prototype);
// Added by sephora-jsx-loader.js
PrivateProfileClass.prototype.classRef = PrivateProfileClass;
// Added by sephora-jsx-loader.js
Object.assign(PrivateProfileClass, PrivateProfile);
// Added by sephora-jsx-loader.js
module.exports = PrivateProfileClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/UserProfile/PrivateProfile/PrivateProfile.jsx