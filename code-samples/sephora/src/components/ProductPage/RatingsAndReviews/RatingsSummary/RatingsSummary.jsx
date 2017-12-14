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
    Sephora.Util.InflatorComps.Comps['RatingsSummary'] = function RatingsSummary(){
        return RatingsSummaryClass;
    }
}
const { space } = require('style');
const { Box, Flex, Text } = require('components/display');
const Chevron = require('components/Chevron/Chevron');
const Link = require('components/Link/Link');
const StarRating = require('components/StarRating/StarRating');

const RatingsSummary = function () {};

RatingsSummary.prototype.render = function () {
    let currentProduct = this.props;
    let {
        rating,
        reviews
    } = currentProduct;

    reviews = reviews === undefined ? 0 : reviews;
    const label = reviews + ' review' + (reviews !== 1 ? 's' : '');

    return (Sephora.isMobile() ?
        <Flex
            borderTop={1}
            borderColor='lightGray'
            marginX={-space[4]}
            padding={space[4]}
            lineHeight={1}
            alignItems='center'
            onClick={e => this.clickHandler(e, currentProduct)}>
            <StarRating
                fontSize='h2'
                marginRight={space[4]}
                rating={rating} />
            <Text
                fontSize='h3'
                fontWeight={700}
                marginRight='auto'>
                {label}
            </Text>
            {reviews > 0 ?
                <Chevron
                    fontSize='h3'
                    marginRight='.25em'
                    direction='right' />
                :
                <Link
                    primary={true}>
                    Write a review
                </Link>
            }

        </Flex>

        :

        <Box
            onClick={e => this.clickHandler(e)}>
            <StarRating
                display='inline-block'
                top='.0625em'
                marginRight='.5em'
                rating={rating} />
            {label}
        </Box>
    );
};


// Added by sephora-jsx-loader.js
RatingsSummary.prototype.path = 'ProductPage/RatingsAndReviews/RatingsSummary';
// Added by sephora-jsx-loader.js
Object.assign(RatingsSummary.prototype, require('./RatingsSummary.c.js'));
var originalDidMount = RatingsSummary.prototype.componentDidMount;
RatingsSummary.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: RatingsSummary');
if (originalDidMount) originalDidMount.apply(this);
if (RatingsSummary.prototype.ctrlr) RatingsSummary.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: RatingsSummary');
// Added by sephora-jsx-loader.js
RatingsSummary.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
RatingsSummary.prototype.class = 'RatingsSummary';
// Added by sephora-jsx-loader.js
RatingsSummary.prototype.getInitialState = function() {
    RatingsSummary.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
RatingsSummary.prototype.render = wrapComponentRender(RatingsSummary.prototype.render);
// Added by sephora-jsx-loader.js
var RatingsSummaryClass = React.createClass(RatingsSummary.prototype);
// Added by sephora-jsx-loader.js
RatingsSummaryClass.prototype.classRef = RatingsSummaryClass;
// Added by sephora-jsx-loader.js
Object.assign(RatingsSummaryClass, RatingsSummary);
// Added by sephora-jsx-loader.js
module.exports = RatingsSummaryClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/RatingsAndReviews/RatingsSummary/RatingsSummary.jsx