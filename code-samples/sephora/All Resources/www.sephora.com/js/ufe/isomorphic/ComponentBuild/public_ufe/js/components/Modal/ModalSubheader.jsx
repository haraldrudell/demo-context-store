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
    Sephora.Util.InflatorComps.Comps['ModalSubheader'] = function ModalSubheader(){
        return ModalSubheaderClass;
    }
}
const { modal, shade } = require('style');
const Flex = require('components/Flex/Flex');

const ModalSubheader = function () {};

ModalSubheader.prototype.render = function () {
    return (
        <Flex
            justifyContent='space-between'
            alignItems='center'
            position='relative'
            zIndex={1}
            paddingX={modal.PADDING_MW}
            height={modal.SUBHEADER_HEIGHT}
            backgroundColor='white'
            boxShadow={`0 1px 10px -1px ${shade[2]}`}>
            {this.props.children}
        </Flex>
    );
};


// Added by sephora-jsx-loader.js
ModalSubheader.prototype.path = 'Modal';
// Added by sephora-jsx-loader.js
ModalSubheader.prototype.class = 'ModalSubheader';
// Added by sephora-jsx-loader.js
ModalSubheader.prototype.getInitialState = function() {
    ModalSubheader.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ModalSubheader.prototype.render = wrapComponentRender(ModalSubheader.prototype.render);
// Added by sephora-jsx-loader.js
var ModalSubheaderClass = React.createClass(ModalSubheader.prototype);
// Added by sephora-jsx-loader.js
ModalSubheaderClass.prototype.classRef = ModalSubheaderClass;
// Added by sephora-jsx-loader.js
Object.assign(ModalSubheaderClass, ModalSubheader);
// Added by sephora-jsx-loader.js
module.exports = ModalSubheaderClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Modal/ModalSubheader.jsx