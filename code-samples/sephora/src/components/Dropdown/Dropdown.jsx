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
    Sephora.Util.InflatorComps.Comps['Dropdown'] = function Dropdown(){
        return DropdownClass;
    }
}
const Base = require('components/Base/Base');

/**
 * Position relative container for positioning DropdownMenu component
 */
const Dropdown = function () {
    this.state = {
        isActive: false
    };
};

const Menu = require('./DropdownMenu');
const Trigger = require('./DropdownTrigger');

let ReactDOM;

if (!Sephora.isRootRender) {
    ReactDOM = require('react-dom');
}

Dropdown.prototype.render = function () {
    const {
        isHover,
        isStatic,
        onTrigger,
        syncState,
        hasSubmenu,
        delayedHover,
        ...props
    } = this.props;

    /* onTouchStart is used exclusively for tablets in dropdown. The reason is that in iOS safari
    element.focus() can only be set programatically when inside an actual touch event. This is
    needed so that the onBlur event can close it when clicked outside. */

    return (
        <Base
            {...props}
            baseStyle={{
                position: isStatic ? 'static' : 'relative',
                outline: 'none'
            }}
            tabIndex={!this.isHover ? '0' : null}
            onTouchStart={(!this.isHover && Sephora.isTouch) ? this.focusElement : null}
            onBlur={!this.isHover ? e => {
                if (ReactDOM !== undefined) {
                    const element = ReactDOM.findDOMNode(this);
                    const menu = element.querySelector('[data-comp="DropdownMenu"]');

                    /* Given to differences in how browsers interpret event dispatchers and
                    targets, we must check what current activeElement per focusout is, or
                    event.explicitOriginalTarget in the case of FireFox. We close upon blur
                    if said element is not within the dropdown's menu.
                    */

                    /* TODO 17.7: Find a more sensible way to handle this differences and address
                    why trigger is sometimes called twice in the case of Chrome, and handle how the
                    handler addressed bubbling/propagation. */

                    if (!menu.contains(e.relatedTarget ||
                        document.activeElement ||
                        e.explicitOriginalTarget)) {
                        this.triggerDropdown(e, false);
                    }
                }
            } : null}>
            {
                React.Children.map(this.props.children,
                    (child, index) => child && React.cloneElement(child,
                        {
                            key: index,
                            triggerDropdown: this.triggerDropdown,
                            open: this.state.isActive || syncState,
                            isHover: this.isHover
                        }
                    ))
            }
        </Base>
    );
};

Dropdown.prototype.propTypes = {
    /** Do not position dropdown menu relative to this element */
    isStatic: React.PropTypes.bool
};

Dropdown.Menu = Menu;
Dropdown.Trigger = Trigger;


// Added by sephora-jsx-loader.js
Dropdown.prototype.path = 'Dropdown';
// Added by sephora-jsx-loader.js
Object.assign(Dropdown.prototype, require('./Dropdown.c.js'));
var originalDidMount = Dropdown.prototype.componentDidMount;
Dropdown.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Dropdown');
if (originalDidMount) originalDidMount.apply(this);
if (Dropdown.prototype.ctrlr) Dropdown.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Dropdown');
// Added by sephora-jsx-loader.js
Dropdown.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Dropdown.prototype.class = 'Dropdown';
// Added by sephora-jsx-loader.js
Dropdown.prototype.getInitialState = function() {
    Dropdown.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Dropdown.prototype.render = wrapComponentRender(Dropdown.prototype.render);
// Added by sephora-jsx-loader.js
var DropdownClass = React.createClass(Dropdown.prototype);
// Added by sephora-jsx-loader.js
DropdownClass.prototype.classRef = DropdownClass;
// Added by sephora-jsx-loader.js
Object.assign(DropdownClass, Dropdown);
// Added by sephora-jsx-loader.js
module.exports = DropdownClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Dropdown/Dropdown.jsx