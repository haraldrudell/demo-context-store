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
    Sephora.Util.InflatorComps.Comps['ModalTitle'] = function ModalTitle(){
        return ModalTitleClass;
    }
}
const Text = require('components/Text/Text');

const ModalTitle = function () {};

ModalTitle.prototype.render = function () {
    const {
        is = 'h2',
        ...props
    } = this.props;

    return (
        <Text
            {...props}
            is={is}
            lineHeight={2}
            fontWeight={700}
            fontSize='h3' />
    );
};


// Added by sephora-jsx-loader.js
ModalTitle.prototype.path = 'Modal';
// Added by sephora-jsx-loader.js
ModalTitle.prototype.class = 'ModalTitle';
// Added by sephora-jsx-loader.js
ModalTitle.prototype.getInitialState = function() {
    ModalTitle.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ModalTitle.prototype.render = wrapComponentRender(ModalTitle.prototype.render);
// Added by sephora-jsx-loader.js
var ModalTitleClass = React.createClass(ModalTitle.prototype);
// Added by sephora-jsx-loader.js
ModalTitleClass.prototype.classRef = ModalTitleClass;
// Added by sephora-jsx-loader.js
Object.assign(ModalTitleClass, ModalTitle);
// Added by sephora-jsx-loader.js
module.exports = ModalTitleClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Modal/ModalTitle.jsx