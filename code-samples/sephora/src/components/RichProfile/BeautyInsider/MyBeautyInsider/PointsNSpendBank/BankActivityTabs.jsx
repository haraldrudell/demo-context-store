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
    Sephora.Util.InflatorComps.Comps['BankActivityTabs'] = function BankActivityTabs(){
        return BankActivityTabsClass;
    }
}
const { colors, space } = require('style');
const { Flex } = require('components/display');

const TAB_BORDER_WIDTH = 2;

const BankActivityTabs = function () { };

BankActivityTabs.prototype.render = function () {

    const tabStyle = {
        paddingRight: space[4],
        paddingBottom: space[2],
        paddingLeft: space[4],
        marginBottom: -TAB_BORDER_WIDTH,
        color: colors.silver,
        borderBottomWidth: TAB_BORDER_WIDTH,
        borderColor: 'transparent',
        ':hover': !Sephora.isTouch ? {
            color: colors.midGray
        } : {},
        ':disabled': {
            color: colors.black,
            borderColor: colors.black
        }
    };

    return (
        <Flex
            fontWeight={500}
            marginBottom={-TAB_BORDER_WIDTH}
            borderBottom={TAB_BORDER_WIDTH}
            borderColor='nearWhite'>
            {
                React.Children.map(this.props.children,
                    child => child && React.cloneElement(child, {
                        style: tabStyle
                    })
                )
            }
        </Flex>
    );
};


// Added by sephora-jsx-loader.js
BankActivityTabs.prototype.path = 'RichProfile/BeautyInsider/MyBeautyInsider/PointsNSpendBank';
// Added by sephora-jsx-loader.js
BankActivityTabs.prototype.class = 'BankActivityTabs';
// Added by sephora-jsx-loader.js
BankActivityTabs.prototype.getInitialState = function() {
    BankActivityTabs.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BankActivityTabs.prototype.render = wrapComponentRender(BankActivityTabs.prototype.render);
// Added by sephora-jsx-loader.js
var BankActivityTabsClass = React.createClass(BankActivityTabs.prototype);
// Added by sephora-jsx-loader.js
BankActivityTabsClass.prototype.classRef = BankActivityTabsClass;
// Added by sephora-jsx-loader.js
Object.assign(BankActivityTabsClass, BankActivityTabs);
// Added by sephora-jsx-loader.js
module.exports = BankActivityTabsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/BeautyInsider/MyBeautyInsider/PointsNSpendBank/BankActivityTabs.jsx