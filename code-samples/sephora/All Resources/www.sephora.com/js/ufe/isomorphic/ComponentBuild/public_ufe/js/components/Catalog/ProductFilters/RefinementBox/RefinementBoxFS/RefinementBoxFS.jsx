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
    Sephora.Util.InflatorComps.Comps['RefinementBoxFS'] = function RefinementBoxFS(){
        return RefinementBoxFSClass;
    }
}
var CheckBoxesWrapper = require('./CheckBoxesWrapper/CheckBoxesWrapper');
var ColorsWrapper = require('./ColorsWrapper/ColorsWrapper');

var RefinementBoxFS = function () {
};

RefinementBoxFS.prototype.render = function () {
    let showClear = this.props.filters.length && this.props.isFiltered;

    return (
        <div className="u-mb4">
            <div className="u-lhh u-cf">
                {
                    showClear ? <button type="button"
                        className="u-fr u-underline u-hoverRed"
                        onClick={this.props.clearRefinementsBox}>clear filter</button> : null
                }
                <h4 className={'u-h6 u-lhh u-mt0 u-ls1 u-ttu ' +
                    (this.props.type === 'colors' ? 'u-mb0' : 'u-mb2')}>
                    {this.props.displayName}
                </h4>
            </div>
            {
                this.props.type === 'checkboxes' ?
                    <CheckBoxesWrapper
                        handleOnChange={this.props.selectFilter}
                        isChecked={this.props.isFilterSelected}
                        values={this.props.values}
                        type={this.props.type} /> :
                    this.props.type === 'colors' ?
                        <ColorsWrapper
                            handleOnClick={this.props.selectFilter}
                            isFilterSelected={this.props.isFilterSelected}
                            values={this.props.values}
                            type={this.props.type} /> : this.props.type
            }
        </div>
    );
};


// Added by sephora-jsx-loader.js
RefinementBoxFS.prototype.path = 'Catalog/ProductFilters/RefinementBox/RefinementBoxFS';
// Added by sephora-jsx-loader.js
RefinementBoxFS.prototype.class = 'RefinementBoxFS';
// Added by sephora-jsx-loader.js
RefinementBoxFS.prototype.getInitialState = function() {
    RefinementBoxFS.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
RefinementBoxFS.prototype.render = wrapComponentRender(RefinementBoxFS.prototype.render);
// Added by sephora-jsx-loader.js
var RefinementBoxFSClass = React.createClass(RefinementBoxFS.prototype);
// Added by sephora-jsx-loader.js
RefinementBoxFSClass.prototype.classRef = RefinementBoxFSClass;
// Added by sephora-jsx-loader.js
Object.assign(RefinementBoxFSClass, RefinementBoxFS);
// Added by sephora-jsx-loader.js
module.exports = RefinementBoxFSClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductFilters/RefinementBox/RefinementBoxFS/RefinementBoxFS.jsx