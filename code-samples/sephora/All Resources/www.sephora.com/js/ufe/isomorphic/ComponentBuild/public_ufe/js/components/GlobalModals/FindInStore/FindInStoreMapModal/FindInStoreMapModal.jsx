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
    Sephora.Util.InflatorComps.Comps['FindInStoreMapModal'] = function FindInStoreMapModal(){
        return FindInStoreMapModalClass;
    }
}
const { modal, space } = require('style');
const { Box } = require('components/display');
const Modal = require('components/Modal/Modal');
const Chevron = require('components/Chevron/Chevron');
const GoogleMap = require('components/GoogleMap/GoogleMap');
const Link = require('components/Link/Link');
const FindInStoreAddress = require('../FindInStoreAddress/FindInStoreAddress');

const FindInStoreMapModal = function () {
    this.state = {
        currentProduct: null,
        selectedStore: null
    };
};

FindInStoreMapModal.prototype.render = function () {
    const isMobile = Sephora.isMobile();
    let selectedStore = this.props.selectedStore;
    const modalPadding = isMobile ? modal.PADDING_MW : modal.PADDING_FS;

    return (
        <Modal
            open={this.props.isOpen}
            onDismiss={this.requestClose}
            width={modal.WIDTH.MD}>
            <Modal.Header>
                <Modal.Title>
                    Find in a Sephora store
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Box
                    marginTop={-modalPadding}
                    marginX={-modalPadding}
                    marginBottom={isMobile ? space[4] : space[5]}>
                    <Link
                        display='block'
                        width='100%'
                        paddingX={modalPadding}
                        paddingY={space[4]}
                        onClick={this.backToStoreList}>
                        <Chevron
                            direction='left'
                            marginRight={space[4]} />
                        Back to stores list
                    </Link>
                    <GoogleMap
                        ratio={isMobile ? 3 / 4 : 9 / 16}
                        selectedStore={selectedStore} />
                </Box>
                <FindInStoreAddress
                    {...selectedStore} />
            </Modal.Body>
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
FindInStoreMapModal.prototype.path = 'GlobalModals/FindInStore/FindInStoreMapModal';
// Added by sephora-jsx-loader.js
Object.assign(FindInStoreMapModal.prototype, require('./FindInStoreMapModal.c.js'));
var originalDidMount = FindInStoreMapModal.prototype.componentDidMount;
FindInStoreMapModal.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: FindInStoreMapModal');
if (originalDidMount) originalDidMount.apply(this);
if (FindInStoreMapModal.prototype.ctrlr) FindInStoreMapModal.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: FindInStoreMapModal');
// Added by sephora-jsx-loader.js
FindInStoreMapModal.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
FindInStoreMapModal.prototype.class = 'FindInStoreMapModal';
// Added by sephora-jsx-loader.js
FindInStoreMapModal.prototype.getInitialState = function() {
    FindInStoreMapModal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
FindInStoreMapModal.prototype.render = wrapComponentRender(FindInStoreMapModal.prototype.render);
// Added by sephora-jsx-loader.js
var FindInStoreMapModalClass = React.createClass(FindInStoreMapModal.prototype);
// Added by sephora-jsx-loader.js
FindInStoreMapModalClass.prototype.classRef = FindInStoreMapModalClass;
// Added by sephora-jsx-loader.js
Object.assign(FindInStoreMapModalClass, FindInStoreMapModal);
// Added by sephora-jsx-loader.js
module.exports = FindInStoreMapModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/FindInStore/FindInStoreMapModal/FindInStoreMapModal.jsx