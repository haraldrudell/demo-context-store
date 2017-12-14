// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Dropdown = function () {};

// Added by sephora-jsx-loader.js
Dropdown.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const ReactDOM = require('react-dom');
const DELAY = 200;

Dropdown.prototype.ctrlr = function () {
    const element = ReactDOM.findDOMNode(this);
    this.isHover = (() => {
        let value;

        if (Sephora.isTouch) {
            value = false;
        } else if (this.props.isHover) {
            value = true;
        } else {
            value = false;
        }

        return value;
    })();

    if (this.isHover) {
        let delayedTrigger = null;

        element.addEventListener('mouseenter', this.props.delayedHover ? (e) => {
            delayedTrigger = setTimeout(this.triggerDropdown.bind(this, e, true), DELAY);
        } : this.triggerDropdown);

        element.addEventListener('mouseleave', this.props.delayedHover ? (e) => {
            if (delayedTrigger !== null) {
                clearTimeout(delayedTrigger);
                delayedTrigger = null;
            } else {
                return;
            }

            this.triggerDropdown(e, false);
        } : this.triggerDropdown);
    } else {
        const handler = this.props.hasSubmenu ?
            e => this.triggerDropdown(e, true) : this.triggerDropdown;
        element.addEventListener('click', handler);
    }
};

Dropdown.prototype.componentWillReceiveProps = function (nextProps) {
    /* syncState prop should be added only when you need to share active state
     * between the dropdown and its enclosing component.
     */

    const undefinedProp = typeof nextProps === 'undefined' ||
        typeof nextProps.syncState === 'undefined';
    const nullProp = nextProps === null || nextProps.syncState === null;

    if (undefinedProp || nullProp) {
        return null;
    }

    if (nextProps.syncState !== this.state.isActive) {
        this.setState({
            isActive: nextProps.syncState
        });
    }
};

Dropdown.prototype.focusElement = function (dropdown = null) {
    if (!this.state.isActive) {
        const element = dropdown ? dropdown : ReactDOM.findDOMNode(this);
        element.focus();
    }
};

Dropdown.prototype.triggerDropdown = function (e, bool = null) {
    const element = ReactDOM.findDOMNode(this);

    if (!this.isHover && !Sephora.isTouch) {

        /* For click dropdowns we must set focus on the dropdown element when it is opened
        * because we use the onBlur event to close when clicked outside or on another element.
        *
        * We exclude callbacks from tablets since those get focused by onTouchStart.
        */
        this.focusElement(element);
    }

    if (this.state.isActive && element.contains(e.relatedTarget)) {
        // Don't trigger if element is inside the dropdown and menu is open
        return;
    }

    if (bool !== this.state.isActive) {
        let value = bool ? bool : !this.state.isActive;

        /* A dropdown closed by click will not loose its focus automatically in IE, so we must
        explicitly remove focus when closing the dropdown.
        TODO 17.7: Remove this as part of Dropdown improvements
        */
        if (value === false &&
            element.contains(document.activeElement)) {
            document.activeElement.blur();
        }

        this.setState({
            isActive: value
        }, this.props.onTrigger ? this.props.onTrigger(e) : null);

    } else {
        if (e) {
            e.stopPropagation();
        }

        return;
    }
};


// Added by sephora-jsx-loader.js
module.exports = Dropdown.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Dropdown/Dropdown.c.js