// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var RecentBankActivity = function () {};

// Added by sephora-jsx-loader.js
RecentBankActivity.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const getAccountHistorySlice = require('actions/ProfileActions').getAccountHistorySlice;
const NUMBER_OF_ACTIVITIES = 5;

RecentBankActivity.prototype.ctrlr = function () {
    const profileId = this.props.user.profileId;

    if (profileId) {
        // The API does not offer a property to know if there are next pages,
        // so we have to get NUMBER_OF_ACTIVITIES + 1 to know if there are next pages
        store.dispatch(getAccountHistorySlice(profileId, 0, NUMBER_OF_ACTIVITIES + 1));
    }

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


// Added by sephora-jsx-loader.js
module.exports = RecentBankActivity.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/BeautyInsider/MyBeautyInsider/PointsNSpendBank/RecentBankActivity/RecentBankActivity.c.js