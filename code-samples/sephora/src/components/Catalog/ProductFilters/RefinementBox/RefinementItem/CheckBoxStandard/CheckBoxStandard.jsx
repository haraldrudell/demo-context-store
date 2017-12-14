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
    Sephora.Util.InflatorComps.Comps['CheckBoxStandard'] = function CheckBoxStandard(){
        return CheckBoxStandardClass;
    }
}
// jscs:disable
var CheckBoxStandard = function () {

};

CheckBoxStandard.prototype.render = function () {
    const styles = {
        root: {
            display: 'flex',
            alignItems: 'center',
            paddingTop: '.25em',
            paddingBottom: '.25em',
            cursor: 'pointer'
        },
        input: {
            margin: '0 .75em 0 0'
        }
    };

    return (
        <label style={styles.root} className="OneLinkNoTx u-linkComplex">
            <input
                style={styles.input}
                type="checkbox"
                checked={this.props.isChecked(this.props.value)}
                onChange={e => this.props.handleOnChange(e)}
                value={this.props.value}/>
            <span className="u-linkComplexTarget">{this.props.label}</span>
        </label>
    );
};


// Added by sephora-jsx-loader.js
CheckBoxStandard.prototype.path = 'Catalog/ProductFilters/RefinementBox/RefinementItem/CheckBoxStandard';
// Added by sephora-jsx-loader.js
CheckBoxStandard.prototype.class = 'CheckBoxStandard';
// Added by sephora-jsx-loader.js
CheckBoxStandard.prototype.getInitialState = function() {
    CheckBoxStandard.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
CheckBoxStandard.prototype.render = wrapComponentRender(CheckBoxStandard.prototype.render);
// Added by sephora-jsx-loader.js
var CheckBoxStandardClass = React.createClass(CheckBoxStandard.prototype);
// Added by sephora-jsx-loader.js
CheckBoxStandardClass.prototype.classRef = CheckBoxStandardClass;
// Added by sephora-jsx-loader.js
Object.assign(CheckBoxStandardClass, CheckBoxStandard);
// Added by sephora-jsx-loader.js
module.exports = CheckBoxStandardClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductFilters/RefinementBox/RefinementItem/CheckBoxStandard/CheckBoxStandard.jsx