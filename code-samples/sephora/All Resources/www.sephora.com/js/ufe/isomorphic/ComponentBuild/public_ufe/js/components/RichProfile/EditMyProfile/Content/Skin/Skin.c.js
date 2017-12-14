// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Skin = function () {};

// Added by sephora-jsx-loader.js
Skin.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;

Skin.prototype.handleSkinConcernSelect = function (skinConcern, e) {
    let concerns = this.state.skinConcerns.slice();
    if (e.target.checked) {
        concerns.push(skinConcern.value);
    } else {
        let itemToRemove = concerns.indexOf(skinConcern.value);
        concerns.splice(itemToRemove, 1);
    }

    this.setState({
        skinConcerns: concerns 
    });
};

Skin.prototype.getData = function () {
    let skinData = {
        biAccount: {
            personalizedInformation: {
                skinType: this.state.skinType,
                skinTone: this.state.skinTone,
                skinConcerns: this.state.skinConcerns
            }
        }
    };
    return skinData;
};


// Added by sephora-jsx-loader.js
module.exports = Skin.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/EditMyProfile/Content/Skin/Skin.c.js