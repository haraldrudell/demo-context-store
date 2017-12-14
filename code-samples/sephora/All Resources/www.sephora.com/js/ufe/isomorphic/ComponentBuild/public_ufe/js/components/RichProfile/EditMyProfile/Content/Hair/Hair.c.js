// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Hair = function () {};

// Added by sephora-jsx-loader.js
Hair.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;

Hair.prototype.handleHairConcernSelect = function (hairConcern, e) {
    let concerns = this.state.hairConcerns.slice();
    if (e.target.checked) {
        concerns.push(hairConcern.value);
    } else {
        let itemToRemove = concerns.indexOf(hairConcern.value);
        concerns.splice(itemToRemove, 1);
    }

    this.setState({
        hairConcerns: concerns 
    });
};

Hair.prototype.handleHairDescriptionSelect = function (hairDescription, e) {
    let descriptions = this.state.hairDescriptions.slice();
    if (e.target.checked) {
        descriptions.push(hairDescription.value);
    } else {
        let itemToRemove = descriptions.indexOf(hairDescription.value);
        descriptions.splice(itemToRemove, 1);
    }

    this.setState({
        hairDescriptions: descriptions 
    });
};

Hair.prototype.getData = function () {
    let hairData = {
        biAccount: {
            personalizedInformation: {
                hairColor: this.state.hairColor,
                hairDescrible: this.state.hairDescriptions,
                hairConcerns: this.state.hairConcerns
            }
        }
    };
    return hairData;
};


// Added by sephora-jsx-loader.js
module.exports = Hair.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/EditMyProfile/Content/Hair/Hair.c.js