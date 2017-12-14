// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var RewardsCallToAction = function () {};

// Added by sephora-jsx-loader.js
RewardsCallToAction.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('store/Store');
const watch = require('redux-watch');
const fetchProfileRewards = require('actions/RewardActions').fetchProfileRewards;
const userUtils = require('utils/User');
const showRewardModal = require('Actions').showRewardModal;
const showBiRegisterModal = require('Actions').showBiRegisterModal;
const basketUtils = require('utils/Basket');
const processEvent = require('analytics/processEvent');
const auth = require('utils/Authentication');
const anaConsts = require('analytics/constants');

RewardsCallToAction.prototype.ctrlr = function () {
    let basket = store.getState().basket;
    let isRewardInBasket = basket => Array.isArray(basket.rewards) && basket.rewards.length > 0;
    this.setState({
        isLoggedIn: !userUtils.isAnonymous(),
        isBI: userUtils.isBI(),
        biPoints: basketUtils.getAvailableBiPoints(),
        basketItemCount: basket.itemCount,
        isRewardInBasket: isRewardInBasket(basket),
        signInHandlerTriggered: false
    });

    let watchUser = watch(store.getState, 'user');
    store.subscribe(watchUser(() => {
        this.setState({
            isLoggedIn: !userUtils.isAnonymous(),
            isBI: userUtils.isBI()
        });
    }));

    let watchBasket = watch(store.getState, 'basket');
    store.subscribe(watchBasket((newBasket) => {
        this.setState({
            biPoints: basketUtils.getAvailableBiPoints(),
            basketItemCount: newBasket.itemCount,
            isRewardInBasket: isRewardInBasket(newBasket)
        });
    }));
};

/**
 * handles signInHandlerTriggered to make sure current component state is up to date
 * when we react to a sign in
 */
RewardsCallToAction.prototype.componentDidUpdate = function () {
    if (this.state.signInHandlerTriggered) {
        this.setState({
            signInHandlerTriggered: false
        });

        if (this.state.isBI) {
            this.openRewards();
        } else {
            this.openBiRegister();
        }
    }
};

RewardsCallToAction.prototype.componentWillReceiveProps = function (updatedProps) {

    if (updatedProps.isShowRewards) {
        this.openRewards();
    }
};

RewardsCallToAction.prototype.getRewards = function () {

    let rewards = store.getState().rewards;

    if (!!rewards) {
        store.dispatch(fetchProfileRewards());
    }
};

RewardsCallToAction.prototype.openRewards = function () {

    if (Sephora.isMobile()) {
        store.dispatch(showRewardModal(true));

        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                eventStrings: [anaConsts.Event.EVENT_71],
                linkName: anaConsts.LinkData.SELECT_REWARDS,
                actionInfo: anaConsts.LinkData.SELECT_REWARDS
            }
        });
    } else {
        this.getRewards();
    }

};

RewardsCallToAction.prototype.openBiRegister = function () {
    store.dispatch(showBiRegisterModal(true));
};

RewardsCallToAction.prototype.signInHandler = function (e) {
    e.stopPropagation();

    auth.requireAuthentication(null, null, null).then(()=> {
        this.setState({
            signInHandlerTriggered: true
        });
    });
};


// Added by sephora-jsx-loader.js
module.exports = RewardsCallToAction.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/Rewards/RewardsCallToAction/RewardsCallToAction.c.js