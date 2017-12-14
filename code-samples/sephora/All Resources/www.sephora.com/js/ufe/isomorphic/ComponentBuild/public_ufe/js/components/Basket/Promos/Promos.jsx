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
    Sephora.Util.InflatorComps.Comps['Promos'] = function Promos(){
        return PromosClass;
    }
}
const {
    space
} = require('style');
const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;
const Grid = require('components/Grid/Grid');
const PromoItem = require('components/Product/PromoItem/PromoItem');

const Promos = function () {};

Promos.prototype.render = function () {
    const itemSpacing = space[5];
    let promos = this.props.promos;
    return (
        <Grid
            marginBottom={-itemSpacing}
            gutter={itemSpacing}>
            {promos &&
            promos.promosList.map((promo, index) =>
                <Grid.Cell
                    display='flex'
                    width={Sephora.isMobile() ? 1 / 2 : 1 / 4}
                    paddingBottom={itemSpacing}>
                    <PromoItem
                        key={index}
                        imageSize={IMAGE_SIZES[135]}
                        imagePath={promo.image}
                        type={'promo'}
                        maxMsgSkusToSelect={promos.maxMsgSkusToSelect}
                        {...promo} />
                </Grid.Cell>
            )
            }
        </Grid>
    );
};


// Added by sephora-jsx-loader.js
Promos.prototype.path = 'Basket/Promos';
// Added by sephora-jsx-loader.js
Promos.prototype.class = 'Promos';
// Added by sephora-jsx-loader.js
Promos.prototype.getInitialState = function() {
    Promos.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Promos.prototype.render = wrapComponentRender(Promos.prototype.render);
// Added by sephora-jsx-loader.js
var PromosClass = React.createClass(Promos.prototype);
// Added by sephora-jsx-loader.js
PromosClass.prototype.classRef = PromosClass;
// Added by sephora-jsx-loader.js
Object.assign(PromosClass, Promos);
// Added by sephora-jsx-loader.js
module.exports = PromosClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/Promos/Promos.jsx