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
    Sephora.Util.InflatorComps.Comps['ReviewsStats'] = function ReviewsStats(){
        return ReviewsStatsClass;
    }
}
const { space } = require('style');
const { Box, Flex, Grid, Text } = require('components/display');
const StarRating = require('components/StarRating/StarRating');
const HistogramChart = require('components/ProductPage/RatingsAndReviews/ReviewsStats/HistogramChart');
const Link = require('components/Link/Link');
const Location = require('utils/Location');

let percentage = (maxValue, actualValue) => Math.round((100 * actualValue) / maxValue);

let ReviewsStats = function () {};

ReviewsStats.prototype.render = function () {
    const isDesktop = Sephora.isDesktop();

    let { reviewStatistics, redirectToAddReview, productId } = this.props;
    if (!reviewStatistics) {
        return null;
    }

    let {
        ratingDistribution,
        totalReviewCount,
        averageOverallRating,
        recommendedCount
    } = reviewStatistics;

    let recommendedPercentage = percentage(totalReviewCount, recommendedCount);

    return (
        <Box
            maxWidth={800}
            marginX='auto'
            marginBottom={isDesktop ? space[7] : space[6]}>
            <Flex
                justifyContent='space-between'
                alignItems='baseline'
                marginBottom={space[4]}>
                <Text
                    fontSize='h3'
                    fontWeight={700}>
                    {totalReviewCount} review{totalReviewCount > 1 && 's'}
                </Text>
                <Link
                    primary={true}
                    onClick={() => redirectToAddReview(productId)}>
                    Write a review
                </Link>
            </Flex>
            <Grid
                gutter={isDesktop ? space[7] : null}
                alignItems='center'>
                <Grid.Cell
                    width={isDesktop ? 1 / 2 : null}>
                    <Grid
                        alignItems='flex-end'
                        textAlign='center'
                        fontSize='h3'
                        lineHeight={2}
                        justifyContent='center'>
                        <Grid.Cell
                            width={1 / 2}>
                            <StarRating
                                rating={averageOverallRating}
                                fontSize='h1'
                                marginX='auto'
                                marginBottom={space[4]} />
                            {parseFloat(averageOverallRating).toFixed(1)} / 5 stars
                        </Grid.Cell>

                        {recommendedPercentage >= 80 &&
                            <Grid.Cell
                                width={1 / 2}>
                                <Box
                                    fontSize={48}
                                    lineHeight={1}
                                    marginBottom={space[1]}>
                                    {recommendedPercentage}
                                    <Text
                                        is='sup'
                                        fontSize={20}>
                                        %
                                    </Text>
                                </Box>
                                would recommend
                            </Grid.Cell>
                        }
                    </Grid>
                </Grid.Cell>
                {(isDesktop || Location.isProductReviewsPage()) &&
                    <Grid.Cell
                        width={isDesktop ? 1 / 2 : null}
                        order={isDesktop ? -1 : null}
                        marginTop={!isDesktop ? space[5] : null}>
                        <HistogramChart
                            ratingDistribution={ratingDistribution}
                            totalReviewCount={totalReviewCount}
                            percentage={percentage}/>
                    </Grid.Cell>
                }
            </Grid>
        </Box>
    );
};


// Added by sephora-jsx-loader.js
ReviewsStats.prototype.path = 'ProductPage/RatingsAndReviews/ReviewsStats';
// Added by sephora-jsx-loader.js
ReviewsStats.prototype.class = 'ReviewsStats';
// Added by sephora-jsx-loader.js
ReviewsStats.prototype.getInitialState = function() {
    ReviewsStats.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ReviewsStats.prototype.render = wrapComponentRender(ReviewsStats.prototype.render);
// Added by sephora-jsx-loader.js
var ReviewsStatsClass = React.createClass(ReviewsStats.prototype);
// Added by sephora-jsx-loader.js
ReviewsStatsClass.prototype.classRef = ReviewsStatsClass;
// Added by sephora-jsx-loader.js
Object.assign(ReviewsStatsClass, ReviewsStats);
// Added by sephora-jsx-loader.js
module.exports = ReviewsStatsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/RatingsAndReviews/ReviewsStats/ReviewsStats.jsx