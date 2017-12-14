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
    Sephora.Util.InflatorComps.Comps['BiTopBar'] = function BiTopBar(){
        return BiTopBarClass;
    }
}
const space = require('style').space;
const { Box } = require('components/display');

const BiTopBar = function () {};

BiTopBar.prototype.render = function () {
    const { children } = this.props;

    const shadow = {
        blur: '6px',
        offset: '0 2px',
        opacity: '0.25'
    };

    return (
        <Box
            marginBottom={Sephora.isMobile() ? space[4] : space[7]}
            padding={Sephora.isMobile() ? space[2] : space[5]}
            backgroundImage='url(/img/ufe/bi/bg-black-dots.svg)'
            backgroundPosition='top center'
            backgroundSize='180px 180px'>
            <Box
                maxWidth={668}
                marginX='auto'>
                {React.Children.map(children,
                    (child, index) => child && React.cloneElement(child, {
                        shadow: shadow
                    })
                )}
            </Box>
        </Box>
    );
};


// Added by sephora-jsx-loader.js
BiTopBar.prototype.path = 'BiTopBar';
// Added by sephora-jsx-loader.js
Object.assign(BiTopBar.prototype, require('./BiTopBar.c.js'));
var originalDidMount = BiTopBar.prototype.componentDidMount;
BiTopBar.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BiTopBar');
if (originalDidMount) originalDidMount.apply(this);
if (BiTopBar.prototype.ctrlr) BiTopBar.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BiTopBar');
// Added by sephora-jsx-loader.js
BiTopBar.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BiTopBar.prototype.class = 'BiTopBar';
// Added by sephora-jsx-loader.js
BiTopBar.prototype.getInitialState = function() {
    BiTopBar.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BiTopBar.prototype.render = wrapComponentRender(BiTopBar.prototype.render);
// Added by sephora-jsx-loader.js
var BiTopBarClass = React.createClass(BiTopBar.prototype);
// Added by sephora-jsx-loader.js
BiTopBarClass.prototype.classRef = BiTopBarClass;
// Added by sephora-jsx-loader.js
Object.assign(BiTopBarClass, BiTopBar);
// Added by sephora-jsx-loader.js
module.exports = BiTopBarClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BiTopBar/BiTopBar.jsx