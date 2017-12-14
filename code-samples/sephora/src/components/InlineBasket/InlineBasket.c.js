// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var InlineBasket = function () {};

// Added by sephora-jsx-loader.js
InlineBasket.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('store/Store');
const watch = require('redux-watch');
const ReactDOM = require('react-dom');
const basketActions = require('actions/BasketActions');
const inlineBasketActions = require('actions/InlineBasketActions');
const auth = require('utils/Authentication');
const Location = require('utils/Location');
const userUtils = require('utils/User');
const BasketUtils = require('utils/Basket');
const Events = require('utils/framework/Events');

let el = null;
let cleanErrorTimeOut = null;
let resetNotificationTimeout = null;
let closeTimeOut = null;
let isBasketPage = Location.isBasketPage();
let PAGE_TOP_THRESHOLD = 150;

InlineBasket.prototype.ctrlr = function () {

    let basket = store.getState().basket;
    let watchBasket = watch(store.getState, 'basket');
    let watchIsOpen = watch(store.getState, 'inlineBasket.isOpen');
    let watchUser = watch(store.getState, 'user');
    let watchJustAdded = watch(store.getState, 'inlineBasket.justAddedProducts');

    store.subscribe(watchJustAdded(justAdded => {
        this.handleJustAdded(justAdded);
    }));

    el = ReactDOM.findDOMNode(this);

    this.setState({
        basket: basket,
        isLoggedIn: !userUtils.isAnonymous(),
        renderBasket: Sephora.isDesktop() || !isBasketPage,
        showHover: !Sephora.isThirdPartySite && (location.pathname !== BasketUtils.PAGE_URL)
    });

    window.addEventListener(Events.DebouncedScroll, this.handleScroll);

    store.subscribe(watchUser((user) => {
        this.setState({
            isLoggedIn: !userUtils.isAnonymous()
        });
    }));

    store.subscribe(watchIsOpen((isOpen) => {
        this.toggleOpen(isOpen);
        const timeToCloseBasket = 5000; // milliseconds
        if (closeTimeOut) {
            closeTimeOut = this.clearTimeout(closeTimeOut);
        }

        closeTimeOut =
            setTimeout(() => {
                store.dispatch(inlineBasketActions.showInlineBasket(false));
            }, timeToCloseBasket);
    }));

    store.subscribe(watchBasket((newBasket) => {
        this.updateState(newBasket);
    }));

};

InlineBasket.prototype.signInHandler = function (e) {
    e.stopPropagation();

    //Analytics
    require.ensure([], function (require) {
        let anaUtils = require('analytics/utils');

        let analyticsData = {
            eventStrings: ['event14'],
            navigationInfo: anaUtils.buildNavPath(['top nav', 'basket', 'sign-in'])
        };
    }, 'components');

    auth.requireAuthentication(null, null, analyticsData);
};

InlineBasket.prototype.componentWillUnmount = function () {
    window.removeEventListener(Events.DebouncedScroll, this.handleScroll);
};

InlineBasket.prototype.updateState = function (newBasket) {
    this.setState({
        basket: newBasket,
        fixed: !this.isPositionTop()
    }, () => {

        if (isBasketPage) {
            return;
        }

        if (cleanErrorTimeOut) {
            cleanErrorTimeOut = this.clearTimeout(cleanErrorTimeOut);
        }

        if (this.state.basket.error) {
            let timeToCleanError = 5000;

            cleanErrorTimeOut =
                setTimeout(() => {
                    store.dispatch(basketActions.showError());
                }, timeToCleanError);
        }
    });
};

InlineBasket.prototype.clearTimeout = function (timeout) {
    window.clearTimeout(timeout);
    return null;
};

InlineBasket.prototype.handleJustAdded = function (justAddedCount) {
    const timeToResetJustAddedNotification = 6000;
    this.setState({
        justAddedProducts: justAddedCount
    });
    if (resetNotificationTimeout) {
        resetNotificationTimeout = this.clearTimeout(resetNotificationTimeout);
    }

    if (justAddedCount > 0) {
        resetNotificationTimeout = setTimeout(() => {
            store.dispatch(inlineBasketActions.resetProductsNotification());
        }, timeToResetJustAddedNotification);
    }
};

InlineBasket.prototype.handleScroll = function () {
    let isCurrentlyOnTop = !this.isPositionTop();

    if (this.state.isOpen && this.fixed !== isCurrentlyOnTop) {
        this.setState({
            fixed: isCurrentlyOnTop
        });
    }
};

InlineBasket.prototype.isPositionTop = function () {
    return window.pageYOffset < PAGE_TOP_THRESHOLD;
};

InlineBasket.prototype.onBasketHoverClick = function () {

    if (!this.state.renderBasket) {
        return;
    }

    //Analytics
    require.ensure([], function (require) {
        let anaUtils = require('analytics/utils');

        anaUtils.setNextPageData({
            navigationInfo: anaUtils.buildNavPath(['top nav', 'hover basket', 'basket link'])
        });

    }, 'components');

    location.href = BasketUtils.PAGE_URL;
};

InlineBasket.prototype.onBasketClick = function () {

    //Analytics
    require.ensure([], function (require) {
        let anaUtils = require('analytics/utils');

        anaUtils.setNextPageData({
            navigationInfo: anaUtils.buildNavPath(['top nav', 'basket'])
        });

    }, 'components');

    location.href = BasketUtils.PAGE_URL;
};

InlineBasket.prototype.onCheckoutClick = function () {

    //Analytics
    require.ensure([], function (require) {
        let anaUtils = require('analytics/utils');

        anaUtils.setNextPageData({
            navigationInfo: anaUtils.buildNavPath(['top nav', 'hover basket', 'checkout'])
        });

    }, 'components');

    location.href = BasketUtils.PAGE_URL;
};

InlineBasket.prototype.toggleOpen = function (forceIsOpen) {

    if (this.state.renderBasket) {

        let newIsOpenValue =
        typeof forceIsOpen === 'boolean' ? forceIsOpen : !this.state.isOpen;

        if (forceIsOpen.type === 'mouseenter' && this.state.isOpen === true) {
            newIsOpenValue = true;
        } else if (forceIsOpen.type === 'mouseleave' && this.state.isOpen === false) {
            newIsOpenValue = false;
        }

        this.setState({
            isOpen: newIsOpenValue,
            fixed: !this.isPositionTop()
        });
    }
};

InlineBasket.prototype.rightOffset = function () {
    return el.getBoundingClientRect().right;
};


// Added by sephora-jsx-loader.js
module.exports = InlineBasket.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/InlineBasket/InlineBasket.c.js