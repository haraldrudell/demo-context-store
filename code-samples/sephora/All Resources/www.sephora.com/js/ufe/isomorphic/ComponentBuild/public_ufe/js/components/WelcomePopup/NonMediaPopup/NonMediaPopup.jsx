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
    Sephora.Util.InflatorComps.Comps['NonMediaPopup'] = function NonMediaPopup(){
        return NonMediaPopupClass;
    }
}
const CanadaPopup = require('./CanadaPopup/CanadaPopup');
const BrazilPopup = require('./BrazilPopup/BrazilPopup');

const NonMediaPopup = function () { };

NonMediaPopup.prototype.render = function () {
    let template;

    switch (this.props.countryCode) {
        case 'CA':
            template = <CanadaPopup isOpen={this.props.isOpen} onDismiss={this.props.onDismiss} />;
            break;
        case 'BR':
            template = <BrazilPopup isOpen={this.props.isOpen} onDismiss={this.props.onDismiss} />;
            break;
        default:
            template = null;
    }

    return template;
};


// Added by sephora-jsx-loader.js
NonMediaPopup.prototype.path = 'WelcomePopup/NonMediaPopup';
// Added by sephora-jsx-loader.js
NonMediaPopup.prototype.class = 'NonMediaPopup';
// Added by sephora-jsx-loader.js
NonMediaPopup.prototype.getInitialState = function() {
    NonMediaPopup.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
NonMediaPopup.prototype.render = wrapComponentRender(NonMediaPopup.prototype.render);
// Added by sephora-jsx-loader.js
var NonMediaPopupClass = React.createClass(NonMediaPopup.prototype);
// Added by sephora-jsx-loader.js
NonMediaPopupClass.prototype.classRef = NonMediaPopupClass;
// Added by sephora-jsx-loader.js
Object.assign(NonMediaPopupClass, NonMediaPopup);
// Added by sephora-jsx-loader.js
module.exports = NonMediaPopupClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/WelcomePopup/NonMediaPopup/NonMediaPopup.jsx