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
    Sephora.Util.InflatorComps.Comps['CommunityError'] = function CommunityError(){
        return CommunityErrorClass;
    }
}
const { colors, space } = require('style');
const css = require('glamor').css;
const { Box, Text } = require('components/display');
const Container = require('components/Container/Container');
const ButtonPrimary = require('components/Button/ButtonPrimary');

const CommunityError = function () {};

CommunityError.prototype.render = function () {
    const isMobile = Sephora.isMobile();
    css.global('[data-layout-main]', { backgroundColor: colors.nearWhite });
    return (
        <Container
            paddingY={isMobile ? space[4] : space[6]}>
            <Box
                backgroundColor='white'
                padding={isMobile ? space[4] : space[7]}
                textAlign='center'
                boxShadow='0 0 5px 0 rgba(0,0,0,.15)'>
                <Text
                    is='h1'
                    lineHeight={2}
                    fontSize={isMobile ? 'h2' : 'h1'}
                    marginBottom={space[5]}
                    fontWeight={700}>
                    This page is not currently available. Please try again later.
                </Text>
                <ButtonPrimary
                    block={isMobile}
                    size={!isMobile ? 'lg' : null}
                    href='/'>
                    Continue Shopping
                </ButtonPrimary>
            </Box>
        </Container>
    );
};


// Added by sephora-jsx-loader.js
CommunityError.prototype.path = 'RichProfile/CommunityError';
// Added by sephora-jsx-loader.js
CommunityError.prototype.class = 'CommunityError';
// Added by sephora-jsx-loader.js
CommunityError.prototype.getInitialState = function() {
    CommunityError.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
CommunityError.prototype.render = wrapComponentRender(CommunityError.prototype.render);
// Added by sephora-jsx-loader.js
var CommunityErrorClass = React.createClass(CommunityError.prototype);
// Added by sephora-jsx-loader.js
CommunityErrorClass.prototype.classRef = CommunityErrorClass;
// Added by sephora-jsx-loader.js
Object.assign(CommunityErrorClass, CommunityError);
// Added by sephora-jsx-loader.js
module.exports = CommunityErrorClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/CommunityError/CommunityError.jsx