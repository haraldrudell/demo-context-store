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
    Sephora.Util.InflatorComps.Comps['MobilePromoList'] = function MobilePromoList(){
        return MobilePromoListClass;
    }
}
const { space } = require('style');
const { Box, Flex, Text } = require('components/display');
const Divider = require('components/Divider/Divider');
const BasketListItem = require('components/Basket/BasketList/BasketListItem');

const MobilePromoList = function () {
    this.state = {
        basketPromosList: null
    };
};

MobilePromoList.prototype.render = function () {
    let promos = this.state.basketPromosList;

    return (
        promos && promos.length > 0 ?
            <Box>
            {
                promos.map((item, index) =>
                    <div key={item.sku ? item.sku.productId : null}>
                        <Divider marginY={space[4]} />
                        <BasketListItem
                            item={item}
                            allowQuantityChange={false}/>
                    </div>
                )
            }
            </Box>
        : null
    );
};


// Added by sephora-jsx-loader.js
MobilePromoList.prototype.path = 'Basket/PromoSection/MobilePromoList';
// Added by sephora-jsx-loader.js
Object.assign(MobilePromoList.prototype, require('./MobilePromoList.c.js'));
var originalDidMount = MobilePromoList.prototype.componentDidMount;
MobilePromoList.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: MobilePromoList');
if (originalDidMount) originalDidMount.apply(this);
if (MobilePromoList.prototype.ctrlr) MobilePromoList.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: MobilePromoList');
// Added by sephora-jsx-loader.js
MobilePromoList.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
MobilePromoList.prototype.class = 'MobilePromoList';
// Added by sephora-jsx-loader.js
MobilePromoList.prototype.getInitialState = function() {
    MobilePromoList.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
MobilePromoList.prototype.render = wrapComponentRender(MobilePromoList.prototype.render);
// Added by sephora-jsx-loader.js
var MobilePromoListClass = React.createClass(MobilePromoList.prototype);
// Added by sephora-jsx-loader.js
MobilePromoListClass.prototype.classRef = MobilePromoListClass;
// Added by sephora-jsx-loader.js
Object.assign(MobilePromoListClass, MobilePromoList);
// Added by sephora-jsx-loader.js
module.exports = MobilePromoListClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/PromoSection/MobilePromoList/MobilePromoList.jsx