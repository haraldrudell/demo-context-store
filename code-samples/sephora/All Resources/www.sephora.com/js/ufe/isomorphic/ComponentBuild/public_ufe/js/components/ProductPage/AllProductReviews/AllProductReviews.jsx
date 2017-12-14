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
    Sephora.Util.InflatorComps.Comps['AllProductReviews'] = function AllProductReviews(){
        return AllProductReviewsClass;
    }
}
const space = require('style').space;
const Link = require('components/Link/Link');
const { Text } = require('components/display');
const Chevron = require('components/Chevron/Chevron');
const Container = require('components/Container/Container');
const Divider = require('components/Divider/Divider');
const RatingsAndReviews = require('components/ProductPage/RatingsAndReviews/RatingsAndReviews/RatingsAndReviews');

const AllProductReviews = function () {
    this.state = {
        product: {}
    };
};

AllProductReviews.prototype.render = function () {
    let product = this.state.product;
    return (
        <div>
            <Link
                display='flex'
                width='100%'
                alignItems='center'
                padding={space[4]}
                lineHeight={2}
                onClick={() => this.goBackToProductPage(product.currentSku.targetUrl)}>
                <Chevron
                    direction='left'
                    marginRight='1em' />
                <Text
                    truncate={true}>
                    {product.brand &&
                        <Text
                            textTransform='uppercase'
                            fontWeight={700}>
                            {product.brand.displayName}
                            {' '}
                        </Text>
                    }
                    {product.displayName}
                </Text>
            </Link>
            <Divider
                marginBottom={space[4]} />
            <Container>
                {product.productId && <RatingsAndReviews
                    {...product}/>
                }
            </Container>
        </div>
    );
};


// Added by sephora-jsx-loader.js
AllProductReviews.prototype.path = 'ProductPage/AllProductReviews';
// Added by sephora-jsx-loader.js
Object.assign(AllProductReviews.prototype, require('./AllProductReviews.c.js'));
var originalDidMount = AllProductReviews.prototype.componentDidMount;
AllProductReviews.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: AllProductReviews');
if (originalDidMount) originalDidMount.apply(this);
if (AllProductReviews.prototype.ctrlr) AllProductReviews.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: AllProductReviews');
// Added by sephora-jsx-loader.js
AllProductReviews.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
AllProductReviews.prototype.class = 'AllProductReviews';
// Added by sephora-jsx-loader.js
AllProductReviews.prototype.getInitialState = function() {
    AllProductReviews.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
AllProductReviews.prototype.render = wrapComponentRender(AllProductReviews.prototype.render);
// Added by sephora-jsx-loader.js
var AllProductReviewsClass = React.createClass(AllProductReviews.prototype);
// Added by sephora-jsx-loader.js
AllProductReviewsClass.prototype.classRef = AllProductReviewsClass;
// Added by sephora-jsx-loader.js
Object.assign(AllProductReviewsClass, AllProductReviews);
// Added by sephora-jsx-loader.js
module.exports = AllProductReviewsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/AllProductReviews/AllProductReviews.jsx