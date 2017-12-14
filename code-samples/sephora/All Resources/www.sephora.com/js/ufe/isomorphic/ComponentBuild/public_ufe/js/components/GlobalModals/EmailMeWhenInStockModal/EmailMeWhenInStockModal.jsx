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
    Sephora.Util.InflatorComps.Comps['EmailMeWhenInStockModal'] = function EmailMeWhenInStockModal(){
        return EmailMeWhenInStockModalClass;
    }
}
const { modal, space } = require('style');
const { Box, Grid, Text } = require('components/display');
const Modal = require('components/Modal/Modal');
const InputEmail = require('components/Inputs/InputEmail/InputEmail');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const Fieldset = require('components/Fieldset/Fieldset');
const FormValidator = require('utils/FormValidator');
const Divider = require('components/Divider/Divider');
const ProductImage = require('components/Product/ProductImage/ProductImage');
const ProductVariation = require('components/Product/ProductVariation/ProductVariation');
const SizeAndItemNumber = require('components/Product/SizeAndItemNumber/SizeAndItemNumber');
const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;

const EmailMeWhenInStockModal = function () {};

EmailMeWhenInStockModal.prototype.render = function () {

    let {
        isOpen,
        requestClose,
        product,
        currentSku,
        alreadySubscribed
    } = this.props;

    let subscribeMailText;
    let subscribeMailButtonText;
    let subscribeMailCTA;

    if (alreadySubscribed) {
        subscribeMailText = 'If you no longer wish to receive the notification, ' +
                            'enter the email address you wish to remove and click \'Remove\'.';
        subscribeMailButtonText = 'Remove';
        subscribeMailCTA = this.handleRemoveEmailSubscription;
    } else {
        subscribeMailText = 'To receive the in stock notification email, ' +
                            'just enter your email address and click \'Email Me\'.';
        subscribeMailButtonText = 'Email Me';
        subscribeMailCTA = this.handleEmailMeWhenInStock;
    }

    const messages = {
        empty: 'Please enter your email address.',
        invalid: 'Please enter an e-mail address in the format username@domain.com.',
        subscribe: 'Your in stock notification email will be sent to ',
        remove: 'You are no longer scheduled to receive the email when in stock notification.'
    };


    return (
        <Modal
            width={modal.WIDTH.XS}
            open={isOpen}
            onDismiss={this.requestClose}>
            <Modal.Header>
                <Modal.Title>
                    Email me when available
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Grid
                    gutter={space[4]}>
                    <Grid.Cell
                        width='fit'>
                        <ProductImage
                            skuImages={currentSku.skuImages}
                            size={IMAGE_SIZES[97]} />
                    </Grid.Cell>
                    <Grid.Cell
                        width='fill'
                        lineHeight={2}
                        fontSize='h5'>
                        {product.brand &&
                            <Box
                                fontWeight={700}
                                textTransform='uppercase'
                                className='OneLinkNoTx'
                                dangerouslySetInnerHTML={{
                                    __html: product.brand.displayName
                                }} />
                        }
                        <Box
                            dangerouslySetInnerHTML={{
                                __html: product.displayName
                            }} />
                        <SizeAndItemNumber
                            sku={currentSku}
                            fontSize='h6'
                            marginTop={space[1]} />
                        <ProductVariation
                            product={product}
                            sku={currentSku}
                            fontSize='h6'
                            marginTop={space[1]} />
                    </Grid.Cell>
                </Grid>
                <Divider
                    marginY={space[4]}
                    color='lightGray' />
                {this.state.showSignupBlock &&
                    <Box fontSize='h5'>
                        {this.state.errorMessages ? this.state.errorMessages.map(error =>
                            <Text
                                is='p'
                                color='error'
                                marginBottom={space[2]}>
                                {error}
                            </Text>
                        ) :
                            <Text
                                is='p'
                                marginBottom={space[2]}>
                                {subscribeMailText}
                            </Text>
                        }
                        <Grid
                            is='form'
                            action=''>
                            <Grid.Cell width='fill'>
                                <InputEmail
                                    rounded='left'
                                    hideLabel={true}
                                    noMargin={true}
                                    name='emailStockSignup'
                                    placeholder='Email address'
                                    login={this.state.presetEmail}
                                    disabled={this.state.inputsDisabled}
                                    emptyEmailError={messages.empty}
                                    invalidEmailError={messages.invalid}
                                    ref={
                                        (c) => {
                                            if (c !== null) {
                                                this.emailInput = c;
                                            }
                                        }
                                    }
                                />
                            </Grid.Cell>
                            <Grid.Cell
                                width='fit'
                                marginLeft={-1}
                                zIndex={1}>
                                <ButtonPrimary
                                    type='submit'
                                    rounded='right'
                                    onClick={subscribeMailCTA}>
                                    {subscribeMailButtonText}
                                </ButtonPrimary>
                            </Grid.Cell>
                        </Grid>
                    </Box>
                }
                {this.state.subscribedEmail &&
                    <Text is='p'>
                        {messages.subscribe} {this.state.subscribedEmail}
                    </Text>
                }
                {this.state.showRemovalMessage &&
                    <Text is='p'>
                        {messages.remove}
                    </Text>
                }
            </Modal.Body>
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
EmailMeWhenInStockModal.prototype.path = 'GlobalModals/EmailMeWhenInStockModal';
// Added by sephora-jsx-loader.js
Object.assign(EmailMeWhenInStockModal.prototype, require('./EmailMeWhenInStockModal.c.js'));
var originalDidMount = EmailMeWhenInStockModal.prototype.componentDidMount;
EmailMeWhenInStockModal.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: EmailMeWhenInStockModal');
if (originalDidMount) originalDidMount.apply(this);
if (EmailMeWhenInStockModal.prototype.ctrlr) EmailMeWhenInStockModal.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: EmailMeWhenInStockModal');
// Added by sephora-jsx-loader.js
EmailMeWhenInStockModal.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
EmailMeWhenInStockModal.prototype.class = 'EmailMeWhenInStockModal';
// Added by sephora-jsx-loader.js
EmailMeWhenInStockModal.prototype.getInitialState = function() {
    EmailMeWhenInStockModal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
EmailMeWhenInStockModal.prototype.render = wrapComponentRender(EmailMeWhenInStockModal.prototype.render);
// Added by sephora-jsx-loader.js
var EmailMeWhenInStockModalClass = React.createClass(EmailMeWhenInStockModal.prototype);
// Added by sephora-jsx-loader.js
EmailMeWhenInStockModalClass.prototype.classRef = EmailMeWhenInStockModalClass;
// Added by sephora-jsx-loader.js
Object.assign(EmailMeWhenInStockModalClass, EmailMeWhenInStockModal);
// Added by sephora-jsx-loader.js
module.exports = EmailMeWhenInStockModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/EmailMeWhenInStockModal/EmailMeWhenInStockModal.jsx