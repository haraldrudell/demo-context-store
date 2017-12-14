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
    Sephora.Util.InflatorComps.Comps['HamburgerMenu'] = function HamburgerMenu(){
        return HamburgerMenuClass;
    }
}
const { overlay, dropdown, space, zIndex } = require('style');
const { Box, Grid, Image } = require('components/display');
const Locale = require('utils/LanguageLocale.js');
const IconTruck = require('components/Icon/IconTruck');
const IconLocate = require('components/Icon/IconLocate');
const AccountGreeting = require('components/Header/Nav/Account/AccountGreeting/AccountGreeting');
const AccountMenu = require('components/Header/Nav/Account/AccountMenu/AccountMenu');
const canImg = Locale.flags.CA;
const usImg = Locale.flags.US;
const HamburgerItem = require('components/Header/Nav/Hamburger/HamburgerItem/HamburgerItem');
const CatNav = require('components/Header/Nav/CatNav/CatNav');
const TopNavContent = require('components/Header/Nav/TopNav/TopNavContent/TopNavContent');
const UI = require('utils/UI');

const HamburgerMenu = function () {

    /* Note: CatNav is initialized as true to have it render behind the scenes and fetch
    * the category information.
    */
    this.state = {
        isOpen: false,
        currCtry: Locale.getCurrentCountry().toUpperCase(),
        currLang: null,
        account: false,
        catNav: true,
        tipMenu: null,
        user: {}
    };
};

HamburgerMenu.prototype.getInitialState = HamburgerMenu;

HamburgerMenu.prototype.render = function () {
    let {
        categoryMenu = [],
        categories = [],
        topNavigationMenu = []
    } = this.props;

    const layer = zIndex.HAMBURGER;

    const styles = {
        overlay: {
            position: 'fixed',
            zIndex: layer,
            top: 0,
            left: 0,
            width: '100%',
            transition: 'opacity .3s',
            backgroundColor: overlay.COLOR
        },
        inner: {
            position: 'fixed',
            zIndex: layer,
            top: 0,
            bottom: 0,
            left: 0,
            width: 260,
            overflowX: 'hidden',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            boxShadow: dropdown.SHADOW,
            transition: 'transform .3s ease-in-out',
            backfaceVisibility: 'hidden'
        },
        footIcon: {
            textAlign: 'center',
            width: 20,
            marginRight: '1em',
            fontSize: '1.25em',
            lineHeight: 0
        }
    };

    let renderCurrentMenu = () => {
        let menu;
        if (this.state.account) {
            menu = (
                <div>
                    <HamburgerItem.Header isAccount>
                        <AccountGreeting user={this.state.user}/>
                    </HamburgerItem.Header>
                    <AccountMenu user={this.state.user}/>
                </div>
            );
        } else if (this.state.catNav) {
            menu = (
                <div>
                    <HamburgerItem.Header>Shop</HamburgerItem.Header>
                    <CatNav categories={categories} categoryMenu={categoryMenu} />
                </div>
            );
        } else if (this.state.tipMenu) {
            menu = <TopNavContent item={this.state.tipMenu}/>;
        } else {
            menu = null;
        }

        return menu;
    };

    UI.preventBackgroundScroll(this.state.isOpen);

    return (
        <div id='HamburgerMenu'>
            <Box
                is='div'
                onClick={() => this.close()}
                onTouchMove={e => e.preventDefault()}
                _css={styles.overlay}
                style={{
                    bottom: this.state.isOpen ? 0 : null,
                    opacity: this.state.isOpen ? overlay.OPACITY : 0
                }} />
            <Box
                id='HamburgerMenuScrollContainer'
                backgroundColor='nearWhite'
                _css={styles.inner}
                style={{
                    transform: this.state.isOpen
                        ? 'translate3d(0, 0, 0)'
                        : 'translate3d(-105%, 0, 0)'
                }}>
                <Box backgroundColor='white'>
                    <HamburgerItem>
                        <HamburgerItem.Title
                            isMainMenu
                            isAccount
                            callback={() => this.setState({
                                account: true,
                                catNav: false,
                                tipMenu: null
                            })}>
                            <AccountGreeting user={this.state.user}/>
                        </HamburgerItem.Title>
                        <HamburgerItem.Title
                            isMainMenu
                            title={['Home']}
                            href={'/'}>
                            Home
                        </HamburgerItem.Title>
                        <HamburgerItem.Title
                            isMainMenu
                            title={['Shop']}
                            callback={() => this.setState({
                                account: false,
                                catNav: true,
                                tipMenu: null
                            })}>
                            Shop
                        </HamburgerItem.Title>
                        {
                            topNavigationMenu && topNavigationMenu.map(
                                (item, index) =>
                                    (item && item.displayTitle) &&
                                    <HamburgerItem.Title
                                        key={index}
                                        isMainMenu
                                        isLast={index === topNavigationMenu.length - 1}
                                        title={[item.displayTitle]}
                                        callback={() => this.setState({
                                            account: false,
                                            catNav: false,
                                            tipMenu: item
                                        })}>
                                        {item.displayTitle}
                                    </HamburgerItem.Title>
                            )
                        }
                        <HamburgerItem.Menu>
                            {renderCurrentMenu()}
                        </HamburgerItem.Menu>
                    </HamburgerItem>


                </Box>
                <Box
                    fontSize='h5'
                    paddingY={space[3]}
                    paddingX={space[4]}>
                    <Grid
                        alignItems='center'
                        paddingY={space[3]}
                        href='/account/orders'
                        onClick={this.trackOrderClick}>
                        <Grid.Cell _css={styles.footIcon}>
                            <IconTruck _css={{
                                fontSize: '88%'
                            }} />
                        </Grid.Cell>
                        <Grid.Cell width='fill'>
                            Track Order
                        </Grid.Cell>
                    </Grid>
                    <Grid
                        alignItems='center'
                        paddingY={space[3]}
                        href='/stores'
                        onClick={this.trackFindAStoreClick}
                        data-at={Sephora.debug.dataAt('find_in_store')}>
                        <Grid.Cell
                            _css={styles.footIcon}>
                            <IconLocate />
                        </Grid.Cell>
                        <Grid.Cell width='fill'>
                            Find a Store
                        </Grid.Cell>
                    </Grid>
                    <Grid
                        alignItems='center'
                        paddingY={space[3]}
                        onClick={() => this.changeCountry()}>
                        <Grid.Cell
                            lineHeight={0}
                            _css={styles.footIcon}>
                            <Image
                                src={this.state.currCtry === Locale.COUNTRIES.US ?
                                    usImg : canImg} />
                        </Grid.Cell>
                        <Grid.Cell width='fill'>
                            Change Country {
                                this.state.currCtry === Locale.COUNTRIES.US ?
                                    '(US)' : this.state.currLang === Locale.LANGUAGES.EN ?
                                        '(ENG)' : '(FR)'
                            }
                        </Grid.Cell>
                    </Grid>
                </Box>
            </Box>
        </div>
    );
};


// Added by sephora-jsx-loader.js
HamburgerMenu.prototype.path = 'Header/Nav/Hamburger/HamburgerMenu';
// Added by sephora-jsx-loader.js
Object.assign(HamburgerMenu.prototype, require('./HamburgerMenu.c.js'));
var originalDidMount = HamburgerMenu.prototype.componentDidMount;
HamburgerMenu.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: HamburgerMenu');
if (originalDidMount) originalDidMount.apply(this);
if (HamburgerMenu.prototype.ctrlr) HamburgerMenu.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: HamburgerMenu');
// Added by sephora-jsx-loader.js
HamburgerMenu.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
HamburgerMenu.prototype.class = 'HamburgerMenu';
// Added by sephora-jsx-loader.js
HamburgerMenu.prototype.getInitialState = function() {
    HamburgerMenu.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
HamburgerMenu.prototype.render = wrapComponentRender(HamburgerMenu.prototype.render);
// Added by sephora-jsx-loader.js
var HamburgerMenuClass = React.createClass(HamburgerMenu.prototype);
// Added by sephora-jsx-loader.js
HamburgerMenuClass.prototype.classRef = HamburgerMenuClass;
// Added by sephora-jsx-loader.js
Object.assign(HamburgerMenuClass, HamburgerMenu);
// Added by sephora-jsx-loader.js
module.exports = HamburgerMenuClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/Hamburger/HamburgerMenu/HamburgerMenu.jsx