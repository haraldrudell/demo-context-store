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
    Sephora.Util.InflatorComps.Comps['TermsConditionsModal'] = function TermsConditionsModal(){
        return TermsConditionsModalClass;
    }
}
const MediaPopup = require('components/GlobalModals/MediaPopup/MediaPopup');

const TermsConditionsModal = function () {
    this.state = {
        isOpen: false,
        mediaId: '',
        title: ''
    };
};

TermsConditionsModal.prototype.render = function () {
    return (
    this.state.mediaId ?
        <div>
            {
            <MediaPopup
                showContent={true}
                isOpen={this.state.isOpen}
                mediaId={this.state.mediaId}
                onDismiss={this.requestClose}
                title={this.state.title} />
            }
        </div>
    : null
    );
};


// Added by sephora-jsx-loader.js
TermsConditionsModal.prototype.path = 'GlobalModals/TermsConditionsModal';
// Added by sephora-jsx-loader.js
Object.assign(TermsConditionsModal.prototype, require('./TermsConditionsModal.c.js'));
var originalDidMount = TermsConditionsModal.prototype.componentDidMount;
TermsConditionsModal.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: TermsConditionsModal');
if (originalDidMount) originalDidMount.apply(this);
if (TermsConditionsModal.prototype.ctrlr) TermsConditionsModal.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: TermsConditionsModal');
// Added by sephora-jsx-loader.js
TermsConditionsModal.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
TermsConditionsModal.prototype.class = 'TermsConditionsModal';
// Added by sephora-jsx-loader.js
TermsConditionsModal.prototype.getInitialState = function() {
    TermsConditionsModal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
TermsConditionsModal.prototype.render = wrapComponentRender(TermsConditionsModal.prototype.render);
// Added by sephora-jsx-loader.js
var TermsConditionsModalClass = React.createClass(TermsConditionsModal.prototype);
// Added by sephora-jsx-loader.js
TermsConditionsModalClass.prototype.classRef = TermsConditionsModalClass;
// Added by sephora-jsx-loader.js
Object.assign(TermsConditionsModalClass, TermsConditionsModal);
// Added by sephora-jsx-loader.js
module.exports = TermsConditionsModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/TermsConditionsModal/TermsConditionsModal.jsx