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
    Sephora.Util.InflatorComps.Comps['GoogleMap'] = function GoogleMap(){
        return GoogleMapClass;
    }
}
const Embed = require('components/Embed/Embed');

const GoogleMap = function () { };

GoogleMap.prototype.render = function () {
    return (
        <Embed
            ratio={this.props.ratio || 3 / 4}>
            <div
                ref={
                    (c) => {
                        if (c !== null) {
                            this.map = c;
                        }
                    }
                }>
            </div>
        </Embed>
    );
};


// Added by sephora-jsx-loader.js
GoogleMap.prototype.path = 'GoogleMap';
// Added by sephora-jsx-loader.js
Object.assign(GoogleMap.prototype, require('./GoogleMap.c.js'));
var originalDidMount = GoogleMap.prototype.componentDidMount;
GoogleMap.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: GoogleMap');
if (originalDidMount) originalDidMount.apply(this);
if (GoogleMap.prototype.ctrlr) GoogleMap.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: GoogleMap');
// Added by sephora-jsx-loader.js
GoogleMap.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
GoogleMap.prototype.class = 'GoogleMap';
// Added by sephora-jsx-loader.js
GoogleMap.prototype.getInitialState = function() {
    GoogleMap.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
GoogleMap.prototype.render = wrapComponentRender(GoogleMap.prototype.render);
// Added by sephora-jsx-loader.js
var GoogleMapClass = React.createClass(GoogleMap.prototype);
// Added by sephora-jsx-loader.js
GoogleMapClass.prototype.classRef = GoogleMapClass;
// Added by sephora-jsx-loader.js
Object.assign(GoogleMapClass, GoogleMap);
// Added by sephora-jsx-loader.js
module.exports = GoogleMapClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GoogleMap/GoogleMap.jsx