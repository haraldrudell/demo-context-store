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
    Sephora.Util.InflatorComps.Comps['TryItOnButton'] = function TryItOnButton(){
        return TryItOnButtonClass;
    }
}
const { colors } = require('style');
const { Box } = require('components/display');

const TryItOnButton = function () {};

TryItOnButton.prototype.render = function () {
    return (
        <Box
            circle={true}
            width={48} height={48}
            fontSize='h6'
            fontWeight={700}
            lineHeight={1}
            textAlign='center'
            textTransform='uppercase'
            color='white'
            backgroundColor='black'
            boxShadow={`0 0 4px 0 ${colors.white}`}
            onClick={(e) => this.tryItOn(e)}>
            <Box
                marginTop={1}>
                Try it on
            </Box>
        </Box>
    );
};


// Added by sephora-jsx-loader.js
TryItOnButton.prototype.path = 'VirtualArtist/TryItOnButton';
// Added by sephora-jsx-loader.js
Object.assign(TryItOnButton.prototype, require('./TryItOnButton.c.js'));
var originalDidMount = TryItOnButton.prototype.componentDidMount;
TryItOnButton.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: TryItOnButton');
if (originalDidMount) originalDidMount.apply(this);
if (TryItOnButton.prototype.ctrlr) TryItOnButton.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: TryItOnButton');
// Added by sephora-jsx-loader.js
TryItOnButton.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
TryItOnButton.prototype.class = 'TryItOnButton';
// Added by sephora-jsx-loader.js
TryItOnButton.prototype.getInitialState = function() {
    TryItOnButton.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
TryItOnButton.prototype.render = wrapComponentRender(TryItOnButton.prototype.render);
// Added by sephora-jsx-loader.js
var TryItOnButtonClass = React.createClass(TryItOnButton.prototype);
// Added by sephora-jsx-loader.js
TryItOnButtonClass.prototype.classRef = TryItOnButtonClass;
// Added by sephora-jsx-loader.js
Object.assign(TryItOnButtonClass, TryItOnButton);
// Added by sephora-jsx-loader.js
module.exports = TryItOnButtonClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/VirtualArtist/TryItOnButton/TryItOnButton.jsx