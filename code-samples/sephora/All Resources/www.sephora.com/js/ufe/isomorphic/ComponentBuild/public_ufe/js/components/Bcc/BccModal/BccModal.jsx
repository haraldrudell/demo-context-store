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
    Sephora.Util.InflatorComps.Comps['BccModal'] = function BccModal(){
        return BccModalClass;
    }
}
const modal = require('style').modal;
const Modal = require('components/Modal/Modal');
const Image = require('components/Image/Image');
const BccComponentList = require('components/Bcc/BccComponentList/BccComponentList');

var BccModal = function () {
    this.state = { isOpen: false };
};

BccModal.prototype.render = function () {
    const {
        titleText,
        titleImage,
        isSmall,
        isLarge,
        bccName,
        children
    } = this.props;

    return (
        <Modal
            open={this.props.modalState || this.state.isOpen}
            onDismiss={this.toggleOpen}
            width={
                isSmall ? modal.WIDTH.XS :
                isLarge ? modal.WIDTH.XL :
                modal.WIDTH.MD
            }>
            {titleText &&
                <Modal.Header>
                    <Modal.Title dangerouslySetInnerHTML={{ __html: titleText }}/>
                </Modal.Header>
            }
            {titleImage &&
                <Modal.Header>
                    <Image src={titleImage} />
                </Modal.Header>
            }
            <Modal.Body>
                <BccComponentList
                    items={children}
                    nested={true} />
            </Modal.Body>
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
BccModal.prototype.path = 'Bcc/BccModal';
// Added by sephora-jsx-loader.js
Object.assign(BccModal.prototype, require('./BccModal.c.js'));
var originalDidMount = BccModal.prototype.componentDidMount;
BccModal.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BccModal');
if (originalDidMount) originalDidMount.apply(this);
if (BccModal.prototype.ctrlr) BccModal.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BccModal');
// Added by sephora-jsx-loader.js
BccModal.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BccModal.prototype.class = 'BccModal';
// Added by sephora-jsx-loader.js
BccModal.prototype.getInitialState = function() {
    BccModal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BccModal.prototype.render = wrapComponentRender(BccModal.prototype.render);
// Added by sephora-jsx-loader.js
var BccModalClass = React.createClass(BccModal.prototype);
// Added by sephora-jsx-loader.js
BccModalClass.prototype.classRef = BccModalClass;
// Added by sephora-jsx-loader.js
Object.assign(BccModalClass, BccModal);
// Added by sephora-jsx-loader.js
module.exports = BccModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Bcc/BccModal/BccModal.jsx