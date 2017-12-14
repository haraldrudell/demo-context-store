// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var AllBankActivity = function () {};

// Added by sephora-jsx-loader.js
AllBankActivity.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const getAccountHistorySlice = require('actions/ProfileActions').getAccountHistorySlice;
const NUMBER_OF_ACTIVITIES = 10;

AllBankActivity.prototype.ctrlr = function () {
    this.getAccountHistorySlice();

    store.setAndWatch('profile.accountHistorySlice', null, data => {
        const activities = data.accountHistorySlice && data.accountHistorySlice.activities;

        if (activities && activities.length) {
            const activitiesToDisplay = activities.slice(0, NUMBER_OF_ACTIVITIES);

            this.setState({
                activities: this.state.activities.concat(activitiesToDisplay),
                shouldShowMore: activities.length > NUMBER_OF_ACTIVITIES
            });
        }
    });
};

AllBankActivity.prototype.getAccountHistorySlice = function () {
    const profileId = this.props.user.profileId;

    if (profileId) {
        // The API does not offer a property to know if there are next pages,
        // so we have to get NUMBER_OF_ACTIVITIES + 1 to know if there are next pages
        store.dispatch(
            getAccountHistorySlice(profileId, this.state.offset, NUMBER_OF_ACTIVITIES + 1)
        );
    }
};

AllBankActivity.prototype.showMoreActivities = function (e) {
    e.preventDefault();

    this.setState({
        offset: this.state.offset + NUMBER_OF_ACTIVITIES
    }, () => {
        this.getAccountHistorySlice();
    });
};


// Added by sephora-jsx-loader.js
module.exports = AllBankActivity.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/BeautyInsider/MyBeautyInsider/PointsNSpendBank/AllBankActivity/AllBankActivity.c.js