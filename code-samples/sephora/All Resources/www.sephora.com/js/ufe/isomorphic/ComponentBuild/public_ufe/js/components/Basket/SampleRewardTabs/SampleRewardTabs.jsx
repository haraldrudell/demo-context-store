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
    Sephora.Util.InflatorComps.Comps['SampleRewardTabs'] = function SampleRewardTabs(){
        return SampleRewardTabsClass;
    }
}
const { colors, space } = require('style');
const { Box, Flex, Grid } = require('components/display');
const Chevron = require('components/Chevron/Chevron');
const SamplesCallToAction = require('components/Basket/Samples/SamplesCallToAction/SamplesCallToAction');
const RewardsCallToAction = require('components/Basket/Rewards/RewardsCallToAction/RewardsCallToAction');
const Rewards = require('components/Basket/Rewards/Rewards');
const isShowRewards = require('actions/RewardActions').isShowRewards;
const Samples = require('components/Basket/Samples/Samples');

let SampleRewardTabs = function () {
    this.state = {
        isShowRewards: false,
        isShowSamples: false
    };
};

SampleRewardTabs.prototype.render = function () {

    const tabSpace = space[2];
    const tabHeight = 65;

    const styles = {
        tab: {
            position: 'relative',
            cursor: 'pointer',
            width: '100%',
            borderWidth: 2,
            borderColor: colors.lightGray,
            '& [data-cta]': {
                transition: 'color .2s'
            },
            '&:hover [data-cta]': {
                color: colors.gray
            }
        },
        tabOpen: {
            borderBottomColor: colors.white,
            paddingBottom: tabSpace
        },
        tabContent: {
            padding: space[5],
            borderWidth: 2,
            marginTop: -2,
            borderColor: colors.lightGray
        }
    };

    return (
        <div>
            <Grid gutter={tabSpace}>
                <Grid.Cell width={1 / 2}>
                    <Box
                        _css={[
                            styles.tab,
                            this.state.isShowSamples && styles.tabOpen
                        ]}
                        onClick={this.toggleSamples}
                        data-at={Sephora.debug.dataAt('bsk_samples_tab')}>
                        <Flex
                            flexDirection='column'
                            justifyContent='center'
                            paddingX={space[3]}
                            height={tabHeight}>
                            <SamplesCallToAction
                                isShowSamples={this.state.isShowSamples} />
                        </Flex>
                    </Box>
                </Grid.Cell>
                <Grid.Cell width={1 / 2}>
                    <Box
                        _css={[
                            styles.tab,
                            this.state.isShowRewards && styles.tabOpen
                        ]}
                        onClick={this.toggleRewards}
                        data-at={Sephora.debug.dataAt('bsk_reward_tab')}>
                        <Flex
                            flexDirection='column'
                            justifyContent='center'
                            paddingX={space[3]}
                            height={tabHeight}>
                            <RewardsCallToAction
                                isShowRewards={this.state.isShowRewards} />
                        </Flex>
                    </Box>
                </Grid.Cell>
            </Grid>
            {this.state.isShowSamples && !this.state.isShowRewards &&
                <Box _css={styles.tabContent}>
                    <Samples />
                </Box>
            }
            {this.state.isShowRewards && !this.state.isShowSamples &&
                <Box _css={styles.tabContent}>
                    <Rewards />
                </Box>
            }
        </div>
    );
};


// Added by sephora-jsx-loader.js
SampleRewardTabs.prototype.path = 'Basket/SampleRewardTabs';
// Added by sephora-jsx-loader.js
Object.assign(SampleRewardTabs.prototype, require('./SampleRewardTabs.c.js'));
var originalDidMount = SampleRewardTabs.prototype.componentDidMount;
SampleRewardTabs.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: SampleRewardTabs');
if (originalDidMount) originalDidMount.apply(this);
if (SampleRewardTabs.prototype.ctrlr) SampleRewardTabs.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: SampleRewardTabs');
// Added by sephora-jsx-loader.js
SampleRewardTabs.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
SampleRewardTabs.prototype.class = 'SampleRewardTabs';
// Added by sephora-jsx-loader.js
SampleRewardTabs.prototype.getInitialState = function() {
    SampleRewardTabs.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
SampleRewardTabs.prototype.render = wrapComponentRender(SampleRewardTabs.prototype.render);
// Added by sephora-jsx-loader.js
var SampleRewardTabsClass = React.createClass(SampleRewardTabs.prototype);
// Added by sephora-jsx-loader.js
SampleRewardTabsClass.prototype.classRef = SampleRewardTabsClass;
// Added by sephora-jsx-loader.js
Object.assign(SampleRewardTabsClass, SampleRewardTabs);
// Added by sephora-jsx-loader.js
module.exports = SampleRewardTabsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/SampleRewardTabs/SampleRewardTabs.jsx