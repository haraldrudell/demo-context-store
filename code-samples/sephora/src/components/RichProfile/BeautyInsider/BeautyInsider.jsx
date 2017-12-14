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
    Sephora.Util.InflatorComps.Comps['BeautyInsider'] = function BeautyInsider(){
        return BeautyInsiderClass;
    }
}
const BiHQ = require('components/BiHQ/BiHQ');
const MyBeautyInsider = require('components/RichProfile/BeautyInsider/MyBeautyInsider/MyBeautyInsider');
const ProfileTopNav = require('components/RichProfile/ProfileTopNav/ProfileTopNav');

const BeautyInsider = function () {
    this.state = {
        user: null,
        isUserBi: null
    };
};

BeautyInsider.prototype.render = function () {
    return (
        <div>
            <ProfileTopNav section='bi' />
             {!Sephora.isRootRender && this.isUserReady() &&
                <div>
                    {this.isUserAtleastRecognized() ?
                        this.state.isUserBi ?
                            <MyBeautyInsider user={this.state.user} />
                        :
                            <BiHQ />
                    :
                        <BiHQ />
                    }
                </div>
            }
        </div>
    );
};


// Added by sephora-jsx-loader.js
BeautyInsider.prototype.path = 'RichProfile/BeautyInsider';
// Added by sephora-jsx-loader.js
Object.assign(BeautyInsider.prototype, require('./BeautyInsider.c.js'));
var originalDidMount = BeautyInsider.prototype.componentDidMount;
BeautyInsider.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BeautyInsider');
if (originalDidMount) originalDidMount.apply(this);
if (BeautyInsider.prototype.ctrlr) BeautyInsider.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BeautyInsider');
// Added by sephora-jsx-loader.js
BeautyInsider.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BeautyInsider.prototype.class = 'BeautyInsider';
// Added by sephora-jsx-loader.js
BeautyInsider.prototype.getInitialState = function() {
    BeautyInsider.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BeautyInsider.prototype.render = wrapComponentRender(BeautyInsider.prototype.render);
// Added by sephora-jsx-loader.js
var BeautyInsiderClass = React.createClass(BeautyInsider.prototype);
// Added by sephora-jsx-loader.js
BeautyInsiderClass.prototype.classRef = BeautyInsiderClass;
// Added by sephora-jsx-loader.js
Object.assign(BeautyInsiderClass, BeautyInsider);
// Added by sephora-jsx-loader.js
module.exports = BeautyInsiderClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/BeautyInsider/BeautyInsider.jsx