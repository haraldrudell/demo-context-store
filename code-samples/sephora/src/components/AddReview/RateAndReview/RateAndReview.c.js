// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var RateAndReview = function () {};

// Added by sephora-jsx-loader.js
RateAndReview.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const FormValidator = require('utils/FormValidator');
const store = require('Store');
const Actions = require('actions/Actions');
const ReactDOM = require('react-dom');
const UI = require('utils/UI');

const MIN_REVIEW_CHARS = 20;
const MAX_REVIEW_CHARS = 2000;

RateAndReview.prototype.componentWillReceiveProps = function (updatedProps) {
    this.setState(updatedProps);
};

RateAndReview.prototype.updatePhotos = function (photos) {
    this.setState({ photos: photos });
};

RateAndReview.prototype.validateForm = function () {
    let fieldsForValidation = [this.starRating, this.reviewText];
    let errors = FormValidator.getErrors(fieldsForValidation);
    let formIsValid = true;
    if (typeof this.state.isRecommended !== 'boolean') {

        //set state to display recommend button error message
        this.setState({
            recommendedError: true
        });
        formIsValid = false;
    } else if (errors.fields.length) {
        formIsValid = false;
    }

    return formIsValid;
};

RateAndReview.prototype.validateStarRating = function () {
    let hasRating = this.starRating.getRating();
    if (!hasRating) {
        this.setState({
            starRatingError: true
        });
    } else if (this.state.starRatingError) {
        this.setState({
            starRatingError: false
        });
    }
};

RateAndReview.prototype.validateReviewText = function () {
    let text = this.reviewText.getValue();

    let isReviewTextValidLength =
        FormValidator.isValidLength(text, MIN_REVIEW_CHARS, MAX_REVIEW_CHARS);

    //set state to update review textarea invalid property
    //only set state when state and validity status differ to avoid rerenders
    if (!isReviewTextValidLength !== this.state.reviewTextError) {
        this.setState({
            reviewTextError: !isReviewTextValidLength
        });
    }

    return isReviewTextValidLength;
};


RateAndReview.prototype.handleRecommendClick = function (isRecommended) {
    this.setState({
        isRecommended: isRecommended,
        recommendedError: null
    });
};

RateAndReview.prototype.openGuideLinesModal = function () {
    store.dispatch(Actions.showInfoModal(true, '', this.getGuidelines()));
};

RateAndReview.prototype.onNext = function () {
    if (this.validateForm()) {
        this.props.onNext({
            reviewTitle: this.titleInput.getValue(),
            reviewText: this.reviewText.getValue(),
            rating: this.starRating.getRating(),
            photos: this.state.photos,
            isRecommended: this.state.isRecommended,
            isFreeSample: this.state.isFreeSample,
            isSephoraEmployee: this.state.isSephoraEmployee
        });
    }
};


// Added by sephora-jsx-loader.js
module.exports = RateAndReview.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/AddReview/RateAndReview/RateAndReview.c.js