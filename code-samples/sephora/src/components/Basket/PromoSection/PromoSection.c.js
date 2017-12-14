// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var PromoSection = function () {};

// Added by sephora-jsx-loader.js
PromoSection.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const basketUtils = require('utils/Basket');
const PromoActions = require('actions/PromoActions');
const Debounce = require('utils/Debounce');
const DEBOUNCE_KEYUP = 300;

PromoSection.prototype.ctrlr = function () {
    let setPromos = (basket) => {
        this.promoInput && this.promoInput.empty();

        this.setState({
            basketPromosList: basket.promos,
            promoMessage: basketUtils.getPromoMessage(basket),
            promoErrorMessage: null,
            promoWarningMessage: basket.promoWarning
        });
    };

    store.setAndWatch('basket', null, (value) => {
        setPromos(value.basket);
    });

    let setPromoError = (promo) => this.setState({ promoErrorMessage: promo.promoErrorMessage });

    store.setAndWatch('promo', null, (value) => {
        if (value.promo) {
            setPromoError(value.promo);
        }
    });
};

PromoSection.prototype.applyPromoCode = function (e) {
    e.preventDefault();

    let promoCode = this.promoInput.getValue();

    if (promoCode.trim() === '') {
        return;
    }

    store.dispatch(PromoActions.applyPromo(promoCode, null, (result)=> {
        this.showPromoErrorMessage(result);
    }));

};

PromoSection.prototype.showPromoErrorMessage = function (json) {
    this.setState({ promoErrorMessage: json.errorMessages[0] });
};

PromoSection.prototype.removePromoCode = function (e) {
    e.preventDefault();

    store.dispatch(PromoActions.removePromo(basketUtils.getOrderId(), null, (result)=> {
        this.showPromoErrorMessage(result);
    }));

};

PromoSection.prototype.keyUp = function (e) {
    let promoCode = this.promoInput.getValue();
    this.setState({ promoApplied: promoCode.length > 0 });
};

PromoSection.prototype.handleKeyUp =
    Debounce.throttle(PromoSection.prototype.keyUp, DEBOUNCE_KEYUP);


// Added by sephora-jsx-loader.js
module.exports = PromoSection.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/PromoSection/PromoSection.c.js