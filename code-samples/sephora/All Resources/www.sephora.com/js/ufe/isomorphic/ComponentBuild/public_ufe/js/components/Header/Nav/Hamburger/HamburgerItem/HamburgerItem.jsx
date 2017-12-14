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
    Sephora.Util.InflatorComps.Comps['HamburgerItem'] = function HamburgerItem(){
        return HamburgerItemClass;
    }
}
const Title = require('./ItemTitle/ItemTitle');
const Menu = require('./ItemMenu/ItemMenu');
const Header = require('./ItemHeader/ItemHeader');

const HamburgerItem = function () {
    this.state = {
        isOpen: false
    };
};

HamburgerItem.prototype.render = function () {
    return (
        <div>
            { React.Children.map(this.props.children,
                (child, index) => child && React.cloneElement(child,
                    {
                        key: index,
                        isOpen: this.state.isOpen,
                        toggleSubmenu: this.toggleSubmenu
                    }
                ))
            }
        </div>
    );
};

HamburgerItem.Title = Title;
HamburgerItem.Menu = Menu;
HamburgerItem.Header = Header;


// Added by sephora-jsx-loader.js
HamburgerItem.prototype.path = 'Header/Nav/Hamburger/HamburgerItem';
// Added by sephora-jsx-loader.js
Object.assign(HamburgerItem.prototype, require('./HamburgerItem.c.js'));
var originalDidMount = HamburgerItem.prototype.componentDidMount;
HamburgerItem.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: HamburgerItem');
if (originalDidMount) originalDidMount.apply(this);
if (HamburgerItem.prototype.ctrlr) HamburgerItem.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: HamburgerItem');
// Added by sephora-jsx-loader.js
HamburgerItem.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
HamburgerItem.prototype.class = 'HamburgerItem';
// Added by sephora-jsx-loader.js
HamburgerItem.prototype.getInitialState = function() {
    HamburgerItem.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
HamburgerItem.prototype.render = wrapComponentRender(HamburgerItem.prototype.render);
// Added by sephora-jsx-loader.js
var HamburgerItemClass = React.createClass(HamburgerItem.prototype);
// Added by sephora-jsx-loader.js
HamburgerItemClass.prototype.classRef = HamburgerItemClass;
// Added by sephora-jsx-loader.js
Object.assign(HamburgerItemClass, HamburgerItem);
// Added by sephora-jsx-loader.js
module.exports = HamburgerItemClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/Hamburger/HamburgerItem/HamburgerItem.jsx