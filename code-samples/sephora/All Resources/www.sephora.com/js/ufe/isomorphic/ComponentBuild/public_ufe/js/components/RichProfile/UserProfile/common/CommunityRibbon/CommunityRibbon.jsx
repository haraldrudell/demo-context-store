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
    Sephora.Util.InflatorComps.Comps['CommunityRibbon'] = function CommunityRibbon(){
        return CommunityRibbonClass;
    }
}
const { fontSizes, space } = require('style');
const { Box, Flex } = require('components/display');
const userUtils = require('utils/User');
const IconChat = require('components/Icon/IconChat');
const IconGroups = require('components/Icon/IconGroups');
const IconLooks = require('components/Icon/IconLooks');
const IconStarOutline = require('components/Icon/IconStarOutline');
const { COMMUNITY_URLS } = require('utils/Community');
const reviewsSiteHost = Sephora.configurationSettings.bvUserAllReviewsUrl;

const CommunityRibbon = function () {
    this.state = {};
};

CommunityRibbon.prototype.render = function () {
    const {
        photoCount,
        groupCount,
        postCount,
        reviewCount,
        userSocialId,
        publicNickname,
        publicId,
        profileId
    } = this.props;

    let postsUrl =
        `${COMMUNITY_URLS.CONVERSATIONS}${userSocialId}?isMyPost=true`;
    let groupsUrl = publicNickname ?
        `${COMMUNITY_URLS.GROUPS}?username=${publicNickname}`
        : `${COMMUNITY_URLS.GROUPS}?pageType=my-group`;
    let photosUrl = publicId ?
        `${COMMUNITY_URLS.PUBLIC_LOOKS_PROFILE}${publicId}`
        : COMMUNITY_URLS.MY_LOOKS_PROFILE;
    let reviewsUrl = `${reviewsSiteHost}/${profileId}/profile.htm`;

    const styles = {
        item: {
            alignItems: 'center'
        },
        icon: {
            fontSize: '1.5em',
            marginRight: Sephora.isMobile() ? '.5em' : '.75em'
        },
        count: {
            fontWeight: 700
        },
        label: {
            fontSize: fontSizes.h5
        }
    };

    const itemDivider = (
        <Flex
            flex={1}
            textAlign='center'
            maxWidth='2.5em'>
            <Box
                marginX='auto'
                width='1px'
                backgroundColor='moonGray'
                height='2.25em' />
        </Flex>
    );

    return (
        <Flex
            fontSize={Sephora.isMobile() ? 'h4' : 'h3'}
            alignItems='center'
            justifyContent='center'
            lineHeight={1}
            paddingX={space[2]}
            paddingY='.875em'>

            <Flex
                _css={styles.item}
                href={postCount > 0 && postsUrl} >

                <IconChat _css={styles.icon} />

                <div>
                    <Box _css={styles.count}>
                        { userUtils.formatSocialCount(postCount) }
                    </Box>
                    <Box _css={styles.label}>
                        { postCount === 1 ? 'post' : 'posts'}
                    </Box>
                </div>
            </Flex>

            {itemDivider}

            <Flex
                _css={styles.item}
                href={groupCount > 0 && groupsUrl} >

                <IconGroups _css={styles.icon} />

                <div>
                    <Box _css={styles.count}>
                        { userUtils.formatSocialCount(groupCount )}
                    </Box>
                    <Box _css={styles.label}>
                        { groupCount === 1 ? 'group' : 'groups'}
                    </Box>
                </div>
            </Flex>

            {itemDivider}

            <Flex
                _css={styles.item}
                href={photoCount > 0 && photosUrl} >

                <IconLooks _css={styles.icon} />

                <div>
                    <Box _css={styles.count}>
                        { userUtils.formatSocialCount(photoCount) }
                    </Box>
                    <Box _css={styles.label}>
                        { photoCount === 1 ? 'look' : 'looks'}
                    </Box>
                </div>
            </Flex>

            {itemDivider}

            <Flex
                _css={styles.item}
                href={reviewCount > 0 && reviewsUrl} >

                <IconStarOutline _css={styles.icon} />

                <div>
                    <Box _css={styles.count}>
                        { userUtils.formatSocialCount(reviewCount) }
                    </Box>
                    <Box _css={styles.label}>
                        { reviewCount === 1 ? 'review' : 'reviews'}
                    </Box>
                </div>
            </Flex>

        </Flex>
    );
};


// Added by sephora-jsx-loader.js
CommunityRibbon.prototype.path = 'RichProfile/UserProfile/common/CommunityRibbon';
// Added by sephora-jsx-loader.js
CommunityRibbon.prototype.class = 'CommunityRibbon';
// Added by sephora-jsx-loader.js
CommunityRibbon.prototype.getInitialState = function() {
    CommunityRibbon.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
CommunityRibbon.prototype.render = wrapComponentRender(CommunityRibbon.prototype.render);
// Added by sephora-jsx-loader.js
var CommunityRibbonClass = React.createClass(CommunityRibbon.prototype);
// Added by sephora-jsx-loader.js
CommunityRibbonClass.prototype.classRef = CommunityRibbonClass;
// Added by sephora-jsx-loader.js
Object.assign(CommunityRibbonClass, CommunityRibbon);
// Added by sephora-jsx-loader.js
module.exports = CommunityRibbonClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/UserProfile/common/CommunityRibbon/CommunityRibbon.jsx