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
    Sephora.Util.InflatorComps.Comps['RecentReviews'] = function RecentReviews(){
        return RecentReviewsClass;
    }
}
/* eslint-disable max-len */
const { space, lineHeights } = require('style');
const { Box, Grid, Text } = require('components/display');
const Container = require('components/Container/Container');
const ProductImage = require('components/Product/ProductImage/ProductImage');
const Ellipsis = require('components/Ellipsis/Ellipsis');
const StarRating = require('components/StarRating/StarRating');
const skuUtils = require('utils/Sku');
const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;
const SectionContainer = require('../SectionContainer/SectionContainer');

const RecentReviews = function () { };

RecentReviews.prototype.render = function () {
    const {
        isPrivate,
        nickname,
        profileId
    } = this.props;

    const isMobile = Sephora.isMobile();

    let reviewsData = this.state.reviewsData;

    let userAllReviewsUrl = Sephora.configurationSettings.bvUserAllReviewsUrl +
        `${profileId}/profile.htm`;

    const lineHeight = lineHeights[2];

    return (
        <SectionContainer
            hasDivider={true}
            title={isPrivate ? 'My Recent Reviews' : 'Recent Reviews'}
            link={userAllReviewsUrl}>
            <Grid
                gutter={!isMobile ? space[5] : null}>
            {reviewsData && reviewsData.map(data =>
                <Grid.Cell
                    width={!isMobile ? '50%' : null}>
                    <Box
                        href={data.product.targetUrl}
                        lineHeight={lineHeight}
                        _css={!isMobile ? {
                            boxShadow: '0 0 5px 0 rgba(0,0,0,0.15)',
                            padding: space[4]
                        } : {}}>
                        <Grid
                            gutter={isMobile ? space[4] : space[5]}
                            marginBottom={space[3]}>
                            <Grid.Cell width='fit'>
                                <ProductImage
                                    skuImages={data.product.currentSku.skuImages}
                                    size={isMobile ? IMAGE_SIZES[97] : IMAGE_SIZES[162]} />
                            </Grid.Cell>
                            <Grid.Cell width='fill'>
                                <Text
                                    display='block'
                                    fontWeight={700}
                                    textTransform='uppercase'>
                                    {data.product.brand.displayName}
                                </Text>
                                <Text>{data.product.displayName}</Text>
                                <Box
                                    marginTop={space[4]}>
                                    <Box
                                        display='inline-block'
                                        fontSize={isMobile ? 'h3' : 'h2'}
                                        marginRight='.5em'
                                        verticalAlign='text-bottom'>
                                        <StarRating
                                            rating={data.review.rating} />
                                    </Box>
                                    <Text>
                                        ({isPrivate ? 'My' : nickname + '\'s'} rating)
                                    </Text>
                                </Box>
                            </Grid.Cell>
                        </Grid>
                        <Text
                            is='h4'
                            fontSize='h3'
                            fontWeight={700}
                            marginBottom={space[1]}>
                            {data.review.title}
                        </Text>
                        <Ellipsis
                            lineHeight={lineHeight}
                            text='read more'
                            isLink={true}
                            numberOfLines={4}>
                            {data.review.reviewText}
                        </Ellipsis>
                    </Box>
                </Grid.Cell>
            )}
            </Grid>
        </SectionContainer>
    );
};


// Added by sephora-jsx-loader.js
RecentReviews.prototype.path = 'RichProfile/UserProfile/common/RecentReviews';
// Added by sephora-jsx-loader.js
Object.assign(RecentReviews.prototype, require('./RecentReviews.c.js'));
var originalDidMount = RecentReviews.prototype.componentDidMount;
RecentReviews.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: RecentReviews');
if (originalDidMount) originalDidMount.apply(this);
if (RecentReviews.prototype.ctrlr) RecentReviews.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: RecentReviews');
// Added by sephora-jsx-loader.js
RecentReviews.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
RecentReviews.prototype.class = 'RecentReviews';
// Added by sephora-jsx-loader.js
RecentReviews.prototype.getInitialState = function() {
    RecentReviews.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
RecentReviews.prototype.render = wrapComponentRender(RecentReviews.prototype.render);
// Added by sephora-jsx-loader.js
var RecentReviewsClass = React.createClass(RecentReviews.prototype);
// Added by sephora-jsx-loader.js
RecentReviewsClass.prototype.classRef = RecentReviewsClass;
// Added by sephora-jsx-loader.js
Object.assign(RecentReviewsClass, RecentReviews);
// Added by sephora-jsx-loader.js
module.exports = RecentReviewsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/UserProfile/common/RecentReviews/RecentReviews.jsx