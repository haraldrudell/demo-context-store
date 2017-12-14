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
    Sephora.Util.InflatorComps.Comps['VirtualArtist'] = function VirtualArtist(){
        return VirtualArtistClass;
    }
}
const { Box } = require('components/display');

const VirtualArtist = function () {};

VirtualArtist.prototype.render = function () {
    return (
        <Box
            position='relative'
            width='100%' height='100%'
            paddingBottom='100%'>
            <Box
                id='mf_frame_container'
                position='absolute'
                top={0} left={0}
                width='100%' height='100%' />
        </Box>
    );
};


// Added by sephora-jsx-loader.js
VirtualArtist.prototype.path = 'VirtualArtist';
// Added by sephora-jsx-loader.js
Object.assign(VirtualArtist.prototype, require('./VirtualArtist.c.js'));
var originalDidMount = VirtualArtist.prototype.componentDidMount;
VirtualArtist.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: VirtualArtist');
if (originalDidMount) originalDidMount.apply(this);
if (VirtualArtist.prototype.ctrlr) VirtualArtist.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: VirtualArtist');
// Added by sephora-jsx-loader.js
VirtualArtist.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
VirtualArtist.prototype.class = 'VirtualArtist';
// Added by sephora-jsx-loader.js
VirtualArtist.prototype.getInitialState = function() {
    VirtualArtist.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
VirtualArtist.prototype.render = wrapComponentRender(VirtualArtist.prototype.render);
// Added by sephora-jsx-loader.js
var VirtualArtistClass = React.createClass(VirtualArtist.prototype);
// Added by sephora-jsx-loader.js
VirtualArtistClass.prototype.classRef = VirtualArtistClass;
// Added by sephora-jsx-loader.js
Object.assign(VirtualArtistClass, VirtualArtist);
// Added by sephora-jsx-loader.js
module.exports = VirtualArtistClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/VirtualArtist/VirtualArtist.jsx