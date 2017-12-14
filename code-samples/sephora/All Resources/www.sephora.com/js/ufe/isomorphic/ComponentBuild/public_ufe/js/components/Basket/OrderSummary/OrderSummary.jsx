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
    Sephora.Util.InflatorComps.Comps['OrderSummary'] = function OrderSummary(){
        return OrderSummaryClass;
    }
}
const { space } = require('style');
const { Box, Flex, Text } = require('components/display');
const Container = require('components/Container/Container');
const Divider = require('components/Divider/Divider');
const PromoSection = require('components/Basket/PromoSection/PromoSection');
const IconInfo = require('components/Icon/IconInfo');
const ActionButtons = require('components/Basket/ActionButtons/ActionButtons');
const StickyBanner = require('components/Banner/StickyBanner/StickyBanner');
const Modal = require('components/Modal/Modal');
const ButtonRed = require('components/Button/ButtonRed');
const ApplePay = require('services/ApplePay');
const ApplePayButton = require('components/ApplePayButton/ApplePayButton');
const basketUtils = require('utils/Basket');
const Locale = require('utils/LanguageLocale');

let OrderSummary = function () {
    this.state = {
        basket: {},
        showStickyOrderSummary: true,
        showModalActionButtons: false,
        estimatedShipping: null,
        isApplePayPayment: ApplePay.TYPES.HIDDEN,
        subtotal: null,
        isCanada: false,
        showShippingHandling: true
    };
};

OrderSummary.prototype.getActionButtonsBlock = function () {
    let {
        basket,
        isApplePayPayment,
        isPaypalPayment
    } = this.state;

    let qty = basket.itemCount ? basket.itemCount : 0;
    let summaryBlock =
        <Flex
            justifyContent='space-between'
            marginBottom={space[2]}
            fontWeight={700}>
            <Text>{qty} item{qty === 1 || 's'}</Text>
            <Text>Estimated total: {this.state.subtotal}</Text>
        </Flex>;

    return (
        <div>
            <ActionButtons isApplePayPayment={isApplePayPayment}
                           isPaypalPayment={isPaypalPayment}
                           ref={
                               (c) => {
                                   this.inlineActionButtons = c;
                               }

                           }
            />

            {Sephora.isMobile() &&
            <div>
                <StickyBanner
                    isOpen={this.state.showStickyOrderSummary &&
                    !this.state.showModalActionButtons}
                    paddingY={space[3]}>
                    <Container>
                        {summaryBlock}
                        {isApplePayPayment !== ApplePay.TYPES.HIDDEN ?
                            (this.state.basket.showStickyApplePayBtn ?
                                <ApplePayButton
                                    isApplePayPayment={isApplePayPayment}
                                    default={true}
                                    block={true} />
                                : <ButtonRed
                                block={true} size='lg'
                                onClick={this.onStickyCheckoutClick}>
                                Checkout
                            </ButtonRed>)
                            : <ActionButtons
                            isApplePayPayment={isApplePayPayment}
                            isPaypalPayment={isPaypalPayment}/>
                        }
                    </Container>
                </StickyBanner>
                {isApplePayPayment !== ApplePay.TYPES.HIDDEN &&
                <Modal
                    isDrawer={true}
                    open={this.state.showModalActionButtons}
                    onDismiss={this.onActionButtonsDismiss}>
                    <Container paddingY={space[3]}>
                        {summaryBlock}
                        <ActionButtons isApplePayPayment={isApplePayPayment}
                                       isPaypalPayment={isPaypalPayment}/>
                    </Container>
                </Modal>
                }
            </div>
            }
        </div>
    );
};

OrderSummary.prototype.render = function () {
    let basket = this.state.basket;

    const taxTitle = 'Sales Tax';
    const taxMessage = `Sephora.com charges sales tax on orders delivered to the following states:
    Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, District of Columbia,
    Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maine,
    Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Nebraska, Nevada, New
    Jersey, New Mexico, New York, North Carolina, Ohio, Oklahoma, Pennsylvania, Puerto Rico,
    Rhode Island, South Carolina, Tennessee, Texas, Utah, Virginia, Washington, West Virginia
    and Wisconsin.`;

    const moreInfoIcon =
        <Box
            display='inline-block'
            padding={space[2]}
            marginY={-space[2]}
            lineHeight={0}
            color='moonGray'
            hoverColor='black'
            fontSize='1.125em'>
            <IconInfo />
        </Box>;

    return (
        <div>
            <Box
                marginBottom={space[3]}>
                {Sephora.isDesktop() &&
                    <Box
                        fontSize='h3'
                        marginBottom={space[2]}
                        fontWeight={700}>
                        Order summary
                    </Box>
                }
                <Flex
                    justifyContent='space-between'
                    marginY={space[1]}>
                    <Text>Merchandise subtotal</Text>
                    <Text fontWeight={700}
                          data-at={Sephora.debug.dataAt('bsk_total_merch')}>
                        {basket && basket.rawSubTotal ? basket.rawSubTotal : ''}
                    </Text>
                </Flex>
                {basket &&
                basket.discountAmount &&
                Number(basketUtils.removeCurrency(basket.discountAmount)) ?
                    <Flex
                        justifyContent='space-between'
                        marginY={space[1]}>
                        <Text>Discounts</Text>
                        <Text fontWeight={700}
                            data-at={Sephora.debug.dataAt('bsk_total_discount')}>
                            -{basket.discountAmount}
                        </Text>
                    </Flex> : ''
                }
                {!this.state.showShippingHandling &&
                    <Flex
                        justifyContent='space-between'
                        marginY={space[1]}>
                        <Box
                            onClick={()=> this.openMediaModal()}>
                            Shipping & Handling
                            {moreInfoIcon}
                        </Box>
                        <Text fontWeight={700}
                            data-at={Sephora.debug.dataAt('bsk_total_ship')}>
                            {this.state.estimatedShipping || 'TBD'}
                        </Text>
                    </Flex>
                }
                <Flex
                    justifyContent='space-between'
                    marginY={space[1]}>
                    {this.state.isCanada ?
                        <Text>
                            GST/HST
                        </Text>
                        :
                        <Box
                            onClick={()=> {
                                this.openInfoModal(taxTitle, taxMessage);
                            }}>
                            Tax
                            {moreInfoIcon}
                        </Box>
                    }
                    <Text fontWeight={700}
                        data-at={Sephora.debug.dataAt('bsk_total_tax')}>
                        TBD
                    </Text>
                </Flex>
                <Divider marginY={space[3]} />
                <Flex
                    justifyContent='space-between'
                    fontWeight={700}
                    fontSize='h3'
                    lineHeight={2}>
                    <Text>Estimated total</Text>
                    <Text data-at={Sephora.debug.dataAt('bsk_total_cc')}>
                        {this.state.subtotal || ''}
                    </Text>
                </Flex>
                <Text
                    is='p'
                    marginTop={space[2]}
                    fontSize='h5'
                    color='silver'>
                    Shipping & taxes calculated during checkout
                </Text>
            </Box>
            {Sephora.isDesktop() &&
                <div>
                    <Divider marginBottom={space[3]} />
                    <PromoSection/>
                </div>
            }
            <Box marginTop={space[4]}>
                {this.getActionButtonsBlock()}
            </Box>
        </div>
    );
};


// Added by sephora-jsx-loader.js
OrderSummary.prototype.path = 'Basket/OrderSummary';
// Added by sephora-jsx-loader.js
Object.assign(OrderSummary.prototype, require('./OrderSummary.c.js'));
var originalDidMount = OrderSummary.prototype.componentDidMount;
OrderSummary.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: OrderSummary');
if (originalDidMount) originalDidMount.apply(this);
if (OrderSummary.prototype.ctrlr) OrderSummary.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: OrderSummary');
// Added by sephora-jsx-loader.js
OrderSummary.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
OrderSummary.prototype.class = 'OrderSummary';
// Added by sephora-jsx-loader.js
OrderSummary.prototype.getInitialState = function() {
    OrderSummary.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
OrderSummary.prototype.render = wrapComponentRender(OrderSummary.prototype.render);
// Added by sephora-jsx-loader.js
var OrderSummaryClass = React.createClass(OrderSummary.prototype);
// Added by sephora-jsx-loader.js
OrderSummaryClass.prototype.classRef = OrderSummaryClass;
// Added by sephora-jsx-loader.js
Object.assign(OrderSummaryClass, OrderSummary);
// Added by sephora-jsx-loader.js
module.exports = OrderSummaryClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/OrderSummary/OrderSummary.jsx