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
    Sephora.Util.InflatorComps.Comps['RecentOrders'] = function RecentOrders(){
        return RecentOrdersClass;
    }
}
const space = require('style').space;
const { Box, Flex, Grid, Text } = require('components/display');
const Link = require('components/Link/Link');
const Chevron = require('components/Chevron/Chevron');
const Divider = require('components/Divider/Divider');
const Container = require('components/Container/Container');
const ButtonOutline = require('components/Button/ButtonOutline');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const OrderUtils = require('utils/Order');
const AccountLayout = require('components/RichProfile/MyAccount/AccountLayout/AccountLayout');
const PleaseSignInBlock = require('components/RichProfile/MyAccount/PleaseSignIn');

const RecentOrders = function () {
    this.state = {
        numOrders: null,
        numPagesRetrieved: 0,
        numPagesTotal: null,
        recentOrders: null
    };
};

RecentOrders.prototype.ordersLoaded = function (e) {
    return this.state.recentOrders !== null;
};

RecentOrders.prototype.render = function () {
    return (
        <AccountLayout
            section='account'
            page='recent orders'
            title='Recent Orders'>

            {!Sephora.isRootRender && this.isUserReady() &&
            <div>
                {!this.isUserAuthenticated() &&
                <PleaseSignInBlock />
                }

                {this.isUserAuthenticated() &&
                <Box marginTop={space[5]}>
                    {this.ordersLoaded() &&
                        this.state.recentOrders.length === 0 &&
                    <Text is='h2' fontSize='h3'>
                        You have no recent orders.
                    </Text>
                    }

                    {this.ordersLoaded() &&
                        this.state.recentOrders.length > 0 &&
                    <div>
                        {Sephora.isDesktop() &&
                        <Box marginBottom={space[5]}>
                            <Grid
                                fontWeight={500}
                                lineHeight={2}
                                gutter={space[3]}>
                                <Grid.Cell width={1 / 4}>
                                    Order date
                                </Grid.Cell>
                                <Grid.Cell width={1 / 4}>
                                    Order number
                                </Grid.Cell>
                                <Grid.Cell width={2 / 4}>
                                    Shipped on
                                </Grid.Cell>
                            </Grid>
                            <Divider marginTop={space[3]} />
                        </Box>
                        }
                        {this.state.recentOrders.map((order, idx) =>
                        <Box key={idx} data-at={Sephora.debug.dataAt('item_row')}>
                            {idx > 0 &&
                            <Divider marginY={space[5]} />
                            }
                            <Grid
                                gutter={space[3]}>
                                <Grid.Cell
                                    width={Sephora.isDesktop() ? 1 / 4 : null}>
                                    <Grid
                                        gutter={space[3]}
                                        marginBottom={space[1]}>
                                        {Sephora.isMobile() &&
                                        <Grid.Cell width='40%'>
                                            <b>Order date</b>
                                        </Grid.Cell>
                                        }
                                        <Grid.Cell width='fill'
                                                   data-at={Sephora.debug.dataAt('order_date')}>
                                            {order.orderDate}
                                        </Grid.Cell>
                                    </Grid>
                                </Grid.Cell>
                                <Grid.Cell
                                    width={Sephora.isDesktop() ? 1 / 4 : null}>
                                    <Grid
                                        gutter={space[3]}
                                        marginBottom={space[1]}>
                                        {Sephora.isMobile() &&
                                        <Grid.Cell width='40%'>
                                            <b>Order number</b>
                                        </Grid.Cell>
                                        }
                                        <Grid.Cell width='fill'
                                                   data-at={Sephora.debug.dataAt('order_number')}>
                                            {order.orderId}
                                        </Grid.Cell>
                                    </Grid>
                                </Grid.Cell>
                                <Grid.Cell
                                    data-at={Sephora.debug.dataAt('shipped_on_section')}
                                    width={Sephora.isDesktop() ? 2 / 4 : null}>
                                    <Grid gutter={space[3]}>
                                        {Sephora.isMobile() &&
                                        <Grid.Cell width='40%'>
                                            <b>Shipped on</b>
                                        </Grid.Cell>
                                        }
                                        <Grid.Cell width='fill'>
                                            {OrderUtils.isPending(order) ?
                                            'Pending' :
                                            OrderUtils.getShipmentDate(order)}
                                        </Grid.Cell>
                                    </Grid>
                                    <Grid
                                        marginTop={space[3]}
                                        gutter={space[3]}>
                                        <Grid.Cell width={1 / 2}>
                                            <ButtonOutline
                                                onClick={(e) =>
                                                this.handleViewDetailsClick(
                                                    e, order.orderId)}
                                                block={true}>
                                                View Details
                                            </ButtonOutline>
                                        </Grid.Cell>
                                        <Grid.Cell width={1 / 2}>
                                            <ButtonPrimary
                                                data-at={Sephora.debug.dataAt('track_order')}
                                                onClick={(e) =>
                                                this.handleTrackOrderClick(
                                                    e, order)}
                                                disabled={
                                                OrderUtils.isPending(order)}
                                                block={true}>
                                                Track Order
                                            </ButtonPrimary>
                                        </Grid.Cell>
                                    </Grid>
                                </Grid.Cell>
                            </Grid>
                        </Box>
                        )}

                        {this.state.numPagesRetrieved <
                                this.state.numPagesTotal &&
                        <div>
                            <Divider marginY={space[5]} />
                            <Flex
                                alignItems='center'
                                justifyContent='space-between'>
                                <Link
                                    primary={true}
                                    padding={space[3]}
                                    margin={-space[3]}
                                    onClick={this.handleShowMoreClick}>
                                    Show more
                                </Link>
                                <Link
                                    arrowDirection='right'
                                    padding={space[3]}
                                    margin={-space[3]}
                                    onClick={this.handleViewAllPurchasesClick}>
                                    View all purchases
                                </Link>
                            </Flex>
                        </div>
                        }
                    </div>
                    }
                </Box>
                }
            </div>
            }
        </AccountLayout>
    );
};


// Added by sephora-jsx-loader.js
RecentOrders.prototype.path = 'RichProfile/MyAccount/RecentOrders';
// Added by sephora-jsx-loader.js
Object.assign(RecentOrders.prototype, require('./RecentOrders.c.js'));
var originalDidMount = RecentOrders.prototype.componentDidMount;
RecentOrders.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: RecentOrders');
if (originalDidMount) originalDidMount.apply(this);
if (RecentOrders.prototype.ctrlr) RecentOrders.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: RecentOrders');
// Added by sephora-jsx-loader.js
RecentOrders.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
RecentOrders.prototype.class = 'RecentOrders';
// Added by sephora-jsx-loader.js
RecentOrders.prototype.getInitialState = function() {
    RecentOrders.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
RecentOrders.prototype.render = wrapComponentRender(RecentOrders.prototype.render);
// Added by sephora-jsx-loader.js
var RecentOrdersClass = React.createClass(RecentOrders.prototype);
// Added by sephora-jsx-loader.js
RecentOrdersClass.prototype.classRef = RecentOrdersClass;
// Added by sephora-jsx-loader.js
Object.assign(RecentOrdersClass, RecentOrders);
// Added by sephora-jsx-loader.js
module.exports = RecentOrdersClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/RecentOrders/RecentOrders.jsx