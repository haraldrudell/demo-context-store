// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var AboutMeSlideshow = function () {};

// Added by sephora-jsx-loader.js
AboutMeSlideshow.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const ProfileActions = require('actions/ProfileActions');
const watch = require('redux-watch');
const processEvent = require('analytics/processEvent');
const analyticsConsts = require('analytics/constants');
const communityUtils = require('utils/Community');
const userUtils = require('utils/User');

AboutMeSlideshow.prototype.ctrlr = function () {
    if (this.props.isPrivate && !this.props.nickname) {
        let nicknameWatch = watch(store.getState, 'user.nickName');
        store.subscribe(nicknameWatch(newNickname => {
            this.setState({ nickname: newNickname });
            nicknameWatch();
        }));
    }
};

AboutMeSlideshow.prototype.handleOpenEditMyProfileClick = function () {
    communityUtils.ensureUserIsReadyForSocialAction(
            communityUtils.PROVIDER_TYPES.lithium).
        then(() => {
            this.openEditMyProfileModal();
        }).catch(reason => {
            if (userUtils.isBI() || userUtils.isSocial()) {
                this.openEditMyProfileModal();
            }
        });
};

AboutMeSlideshow.prototype.openEditMyProfileModal = function () {
    store.dispatch(ProfileActions.showEditMyProfileModal(true));

    //Analytics
    processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, {
        data: {
            linkName: 'cmnty:my profile:edit',
            actionInfo: 'cmnty:my profile:edit',
            eventStrings: [analyticsConsts.Event.EVENT_71],
            usePreviousPageName: true
        }
    });
};


// Added by sephora-jsx-loader.js
module.exports = AboutMeSlideshow.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/UserProfile/common/AboutMeSlideshow/AboutMeSlideshow.c.js