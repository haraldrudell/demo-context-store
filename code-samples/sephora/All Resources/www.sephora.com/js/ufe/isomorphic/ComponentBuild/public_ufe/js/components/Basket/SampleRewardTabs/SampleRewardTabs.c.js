// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var SampleRewardTabs = function () {};

// Added by sephora-jsx-loader.js
SampleRewardTabs.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const watch = require('redux-watch');
const userUtils = require('utils/User');
const processEvent = require('analytics/processEvent');
const anaConsts = require('analytics/constants');

SampleRewardTabs.prototype.ctrlr = function () {
    let watchRewards = watch(store.getState, 'rewards');
};

SampleRewardTabs.prototype.toggleSamples = function () {
    this.setState({
        isShowSamples: !this.state.isShowSamples,
        isShowRewards: false
    }, () => {
        if (this.state.isShowSamples) {
            processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    eventStrings: [anaConsts.Event.EVENT_71],
                    linkName: anaConsts.LinkData.SELECT_SAMPLES,
                    actionInfo: anaConsts.LinkData.SELECT_SAMPLES
                }
            });
        }
    });
};

SampleRewardTabs.prototype.toggleRewards = function () {
    if (userUtils.isBI()) {
        this.setState({
            isShowRewards: !this.state.isShowRewards,
            isShowSamples: false
        }, () => {
            if (this.state.isShowRewards) {
                processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                    data: {
                        eventStrings: [anaConsts.Event.EVENT_71],
                        linkName: anaConsts.LinkData.SELECT_REWARDS,
                        actionInfo: anaConsts.LinkData.SELECT_REWARDS
                    }
                });
            }
        });
    }
};


// Added by sephora-jsx-loader.js
module.exports = SampleRewardTabs.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/SampleRewardTabs/SampleRewardTabs.c.js