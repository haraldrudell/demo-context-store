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
    Sephora.Util.InflatorComps.Comps['BiRegisterModal'] = function BiRegisterModal(){
        return BiRegisterModalClass;
    }
}
const {
    modal, space
} = require('style');
const Modal = require('components/Modal/Modal');
const BiRegisterForm = require('components/BiRegisterForm/BiRegisterForm');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const ButtonOutline = require('components/Button/ButtonOutline');
const Grid = require('components/Grid/Grid');
const Locale = require('utils/LanguageLocale');
const SubscribeEmail = require('components/SubscribeEmail/SubscribeEmail');

const BiRegisterModal = function () {
    this.state = {
        subscribeSephoraEmail: false
    };
};

BiRegisterModal.prototype.render = function () {
    return (
        <Modal
            is='form'
            action=''
            open={this.props.isOpen}
            onDismiss={this.requestClose}
            width={modal.WIDTH.SM}>
            <Modal.Body>
                <BiRegisterForm
                    isBiModal={true}
                    handleKeyDown={this.handleKeyDown}
                    ref={
                        (c) => {
                            if (c !== null) {
                                this.biRegForm = c;
                            }
                        }
                    }/>

                {Locale.getCurrentCountry() === 'ca' &&
                    <SubscribeEmail
                        marginTop={space[5]}
                        checked={this.state.subscribeSephoraEmail}
                        disabled={false}
                        ref={
                                    (c) => {
                                        if (c !== null) {
                                            this.subscribeEmail = c;
                                        }
                                    }
                                }
                         />
                }
            </Modal.Body>
            <Modal.Footer>
                <Grid
                    gutter={modal.ACTIONS_GUTTER}
                    _css={Sephora.isDesktop() ? {
                        width: modal.ACTIONS_WIDTH,
                        marginLeft: 'auto'
                    } : {}}>
                    <Grid.Cell width={1 / 2}>
                        <ButtonOutline
                            block={true}
                            tabIndex='-1'
                            onClick={this.requestClose}>
                            Cancel
                        </ButtonOutline>
                    </Grid.Cell>
                    <Grid.Cell width={1 / 2}>
                        <ButtonPrimary
                            block={true}
                            type='submit'
                            onClick={this.biRegister}>
                            Join
                        </ButtonPrimary>
                    </Grid.Cell>
                </Grid>
            </Modal.Footer>
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
BiRegisterModal.prototype.path = 'GlobalModals/BiRegisterModal';
// Added by sephora-jsx-loader.js
Object.assign(BiRegisterModal.prototype, require('./BiRegisterModal.c.js'));
var originalDidMount = BiRegisterModal.prototype.componentDidMount;
BiRegisterModal.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BiRegisterModal');
if (originalDidMount) originalDidMount.apply(this);
if (BiRegisterModal.prototype.ctrlr) BiRegisterModal.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BiRegisterModal');
// Added by sephora-jsx-loader.js
BiRegisterModal.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BiRegisterModal.prototype.class = 'BiRegisterModal';
// Added by sephora-jsx-loader.js
BiRegisterModal.prototype.getInitialState = function() {
    BiRegisterModal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BiRegisterModal.prototype.render = wrapComponentRender(BiRegisterModal.prototype.render);
// Added by sephora-jsx-loader.js
var BiRegisterModalClass = React.createClass(BiRegisterModal.prototype);
// Added by sephora-jsx-loader.js
BiRegisterModalClass.prototype.classRef = BiRegisterModalClass;
// Added by sephora-jsx-loader.js
Object.assign(BiRegisterModalClass, BiRegisterModal);
// Added by sephora-jsx-loader.js
module.exports = BiRegisterModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/BiRegisterModal/BiRegisterModal.jsx