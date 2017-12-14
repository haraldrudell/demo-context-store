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
    Sephora.Util.InflatorComps.Comps['NoFilteredReviews'] = function NoFilteredReviews(){
        return NoFilteredReviewsClass;
    }
}
const { space } = require('style');
const { Box, Text } = require('components/display');
const Divider = require('components/Divider/Divider');
const ButtonPrimary = require('components/Button/ButtonPrimary');

/**
 * This component is intended to be displayed when
 * there are no results after filtering reviews
 */
let NoFilteredReviews = function () { };

NoFilteredReviews.prototype.render = function () {
    return (
        <Box
            marginTop={space[4]}>
            {Sephora.isMobile() ?
                <Divider
                    color='nearWhite'
                    height={space[2]}
                    marginX={-space[4]} />
                :
                <Divider />
            }
            <Box
                textAlign='center'
                paddingY={space[7]}>
                <Text
                    is='p'
                    marginBottom={space[4]}>
                    Sorry, no reviews match your criteria
                </Text>
                <ButtonPrimary
                    paddingX={space[5]}
                    onClick={() => this.reset()}>
                    Reset
                </ButtonPrimary>
            </Box>
        </Box>
    );
};


// Added by sephora-jsx-loader.js
NoFilteredReviews.prototype.path = 'ProductPage/RatingsAndReviews/NoFilteredReviews';
// Added by sephora-jsx-loader.js
Object.assign(NoFilteredReviews.prototype, require('./NoFilteredReviews.c.js'));
var originalDidMount = NoFilteredReviews.prototype.componentDidMount;
NoFilteredReviews.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: NoFilteredReviews');
if (originalDidMount) originalDidMount.apply(this);
if (NoFilteredReviews.prototype.ctrlr) NoFilteredReviews.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: NoFilteredReviews');
// Added by sephora-jsx-loader.js
NoFilteredReviews.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
NoFilteredReviews.prototype.class = 'NoFilteredReviews';
// Added by sephora-jsx-loader.js
NoFilteredReviews.prototype.getInitialState = function() {
    NoFilteredReviews.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
NoFilteredReviews.prototype.render = wrapComponentRender(NoFilteredReviews.prototype.render);
// Added by sephora-jsx-loader.js
var NoFilteredReviewsClass = React.createClass(NoFilteredReviews.prototype);
// Added by sephora-jsx-loader.js
NoFilteredReviewsClass.prototype.classRef = NoFilteredReviewsClass;
// Added by sephora-jsx-loader.js
Object.assign(NoFilteredReviewsClass, NoFilteredReviews);
// Added by sephora-jsx-loader.js
module.exports = NoFilteredReviewsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/RatingsAndReviews/NoFilteredReviews/NoFilteredReviews.jsx