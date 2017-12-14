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
    Sephora.Util.InflatorComps.Comps['Review'] = function Review(){
        return ReviewClass;
    }
}
const { space } = require('style');
const { Box, Flex, Grid, Image, Text } = require('components/display');
const Divider = require('components/Divider/Divider');
const Ellipsis = require('components/Ellipsis/Ellipsis');
const StarRating = require('components/StarRating/StarRating');
const dateUtils = require('utils/Date');
const ButtonOutline = require('components/Button/ButtonOutline');
const IconCheckmark = require('components/Icon/IconCheckmark');
const Link = require('components/Link/Link');
const ReviewerInfo = require('components/ProductPage/RatingsAndReviews/Review/ReviewerInfo');
const voteHelpfulness = require('services/api/thirdparty/BazaarVoice').voteHelpfulness;
const skuUtils = require('utils/Sku');

const defaultToLongDate = true;
let processPostedDate = postedDate =>
    dateUtils.formatSocialDate(postedDate, defaultToLongDate);

let Review = function () {};

const POSITIVE_VOTE = 'Positive';
const NEGATIVE_VOTE = 'Negative';

Review.prototype.render = function () {
    const isMobile = Sephora.isMobile();

    let reviewedSKUData = skuUtils.getSkuFromProduct(this.props.currentProduct, this.props.skuId);

    const {
        reviewText,
        rating,
        title,
        isRecommended,
        submissionTime,
        totalNegativeFeedbackCount,
        totalPositiveFeedbackCount,
        reviewId,
        videos,
        photos,
        refreshMethod,
        seeAllReviews,
        productId,
        isCondensedView
    } = this.props;

    const ratingsAndDate =
        <Flex
            justifyContent='space-between'
            alignItems='center'
            marginBottom={space[4]}>
            <StarRating
                rating={rating}
                fontSize='h3'/>
            <Text
                fontSize='h5'
                color='silver'>
                {processPostedDate(submissionTime)}
            </Text>
        </Flex>;

    const maxThumbSize = isCondensedView ? 88 : 118;

    return (
    <div>
        {isMobile ?
            <Divider
                marginY={space[4]}
                marginX={-space[4]}
                height={space[2]}
                color='nearWhite' />
        :
            <Divider
                marginY={space[4]} />
        }
        <Grid
            justifyContent='space-between'>
            <Grid.Cell
                width={!isMobile ? 'fill' : null}>
                {isMobile && ratingsAndDate}
                <ReviewerInfo
                    isCondensedView={isCondensedView}
                    {...this.props} />
            </Grid.Cell>
            <Grid.Cell
                display='flex'
                flexDirection='column'
                width={!isMobile ? 648 : null}>
                <div>
                    {isMobile || ratingsAndDate}
                    {reviewedSKUData &&
                        <Flex
                            alignItems='center'
                            lineHeight={2}
                            marginBottom={space[4]}>
                            <Image
                                marginRight={space[2]}
                                rounded={true}
                                width={24} height={24}
                                src={reviewedSKUData.smallImage} />
                            Color: {reviewedSKUData.variationValue}
                        </Flex>
                    }
                    {title &&
                        <Box
                            fontWeight={700}
                            marginBottom={space[3]}>
                            {title}
                        </Box>
                    }
                    <Ellipsis
                        text={!isCondensedView ? 'read more' : ''}
                        isToggle={!isCondensedView}
                        numberOfLines={4}>
                        {reviewText}
                    </Ellipsis>

                    <Grid
                        gutter={space[2]}
                        fit={true}
                        marginTop={space[4]}>
                        {Array.isArray(photos) && photos.map(photo =>
                            <Grid.Cell
                                maxWidth={maxThumbSize}>
                                <Image
                                    key={photo.Id}
                                    src={photo.Sizes.thumbnail.Url} />
                            </Grid.Cell>
                        )}
                        {Array.isArray(videos) && videos.map(video =>
                            <Grid.Cell
                                maxWidth={maxThumbSize}>
                                <Image
                                    key={video.VideoId}
                                    src={`https://img.youtube.com/vi/${video.VideoId}/0.jpg`} />
                            </Grid.Cell>
                        )}
                    </Grid>

                    {(!isCondensedView && isRecommended) &&
                        <Flex
                            alignItems='center'
                            fontSize='h5'
                            marginTop={space[4]}>
                            <IconCheckmark
                                fontSize='.875em'
                                color='green'
                                marginRight={space[2]} />
                            Recommends this product
                        </Flex>
                    }

                </div>

                {isCondensedView ?
                    <Box textAlign='right'>
                        <Link
                            arrowDirection='right'
                            marginTop={space[4]}
                            onClick={e => seeAllReviews(e, productId)}>
                            Show more
                        </Link>
                    </Box>
                :
                    <Flex
                        marginTop='auto'
                        paddingTop={space[4]}
                        justifyContent='flex-end'>
                        <ButtonOutline
                            minWidth={136}
                            paddingX={space[1]}
                            size='sm'
                            onClick={() => voteHelpfulness(NEGATIVE_VOTE, reviewId)
                                .then(() => refreshMethod())}>
                            Not Helpful ({totalNegativeFeedbackCount})
                        </ButtonOutline>
                        <ButtonOutline
                            minWidth={136}
                            paddingX={space[1]}
                            size='sm'
                            marginLeft={space[4]}
                            onClick={() => voteHelpfulness(POSITIVE_VOTE, reviewId)
                                .then(() => refreshMethod())}>
                            Helpful ({totalPositiveFeedbackCount})
                        </ButtonOutline>
                    </Flex>
                }
            </Grid.Cell>
        </Grid>
    </div>
    );
};


// Added by sephora-jsx-loader.js
Review.prototype.path = 'ProductPage/RatingsAndReviews/Review';
// Added by sephora-jsx-loader.js
Review.prototype.class = 'Review';
// Added by sephora-jsx-loader.js
Review.prototype.getInitialState = function() {
    Review.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Review.prototype.render = wrapComponentRender(Review.prototype.render);
// Added by sephora-jsx-loader.js
var ReviewClass = React.createClass(Review.prototype);
// Added by sephora-jsx-loader.js
ReviewClass.prototype.classRef = ReviewClass;
// Added by sephora-jsx-loader.js
Object.assign(ReviewClass, Review);
// Added by sephora-jsx-loader.js
module.exports = ReviewClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/RatingsAndReviews/Review/Review.jsx