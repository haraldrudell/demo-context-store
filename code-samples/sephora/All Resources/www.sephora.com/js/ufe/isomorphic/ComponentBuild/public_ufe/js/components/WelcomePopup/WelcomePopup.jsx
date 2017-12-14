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
    Sephora.Util.InflatorComps.Comps['WelcomePopup'] = function WelcomePopup(){
        return WelcomePopupClass;
    }
}
const NonMediaPopup = require('./NonMediaPopup/NonMediaPopup');
const MediaPopup = require('components/GlobalModals/MediaPopup/MediaPopup');
const MediaPopupMobile = require('./MediaPopupMobile/MediaPopupMobile');

const WelcomePopup = function () {
    this.state = {
        countryCode: '',
        mediaId: '',
        isMedia: false,
        showWelcomePopup: false,
        type: '',
        modalData: null
    };
};

WelcomePopup.prototype.render = function () {
    let template = null;

    if (this.state.isMedia) {
        if (Sephora.isMobile() && this.state.modalData) {
            template = <MediaPopupMobile
                isOpen={this.state.showWelcomePopup}
                onDismiss={this.requestClose}
                modalData={this.state.modalData} />;
        } else {
            template = <MediaPopup
                showContent={this.state.modalData === null}
                isOpen={this.state.showWelcomePopup}
                onDismiss={this.requestClose}
                mediaId={this.state.mediaId}
                width={
                    this.state.modalData && this.state.modalData.isLarge ? 756 : 563
                } />;
        }
    } else {
        template = <NonMediaPopup
            isOpen={this.state.showWelcomePopup}
            onDismiss={this.requestClose}
            countryCode={this.state.countryCode} />;
    }

    return (
        <div>
            {
                this.state.showWelcomePopup ? template : null
            }
        </div>
    );
};


// Added by sephora-jsx-loader.js
WelcomePopup.prototype.path = 'WelcomePopup';
// Added by sephora-jsx-loader.js
Object.assign(WelcomePopup.prototype, require('./WelcomePopup.c.js'));
var originalDidMount = WelcomePopup.prototype.componentDidMount;
WelcomePopup.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: WelcomePopup');
if (originalDidMount) originalDidMount.apply(this);
if (WelcomePopup.prototype.ctrlr) WelcomePopup.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: WelcomePopup');
// Added by sephora-jsx-loader.js
WelcomePopup.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
WelcomePopup.prototype.class = 'WelcomePopup';
// Added by sephora-jsx-loader.js
WelcomePopup.prototype.getInitialState = function() {
    WelcomePopup.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
WelcomePopup.prototype.render = wrapComponentRender(WelcomePopup.prototype.render);
// Added by sephora-jsx-loader.js
var WelcomePopupClass = React.createClass(WelcomePopup.prototype);
// Added by sephora-jsx-loader.js
WelcomePopupClass.prototype.classRef = WelcomePopupClass;
// Added by sephora-jsx-loader.js
Object.assign(WelcomePopupClass, WelcomePopup);
// Added by sephora-jsx-loader.js
module.exports = WelcomePopupClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/WelcomePopup/WelcomePopup.jsx