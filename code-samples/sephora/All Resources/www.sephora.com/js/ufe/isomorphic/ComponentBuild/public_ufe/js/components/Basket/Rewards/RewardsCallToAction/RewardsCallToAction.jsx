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
    Sephora.Util.InflatorComps.Comps['RewardsCallToAction'] = function RewardsCallToAction(){
        return RewardsCallToActionClass;
    }
}
const { space } = require('style');
const { Box, Flex, Text } = require('components/display');
const Link = require('components/Link/Link');
const Chevron = require('components/Chevron/Chevron');
const ButtonOutline = require('components/Button/ButtonOutline');
const MobileRewardsInBasket = require('../MobileRewardsInBasket/MobileRewardsInBasket');

const RewardsCallToAction = function () {
    this.state = {
        isLoggedIn: false,
        isBI: false,
        biPoints: null,
        basketItemCount: 0,
        isRewardInBasket: false,
        signInHandlerTriggered: false
    };
};

RewardsCallToAction.prototype.render = function () {
    const ctaText = 'Redeem your rewards';

    let biCTA = () =>
        <div onClick={Sephora.isMobile() ? this.openRewards : null}>
            <Text
                is='p'
                color='black'>
                You have <b
                    data-at={Sephora.debug.dataAt('bsk_bi_points')}
                >{this.state.biPoints}</b> Beauty Insider points
            </Text>
            {Sephora.isMobile() ?
                <ButtonOutline
                    marginTop={space[2]}
                    block={true}>
                    {ctaText}
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
                        {ctaText}
                    </Text>
                    <Chevron
                        direction={this.props.isShowRewards ? 'up' : 'down'} />
                </Flex>
            }
        </div>;

    let nonBiCTA = () =>
        <div onClick={this.openBiRegister}>
            <Text
                is='p'
                color='black'>
                Earn <b>{this.state.biPoints} points</b> today
            </Text>
            {Sephora.isMobile() ?
                <ButtonOutline
                    marginTop={space[2]}
                    block={true}>
                    Join Beauty Insider
                </ButtonOutline>
                :
                <div>
                    <Link primary={true}>
                        Join
                    </Link> Beauty Insider
                </div>
            }
        </div>;

    let isMobileWithRewards = Sephora.isMobile() && this.state.isRewardInBasket;

    return (
        <div>
            {isMobileWithRewards &&
                <MobileRewardsInBasket />
            }

            <Box textAlign='center'>
                {!isMobileWithRewards && this.state.isBI && biCTA()}

                {!isMobileWithRewards && this.state.isLoggedIn && !this.state.isBI && nonBiCTA()}

                {!isMobileWithRewards && !this.state.isLoggedIn &&
                    <div onClick={(e) => this.signInHandler(e)}>
                        <Text is='p'>
                            <Link primary={true}>
                                Sign in
                        </Link>
                            {' '}
                            to see your Beauty Insider points
                        <br />
                            &amp; redeem your rewards
                    </Text>
                    </div>
                }
            </Box>
        </div>
    );
};


// Added by sephora-jsx-loader.js
RewardsCallToAction.prototype.path = 'Basket/Rewards/RewardsCallToAction';
// Added by sephora-jsx-loader.js
Object.assign(RewardsCallToAction.prototype, require('./RewardsCallToAction.c.js'));
var originalDidMount = RewardsCallToAction.prototype.componentDidMount;
RewardsCallToAction.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: RewardsCallToAction');
if (originalDidMount) originalDidMount.apply(this);
if (RewardsCallToAction.prototype.ctrlr) RewardsCallToAction.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: RewardsCallToAction');
// Added by sephora-jsx-loader.js
RewardsCallToAction.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
RewardsCallToAction.prototype.class = 'RewardsCallToAction';
// Added by sephora-jsx-loader.js
RewardsCallToAction.prototype.getInitialState = function() {
    RewardsCallToAction.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
RewardsCallToAction.prototype.render = wrapComponentRender(RewardsCallToAction.prototype.render);
// Added by sephora-jsx-loader.js
var RewardsCallToActionClass = React.createClass(RewardsCallToAction.prototype);
// Added by sephora-jsx-loader.js
RewardsCallToActionClass.prototype.classRef = RewardsCallToActionClass;
// Added by sephora-jsx-loader.js
Object.assign(RewardsCallToActionClass, RewardsCallToAction);
// Added by sephora-jsx-loader.js
module.exports = RewardsCallToActionClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/Rewards/RewardsCallToAction/RewardsCallToAction.jsx