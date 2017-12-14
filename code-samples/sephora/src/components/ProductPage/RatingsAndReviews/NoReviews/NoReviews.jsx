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
    Sephora.Util.InflatorComps.Comps['NoReviews'] = function NoReviews(){
        return NoReviewsClass;
    }
}
const { space } = require('style');
const { Box, Text } = require('components/display');
const Link = require('components/Link/Link');
const StarRating = require('components/StarRating/StarRating');

const NoReviews = function () {
};

NoReviews.prototype.render = function () {
    return (
        <Box
            textAlign='center'>
            <StarRating
                rating={0}
                marginX='auto'
                fontSize='h1' />
            <Text
                is='p'
                fontSize='h3'
                marginY={space[4]}
                fontWeight={700}>
                0 reviews
            </Text>
            <Text
                is='p'
                marginBottom={space[5]}>
                Be the first to review this product
            </Text>
            <Link
                padding={space[3]}
                margin={-space[3]}
                primary={true}
                onClick={e => this.clickHandler(e, this.props.productId)}>
                Write a review
            </Link>
        </Box>
    );
};


// Added by sephora-jsx-loader.js
NoReviews.prototype.path = 'ProductPage/RatingsAndReviews/NoReviews';
// Added by sephora-jsx-loader.js
Object.assign(NoReviews.prototype, require('./NoReviews.c.js'));
var originalDidMount = NoReviews.prototype.componentDidMount;
NoReviews.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: NoReviews');
if (originalDidMount) originalDidMount.apply(this);
if (NoReviews.prototype.ctrlr) NoReviews.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: NoReviews');
// Added by sephora-jsx-loader.js
NoReviews.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
NoReviews.prototype.class = 'NoReviews';
// Added by sephora-jsx-loader.js
NoReviews.prototype.getInitialState = function() {
    NoReviews.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
NoReviews.prototype.render = wrapComponentRender(NoReviews.prototype.render);
// Added by sephora-jsx-loader.js
var NoReviewsClass = React.createClass(NoReviews.prototype);
// Added by sephora-jsx-loader.js
NoReviewsClass.prototype.classRef = NoReviewsClass;
// Added by sephora-jsx-loader.js
Object.assign(NoReviewsClass, NoReviews);
// Added by sephora-jsx-loader.js
module.exports = NoReviewsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/RatingsAndReviews/NoReviews/NoReviews.jsx