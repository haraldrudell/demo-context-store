// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var CatNavFS = function () {};

// Added by sephora-jsx-loader.js
CatNavFS.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const ReactMenuAim = require('react-menu-aim');

CatNavFS.prototype.ctrlr = function () {
    this.initMenuAim({
        submenuDirection: 'right',
        menuSelector: '#catnav-parent',
        delay: 300,
        tolerance: 75
    });
};

CatNavFS.prototype.mixins = [ReactMenuAim];

CatNavFS.prototype.handleSwitchMenu = function (index, category) {
    this.handleMouseEnterRow.call(this, index, () => {
        this.props.changeCategory(category);
    });
};


// Added by sephora-jsx-loader.js
module.exports = CatNavFS.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/CatNav/CatNavFS/CatNavFS.c.js