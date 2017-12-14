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
    Sephora.Util.InflatorComps.Comps['BasketMobile'] = function BasketMobile(){
        return BasketMobileClass;
    }
}
const { colors, space, shade, dropdown } = require('style');
const { Box, Text } = require('components/display');
const ButtonRed = require('components/Button/ButtonRed');
const Arrow = require('components/Arrow/Arrow');
const Divider = require('components/Divider/Divider');
const BasketMsg = require('../BasketMsg/BasketMsg');

var BasketMobile = function () {
    return null;
};

BasketMobile.prototype.render = function () {

    const {
        onCheckoutClick,
        basket,
        children,
        isOpen,
        ...props
    } = this.props;
    let {
        basketItemWarnings,
        error = {}
    } = basket;
    let {
        errorMessages = []
    } = error;
    basketItemWarnings = basketItemWarnings || [];
    const styles = {
        popover: {
            position: 'absolute',
            top: '100%',
            display: isOpen ? 'block' : 'none'
        },
        popoverBox: {
            padding: space[3],
            right: space[2],
            left: space[2],
            backgroundColor: colors.white,
            boxShadow: dropdown.SHADOW,
            textAlign: 'center',
            borderWidth: 1,
            borderColor: shade[3]
        },
        popoverArrow: {
            right: 20,
            fontSize: 20,
            transform: 'translate(0, -100%)'
        }
    };
    return (
        <Box textAlign='right'>
            {children}
            <Arrow
                direction='up'
                _css={[styles.popoverArrow, styles.popover]} />
            <Box
                _css={[styles.popoverBox, styles.popover]}>
                    {errorMessages.length ?
                        <Text
                            color='error'
                            data-at={Sephora.debug.dataAt('inline_basket_error_message')}>
                            {errorMessages[0]}
                        </Text>
                    :
                        <div>
                            <Box>{basketItemWarnings.map(basketItemWarning =>
                                <Text
                                    color='error'
                                    data-at={Sephora.debug.dataAt('inline_basket_item_warning')}>
                                    {basketItemWarning}
                                </Text>)}</Box>
                            <Text
                                is='h3'
                                fontSize='h3'
                                fontWeight={700}>
                                Item added to basket
                            </Text>
                            <Divider marginY={space[3]} />
                            <BasketMsg basket={basket} />
                            <Divider marginY={space[3]} />
                            <ButtonRed onClick={onCheckoutClick}>
                                Checkout
                            </ButtonRed>
                        </div>
                    }
            </Box>
        </Box>
    );
};


// Added by sephora-jsx-loader.js
BasketMobile.prototype.path = 'InlineBasket/BasketMobile';
// Added by sephora-jsx-loader.js
BasketMobile.prototype.class = 'BasketMobile';
// Added by sephora-jsx-loader.js
BasketMobile.prototype.getInitialState = function() {
    BasketMobile.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BasketMobile.prototype.render = wrapComponentRender(BasketMobile.prototype.render);
// Added by sephora-jsx-loader.js
var BasketMobileClass = React.createClass(BasketMobile.prototype);
// Added by sephora-jsx-loader.js
BasketMobileClass.prototype.classRef = BasketMobileClass;
// Added by sephora-jsx-loader.js
Object.assign(BasketMobileClass, BasketMobile);
// Added by sephora-jsx-loader.js
module.exports = BasketMobileClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/InlineBasket/BasketMobile/BasketMobile.jsx