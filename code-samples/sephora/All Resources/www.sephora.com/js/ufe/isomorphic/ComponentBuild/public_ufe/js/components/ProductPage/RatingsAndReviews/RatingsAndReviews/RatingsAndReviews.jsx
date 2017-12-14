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
    Sephora.Util.InflatorComps.Comps['RatingsAndReviews'] = function RatingsAndReviews(){
        return RatingsAndReviewsClass;
    }
}
const { space } = require('style');
const { Box, Flex, Text } = require('components/display');
const ReviewsStats = require('components/ProductPage/RatingsAndReviews/ReviewsStats/ReviewsStats');
const BeautyMatchCheckbox =
    require('components/ProductPage/BeautyMatchCheckbox/BeautyMatchCheckbox');
const Divider = require('components/Divider/Divider');
const SectionDivider = require('components/SectionDivider/SectionDivider');
const NoReviews = require('components/ProductPage/RatingsAndReviews/NoReviews/NoReviews');
const NoFilteredReviews = require('components/ProductPage/RatingsAndReviews/NoFilteredReviews/NoFilteredReviews');
const Link = require('components/Link/Link');
const Chevron = require('components/Chevron/Chevron');
const Review = require('components/ProductPage/RatingsAndReviews/Review/Review');
const ProductActions = require('actions/ProductActions');
const Location = require('utils/Location');
const Filters = require('utils/Filters');
const ReviewsFilters = require('components/ProductPage/RatingsAndReviews/ReviewsFilters/' +
    'ReviewsFilters');

const RatingsAndReviews = function () {
    this.state = {
        step: 0,
        hasNewFilter: false,
        currentPage: 0,
        hasReviews: false,
        filtersApplied: {},
        reviews: [],
        reviewStatistics: null,
        showComponent: false
    };
    this.REVIEWS_TO_SHOW = this.props.reviewsToShow || 6;
};

RatingsAndReviews.prototype.render = function () {

    const {
        hasReviews,
        hasNewFilter,
        reviews,
        step,
        reviewStatistics,
        totalReviews,
        user
    } = this.state;

    const {
        id,
        productId
    } = this.props;

    if (!this.state.showComponent) {
        return (<div id={id}></div>);
    }

    const isMobile = Sephora.isMobile();
    const isDesktop = Sephora.isDesktop();

    const isProductReviewsPage = Location.isProductReviewsPage();
    const isCondensedView = isMobile && !isProductReviewsPage;

    let currentProduct = this.props;

    const showMoreReviews = hasReviews && (totalReviews > step);
    let showMoreReviewsText = isCondensedView ?
        <Flex
            cursor='pointer'
            fontSize='h3'
            borderTop={space[2]}
            borderColor='lightGray'
            padding={space[4]}
            marginTop={space[4]}
            marginX={-space[4]}
            marginBottom={-space[4]}
            lineHeight={1}
            alignItems='center'
            justifyContent='space-between'
            onClick={e => this.clickSeeAllReviews(e, productId)}>
            <Text>
                See all reviews
            </Text>
            <Chevron
                direction='right' />
        </Flex>
    :
        (showMoreReviews) ?
            <Box
                marginTop={space[4]}
                borderTop={1}
                borderColor='nearWhite'
                lineHeight={2}
                textAlign='center'>
                <Link
                    padding={space[5]}
                    onClick={this.loadMoreReviews}
                    arrowDirection='down'>
                    Show {this.REVIEWS_TO_SHOW} more reviews
                </Link>
            </Box>
        :
            '';

    let RatingsAndReviewsContent;

    /** When there are no reviews and no new filter
     * it means the product does not have reviews at all
     * -------
     * in other hand if there are no reviews and a there is new filter
     * we understand the filter is the reason for the lack of reviews.
     */
    if (!(hasReviews || hasNewFilter)) {
        RatingsAndReviewsContent = <NoReviews productId={productId}/>;
    } else {
        RatingsAndReviewsContent =
            <div>
                <ReviewsStats
                    reviewStatistics={reviewStatistics}
                    redirectToAddReview={this.redirectToAddReviewPage}
                    productId={productId}/>
                <Box
                    position='relative'
                    minHeight='2em'>
                    { isCondensedView && <Divider marginBottom={space[4]} /> }
                    {
                        /* ReviewFilters component is needed on condensed view since it acts
                        as a centralized mediator that takes control over the Reviews
                        and Beauty match filtering logic.*/
                    }
                    <Box display={isCondensedView ? 'none' : null}>
                        <ReviewsFilters
                            reviewsCount={reviews ? reviews.length : 0}
                            {...currentProduct} />
                    </Box>
                    <Box
                        _css={isDesktop ? {
                            position: 'absolute',
                            top: 0,
                            left: 0
                        } : {}}>
                        <BeautyMatchCheckbox
                            name={Filters.BEAUTY_MATCH_CHECKBOX_TYPES.REVIEW}
                            label='Show reviews'
                            onSelect={this.onBeautyMatchCheckboxToggle}
                            updateOnAction={ProductActions.TYPES.REVIEW_FILTERS_APPLIED}
                            sortBy={Filters.REVIEW_SORT_TYPES[0]}/>
                    </Box>
                </Box>
                {Array.isArray(reviews) && reviews.length > 0 ?
                    <div>
                        {reviews.slice(0, step).map(item =>
                        <Review
                            key={item.reviewId}
                            {...item}
                            isCondensedView={isCondensedView}
                            refreshMethod={this.refresh}
                            seeAllReviews={this.clickSeeAllReviews}
                            productId={item.productId}
                            skuId={item.skuId}
                            currentProduct={currentProduct}
                            user={user}
                        />)
                        }
                        {showMoreReviewsText}
                    </div>
                    :
                    <NoFilteredReviews/>
                }
            </div>;
    }

    return (
        <div id={id}>
            {isProductReviewsPage ||
                <div>
                    <SectionDivider />
                    <Text
                        is='h2'
                        fontSize='h1'
                        lineHeight={1}
                        serif={true}
                        textAlign={isMobile ? 'left' : 'center'}
                        marginBottom={isDesktop ? space[5] : null}>
                        Ratings & Reviews
                    </Text>
                    {isMobile &&
                        <Divider
                            color='lightGray'
                            marginY={space[4]} />
                    }
                </div>
            }
            {RatingsAndReviewsContent}
        </div>
    );

};


// Added by sephora-jsx-loader.js
RatingsAndReviews.prototype.path = 'ProductPage/RatingsAndReviews/RatingsAndReviews';
// Added by sephora-jsx-loader.js
Object.assign(RatingsAndReviews.prototype, require('./RatingsAndReviews.c.js'));
var originalDidMount = RatingsAndReviews.prototype.componentDidMount;
RatingsAndReviews.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: RatingsAndReviews');
if (originalDidMount) originalDidMount.apply(this);
if (RatingsAndReviews.prototype.ctrlr) RatingsAndReviews.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: RatingsAndReviews');
// Added by sephora-jsx-loader.js
RatingsAndReviews.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
RatingsAndReviews.prototype.class = 'RatingsAndReviews';
// Added by sephora-jsx-loader.js
RatingsAndReviews.prototype.getInitialState = function() {
    RatingsAndReviews.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
RatingsAndReviews.prototype.render = wrapComponentRender(RatingsAndReviews.prototype.render);
// Added by sephora-jsx-loader.js
var RatingsAndReviewsClass = React.createClass(RatingsAndReviews.prototype);
// Added by sephora-jsx-loader.js
RatingsAndReviewsClass.prototype.classRef = RatingsAndReviewsClass;
// Added by sephora-jsx-loader.js
Object.assign(RatingsAndReviewsClass, RatingsAndReviews);
// Added by sephora-jsx-loader.js
module.exports = RatingsAndReviewsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/RatingsAndReviews/RatingsAndReviews/RatingsAndReviews.jsx