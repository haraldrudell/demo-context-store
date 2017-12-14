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
    Sephora.Util.InflatorComps.Comps['AddReviewTitle'] = function AddReviewTitle(){
        return AddReviewTitleClass;
    }
}
const {
    site, space
} = require('style');
const Text = require('components/Text/Text');
const Divider = require('components/Divider/Divider');

const AddReviewTitle = function () {};

AddReviewTitle.prototype.render = function () {
    const isMobile = Sephora.isMobile();
    return (
        <div>
            <Text
                is='h1'
                fontSize='h1'
                serif={true}
                textAlign='center'
                lineHeight={2}
                marginY={isMobile ? space[4] : space[5]}
                children={this.props.children} />
            <Divider
                marginBottom={isMobile ? space[5] : space[6]}
                marginX={isMobile ? -site.PADDING_MW : null} />
        </div>
    );
};


// Added by sephora-jsx-loader.js
AddReviewTitle.prototype.path = 'AddReview/AddReviewTitle';
// Added by sephora-jsx-loader.js
AddReviewTitle.prototype.class = 'AddReviewTitle';
// Added by sephora-jsx-loader.js
AddReviewTitle.prototype.getInitialState = function() {
    AddReviewTitle.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
AddReviewTitle.prototype.render = wrapComponentRender(AddReviewTitle.prototype.render);
// Added by sephora-jsx-loader.js
var AddReviewTitleClass = React.createClass(AddReviewTitle.prototype);
// Added by sephora-jsx-loader.js
AddReviewTitleClass.prototype.classRef = AddReviewTitleClass;
// Added by sephora-jsx-loader.js
Object.assign(AddReviewTitleClass, AddReviewTitle);
// Added by sephora-jsx-loader.js
module.exports = AddReviewTitleClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/AddReview/AddReviewTitle/AddReviewTitle.jsx