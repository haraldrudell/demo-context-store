// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

const {
    colors, dropdown, space, zIndex
} = require('style');
const { Box, Flex } = require('components/display');
const IconBasket = require('components/Icon/IconBasket');
const Dropdown = require('components/Dropdown/Dropdown');
const BasketDesktop = require('./BasketDesktop/BasketDesktop');
const BasketMobile = require('./BasketMobile/BasketMobile');
const BasketUtils = require('utils/Basket');

const InlineBasket = function () {
    this.state = {
        basket: { itemCount: 0 },
        fixed: false,
        isOpen: false,
        isLoggedIn: false,
        renderBasket: Sephora.isDesktop() || (Sephora.isMobile() && !Sephora.isLegacyMode),
        showHover: !Sephora.isThirdPartySite
    };
};

InlineBasket.prototype.asyncRender = 'UserInfo';

InlineBasket.prototype.render = function () {

    const basketWidth = 380;
    const iconPadding = space[2];

    let styles = {
        dropdown: {
            boxShadow: this.state.isOpen ? dropdown.SHADOW : null
        },
        shadowCover: this.state.isOpen ? {
            position: 'absolute',
            zIndex: zIndex.DROPDOWN + 1,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.white,
            height: 5,
            display: this.state.fixed ? 'none' : null
        } : { },
        dropdownMenu: this.state.fixed ? {
            position: 'fixed',
            top: 0,
            right: 'auto',
            left: this.rightOffset() - basketWidth
        } : { }
    };

    let basketIcon =
        <Box
            display='inline-block'
            onClick={this.onBasketClick}
            href={this.state.renderBasket ? BasketUtils.PAGE_URL : null}
            padding={iconPadding}
            style={{
                visibility: this.state.renderBasket ? null : 'hidden'
            }}>
            <Box
                position='relative'
                lineHeight={0}>
                <IconBasket
                    fontSize={Sephora.isMobile() ? 20 : 27} />
                {this.state.basket.itemCount > 0 &&
                    <Flex
                        fontSize='h5'
                        justifyContent='center'
                        alignItems='center'
                        circle={true}
                        fontWeight={700}
                        lineHeight={1}
                        color='white'
                        backgroundColor='red'
                        position='absolute'
                        top='50%'
                        right='-.5em'
                        transform='translate(0, -50%)'
                        width='1.5em' height='1.5em'
                        data-at={Sephora.debug.dataAt('basket_count')}>
                        {this.state.basket.itemCount}
                    </Flex>
                }
            </Box>
        </Box>;

    return (
        <Box marginRight={-iconPadding}>
            {Sephora.isDesktop() ?
                !this.state.showHover ? basketIcon :
                    <Dropdown
                        isHover={true}
                        _css={styles.dropdown}
                        onTrigger={this.toggleOpen}
                        syncState ={this.state.isOpen}>
                        <Dropdown.Trigger>
                            {basketIcon}
                            <Box
                                _css={styles.shadowCover} />
                        </Dropdown.Trigger>
                        <Dropdown.Menu
                            right={true}
                            width='auto'
                            _css={styles.dropdownMenu}>
                            <BasketDesktop
                                basket={this.state.basket}
                                width={basketWidth}
                                isLoggedIn={this.state.isLoggedIn}
                                signInHandler={this.signInHandler}
                                justAddedProducts={this.state.justAddedProducts}
                                onCheckoutClick={this.onCheckoutClick}
                                onBasketClick={this.onBasketHoverClick}/>
                        </Dropdown.Menu>
                    </Dropdown>
                :
                <BasketMobile
                    isOpen={this.state.isOpen}
                    basket={this.state.basket}
                    onCheckoutClick={this.onCheckoutClick}>
                    {basketIcon}
                </BasketMobile>
            }
        </Box>
    );
};


// Added by sephora-jsx-loader.js
InlineBasket.prototype.path = 'InlineBasket';
// Added by sephora-jsx-loader.js
Object.assign(InlineBasket.prototype, require('./InlineBasket.c.js'));
var originalDidMount = InlineBasket.prototype.componentDidMount;
InlineBasket.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: InlineBasket');
if (originalDidMount) originalDidMount.apply(this);
if (InlineBasket.prototype.ctrlr) InlineBasket.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: InlineBasket');
// Added by sephora-jsx-loader.js
InlineBasket.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
InlineBasket.prototype.class = 'InlineBasket';
// Added by sephora-jsx-loader.js
InlineBasket.prototype.getInitialState = function() {
    InlineBasket.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
InlineBasket.prototype.render = wrapComponentRender(InlineBasket.prototype.render);
// Added by sephora-jsx-loader.js
var InlineBasketClass = React.createClass(InlineBasket.prototype);
// Added by sephora-jsx-loader.js
InlineBasketClass.prototype.classRef = InlineBasketClass;
// Added by sephora-jsx-loader.js
Object.assign(InlineBasketClass, InlineBasket);
// Added by sephora-jsx-loader.js
module.exports = InlineBasketClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/InlineBasket/InlineBasket.jsx