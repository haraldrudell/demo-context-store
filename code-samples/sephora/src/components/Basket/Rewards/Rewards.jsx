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
    Sephora.Util.InflatorComps.Comps['Rewards'] = function Rewards(){
        return RewardsClass;
    }
}
const { space } = require('style');
const { Box, Text } = require('components/display');
const Carousel = require('components/Carousel/Carousel');
const Link = require('components/Link/Link');
const RewardItem = require('components/Reward/RewardItem/RewardItem');
const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;

let Rewards = function () {
    this.state = {
        rewardGroups: [],
        currentTab: null
    };
};

Rewards.prototype.render = function () {

    const imageSize = Sephora.isMobile() ? IMAGE_SIZES[162] : IMAGE_SIZES[135];

    let rewardsCarousels = [];
    let rewardTabs = [];
    let rewardTab = [];

    if (Sephora.isMobile()) {
        let counter = 0;
        for (let key in this.state.rewardGroups) {
            ++counter;

            // Reward Point Header
            rewardTab =
                <Text
                    is='h2' fontSize='h1'
                    serif={true}
                    marginBottom={space[3]}
                    marginTop={counter > 1 ? space[5] : null}>
                    {key}
                </Text>;
            rewardsCarousels.push(rewardTab);

            // Rewards
            let rewardList = this.state.rewardGroups[key];
            let rewardsCarousel =
                <Carousel
                    displayCount={2}
                    totalItems={rewardList.length}
                    carouselMaxItems={12}
                    flex={true}
                    gutter={space[5]}
                    controlHeight={imageSize}
                    showArrows={Sephora.isDesktop()}
                    showTouts={true}>
                    {rewardList.map(product =>
                        <RewardItem
                            key={product.skuId}
                            isUseAddToBasket={true}
                            imageSize={imageSize}
                            {...product} />
                    )}
                </Carousel>;
            rewardsCarousels.push(rewardsCarousel);
        }
    } else {
        let groupKeys = Object.keys(this.state.rewardGroups);
        groupKeys.forEach(key => {
            let isCurrentTab = this.state.currentTab === key;

            let dataAt = 'reward_crsl_ttl';
            if (isCurrentTab) {
                dataAt += '_selected';
            }

            rewardTab =
                <Link
                    onClick={this.showCurrentTabRewards.bind(null, key)}
                    textTransform='uppercase'
                    fontSize='h5'
                    fontWeight={700}
                    lineHeight={1}
                    letterSpacing={1}
                    marginTop={-space[1]}
                    marginBottom={space[3]}
                    marginX={space[3]}
                    paddingY={space[1]}
                    borderBottom={2}
                    borderColor={isCurrentTab ? 'currentColor' : 'transparent'}
                    muted={true}
                    isActive={isCurrentTab}
                    data-at={Sephora.debug.dataAt(dataAt)}>
                    {key}
                </Link>;
            rewardTabs.push(rewardTab);
        });

        let rewardList = this.state.rewardGroups[this.state.currentTab];
        if (rewardList) {
            let itemLength = (rewardList) ? rewardList.length : 0;
            let rewardsCarousel =
                <Carousel
                    displayCount={3}
                    totalItems={itemLength}
                    carouselMaxItems={12}
                    flex={true}
                    gutter={space[5]}
                    controlHeight={imageSize}
                    showArrows={Sephora.isDesktop()}
                    showTouts={true}>
                    {rewardList.map(product =>
                        <RewardItem
                            key={product.skuId}
                            isUseAddToBasket={true}
                            showPrice={true}
                            showMarketingFlags={true}
                            imageSize={imageSize}
                            isShortButton={true}
                            {...product} />
                    )}
                </Carousel>;
            rewardsCarousels.push(rewardsCarousel);
        }
    }

    return (
        <div>
            {Sephora.isDesktop() &&
                <Box textAlign='center'>
                    {rewardTabs}
                </Box>
            }
            {rewardsCarousels}
        </div>
    );
};


// Added by sephora-jsx-loader.js
Rewards.prototype.path = 'Basket/Rewards';
// Added by sephora-jsx-loader.js
Object.assign(Rewards.prototype, require('./Rewards.c.js'));
var originalDidMount = Rewards.prototype.componentDidMount;
Rewards.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Rewards');
if (originalDidMount) originalDidMount.apply(this);
if (Rewards.prototype.ctrlr) Rewards.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Rewards');
// Added by sephora-jsx-loader.js
Rewards.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Rewards.prototype.class = 'Rewards';
// Added by sephora-jsx-loader.js
Rewards.prototype.getInitialState = function() {
    Rewards.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Rewards.prototype.render = wrapComponentRender(Rewards.prototype.render);
// Added by sephora-jsx-loader.js
var RewardsClass = React.createClass(Rewards.prototype);
// Added by sephora-jsx-loader.js
RewardsClass.prototype.classRef = RewardsClass;
// Added by sephora-jsx-loader.js
Object.assign(RewardsClass, Rewards);
// Added by sephora-jsx-loader.js
module.exports = RewardsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/Rewards/Rewards.jsx