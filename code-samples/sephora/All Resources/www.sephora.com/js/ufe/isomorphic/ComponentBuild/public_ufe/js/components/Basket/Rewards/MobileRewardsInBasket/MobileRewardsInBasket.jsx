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
    Sephora.Util.InflatorComps.Comps['MobileRewardsInBasket'] = function MobileRewardsInBasket(){
        return MobileRewardsInBasketClass;
    }
}
const { space } = require('style');
const Grid = require('components/Grid/Grid');
const Text = require('components/Text/Text');
const Link = require('components/Link/Link');
const Divider = require('components/Divider/Divider');
const BasketListItem = require('../../BasketList/BasketListItem');

const MobileRewardsInBasket = function () {
    this.state = {
        availablePoints: 0,
        rewards: []
    };
};

MobileRewardsInBasket.prototype.render = function () {

    let rewardsCount = this.state.rewards.length;

    return (
        <div>
            <Grid alignItems='baseline'>
                <Grid.Cell width='fill'>
                    <Text
                        is='p'
                        fontWeight={700}>
                        {rewardsCount} reward{rewardsCount !== 1 && 's'} added
                    </Text>
                    <Text fontSize='h5'>
                        <b>{this.state.availablePoints}</b> points remaining
                    </Text>
                </Grid.Cell>
                <Grid.Cell width='fit'>
                    <Link
                        padding={space[2]}
                        margin={-space[2]}
                        arrowDirection='right'
                        fontSize='h5'
                        onClick={this.openRewards}>
                        View all rewards
                    </Link>
                </Grid.Cell>
            </Grid>

            {this.state.rewards.map((item) =>
                <div>
                    <Divider marginY={space[4]} />
                    <BasketListItem item={item} allowQuantityChange={false}/>
                </div>
            )}
        </div>
    );
};


// Added by sephora-jsx-loader.js
MobileRewardsInBasket.prototype.path = 'Basket/Rewards/MobileRewardsInBasket';
// Added by sephora-jsx-loader.js
Object.assign(MobileRewardsInBasket.prototype, require('./MobileRewardsInBasket.c.js'));
var originalDidMount = MobileRewardsInBasket.prototype.componentDidMount;
MobileRewardsInBasket.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: MobileRewardsInBasket');
if (originalDidMount) originalDidMount.apply(this);
if (MobileRewardsInBasket.prototype.ctrlr) MobileRewardsInBasket.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: MobileRewardsInBasket');
// Added by sephora-jsx-loader.js
MobileRewardsInBasket.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
MobileRewardsInBasket.prototype.class = 'MobileRewardsInBasket';
// Added by sephora-jsx-loader.js
MobileRewardsInBasket.prototype.getInitialState = function() {
    MobileRewardsInBasket.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
MobileRewardsInBasket.prototype.render = wrapComponentRender(MobileRewardsInBasket.prototype.render);
// Added by sephora-jsx-loader.js
var MobileRewardsInBasketClass = React.createClass(MobileRewardsInBasket.prototype);
// Added by sephora-jsx-loader.js
MobileRewardsInBasketClass.prototype.classRef = MobileRewardsInBasketClass;
// Added by sephora-jsx-loader.js
Object.assign(MobileRewardsInBasketClass, MobileRewardsInBasket);
// Added by sephora-jsx-loader.js
module.exports = MobileRewardsInBasketClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/Rewards/MobileRewardsInBasket/MobileRewardsInBasket.jsx