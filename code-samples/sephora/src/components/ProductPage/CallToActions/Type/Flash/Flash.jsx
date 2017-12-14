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
const { colors, space } = require('style');
const { Box, Text } = require('components/display');
const AddToBasketButton = require('components/AddToBasketButton/AddToBasketButton');
const ButtonRed = require('components/Button/ButtonRed');
const Link = require('components/Link/Link');
const Checkbox = require('components/Inputs/Checkbox/Checkbox');
const ADD_BUTTON_TYPE = require('utils/Basket').ADD_TO_BASKET_TYPES;
const userUtils = require('utils/User');

const Flash = function () {
    this.state = {
        acceptTerms: false,
        showError: false,
        buttonText: 'ADD TO BASKET',
        enrolled: false,
        showMessage: false,
        message: null
    };
};

Flash.prototype.render = function () {
    // TODO: Determine with product team how to unify mobile and desktop
    const isMobile = Sephora.isMobile();

    let currentProduct = this.props;
    let { currentSku } = currentProduct;
    let { actionFlags = {} } = currentSku;
    let isRouge = userUtils.isRouge();

    const isEligible = (
            currentProduct.usingDefaultUserSpecificData ||
            (actionFlags.isEnrollToFlash || actionFlags.isAddToBasket)) &&
            !userUtils.isFlash();
    let disableButton = !isEligible || !this.state.acceptTerms ||
        this.isRestrictedEnrollmentType() || (isRouge && userUtils.isFlash());
    let disableTermsCheckbox = this.isRestrictedEnrollmentType();

    return (
        <Box textAlign={isMobile ? 'center' : null}>
            {isEligible &&
                <Box
                    marginBottom={isMobile ? space[1] : space[2]}>
                    <Checkbox
                        isInline={true}
                        checked={this.state.acceptTerms}
                        onChange={this.handleAcceptTerms}
                        disabled={disableTermsCheckbox}
                        name='flash_terms'>
                        <span>
                            Accept
                            {' '}
                            <Link
                                primary={true}
                                onClick={this.showFlashTermsModal}>
                                Terms & Conditions
                            </Link>
                        </span>
                    </Checkbox>
                </Box>
            }
            {isRouge ?
                <ButtonRed
                    block={true}
                    disabled={disableButton}
                    onClick={() => this.enrollToFlash()}
                    children={this.state.buttonText} />
                :
                <AddToBasketButton
                    quantity={1}
                    block={true}
                    sku={currentSku}
                    type={ADD_BUTTON_TYPE.RED}
                    disabled={disableButton}
                    text={this.state.buttonText} />
            }
            {(this.state.showError || !isEligible || this.state.showMessage) &&
                <Text
                    is='p'
                    fontSize='h5'
                    lineHeight={2}
                    color={this.state.showError || this.state.showMessage ? colors.error : null}
                    marginTop={space[2]}>
                    {this.state.showError && isEligible
                        ? 'You must accept terms and conditions first.'
                        : this.state.showMessage ? this.state.message
                                              : 'You are already enrolled in flash.'
                    }
                </Text>
            }
        </Box>
    );
};


// Added by sephora-jsx-loader.js
Flash.prototype.path = 'ProductPage/CallToActions/Type/Flash';
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
// ./public_ufe/js/components/ProductPage/CallToActions/Type/Flash/Flash.jsx