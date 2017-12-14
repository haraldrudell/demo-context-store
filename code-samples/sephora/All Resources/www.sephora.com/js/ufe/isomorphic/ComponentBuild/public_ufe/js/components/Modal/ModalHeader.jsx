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
    Sephora.Util.InflatorComps.Comps['ModalHeader'] = function ModalHeader(){
        return ModalHeaderClass;
    }
}
const {
    colors, modal, shade, space
} = require('style');
const Base = require('components/Base/Base');

const ModalHeader = function () {};

ModalHeader.prototype.render = function () {
    const {
        isFixedHeader,
        isFixedSubheader,
        showDismiss,
        children
    } = this.props;

    const pad = Sephora.isMobile() ? modal.PADDING_MW : modal.PADDING_FS;

    return (
        <Base
            baseStyle={[
                {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: modal.HEADER_HEIGHT,
                    paddingLeft: pad,
                    paddingRight: showDismiss ?
                        (pad * 2) + modal.X_SIZE : pad,
                    borderBottomWidth: 1,
                    borderColor: colors.lightGray
                },
                (Sephora.isMobile() && isFixedHeader) && {
                    position: 'relative',
                    zIndex: 2,
                    backgroundColor: colors.white,
                    boxShadow: '0 1px 10px -1px ' + shade[2],
                    borderColor: 'transparent'
                },
                (Sephora.isMobile() && isFixedSubheader) && {
                    boxShadow: 'none',
                    borderColor: colors.lightGray
                }
            ]}>
            {children}
        </Base>
    );
};


// Added by sephora-jsx-loader.js
ModalHeader.prototype.path = 'Modal';
// Added by sephora-jsx-loader.js
ModalHeader.prototype.class = 'ModalHeader';
// Added by sephora-jsx-loader.js
ModalHeader.prototype.getInitialState = function() {
    ModalHeader.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ModalHeader.prototype.render = wrapComponentRender(ModalHeader.prototype.render);
// Added by sephora-jsx-loader.js
var ModalHeaderClass = React.createClass(ModalHeader.prototype);
// Added by sephora-jsx-loader.js
ModalHeaderClass.prototype.classRef = ModalHeaderClass;
// Added by sephora-jsx-loader.js
Object.assign(ModalHeaderClass, ModalHeader);
// Added by sephora-jsx-loader.js
module.exports = ModalHeaderClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Modal/ModalHeader.jsx