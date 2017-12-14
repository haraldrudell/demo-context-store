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
    Sephora.Util.InflatorComps.Comps['RegisterModal'] = function RegisterModal(){
        return RegisterModalClass;
    }
}
const modal = require('style').modal;
const Modal = require('components/Modal/Modal');
const RegisterForm = require('components/GlobalModals/RegisterModal/RegisterForm/RegisterForm');

const RegisterModal = function () {
    this.state = {
        isOpen: false
    };
};

RegisterModal.prototype.render = function () {
    return (
        <Modal
            open={this.props.isOpen}
            onDismiss={this.requestClose}
            width={modal.WIDTH.SM}>
            <Modal.Header>
                <Modal.Title>Register with Sephora</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <RegisterForm {...this.props}/>
            </Modal.Body>
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
RegisterModal.prototype.path = 'GlobalModals/RegisterModal';
// Added by sephora-jsx-loader.js
Object.assign(RegisterModal.prototype, require('./RegisterModal.c.js'));
var originalDidMount = RegisterModal.prototype.componentDidMount;
RegisterModal.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: RegisterModal');
if (originalDidMount) originalDidMount.apply(this);
if (RegisterModal.prototype.ctrlr) RegisterModal.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: RegisterModal');
// Added by sephora-jsx-loader.js
RegisterModal.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
RegisterModal.prototype.class = 'RegisterModal';
// Added by sephora-jsx-loader.js
RegisterModal.prototype.getInitialState = function() {
    RegisterModal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
RegisterModal.prototype.render = wrapComponentRender(RegisterModal.prototype.render);
// Added by sephora-jsx-loader.js
var RegisterModalClass = React.createClass(RegisterModal.prototype);
// Added by sephora-jsx-loader.js
RegisterModalClass.prototype.classRef = RegisterModalClass;
// Added by sephora-jsx-loader.js
Object.assign(RegisterModalClass, RegisterModal);
// Added by sephora-jsx-loader.js
module.exports = RegisterModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/RegisterModal/RegisterModal.jsx