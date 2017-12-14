// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
if (!Sephora.isRootRender) {
    Sephora.Util.InflatorComps.Comps['IconChat'] = function IconChat(){
        return IconChatClass;
    }
}
/* eslint-disable max-len */
const Icon = require('./Icon');

const IconChat = function () {};

IconChat.prototype.render = function () {
    return (
        <Icon
            {...this.props}
            viewBox='0 0 24 24'>
            <path d='M5 24c-.1 0-.3 0-.4-.1-.3-.1-.4-.5-.4-.8l.8-5.4c-3.1-1.8-5-4.8-5-7.9C0 4.4 5.4 0 12 0s12 4.4 12 9.8-5.4 9.8-12 9.8c-.4 0-.8 0-1.3-.1l-5.3 4.4c-.1 0-.3.1-.4.1zm7-22.5C6.2 1.5 1.5 5.2 1.5 9.8c0 2.8 1.7 5.3 4.7 6.9.3.1.4.5.4.8L6 21.4l4-3.3c.2-.1.4-.2.6-.2.5.1 1 .1 1.4.1 5.8 0 10.5-3.7 10.5-8.2S17.8 1.5 12 1.5z'/>
        </Icon>
    );
};


// Added by sephora-jsx-loader.js
IconChat.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconChat.prototype.class = 'IconChat';
// Added by sephora-jsx-loader.js
IconChat.prototype.getInitialState = function() {
    IconChat.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconChat.prototype.render = wrapComponentRender(IconChat.prototype.render);
// Added by sephora-jsx-loader.js
var IconChatClass = React.createClass(IconChat.prototype);
// Added by sephora-jsx-loader.js
IconChatClass.prototype.classRef = IconChatClass;
// Added by sephora-jsx-loader.js
Object.assign(IconChatClass, IconChat);
// Added by sephora-jsx-loader.js
module.exports = IconChatClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconChat.jsx