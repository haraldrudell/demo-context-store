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
    Sephora.Util.InflatorComps.Comps['ColorIQModal'] = function ColorIQModal(){
        return ColorIQModalClass;
    }
}
const Modal = require('components/Modal/Modal');
const { modal, space } = require('style');
const Link = require('components/Link/Link');
const ColorIQ = require('components/RichProfile/EditMyProfile/Content/ColorIQ/ColorIQ');

const ColorIQModal = function () {
};

ColorIQModal.prototype.render = function () {
    const isMobile = Sephora.isMobile();

    return (
        <Modal
            open={this.props.isOpen}
            onDismiss={this.requestClose}
            isFixedHeader={isMobile}
            scrollHeight={492}
            width={modal.WIDTH.LG}>

            <Modal.Header>
                <Modal.Title>
                    Your Color iQ Matches
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {this.state.biAccount &&
                    <ColorIQ biAccount={this.state.biAccount} />
                }
            </Modal.Body>

            {isMobile ||
                <Modal.Footer>
                    <Link
                        onClick={this.isDone}
                        marginX={-modal.PADDING_FS}
                        paddingX={modal.PADDING_FS}
                        height={60}
                        fontSize='h3'
                        primary={true}>
                        Save
                    </Link>
                </Modal.Footer>
            }
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
ColorIQModal.prototype.path = 'GlobalModals/ColorIQModal';
// Added by sephora-jsx-loader.js
Object.assign(ColorIQModal.prototype, require('./ColorIQModal.c.js'));
var originalDidMount = ColorIQModal.prototype.componentDidMount;
ColorIQModal.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ColorIQModal');
if (originalDidMount) originalDidMount.apply(this);
if (ColorIQModal.prototype.ctrlr) ColorIQModal.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ColorIQModal');
// Added by sephora-jsx-loader.js
ColorIQModal.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ColorIQModal.prototype.class = 'ColorIQModal';
// Added by sephora-jsx-loader.js
ColorIQModal.prototype.getInitialState = function() {
    ColorIQModal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ColorIQModal.prototype.render = wrapComponentRender(ColorIQModal.prototype.render);
// Added by sephora-jsx-loader.js
var ColorIQModalClass = React.createClass(ColorIQModal.prototype);
// Added by sephora-jsx-loader.js
ColorIQModalClass.prototype.classRef = ColorIQModalClass;
// Added by sephora-jsx-loader.js
Object.assign(ColorIQModalClass, ColorIQModal);
// Added by sephora-jsx-loader.js
module.exports = ColorIQModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/ColorIQModal/ColorIQModal.jsx