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
    Sephora.Util.InflatorComps.Comps['InternationalShippingModal'] = function InternationalShippingModal(){
        return InternationalShippingModalClass;
    }
}
const { colors, modal, space } = require('style');
const { Box, Flex, Grid, Image, Text } = require('components/display');
const Modal = require('components/Modal/Modal');
const ButtonOutline = require('components/Button/ButtonOutline');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const Locale = require('utils/LanguageLocale.js');

var InternationalShippingModal = function () {
    this.setState({
        shippingCountries: null,
        selectedCountry: null
    });
};

InternationalShippingModal.prototype.render = function () {
    return (
        <Modal
            open={this.props.isOpen && this.state.shippingCountries}
            onDismiss={this.close}
            width={modal.WIDTH.LG}>
            <Modal.Header>
                <Modal.Title>
                    International Shipping
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Text
                    is='h1'
                    fontSize='h2'
                    lineHeight={1}
                    fontWeight={700}
                    textAlign='center'
                    marginBottom={space[5]}
                    data-at={Sephora.debug.dataAt('shipping_content_title')}>
                    Select a country you would like to ship to
                </Text>
                <Grid
                    gutter={space[4]}
                    paddingX={space[2]}>
                {
                    this.state.shippingCountries && this.state.shippingCountries.map(item =>
                        <Grid.Cell
                            width={1 / 2}
                            marginBottom={space[4]}>
                            <Box
                                width='100%'
                                padding={space[4]}
                                fontSize='h3'
                                lineHeight={1}
                                rounded={true}
                                data-at={Sephora.debug.dataAt(item === this.state.selectedCountry ?
                                'shipping_country_selected' : 'shipping_country')}
                                onClick={() => this.selectCountry(item)}
                                _css={item === this.state.selectedCountry ? {
                                    borderWidth: 2,
                                    borderColor: colors.black,
                                    margin: -1
                                } : {
                                    borderWidth: 1,
                                    borderColor: colors.moonGray,
                                    ':hover': {
                                        borderColor: colors.black
                                    }
                                }}>
                                <Flex
                                    alignItems='center'>
                                    <Image
                                        src={'/contentimages/country-flags/icon-flag-' +
                                    item.countryCode.toLowerCase() + '.png'}
                                        width='3em'
                                        height='2em'
                                        marginRight='1em' />
                                    <Text>
                                        {item.countryLongName}
                                    </Text>
                                </Flex>
                            </Box>
                        </Grid.Cell>
                    )
                }
                </Grid>
                <Box
                    marginTop={space[2]}
                    textAlign='center'>
                    {
                        this.state.selectedCountry &&
                        this.state.selectedCountry.countryCode !== Locale.COUNTRIES.US &&
                        <Text
                            data-at={Sephora.debug.dataAt('shipping_country_note')}
                            is='p'
                            marginBottom={space[3]}>
                            {this.state.selectedCountry.countryCode === Locale.COUNTRIES.CA &&
                            <Text>
                                If you select Canadian shipping, you will be
                                taken to the Canadian site.
                                <br />
                            </Text>}
                            Prices will be shown in
                            {' '}
                            <b>{ this.state.selectedCountry.currency.name }</b>
                            {this.state.selectedCountry.countryCode !== Locale.COUNTRIES.CA &&
                            ' (at checkout only)'}
                            .
                        </Text>
                    }
                    {
                        this.state.selectedCountry &&
                        this.state.selectedCountry.countryCode === Locale.COUNTRIES.US &&
                        <Text
                            is='p'
                            marginBottom={space[3]}>
                            Continue with shipping to the US.
                        </Text>
                    }
                    <Text
                        data-at={Sephora.debug.dataAt('shipping_general_note')}
                        is='p'
                        fontSize='h5'
                        color='gray'
                        lineHeight={2}>
                        Note: Items that cannot be shipping to the location
                        selected will be indicated in red.
                        <br />
                        In order to checkout, these items will need to be
                        removed from your basket.
                    </Text>
                </Box>
            </Modal.Body>
            <Modal.Footer>
                <Grid
                    gutter={modal.ACTIONS_GUTTER}
                    _css={Sephora.isDesktop() ? {
                        width: modal.ACTIONS_WIDTH,
                        marginLeft: 'auto'
                    } : {}}>
                    <Grid.Cell width={1 / 2}>
                        <ButtonOutline
                            data-at={Sephora.debug.dataAt('cancel')}
                            block={true}
                            onClick={this.close}>
                            Cancel
                        </ButtonOutline>
                    </Grid.Cell>
                    <Grid.Cell width={1 / 2}>
                        <ButtonPrimary
                            data-at={Sephora.debug.dataAt('continue')}
                            block={true}
                            onClick={()=>this.switchCountry()}>
                            Continue
                        </ButtonPrimary>
                    </Grid.Cell>
                </Grid>
            </Modal.Footer>
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
InternationalShippingModal.prototype.path = 'GlobalModals/InternationalShippingModal';
// Added by sephora-jsx-loader.js
Object.assign(InternationalShippingModal.prototype, require('./InternationalShippingModal.c.js'));
var originalDidMount = InternationalShippingModal.prototype.componentDidMount;
InternationalShippingModal.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: InternationalShippingModal');
if (originalDidMount) originalDidMount.apply(this);
if (InternationalShippingModal.prototype.ctrlr) InternationalShippingModal.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: InternationalShippingModal');
// Added by sephora-jsx-loader.js
InternationalShippingModal.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
InternationalShippingModal.prototype.class = 'InternationalShippingModal';
// Added by sephora-jsx-loader.js
InternationalShippingModal.prototype.getInitialState = function() {
    InternationalShippingModal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
InternationalShippingModal.prototype.render = wrapComponentRender(InternationalShippingModal.prototype.render);
// Added by sephora-jsx-loader.js
var InternationalShippingModalClass = React.createClass(InternationalShippingModal.prototype);
// Added by sephora-jsx-loader.js
InternationalShippingModalClass.prototype.classRef = InternationalShippingModalClass;
// Added by sephora-jsx-loader.js
Object.assign(InternationalShippingModalClass, InternationalShippingModal);
// Added by sephora-jsx-loader.js
module.exports = InternationalShippingModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/InternationalShippingModal/InternationalShippingModal.jsx