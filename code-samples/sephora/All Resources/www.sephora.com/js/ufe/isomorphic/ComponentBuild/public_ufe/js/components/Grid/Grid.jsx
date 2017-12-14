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
    Sephora.Util.InflatorComps.Comps['Grid'] = function Grid(){
        return GridClass;
    }
}
const Cell = require('./GridCell');
const Flex = require('components/Flex/Flex');

const Grid = function () { };

Grid.prototype.render = function () {
    const {
        fit,
        gutter,
        children,
        marginX,
        ...props
    } = this.props;

    return (
        <Flex
            {...props}
            flexFlow='row wrap'
            marginX={gutter ? -(gutter / 2) : marginX}>
            {
                React.Children.map(children,
                    (child, index) => child && React.cloneElement(child, {
                        key: index.toString(),
                        gutter: gutter,
                        equal: fit
                    })
                )
            }
        </Flex>
    );
};

Grid.prototype.propTypes = {
    /** Allow cells to equal distribute width */
    fit: React.PropTypes.bool,
    /** Space between cells */
    gutter: React.PropTypes.number
};

Grid.Cell = Cell;


// Added by sephora-jsx-loader.js
Grid.prototype.path = 'Grid';
// Added by sephora-jsx-loader.js
Grid.prototype.class = 'Grid';
// Added by sephora-jsx-loader.js
Grid.prototype.getInitialState = function() {
    Grid.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Grid.prototype.render = wrapComponentRender(Grid.prototype.render);
// Added by sephora-jsx-loader.js
var GridClass = React.createClass(Grid.prototype);
// Added by sephora-jsx-loader.js
GridClass.prototype.classRef = GridClass;
// Added by sephora-jsx-loader.js
Object.assign(GridClass, Grid);
// Added by sephora-jsx-loader.js
module.exports = GridClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Grid/Grid.jsx