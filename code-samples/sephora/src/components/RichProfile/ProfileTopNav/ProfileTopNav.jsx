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
    Sephora.Util.InflatorComps.Comps['ProfileTopNav'] = function ProfileTopNav(){
        return ProfileTopNavClass;
    }
}
const { fontSizes, lineHeights, space } = require('style');
const { Box, Flex } = require('components/display');
const Container = require('components/Container/Container');
const ProfileTopNavItem = require('./ProfileTopNavItem');

const ProfileTopNav = function () { };

ProfileTopNav.prototype.render = function () {
    const {
        section
    } = this.props;

    return (
        <Box
            backgroundColor='black'>
            <Container>
                <Flex
                    fontWeight={700}
                    _css={Sephora.isMobile() ? {
                        fontSize: fontSizes.h5,
                        justifyContent: 'space-between'
                    } : {
                        fontSize: fontSizes.h4,
                        marginLeft: -space[5],
                        marginRight: -space[5],
                        lineHeight: lineHeights[2]
                    }}>
                    <ProfileTopNavItem
                        href='/profile/me'
                        active={section === 'profile'}>
                        Profile
                    </ProfileTopNavItem>
                    <ProfileTopNavItem
                        href='/profile/BeautyInsider'
                        active={section === 'bi'}>
                        Beauty Insider
                    </ProfileTopNavItem>
                    <ProfileTopNavItem
                        href='/profile/Lists'
                        active={section === 'lists'}>
                        Lists
                    </ProfileTopNavItem>
                    <ProfileTopNavItem
                        href='/profile/MyAccount'
                        active={section === 'account'}>
                        Account
                    </ProfileTopNavItem>
                </Flex>
            </Container>
        </Box>
    );
};


// Added by sephora-jsx-loader.js
ProfileTopNav.prototype.path = 'RichProfile/ProfileTopNav';
// Added by sephora-jsx-loader.js
ProfileTopNav.prototype.class = 'ProfileTopNav';
// Added by sephora-jsx-loader.js
ProfileTopNav.prototype.getInitialState = function() {
    ProfileTopNav.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ProfileTopNav.prototype.render = wrapComponentRender(ProfileTopNav.prototype.render);
// Added by sephora-jsx-loader.js
var ProfileTopNavClass = React.createClass(ProfileTopNav.prototype);
// Added by sephora-jsx-loader.js
ProfileTopNavClass.prototype.classRef = ProfileTopNavClass;
// Added by sephora-jsx-loader.js
Object.assign(ProfileTopNavClass, ProfileTopNav);
// Added by sephora-jsx-loader.js
module.exports = ProfileTopNavClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/ProfileTopNav/ProfileTopNav.jsx