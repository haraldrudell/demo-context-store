// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var RegularProductBottom = function () {};

// Added by sephora-jsx-loader.js
RegularProductBottom.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const ProductWatcher = require('../../ProductWatcher');
const ProductActions = require('actions/ProductActions');
const profileApi = require('services/api/profile');
const RECENTLY_VIEWED_ITEMS_LIMIT = Sephora.isMobile() ? 15 : 20;
const updateCurrentUserSpecificProduct = require('actions/ProductActions').
    updateCurrentUserSpecificProduct;

RegularProductBottom.prototype.ctrlr = function () {
    let currentProduct = this.props.currentProduct;

    let subscription = store.setAndWatch('product.currentProductUserSpecificDetails', null,
        (data) => {
            if (data.currentProductUserSpecificDetails.makeUserSpecificProductDetailsCall) {
                profileApi.getUserSpecificProductDetails(currentProduct.productId).then(
                    (resp) => {
                        if (resp.recentlyViewedSkus) {
                            let productStateObj = this.state.currentProduct;
                            productStateObj.recentlyViewedSkus =
                                resp.recentlyViewedSkus.slice(0, RECENTLY_VIEWED_ITEMS_LIMIT);
                            this.setState({ currentProduct: productStateObj });
                        }
                        // TODO: need to put in more centrilized place as it affect all product page
                        store.dispatch(updateCurrentUserSpecificProduct(resp));
                    }
                ).catch({
                    // Handle exception
                });
            }
        });

    subscription[0]();

    ProductWatcher.watchProductAndUser(this, true);
    ProductWatcher.watchTestTarget(this);
};


// Added by sephora-jsx-loader.js
module.exports = RegularProductBottom.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/Type/RegularProduct/RegularProductBottom/RegularProductBottom.c.js