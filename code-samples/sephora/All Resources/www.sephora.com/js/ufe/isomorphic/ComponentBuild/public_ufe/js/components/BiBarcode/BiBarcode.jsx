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
    Sephora.Util.InflatorComps.Comps['BiBarcode'] = function BiBarcode(){
        return BiBarcodeClass;
    }
}
const { space } = require('style');
const { Box } = require('components/display');

const BiBarcode = function () {};

BiBarcode.prototype.render = function () {
    return (
        <Box
            display='inline-block'
            backgroundColor='white'
            padding={space[2]}
            border={1}
            borderColor='gray'
            rounded={true}>
            <script
                src={ `/js/ufe/${Sephora.buildMode}/thirdparty/pdf417-min.js` }>
            </script>
            <Box
                is='canvas'
                maxWidth='100%'
                ref={ comp => this.canvas = comp } />
        </Box>
    );
};


// Added by sephora-jsx-loader.js
BiBarcode.prototype.path = 'BiBarcode';
// Added by sephora-jsx-loader.js
Object.assign(BiBarcode.prototype, require('./BiBarcode.c.js'));
var originalDidMount = BiBarcode.prototype.componentDidMount;
BiBarcode.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BiBarcode');
if (originalDidMount) originalDidMount.apply(this);
if (BiBarcode.prototype.ctrlr) BiBarcode.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BiBarcode');
// Added by sephora-jsx-loader.js
BiBarcode.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BiBarcode.prototype.class = 'BiBarcode';
// Added by sephora-jsx-loader.js
BiBarcode.prototype.getInitialState = function() {
    BiBarcode.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BiBarcode.prototype.render = wrapComponentRender(BiBarcode.prototype.render);
// Added by sephora-jsx-loader.js
var BiBarcodeClass = React.createClass(BiBarcode.prototype);
// Added by sephora-jsx-loader.js
BiBarcodeClass.prototype.classRef = BiBarcodeClass;
// Added by sephora-jsx-loader.js
Object.assign(BiBarcodeClass, BiBarcode);
// Added by sephora-jsx-loader.js
module.exports = BiBarcodeClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BiBarcode/BiBarcode.jsx