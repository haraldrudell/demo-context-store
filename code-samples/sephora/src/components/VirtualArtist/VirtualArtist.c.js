// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var VirtualArtist = function () {};

// Added by sephora-jsx-loader.js
VirtualArtist.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const Modiface = require('services/api/thirdparty/Modiface');
const store = require('Store');

VirtualArtist.prototype.ctrlr = function () {
    Modiface.renderVirtualArtist('mf_frame_container', this.props.product, null, () => {
        store.setAndWatch('product.currentProduct.currentSku', null, (value) => {
            Modiface.selectSku(value.currentSku.skuId);
        });
    });
};

VirtualArtist.prototype.shouldComponentUpdate = function (nextProps) {
    return this.props.product && this.props.product.productId !== nextProps.product.productId;
};


// Added by sephora-jsx-loader.js
module.exports = VirtualArtist.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/VirtualArtist/VirtualArtist.c.js