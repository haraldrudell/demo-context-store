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
    Sephora.Util.InflatorComps.Comps['ListsLoves'] = function ListsLoves(){
        return ListsLovesClass;
    }
}
const Carousel = require('components/Carousel/Carousel');
const { Box, Flex, Text } = require('components/display');
const ProductItem = require('components/Product/ProductItem/ProductItem');
const { space } = require('style');
const SkuUtils = require('utils/Sku');
const ListsHeader = require('components/RichProfile/Lists/ListsHeader');

const ListsLoves = function () {

};

ListsLoves.prototype.render = function () {
    let loves = this.props.loves || [];

    const isMobile = Sephora.isMobile();
    const viewAllLovesUrl = isMobile ? '/account/beautybag/loves' : '/shopping-list';
    return (
        <div>
            <ListsHeader
                children='Loves'
                link={(loves.length > 0) ?
                    viewAllLovesUrl : null} />
            { loves.length ?
                <Box
                    marginTop={isMobile ? space[4] : space[5]}>
                    <Carousel
                        displayCount={isMobile ? 2 : 4}
                        totalItems={loves.length}
                        carouselMaxItems={12}
                        flex={true}
                        gutter={space[5]}
                        controlHeight={this.props.imageSize}
                        showArrows={!isMobile}
                        showTouts={true}>
                        {loves.map(product =>
                            <ProductItem
                                key={product.skuId}
                                isWithBackInStockTreatment={
                                    product.actionFlags.backInStockReminderStatus
                                     !==
                                    'notApplicable'
                                }
                                isCountryRestricted={
                                    SkuUtils.isCountryRestricted(product)
                                }
                                showQuickLook={
                                    !SkuUtils.isCountryRestricted(product)
                                }
                                showSignUpForEmail={true}
                                isUseAddToBasket={true}
                                showPrice={true}
                                showMarketingFlags={true}
                                imageSize={this.props.imageSize}
                                rootName={'profile_lists_loves_carousel'}
                                {...product} />
                        )}
                    </Carousel>
                </Box>
            :
                <Text
                    is='p'
                    lineHeight={2}
                    fontSize={!isMobile ? 'h3' : null}
                    marginTop={space[2]}>
                    View all of your favorite items here by
                    {isMobile ? ' ' : <br />}
                    adding them to your Loves list.
                </Text>
            }
        </div>
    );
};


// Added by sephora-jsx-loader.js
ListsLoves.prototype.path = 'RichProfile/Lists/ListsLoves';
// Added by sephora-jsx-loader.js
ListsLoves.prototype.class = 'ListsLoves';
// Added by sephora-jsx-loader.js
ListsLoves.prototype.getInitialState = function() {
    ListsLoves.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ListsLoves.prototype.render = wrapComponentRender(ListsLoves.prototype.render);
// Added by sephora-jsx-loader.js
var ListsLovesClass = React.createClass(ListsLoves.prototype);
// Added by sephora-jsx-loader.js
ListsLovesClass.prototype.classRef = ListsLovesClass;
// Added by sephora-jsx-loader.js
Object.assign(ListsLovesClass, ListsLoves);
// Added by sephora-jsx-loader.js
module.exports = ListsLovesClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/Lists/ListsLoves/ListsLoves.jsx