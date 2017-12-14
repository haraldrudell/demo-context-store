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
    Sephora.Util.InflatorComps.Comps['EditFlowModal'] = function EditFlowModal(){
        return EditFlowModalClass;
    }
}
const space = require('style').space;
const Link = require('components/Link/Link');
const Modal = require('components/Modal/Modal');

const EditFlowModal = function () {
    this.state = {
        biAccount: this.props.biAccount
    };
};

EditFlowModal.prototype.render = function () {
    const {
        isOpen,
        title,
        content,
        biAccount,
        socialProfile
    } = this.props;

    const Content = content;

    return (
        <Modal
            open={isOpen}
            onDismiss={this.requestClose}
            showDismiss={false}
            isFixedHeader={true}>
            <Modal.Header>
                <Modal.Title>
                    {title}
                </Modal.Title>
                <Link
                    primary={true}
                    padding={space[3]}
                    margin={-space[3]}
                    onClick={this.requestClose}>
                    Done
                </Link>
            </Modal.Header>
            <Modal.Body>
                {
                    title === 'Photos & Bio' ?
                        Content && <Content 
                            socialProfile={socialProfile}
                            ref={comp => this.tabContent = comp} />
                        :
                        Content && <Content
                            biAccount={this.state.biAccount}
                            ref={comp => this.tabContent = comp} />
                }
            </Modal.Body>
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
EditFlowModal.prototype.path = 'RichProfile/EditMyProfile/Modals/EditFlowModal';
// Added by sephora-jsx-loader.js
Object.assign(EditFlowModal.prototype, require('./EditFlowModal.c.js'));
var originalDidMount = EditFlowModal.prototype.componentDidMount;
EditFlowModal.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: EditFlowModal');
if (originalDidMount) originalDidMount.apply(this);
if (EditFlowModal.prototype.ctrlr) EditFlowModal.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: EditFlowModal');
// Added by sephora-jsx-loader.js
EditFlowModal.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
EditFlowModal.prototype.class = 'EditFlowModal';
// Added by sephora-jsx-loader.js
EditFlowModal.prototype.getInitialState = function() {
    EditFlowModal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
EditFlowModal.prototype.render = wrapComponentRender(EditFlowModal.prototype.render);
// Added by sephora-jsx-loader.js
var EditFlowModalClass = React.createClass(EditFlowModal.prototype);
// Added by sephora-jsx-loader.js
EditFlowModalClass.prototype.classRef = EditFlowModalClass;
// Added by sephora-jsx-loader.js
Object.assign(EditFlowModalClass, EditFlowModal);
// Added by sephora-jsx-loader.js
module.exports = EditFlowModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/EditMyProfile/Modals/EditFlowModal/EditFlowModal.jsx