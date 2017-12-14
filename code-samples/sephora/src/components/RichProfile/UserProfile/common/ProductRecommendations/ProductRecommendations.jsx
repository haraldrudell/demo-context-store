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
    Sephora.Util.InflatorComps.Comps['ProductRecommendations'] = function ProductRecommendations(){
        return ProductRecommendationsClass;
    }
}
const SectionContainer = require('../SectionContainer/SectionContainer');
const CertonaCarousel = require('components/Bcc/BccCarousel/BccCarousel');
const COMPONENT_NAMES = require('utils/BCC').COMPONENT_NAMES;
const store = require('Store');
const {
    NUM_RECS_ON_DESKTOP,
    NUM_RECS_ON_MOBILE
} = require('../../settings');
const ProductRecommendations = function () {
    this.state = {
        certonaReady: false,
        carouselChildren: [],
        carouselIndex: 0
    };
};

const recommendedText = 'Recommended for You';

const carouselItemImageSIze = 97;
const itemsPerPage = 4;
let totalItems = Sephora.isMobile() ? NUM_RECS_ON_MOBILE : NUM_RECS_ON_DESKTOP;

ProductRecommendations.prototype.render = function () {
    if (this.state.certonaReady) {
        totalItems = (this.state.carouselChildren.data.length < totalItems) ?
            this.state.carouselChildren.data.length : totalItems;
        return (
        <SectionContainer
            isPrivate
            hasDivider>
            <div>
                <CertonaCarousel
                    carouselIndex={this.state.carouselIndex}
                    name='Certona Carousel'
                    showPrice
                    showReviews
                    showLoves
                    skuImageSize={carouselItemImageSIze}
                    totalItems={totalItems}
                    children={this.state.carouselChildren.data}
                    showTouts
                    showArrows
                    displayCount={itemsPerPage}
                    title='Recommended For You'
                    showMarketingFlags
                    componentType={COMPONENT_NAMES.CAROUSEL}
                />
            </div>
        </SectionContainer>
        );
    } else {
        return null;
    }
};


// Added by sephora-jsx-loader.js
ProductRecommendations.prototype.path = 'RichProfile/UserProfile/common/ProductRecommendations';
// Added by sephora-jsx-loader.js
Object.assign(ProductRecommendations.prototype, require('./ProductRecommendations.c.js'));
var originalDidMount = ProductRecommendations.prototype.componentDidMount;
ProductRecommendations.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ProductRecommendations');
if (originalDidMount) originalDidMount.apply(this);
if (ProductRecommendations.prototype.ctrlr) ProductRecommendations.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ProductRecommendations');
// Added by sephora-jsx-loader.js
ProductRecommendations.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ProductRecommendations.prototype.class = 'ProductRecommendations';
// Added by sephora-jsx-loader.js
ProductRecommendations.prototype.getInitialState = function() {
    ProductRecommendations.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ProductRecommendations.prototype.render = wrapComponentRender(ProductRecommendations.prototype.render);
// Added by sephora-jsx-loader.js
var ProductRecommendationsClass = React.createClass(ProductRecommendations.prototype);
// Added by sephora-jsx-loader.js
ProductRecommendationsClass.prototype.classRef = ProductRecommendationsClass;
// Added by sephora-jsx-loader.js
Object.assign(ProductRecommendationsClass, ProductRecommendations);
// Added by sephora-jsx-loader.js
module.exports = ProductRecommendationsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/UserProfile/common/ProductRecommendations/ProductRecommendations.jsx