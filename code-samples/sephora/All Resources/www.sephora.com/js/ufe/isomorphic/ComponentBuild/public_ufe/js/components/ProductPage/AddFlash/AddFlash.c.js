// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var AddFlash = function () {};

// Added by sephora-jsx-loader.js
AddFlash.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const userUtils = require('utils/User');
const basketUtils = require('utils/Basket');
const basketActions = require('actions/BasketActions');
const userActions = require('actions/UserActions');
const skuUtils = require('utils/Sku');
const ENROLL_ID = 'ENROLL_ID';
const watch = require('redux-watch');
const FLASH_TEXT_MEDIA_ID = '45600023';
const cmsApi = require('services/api/cms');

AddFlash.prototype.ctrlr = function () {
    // for first time page load do not show if Flash is in Basket, but if Flash changes
    // during page life cycle, than show but disable
    let firstTimeFlashInBasket = basketUtils.getFlashFromBasket();
    cmsApi.getMediaContent(FLASH_TEXT_MEDIA_ID).then(data => {
        let toggleFlash = () => {
            let currentSku = store.getState().product.currentProduct.currentSku;
            let user = store.getState().user;
            let showFlashCheckBox = !firstTimeFlashInBasket &&
                Sephora.configurationSettings.isPpageFlashEnabled &&
                userUtils.showFlashPDP() && skuUtils.showFlashPDP(currentSku) &&
                (user.isFlashEnabledOnPDP || userUtils.isAnonymous());
            this.setState({
                showFlashCheckBox: showFlashCheckBox,
                addFlashOnPdpContent: data.regions.content[0]
            });
            if (!showFlashCheckBox) {
                this.setState({ checked: false }, () => {
                    this.toggleFlashInBasket(this.state.checked);
                });
            }
        };
        store.setAndWatch('product.currentProduct', null, toggleFlash);
        store.setAndWatch('product.currentProduct.currentSku', null, toggleFlash);
        store.setAndWatch('user', null, toggleFlash);
        store.subscribe(watch(store.getState, 'basket.products')((basket) => {
            firstTimeFlashInBasket = false;
            this.hasFlashInBasket();
        }));
    });
};

AddFlash.prototype.getProductRequest = function() {
    if (userUtils.isRouge()) {
        //Set analytics global flag to know if checkbox is checked
        digitalData.page.attributes.tempProps.isEnrollToFlash = 
        !digitalData.page.attributes.tempProps.isEnrollToFlash;
        return {
            methodId: ENROLL_ID,
            method: () => {
                let data = {
                    fragmentForUpdate: 'FLASH',
                    isAcceptTerms: true
                };
            
                store.dispatch(
                    userActions.updateUserFragment(
                        data,
                        () => store.dispatch(userActions.getUserFull())
                    )
                );
            }
        };
    } 

    return {
        skuId: skuUtils.IDs.FLASH,
        qty: 1,
        isAcceptTerms: this.state.checked
    };
};

AddFlash.prototype.hasFlashInBasket = function () {
    let flashInBasket = !!basketUtils.getFlashFromBasket();
    let checked = flashInBasket;
    this.setState({
        flashInBasket,
        checked: checked,
        disabled: checked
    });
};

AddFlash.prototype.addFlashToBasket = function () {
    this.setState({ checked: !this.state.checked }, () => {
        this.toggleFlashInBasket(this.state.checked);
    });
};

AddFlash.prototype.toggleFlashInBasket = function (checked) {
    if (checked) {
        // If user is Rouge, Flash is not going to be added to the basket
        // instead we are going to enroll it directly
        store.dispatch(basketActions.addPendingProduct(this.getProductRequest()));
    } else {
        store.dispatch(basketActions.removePendingProduct(this.getProductRequest()));
    }
};



// Added by sephora-jsx-loader.js
module.exports = AddFlash.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/AddFlash/AddFlash.c.js