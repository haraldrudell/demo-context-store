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
    Sephora.Util.InflatorComps.Comps['BasketList'] = function BasketList(){
        return BasketListClass;
    }
}
const { site, space } = require('style');
const { Box, Text } = require('components/display');
const BasketListItem = require('./BasketListItem');
const Divider = require('components/Divider/Divider');
const Link = require('components/Link/Link');
const ButtonPrimary = require('components/Button/ButtonPrimary');

const WARNING = 'warning';
const PROMO_WARNING = 'basket.promoWarning';

const BasketList = function () {
    this.state = {
        basket: { itemCount: 0 },
        isLoggedIn: false,
        messageWarnings: [],
        isUS: false
    };
};

BasketList.prototype.render = function () {

    const isMobile = Sephora.isMobile();

    let basket = this.state.basket;
    let basketHasErrors = basket.error &&
        (basket.error.invalidInput || basket.error.internalError || basket.error.orderMergedMsg);

    let getBasketLevelErrors = () => {
        let basketErrors = [];

        for (var type in basket.error) {
            if (type === 'invalidInput' || type === 'internalError' || type === 'orderMergedMsg') {
                basketErrors.push(basket.error[type]);
            }
        }

        //jscs:disable requireShorthandArrowFunctions
        return basketErrors.map((item, index) => {
            return <Text
                key={index}
                is='p' marginBottom={space[2]}
                color='error'
                fontSize='h5'>
                    { item }
            </Text>;
        });
    };


    let basketLevelWarnings = (() => {
        let basketLevelMessages = [];
        let basketState = this.state.basket;

        if (basketState.basketLevelMessages &&
            !(basketState.error && basketState.error.internalError)) {
            basketLevelMessages = basketState.basketLevelMessages.filter(msg =>
            (msg.type === WARNING && msg.messageContext !== PROMO_WARNING));
        }

        return basketLevelMessages.map((item, index) => {
            return <Text
                key={index}
                is='p' marginBottom={space[2]}
                color='error'
                fontSize='h5'
                dangerouslySetInnerHTML={{ __html: item.messages[0] }}/>;
        });
    })();

    let basketHasWarnings = basketLevelWarnings.length > 0;

    const items = isMobile ? basket.products : basket.items;
    return (
        <div>
            <Box
                marginBottom={space[3]}
                lineHeight={2}
                paddingX={isMobile ? site.PADDING_MW : null}>
                <Text
                    fontSize='h3'
                    fontWeight={700}
                    data-at={Sephora.debug.dataAt('inline_basket_title')}>
                    Items in basket (<span
                        data-at={Sephora.debug.dataAt('bsk_items_count')}>{basket.itemCount}</span>)
                </Text>
            </Box>
            <Box
                backgroundColor='white'
                paddingY={space[4]}
                paddingX={isMobile ? site.PADDING_MW : space[4]}>
                { basketLevelWarnings }
                { getBasketLevelErrors() }
                {(basketHasWarnings || basketHasErrors) && basket.itemCount > 0 ?
                    <Divider
                        marginTop={space[3]}
                        marginBottom={space[4]}
                        height={2} />
                : null}
                { Array.isArray(items) && items.length > 0 ?
                    items.map((item, index) => {
                        return (
                                <div key={item.sku ? item.sku.productId : null} >
                                    {index > 0 &&
                                        <Divider marginY={space[4]} />
                                    }
                                    <BasketListItem
                                        loveSource='basket'
                                        item={item}
                                        isUS={this.state.isUS}
                                        updateBasket={this.updateBasket}/>
                                </div>
                        );
                    }
                    )
                    :
                    <Box
                        paddingY={space[4]}
                        textAlign='center'>
                        <Text
                            is='p'
                            fontWeight={700}>
                            Your basket is currently empty.
                        </Text>
                        {!this.state.isLoggedIn &&
                            <Text
                                is='p'
                                marginTop={space[2]}>
                                Please
                                {' '}
                                <Link
                                    primary={true}
                                    onClick={this.signInHandler}>
                                    sign in
                                </Link>
                                {' '}
                                if you are trying to retrieve a basket created in the past.
                            </Text>
                        }
                        <Box marginTop={space[4]}>
                            <ButtonPrimary
                                href='/new-beauty-products'
                                onClick={()=>this.shopNewClick()}
                                block={isMobile}>
                                Shop New Arrivals
                            </ButtonPrimary>
                        </Box>
                    </Box>
                }
            </Box>
        </div>);
};


// Added by sephora-jsx-loader.js
BasketList.prototype.path = 'Basket/BasketList';
// Added by sephora-jsx-loader.js
Object.assign(BasketList.prototype, require('./BasketList.c.js'));
var originalDidMount = BasketList.prototype.componentDidMount;
BasketList.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BasketList');
if (originalDidMount) originalDidMount.apply(this);
if (BasketList.prototype.ctrlr) BasketList.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BasketList');
// Added by sephora-jsx-loader.js
BasketList.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BasketList.prototype.class = 'BasketList';
// Added by sephora-jsx-loader.js
BasketList.prototype.getInitialState = function() {
    BasketList.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BasketList.prototype.render = wrapComponentRender(BasketList.prototype.render);
// Added by sephora-jsx-loader.js
var BasketListClass = React.createClass(BasketList.prototype);
// Added by sephora-jsx-loader.js
BasketListClass.prototype.classRef = BasketListClass;
// Added by sephora-jsx-loader.js
Object.assign(BasketListClass, BasketList);
// Added by sephora-jsx-loader.js
module.exports = BasketListClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/BasketList/BasketList.jsx