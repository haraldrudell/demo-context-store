const anaConsts = require('analytics/constants');
const analyticsUtils = require('analytics/utils');
const store = require('Store');
const skuUtils = require('utils/Sku');

module.exports = (function () {
    //Product Page Binding Methods
    return {
        /**
         * Add an item to the product array;
         */
        populatePrimaryProductObject: function (product) {
            digitalData.product.push({
                attributes: {
                    customizableSetType: this.getCustomizableSetsKey(product),
                    price: product.currentSku.listPrice,
                    rating: product.rating,
                    skuId: product.currentSku.skuId,
                    type: product.type,
                    variationType: product.currentSku.variationType,
                    variationValue: product.currentSku.variationValue,
                    world: this.getProductWorld(product),
                    isOutOfStock: product.currentSku.isOutOfStock,
                    nthLevelCategory: product.parentCategory && product.parentCategory.displayName,
                    image: product.currentSku.skuImages.image250,
                    productUrl: product.fullSiteProductUrl
                },
                productInfo: {
                    description: product.shortDescription.replace(/<\/?\w+[^>]*\/?>/g, ''),
                    manufacturer: product.brand? product.brand.displayName: '',
                    productID: product.productId,
                    productName: product.displayName
                }
            });
        },

        getProductWorld: function (child) {
            if (child.parentCategory) {
                return this.getProductWorld(child.parentCategory);
            } else {
                return child.displayName;
            }
        },

        /**
         * @returns {Array} The current load page events
         */
        getPageEvents: function () {
            let events = digitalData.page.attributes.eventStrings;

            events.push('prodView');
            events.push(anaConsts.Event.PRODUCT_VIEW);
            events.push(anaConsts.Event.PRODUCT_PAGE_VIEW);
            let product = store.getState().product.currentProduct;
            let isColorIQEnabled = skuUtils.showColorIQOnPPage(product);
            if (isColorIQEnabled) {
                events.push(anaConsts.Event.PRODUCT_PAGE_COLORIQ_ENABLED);
            }
            return events;
        },

        /**
         * Builds and returns the data that we want to know about this product
         * @param  {Object} currentProduct The product object to get data from
         * @return  {String} The analytics data for the product
         * Format: ;SKUID;;;;eVar26=SKUID|eVar37=[USE CASE#]|
         *         eVar52=Rec_PrevPgType_CarouselName_AudienceID_ExperienceID
         */
        getProductStrings: function (currentProduct) {
            let previousPageData = digitalData.page.attributes.previousPageData;

            let productString = [
                ';' + currentProduct.attributes.skuId +
                    ';;;;eVar26=' + currentProduct.attributes.skuId,
                'eVar37=' + currentProduct.attributes.customizableSetType
            ];

            const buildeVar52 = () => {
                let parts = [];

                parts.push(
                    (previousPageData.recInfo.isExternalRec ?
                        previousPageData.recInfo.isExternalRec : 'sephora'));

                if (previousPageData.pageType) {
                    parts.push(previousPageData.pageType);
                }

                if (previousPageData.recInfo.componentTitle) {
                    parts.push(previousPageData.recInfo.componentTitle);
                }

                parts.push(previousPageData.recInfo.certonaAudienceId || 'n/a');

                parts.push(previousPageData.recInfo.certonaExperienceId || 'n/a');

                return parts.join('_');
            };

            if (digitalData.page.attributes.previousPageData.recInfo.certonaExperienceId) {
                productString.push('eVar52=' + buildeVar52());
            }

            return productString.join('|').toLowerCase();
        },

        /**
         * Determine the key used later to tell which type of custom set this product is
         * @return {String} One of the following strings indicating the type of custom set
         */
        getCustomizableSetsKey: function (product) {
            if (product.currentSku.configurableOptions) {
                if (product.currentSku.configurableOptions.isFree) {
                    /* Offer the client a set where one item (single and multiple ppage options) is
                    ** customizable and included for FREE.*/
                    return anaConsts.CUSTOMIZABLE_SETS_VARIANTS.IS_CUSTOMIZABLE;
                } else {
                    /* Allow the client to build a set of one SKU (e.g. eyeshadow) of one product
                    ** and receive a free item (e.g. palette) of their choice for FREE.*/
                    return anaConsts.CUSTOMIZABLE_SETS_VARIANTS.IS_CUSTOMIZABLE_CHOOSE_FREE_ITEM;
                }
            } else {
                return anaConsts.CUSTOMIZABLE_SETS_VARIANTS.NOT_CUSTOMIZABLE;
            }
        },

        /**
         * Kick off all the methods that use product data to populate analytics objects
         */
        initializeAnalyticsObjectWithProductData: function () {
            let product = store.getState().product.currentProduct;
            this.populatePrimaryProductObject(product);

            //ToDo: Figure out where this should live
            digitalData.page.attributes.featureVariantKeys =
                digitalData.page.attributes.featureVariantKeys.concat(
                    this.getPageVariants(product)
                );
        },

        getPageVariants: function (currentProduct) {
            let variantKeys = [];

            let {
                ancillarySkus = [],
                currentSku,
                hoveredSku,
                productVideos = [],
                productArticles = [],
                recentlyViewed = [],
                suggestedUsage,
                ymalSkus = []
            } = currentProduct;
            let {
                alternateImages = [],
                ingredientDesc,
                isOnlyFewLeft,
                skuImages
            } = (hoveredSku || currentSku);

            if (currentProduct.skuSelectorType !== skuUtils.skuSwatchType.NONE) {
                variantKeys.push(anaConsts.PAGE_VARIANTS.SWATCHES);
            }

            if (isOnlyFewLeft) {
                variantKeys.push(anaConsts.PAGE_VARIANTS.ONLY_FEW_LEFT);
            }

            if (alternateImages.length) {
                variantKeys.push(anaConsts.PAGE_VARIANTS.ALTERNATE_IMAGES);
            }

            if (productVideos.length) {
                variantKeys.push(anaConsts.PAGE_VARIANTS.HERO_VIDEOS);
            }

            if (suggestedUsage) {
                variantKeys.push(anaConsts.PAGE_VARIANTS.HOW_TO_USE_TAB);
            }

            if (ingredientDesc) {
                variantKeys.push(anaConsts.PAGE_VARIANTS.INGREDIENTS_TAB);
            }

            if (ancillarySkus.length) {
                variantKeys.push(anaConsts.PAGE_VARIANTS.USE_IT_WITH);
            }

            if (productVideos.length) {
                variantKeys.push(anaConsts.PAGE_VARIANTS.EXPLORE_VIDEOS);
            }

            if (productArticles.length) {
                variantKeys.push(anaConsts.PAGE_VARIANTS.EXPLORE_ARTICLES);
            }

            //Photos section under Learn More(Key: 10) is reported in ExploreThisProduct.jsx

            if (ymalSkus.length) {
                variantKeys.push(anaConsts.PAGE_VARIANTS.YOU_MIGHT_ALSO_LIKE);
            }

            //ToDo: '12' - Similar Products Module

            if (recentlyViewed.length) {
                variantKeys.push(anaConsts.PAGE_VARIANTS.RECENTLY_VIEWED);
            }

            if (Sephora.isDesktop() && !skuUtils.isGiftCard(currentSku)) {
                variantKeys.push(anaConsts.PAGE_VARIANTS.FIND_IN_A_STORE);
            }

            return variantKeys;
        }
    };
}());



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/bindingMethods/pages/productPage/productPageBindings.js