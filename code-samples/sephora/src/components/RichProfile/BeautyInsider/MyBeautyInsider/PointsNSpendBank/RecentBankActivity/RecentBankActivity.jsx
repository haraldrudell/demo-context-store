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
    Sephora.Util.InflatorComps.Comps['RecentBankActivity'] = function RecentBankActivity(){
        return RecentBankActivityClass;
    }
}
const { space } = require('style');
const { Box, Flex, Text } = require('components/display');

const PointsNSpendGrid = require('components/RichProfile/BeautyInsider/MyBeautyInsider/PointsNSpendBank/PointsNSpendGrid/PointsNSpendGrid');
const BankActivityTabs = require('components/RichProfile/BeautyInsider/MyBeautyInsider/PointsNSpendBank/BankActivityTabs');
const BIPointsWarnings = require('components/RichProfile/BeautyInsider/MyBeautyInsider/PointsNSpendBank/BIPointsWarnings');
const BIPointsDisclaimer = require('components/RichProfile/BeautyInsider/MyBeautyInsider/PointsNSpendBank/BIPointsDisclaimer');
const Link = require('components/Link/Link');

const POINTS_EARNED_TAB = 0;
const POINTS_SPEND_TAB = 1;

const RecentBankActivity = function () {
    this.state = {
        activeTab: POINTS_EARNED_TAB,
        activities: [],
        shouldShowMore: false
    };
};

RecentBankActivity.prototype.render = function () {
    let TabContent = null;

    switch (this.state.activeTab) {
        case 0:
            TabContent = <PointsNSpendGrid
                activities={this.state.activities}
                type='Earned' />;
            break;
        case 1:
            TabContent = <PointsNSpendGrid
                activities={this.state.activities}
                type='Spend' />;
            break;
        default:
            TabContent = null;
    }

    return (
        <div>
            <Flex
                justifyContent='space-between'
                alignItems='baseline'>
                <Text
                    is='h2'
                    fontSize='h1'
                    lineHeight={2}
                    serif={true}
                    marginBottom={Sephora.isDesktop() ? space[5] : space[4]}>
                    Recent Activity
                </Text>
                {
                    this.state.shouldShowMore &&
                    <Link
                        href='/profile/BeautyInsider/MyPoints'
                        primary={true}
                        padding={space[2]}
                        margin={-space[2]}>
                        View all activity
                    </Link>
                }
            </Flex>
            {
                this.state.activities.length
                    ?
                    <div>
                        <BankActivityTabs>
                            <Box
                                disabled={this.state.activeTab === POINTS_EARNED_TAB}
                                onClick={() => {
                                    this.setState({ activeTab: POINTS_EARNED_TAB });
                                }}>
                                Points
                            </Box>
                            <Box
                                disabled={this.state.activeTab === POINTS_SPEND_TAB}
                                onClick={() => {
                                    this.setState({ activeTab: POINTS_SPEND_TAB });
                                }}>
                                Spend &#8224;
                            </Box>
                        </BankActivityTabs>
                        {TabContent}
                    </div>
                    :
                    <BIPointsWarnings noPoints />
            }
            <BIPointsDisclaimer />
        </div>
    );
};


// Added by sephora-jsx-loader.js
RecentBankActivity.prototype.path = 'RichProfile/BeautyInsider/MyBeautyInsider/PointsNSpendBank/RecentBankActivity';
// Added by sephora-jsx-loader.js
Object.assign(RecentBankActivity.prototype, require('./RecentBankActivity.c.js'));
var originalDidMount = RecentBankActivity.prototype.componentDidMount;
RecentBankActivity.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: RecentBankActivity');
if (originalDidMount) originalDidMount.apply(this);
if (RecentBankActivity.prototype.ctrlr) RecentBankActivity.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: RecentBankActivity');
// Added by sephora-jsx-loader.js
RecentBankActivity.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
RecentBankActivity.prototype.class = 'RecentBankActivity';
// Added by sephora-jsx-loader.js
RecentBankActivity.prototype.getInitialState = function() {
    RecentBankActivity.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
RecentBankActivity.prototype.render = wrapComponentRender(RecentBankActivity.prototype.render);
// Added by sephora-jsx-loader.js
var RecentBankActivityClass = React.createClass(RecentBankActivity.prototype);
// Added by sephora-jsx-loader.js
RecentBankActivityClass.prototype.classRef = RecentBankActivityClass;
// Added by sephora-jsx-loader.js
Object.assign(RecentBankActivityClass, RecentBankActivity);
// Added by sephora-jsx-loader.js
module.exports = RecentBankActivityClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/BeautyInsider/MyBeautyInsider/PointsNSpendBank/RecentBankActivity/RecentBankActivity.jsx