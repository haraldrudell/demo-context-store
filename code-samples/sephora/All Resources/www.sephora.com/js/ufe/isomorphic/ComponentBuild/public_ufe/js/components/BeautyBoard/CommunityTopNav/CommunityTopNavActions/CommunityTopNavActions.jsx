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
    Sephora.Util.InflatorComps.Comps['CommunityTopNavActions'] = function CommunityTopNavActions(){
        return CommunityTopNavActionsClass;
    }
}
/* eslint-disable max-len */
const space = require('style').space;
const Link = require('components/Link/Link');
const IconWrite = require('components/Icon/IconWrite');
const IconCameraOutline = require('components/Icon/IconCameraOutline');
const IconGroups = require('components/Icon/IconGroups');
const communityUtils = require('utils/Community');
const SOCIAL_PROVIDERS = communityUtils.PROVIDER_TYPES;
const COMMUNITY_URLS = communityUtils.COMMUNITY_URLS;

const CommunityTopNavActions = function () {
    this.state = {};
};

CommunityTopNavActions.prototype.render = function () {
    const linkStyle = {
        paddingTop: space[3],
        paddingRight: space[5],
        paddingBottom: space[3],
        paddingLeft: space[5]
    };
    return (
        <div>
            <Link
                display='block'
                _css={linkStyle}
                href={`${COMMUNITY_URLS.GROUPS}`}>
                <IconGroups
                    fontSize='1.25em'
                    marginRight='.75em' />
                Join a Group
            </Link>
            <Link
                display='block'
                _css={linkStyle}
                onClick={() =>
                    communityUtils.socialCheckLink(
                        `https://${Sephora.configurationSettings.communitySiteHost}/t5/forums/postpage/choose-node/true/interaction-style/forum`,
                        SOCIAL_PROVIDERS.lithium)
                }>
                <IconWrite
                    fontSize='1.25em'
                    marginRight='.75em' />
                Start a Conversation
            </Link>
            <Link
                display='block'
                _css={linkStyle}
                onClick={() =>
                    communityUtils.socialCheckLink(
                        COMMUNITY_URLS.ADD_PHOTO,
                        SOCIAL_PROVIDERS.olapic)
                }>
                <IconCameraOutline
                    fontSize='1.25em'
                    marginRight='.75em' />
                Add Photo/Video
            </Link>
        </div>
    );
};


// Added by sephora-jsx-loader.js
CommunityTopNavActions.prototype.path = 'BeautyBoard/CommunityTopNav/CommunityTopNavActions';
// Added by sephora-jsx-loader.js
CommunityTopNavActions.prototype.class = 'CommunityTopNavActions';
// Added by sephora-jsx-loader.js
CommunityTopNavActions.prototype.getInitialState = function() {
    CommunityTopNavActions.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
CommunityTopNavActions.prototype.render = wrapComponentRender(CommunityTopNavActions.prototype.render);
// Added by sephora-jsx-loader.js
var CommunityTopNavActionsClass = React.createClass(CommunityTopNavActions.prototype);
// Added by sephora-jsx-loader.js
CommunityTopNavActionsClass.prototype.classRef = CommunityTopNavActionsClass;
// Added by sephora-jsx-loader.js
Object.assign(CommunityTopNavActionsClass, CommunityTopNavActions);
// Added by sephora-jsx-loader.js
module.exports = CommunityTopNavActionsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BeautyBoard/CommunityTopNav/CommunityTopNavActions/CommunityTopNavActions.jsx