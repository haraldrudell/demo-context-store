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
    Sephora.Util.InflatorComps.Comps['BccProductFinder'] = function BccProductFinder(){
        return BccProductFinderClass;
    }
}
const { space, site } = require('style');
const { Box, Image, Text } = require('components/display');
const ProductFinderGrid = require('components/ProductFinderGrid/ProductFinderGrid');

const BccProductFinder = function () {
    this.state = {
        isQuizSubmitted: false,
        quizResults: []
    };
};

BccProductFinder.prototype.render = function () {
    const isMobile = Sephora.isMobile();
    const MAX_PRODUCTS = 20;
    const quizResults = this.state.quizResults.slice(0, MAX_PRODUCTS);

    const flushMargin = Sephora.isMobile() && !this.props.nested
        ? -site.PADDING_MW
        : null;

    return (
        this.state.isQuizSubmitted
            ?
            <div>
                <Box
                    marginX={flushMargin}
                    marginBottom={isMobile ? space[4] : space[6]}>
                    <Image
                        cursor='pointer'
                        display='block'
                        marginX='auto'
                        src={this.props.resultsImagePath}
                        onClick={() => {
                            this.openProductFinderModal();
                        }} />
                </Box>
                <Box
                    marginLeft={!isMobile ? space[5] : null}>
                    {quizResults.length
                        ?
                            <ProductFinderGrid
                                products={quizResults} />
                        :
                            <Text
                                is='p'
                                color='error'
                                textAlign={isMobile ? 'center' : null}>
                                We’re sorry, something went wrong. Please try again.
                            </Text>
                    }
                </Box>
                <Box
                    marginTop={isMobile ? space[4] : space[6]}
                    marginX={flushMargin}>
                    <Image
                        display='block'
                        marginX='auto'
                        src={this.props.bottomImagePath} />
                </Box>
            </div>
            :
            <Box
                marginX={flushMargin}>
                <Image
                    cursor='pointer'
                    display='block'
                    marginX='auto'
                    src={this.props.launchImagePath}
                    onClick={() => {
                        this.openProductFinderModal();
                    }} />
            </Box>
    );
};


// Added by sephora-jsx-loader.js
BccProductFinder.prototype.path = 'Bcc/BccProductFinder';
// Added by sephora-jsx-loader.js
Object.assign(BccProductFinder.prototype, require('./BccProductFinder.c.js'));
var originalDidMount = BccProductFinder.prototype.componentDidMount;
BccProductFinder.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BccProductFinder');
if (originalDidMount) originalDidMount.apply(this);
if (BccProductFinder.prototype.ctrlr) BccProductFinder.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BccProductFinder');
// Added by sephora-jsx-loader.js
BccProductFinder.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BccProductFinder.prototype.class = 'BccProductFinder';
// Added by sephora-jsx-loader.js
BccProductFinder.prototype.getInitialState = function() {
    BccProductFinder.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BccProductFinder.prototype.render = wrapComponentRender(BccProductFinder.prototype.render);
// Added by sephora-jsx-loader.js
var BccProductFinderClass = React.createClass(BccProductFinder.prototype);
// Added by sephora-jsx-loader.js
BccProductFinderClass.prototype.classRef = BccProductFinderClass;
// Added by sephora-jsx-loader.js
Object.assign(BccProductFinderClass, BccProductFinder);
// Added by sephora-jsx-loader.js
module.exports = BccProductFinderClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Bcc/BccProductFinder/BccProductFinder.jsx