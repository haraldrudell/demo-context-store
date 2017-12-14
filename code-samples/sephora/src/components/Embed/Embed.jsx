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
    Sephora.Util.InflatorComps.Comps['Embed'] = function Embed(){
        return EmbedClass;
    }
}
// Responsive media embed wrapper

const Embed = function () {};

const Base = require('components/Base/Base');

Embed.prototype.render = function () {
    const {
        ratio,
        ...props
    } = this.props;

    const childProps = {
        style: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            bottom: 0,
            left: 0,
            border: 0
        }
    };
    const styledChildren = React.Children.map(this.props.children, (child, index) =>
        React.cloneElement(child, Object.assign({}, childProps, { key: index }))
    );
    return (
        <Base
            {...props}
            children={styledChildren}
            position='relative'
            height={0}
            overflow='hidden'
            style={{
                paddingBottom: `${(ratio ? ratio : 1) * 100}%`
            }} />
    );
};


// Added by sephora-jsx-loader.js
Embed.prototype.path = 'Embed';
// Added by sephora-jsx-loader.js
Embed.prototype.class = 'Embed';
// Added by sephora-jsx-loader.js
Embed.prototype.getInitialState = function() {
    Embed.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Embed.prototype.render = wrapComponentRender(Embed.prototype.render);
// Added by sephora-jsx-loader.js
var EmbedClass = React.createClass(Embed.prototype);
// Added by sephora-jsx-loader.js
EmbedClass.prototype.classRef = EmbedClass;
// Added by sephora-jsx-loader.js
Object.assign(EmbedClass, Embed);
// Added by sephora-jsx-loader.js
module.exports = EmbedClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Embed/Embed.jsx