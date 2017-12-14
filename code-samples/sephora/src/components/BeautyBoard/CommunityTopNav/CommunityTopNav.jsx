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
    Sephora.Util.InflatorComps.Comps['CommunityTopNav'] = function CommunityTopNav(){
        return CommunityTopNavClass;
    }
}
/* eslint-disable max-len */
const { colors, dropdown, space } = require('style');
const { Box, Flex } = require('components/display');
const Container = require('components/Container/Container');
const CommunityTopNavActions = require('./CommunityTopNavActions/CommunityTopNavActions');
const Dropdown = require('components/Dropdown/Dropdown');
const Chevron = require('components/Chevron/Chevron');
const IconCross = require('components/Icon/IconCross');
const IconBell = require('components/Icon/IconBell');
const Link = require('components/Link/Link');
const communityUtils = require('utils/Community');
const SOCIAL_PROVIDERS = communityUtils.PROVIDER_TYPES;
const COMMUNITY_URLS = communityUtils.COMMUNITY_URLS;

const CommunityTopNav = function () {
    this.state = { };
};

CommunityTopNav.prototype.render = function () {
    const isMobile = Sephora.isMobile();

    let links = [
        {
            label: 'Home',
            link: '/community',
            isActive: this.props.section === 'communityHQ'
        },
        {
            label: 'Groups',
            link: COMMUNITY_URLS.GROUPS,
            isActive: false
        },
        {
            label: 'Conversations',
            link: `https://${Sephora.configurationSettings.communitySiteHost}`,
            isActive: false
        },
        {
            label: 'Gallery',
            link: COMMUNITY_URLS.GALLERY,
            isActive: this.props.section === 'gallery'
        }
    ];

    return (
        <Box
            color='white'
            backgroundColor='black'>
            <Container>
                <Flex
                    justifyContent='space-between'>
                    {isMobile ?
                        <Dropdown>
                            <Dropdown.Trigger
                                lineHeight={1}
                                paddingY={space[4]}
                                fontWeight={700}>
                                {this.props.section === 'gallery' ? 'Gallery' : 'Home'}
                                <Chevron
                                    marginLeft='.5em'
                                    direction='down' />
                            </Dropdown.Trigger>
                            <Dropdown.Menu
                                width='12em'
                                withArrow={true}
                                marginTop={space[1]}
                                paddingY={space[3]}
                                paddingX={space[5]}
                                rounded={8}>
                                {links.map(item =>
                                    <Link
                                        display='block'
                                        href={item.link}
                                        paddingY={space[3]}>
                                        {item.label}
                                    </Link>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                        :
                        <Flex
                            fontWeight={700}
                            marginX={-space[5]}
                            lineHeight={2}>
                            {links.map(item =>
                                <Box
                                    href={item.link}
                                    paddingY={space[4]}
                                    paddingX={space[5]}
                                    color={item.isActive ? colors.white : colors.silver}
                                    hoverColor='white'>
                                    {item.label}
                                </Box>
                            )}
                        </Flex>
                    }
                    <Flex
                        marginX={-(isMobile ? space[4] : space[5])}>
                        <Flex
                            alignItems='center'
                            fontSize={isMobile ? 24 : 28}
                            paddingX={isMobile ? space[4] : space[5]}
                            lineHeight={0}
                            onClick={() =>
                                communityUtils.socialCheckLink(
                                   `https://${Sephora.configurationSettings.communitySiteHost}/t5/notificationfeed/page`,
                                    SOCIAL_PROVIDERS.lithium)
                            }>
                            <IconBell />
                        </Flex>
                        <Dropdown
                            display='flex'
                            isHover={false}>
                            <Dropdown.Trigger
                                display='flex'>
                                <Flex
                                    cursor='pointer'
                                    alignItems='center'
                                    fontSize={isMobile ? 16 : 20}
                                    paddingX={isMobile ? space[4] : space[5]}
                                    lineHeight={0}>
                                    <IconCross />
                                </Flex>
                            </Dropdown.Trigger>
                            <Dropdown.Menu
                                width='17em'
                                fontSize={!isMobile ? 'h3' : null}
                                withArrow={true}
                                arrowPosition={isMobile ? 9 : 19}
                                marginTop={space[1]}
                                right={true}
                                paddingY={space[3]}
                                rounded={8}>
                                <CommunityTopNavActions />
                            </Dropdown.Menu>
                        </Dropdown>
                    </Flex>
                </Flex>
            </Container>
        </Box>
    );
};


// Added by sephora-jsx-loader.js
CommunityTopNav.prototype.path = 'BeautyBoard/CommunityTopNav';
// Added by sephora-jsx-loader.js
Object.assign(CommunityTopNav.prototype, require('./CommunityTopNav.c.js'));
var originalDidMount = CommunityTopNav.prototype.componentDidMount;
CommunityTopNav.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: CommunityTopNav');
if (originalDidMount) originalDidMount.apply(this);
if (CommunityTopNav.prototype.ctrlr) CommunityTopNav.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: CommunityTopNav');
// Added by sephora-jsx-loader.js
CommunityTopNav.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
CommunityTopNav.prototype.class = 'CommunityTopNav';
// Added by sephora-jsx-loader.js
CommunityTopNav.prototype.getInitialState = function() {
    CommunityTopNav.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
CommunityTopNav.prototype.render = wrapComponentRender(CommunityTopNav.prototype.render);
// Added by sephora-jsx-loader.js
var CommunityTopNavClass = React.createClass(CommunityTopNav.prototype);
// Added by sephora-jsx-loader.js
CommunityTopNavClass.prototype.classRef = CommunityTopNavClass;
// Added by sephora-jsx-loader.js
Object.assign(CommunityTopNavClass, CommunityTopNav);
// Added by sephora-jsx-loader.js
module.exports = CommunityTopNavClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BeautyBoard/CommunityTopNav/CommunityTopNav.jsx