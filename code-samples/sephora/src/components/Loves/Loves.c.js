// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Loves = function () {};

// Added by sephora-jsx-loader.js
Loves.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;

const store = require('store/Store');
const watch = require('redux-watch');
const getLovesList = require('actions/LoveActions').getLovesList;
const Events = require('utils/framework/Events');
const userUtils = require('utils/User');


Loves.prototype.ctrlr = function () {

    var watchLoves = () => {
        //watch for changes to loves list
        store.setAndWatch('loves.currentLoves', null, (data) => {
            let lovedItems = data.currentLoves.map(love => love.sku);
            this.setState({
                loves: lovedItems.slice(0, this.props.maxLoves) 
            });
        });

        //refresh currentLoves when the loves list gets updated
        store.setAndWatch('loves.shoppingListIds', null, () => {
            if (!userUtils.isAnonymous()) {
                store.dispatch(getLovesList(store.getState().user.profileId));
            }
        });
    };

    Events.onLastLoadEvent(window, [Events.UserInfoReady], watchLoves);
};


// Added by sephora-jsx-loader.js
module.exports = Loves.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Loves/Loves.c.js