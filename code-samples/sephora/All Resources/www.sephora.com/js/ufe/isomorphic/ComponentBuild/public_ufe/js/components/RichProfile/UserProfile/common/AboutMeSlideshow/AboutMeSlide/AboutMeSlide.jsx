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
    Sephora.Util.InflatorComps.Comps['AboutMeSlide'] = function AboutMeSlide(){
        return AboutMeSlideClass;
    }
}
const { space } = require('style');
const { Box, Flex, Image, Text } = require('components/display');
const userUtils = require('utils/User');

const AboutMeSlide = function () {};

AboutMeSlide.prototype.hideBIBadge = function (rankBadgeProp) {
    let rankValues = [
        '/html/rank_icons/role_admin.svg',
        '/html/rank_icons/role_mod.svg',
        '/html/rank_icons/role_store.svg',
        '/html/rank_icons/role_sephora-pro-artist.svg',
        '/html/rank_icons/role_beauty-advisor.svg',
        '/html/rank_icons/role_founder.svg',
        '/html/rank_icons/role_brand.svg'
    ];

    return rankValues.indexOf(rankBadgeProp) === -1;
};

AboutMeSlide.prototype.render = function () {
    const isMobile = Sephora.isMobile();

    const {
        nickname,
        followerCount,
        followingCount,
        avatarPhotoUrl,
        rankBadge,
        biBadge
    } = this.props;

    //TODO ILLUPH-79373: Add a default avatar
    const biBadgeUrl = `https://${Sephora.configurationSettings.communitySiteHost}${biBadge}`;
    const rankBadgeUrl = `https://${Sephora.configurationSettings.communitySiteHost}${rankBadge}`;
    const badgeHeight = isMobile ? 18 : 24;
    const avatarSize = isMobile ? 92 : 172;
    const avatarOffset = isMobile ? avatarSize * 0.4 : avatarSize / 2;

    const followerCountText = followerCount === '1' ? 'follower' : 'followers';
    return (
        <Box
            textAlign='center'
            paddingTop={avatarSize - avatarOffset}>
            <Box
                position='absolute'
                top={-avatarOffset} left='50%'
                transform='translate(-50%, 0)'>
                <Box
                    circle={true}
                    data-at={Sephora.debug.dataAt(`user_avatar_${avatarPhotoUrl}`)}
                    boxShadow='0 0 12px 0 rgba(150,150,150,0.25)'
                    border={space[1]}
                    borderColor='white'
                    width={avatarSize}
                    height={avatarSize}
                    backgroundPosition='center'
                    backgroundSize='cover'
                    style={{
                        backgroundImage: `url(${avatarPhotoUrl})`
                    }} />
            </Box>
            <Text
                is='h1'
                fontSize={isMobile ? 'h2' : 'h0'}
                lineHeight={1}
                marginY='.5em'>
                {nickname ? <b>{nickname}</b> :
                    <Text color='gray'>[ Create a nickname ]</Text>
                }
            </Text>
            <Flex
                justifyContent='center'>
                {(biBadge && this.hideBIBadge(rankBadge)) &&
                    <Image
                        customSrc={biBadgeUrl}
                        marginRight={space[2]}
                        height={badgeHeight} />
                }
                { rankBadge &&
                    <Image
                        customSrc={rankBadgeUrl}
                        height={badgeHeight} />
                }
            </Flex>
            <Text
                is='p'
                fontSize={isMobile ? 'h4' : 'h3'}
                marginTop='.5em'>
                <b>{ userUtils.formatSocialCount(followerCount) }</b> { followerCountText }
                <Text marginX='.5em'>•</Text>
                <b>{ userUtils.formatSocialCount(followingCount) }</b> following
            </Text>
        </Box>
    );
};


// Added by sephora-jsx-loader.js
AboutMeSlide.prototype.path = 'RichProfile/UserProfile/common/AboutMeSlideshow/AboutMeSlide';
// Added by sephora-jsx-loader.js
AboutMeSlide.prototype.class = 'AboutMeSlide';
// Added by sephora-jsx-loader.js
AboutMeSlide.prototype.getInitialState = function() {
    AboutMeSlide.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
AboutMeSlide.prototype.render = wrapComponentRender(AboutMeSlide.prototype.render);
// Added by sephora-jsx-loader.js
var AboutMeSlideClass = React.createClass(AboutMeSlide.prototype);
// Added by sephora-jsx-loader.js
AboutMeSlideClass.prototype.classRef = AboutMeSlideClass;
// Added by sephora-jsx-loader.js
Object.assign(AboutMeSlideClass, AboutMeSlide);
// Added by sephora-jsx-loader.js
module.exports = AboutMeSlideClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/UserProfile/common/AboutMeSlideshow/AboutMeSlide/AboutMeSlide.jsx