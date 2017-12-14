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
    Sephora.Util.InflatorComps.Comps['CatalogHeader'] = function CatalogHeader(){
        return CatalogHeaderClass;
    }
}
var CatalogHeaderMW = require('./CatalogHeaderMW/CatalogHeaderMW');
var CatalogHeaderFS = require('./CatalogHeaderFS/CatalogHeaderFS');

var CatalogHeader = function () {
    this.state = {
        totalProducts: 0,
        displayName: ''
    };
};

CatalogHeader.prototype.render = function () {
    return (
     <div>
			{
       Sephora.isMobile() ?
        <CatalogHeaderMW
         {...this.props}
         productsQuantity={this.state.totalProducts}
         displayName={this.state.displayName} /> :
        <CatalogHeaderFS
         {...this.props}
         productsQuantity={this.state.totalProducts}
         displayName={this.state.displayName} />
      }
		</div>
    );
};


// Added by sephora-jsx-loader.js
CatalogHeader.prototype.path = 'Catalog/CatalogHeader';
// Added by sephora-jsx-loader.js
Object.assign(CatalogHeader.prototype, require('./CatalogHeader.c.js'));
var originalDidMount = CatalogHeader.prototype.componentDidMount;
CatalogHeader.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: CatalogHeader');
if (originalDidMount) originalDidMount.apply(this);
if (CatalogHeader.prototype.ctrlr) CatalogHeader.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: CatalogHeader');
// Added by sephora-jsx-loader.js
CatalogHeader.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
CatalogHeader.prototype.class = 'CatalogHeader';
// Added by sephora-jsx-loader.js
CatalogHeader.prototype.getInitialState = function() {
    CatalogHeader.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
CatalogHeader.prototype.render = wrapComponentRender(CatalogHeader.prototype.render);
// Added by sephora-jsx-loader.js
var CatalogHeaderClass = React.createClass(CatalogHeader.prototype);
// Added by sephora-jsx-loader.js
CatalogHeaderClass.prototype.classRef = CatalogHeaderClass;
// Added by sephora-jsx-loader.js
Object.assign(CatalogHeaderClass, CatalogHeader);
// Added by sephora-jsx-loader.js
module.exports = CatalogHeaderClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/CatalogHeader/CatalogHeader.jsx