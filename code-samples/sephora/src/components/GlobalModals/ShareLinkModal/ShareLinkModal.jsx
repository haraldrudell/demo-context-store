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
    Sephora.Util.InflatorComps.Comps['ShareLinkModal'] = function ShareLinkModal(){
        return ShareLinkModalClass;
    }
}
const modal = require('style').modal;
const Modal = require('components/Modal/Modal');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const TextInput = require('components/Inputs/TextInput/TextInput');
const Grid = require('components/Grid/Grid');
const CopyToClipboard = require('react-copy-to-clipboard');

const ShareLinkModal = function () {
    this.state = {
        isCopied: false
    };
};

ShareLinkModal.prototype.render = function () {
    return (
        <Modal
            open={this.props.isOpen}
            onDismiss={this.requestClose}
            width={modal.WIDTH.SM}>
            <Modal.Header>
                <Modal.Title>
                    Share {this.props.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Grid>
                    <Grid.Cell
                        width='fill'>
                        <TextInput
                            value={this.props.shareUrl}
                            readOnly={true}
                            rounded='left' />
                    </Grid.Cell>
                    <Grid.Cell
                        width='fit'
                        marginLeft={-1}>
                        <CopyToClipboard
                            text={this.props.shareUrl}
                            onCopy={() => this.setState({
                                isCopied: true
                            })}>
                            <ButtonPrimary
                                rounded='right'>
                                {this.state.isCopied ? 'Copied' : 'Copy'}
                            </ButtonPrimary>
                        </CopyToClipboard>
                    </Grid.Cell>
                </Grid>
            </Modal.Body>
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
ShareLinkModal.prototype.path = 'GlobalModals/ShareLinkModal';
// Added by sephora-jsx-loader.js
Object.assign(ShareLinkModal.prototype, require('./ShareLinkModal.c.js'));
var originalDidMount = ShareLinkModal.prototype.componentDidMount;
ShareLinkModal.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ShareLinkModal');
if (originalDidMount) originalDidMount.apply(this);
if (ShareLinkModal.prototype.ctrlr) ShareLinkModal.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ShareLinkModal');
// Added by sephora-jsx-loader.js
ShareLinkModal.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ShareLinkModal.prototype.class = 'ShareLinkModal';
// Added by sephora-jsx-loader.js
ShareLinkModal.prototype.getInitialState = function() {
    ShareLinkModal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ShareLinkModal.prototype.render = wrapComponentRender(ShareLinkModal.prototype.render);
// Added by sephora-jsx-loader.js
var ShareLinkModalClass = React.createClass(ShareLinkModal.prototype);
// Added by sephora-jsx-loader.js
ShareLinkModalClass.prototype.classRef = ShareLinkModalClass;
// Added by sephora-jsx-loader.js
Object.assign(ShareLinkModalClass, ShareLinkModal);
// Added by sephora-jsx-loader.js
module.exports = ShareLinkModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/ShareLinkModal/ShareLinkModal.jsx