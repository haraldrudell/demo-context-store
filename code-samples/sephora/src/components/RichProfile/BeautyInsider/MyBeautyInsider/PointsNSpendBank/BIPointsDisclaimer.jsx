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
    Sephora.Util.InflatorComps.Comps['BIPointsDisclaimer'] = function BIPointsDisclaimer(){
        return BIPointsDisclaimerClass;
    }
}
const { space } = require('style');
const { Box, Text } = require('components/display');
const Link = require('components/Link/Link');

const BIPointsDisclaimer = function () { };

BIPointsDisclaimer.prototype.render = function () {
    return (
        <Box
            color='silver'
            fontSize='h5'
            lineHeight={2}
            marginTop={space[4]}>
            <Text
                is='p'
                marginBottom='.75em'>
                &#8224; You receive one point for every dollar spend on merchandise
                (excludes the purchase of egift certificates, gift cards, taxes
                and/or shipping) online, in Sephora retail stores or in Sephora
                inside JCPenney locations.
            </Text>
            <Text
                is='p'
                marginBottom='.75em'>
                The dollar amount you spend in a year counts toward your Beauty Insider status.
                Points carry over from year to year. Year-to-date spend resets every year on
                January 1. Details from last year are available here, and you can view your previous
                purchase history in your <Link primary={true} href='/profile/Lists'>Lists</Link>.
            </Text>
            <Text
                is='p'>
                Beauty Bank Totals and Spend details from transactions on or before July 1, 2014
                are not available for online viewing.
            </Text>
        </Box>
    );
};


// Added by sephora-jsx-loader.js
BIPointsDisclaimer.prototype.path = 'RichProfile/BeautyInsider/MyBeautyInsider/PointsNSpendBank';
// Added by sephora-jsx-loader.js
BIPointsDisclaimer.prototype.class = 'BIPointsDisclaimer';
// Added by sephora-jsx-loader.js
BIPointsDisclaimer.prototype.getInitialState = function() {
    BIPointsDisclaimer.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BIPointsDisclaimer.prototype.render = wrapComponentRender(BIPointsDisclaimer.prototype.render);
// Added by sephora-jsx-loader.js
var BIPointsDisclaimerClass = React.createClass(BIPointsDisclaimer.prototype);
// Added by sephora-jsx-loader.js
BIPointsDisclaimerClass.prototype.classRef = BIPointsDisclaimerClass;
// Added by sephora-jsx-loader.js
Object.assign(BIPointsDisclaimerClass, BIPointsDisclaimer);
// Added by sephora-jsx-loader.js
module.exports = BIPointsDisclaimerClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/BeautyInsider/MyBeautyInsider/PointsNSpendBank/BIPointsDisclaimer.jsx