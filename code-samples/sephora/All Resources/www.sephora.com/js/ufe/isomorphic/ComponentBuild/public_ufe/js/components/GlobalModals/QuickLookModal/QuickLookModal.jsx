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
    Sephora.Util.InflatorComps.Comps['QuickLookModal'] = function QuickLookModal(){
        return QuickLookModalClass;
    }
}
const {
 space
} = require('style');
const ProductQuickLookModal = require('components/GlobalModals/QuickLookModal/ProductQuickLookModal/ProductQuickLookModal');
const RewardSampleQuickLookModal = require('components/GlobalModals/QuickLookModal/RewardSampleQuickLookModal/RewardSampleQuickLookModal');
const urlUtils = require('utils/Url');
const skuUtils = require('utils/Sku');
const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;

const QuickLookModal = function () {
    this.state = {
        isOpen: false,
        currentSku: null
    };
};

QuickLookModal.prototype.render = function () {
    let currentSku = this.state.currentSku || this.getDefaultSku(this.props.product);

    const imageSize = IMAGE_SIZES[300];
    const leftColWidth = imageSize + space[5];

    if (this.props.skuType === skuUtils.skuTypes.STANDARD) {
        return (
            <ProductQuickLookModal
                isOpen={this.props.isOpen}
                requestClose={this.requestClose}
                product={this.props.product}
                currentSku={currentSku}
                imageSize={imageSize}
                leftColWidth={leftColWidth}
                matchSku={urlUtils.getParamsByName('shade_code')}
                isCertonaProduct={this.props.isCertonaProduct} />
        );
    } else {
        return (
            <RewardSampleQuickLookModal
                isOpen={this.props.isOpen}
                requestClose={this.requestClose}
                product={this.props.product}
                currentSku={this.props.sku}
                skuType={this.props.skuType}
                imageSize={imageSize}
                leftColWidth={leftColWidth} />
        );
    }
};


// Added by sephora-jsx-loader.js
QuickLookModal.prototype.path = 'GlobalModals/QuickLookModal';
// Added by sephora-jsx-loader.js
Object.assign(QuickLookModal.prototype, require('./QuickLookModal.c.js'));
var originalDidMount = QuickLookModal.prototype.componentDidMount;
QuickLookModal.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: QuickLookModal');
if (originalDidMount) originalDidMount.apply(this);
if (QuickLookModal.prototype.ctrlr) QuickLookModal.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: QuickLookModal');
// Added by sephora-jsx-loader.js
QuickLookModal.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
QuickLookModal.prototype.class = 'QuickLookModal';
// Added by sephora-jsx-loader.js
QuickLookModal.prototype.getInitialState = function() {
    QuickLookModal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
QuickLookModal.prototype.render = wrapComponentRender(QuickLookModal.prototype.render);
// Added by sephora-jsx-loader.js
var QuickLookModalClass = React.createClass(QuickLookModal.prototype);
// Added by sephora-jsx-loader.js
QuickLookModalClass.prototype.classRef = QuickLookModalClass;
// Added by sephora-jsx-loader.js
Object.assign(QuickLookModalClass, QuickLookModal);
// Added by sephora-jsx-loader.js
module.exports = QuickLookModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/QuickLookModal/QuickLookModal.jsx