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
    Sephora.Util.InflatorComps.Comps['SampleModal'] = function SampleModal(){
        return SampleModalClass;
    }
}
const { space } = require('style');
const Modal = require('components/Modal/Modal');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const Link = require('components/Link/Link');
const AddToBasketButton = require('components/AddToBasketButton/AddToBasketButton');
const ADD_BUTTON_TYPE = require('utils/Basket').ADD_TO_BASKET_TYPES;
const Samples = require('components/Basket/Samples/Samples');

const SampleModal = function () {
    this.state = {
        isInBasket: false,
        isSampleDisabled: false
    };
};

SampleModal.prototype.render = function () {
    let samples = this.props.sampleList;

    return (
        <Modal
            isFixedHeader={true}
            open={this.props.isOpen}
            onDismiss={this.isDone}
            showDismiss={false}>
            <Modal.Header>
                <Modal.Title>
                    Select up to {this.props.allowedQtyPerOrder} samples
                </Modal.Title>
                <Link
                    primary={true}
                    padding={space[3]}
                    margin={-space[3]}
                    onClick={this.isDone}>
                    Done
                </Link>
            </Modal.Header>
            <Modal.Body>
                <Samples />
            </Modal.Body>
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
SampleModal.prototype.path = 'GlobalModals/SampleModal';
// Added by sephora-jsx-loader.js
Object.assign(SampleModal.prototype, require('./SampleModal.c.js'));
var originalDidMount = SampleModal.prototype.componentDidMount;
SampleModal.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: SampleModal');
if (originalDidMount) originalDidMount.apply(this);
if (SampleModal.prototype.ctrlr) SampleModal.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: SampleModal');
// Added by sephora-jsx-loader.js
SampleModal.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
SampleModal.prototype.class = 'SampleModal';
// Added by sephora-jsx-loader.js
SampleModal.prototype.getInitialState = function() {
    SampleModal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
SampleModal.prototype.render = wrapComponentRender(SampleModal.prototype.render);
// Added by sephora-jsx-loader.js
var SampleModalClass = React.createClass(SampleModal.prototype);
// Added by sephora-jsx-loader.js
SampleModalClass.prototype.classRef = SampleModalClass;
// Added by sephora-jsx-loader.js
Object.assign(SampleModalClass, SampleModal);
// Added by sephora-jsx-loader.js
module.exports = SampleModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/SampleModal/SampleModal.jsx