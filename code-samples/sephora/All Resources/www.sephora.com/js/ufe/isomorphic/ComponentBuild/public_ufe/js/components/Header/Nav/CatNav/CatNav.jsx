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
    Sephora.Util.InflatorComps.Comps['CatNav'] = function CatNav(){
        return CatNavClass;
    }
}
const CatNav = function () {
    this.state = {
        categories: this.props.categories,
        openCategory: null
    };
};

const CatNavFS = require('./CatNavFS/CatNavFS');
const CatNavMW = require('./CatNavMW/CatNavMW');

CatNav.prototype.render = function () {

    return (
        Sephora.isDesktop() ?
            <CatNavFS
                width={this.props.width}
                categories={this.state.categories}
                openCategory={this.state.openCategory}
                changeCategory={this.changeCategory}
                categoryMenu={this.props.categoryMenu}
                trackNavClick={this.props.trackNavClick}/>
            : <CatNavMW
                categories={this.state.categories}
                openCategory={this.state.openCategory}
                changeCategory={this.changeCategory}
                categoryMenu={this.props.categoryMenu}/>
    );
};


// Added by sephora-jsx-loader.js
CatNav.prototype.path = 'Header/Nav/CatNav';
// Added by sephora-jsx-loader.js
Object.assign(CatNav.prototype, require('./CatNav.c.js'));
var originalDidMount = CatNav.prototype.componentDidMount;
CatNav.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: CatNav');
if (originalDidMount) originalDidMount.apply(this);
if (CatNav.prototype.ctrlr) CatNav.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: CatNav');
// Added by sephora-jsx-loader.js
CatNav.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
CatNav.prototype.class = 'CatNav';
// Added by sephora-jsx-loader.js
CatNav.prototype.getInitialState = function() {
    CatNav.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
CatNav.prototype.render = wrapComponentRender(CatNav.prototype.render);
// Added by sephora-jsx-loader.js
var CatNavClass = React.createClass(CatNav.prototype);
// Added by sephora-jsx-loader.js
CatNavClass.prototype.classRef = CatNavClass;
// Added by sephora-jsx-loader.js
Object.assign(CatNavClass, CatNav);
// Added by sephora-jsx-loader.js
module.exports = CatNavClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/CatNav/CatNav.jsx