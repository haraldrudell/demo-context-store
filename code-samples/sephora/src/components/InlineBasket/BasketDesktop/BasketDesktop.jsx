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
    Sephora.Util.InflatorComps.Comps['BasketDesktop'] = function BasketDesktop(){
        return BasketDesktopClass;
    }
}
const { space } = require('style');
const { Box, Grid, Text } = require('components/display');
const skuUtils = require('utils/Sku');
const Link = require('components/Link/Link');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const ButtonRed = require('components/Button/ButtonRed');
const Divider = require('components/Divider/Divider');
const CustomScroll = require('components/CustomScroll/CustomScroll');
const BasketMsg = require('../BasketMsg/BasketMsg');
const BasketItem = require('./BasketItem');

const BasketDesktop = function () {
    return null;
};

BasketDesktop.prototype.render = function () {
    const {
        basket,
        isLoggedIn,
        signInHandler,
        width,
        justAddedProducts,
        onCheckoutClick,
        onBasketClick
    } = this.props;

    let {
        basketItemWarnings = [],
        error = {}
    } = basket;
    let {
        errorMessages = []
    } = error;
    const scrollCount = 4;
    const itemWidth = width - (space[5] * 2);

    return (
            <Box
                padding={space[5]}
                width={width}>
                {errorMessages.length ?
                    <Text
                        color='error'
                        data-at={Sephora.debug.dataAt('inline_basket_error_message')}>
                        {errorMessages[0]}
                    </Text>
                :
                    <div>
                        {basketItemWarnings && basketItemWarnings.map(basketItemWarning =>
                            <Text
                                is='p'
                                color='error'
                                data-at={Sephora.debug.dataAt('inline_basket_item_warning')}>
                                {basketItemWarning}
                            </Text>
                        )}
                        <AddedCountItem addedCount={justAddedProducts}
                            itemCount={basket.itemCount} />

                        {basket.itemCount > 0 ?
                            <Box
                                marginY={space[3]}
                                marginRight={basket.itemCount > scrollCount ? -space[5] : null}>
                                <Divider />
                                <CustomScroll
                                    _css={basket.itemCount > scrollCount ? {
                                        maxHeight: 276,
                                        paddingRight: space[5]
                                    } : {}}>

                                    {basket.items && basket.items.map((item, index) =>
                                        <BasketItem
                                            key={item.sku ? item.sku.productId : null}
                                            itemWidth={itemWidth}
                                            item={item}
                                            index={index}/>
                                    )}
                                </CustomScroll>
                                <Divider />
                            </Box>
                            : <Divider marginTop={space[3]} />
                        }

                        {!isLoggedIn && basket.itemCount === 0 &&
                            <div>
                                <Grid
                                    alignItems='center'
                                    paddingY={space[3]}>
                                    <Grid.Cell width='fill'>
                                        Sign in to see items you may have added previously.
                                    </Grid.Cell>
                                    <Grid.Cell width='fit' marginLeft={space[3]}>
                                        <ButtonPrimary onClick={signInHandler}>
                                            Sign In
                                        </ButtonPrimary>
                                    </Grid.Cell>
                                </Grid>
                                <Divider />
                            </div>
                        }

                        {basket.itemCount > 0 &&
                            <Box marginBottom={space[3]}>
                                <Box
                                    textAlign='right'
                                    data-at={Sephora.debug.dataAt('inline_basket_total_message')}>
                                    Basket total
                                    {' '}
                                    ({basket.itemCount} item{basket.itemCount > 1 && 's'}):
                                    {' '}
                                    <Text fontWeight={700}>
                                        {basket.subtotal}
                                    </Text>
                                    <Box marginY={space[3]}>
                                        <ButtonRed
                                            onClick={onCheckoutClick}>
                                            Checkout
                                        </ButtonRed>
                                    </Box>
                                </Box>
                                <Divider color='black' />
                            </Box>
                        }

                        <Box
                            marginTop={space[3]}
                            data-at={Sephora.debug.dataAt('inline_basket_promo_message')}>
                            See samples, rewards and promotions in
                            {' '}
                            <Link
                                primary={true}
                                onClick={onBasketClick}>
                                basket
                            </Link>.
                        </Box>
                        {basket.itemCount > 0 &&
                            <div>
                                <Divider marginY={space[3]} />
                                <BasketMsg basket={basket} />
                            </div>
                        }
                    </div>
                }
            </Box>
    );
};

const AddedCountItem = ({
 addedCount, itemCount
}) =>
    (<Box fontSize='h2'>

        {itemCount > 0
            ?
            <span data-at={Sephora.debug.dataAt('inline_basket_title')}>
                {addedCount
                    ?
                        <span>
                            {addedCount} item{addedCount > 1 && 's'} added to basket
                        </span>
                    :
                        <span>
                            {itemCount} item{itemCount > 1 && 's'} in basket
                        </span>
                }
            </span>
            : 'Your basket is empty'
        }
    </Box>);


// Added by sephora-jsx-loader.js
BasketDesktop.prototype.path = 'InlineBasket/BasketDesktop';
// Added by sephora-jsx-loader.js
BasketDesktop.prototype.class = 'BasketDesktop';
// Added by sephora-jsx-loader.js
BasketDesktop.prototype.getInitialState = function() {
    BasketDesktop.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BasketDesktop.prototype.render = wrapComponentRender(BasketDesktop.prototype.render);
// Added by sephora-jsx-loader.js
var BasketDesktopClass = React.createClass(BasketDesktop.prototype);
// Added by sephora-jsx-loader.js
BasketDesktopClass.prototype.classRef = BasketDesktopClass;
// Added by sephora-jsx-loader.js
Object.assign(BasketDesktopClass, BasketDesktop);
// Added by sephora-jsx-loader.js
module.exports = BasketDesktopClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/InlineBasket/BasketDesktop/BasketDesktop.jsx