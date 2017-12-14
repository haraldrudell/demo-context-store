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
    Sephora.Util.InflatorComps.Comps['CatNavMW'] = function CatNavMW(){
        return CatNavMWClass;
    }
}
const HamburgerItem = require('components/Header/Nav/Hamburger/HamburgerItem/HamburgerItem');
const CatNavChild = require('components/Header/Nav/CatNav/CatNavChild/CatNavChild');

const CatNavMW = function () { };

CatNavMW.prototype.render = function () {
    const {
        categories,
        openCategory,
        changeCategory,
        categoryMenu
    } = this.props;

    return (
        <HamburgerItem>
            {
                categories && categories.map((category, index) =>
                    <HamburgerItem.Title
                        key={index}
                        callback={() => changeCategory(category)}
                        title={['shop', category.displayName]}>
                        {category.displayName}
                    </HamburgerItem.Title>
                )
            }
            {
                categoryMenu && categoryMenu.map((category, index) =>
                    <HamburgerItem.Title
                        key={index}
                        href={category.targetScreen.targetUrl}
                        title={['shop', category.displayTitle]}>
                        {category.displayTitle}
                    </HamburgerItem.Title>
                )
            }
            <HamburgerItem.Menu>
                {
                    openCategory ?
                        <CatNavChild openCategory={openCategory} />
                        : null
                }
            </HamburgerItem.Menu>
        </HamburgerItem>
    );
};


// Added by sephora-jsx-loader.js
CatNavMW.prototype.path = 'Header/Nav/CatNav/CatNavMW';
// Added by sephora-jsx-loader.js
CatNavMW.prototype.class = 'CatNavMW';
// Added by sephora-jsx-loader.js
CatNavMW.prototype.getInitialState = function() {
    CatNavMW.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
CatNavMW.prototype.render = wrapComponentRender(CatNavMW.prototype.render);
// Added by sephora-jsx-loader.js
var CatNavMWClass = React.createClass(CatNavMW.prototype);
// Added by sephora-jsx-loader.js
CatNavMWClass.prototype.classRef = CatNavMWClass;
// Added by sephora-jsx-loader.js
Object.assign(CatNavMWClass, CatNavMW);
// Added by sephora-jsx-loader.js
module.exports = CatNavMWClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/CatNav/CatNavMW/CatNavMW.jsx