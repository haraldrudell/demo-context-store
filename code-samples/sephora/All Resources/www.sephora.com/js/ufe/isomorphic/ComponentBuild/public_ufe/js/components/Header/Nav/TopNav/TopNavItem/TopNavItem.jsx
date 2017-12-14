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
    Sephora.Util.InflatorComps.Comps['TopNavItem'] = function TopNavItem(){
        return TopNavItemClass;
    }
}
const { colors, dropdown, space, zIndex } = require('style');
const { Box, Flex, Image, Text } = require('components/display');
const UrlUtils = require('utils/Url');

const Dropdown = require('components/Dropdown/Dropdown');

const TopNavItem = function () { };

TopNavItem.prototype.isOpen = function () {
    return this.props.currentMenu === this.props.index;
};

TopNavItem.prototype.closeFlyout = function () {
    if (this.isOpen() && this.props.isStatic) {
        this.props.toggleFlyout();
        this.props.clearCategories();
    }
};

TopNavItem.prototype.render = function () {
    let {
        trackNavClick,
        title,
        currentMenu,
        targetUrl,
        isCats,
        isStatic,
        children,
        catNavWidth,
        tabHeight
    } = this.props;

    const isOpen = this.isOpen();
    const isTablet = Sephora.isTouch && Sephora.isDesktop();
    const hasTargetUrl = !Sephora.isTouch && targetUrl;
    const closedIndex = isTablet && currentMenu ? zIndex.DROPDOWN + 2 : null;
    const isGifts = title === 'Gifts';

    return (
        <Box
            boxShadow={isOpen ? dropdown.SHADOW : null}
            lineHeight={2}>
            <Dropdown
                isStatic={isStatic}
                isHover={true}
                delayedHover={true}
                hasSubmenu={true}
                syncState={isOpen}
                onTrigger={(e) => {
                    if (isCats && isOpen) {
                        return;
                    }

                    this.props.setMenu(e, this.props.index);
                }}>

                <Dropdown.Trigger>
                    <Flex
                        alignItems='flex-end'
                        href={hasTargetUrl ? UrlUtils.getLink(targetUrl) : null}
                        fontWeight={isCats ? 700 : null}
                        paddingX={space[5]}
                        letterSpacing={1}
                        textTransform='uppercase'
                        cursor={hasTargetUrl ? 'pointer' : 'default'}
                        height={tabHeight}
                        position='relative'
                        zIndex={isOpen ? zIndex.DROPDOWN + 1 : closedIndex}
                        onClick={() => {
                            trackNavClick(['top nav', title]);
                            if (isTablet && isOpen) {
                                this.props.setMenu(null, this.props.index);
                            }
                        }}

                        onMouseEnter={isCats ? this.closeFlyout : null}>
                        {/* cover dropdown box shadow */}
                        <Box
                            display={!isOpen ? 'none' : null}
                            position='absolute'
                            right={0} bottom={0} left={0}
                            backgroundColor='white'
                            height={5} />
                        <Box
                            paddingX={space[2]}
                            paddingBottom={space[2]}
                            position='relative'
                            borderBottom={2}
                            borderColor={isOpen ? colors.black : 'transparent'}>
                            {isGifts &&
                                <Image
                                    disableLazyLoad={true}
                                    display={isOpen ? 'none' : null}
                                    position='absolute'
                                    maxWidth='none'
                                    width='108%' height={29}
                                    top={-5} left={0}
                                    src='/img/ufe/bg-nav-gifts.jpg' />
                            }
                            {isGifts ?
                                <Text
                                    position='relative'
                                    fontWeight={500}
                                    color={isOpen ? 'red' : 'white'}>
                                    {title}
                                </Text>
                            : title}
                        </Box>
                    </Flex>
                </Dropdown.Trigger>
                <Dropdown.Menu
                    minWidth={isCats ? catNavWidth : null}>
                    {children ? children : null}
                </Dropdown.Menu>
            </Dropdown>
        </Box>
    );
};


// Added by sephora-jsx-loader.js
TopNavItem.prototype.path = 'Header/Nav/TopNav/TopNavItem';
// Added by sephora-jsx-loader.js
TopNavItem.prototype.class = 'TopNavItem';
// Added by sephora-jsx-loader.js
TopNavItem.prototype.getInitialState = function() {
    TopNavItem.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
TopNavItem.prototype.render = wrapComponentRender(TopNavItem.prototype.render);
// Added by sephora-jsx-loader.js
var TopNavItemClass = React.createClass(TopNavItem.prototype);
// Added by sephora-jsx-loader.js
TopNavItemClass.prototype.classRef = TopNavItemClass;
// Added by sephora-jsx-loader.js
Object.assign(TopNavItemClass, TopNavItem);
// Added by sephora-jsx-loader.js
module.exports = TopNavItemClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/TopNav/TopNavItem/TopNavItem.jsx