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
    Sephora.Util.InflatorComps.Comps['Samples'] = function Samples(){
        return SamplesClass;
    }
}
const { space } = require('style');
const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;
const { Grid } = require('components/display');
const SampleItem = require('components/Product/SampleItem/SampleItem');

const Samples = function () {
    this.state = {
        samplesList: null,
        allowedQtyPerOrder: 0
    };
};

Samples.prototype.render = function () {
    const itemSpacing = space[5];
    let samples = this.state.samplesList;
    return (
        <Grid
            marginBottom={-itemSpacing}
            gutter={Sephora.isMobile() ? itemSpacing : space[3]}>
            {samples &&
                samples.map((sample, index) =>
                    <Grid.Cell
                        display='flex'
                        width={Sephora.isMobile() ? 1 / 2 : 1 / 6}
                        paddingBottom={itemSpacing}>
                        <SampleItem
                            key={index}
                            imageSize={Sephora.isMobile() ? IMAGE_SIZES[162] : IMAGE_SIZES[97]}
                            imagePath={sample.gridImage}
                            brandName={sample.variationValue}
                            maxSampleQty={this.state.allowedQtyPerOrder}
                            type={'sample'}
                            isToolTipEnabled={true}
                            {...sample} />
                    </Grid.Cell>
                )
            }
        </Grid>
    );
};


// Added by sephora-jsx-loader.js
Samples.prototype.path = 'Basket/Samples';
// Added by sephora-jsx-loader.js
Object.assign(Samples.prototype, require('./Samples.c.js'));
var originalDidMount = Samples.prototype.componentDidMount;
Samples.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Samples');
if (originalDidMount) originalDidMount.apply(this);
if (Samples.prototype.ctrlr) Samples.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Samples');
// Added by sephora-jsx-loader.js
Samples.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Samples.prototype.class = 'Samples';
// Added by sephora-jsx-loader.js
Samples.prototype.getInitialState = function() {
    Samples.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Samples.prototype.render = wrapComponentRender(Samples.prototype.render);
// Added by sephora-jsx-loader.js
var SamplesClass = React.createClass(Samples.prototype);
// Added by sephora-jsx-loader.js
SamplesClass.prototype.classRef = SamplesClass;
// Added by sephora-jsx-loader.js
Object.assign(SamplesClass, Samples);
// Added by sephora-jsx-loader.js
module.exports = SamplesClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/Samples/Samples.jsx