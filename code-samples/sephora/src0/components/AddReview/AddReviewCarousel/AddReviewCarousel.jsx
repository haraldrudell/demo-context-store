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
    Sephora.Util.InflatorComps.Comps['AddReviewCarousel'] = function AddReviewCarousel(){
        return AddReviewCarouselClass;
    }
}
const { space } = require('style');
const Carousel = require('components/Carousel/Carousel');
const RateAndReview = require('components/AddReview/RateAndReview/RateAndReview');
const SelectShade = require('components/AddReview/SelectShade/SelectShade');
const PostingConfirmation = require('components/AddReview/PostingConfirmation/PostingConfirmation');
const AboutMe = require('components/AddReview/AboutMe/AboutMe');
const Filters = require('utils/Filters');

const AddReviewCarousel = function () {
    this.state = {
        currentProduct: null,
        user: {},
        aboutMeBiTraits: null,
        biAccount: null,
        submitData: {},
        isUserReviewAllowed: false
    };
};

AddReviewCarousel.prototype.render = function () {
    this.addReviewPages = [];
    if (!this.state.currentProduct) {
        return null;
    } else if (this.state.currentProduct.errorCode) {
        return <div>{this.state.currentProduct.errorMessages.join(' ')}</div>;
    }

    let items = this.getItems();
    return this.state.isUserReviewAllowed ? <Carousel
            ref={carousel => this.carousel = carousel }
            totalItems= { items.length }
            displayCount={1}
            gutter= { space[5] }>
            {items}
    </Carousel> : null;
};

AddReviewCarousel.prototype.getItems = function () {
    let showAboutMe = this.state.aboutMeBiTraits && this.state.biAccount;
    let skipShades = this.state.skipShades;
    let items = [];
    if (!skipShades) {
        items.push(this.getShades());
    }
    items.push(this.getRateAndReview());
    if (showAboutMe) {
        items.push(this.getAboutYou());
    }
    items.push(this.getConfirmation());
    return items;
};

AddReviewCarousel.prototype.getShades = function () {
    let key = Filters.ADD_REVIEW_PAGES_NAMES.SHADES;
    this.addReviewPages.push(key);
    return <SelectShade key={key} product={this.state.currentProduct} onNext={this.onNext} />;
};

AddReviewCarousel.prototype.getRateAndReview = function () {
    let key = Filters.ADD_REVIEW_PAGES_NAMES.RATE_AND_REVIEW;
    this.addReviewPages.push(key);
    return <RateAndReview key={key} product={this.state.currentProduct} onNext={this.onNext} />;
};

AddReviewCarousel.prototype.getAboutYou = function () {
    let key = Filters.ADD_REVIEW_PAGES_NAMES.ABOUT_YOU;
    this.addReviewPages.push(key);
    return <AboutMe
        key={key}
        product={this.state.currentProduct}
        biAccount={this.state.biAccount}
        onSubmit={() => this.submitReview(this.state.submitData)}
        aboutMeBiTraits={this.state.aboutMeBiTraits}/>;
};

AddReviewCarousel.prototype.getConfirmation = function () {
    let key = Filters.ADD_REVIEW_PAGES_NAMES.CONFIRMATION;
    this.addReviewPages.push(key);
    let productURL = this.state.currentProduct.targetUrl;
    return <PostingConfirmation key={key} submissionErrors={this.state.submissionErrors}
                                productURL={productURL}/>;
};


// Added by sephora-jsx-loader.js
AddReviewCarousel.prototype.path = 'AddReview/AddReviewCarousel';
// Added by sephora-jsx-loader.js
Object.assign(AddReviewCarousel.prototype, require('./AddReviewCarousel.c.js'));
var originalDidMount = AddReviewCarousel.prototype.componentDidMount;
AddReviewCarousel.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: AddReviewCarousel');
if (originalDidMount) originalDidMount.apply(this);
if (AddReviewCarousel.prototype.ctrlr) AddReviewCarousel.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: AddReviewCarousel');
// Added by sephora-jsx-loader.js
AddReviewCarousel.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
AddReviewCarousel.prototype.class = 'AddReviewCarousel';
// Added by sephora-jsx-loader.js
AddReviewCarousel.prototype.getInitialState = function() {
    AddReviewCarousel.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
AddReviewCarousel.prototype.render = wrapComponentRender(AddReviewCarousel.prototype.render);
// Added by sephora-jsx-loader.js
var AddReviewCarouselClass = React.createClass(AddReviewCarousel.prototype);
// Added by sephora-jsx-loader.js
AddReviewCarouselClass.prototype.classRef = AddReviewCarouselClass;
// Added by sephora-jsx-loader.js
Object.assign(AddReviewCarouselClass, AddReviewCarousel);
// Added by sephora-jsx-loader.js
module.exports = AddReviewCarouselClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/AddReview/AddReviewCarousel/AddReviewCarousel.jsx