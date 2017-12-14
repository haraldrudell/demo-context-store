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
    Sephora.Util.InflatorComps.Comps['TopNav'] = function TopNav(){
        return TopNavClass;
    }
}
const Flex = require('components/Flex/Flex');
const TopNavItem = require('components/Header/Nav/TopNav/TopNavItem/TopNavItem');
const TopNavContent = require('components/Header/Nav/TopNav/TopNavContent/TopNavContent');
const CatNav = require('components/Header/Nav/CatNav/CatNav');
const HamburgerMenu = require('components/Header/Nav/Hamburger/HamburgerMenu/HamburgerMenu');
const TestTarget = require('components/TestTarget/TestTarget');

const TopNav = function () {
    this.state = {
        categoryFlyout: false,
        currentMenu: null,
        renderMenus: false
    };
};

TopNav.prototype.checkMenuLength = function (menu) {
    const menuLimit = 6;

    //Current limit to amount of BCC menus in TopNav is 6.
    return menu && menu.filter((menuItem, index) => {
        while (index < menuLimit) {
            return menuItem;
        }
    });
};

TopNav.prototype.render = function () {
    let {
 categoryMenu, topNavigationMenu
} = this.props.data;
    topNavigationMenu = this.checkMenuLength(topNavigationMenu);

    const baseCategories = [
        {
            displayName: 'Makeup',
            targetUrl: '/makeup-cosmetics',
            categoryId: 'cat140006'
        },
        {
            displayName: 'Skin Care',
            targetUrl: '/skincare',
            categoryId: 'cat150006'
        },
        {
            displayName: 'Fragrance',
            targetUrl: '/fragrance',
            categoryId: 'cat160006'
        },
        {
            displayName: 'Bath & Body',
            targetUrl: '/bath-body',
            categoryId: 'cat140014'
        },
        {
            displayName: 'Nails',
            targetUrl: '/nail-care-nail-supplies',
            categoryId: 'cat180012'
        },
        {
            displayName: 'Hair',
            targetUrl: '/hair-products',
            categoryId: 'cat130038'
        },
        {
            displayName: 'Tools & Brushes',
            targetUrl: '/makeup-tools',
            categoryId: 'cat130042'
        },
        {
            displayName: 'Men',
            targetUrl: '/men',
            categoryId: 'cat130044'
        },
        {
            displayName: 'Gifts',
            targetUrl: '/gifts',
            categoryId: 'cat60270'
        }
    ];

    const catNavWidth = 216;
    const tabHeight = 40;

    return (
        Sephora.isDesktop() ?
            <Flex
                justifyContent='space-between'
                position='relative'
                height={tabHeight}
                onMouseLeave={this.resetMenu}>
                <TopNavItem
                    isCats={true}
                    title='Shop'
                    isStatic={this.state.categoryFlyout}
                    index={0}
                    setMenu={this.setMenu}
                    currentMenu={this.state.currentMenu}
                    toggleFlyout={this.toggleFlyout}
                    clearCategories={this.clearCategories}
                    trackNavClick={this.trackNavClick}
                    tabHeight={tabHeight}
                    catNavWidth={catNavWidth}>
                    {
                        this.state.renderMenus ?
                            <TestTarget
                            testName='globalNav'
                            testComponent='CatNav'
                            testCallback={() => this.setMenu(null, 0)}
                            width={catNavWidth}
                            categories={baseCategories}
                            categoryMenu={categoryMenu}
                            toggleFlyout={this.toggleFlyout}
                            categoryFlyout={this.state.categoryFlyout}
                            trackNavClick={this.trackNavClick} /> : null
                    }

                </TopNavItem>
                {
                    topNavigationMenu && topNavigationMenu.map((item, index) =>
                        <TopNavItem
                            key={index}
                            targetUrl={item.targetUrl}
                            title={item.displayTitle}
                            isStatic={true}
                            index={index + 1}
                            setMenu={this.setMenu}
                            currentMenu={this.state.currentMenu}
                            trackNavClick={this.trackNavClick}
                            tabHeight={tabHeight}>
                            {
                                (this.state.renderMenus && item.components) ?
                                    <TopNavContent item={item} /> : null
                            }
                        </TopNavItem>
                    )
                }
            </Flex>
            :
            <HamburgerMenu
                categories={baseCategories}
                topNavigationMenu={topNavigationMenu}
                categoryMenu={categoryMenu} />
    );
};


// Added by sephora-jsx-loader.js
TopNav.prototype.path = 'Header/Nav/TopNav';
// Added by sephora-jsx-loader.js
Object.assign(TopNav.prototype, require('./TopNav.c.js'));
var originalDidMount = TopNav.prototype.componentDidMount;
TopNav.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: TopNav');
if (originalDidMount) originalDidMount.apply(this);
if (TopNav.prototype.ctrlr) TopNav.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: TopNav');
// Added by sephora-jsx-loader.js
TopNav.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
TopNav.prototype.class = 'TopNav';
// Added by sephora-jsx-loader.js
TopNav.prototype.getInitialState = function() {
    TopNav.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
TopNav.prototype.render = wrapComponentRender(TopNav.prototype.render);
// Added by sephora-jsx-loader.js
var TopNavClass = React.createClass(TopNav.prototype);
// Added by sephora-jsx-loader.js
TopNavClass.prototype.classRef = TopNavClass;
// Added by sephora-jsx-loader.js
Object.assign(TopNavClass, TopNav);
// Added by sephora-jsx-loader.js
module.exports = TopNavClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/TopNav/TopNav.jsx