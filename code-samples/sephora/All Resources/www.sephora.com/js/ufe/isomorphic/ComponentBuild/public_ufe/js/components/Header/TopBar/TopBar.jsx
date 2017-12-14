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
    Sephora.Util.InflatorComps.Comps['TopBar'] = function TopBar(){
        return TopBarClass;
    }
}
const { site, space } = require('style');
const { Box, Flex } = require('components/display');
const Container = require('components/Container/Container');
const IconLocate = require('components/Icon/IconLocate');
const IconTruck = require('components/Icon/IconTruck');
const CountrySwitcher = require('components/CountrySwitcher/CountrySwitcher');
const MarketingMessage = require('./MarketingMessage/MarketingMessage');
const UrlUtils = require('utils/Url');

const TopBar = function () {};

TopBar.prototype.render = function () {
    const {
        headerPromo
    } = this.props;

    return (
        <Box
            backgroundColor='black'
            color='white'
            fontSize='h5'>
            <Container>
                <Flex
                    alignItems='center'
                    justifyContent='space-between'
                    height={site.TOP_BAR_HEIGHT}>
                    <div>
                        {headerPromo.length ?
                            <MarketingMessage
                                paddingY={2}
                                marketingMessages={headerPromo} />
                        : null}
                    </div>
                    <Flex
                        marginX={-space[3]}>
                        <Box
                            paddingX={space[3]}
                            paddingY={space[2]}
                            hoverColor='moonGray'
                            href={UrlUtils.getLink('/profile/orders/orderHistory.jsp')}
                            onClick={() => this.trackClick('track order')}
                            data-at={Sephora.debug.dataAt('track_order')}>
                            <IconTruck
                                marginRight='.5em'
                                top='-.125em' />
                            Track Order
                        </Box>
                        <Box
                            paddingX={space[3]}
                            paddingY={space[2]}
                            hoverColor='moonGray'
                            href={UrlUtils.getLink('/store-locations-events')}
                            onClick={() => this.trackClick('find a store')}
                            data-at={Sephora.debug.dataAt('find_in_store')}>
                            <IconLocate
                                marginRight='.5em'
                                fontSize='1.125em' />
                            Find a Store
                        </Box>
                        <CountrySwitcher/>
                    </Flex>
                </Flex>
            </Container>
        </Box>
    );
};


// Added by sephora-jsx-loader.js
TopBar.prototype.path = 'Header/TopBar';
// Added by sephora-jsx-loader.js
Object.assign(TopBar.prototype, require('./TopBar.c.js'));
var originalDidMount = TopBar.prototype.componentDidMount;
TopBar.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: TopBar');
if (originalDidMount) originalDidMount.apply(this);
if (TopBar.prototype.ctrlr) TopBar.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: TopBar');
// Added by sephora-jsx-loader.js
TopBar.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
TopBar.prototype.class = 'TopBar';
// Added by sephora-jsx-loader.js
TopBar.prototype.getInitialState = function() {
    TopBar.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
TopBar.prototype.render = wrapComponentRender(TopBar.prototype.render);
// Added by sephora-jsx-loader.js
var TopBarClass = React.createClass(TopBar.prototype);
// Added by sephora-jsx-loader.js
TopBarClass.prototype.classRef = TopBarClass;
// Added by sephora-jsx-loader.js
Object.assign(TopBarClass, TopBar);
// Added by sephora-jsx-loader.js
module.exports = TopBarClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/TopBar/TopBar.jsx