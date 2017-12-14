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
    Sephora.Util.InflatorComps.Comps['Fieldset'] = function Fieldset(){
        return FieldsetClass;
    }
}
const { css } = require('glamor');
const Box = require('components/Box/Box');

const Fieldset = function () {};

Fieldset.prototype.render = function () {
    /**
     * WebKit + Firefox constrain fieldsets to have an "implicit" width based on
     * the computed width of their contents breaking layout when nowrap is used.
     * - 1. In Webkit this behaviour is defined in the default stylesheet so we can
     * simply override.
     * - 2. In Firefox, width constraints are enforced deep in the Gecko layout code.
     * Add a Gecko-only rule (otherwise, breaks IE layout) to set the display
     * property to a value corresponding to one of several internal table elements.
     */
    const styles = {
        width: '100%',
        minWidth: 0 /* 1 */
    };

    /* 2 */
    css.insert('@-moz-document url-prefix(){fieldset{display:table-cell}}');

    return (
        <Box
            is='fieldset'
            baseStyle={styles}
            {...this.props} />
    );
};


// Added by sephora-jsx-loader.js
Fieldset.prototype.path = 'Fieldset';
// Added by sephora-jsx-loader.js
Fieldset.prototype.class = 'Fieldset';
// Added by sephora-jsx-loader.js
Fieldset.prototype.getInitialState = function() {
    Fieldset.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Fieldset.prototype.render = wrapComponentRender(Fieldset.prototype.render);
// Added by sephora-jsx-loader.js
var FieldsetClass = React.createClass(Fieldset.prototype);
// Added by sephora-jsx-loader.js
FieldsetClass.prototype.classRef = FieldsetClass;
// Added by sephora-jsx-loader.js
Object.assign(FieldsetClass, Fieldset);
// Added by sephora-jsx-loader.js
module.exports = FieldsetClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Fieldset/Fieldset.jsx