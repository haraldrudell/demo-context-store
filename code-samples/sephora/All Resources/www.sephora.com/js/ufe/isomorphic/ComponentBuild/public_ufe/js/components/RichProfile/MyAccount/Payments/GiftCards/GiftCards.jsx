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
    Sephora.Util.InflatorComps.Comps['GiftCards'] = function GiftCards(){
        return GiftCardsClass;
    }
}
const { space } = require('style');
const { Box, Text } = require('components/display');
const TextInput = require('components/Inputs/TextInput/TextInput');
const FormValidator = require('utils/FormValidator');
const FIELD_LENGTHS = FormValidator.FIELD_LENGTHS;
const ButtonOutline = require('components/Button/ButtonOutline');

const GiftCards = function () {};

GiftCards.prototype.render = function () {
    return (
        <div>
            <Text
                is='p'
                lineHeight={2}
                marginBottom={space[5]}>
                <b>Gift Card balance</b>
                <br />
                Enter the card’s 16 digit number and PIN to check your balance.
            </Text>
            {this.state.gcBalance &&
                <Text
                    is='p'
                    fontWeight={700}
                    marginBottom={space[4]}>
                    Balance = {this.state.gcBalance}
                </Text>
            }
            {this.state.error &&
                <Text
                    is='p'
                    color='error'
                    fontSize='h5'
                    marginBottom={space[4]}>
                    {this.state.error}
                </Text>
            }
            <Box
                is='form'
                action=''
                width={Sephora.isDesktop() ? '75%' : null}>
                <TextInput
                    name='gcCardNumber'
                    label='Card number'
                    required={true}
                    placeholder='Required'
                    type='tel'
                    maxLength={FIELD_LENGTHS.giftCardNumber}
                    value={this.gcCardNumberInput && this.gcCardNumberInput.getValue()}
                    ref={comp => this.gcCardNumberInput = comp}
                    validate={
                        (gcCardNumber) => {
                            if (FormValidator.isEmpty(gcCardNumber)) {
                                return 'Card number required.';
                            }

                            return null;
                        }
                    } />
                <TextInput
                    name='gcPinNumber'
                    label='PIN'
                    required={true}
                    placeholder='Required'
                    type='tel'
                    maxLength={FIELD_LENGTHS.giftCardPin}
                    value={this.gcPinNumberInput && this.gcPinNumberInput.getValue()}
                    ref={comp => this.gcPinNumberInput = comp}
                    validate={
                        (gcPinNumber) => {
                            if (FormValidator.isEmpty(gcPinNumber)) {
                                return 'PIN required.';
                            }

                            return null;
                        }
                    } />
                <Box marginTop={space[5]}>
                    <ButtonOutline
                        type='submit'
                        onClick={this.validate}>
                        Check Balance
                    </ButtonOutline>
                </Box>
            </Box>
        </div>
    );
};


// Added by sephora-jsx-loader.js
GiftCards.prototype.path = 'RichProfile/MyAccount/Payments/GiftCards';
// Added by sephora-jsx-loader.js
Object.assign(GiftCards.prototype, require('./GiftCards.c.js'));
var originalDidMount = GiftCards.prototype.componentDidMount;
GiftCards.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: GiftCards');
if (originalDidMount) originalDidMount.apply(this);
if (GiftCards.prototype.ctrlr) GiftCards.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: GiftCards');
// Added by sephora-jsx-loader.js
GiftCards.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
GiftCards.prototype.class = 'GiftCards';
// Added by sephora-jsx-loader.js
GiftCards.prototype.getInitialState = function() {
    GiftCards.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
GiftCards.prototype.render = wrapComponentRender(GiftCards.prototype.render);
// Added by sephora-jsx-loader.js
var GiftCardsClass = React.createClass(GiftCards.prototype);
// Added by sephora-jsx-loader.js
GiftCardsClass.prototype.classRef = GiftCardsClass;
// Added by sephora-jsx-loader.js
Object.assign(GiftCardsClass, GiftCards);
// Added by sephora-jsx-loader.js
module.exports = GiftCardsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/Payments/GiftCards/GiftCards.jsx