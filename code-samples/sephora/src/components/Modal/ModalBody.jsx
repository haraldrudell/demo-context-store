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
    Sephora.Util.InflatorComps.Comps['ModalBody'] = function ModalBody(){
        return ModalBodyClass;
    }
}
const {
    modal, space
} = require('style');
const Base = require('components/Base/Base');
const CustomScroll = require('components/CustomScroll/CustomScroll');

const ModalBody = function () {};

ModalBody.prototype.render = function () {
    const {
        scrollHeight,
        isFixedHeader,
        isFixedSubheader,
        noPadding,
        noScroll,
        style,
        children
    } = this.props;

    const pad = noPadding ? null :
        Sephora.isMobile() ? modal.PADDING_MW : modal.PADDING_FS;

    const styles = [
        {
            position: 'relative',
            paddingTop: pad,
            paddingRight: pad,
            paddingBottom: pad,
            paddingLeft: pad
        },
        (Sephora.isMobile() && isFixedHeader) && {
            position: 'fixed',
            top: modal.HEADER_HEIGHT + (isFixedSubheader ? modal.SUBHEADER_HEIGHT : 0),
            left: 0,
            right: 0,
            bottom: 0,
            overflow: noScroll ? 'hidden' : 'auto',
            WebkitOverflowScrolling: !noScroll ? 'touch' : null
        },
        (Sephora.isDesktop() && scrollHeight) && {
            marginRight: space[2],
            maxHeight: scrollHeight
        }
    ];

    const Comp = Sephora.isDesktop() && scrollHeight ? CustomScroll : Base;

    return (
        <Comp
            _css={styles}
            style={style}>
            {children}
        </Comp>
    );
};


// Added by sephora-jsx-loader.js
ModalBody.prototype.path = 'Modal';
// Added by sephora-jsx-loader.js
ModalBody.prototype.class = 'ModalBody';
// Added by sephora-jsx-loader.js
ModalBody.prototype.getInitialState = function() {
    ModalBody.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ModalBody.prototype.render = wrapComponentRender(ModalBody.prototype.render);
// Added by sephora-jsx-loader.js
var ModalBodyClass = React.createClass(ModalBody.prototype);
// Added by sephora-jsx-loader.js
ModalBodyClass.prototype.classRef = ModalBodyClass;
// Added by sephora-jsx-loader.js
Object.assign(ModalBodyClass, ModalBody);
// Added by sephora-jsx-loader.js
module.exports = ModalBodyClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Modal/ModalBody.jsx