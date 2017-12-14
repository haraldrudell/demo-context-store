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
    Sephora.Util.InflatorComps.Comps['LookCard'] = function LookCard(){
        return LookCardClass;
    }
}
/* eslint-disable max-len */
const { space } = require('style');
const { Box, Flex, Grid, Image, Text } = require('components/display');
const Divider = require('components/Divider/Divider');
const Link = require('components/Link/Link');
const IconLove = require('components/Icon/IconLove');
const IconPlay = require('components/Icon/IconPlay');

function LookCard() {
    this.state = {
        look: this.props.look,
        isLoved: this.props.look.isLoved,
        numLoves: this.props.look.numLoves,
        isHeartHover: false
    };
}

LookCard.prototype.render = function () {
    let medium = this.state.look.medium;

    const isMobile = Sephora.isMobile();
    const width = medium.originalImageWidth;
    const height = medium.originalImageHeight;

    const badgeHeight = isMobile ? 12 : 16;
    const biBadgeUrl =
        `https://${Sephora.configurationSettings.communitySiteHost}${medium.biBadgeUrl}`;
    const engagementBadgeUrl =
        `https://${Sephora.configurationSettings.communitySiteHost}${medium.engagementBadgeUrl}`;

    const avatarSize = isMobile ? 26 : 38;
    const avatarUrl = `https://${Sephora.configurationSettings.communitySiteHost}${medium.avatarUrl}`;

    let isSolidHeart = this.state.isLoved || this.state.isHeartHover;

    return (
        <Box
            lineHeight={2}
            boxShadow={`0 0 ${this.props.shadowBlur}px 0 rgba(0,0,0,0.15)`}
            margin={5}
            rounded={2}
            overflow='hidden'>
            <Box
                position='relative'>
                <Link
                    display='block'
                    width='100%'
                    onClick={() => this.handleClick()}
                    backgroundPosition='center'
                    backgroundSize='cover'
                    style={{
                        paddingBottom: `${height / width * 100}%`,
                        backgroundImage: `url(${medium.url.normal})`
                    }}>
                    <Box
                        position='absolute'
                        right={0} bottom={0} left={0}
                        height={140}
                        backgroundImage='linear-gradient(transparent, rgba(0,0,0,.3))' />
                    {medium.isVideo() &&
                        <Box
                            position='absolute'
                            top='50%' left='50%'
                            transform='translate(-50%,-50%)'>
                            <IconPlay
                                fontSize={48}
                                color='white' />
                        </Box>
                    }
                </Link>
                <Box
                    position='absolute'
                    right={0} bottom={0}
                    padding={space[3]}
                    color='white'
                    fontWeight={700}
                    onMouseEnter={this.heartHover}
                    onMouseLeave={this.heartHover}
                    onClick={(e) => this.handleHeartClick(e)}>
                    {this.state.numLoves}
                    <IconLove
                        fontSize='1.25em'
                        marginLeft='.5em'
                        outline={!isSolidHeart}
                        color={isSolidHeart ? 'red' : null} />
                </Box>
            </Box>
            <Box
                padding={space[3]}>
                <Box
                    fontSize={isMobile ? 'h5' : 'h4'}
                    fontWeight={700}>
                    {medium.caption}
                </Box>
                {medium.groupData &&
                    <Box
                        marginTop={space[1]}
                        fontSize='h5'
                        color='silver'>
                        Posted in:
                        {' '}
                        <Text
                            fontWeight={700}
                            href={medium.groupData.url}>
                            {medium.groupData.name}
                        </Text>
                    </Box>
                }
            </Box>

            {/* The social lookup is not being done in 17.5.
            <Divider marginX={isMobile ? space[1] : space[2]} />
            <Box
                paddingX={space[3]}
                paddingY={space[2]}>
                <Grid
                    alignItems='center'
                    gutter={isMobile ? space[2] : space[4]}>
                    <Grid.Cell width='fit'>
                        <Box
                            backgroundPosition='center'
                            backgroundSize='cover'
                            circle={true}
                            border={1}
                            width={avatarSize}
                            height={avatarSize}
                            style={{
                                backgroundImage: `url(${avatarUrl})`
                            }} />
                    </Grid.Cell>
                    <Grid.Cell width='fill'>
                        <Box
                            fontSize='h5'
                            fontWeight={700}>
                            UserName
                        </Box>
                        <Flex
                            marginTop={space[1]}>
                            <Image
                                customSrc={biBadgeUrl}
                                height={badgeHeight}
                                marginRight={space[1]} />
                            <Image
                                customSrc={engagementBadgeUrl}
                                height={badgeHeight} />
                        </Flex>
                    </Grid.Cell>
                </Grid>
            </Box>
            */}
            { this.props.isMyLooks &&
                <div>
                    <Divider marginX={ isMobile ? space[1] : space[2] } />
                    <Link
                        textAlign='center'
                        width='100%'
                        fontSize='h5'
                        display='block'
                        primary={true}
                        paddingY={space[2]}
                        lineHeight={1}
                        onClick={() => {
                            this.launchDeleteLookModal();
                        }}>
                        Remove
                    </Link>
                </div>
            }
        </Box>
    );
};


// Added by sephora-jsx-loader.js
LookCard.prototype.path = 'BeautyBoard/LookCard';
// Added by sephora-jsx-loader.js
Object.assign(LookCard.prototype, require('./LookCard.c.js'));
var originalDidMount = LookCard.prototype.componentDidMount;
LookCard.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: LookCard');
if (originalDidMount) originalDidMount.apply(this);
if (LookCard.prototype.ctrlr) LookCard.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: LookCard');
// Added by sephora-jsx-loader.js
LookCard.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
LookCard.prototype.class = 'LookCard';
// Added by sephora-jsx-loader.js
LookCard.prototype.getInitialState = function() {
    LookCard.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
LookCard.prototype.render = wrapComponentRender(LookCard.prototype.render);
// Added by sephora-jsx-loader.js
var LookCardClass = React.createClass(LookCard.prototype);
// Added by sephora-jsx-loader.js
LookCardClass.prototype.classRef = LookCardClass;
// Added by sephora-jsx-loader.js
Object.assign(LookCardClass, LookCard);
// Added by sephora-jsx-loader.js
module.exports = LookCardClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BeautyBoard/LookCard/LookCard.jsx