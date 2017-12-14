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
    Sephora.Util.InflatorComps.Comps['PromoItem'] = function PromoItem(){
        return PromoItemClass;
    }
}
const space = require('style').space;
const { Box, Flex } = require('components/display');
const ProductDisplayName = require('components/Product/ProductDisplayName/ProductDisplayName');
const ProductImage = require('components/Product/ProductImage/ProductImage');
const AddToBasketButton = require('components/AddToBasketButton/AddToBasketButton');
const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;
const ADD_BUTTON_TYPE = require('utils/Basket').ADD_TO_BASKET_TYPES;

const PromoItem = function () {
    this.state = {
        isInMsgPromoSkuList: false,
        maxPromoQtyReached: false
    };
};

PromoItem.prototype.render = function () {

    let currentSku = Object.assign({}, this.props);

    return (
        <Flex
            flexDirection='column'
            width={1}
            textAlign='center'>
            <div>
                <Box
                    marginX='auto'
                    marginBottom={space[3]}
                    maxWidth={currentSku.imageSize}>
                    <ProductImage
                        src={currentSku.image}
                        size={currentSku.imageSize} />
                </Box>

                <ProductDisplayName
                    numberOfLines={4}
                    brandName={currentSku.brandName}
                    productName={currentSku.productName} />

            </div>

            <Box
                paddingTop={space[3]}
                paddingBottom={space[1]}
                marginTop='auto'>
                <AddToBasketButton
                    promoPanel={this.props.type}
                    quantity={1}
                    sku={currentSku}
                    type={this.state.isInMsgPromoSkuList ?
                        ADD_BUTTON_TYPE.MUTED : ADD_BUTTON_TYPE.OUTLINE}
                    disabled={!this.state.isInMsgPromoSkuList && this.state.maxPromoQtyReached}
                    text={this.state.isInMsgPromoSkuList ? 'Remove' : 'Add'} />
            </Box>
        </Flex>
    );
};


// Added by sephora-jsx-loader.js
PromoItem.prototype.path = 'Product/PromoItem';
// Added by sephora-jsx-loader.js
Object.assign(PromoItem.prototype, require('./PromoItem.c.js'));
var originalDidMount = PromoItem.prototype.componentDidMount;
PromoItem.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: PromoItem');
if (originalDidMount) originalDidMount.apply(this);
if (PromoItem.prototype.ctrlr) PromoItem.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: PromoItem');
// Added by sephora-jsx-loader.js
PromoItem.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
PromoItem.prototype.class = 'PromoItem';
// Added by sephora-jsx-loader.js
PromoItem.prototype.getInitialState = function() {
    PromoItem.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
PromoItem.prototype.render = wrapComponentRender(PromoItem.prototype.render);
// Added by sephora-jsx-loader.js
var PromoItemClass = React.createClass(PromoItem.prototype);
// Added by sephora-jsx-loader.js
PromoItemClass.prototype.classRef = PromoItemClass;
// Added by sephora-jsx-loader.js
Object.assign(PromoItemClass, PromoItem);
// Added by sephora-jsx-loader.js
module.exports = PromoItemClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Product/PromoItem/PromoItem.jsx