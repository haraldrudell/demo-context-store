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
    Sephora.Util.InflatorComps.Comps['ModalFooter'] = function ModalFooter(){
        return ModalFooterClass;
    }
}
const {
    colors, modal, space
} = require('style');
const Box = require('components/Box/Box');

const ModalFooter = function () {};

ModalFooter.prototype.render = function () {

    const {
        scrollHeight,
        hasBorder,
        children,
        isFixed
    } = this.props;

    const pad = Sephora.isMobile()
        ? modal.PADDING_MW
        : modal.PADDING_FS;

    const boxShadow = '0 -2px 8px 0 rgba(0,0,0,0.10)';

    return (
        <Box
            baseStyle={[
                {
                    textAlign: 'right',
                    paddingRight: pad,
                    paddingLeft: pad
                },
                hasBorder && {
                    borderTopWidth: 1,
                    borderColor: colors.lightGray,
                    paddingTop: space[4]
                },
                Sephora.isDesktop() && scrollHeight ? {
                    boxShadow
                } : {
                    paddingBottom: pad
                },
                Sephora.isMobile() && {
                    paddingTop: pad
                },
                isFixed && {
                    position: 'fixed',
                    right: 0,
                    bottom: 0,
                    left: 0,
                    backgroundColor: colors.white,
                    boxShadow
                }
            ]}>
            {children}
        </Box>
    );
};


// Added by sephora-jsx-loader.js
ModalFooter.prototype.path = 'Modal';
// Added by sephora-jsx-loader.js
ModalFooter.prototype.class = 'ModalFooter';
// Added by sephora-jsx-loader.js
ModalFooter.prototype.getInitialState = function() {
    ModalFooter.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ModalFooter.prototype.render = wrapComponentRender(ModalFooter.prototype.render);
// Added by sephora-jsx-loader.js
var ModalFooterClass = React.createClass(ModalFooter.prototype);
// Added by sephora-jsx-loader.js
ModalFooterClass.prototype.classRef = ModalFooterClass;
// Added by sephora-jsx-loader.js
Object.assign(ModalFooterClass, ModalFooter);
// Added by sephora-jsx-loader.js
module.exports = ModalFooterClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Modal/ModalFooter.jsx