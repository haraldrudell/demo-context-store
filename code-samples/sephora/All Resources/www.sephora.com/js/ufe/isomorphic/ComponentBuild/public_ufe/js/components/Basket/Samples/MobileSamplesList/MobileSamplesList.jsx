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
    Sephora.Util.InflatorComps.Comps['MobileSamplesList'] = function MobileSamplesList(){
        return MobileSamplesListClass;
    }
}
const { space } = require('style');
const Grid = require('components/Grid/Grid');
const Text = require('components/Text/Text');
const Link = require('components/Link/Link');
const Divider = require('components/Divider/Divider');
const BasketListItem = require('components/Basket/BasketList/BasketListItem');

const MobileSamplesList = function () {
    this.state = {
        basketSamplesList: null,
        basketSamplesCount: 0,
        sampleAllowedQty: 0,
        samplesList: null,
        samplesMessage: ''
    };
};

MobileSamplesList.prototype.render = function () {
    let samples = this.state.basketSamplesList;
    let samplesCount = this.state.basketSamplesCount;

    return (
        samplesCount > 0 ?
            <div>
                <Grid alignItems='baseline'>
                    <Grid.Cell width='fill'>
                        <Text
                            is='p'
                            fontWeight={700}>
                            {samplesCount} sample{samplesCount !== 1 && 's'} added
                        </Text>
                        <Text fontSize='h5'>
                            Choose {this.state.sampleAllowedQty} per order
                        </Text>
                    </Grid.Cell>
                    <Grid.Cell width='fit'>
                        <Link
                            padding={space[2]}
                            margin={-space[2]}
                            arrowDirection='right'
                            fontSize='h5'
                            onClick={(e) => this.openSamples(e)}>
                            View all samples
                        </Link>
                    </Grid.Cell>
                </Grid>
                {samples && samplesCount > 0 ?
                    samples.map((item, index) =>
                        <div key={item.sku ? item.sku.productId : null} >
                            <Divider marginY={space[4]} />
                            <BasketListItem
                                item={item}
                                allowQuantityChange={false} />
                        </div>
                    )
                    : null
                }
            </div>
        : null
    );
};


// Added by sephora-jsx-loader.js
MobileSamplesList.prototype.path = 'Basket/Samples/MobileSamplesList';
// Added by sephora-jsx-loader.js
Object.assign(MobileSamplesList.prototype, require('./MobileSamplesList.c.js'));
var originalDidMount = MobileSamplesList.prototype.componentDidMount;
MobileSamplesList.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: MobileSamplesList');
if (originalDidMount) originalDidMount.apply(this);
if (MobileSamplesList.prototype.ctrlr) MobileSamplesList.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: MobileSamplesList');
// Added by sephora-jsx-loader.js
MobileSamplesList.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
MobileSamplesList.prototype.class = 'MobileSamplesList';
// Added by sephora-jsx-loader.js
MobileSamplesList.prototype.getInitialState = function() {
    MobileSamplesList.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
MobileSamplesList.prototype.render = wrapComponentRender(MobileSamplesList.prototype.render);
// Added by sephora-jsx-loader.js
var MobileSamplesListClass = React.createClass(MobileSamplesList.prototype);
// Added by sephora-jsx-loader.js
MobileSamplesListClass.prototype.classRef = MobileSamplesListClass;
// Added by sephora-jsx-loader.js
Object.assign(MobileSamplesListClass, MobileSamplesList);
// Added by sephora-jsx-loader.js
module.exports = MobileSamplesListClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/Samples/MobileSamplesList/MobileSamplesList.jsx