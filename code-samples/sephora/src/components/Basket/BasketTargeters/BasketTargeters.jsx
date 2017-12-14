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
    Sephora.Util.InflatorComps.Comps['BasketTargeters'] = function BasketTargeters(){
        return BasketTargetersClass;
    }
}
const { space } = require('style');
const { css } = require('glamor');
const Text = require('components/Text/Text');
const BccComponentList = require('components/Bcc/BccComponentList/BccComponentList');
const basketUtils = require('utils/Basket');
const uIUtils = require('utils/UI');

const BasketTargeters = function () {
    this.state = {
        animatePopdownStart: false
    };
};

let animatePopdown = css.keyframes({
    '0%': {
        transform: 'scale(1)'
    },
    '20%': {
        transform: 'scale(1.05)'
    },
    '100%': {
        transform: 'scale(0.1)'
    }
});

BasketTargeters.prototype.render = function () {

    let flashBanner = !this.state.showRougeCopyText && !basketUtils.getFlashFromBasket() &&
        this.state && this.BASKET_TARGETERS && this.state[this.BASKET_TARGETERS.FLASH];
    if (flashBanner instanceof Array) {
        flashBanner = flashBanner.length ? flashBanner : null;
    }

    let giftCardBanner = !basketUtils.getGiftCardFromBasket() && this.state &&
        this.BASKET_TARGETERS && this.state[this.BASKET_TARGETERS.GIFTCARD];
    if (giftCardBanner instanceof Array) {
        giftCardBanner = giftCardBanner.length ? giftCardBanner : null;
    }

    if (this.state.animatePopdownStart) {
        setTimeout(() => {
            uIUtils.scrollToTop();
            this.setState({
                animatePopdownStart: false
            });
        }, this.animationDuration);
    }

    let styles = {
        '& img': {
            height: 'auto',
            width: '100%'
        }
    };

    return (
        <div>
            {this.state.showRougeCopyText &&
                <Text
                    is='p'
                    padding={Sephora.isMobile() ? space[4] : null}
                    backgroundColor='white'
                    textAlign='center'
                    fontWeight={700}
                    lineHeight={2}>
                    Congrats, you are now enrolled in FLASH!
                </Text>
            }
            {flashBanner ? <BccComponentList
                nested={true}
                items={flashBanner}
                onClick={this.addFlashToBasket}
                _css={[
                    styles,
                    this.state.animatePopdownStart && {
                        animation: `${animatePopdown} ${this.animationDuration}ms`
                    }
                ]}
            /> :
                giftCardBanner ? <BccComponentList
                    nested={true}
                    items={giftCardBanner}
                    onClick={this.addGiftCardToBasket}
                    _css={[
                        styles,
                        this.state.animatePopdownStart && {
                            animation: `${animatePopdown} ${this.animationDuration}ms`
                        }
                    ]}
                /> : null
            }
        </div>
    );
};


// Added by sephora-jsx-loader.js
BasketTargeters.prototype.path = 'Basket/BasketTargeters';
// Added by sephora-jsx-loader.js
Object.assign(BasketTargeters.prototype, require('./BasketTargeters.c.js'));
var originalDidMount = BasketTargeters.prototype.componentDidMount;
BasketTargeters.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BasketTargeters');
if (originalDidMount) originalDidMount.apply(this);
if (BasketTargeters.prototype.ctrlr) BasketTargeters.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BasketTargeters');
// Added by sephora-jsx-loader.js
BasketTargeters.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BasketTargeters.prototype.class = 'BasketTargeters';
// Added by sephora-jsx-loader.js
BasketTargeters.prototype.getInitialState = function() {
    BasketTargeters.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BasketTargeters.prototype.render = wrapComponentRender(BasketTargeters.prototype.render);
// Added by sephora-jsx-loader.js
var BasketTargetersClass = React.createClass(BasketTargeters.prototype);
// Added by sephora-jsx-loader.js
BasketTargetersClass.prototype.classRef = BasketTargetersClass;
// Added by sephora-jsx-loader.js
Object.assign(BasketTargetersClass, BasketTargeters);
// Added by sephora-jsx-loader.js
module.exports = BasketTargetersClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/BasketTargeters/BasketTargeters.jsx