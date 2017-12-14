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
    Sephora.Util.InflatorComps.Comps['LazyLoad'] = function LazyLoad(){
        return LazyLoadClass;
    }
}
const { Box } = require('components/display');
const Loader = require('components/Loader/Loader');

const LazyLoad = function () {
    this.state = {
        component: null
    };
};

LazyLoad.prototype.propTypes = {
    componentClass: React.PropTypes.string.isRequired
};

LazyLoad.prototype.render = function () {
    const {
        id,
        minHeight,
        loadStyle,
        // componentClass is included explicitly even though not used so that it won't be included
        //in componentProps
        componentClass,
        ...componentProps
    } = this.props;

    if (this.state.component) {
        let Component = this.state.component;
        return (
            <Component
                id={id}
                {...componentProps} />
        );
    } else {
        return (
            <Box
                id={id}
                position='relative'
                minHeight={minHeight || 155}
                _css={loadStyle}>
                <Loader
                    isShown={true} />
            </Box>
        );
    }
};


// Added by sephora-jsx-loader.js
LazyLoad.prototype.path = 'LazyLoad';
// Added by sephora-jsx-loader.js
Object.assign(LazyLoad.prototype, require('./LazyLoad.c.js'));
var originalDidMount = LazyLoad.prototype.componentDidMount;
LazyLoad.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: LazyLoad');
if (originalDidMount) originalDidMount.apply(this);
if (LazyLoad.prototype.ctrlr) LazyLoad.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: LazyLoad');
// Added by sephora-jsx-loader.js
LazyLoad.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
LazyLoad.prototype.class = 'LazyLoad';
// Added by sephora-jsx-loader.js
LazyLoad.prototype.getInitialState = function() {
    LazyLoad.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
LazyLoad.prototype.render = wrapComponentRender(LazyLoad.prototype.render);
// Added by sephora-jsx-loader.js
var LazyLoadClass = React.createClass(LazyLoad.prototype);
// Added by sephora-jsx-loader.js
LazyLoadClass.prototype.classRef = LazyLoadClass;
// Added by sephora-jsx-loader.js
Object.assign(LazyLoadClass, LazyLoad);
// Added by sephora-jsx-loader.js
module.exports = LazyLoadClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/LazyLoad/LazyLoad.jsx