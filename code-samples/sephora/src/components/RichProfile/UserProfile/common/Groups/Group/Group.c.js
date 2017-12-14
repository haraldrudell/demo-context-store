// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Group = function () {};

// Added by sephora-jsx-loader.js
Group.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const lithiumApi = require('services/api/thirdparty/Lithium');
const store = require('Store');
const profileActions = require('actions/ProfileActions');
const showSocialRegistrationModal = profileActions.showSocialRegistrationModal;
const userUtils = require('utils/User');

Group.prototype.ctrlr = function () {};

Group.prototype.joinGroupHandler = function () {
    let isGroupMember = this.state.isGroupMember !== null ?
        this.state.isGroupMember :
        this.props.isGroupMember;

    this.joinOrLeaveGroup(this.props.group.id, isGroupMember);
};

Group.prototype.joinOrLeaveGroup = function (groupId, isGroupMember) {
    let groupAction = isGroupMember ? 'remove' : 'add';
    let previousFollowersCount = this.state.groupFollowers ? this.state.groupFollowers :
        this.props.group.followers;
    lithiumApi.joinOrLeaveGroup(groupId, groupAction).then(resp => {
        this.setState({
            isGroupMember: !isGroupMember,
            groupFollowers: isGroupMember ? previousFollowersCount - 1 : previousFollowersCount + 1
        });
    });
};


// Added by sephora-jsx-loader.js
module.exports = Group.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/UserProfile/common/Groups/Group/Group.c.js