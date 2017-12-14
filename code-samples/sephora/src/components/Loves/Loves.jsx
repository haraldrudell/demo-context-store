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
    Sephora.Util.InflatorComps.Comps['Loves'] = function Loves(){
        return LovesClass;
    }
}
const BasketLoves = require('components/Basket/BasketLoves/BasketLoves');
const ListsLoves = require('components/RichProfile/Lists/ListsLoves/ListsLoves');

const Loves = function () {
    this.state = { loves: null };
};

Loves.prototype.render = function () {
    const {
        compType,
        compProps
    } = this.props;

    const selectLovesComponent = function(loves) {
        let comp;

        //TODO: add loves dependent components to switch statement
        switch (compType) {
            case 'BasketLoves':
                comp = <BasketLoves
                    loves={loves}
                    {...compProps}/>;
                break;
            case 'ListsLoves':
                comp = <ListsLoves
                    loves={loves}
                    {...compProps}/>;
                break;
            default:
                break;
        }

        return comp;
    };

    const lovesComponent = selectLovesComponent(this.state.loves);

    return (
        <div>
            {lovesComponent}
        </div>
    );
};


// Added by sephora-jsx-loader.js
Loves.prototype.path = 'Loves';
// Added by sephora-jsx-loader.js
Object.assign(Loves.prototype, require('./Loves.c.js'));
var originalDidMount = Loves.prototype.componentDidMount;
Loves.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Loves');
if (originalDidMount) originalDidMount.apply(this);
if (Loves.prototype.ctrlr) Loves.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Loves');
// Added by sephora-jsx-loader.js
Loves.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Loves.prototype.class = 'Loves';
// Added by sephora-jsx-loader.js
Loves.prototype.getInitialState = function() {
    Loves.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Loves.prototype.render = wrapComponentRender(Loves.prototype.render);
// Added by sephora-jsx-loader.js
var LovesClass = React.createClass(Loves.prototype);
// Added by sephora-jsx-loader.js
LovesClass.prototype.classRef = LovesClass;
// Added by sephora-jsx-loader.js
Object.assign(LovesClass, Loves);
// Added by sephora-jsx-loader.js
module.exports = LovesClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Loves/Loves.jsx