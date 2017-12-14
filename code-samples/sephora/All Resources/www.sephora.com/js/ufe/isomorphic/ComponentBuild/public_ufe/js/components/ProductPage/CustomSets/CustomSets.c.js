// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var CustomSets = function () {};

// Added by sephora-jsx-loader.js
CustomSets.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const CustomSetsStorage = require('utils/localStorage/CustomSets');
const CookieUtils = require('utils/Cookies');
const Location = require('utils/Location');
const store = require('Store');
const watch = require('redux-watch');
const basketActions = require('actions/BasketActions');
const ProductActions = require('actions/ProductActions');
const skuUtils = require('utils/Sku');

const CUSTOM_SETS_TYPE = skuUtils.CUSTOM_SETS_TYPE;

CustomSets.prototype.ctrlr = function () {
    store.setAndWatch('product.currentSkuQuantity', null, (data) => {
        this.setState({
            currentSkuQuantity: data.currentSkuQuantity
        });
    });
    this.restoreChoices();
};

CustomSets.prototype.shouldComponentUpdate = function (nextProps, nextState) {
    return JSON.stringify(nextState) !== JSON.stringify(this.state) ||
    JSON.stringify(nextProps) !== JSON.stringify(this.props);
};

CustomSets.prototype.restoreChoices = function () {
    let productId = this.props.productId;
    let sessionId = CookieUtils.read(CookieUtils.KEYS.SESSIONID);
    let lastChoices = CustomSetsStorage.getCustomSetsChoices() || {};
    if (lastChoices.productId && lastChoices.productId === productId &&
        lastChoices.sessionId && lastChoices.sessionId === sessionId ) {
        let newSkuOptions = this.state.skuOptions.slice();
        let newSkuOptionsIds = newSkuOptions.map(sku => sku.skuId);
        let newChoices = this.state.choices.slice();
        lastChoices.choices.forEach((choicesSku) => {
            let skuId = choicesSku.skuId;
            if (this.state.type === CUSTOM_SETS_TYPE.SINGLE_SKU) {
                let skuIndex = newSkuOptionsIds.indexOf(skuId);
                newChoices.push(this.state.skuOptions[skuIndex]);
                newSkuOptions.splice(skuIndex, 1);
            } else {
                newSkuOptions.forEach((groupedSkuOption) => {
                    groupedSkuOption.skuOptions.forEach(groupSku => {
                        if (groupSku.skuId === skuId) {
                            groupedSkuOption.selectedSku = groupSku;
                            groupedSkuOption.selectedSku.primaryProduct = {
                                brand: {
                                    displayName: groupedSkuOption.groupProduct.brand.displayName
                                },
                                displayName: groupedSkuOption.groupProduct.displayName
                            };
                            newChoices.push(groupSku);
                        }
                    });
                });
            }
        });
        this.setNewState(newChoices, newSkuOptions);
    } else {
        store.dispatch(ProductActions.updateCustomSetsChoices([]));
        CustomSetsStorage.setCustomSetsChoices([], productId, sessionId);
    }
};

CustomSets.prototype.addToBasket = function () {
    let {
        currentSku
    } = this.props;
    let skusToAdd, skusQuantity = this.state.choices.length;
    skusToAdd = this.state.choices.map(sku => sku.skuId).reduce((acc, skuId) => {
        let skuQuantity = acc[skuId] || 0;
        acc[skuId] = ++skuQuantity;
        return acc;
    }, {});
    skusToAdd = Object.keys(skusToAdd).map(skuId => {
        return {
            skuId: skuId,
            qty: skusToAdd[skuId]
        };
    });
    // Adding current sku of main product as custom set skus are free with it
    skusToAdd.push({
        skuId: currentSku.skuId,
        qty: this.state.currentSkuQuantity
    });
    store.dispatch(basketActions.addMultipleSkusToBasket(skusToAdd, skusQuantity, () => {
        CustomSetsStorage.deleteCustomSetsChoices();
        store.dispatch(ProductActions.updateCustomSetsChoices([]));
        this.setNewState([], this.state.skuOptions);
        if (Sephora.isMobile()) {
            let watchIsOpen = watch(store.getState, 'inlineBasket.isOpen');
            store.subscribe(watchIsOpen((isOpen) => {
                if (!isOpen) {
                    let productId = this.props.productId;
                    Location.setLocation('/product/' + productId);
                }
            }));
        }
    }));
};

CustomSets.prototype.selectSingleSku = function (sku, index, type) {
    let newChoices = this.state.choices.slice();
    let newSkuOptions = this.state.skuOptions.slice();
    newChoices.push(sku);
    if (type === CUSTOM_SETS_TYPE.SINGLE_SKU.SKU_LIST) {
        newSkuOptions = newSkuOptions.filter(item => item.skuId !== sku.skuId);
    }
    this.setNewState(newChoices, newSkuOptions);
};

CustomSets.prototype.removeSingleSku = function (sku, index, type) {
    let newChoices = this.state.choices.slice();
    let newSkuOptions = this.state.skuOptions.slice();
    newChoices.splice(index, 1);
    if (type !== CUSTOM_SETS_TYPE.GROUPED_SKU.YOUR_CHOICES) {
        newSkuOptions.push(sku);
    }
    this.setNewState(newChoices, newSkuOptions);
};

CustomSets.prototype.handleGroupedSkuOnClick = function (sku, groupedIndex) {
    let newSkuOptions = this.state.skuOptions.slice();
    let groupedSkuOption = newSkuOptions[groupedIndex];
    groupedSkuOption.selectedSku = sku;
    groupedSkuOption.selectedSku.primaryProduct = {
        brand: {
            displayName: groupedSkuOption.groupProduct.brand.displayName
        },
        displayName: groupedSkuOption.groupProduct.displayName
    };
    let newChoices = this.state.choices.slice();
    this.setNewState(newChoices, newSkuOptions);
};

CustomSets.prototype.addToSetGroupedSku = function (groupedIndex) {
    let newSkuOptions = this.state.skuOptions.slice();
    let groupedSkuOption = newSkuOptions[groupedIndex];
    let sku = groupedSkuOption.selectedSku;
    let newChoices = this.state.choices.slice();
    newChoices.push(sku);
    this.setNewState(newChoices, newSkuOptions);
};

CustomSets.prototype.setNewState = function (newChoices, newSkuOptions) {
    const sessionId = CookieUtils.read(CookieUtils.KEYS.SESSIONID);
    CustomSetsStorage.setCustomSetsChoices(newChoices.map(sku => {
        return {
            skuId: sku.skuId
        };
    }), this.props.productId, sessionId);
    this.setState({
        choices: newChoices,
        skuOptions: newSkuOptions
    });
    store.dispatch(ProductActions.updateCustomSetsChoices(newChoices));
};

CustomSets.prototype.toggleExpand = function (groupedIndex) {
    let newSkuOptions = this.state.skuOptions.slice();
    let groupedSkuOption = newSkuOptions[groupedIndex];
    groupedSkuOption.isExpanded = !groupedSkuOption.isExpanded;
    let newChoices = this.state.choices.slice();
    this.setNewState(newChoices, newSkuOptions);
};

CustomSets.prototype.handleGroupedSkuQuantity = function (quantity) {
    store.dispatch(ProductActions.updateQuantityOfCurrentSku(parseInt(quantity)));
};


// Added by sephora-jsx-loader.js
module.exports = CustomSets.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/CustomSets/CustomSets.c.js