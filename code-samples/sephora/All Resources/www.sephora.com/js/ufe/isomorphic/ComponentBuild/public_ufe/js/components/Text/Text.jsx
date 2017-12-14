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
    Sephora.Util.InflatorComps.Comps['Text'] = function Text(){
        return TextClass;
    }
}
const Base = require('components/Base/Base');

const Text = function () {};

Text.prototype.render = function () {
    const {
        is = 'span',
        truncate,
        ...props
    } = this.props;

    return (
        <Base
            {...props}
            is={is}
            baseStyle={[
                { wordWrap: 'break-word' },
                truncate && {
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }
            ]} />
    );
};


// Added by sephora-jsx-loader.js
Text.prototype.path = 'Text';
// Added by sephora-jsx-loader.js
Text.prototype.class = 'Text';
// Added by sephora-jsx-loader.js
Text.prototype.getInitialState = function() {
    Text.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Text.prototype.render = wrapComponentRender(Text.prototype.render);
// Added by sephora-jsx-loader.js
var TextClass = React.createClass(Text.prototype);
// Added by sephora-jsx-loader.js
TextClass.prototype.classRef = TextClass;
// Added by sephora-jsx-loader.js
Object.assign(TextClass, Text);
// Added by sephora-jsx-loader.js
module.exports = TextClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Text/Text.jsx