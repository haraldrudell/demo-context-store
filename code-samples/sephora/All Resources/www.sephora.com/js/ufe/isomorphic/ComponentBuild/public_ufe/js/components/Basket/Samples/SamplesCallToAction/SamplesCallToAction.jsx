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
    Sephora.Util.InflatorComps.Comps['SamplesCallToAction'] = function SamplesCallToAction(){
        return SamplesCallToActionClass;
    }
}
const { space } = require('style');
const { Box, Flex, Text } = require('components/display');
const Chevron = require('components/Chevron/Chevron');
const ButtonOutline = require('components/Button/ButtonOutline');
const basketUtils = require('utils/Basket');

const SamplesCallToAction = function () {
    this.state = {
        samplesList: null,
        allowedQtyPerOrder: 0,
        samplesMessage: '',
        addedSamplesList: []
    };
};

SamplesCallToAction.prototype.render = function () {
    let samples = this.state.samplesList;
    const callToActionText = 'Select your samples';

    return (
            <div>
                {!(Sephora.isMobile() && this.state.addedSamplesList.length) ?
                    <Box textAlign='center'>
                        <Text
                            is='p'
                            color='black'>
                            Get <b
                                data-at={Sephora.debug.dataAt('bsk_max_samples')}
                            >{this.state.allowedQtyPerOrder}</b> free samples with every order
                        </Text>
                        {Sephora.isMobile() ?
                            <ButtonOutline
                                marginTop={space[2]}
                                block={true}
                                onClick={(e) => this.openSamples(e)}>
                                {callToActionText}
                            </ButtonOutline>
                            :
                            <Flex
                                isInline={true}
                                marginTop={space[1]}
                                alignItems='center'
                                fontSize='h5'
                                data-cta={true}>
                                <Text
                                    textTransform='uppercase'
                                    fontWeight={700}
                                    marginRight={space[2]}>
                                    {callToActionText}
                                </Text>
                                <Chevron
                                    direction={this.props.isShowSamples ? 'up' : 'down'} />
                            </Flex>
                        }
                    </Box>
                    : null
                }
            </div>
    );
};


// Added by sephora-jsx-loader.js
SamplesCallToAction.prototype.path = 'Basket/Samples/SamplesCallToAction';
// Added by sephora-jsx-loader.js
Object.assign(SamplesCallToAction.prototype, require('./SamplesCallToAction.c.js'));
var originalDidMount = SamplesCallToAction.prototype.componentDidMount;
SamplesCallToAction.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: SamplesCallToAction');
if (originalDidMount) originalDidMount.apply(this);
if (SamplesCallToAction.prototype.ctrlr) SamplesCallToAction.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: SamplesCallToAction');
// Added by sephora-jsx-loader.js
SamplesCallToAction.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
SamplesCallToAction.prototype.class = 'SamplesCallToAction';
// Added by sephora-jsx-loader.js
SamplesCallToAction.prototype.getInitialState = function() {
    SamplesCallToAction.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
SamplesCallToAction.prototype.render = wrapComponentRender(SamplesCallToAction.prototype.render);
// Added by sephora-jsx-loader.js
var SamplesCallToActionClass = React.createClass(SamplesCallToAction.prototype);
// Added by sephora-jsx-loader.js
SamplesCallToActionClass.prototype.classRef = SamplesCallToActionClass;
// Added by sephora-jsx-loader.js
Object.assign(SamplesCallToActionClass, SamplesCallToAction);
// Added by sephora-jsx-loader.js
module.exports = SamplesCallToActionClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/Samples/SamplesCallToAction/SamplesCallToAction.jsx