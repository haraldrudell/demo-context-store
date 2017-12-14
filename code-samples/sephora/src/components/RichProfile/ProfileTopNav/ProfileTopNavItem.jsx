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
    Sephora.Util.InflatorComps.Comps['ProfileTopNavItem'] = function ProfileTopNavItem(){
        return ProfileTopNavItemClass;
    }
}
const { colors, space } = require('style');
const { Box } = require('components/display');

const ProfileTopNavItem = function () { };

ProfileTopNavItem.prototype.render = function () {
    const {
        active,
        ...props
    } = this.props;

    return (
        <Box
            {...props}
            paddingY={Sephora.isMobile() ? space[3] : space[4]}
            paddingX={Sephora.isMobile() ? space[2] : space[5]}
            color={active ? colors.white : colors.silver}
            hoverColor='white' />
    );

};


// Added by sephora-jsx-loader.js
ProfileTopNavItem.prototype.path = 'RichProfile/ProfileTopNav';
// Added by sephora-jsx-loader.js
ProfileTopNavItem.prototype.class = 'ProfileTopNavItem';
// Added by sephora-jsx-loader.js
ProfileTopNavItem.prototype.getInitialState = function() {
    ProfileTopNavItem.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ProfileTopNavItem.prototype.render = wrapComponentRender(ProfileTopNavItem.prototype.render);
// Added by sephora-jsx-loader.js
var ProfileTopNavItemClass = React.createClass(ProfileTopNavItem.prototype);
// Added by sephora-jsx-loader.js
ProfileTopNavItemClass.prototype.classRef = ProfileTopNavItemClass;
// Added by sephora-jsx-loader.js
Object.assign(ProfileTopNavItemClass, ProfileTopNavItem);
// Added by sephora-jsx-loader.js
module.exports = ProfileTopNavItemClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/ProfileTopNav/ProfileTopNavItem.jsx