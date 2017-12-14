// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var BiInfoCard = function () {};

// Added by sephora-jsx-loader.js
BiInfoCard.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const biApi = require('services/api/beautyInsider');


BiInfoCard.prototype.ctrlr = function () {
    biApi.getBiPoints(this.props.user.profileId).then(biInfo => {
        this.setState({
            realTimeVIBMessages: biInfo.realTimeVIBMessages,
            beautyBankPoints: biInfo.beautyBankPoints
        });
    });
};


// Added by sephora-jsx-loader.js
module.exports = BiInfoCard.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BiTopBar/BiInfoCard/BiInfoCard.c.js