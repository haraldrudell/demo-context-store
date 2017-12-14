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
    Sephora.Util.InflatorComps.Comps['RecentPurchases'] = function RecentPurchases(){
        return RecentPurchasesClass;
    }
}
const space = require('style').space;
const { Box, Grid } = require('components/display');
const ProductItem = require('components/Product/ProductItem/ProductItem');
const RewardItem = require('components/Reward/RewardItem/RewardItem');
const SkuUtils = require('utils/Sku');
const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;
const SectionContainer = require('../SectionContainer/SectionContainer');

const RecentPurchases = function () {};

RecentPurchases.prototype.render = function () {
    const {
        recentPurchases
    } = this.props;

    const IMAGE_SIZE = IMAGE_SIZES[162];

    return (
        <SectionContainer
            isPrivate={true}
            hasDivider={true}
            title='Review Recent Purchases'>
            <Box
                paddingX={Sephora.isDesktop() ? space[6] : null}>
                <Grid
                    gutter={space[5]}>
                    {recentPurchases.map(purchase =>
                        <Grid.Cell
                            display='flex'
                            width={Sephora.isMobile() ? 1 / 2 : 1 / 4}>
                            {SkuUtils.isBiReward(purchase.sku) ?
                                <RewardItem
                                    showAddFullSize={
                                    purchase.sku.actionFlags.isFullSizeSkuOrderable}
                                    isCountryRestricted={
                                    SkuUtils.isCountryRestricted(purchase.sku)}
                                    isUseWriteReview={true}
                                    showPrice={true}
                                    showMarketingFlags={true}
                                    imageSize={IMAGE_SIZE}
                                    key={purchase.sku.skuId}
                                    skuImages={purchase.sku.skuImages}
                                    {...purchase.sku} />
                            :
                                <ProductItem
                                    isWithBackInStockTreatment={
                                    purchase.sku.actionFlags.backInStockReminderStatus !==
                                    'notApplicable'}
                                    isCountryRestricted={
                                    SkuUtils.isCountryRestricted(purchase.sku)}
                                    showSignUpForEmail={true}
                                    isUseWriteReview={true}
                                    showPrice={true}
                                    showMarketingFlags={true}
                                    imageSize={IMAGE_SIZE}
                                    key={purchase.sku.skuId}
                                    skuImages={purchase.sku.skuImages}
                                    {...purchase.sku} />
                            }
                        </Grid.Cell>
                    )}
                </Grid>
            </Box>
        </SectionContainer>
    );
};


// Added by sephora-jsx-loader.js
RecentPurchases.prototype.path = 'RichProfile/UserProfile/common/RecentPurchases';
// Added by sephora-jsx-loader.js
RecentPurchases.prototype.class = 'RecentPurchases';
// Added by sephora-jsx-loader.js
RecentPurchases.prototype.getInitialState = function() {
    RecentPurchases.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
RecentPurchases.prototype.render = wrapComponentRender(RecentPurchases.prototype.render);
// Added by sephora-jsx-loader.js
var RecentPurchasesClass = React.createClass(RecentPurchases.prototype);
// Added by sephora-jsx-loader.js
RecentPurchasesClass.prototype.classRef = RecentPurchasesClass;
// Added by sephora-jsx-loader.js
Object.assign(RecentPurchasesClass, RecentPurchases);
// Added by sephora-jsx-loader.js
module.exports = RecentPurchasesClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/UserProfile/common/RecentPurchases/RecentPurchases.jsx