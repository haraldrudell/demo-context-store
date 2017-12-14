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
    Sephora.Util.InflatorComps.Comps['SocialIcons'] = function SocialIcons(){
        return SocialIconsClass;
    }
}
const space = require('style').space;
const { Box, Flex } = require('components/display');
const IconFacebook = require('components/Icon/IconFacebook');
const IconTwitter = require('components/Icon/IconTwitter');
const IconInstagram = require('components/Icon/IconInstagram');
const IconYoutube = require('components/Icon/IconYoutube');
const IconPinterest = require('components/Icon/IconPinterest');
const IconGoogle = require('components/Icon/IconGoogle');
const IconTumblr = require('components/Icon/IconTumblr');
const IconWanelo = require('components/Icon/IconWanelo');

const SocialIcons = function () {};

SocialIcons.prototype.render = function () {

    const iconPadding = space[1];

    /* TODO: move links to one place in an utility file as constants and use for href's below */

    return (
        <Flex
            isInline={true}
            marginX={-iconPadding}
            lineHeight={0}
            fontSize='h1'>
            <Box
                href='https://www.facebook.com/sephora/'
                paddingX={iconPadding}>
                <IconFacebook />
            </Box>
            <Box
                href='https://twitter.com/sephora'
                paddingX={iconPadding}>
                <IconTwitter />
            </Box>
            <Box
                href='https://www.instagram.com/sephora/'
                paddingX={iconPadding}>
                <IconInstagram />
            </Box>
            <Box
                href='https://www.youtube.com/user/sephora/tutorials'
                paddingX={iconPadding}>
                <IconYoutube />
            </Box>
            <Box
                href='https://www.pinterest.com/sephora/'
                paddingX={iconPadding}>
                <IconPinterest />
            </Box>
            <Box
                href='https://plus.google.com/+Sephora'
                paddingX={iconPadding}>
                <IconGoogle />
            </Box>
            <Box
                href='https://theglossy.sephora.com/'
                paddingX={iconPadding}>
                <IconTumblr />
            </Box>
            <Box
                href='https://wanelo.com/sephora'
                paddingX={iconPadding}>
                <IconWanelo />
            </Box>
        </Flex>
    );
};


// Added by sephora-jsx-loader.js
SocialIcons.prototype.path = 'Footer/SocialIcons';
// Added by sephora-jsx-loader.js
SocialIcons.prototype.class = 'SocialIcons';
// Added by sephora-jsx-loader.js
SocialIcons.prototype.getInitialState = function() {
    SocialIcons.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
SocialIcons.prototype.render = wrapComponentRender(SocialIcons.prototype.render);
// Added by sephora-jsx-loader.js
var SocialIconsClass = React.createClass(SocialIcons.prototype);
// Added by sephora-jsx-loader.js
SocialIconsClass.prototype.classRef = SocialIconsClass;
// Added by sephora-jsx-loader.js
Object.assign(SocialIconsClass, SocialIcons);
// Added by sephora-jsx-loader.js
module.exports = SocialIconsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Footer/SocialIcons/SocialIcons.jsx