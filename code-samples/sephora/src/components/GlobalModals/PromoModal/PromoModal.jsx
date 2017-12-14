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
    Sephora.Util.InflatorComps.Comps['PromoModal'] = function PromoModal(){
        return PromoModalClass;
    }
}
const {
    modal, space
} = require('style');
const Modal = require('components/Modal/Modal');
const Link = require('components/Link/Link');
const Promos = require('components/Basket/Promos/Promos');

const PromoModal = function () {};

PromoModal.prototype.render = function () {
    return (
        <Modal
            width={modal.WIDTH.LG}
            scrollHeight={492}
            isFixedHeader={Sephora.isMobile()}
            showDismiss={Sephora.isDesktop()}
            open={this.props.isOpen}
            onDismiss={this.requestClose}>
            <Modal.Header>
                <Modal.Title>
                    {this.props.instructions}
                </Modal.Title>
                {Sephora.isMobile() &&
                    <Link
                        primary={true}
                        padding={space[3]}
                        margin={-space[3]}
                        onClick={this.isDone}>
                        Done
                    </Link>
                }
            </Modal.Header>
            <Modal.Body>
                <Promos promos={this.props} />
            </Modal.Body>
            {Sephora.isDesktop() &&
                <Modal.Footer>
                    <Link
                        onClick={this.isDone}
                        marginX={-modal.PADDING_FS}
                        paddingX={modal.PADDING_FS}
                        height={60}
                        fontSize='h3'
                        primary={true}>
                        Done
                    </Link>
                </Modal.Footer>
            }
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
PromoModal.prototype.path = 'GlobalModals/PromoModal';
// Added by sephora-jsx-loader.js
Object.assign(PromoModal.prototype, require('./PromoModal.c.js'));
var originalDidMount = PromoModal.prototype.componentDidMount;
PromoModal.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: PromoModal');
if (originalDidMount) originalDidMount.apply(this);
if (PromoModal.prototype.ctrlr) PromoModal.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: PromoModal');
// Added by sephora-jsx-loader.js
PromoModal.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
PromoModal.prototype.class = 'PromoModal';
// Added by sephora-jsx-loader.js
PromoModal.prototype.getInitialState = function() {
    PromoModal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
PromoModal.prototype.render = wrapComponentRender(PromoModal.prototype.render);
// Added by sephora-jsx-loader.js
var PromoModalClass = React.createClass(PromoModal.prototype);
// Added by sephora-jsx-loader.js
PromoModalClass.prototype.classRef = PromoModalClass;
// Added by sephora-jsx-loader.js
Object.assign(PromoModalClass, PromoModal);
// Added by sephora-jsx-loader.js
module.exports = PromoModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/PromoModal/PromoModal.jsx