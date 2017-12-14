// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var ProductLove = function () {};

// Added by sephora-jsx-loader.js
ProductLove.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const watch = require('redux-watch');
const store = require('Store');
const Authentication = require('Authentication');
const addLove = require('actions/LoveActions').addLove;
const removeLove = require('actions/LoveActions').removeLove;
const changeCurrentSku = require('actions/ProductActions').changeCurrentSku;
const processEvent = require('analytics/processEvent');
const anaConsts = require('analytics/constants');
const skuUtils = require('utils/Sku');
const anonymous = require('utils/User').isAnonymous;

ProductLove.prototype.ctrlr = function () {
    let loveWatch = watch(store.getState, 'loves.shoppingListIds');
    let currentSkuWatch = watch(store.getState, 'product');

    this.setState({
        skuId: this.props.skuId,
        isActive: skuUtils.isSkuLoved(this.props.skuId)
    });

    /**
     * subscribe on change of current Sku.
     * There're a lot of different skus on the same screen possible,
     * and we need to react on change
     */
    store.subscribe(currentSkuWatch(newVal => {
        if (newVal.currentSku) {
            this.setState({
                skuId: newVal.currentSku.skuId,
                isActive: skuUtils.isSkuLoved(newVal.currentSku.skuId)
            });
        }
    }));

    /**
     * Update productLove, if user's lovesList is updated
     */
    store.subscribe(loveWatch(newVal => {
        this.setState({
            isActive: skuUtils.isSkuLoved(this.state.skuId)
        });
    }));
};

ProductLove.prototype.componentWillReceiveProps = function (updatedProps) {
    if (updatedProps.skuId !== this.state.skuId) {
        this.setState({
            skuId: updatedProps.skuId,
            isActive: skuUtils.isSkuLoved(updatedProps.skuId)
        });
    }
};

ProductLove.prototype.handleLoveRequest = function (sku) {
    if (!this.state.isActive) {
        if (this.props.customSetsChoices) {
            store.dispatch(addLove([sku].concat(this.props.customSetsChoices.map(choice => {
                return {
                    skuId: choice.skuId,
                    loveSource: sku.loveSource
                };
            }))));
        } else {
            store.dispatch(addLove(sku));
        }

        //Analytics
        processEvent.preprocess.commonInteractions(
            {
                context: this.props.analyticsContext,
                linkName: 'love',
                actionInfo: 'love',
                eventStrings: [anaConsts.Event.EVENT_71, anaConsts.Event.EVENT_27],
                specificEventName: anaConsts.EVENT_NAMES.ADD_TO_LOVES,
                sku: sku
            }
        );
    } else {
        if (this.props.customSetsChoices) {
            store.dispatch(removeLove([sku.skuId].concat(this.props.customSetsChoices.map(choice =>
                choice.skuId))));
        } else {
            store.dispatch(removeLove(sku.skuId));
        }

        //Analytics
        processEvent.preprocess.commonInteractions(
            {
                context: this.props.analyticsContext,
                linkName: 'un-love',
                actionInfo: 'un-love',
                eventStrings: [anaConsts.Event.EVENT_71, anaConsts.Event.EVENT_28],
                specificEventName: anaConsts.EVENT_NAMES.REMOVE_FROM_LOVES,
                sku: sku
            }
        );
    }
};

ProductLove.prototype.handleOnClick = function (e, sku) {
    e.preventDefault();
    let isAnonymous = anonymous();
    let isSkuLoved;

    Authentication.requireAuthentication().then(()=> {
        isSkuLoved = skuUtils.isSkuLoved(this.state.skuId);

        // Don't handle love request if user was anonymous and “loved” an item that was
        // already loved by her, since this would mark the product as unloved.
        if (!isAnonymous || !isSkuLoved) {
            this.handleLoveRequest(sku);
        }
    });
};

ProductLove.prototype.mouseEnter = function (e) {
    if (!Sephora.isTouch) {
        e.stopPropagation();
        this.setState({ hover: true });
    }
};

ProductLove.prototype.mouseLeave = function (e) {
    if (!Sephora.isTouch) {
        e.stopPropagation();
        this.setState({ hover: false });
    }
};


// Added by sephora-jsx-loader.js
module.exports = ProductLove.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Product/ProductLove/ProductLove.c.js