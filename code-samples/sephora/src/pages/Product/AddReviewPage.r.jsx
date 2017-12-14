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
    Sephora.Util.InflatorComps.Comps['AddReviewPage'] = function AddReviewPage(){
        return AddReviewPageClass;
    }
}
const AddReviewCarousel = require('components/AddReview/AddReviewCarousel/AddReviewCarousel');

// This is a root component  so it will not render until the child component renders
const AddReviewPage = function () {};

AddReviewPage.prototype.render = function () {
    return <AddReviewCarousel />;
};


// Added by sephora-jsx-loader.js
AddReviewPage.prototype.path = 'Product';
// Added by sephora-jsx-loader.js
AddReviewPage.prototype.isForcedRoot = true;
// Added by sephora-jsx-loader.js
AddReviewPage.prototype.pageClientRender = true;
// Added by sephora-jsx-loader.js
AddReviewPage.prototype.class = 'AddReviewPage';
// Added by sephora-jsx-loader.js
AddReviewPage.prototype.getInitialState = function() {
    AddReviewPage.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
AddReviewPage.prototype.render = wrapComponentRender(AddReviewPage.prototype.render);
// Added by sephora-jsx-loader.js
var AddReviewPageClass = React.createClass(AddReviewPage.prototype);
// Added by sephora-jsx-loader.js
AddReviewPageClass.prototype.classRef = AddReviewPageClass;
// Added by sephora-jsx-loader.js
Object.assign(AddReviewPageClass, AddReviewPage);
// Added by sephora-jsx-loader.js
module.exports = AddReviewPageClass;


// WEBPACK FOOTER //
// ./public_ufe/js/pages/Product/AddReviewPage.r.jsx