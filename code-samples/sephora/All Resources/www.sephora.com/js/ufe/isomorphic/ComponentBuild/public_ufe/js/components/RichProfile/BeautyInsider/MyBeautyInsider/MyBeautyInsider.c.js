// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var MyBeautyInsider = function () {};

// Added by sephora-jsx-loader.js
MyBeautyInsider.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const ProfileActions = require('actions/ProfileActions');
const cmsApi = require('services/api/cms');
const dateUtils = require('utils/Date');
const DAYS_BEFORE_AFTER_BIRTH_DATE = 14;
const BI_BCC_REGIONS_MEDIA_ID = '43900052';

MyBeautyInsider.prototype.ctrlr = function () {
    cmsApi.getMediaContent(BI_BCC_REGIONS_MEDIA_ID).then(data => {
        this.setState({
            centerContent: data.regions.content,
            rightContent: data.regions.right,
            leftContent: data.regions.left
        });
    });
};

MyBeautyInsider.prototype.checkBirthDay = function () {
    let userBI = this.props.user.beautyInsiderAccount;
    if (userBI.birthDay) {
        let now = new Date();
        let userDate = new Date(`${userBI.birthMonth}/${userBI.birthDay}/${now.getFullYear()}`)
            .setHours(0, 0, 0, 0);
        let twoWeeksAfterNow = dateUtils.addRemoveDays(true, now, DAYS_BEFORE_AFTER_BIRTH_DATE);
        let twoWeeksBeforeNow = dateUtils.addRemoveDays(false, now, DAYS_BEFORE_AFTER_BIRTH_DATE);
        if (userDate >= twoWeeksBeforeNow && userDate <= twoWeeksAfterNow) {
            return true;
        }
    }
    return false;
};

MyBeautyInsider.prototype.openEditMyProfileModal = function () {
    store.dispatch(ProfileActions.showEditMyProfileModal(true));
};


// Added by sephora-jsx-loader.js
module.exports = MyBeautyInsider.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/BeautyInsider/MyBeautyInsider/MyBeautyInsider.c.js