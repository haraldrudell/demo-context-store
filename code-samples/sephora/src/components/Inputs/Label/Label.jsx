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
    Sephora.Util.InflatorComps.Comps['Label'] = function Label(){
        return LabelClass;
    }
}
const {
    fontSizes, lineHeights
} = require('style');
const Base = require('components/Base/Base');

const Label = function () {};

Label.prototype.render = function () {
    const {
        hide,
        isInline,
        ...props
    } = this.props;

    const styles = {
        initial: {
            fontSize: fontSizes.h4,
            fontWeight: 700,
            lineHeight: lineHeights[2]
        },
        block: {
            display: 'block',
            marginBottom: '.5em'
        },
        inline: {
            display: 'inline-block',
            marginRight: '.5em',
            verticalAlign: 'middle'
        },
        hidden: {
            position: 'absolute',
            height: 1,
            width: 1,
            overflow: 'hidden',
            clip: 'rect(1px, 1px, 1px, 1px)'
        }
    };

    return (
        <Base
            {...props}
            is='label'
            baseStyle={[
                styles.initial,
                hide ? styles.hidden :
                isInline ? styles.inline :
                styles.block
            ]} />
    );
};

Label.prototype.propTypes = {
    /** Accessibly hide label for use in high density UI */
    hide: React.PropTypes.bool,
    /** Inline - display inline-block */
    isInline: React.PropTypes.bool
};


// Added by sephora-jsx-loader.js
Label.prototype.path = 'Inputs/Label';
// Added by sephora-jsx-loader.js
Label.prototype.class = 'Label';
// Added by sephora-jsx-loader.js
Label.prototype.getInitialState = function() {
    Label.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Label.prototype.render = wrapComponentRender(Label.prototype.render);
// Added by sephora-jsx-loader.js
var LabelClass = React.createClass(Label.prototype);
// Added by sephora-jsx-loader.js
LabelClass.prototype.classRef = LabelClass;
// Added by sephora-jsx-loader.js
Object.assign(LabelClass, Label);
// Added by sephora-jsx-loader.js
module.exports = LabelClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Inputs/Label/Label.jsx