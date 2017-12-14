// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var UserProfile = function () {};

// Added by sephora-jsx-loader.js
UserProfile.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const profileApi = require('services/api/profile');
const auth = require('utils/Authentication');
const watch = require('redux-watch');
const store = require('Store');
const communityUtils = require('utils/Community');
const urlUtils = require('utils/Url');

UserProfile.prototype.ctrlr = function () {
    let isPrivate = window.location.pathname === '/profile/me';
    if (isPrivate) {
        //checking query params for logging in /registering from community.sephora.com
        //if query param launchSocialSignInFlow is present, force socialSignInFlow
        //if query param launchSocialRegisterFlow is present, force socialRegisterFlow
        //whether flows are a success or not, redirect to redirectUrl available in params
        //if params aren't available proceed as normal with rendering of private profile
        let params = urlUtils.getParams();
        if (params.launchSocialSignInFlow && params.provider && params.nextpage) {

            //setting state to add TW widget to page and make TW scripts available
            this.setState({
                isTokyWokySignIn: true
            });
            communityUtils.launchSocialSignInFlow().then(() => {
                urlUtils.redirectTo(params.nextpage[0]);
            }).catch(() => {
                urlUtils.redirectTo(params.nextpage[0]);
            });
        } else if (params.launchSocialRegisterFlow && params.provider && params.nextpage) {

            //setting state to add TW widget to page and make TW scripts available
            this.setState({
                isTokyWokySignIn: true
            });
            communityUtils.launchSocialRegisterFlow().then(() => {
                urlUtils.redirectTo(params.nextpage[0]);
            }).catch(() => {
                urlUtils.redirectTo(params.nextpage[0]);
            });
        } else {
            this.setState({
                isPrivate,
                showPleaseSignInBlock: false
            });

            //Analytics
            digitalData.page.category.pageType = 'cmnty profile';
            digitalData.page.pageInfo.pageName = 'my-profile';
        }
    } else {
        let nickname = UserProfile.getUserNicknameFromPrivateProfilePath(
                window.location.pathname);

        UserProfile.checkIfUserExists(nickname).then(() => {
            this.setState({
                isPrivate,
                userNickname: nickname,
                userExists: true,
                showPleaseSignInBlock: false
            });
        }).catch((r) => {
            // There can be other reasons that we may have to handle.
            // However, `false` is an explicit reason for when the nickname
            // does not exist.
            if (r === false) {
                this.setState({
                    isPrivate,
                    userNickname: nickname,
                    userExists: false,
                    showPleaseSignInBlock: false
                });
            }
        });
    }
};

UserProfile.checkIfUserExists = function (nickname) {
    return new Promise((yes, no) => {
        profileApi.getProfileIdentifiersByNickname(nickname).
            then(yes).
            catch(data => data.errorCode === -2 && no(false));
    });
};

UserProfile.getUserNicknameFromPrivateProfilePath = function (path) {
    let m = path.match(/^\/users\/([^\/]+)/);
    return m && m[1];
};

UserProfile.prototype.setError = function () {
    this.setState({
        isError: true
    });
};


// Added by sephora-jsx-loader.js
module.exports = UserProfile.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/UserProfile/UserProfile.c.js