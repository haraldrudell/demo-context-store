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
    Sephora.Util.InflatorComps.Comps['AddToBasketButton'] = function AddToBasketButton(){
        return AddToBasketButtonClass;
    }
}
const Button = require('components/Button/Button');
const basketUtils = require('utils/Basket');
const OutOfStockButton = require('components/AddToBasketButton/OutOfStockButton/OutOfStockButton');

const AddToBasketButton = function () {
    this.state = {
        disabled: true
    };
};

AddToBasketButton.prototype.render = function () {
    const {
        sku,
        type,
        text,
        disabled,
        minWidth = 78,
        ...props
    } = this.props;

    if (sku.isOutOfStock) {
        return (
            <OutOfStockButton
                {...props}
                type={type}
                sku={sku} />
        );
    } else {
        const AddButton = (type === basketUtils.ADD_TO_BASKET_TYPES.RED)
            ? require('components/Button/ButtonRed')
            : type === basketUtils.ADD_TO_BASKET_TYPES.PRIMARY
            ? require('components/Button/ButtonPrimary')
            : type === basketUtils.ADD_TO_BASKET_TYPES.MUTED
            ? require('components/Button/ButtonMuted')
            : require('components/Button/ButtonOutline');

        return <AddButton
            {...props}
            disabled={this.state.disabled || disabled}
            onClick={e => this.handleAddClick(e)}
            minWidth={minWidth}>
            { text || 'Add to Basket' }
        </AddButton>;
    }
};


// Added by sephora-jsx-loader.js
AddToBasketButton.prototype.path = 'AddToBasketButton';
// Added by sephora-jsx-loader.js
Object.assign(AddToBasketButton.prototype, require('./AddToBasketButton.c.js'));
var originalDidMount = AddToBasketButton.prototype.componentDidMount;
AddToBasketButton.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: AddToBasketButton');
if (originalDidMount) originalDidMount.apply(this);
if (AddToBasketButton.prototype.ctrlr) AddToBasketButton.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: AddToBasketButton');
// Added by sephora-jsx-loader.js
AddToBasketButton.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
AddToBasketButton.prototype.class = 'AddToBasketButton';
// Added by sephora-jsx-loader.js
AddToBasketButton.prototype.getInitialState = function() {
    AddToBasketButton.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
AddToBasketButton.prototype.render = wrapComponentRender(AddToBasketButton.prototype.render);
// Added by sephora-jsx-loader.js
var AddToBasketButtonClass = React.createClass(AddToBasketButton.prototype);
// Added by sephora-jsx-loader.js
AddToBasketButtonClass.prototype.classRef = AddToBasketButtonClass;
// Added by sephora-jsx-loader.js
Object.assign(AddToBasketButtonClass, AddToBasketButton);
// Added by sephora-jsx-loader.js
module.exports = AddToBasketButtonClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/AddToBasketButton/AddToBasketButton.jsx