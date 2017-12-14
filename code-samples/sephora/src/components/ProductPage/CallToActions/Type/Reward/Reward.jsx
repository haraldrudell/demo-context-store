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
    Sephora.Util.InflatorComps.Comps['Reward'] = function Reward(){
        return RewardClass;
    }
}
const skuUtils = require('utils/Sku');
const ADD_BUTTON_TYPE = require('utils/Basket').ADD_TO_BASKET_TYPES;
const BiQualify = require('components/BiQualify/BiQualify');
const AddToBasketButton = require('components/AddToBasketButton/AddToBasketButton');

const Reward = function () {
    this.state = {
        disabled: true
    };
};

Reward.prototype.render = function () {
    let {
        basket,
        currentProduct
    } = this.props;
    let {
        currentSku,
        currentSkuQuantity
    } = currentProduct;
    let {
        rewards = []
    } = basket;
    let rewardInBasket = rewards.filter(reward => reward.sku.skuId === currentSku.skuId).length;

    return this.state.userReady ? (
        <div>
            {skuUtils.isBiExclusive(currentSku) &&
                <BiQualify
                    fontSize={Sephora.isMobile() ? 'h4' : 'h5'}
                    currentSku={currentSku} />
            }
            <AddToBasketButton
                block={true}
                quantity={currentSkuQuantity}
                product={currentProduct}
                sku={currentSku}
                text={rewardInBasket ? 'Remove' : null}
                type={rewardInBasket ? ADD_BUTTON_TYPE.PRIMARY : ADD_BUTTON_TYPE.RED}
                disabled={!rewardInBasket && (this.state.disabled || skuUtils.isRewardDisabled(currentSku))} />
        </div>
    ) : null;
};


// Added by sephora-jsx-loader.js
Reward.prototype.path = 'ProductPage/CallToActions/Type/Reward';
// Added by sephora-jsx-loader.js
Object.assign(Reward.prototype, require('./Reward.c.js'));
var originalDidMount = Reward.prototype.componentDidMount;
Reward.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Reward');
if (originalDidMount) originalDidMount.apply(this);
if (Reward.prototype.ctrlr) Reward.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Reward');
// Added by sephora-jsx-loader.js
Reward.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Reward.prototype.class = 'Reward';
// Added by sephora-jsx-loader.js
Reward.prototype.getInitialState = function() {
    Reward.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Reward.prototype.render = wrapComponentRender(Reward.prototype.render);
// Added by sephora-jsx-loader.js
var RewardClass = React.createClass(Reward.prototype);
// Added by sephora-jsx-loader.js
RewardClass.prototype.classRef = RewardClass;
// Added by sephora-jsx-loader.js
Object.assign(RewardClass, Reward);
// Added by sephora-jsx-loader.js
module.exports = RewardClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/CallToActions/Type/Reward/Reward.jsx