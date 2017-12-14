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
    Sephora.Util.InflatorComps.Comps['BeautyBoardSocialLookup'] = function BeautyBoardSocialLookup(){
        return BeautyBoardSocialLookupClass;
    }
}
const { colors, space } = require('style');
const { Box, Flex, Grid, Image, Text } = require('components/display');
const Divider = require('components/Divider/Divider');

function BeautyBoardSocialLookup() {}

BeautyBoardSocialLookup.prototype.render = function () {
    const isDesktop = Sephora.isDesktop();
    const isMobile = Sephora.isMobile();
    const biBadgeUrl = this.props.biBadgeUrl &&
    `https://${Sephora.configurationSettings.communitySiteHost}${this.props.biBadgeUrl}`;
    const engagementBadgeUrl = this.props.engagementBadgeUrl &&
    `https://${Sephora.configurationSettings.communitySiteHost}${this.props.engagementBadgeUrl}`;

    return (
        <div>
            <Grid
                alignItems='center'
                paddingY={space[4]}
                gutter={isDesktop ? space[7] : null}>
                <Grid.Cell
                    width={isDesktop ? 'fit' : null}
                    _css={isDesktop ? {
                        borderRightWidth: 1,
                        borderColor: colors.moonGray
                    } : {}}>
                    <Text
                        is='h1'
                        fontSize={isDesktop ? 'h1' : 'h2'}
                        fontWeight={700}
                        lineHeight={2}>
                        {this.props.title}
                    </Text>
                </Grid.Cell>
                <Grid.Cell
                    width={isDesktop ? 'fill' : null}>
                    <Grid
                        href={this.props.link}
                        alignItems='center'
                        marginTop={isMobile ? space[5] : null}
                        gutter={space[4]}>
                        <Grid.Cell width='fit'>
                            <Box
                                width={40} height={40}
                                circle={true}
                                border={1}
                                backgroundPosition='center'
                                backgroundSize='cover'
                                style={{
                                    backgroundImage: `url(${this.props.avatarUrl})`
                                }} />
                        </Grid.Cell>
                        <Grid.Cell width='fill'>
                            <Text
                                display='block'
                                fontWeight={700}
                                lineHeight={2}
                                marginBottom={space[2]}>
                                {this.props.userNickname}
                            </Text>
                            <Flex>
                                {biBadgeUrl &&
                                    <Image
                                        customSrc={biBadgeUrl}
                                        height={18}
                                        marginRight={space[1]}
                                        disableLazyLoad= {true} />
                                }
                                {engagementBadgeUrl &&
                                    <Image
                                        customSrc={engagementBadgeUrl}
                                        height={18}
                                        disableLazyLoad= {true} />
                                }
                            </Flex>
                        </Grid.Cell>
                    </Grid>
                </Grid.Cell>
            </Grid>
            <Divider
                marginX={isMobile ? -space[4] : null}
                marginBottom={isMobile ? space[4] : space[6]} />
        </div>
    );
};


// Added by sephora-jsx-loader.js
BeautyBoardSocialLookup.prototype.path = 'BeautyBoard/BeautyBoardSocialLookup';
// Added by sephora-jsx-loader.js
BeautyBoardSocialLookup.prototype.class = 'BeautyBoardSocialLookup';
// Added by sephora-jsx-loader.js
BeautyBoardSocialLookup.prototype.getInitialState = function() {
    BeautyBoardSocialLookup.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BeautyBoardSocialLookup.prototype.render = wrapComponentRender(BeautyBoardSocialLookup.prototype.render);
// Added by sephora-jsx-loader.js
var BeautyBoardSocialLookupClass = React.createClass(BeautyBoardSocialLookup.prototype);
// Added by sephora-jsx-loader.js
BeautyBoardSocialLookupClass.prototype.classRef = BeautyBoardSocialLookupClass;
// Added by sephora-jsx-loader.js
Object.assign(BeautyBoardSocialLookupClass, BeautyBoardSocialLookup);
// Added by sephora-jsx-loader.js
module.exports = BeautyBoardSocialLookupClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BeautyBoard/BeautyBoardSocialLookup/BeautyBoardSocialLookup.jsx