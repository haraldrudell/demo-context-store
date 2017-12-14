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
    Sephora.Util.InflatorComps.Comps['UserProfile'] = function UserProfile(){
        return UserProfileClass;
    }
}
const PublicProfile = require('./PublicProfile/PublicProfile');
const PrivateProfile = require('./PrivateProfile/PrivateProfile');
const CommunityError = require('../CommunityError/CommunityError');
const PleaseSignInProfileBlock = require('components/RichProfile/UserProfile/PleaseSignInProfile');
const TokyWoky = require('components/TokyWoky/TokyWoky');

const UserProfile = function () {
    this.state = {
        isPrivate: null,
        userNickname: null,
        userExists: null,
        isError: false,
        showPleaseSignInBlock: false,
        isTokyWokySignIn: null
    };
};

UserProfile.prototype.render = function () {
    if (Sephora.isRootRender) {
        return null;

    } else {
        if (this.state.isError) {
            return <CommunityError />;

        } else if (this.state.showPleaseSignInBlock) {
            return <PleaseSignInProfileBlock />;

        } else if (this.state.isPrivate) {
            return <PrivateProfile handleError={this.setError} />;

        } else if (this.state.userNickname) {
            if (this.state.userExists) {
                return <PublicProfile
                            nickname={this.state.userNickname}
                            handleError={this.setError} />;

            } else {
                return <CommunityError />;
            }

        } else if (this.state.isTokyWokySignIn) {
            return (
                <div style={{ visibility: 'hidden' }}>
                    <TokyWoky isCommunitySignIn={true} />
                </div>
            );
        } else {
            return null;
        }
    }
};


// Added by sephora-jsx-loader.js
UserProfile.prototype.path = 'RichProfile/UserProfile';
// Added by sephora-jsx-loader.js
Object.assign(UserProfile.prototype, require('./UserProfile.c.js'));
var originalDidMount = UserProfile.prototype.componentDidMount;
UserProfile.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: UserProfile');
if (originalDidMount) originalDidMount.apply(this);
if (UserProfile.prototype.ctrlr) UserProfile.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: UserProfile');
// Added by sephora-jsx-loader.js
UserProfile.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
UserProfile.prototype.class = 'UserProfile';
// Added by sephora-jsx-loader.js
UserProfile.prototype.getInitialState = function() {
    UserProfile.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
UserProfile.prototype.render = wrapComponentRender(UserProfile.prototype.render);
// Added by sephora-jsx-loader.js
var UserProfileClass = React.createClass(UserProfile.prototype);
// Added by sephora-jsx-loader.js
UserProfileClass.prototype.classRef = UserProfileClass;
// Added by sephora-jsx-loader.js
Object.assign(UserProfileClass, UserProfile);
// Added by sephora-jsx-loader.js
module.exports = UserProfileClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/UserProfile/UserProfile.jsx