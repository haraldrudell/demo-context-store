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
    Sephora.Util.InflatorComps.Comps['GridCell'] = function GridCell(){
        return GridCellClass;
    }
}
const Base = require('components/Base/Base');

const GridCell = function () {};

GridCell.prototype.render = function () {
    const {
        width = 1,
        equal,
        gutter,
        ...props
    } = this.props;

    const fit = width === 'fit';
    const fill = width === 'fill';

    const styles = {

        // Use `flex-basis: auto` with a width to avoid box-sizing bug in IE10/11
        // http://git.io/vllMD
        flexBasis: fill ? '0%' : width ? 'auto' : '100%',

        // Fix issue where elements with overflow extend past the cell
        // https://git.io/vw5oF
        minWidth: 0,
        flex: fill ? 1 : equal ? '1 1 0%' : null,
        paddingLeft: gutter ? gutter / 2 : null,
        paddingRight: gutter ? gutter / 2 : null
    };

    return (
        <Base
            {...props}
            width={fit || fill ? null : width}
            baseStyle={styles} />
    );
};

GridCell.prototype.propTypes = {
    width: React.PropTypes.oneOfType([
        React.PropTypes.number,
        React.PropTypes.oneOf([
            'fill', // Make cell fill the remaining space
            'fit' // Make cell shrink wrap its content
        ])
    ])
};


// Added by sephora-jsx-loader.js
GridCell.prototype.path = 'Grid';
// Added by sephora-jsx-loader.js
GridCell.prototype.class = 'GridCell';
// Added by sephora-jsx-loader.js
GridCell.prototype.getInitialState = function() {
    GridCell.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
GridCell.prototype.render = wrapComponentRender(GridCell.prototype.render);
// Added by sephora-jsx-loader.js
var GridCellClass = React.createClass(GridCell.prototype);
// Added by sephora-jsx-loader.js
GridCellClass.prototype.classRef = GridCellClass;
// Added by sephora-jsx-loader.js
Object.assign(GridCellClass, GridCell);
// Added by sephora-jsx-loader.js
module.exports = GridCellClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Grid/GridCell.jsx