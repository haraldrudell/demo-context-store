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
    Sephora.Util.InflatorComps.Comps['AllBankActivity'] = function AllBankActivity(){
        return AllBankActivityClass;
    }
}
const { space } = require('style');
const { Box, Text } = require('components/display');

const PointsNSpendGrid = require('components/RichProfile/BeautyInsider/MyBeautyInsider/PointsNSpendBank/PointsNSpendGrid/PointsNSpendGrid');
const BankActivityTabs = require('components/RichProfile/BeautyInsider/MyBeautyInsider/PointsNSpendBank/BankActivityTabs');
const BIPointsWarnings = require('components/RichProfile/BeautyInsider/MyBeautyInsider/PointsNSpendBank/BIPointsWarnings');
const BIPointsDisclaimer = require('components/RichProfile/BeautyInsider/MyBeautyInsider/PointsNSpendBank/BIPointsDisclaimer');

const Container = require('components/Container/Container');
const Link = require('components/Link/Link');

const POINTS_EARNED_TAB = 0;
const POINTS_SPEND_TAB = 1;
const MAX_ACTIVITIES = 150;

const AllBankActivity = function () {
    this.state = {
        activeTab: POINTS_EARNED_TAB,
        activities: [],
        offset: 0,
        shouldShowMore: false
    };
};

AllBankActivity.prototype.render = function () {
    let activities = this.state.activities;

    const hasReachedMaxActivities = activities.length === MAX_ACTIVITIES;

    if (hasReachedMaxActivities) {
        activities = activities.slice(0, MAX_ACTIVITIES);
    }

    let TabContent = null;

    switch (this.state.activeTab) {
        case 0:
            TabContent = <PointsNSpendGrid
                activities={activities}
                type='Earned' />;
            break;
        case 1:
            TabContent = <PointsNSpendGrid
                activities={activities}
                type='Spend' />;
            break;
        default:
            TabContent = null;
    }

    return (
        <Container>
            <Text
                is='h1'
                fontSize='h1'
                lineHeight={2}
                serif={true}
                paddingBottom={space[4]}
                borderBottom={2}
                borderColor='nearWhite'
                marginBottom={space[2]}>
                Beauty Insider Activity
            </Text>
            {
                activities.length
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
            {hasReachedMaxActivities &&
                <Text
                    is='p'
                    textAlign='center'
                    padding={space[4]}
                    lineHeight={2}
                    backgroundColor='nearWhite'
                    marginTop={space[4]}
                    fontWeight={500}>
                    {`Only your most recent ${MAX_ACTIVITIES} records are available to display.`}
                </Text>
            }
            {(this.state.shouldShowMore && !hasReachedMaxActivities) &&
                <Link
                    fontSize={Sephora.isMobile() ? 'h5' : null}
                    padding={space[4]}
                    display='block'
                    marginX='auto'
                    arrowDirection='down'
                    onClick={e => this.showMoreActivities(e)}>
                    View more transactions
                </Link>
            }
            <BIPointsDisclaimer />
        </Container>
    );
};


// Added by sephora-jsx-loader.js
AllBankActivity.prototype.path = 'RichProfile/BeautyInsider/MyBeautyInsider/PointsNSpendBank/AllBankActivity';
// Added by sephora-jsx-loader.js
Object.assign(AllBankActivity.prototype, require('./AllBankActivity.c.js'));
var originalDidMount = AllBankActivity.prototype.componentDidMount;
AllBankActivity.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: AllBankActivity');
if (originalDidMount) originalDidMount.apply(this);
if (AllBankActivity.prototype.ctrlr) AllBankActivity.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: AllBankActivity');
// Added by sephora-jsx-loader.js
AllBankActivity.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
AllBankActivity.prototype.class = 'AllBankActivity';
// Added by sephora-jsx-loader.js
AllBankActivity.prototype.getInitialState = function() {
    AllBankActivity.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
AllBankActivity.prototype.render = wrapComponentRender(AllBankActivity.prototype.render);
// Added by sephora-jsx-loader.js
var AllBankActivityClass = React.createClass(AllBankActivity.prototype);
// Added by sephora-jsx-loader.js
AllBankActivityClass.prototype.classRef = AllBankActivityClass;
// Added by sephora-jsx-loader.js
Object.assign(AllBankActivityClass, AllBankActivity);
// Added by sephora-jsx-loader.js
module.exports = AllBankActivityClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/BeautyInsider/MyBeautyInsider/PointsNSpendBank/AllBankActivity/AllBankActivity.jsx