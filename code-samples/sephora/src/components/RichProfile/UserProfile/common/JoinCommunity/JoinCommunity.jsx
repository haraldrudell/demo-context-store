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
    Sephora.Util.InflatorComps.Comps['JoinCommunity'] = function JoinCommunity(){
        return JoinCommunityClass;
    }
}
const { space } = require('style');
const { Box, Image, Text } = require('components/display');
const Link = require('components/Link/Link');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const SectionContainer = require('../SectionContainer/SectionContainer');
const communityUtils = require('utils/Community');
const SOCIAL_PROVIDERS = communityUtils.PROVIDER_TYPES;
const COMMUNITY_URLS = communityUtils.COMMUNITY_URLS;

const JoinCommunity = function () {
    this.state = {};
};

JoinCommunity.prototype.render = function () {
    return (
        <SectionContainer>
            <Box
                fontSize={Sephora.isMobile() ? 'h4' : 'h3'}
                padding={Sephora.isMobile() ? space[5] : space[6]}
                textAlign='center'
                border={1}
                borderColor='moonGray'
                rounded={true}>
                <Image
                    display='block'
                    marginX='auto'
                    src='/img/ufe/bi/logo-bi-community.svg'
                    width='20em'
                    marginBottom='1em'
                    alt='Beauty Insider Community' />
                <Text
                    is='p'
                    maxWidth='26em'
                    marginX='auto'>
                    Real people. Real talk. Real time. Find beauty inspiration,
                    ask questions, and get the right recommendations from
                    Beauty Insider members like you. You ready?
                </Text>
                <Box
                    maxWidth='16em'
                    marginX='auto'
                    marginY='1.5em'>
                    <ButtonPrimary
                        size={Sephora.isDesktop() ? 'lg' : null}
                        block={true}
                        onClick={() =>
                            communityUtils.socialCheckLink(
                                COMMUNITY_URLS.LANDING_PAGE,
                                SOCIAL_PROVIDERS.bv)
                        }>
                        Start Now
                    </ButtonPrimary>
                </Box>
                <Link
                    padding={space[3]}
                    margin={-space[3]}
                    arrowDirection='right'
                    href='/community'>
                    Explore the community
                </Link>
            </Box>
        </SectionContainer>
    );
};


// Added by sephora-jsx-loader.js
JoinCommunity.prototype.path = 'RichProfile/UserProfile/common/JoinCommunity';
// Added by sephora-jsx-loader.js
Object.assign(JoinCommunity.prototype, require('./JoinCommunity.c.js'));
var originalDidMount = JoinCommunity.prototype.componentDidMount;
JoinCommunity.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: JoinCommunity');
if (originalDidMount) originalDidMount.apply(this);
if (JoinCommunity.prototype.ctrlr) JoinCommunity.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: JoinCommunity');
// Added by sephora-jsx-loader.js
JoinCommunity.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
JoinCommunity.prototype.class = 'JoinCommunity';
// Added by sephora-jsx-loader.js
JoinCommunity.prototype.getInitialState = function() {
    JoinCommunity.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
JoinCommunity.prototype.render = wrapComponentRender(JoinCommunity.prototype.render);
// Added by sephora-jsx-loader.js
var JoinCommunityClass = React.createClass(JoinCommunity.prototype);
// Added by sephora-jsx-loader.js
JoinCommunityClass.prototype.classRef = JoinCommunityClass;
// Added by sephora-jsx-loader.js
Object.assign(JoinCommunityClass, JoinCommunity);
// Added by sephora-jsx-loader.js
module.exports = JoinCommunityClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/UserProfile/common/JoinCommunity/JoinCommunity.jsx