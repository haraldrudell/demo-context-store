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
    Sephora.Util.InflatorComps.Comps['EmptyGalleryFilterResults'] = function EmptyGalleryFilterResults(){
        return EmptyGalleryFilterResultsClass;
    }
}
const { space } = require('style');
const { Box, Text } = require('components/display');
const Divider = require('components/Divider/Divider');
const ButtonPrimary = require('components/Button/ButtonPrimary');

/**
 * This component is intended to be displayed when
 * there are no results after filtering reviews
 */
let EmptyGalleryFilterResults = function () { };

EmptyGalleryFilterResults.prototype.render = function () {
    return (
        <Box
            textAlign='center'
            paddingY={space[6]}>
            <Text
                is='p'
                marginBottom={space[4]}>
                Sorry, no looks match your criteria
            </Text>
            <ButtonPrimary
                paddingX={space[5]}
                onClick={() => this.reset()}>
                Reset
            </ButtonPrimary>
        </Box>
    );
};


// Added by sephora-jsx-loader.js
EmptyGalleryFilterResults.prototype.path = 'ProductPage/ExploreThisProduct/EmptyGalleryFilterResults';
// Added by sephora-jsx-loader.js
Object.assign(EmptyGalleryFilterResults.prototype, require('./EmptyGalleryFilterResults.c.js'));
var originalDidMount = EmptyGalleryFilterResults.prototype.componentDidMount;
EmptyGalleryFilterResults.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: EmptyGalleryFilterResults');
if (originalDidMount) originalDidMount.apply(this);
if (EmptyGalleryFilterResults.prototype.ctrlr) EmptyGalleryFilterResults.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: EmptyGalleryFilterResults');
// Added by sephora-jsx-loader.js
EmptyGalleryFilterResults.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
EmptyGalleryFilterResults.prototype.class = 'EmptyGalleryFilterResults';
// Added by sephora-jsx-loader.js
EmptyGalleryFilterResults.prototype.getInitialState = function() {
    EmptyGalleryFilterResults.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
EmptyGalleryFilterResults.prototype.render = wrapComponentRender(EmptyGalleryFilterResults.prototype.render);
// Added by sephora-jsx-loader.js
var EmptyGalleryFilterResultsClass = React.createClass(EmptyGalleryFilterResults.prototype);
// Added by sephora-jsx-loader.js
EmptyGalleryFilterResultsClass.prototype.classRef = EmptyGalleryFilterResultsClass;
// Added by sephora-jsx-loader.js
Object.assign(EmptyGalleryFilterResultsClass, EmptyGalleryFilterResults);
// Added by sephora-jsx-loader.js
module.exports = EmptyGalleryFilterResultsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/ExploreThisProduct/EmptyGalleryFilterResults/EmptyGalleryFilterResults.jsx