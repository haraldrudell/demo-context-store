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
    Sephora.Util.InflatorComps.Comps['BeautyBoardGalleryNavigation'] = function BeautyBoardGalleryNavigation(){
        return BeautyBoardGalleryNavigationClass;
    }
}
const { space } = require('style');
const { Box, Flex, Text } = require('components/display');
const Link = require('components/Link/Link');
const Container = require('components/Container/Container');
const IconCameraOutline = require('components/Icon/IconCameraOutline');
const Divider = require('components/Divider/Divider');
const communityUtils = require('utils/Community');
const SOCIAL_PROVIDERS = communityUtils.PROVIDER_TYPES;
const COMMUNITY_URLS = communityUtils.COMMUNITY_URLS;

function BeautyBoardGalleryNavigation() {}

BeautyBoardGalleryNavigation.prototype.render = function () {
    return (
        <Box
            _css={Sephora.isMobile() ? {
                boxShadow: '0 6px 4px 0 rgba(156,156,156,0.09)'
            } : {
                marginTop: space[2]
            }}>
            <Container>
                <Flex
                    alignItems='center'
                    justifyContent='space-between'
                    fontSize='h3'
                    lineHeight={2}
                    marginX={-space[4]}>
                    <Link
                        href={COMMUNITY_URLS.GALLERY}
                        padding={space[4]}>
                        All Looks
                    </Link>
                    <Box
                        height='1em'
                        width='1px'
                        backgroundColor='moonGray' />
                    <Link
                        fontWeight={700}
                        padding={space[4]}>
                        My Looks
                    </Link>
                    <Link
                        marginLeft='auto'
                        fontWeight={700}
                        padding={space[4]}
                        onClick={() =>
                            communityUtils.socialCheckLink(
                                COMMUNITY_URLS.ADD_PHOTO,
                                SOCIAL_PROVIDERS.olapic)
                        }>
                        <IconCameraOutline
                            fontSize='1.25em'/>
                        {Sephora.isDesktop() &&
                            <Text
                                marginLeft='.75em'>
                                Add a Look
                            </Text>
                        }
                    </Link>
                </Flex>
                {Sephora.isDesktop() &&
                    <Divider />
                }
            </Container>
        </Box>
    );
};


// Added by sephora-jsx-loader.js
BeautyBoardGalleryNavigation.prototype.path = 'BeautyBoard/BeautyBoardGalleryNavigation';
// Added by sephora-jsx-loader.js
BeautyBoardGalleryNavigation.prototype.class = 'BeautyBoardGalleryNavigation';
// Added by sephora-jsx-loader.js
BeautyBoardGalleryNavigation.prototype.getInitialState = function() {
    BeautyBoardGalleryNavigation.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BeautyBoardGalleryNavigation.prototype.render = wrapComponentRender(BeautyBoardGalleryNavigation.prototype.render);
// Added by sephora-jsx-loader.js
var BeautyBoardGalleryNavigationClass = React.createClass(BeautyBoardGalleryNavigation.prototype);
// Added by sephora-jsx-loader.js
BeautyBoardGalleryNavigationClass.prototype.classRef = BeautyBoardGalleryNavigationClass;
// Added by sephora-jsx-loader.js
Object.assign(BeautyBoardGalleryNavigationClass, BeautyBoardGalleryNavigation);
// Added by sephora-jsx-loader.js
module.exports = BeautyBoardGalleryNavigationClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BeautyBoard/BeautyBoardGalleryNavigation/BeautyBoardGalleryNavigation.jsx