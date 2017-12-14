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
    Sephora.Util.InflatorComps.Comps['Play'] = function Play(){
        return PlayClass;
    }
}
const { space } = require('style');
const { Box, Flex, Grid, Text } = require('components/display');
const Link = require('components/Link/Link');
const Divider = require('components/Divider/Divider');
const IconCross = require('components/Icon/IconCross');
const dateUtils = require('utils/Date');
const AddToBasketButton = require('components/AddToBasketButton/AddToBasketButton');
const ADD_BUTTON_TYPE = require('utils/Basket').ADD_TO_BASKET_TYPES;
const Address = require('components/Addresses/Address');
const Checkbox = require('components/Inputs/Checkbox/Checkbox');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const ButtonOutline = require('components/Button/ButtonOutline');
const Modal = require('components/Modal/Modal');
const Select = require('components/Inputs/Select/Select');

const Play = function () {
    this.state = {
        isSubscribed: this.props.play.isActive,
        playPayment: null,
        billingDate: null,
        shippingAddress: null,
        billingAddress: null,
        isSubscribedToEmail: null,
        playEmailConfirmMsg: null,
        isPlayEditable: null,
        cancelOptions: null,
        openCancelModal: false
    };
};

Play.prototype.render = function () {
    const colWidth = Sephora.isDesktop() ? 1 / 3 : null;
    const labelWidth = Sephora.isMobile() ? '40%' : null;
    const infoWidth = Sephora.isMobile() ? 'fill' : null;

    const playUpdatePending = (
        <Text is='p' marginTop={space[3]}>
            Your updates have been submitted and your order is pending.
            {Sephora.isDesktop() ? <br /> : ' '}
            To make any additional updates, check back later or call customer service.
        </Text>
    );

    const playInfoGrid = (
        <Grid>
            <Grid.Cell width={colWidth}>
                <Grid marginY={space[1]}>
                    <Grid.Cell width={labelWidth}>
                        <b>Shipment date</b>
                    </Grid.Cell>
                    <Grid.Cell width={infoWidth}>
                        3rd week of every month
                    </Grid.Cell>
                </Grid>
            </Grid.Cell>
            <Grid.Cell width={colWidth}>
                <Grid marginY={space[1]}>
                    <Grid.Cell width={labelWidth}>
                        <b>Next billing</b>
                    </Grid.Cell>
                    <Grid.Cell width={infoWidth}>
                        {this.state.billingDate}
                    </Grid.Cell>
                </Grid>
            </Grid.Cell>
            <Grid.Cell width={colWidth}>
                <Grid marginY={space[1]}>
                    <Grid.Cell width={labelWidth}>
                        <b>Billed to</b>
                    </Grid.Cell>
                    <Grid.Cell width={infoWidth}>
                        {this.state.playPayment}
                    </Grid.Cell>
                </Grid>
            </Grid.Cell>
        </Grid>
    );

    const emptyPlayState = (
        <Grid>
            <Grid.Cell width={Sephora.isDesktop() ? '75%' : null}>
                <Text is='p'
                    marginBottom={space[3]}>
                    Uncover the most sought-after products around with a monthly
                    delivery of stellar samples handpicked from our shelves—and
                    learn how to get the most out of each and every one.
                </Text>
            </Grid.Cell>
            <Grid.Cell width={Sephora.isDesktop() ? '25%' : null}>
                <Text
                    is='p'
                    marginBottom={space[4]}
                    textAlign={Sephora.isDesktop() ? 'right' : null}>
                    <b>$10 billed monthly</b>
                </Text>
            </Grid.Cell>
        </Grid>
    );

    const subscribedPlayState = (
        <div>
            {playInfoGrid}

            <Divider marginY={space[4]} />

            <Text
                is='h3'
                fontWeight={700}
                marginBottom={space[2]}>
                Email preferences
            </Text>
            <Checkbox
                name='subscribePlayEmail'
                checked={this.state.isSubscribedToEmail}
                onChange={()=> {
                    this.setState({
                        isSubscribedToEmail: !this.state.isSubscribedToEmail
                    });
                }}
            >
                Send me emails related to PLAY! by SEPHORA
            </Checkbox>
            <Box marginTop={space[2]}>
                <ButtonOutline
                    onClick={()=> {
                        this.updatePlayEmailSubscription();
                    }}
                    >
                    Update
                </ButtonOutline>
                {this.state.playEmailConfirmMsg &&
                    <Text
                        is='p'
                        fontWeight={700}
                        marginTop={space[2]}>
                        {this.state.playEmailConfirmMsg}
                    </Text>
                }
            </Box>

            <Divider marginY={space[4]} />

            <Grid gutter={space[4]}>
                <Grid.Cell width='fill'>
                    <Text
                        is='h3'
                        fontWeight={700}
                        marginBottom={space[1]}>
                        Shipping address
                    </Text>
                    {this.state.shippingAddress &&
                        <Address address={this.state.shippingAddress} />
                    }
                </Grid.Cell>
                <Grid.Cell width='fit'>
                { this.state.isPlayEditable &&
                    <Link
                        padding={space[3]}
                        margin={-space[3]}
                        primary={true}
                        onClick={()=> {
                            this.updateShippingAddress();
                        }}
                        >
                        Edit
                    </Link>
                }
                </Grid.Cell>
            </Grid>
            {this.state.isPlayEditable ||
                playUpdatePending
            }

            <Divider marginY={space[4]} />

            <Grid gutter={space[4]}>
                <Grid.Cell width='fill'>
                    <Text
                        is='h3'
                        fontWeight={700}
                        marginBottom={space[1]}>
                        Billing details
                    </Text>
                    {this.state.billingAddress &&
                        <Address address={this.state.billingAddress} />
                    }
                    {this.state.playPayment}
                </Grid.Cell>
                <Grid.Cell width='fit'>
                { this.state.isPlayEditable &&
                    <Link
                        padding={space[3]}
                        margin={-space[3]}
                        primary={true}
                        onClick={()=> {
                            this.updateBillingAddress();
                        }}
                        >
                        Edit
                    </Link>
                }
                </Grid.Cell>
            </Grid>
            {this.state.isPlayEditable ||
                playUpdatePending
            }

            <Divider marginY={space[4]} />

            <Link
                padding={space[3]}
                margin={-space[3]}
                onClick={()=> {
                    this.setState({
                        openCancelModal: true
                    });
                }}
                >
                <Flex alignItems='center'>
                    <IconCross
                        x={true}
                        fontSize='1.125em' />
                    <Text marginLeft={space[3]}>
                        Cancel subscription
                    </Text>
                </Flex>
            </Link>
            <div>
                <Link
                    padding={space[3]}
                    margin={-space[3]}
                    primary={true}
                    href='/play-quiz'>
                    Complete your PLAY! profile
                </Link>
            </div>
        </div>
    );

    const cancelPlayModal =
        <Modal
            open={this.state.openCancelModal}
            onDismiss={()=> {
                this.setState({
                    openCancelModal: false
                });
            }} >

            <Modal.Header>
                <Modal.Title>
                    Cancel PLAY! by SEPHORA
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Text
                    is='h2'
                    fontWeight={700}
                    marginBottom={space[2]}>
                    We’re sad to see you go!
                </Text>
                <Select
                    hideLabel={true}
                    noMargin={true}
                    name='cancelOptions'
                    onKeyDown={this.handleKeyDown}>
                    <option value='' hidden={true}>Reason for cancelling subscription</option>
                    {this.state.cancelOptions && this.state.cancelOptions.length &&
                        this.state.cancelOptions.map((cancelOption, index) =>
                            <option key={index}
                                value={cancelOption.label}>
                                {cancelOption.label}
                            </option>
                        )
                    }
                </Select>
                <Text
                    is='p'
                    marginTop={space[2]}
                    marginBottom={space[4]}
                    fontSize='h5'
                    color='gray'>
                    If you have already paid for this month, your box is in progress and
                    you will not be billed for the next month.
                </Text>
                <Text
                    is='p'
                    fontWeight={700}>
                    Are you sure you want to cancel your subscription?
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Grid
                    gutter={space[4]}
                    _css={Sephora.isDesktop() ? {
                        width: 362,
                        marginLeft: 'auto'
                    } : {}}>
                    <Grid.Cell width={1 / 2}>
                        <ButtonOutline
                            block={true}
                            onClick={()=> {
                                this.setState({
                                    openCancelModal: false
                                });
                            }} >
                            Nevermind
                        </ButtonOutline>
                    </Grid.Cell>
                    <Grid.Cell width={1 / 2}>
                        <ButtonPrimary
                            block={true}
                            onClick={ this.cancelPlaySubscription }>
                            Yes
                        </ButtonPrimary>
                    </Grid.Cell>
                </Grid>
            </Modal.Footer>
        </Modal>;

    return (
        <div>
            <Flex
                justifyContent='space-between'
                alignItems='baseline'>
                <Text
                    is='h2'
                    fontSize='h3'
                    fontWeight={700}>
                    PLAY! by SEPHORA
                </Text>
                {!this.state.isSubscribed &&
                    <Link
                        padding={space[3]}
                        margin={-space[3]}
                        href='/play'
                        primary={true}>
                        Learn more
                    </Link>
                }
            </Flex>
            <Divider marginY={space[4]} />
            <div>
                { this.state.isSubscribed ?
                    subscribedPlayState
                :
                    emptyPlayState
                }
            </div>
            {cancelPlayModal}
        </div>
    );
};


// Added by sephora-jsx-loader.js
Play.prototype.path = 'RichProfile/MyAccount/Subscriptions/Play';
// Added by sephora-jsx-loader.js
Object.assign(Play.prototype, require('./Play.c.js'));
var originalDidMount = Play.prototype.componentDidMount;
Play.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Play');
if (originalDidMount) originalDidMount.apply(this);
if (Play.prototype.ctrlr) Play.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Play');
// Added by sephora-jsx-loader.js
Play.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Play.prototype.class = 'Play';
// Added by sephora-jsx-loader.js
Play.prototype.getInitialState = function() {
    Play.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Play.prototype.render = wrapComponentRender(Play.prototype.render);
// Added by sephora-jsx-loader.js
var PlayClass = React.createClass(Play.prototype);
// Added by sephora-jsx-loader.js
PlayClass.prototype.classRef = PlayClass;
// Added by sephora-jsx-loader.js
Object.assign(PlayClass, Play);
// Added by sephora-jsx-loader.js
module.exports = PlayClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/Subscriptions/Play/Play.jsx