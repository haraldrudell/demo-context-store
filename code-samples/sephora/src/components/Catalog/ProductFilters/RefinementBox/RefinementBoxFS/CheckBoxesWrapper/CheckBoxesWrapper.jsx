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
    Sephora.Util.InflatorComps.Comps['CheckBoxesWrapper'] = function CheckBoxesWrapper(){
        return CheckBoxesWrapperClass;
    }
}
const { colors, space } = require('style');
const { css } = require('glamor');
const RefinementItem = require('components/Catalog/ProductFilters/RefinementBox/RefinementItem/RefinementItem');

const CheckBoxesWrapper = function () {};

// jscs is complaining about this file...
// temporarily disable indentation check

// jscs:disable validateIndentation

CheckBoxesWrapper.prototype.render = function () {

	const maxVisible = 4;
	const isScroll = this.props.values.length > maxVisible;

	const styles = css({
		marginBottom: space[1],
		marginLeft: isScroll ? null : 1,
		height: isScroll ? 138 : null,
		overflow: isScroll ? 'auto' : null,
		borderWidth: isScroll ? 1 : 0,
		borderStyle: 'solid',
		borderColor: colors.moonGray,
		paddingTop: isScroll ? space[1] : null,
		paddingBottom: isScroll ? space[1] : null,
		paddingRight: isScroll ? space[2] : null,
		paddingLeft: space[2]
	});

	return (
		<div className={styles}>
			{
				this.props.values.map((value, index) => {
					<RefinementItem
						key={index}
						label={value.refinementValueDisplayName}
						value={value.refinementValueId}
						handleOnChange={this.props.handleOnChange}
						isChecked={this.props.isChecked}
						type={this.props.type} />;
				})
			}
		</div>
	);
};


// Added by sephora-jsx-loader.js
CheckBoxesWrapper.prototype.path = 'Catalog/ProductFilters/RefinementBox/RefinementBoxFS/CheckBoxesWrapper';
// Added by sephora-jsx-loader.js
CheckBoxesWrapper.prototype.class = 'CheckBoxesWrapper';
// Added by sephora-jsx-loader.js
CheckBoxesWrapper.prototype.getInitialState = function() {
    CheckBoxesWrapper.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
CheckBoxesWrapper.prototype.render = wrapComponentRender(CheckBoxesWrapper.prototype.render);
// Added by sephora-jsx-loader.js
var CheckBoxesWrapperClass = React.createClass(CheckBoxesWrapper.prototype);
// Added by sephora-jsx-loader.js
CheckBoxesWrapperClass.prototype.classRef = CheckBoxesWrapperClass;
// Added by sephora-jsx-loader.js
Object.assign(CheckBoxesWrapperClass, CheckBoxesWrapper);
// Added by sephora-jsx-loader.js
module.exports = CheckBoxesWrapperClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductFilters/RefinementBox/RefinementBoxFS/CheckBoxesWrapper/CheckBoxesWrapper.jsx