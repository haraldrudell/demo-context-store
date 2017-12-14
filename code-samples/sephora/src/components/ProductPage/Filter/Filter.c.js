// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Filter = function () {};

// Added by sephora-jsx-loader.js
Filter.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const Filters = require('utils/Filters');
const UIUtils = require('utils/UI');

Filter.prototype.ctrlr = function () {};

Filter.prototype.componentWillReceiveProps = function (updatedProps) {
    this.setState({
        selected: (updatedProps.selected || []).reduce((acc, item) => {
            acc[item] = true;
            return acc;
        }, {})
    });
};

Filter.prototype.onItemToggled = function (value) {
    let {
        type
    } = this.props;
    let selected = Object.assign({}, this.state.selected);
    switch (type) {
        case Filters.TYPES.CHECKBOX:
            selected[value] = !selected[value];
            break;
        case Filters.TYPES.RADIO:
            selected = {};
            selected[value] = true;
            break;
        default:
    }
    this.setState({
        selected: selected
    }, () => {
        // dirty hack for IOS only to re-render DOM
        UIUtils.refreshStuckUIRender();
        if (this.props.reactOnChange) {
            this.setState({
                isDropdownOpen: false
            }, () => {
                this.props.reactOnChange(type === Filters.TYPES.CHECKBOX ? selected : value);
            });
        }
    });
};

Filter.prototype.toggleDropdownOpen = function (e) {
    this.setState({
        isDropdownOpen: !this.state.isDropdownOpen
    });
};


// Added by sephora-jsx-loader.js
module.exports = Filter.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/Filter/Filter.c.js