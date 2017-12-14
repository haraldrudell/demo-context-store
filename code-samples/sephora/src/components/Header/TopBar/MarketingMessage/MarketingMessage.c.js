// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var MarketingMessage = function () {};

// Added by sephora-jsx-loader.js
MarketingMessage.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const anaUtils = require('analytics/utils');
const Events = require('utils/framework/Events');
const ReactDOM = require('react-dom');
const durationSeconds = 5;
const { css } = require('glamor');

const fadeinout = css.keyframes({
    '0%': { opacity: 0 },
    '10%': { opacity: 1 },
    '90%': { opacity: 1 },
    '100%': { opacity: 0 }
});

const fadeInOutClass = css({
    opacity: '0',
    WebkitAnimation: `${fadeinout} 5s`,
    animation: `${fadeinout} 5s`
});

const FADE_IN_OUT_CLASS_NAME = fadeInOutClass.toString();
const ANIMATION_END = 'animationend';

function animationListener(event) {
    if (event.type === ANIMATION_END) {
        event.target.style.display = 'none';
        event.target.classList.remove(FADE_IN_OUT_CLASS_NAME);
    }
}

function attatchEventHandlers(parentNode) {
    let children = parentNode.children;
    for (let i = 0, len = children.length; i < len; i++) {
        let messageElement = children[i];
        messageElement.addEventListener(ANIMATION_END, animationListener, false);
    }
}

MarketingMessage.prototype.ctrlr = function () {
    this.setState({
        limit: this.props.marketingMessages.length - 1
    });

    let messageElementContainer = null;

    //waits until test targeters to be ready
    Events.onLastLoadEvent(window, [Events.UserInfoReady], () => {
        this.setState({
            renderedMessages: this.defineCompType(this.props.marketingMessages)
        }, () =>  {
            messageElementContainer = ReactDOM.findDOMNode(this);
            attatchEventHandlers(messageElementContainer);
        });

        setInterval(() => {
            this.performTransition(messageElementContainer);
        }, durationSeconds * 1000);
    });
};

MarketingMessage.prototype.nextIndex = function () {
    let currentIndex = this.index;
    this.index = currentIndex >= this.state.limit ? 0 : currentIndex + 1;
    return this.index;
};

MarketingMessage.prototype.performTransition = function (messageContainer) {
    let itemToDisplay = messageContainer.children[this.nextIndex()];
    itemToDisplay.style.display = 'block';
    itemToDisplay.className += ' ' + FADE_IN_OUT_CLASS_NAME;
};

//Analytics
MarketingMessage.prototype.promoClicks = function (promoName) {
    const path = ['toolbar', 'promotions', 'promotions',
        'promotions', 'promotions-' + promoName];
    anaUtils.setNextPageData({
        navigationInfo: anaUtils.buildNavPath(path)
    });
};


// Added by sephora-jsx-loader.js
module.exports = MarketingMessage.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/TopBar/MarketingMessage/MarketingMessage.c.js