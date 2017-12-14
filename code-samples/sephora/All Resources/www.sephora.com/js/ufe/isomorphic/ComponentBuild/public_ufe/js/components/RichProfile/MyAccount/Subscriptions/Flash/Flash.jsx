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
    Sephora.Util.InflatorComps.Comps['Flash'] = function Flash(){
        return FlashClass;
    }
}
const { space } = require('style');
const Flex = require('components/Flex/Flex');
const Grid = require('components/Grid/Grid');
const Text = require('components/Text/Text');
const Link = require('components/Link/Link');
const Divider = require('components/Divider/Divider');
const IconCross = require('components/Icon/IconCross');
const dateUtils = require('utils/Date');
const AddToBasketButton = require('components/AddToBasketButton/AddToBasketButton');
const ButtonOutline = require('components/Button/ButtonOutline');
const ADD_BUTTON_TYPE = require('utils/Basket').ADD_TO_BASKET_TYPES;

const Flash = function () {
    this.state = {
        isAutoRenew: null,
        flashPaymentInfo: null,
        sku: {},
        isInBasket: false
    };
};

Flash.prototype.render = function () {
    const {
     flash,
     isRouge
    } = this.props;

    let formattedStartDate;
    let formattedEndDate;

    if (flash.isActive) {
        //format flash start and end dates
        formattedStartDate = dateUtils.formatDateMDY(new Date(flash.startDate).toISOString());
        formattedEndDate = dateUtils.formatDateMDY(new Date(flash.endDate).toISOString());
    }

    const noFlash =
        <div>
            <Grid>
                <Grid.Cell width={Sephora.isDesktop() ? 3 / 4 : null}>
                    <Text
                        is='p'
                        marginBottom={space[3]}>
                        { isRouge ?
                            'As a VIB Rouge member, you can access this subscription at no cost.'
                        :
                            'Subscribe to Sephora FLASH and get FREE 2-day shipping ' +
                            'for a full year.'
                        }
                    </Text>
                </Grid.Cell>
                <Grid.Cell width={Sephora.isDesktop() ? 1 / 4 : null}>
                    <Text
                        is='p'
                        marginBottom={space[4]}
                        textAlign={Sephora.isDesktop() ? 'right' : null}>
                        { isRouge ? <b>FREE</b> : <b>$10</b> }
                    </Text>
                </Grid.Cell>
            </Grid>
            {isRouge ?
                <ButtonOutline
                    onClick={this.enrollFlashForRouge}>
                    Enroll In Flash
                </ButtonOutline>
            :
                <AddToBasketButton
                    quantity={1}
                    sku={this.state.sku}
                    type={ADD_BUTTON_TYPE.OUTLINE}
                    disabled={this.state.isInBasket} />
            }
            <Text
                is='p'
                fontSize='h5'
                marginTop={space[4]}
                color='gray'>
                By clicking {isRouge ? '“Enroll In Flash” ' : '“Add to Basket” '}
                you accept Sephora FLASH
                {' '}
                <Text
                    hoverColor='black'
                    textDecoration='underline'
                    onClick={()=> {
                        this.openTermsAndConditions();
                    }}>
                    terms and conditions
                </Text>.
            </Text>
        </div>;

    const colWidth = Sephora.isDesktop() ? 1 / 3 : null;
    const labelWidth = Sephora.isMobile() ? '40%' : null;
    const infoWidth = Sephora.isMobile() ? 'fill' : null;

    const hasFlash =
        <div>
            <Grid>
                <Grid.Cell width={colWidth}>
                    <Grid marginY={space[1]}>
                        <Grid.Cell width={labelWidth}>
                            <b>Started</b>
                        </Grid.Cell>
                        <Grid.Cell width={infoWidth}>
                            {formattedStartDate}
                        </Grid.Cell>
                    </Grid>
                </Grid.Cell>
                <Grid.Cell width={colWidth}>
                    <Grid marginY={space[1]}>
                        <Grid.Cell width={labelWidth}>
                            <b>Ends</b>
                        </Grid.Cell>
                        <Grid.Cell width={infoWidth}>
                            {formattedEndDate}
                        </Grid.Cell>
                    </Grid>
                </Grid.Cell>
                { this.state.isAutoRenew &&
                    <Grid.Cell width={colWidth}>
                        <Grid marginY={space[1]}>
                            <Grid.Cell width={labelWidth}>
                                <b>Billed to</b>
                            </Grid.Cell>
                            <Grid.Cell width={infoWidth}>
                                {this.state.flashPaymentInfo}
                            </Grid.Cell>
                        </Grid>
                    </Grid.Cell>
                }
            </Grid>
            { this.state.isAutoRenew &&
                <div>
                    <Divider marginY={space[4]} />
                    <Link
                        padding={space[3]}
                        margin={-space[3]}
                        onClick={()=> {
                            this.showCancelFlashModal(flash.endDate);
                        }}
                        >
                        <Flex alignItems='center'>
                            <IconCross
                                x={true}
                                fontSize='1.125em' />
                            <Text marginLeft={space[3]}>
                                Cancel auto-renew
                            </Text>
                        </Flex>
                    </Link>
                </div>
            }
        </div>;

    return (
        <div>
            <Flex
                paddingTop={space[5]}
                justifyContent='space-between'
                alignItems='baseline'>
                <Text
                    is='h2' fontSize='h3'
                    fontWeight={700}>
                    Sephora FLASH
                </Text>
                <Link
                    padding={space[2]}
                    margin={-space[2]}
                    primary={true}
                    href='/sephora-flash-subscription-P379518'>
                    Learn more
                </Link>
            </Flex>
            <Divider marginY={space[4]} />
            {flash.isActive ? hasFlash : noFlash}
        </div>
    );
};


// Added by sephora-jsx-loader.js
Flash.prototype.path = 'RichProfile/MyAccount/Subscriptions/Flash';
// Added by sephora-jsx-loader.js
Object.assign(Flash.prototype, require('./Flash.c.js'));
var originalDidMount = Flash.prototype.componentDidMount;
Flash.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Flash');
if (originalDidMount) originalDidMount.apply(this);
if (Flash.prototype.ctrlr) Flash.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Flash');
// Added by sephora-jsx-loader.js
Flash.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Flash.prototype.class = 'Flash';
// Added by sephora-jsx-loader.js
Flash.prototype.getInitialState = function() {
    Flash.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Flash.prototype.render = wrapComponentRender(Flash.prototype.render);
// Added by sephora-jsx-loader.js
var FlashClass = React.createClass(Flash.prototype);
// Added by sephora-jsx-loader.js
FlashClass.prototype.classRef = FlashClass;
// Added by sephora-jsx-loader.js
Object.assign(FlashClass, Flash);
// Added by sephora-jsx-loader.js
module.exports = FlashClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/Subscriptions/Flash/Flash.jsx