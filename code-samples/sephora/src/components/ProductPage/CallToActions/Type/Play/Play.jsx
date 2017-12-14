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
    Sephora.Util.InflatorComps.Comps['Play'] = function Play(){
        return PlayClass;
    }
}
const { space } = require('style');

const ButtonRed = require('components/Button/ButtonRed');
const Text = require('components/Text/Text');
const OutOfStockButton = require('components/AddToBasketButton/OutOfStockButton/OutOfStockButton');
const basketUtils = require('utils/Basket');

const Play = function () {};

Play.prototype.render = function () {
    let currentSku = this.props.currentSku;
    let {
        isOutOfStock,
        actionFlags = {}
    } = currentSku;

    let isSubscribed = actionFlags.playSubscriptionStatus === 'SUBSCRIBED';

    return (
        <div>
                {isSubscribed &&
                <Text
                    is='p'
                    fontSize='h5'
                    lineHeight={2}
                    marginBottom={space[2]}>
                    You are already subscribed.
                    {Sephora.isMobile() ? <br /> : ' '}
                    Only one subscription per person.
                </Text>
                }
                {isSubscribed || !isOutOfStock ?
                    <ButtonRed
                        block={true}
                        onClick={this.subscribePlay}
                        disabled={isSubscribed}>
                        Subscribe Now
                    </ButtonRed>
                    :
                    <OutOfStockButton
                        block={true}
                        product={this.props}
                        type={basketUtils.ADD_TO_BASKET_TYPES.RED}
                        sku={currentSku}/>
                }
            </div>
    );
};


// Added by sephora-jsx-loader.js
Play.prototype.path = 'ProductPage/CallToActions/Type/Play';
// Added by sephora-jsx-loader.js
Object.assign(Play.prototype, require('./Play.c.js'));
var originalDidMount = Play.prototype.componentDidMount;
Play.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Play');
if (originalDidMount) originalDidMount.apply(this);
if (Play.prototype.ctrlr) Play.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Play');
// Added by sephora-jsx-loader.js
Play.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Play.prototype.class = 'Play';
// Added by sephora-jsx-loader.js
Play.prototype.getInitialState = function() {
    Play.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Play.prototype.render = wrapComponentRender(Play.prototype.render);
// Added by sephora-jsx-loader.js
var PlayClass = React.createClass(Play.prototype);
// Added by sephora-jsx-loader.js
PlayClass.prototype.classRef = PlayClass;
// Added by sephora-jsx-loader.js
Object.assign(PlayClass, Play);
// Added by sephora-jsx-loader.js
module.exports = PlayClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/CallToActions/Type/Play/Play.jsx