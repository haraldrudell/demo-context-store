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
    Sephora.Util.InflatorComps.Comps['AddReviewNote'] = function AddReviewNote(){
        return AddReviewNoteClass;
    }
}
const {
    measure, space
} = require('style');
const Text = require('components/Text/Text');
const Link = require('components/Link/Link');

const AddReviewNote = function () {};

AddReviewNote.prototype.render = function () {
    return (
        <Text
            is='p'
            fontSize='h5'
            lineHeight={2}
            marginTop={space[5]}
            marginBottom={space[6]}
            maxWidth={measure.BASE}>
            <b>Note:</b>
            <br />
            Unless otherwise noted, any information you supply will become
            part of your public profile when you submit your review.
            {' '}
            <Link
                primary={true}
                href='/terms-of-use'>
                See Terms of Use
            </Link>
        </Text>
    );
};


// Added by sephora-jsx-loader.js
AddReviewNote.prototype.path = 'AddReview/AddReviewNote';
// Added by sephora-jsx-loader.js
AddReviewNote.prototype.class = 'AddReviewNote';
// Added by sephora-jsx-loader.js
AddReviewNote.prototype.getInitialState = function() {
    AddReviewNote.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
AddReviewNote.prototype.render = wrapComponentRender(AddReviewNote.prototype.render);
// Added by sephora-jsx-loader.js
var AddReviewNoteClass = React.createClass(AddReviewNote.prototype);
// Added by sephora-jsx-loader.js
AddReviewNoteClass.prototype.classRef = AddReviewNoteClass;
// Added by sephora-jsx-loader.js
Object.assign(AddReviewNoteClass, AddReviewNote);
// Added by sephora-jsx-loader.js
module.exports = AddReviewNoteClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/AddReview/AddReviewNote/AddReviewNote.jsx