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
    Sephora.Util.InflatorComps.Comps['Html'] = function Html(){
        return HtmlClass;
    }
}
const Base = require('components/Base/Base');

const Html = function () { };

Html.prototype.render = function () {
    const { content, ...props } = this.props;
    return (
        <Base
            {...props}
            dangerouslySetInnerHTML={{ __html: content }} />
    );
};


// Added by sephora-jsx-loader.js
Html.prototype.path = 'Html';
// Added by sephora-jsx-loader.js
Html.prototype.class = 'Html';
// Added by sephora-jsx-loader.js
Html.prototype.getInitialState = function() {
    Html.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Html.prototype.render = wrapComponentRender(Html.prototype.render);
// Added by sephora-jsx-loader.js
var HtmlClass = React.createClass(Html.prototype);
// Added by sephora-jsx-loader.js
HtmlClass.prototype.classRef = HtmlClass;
// Added by sephora-jsx-loader.js
Object.assign(HtmlClass, Html);
// Added by sephora-jsx-loader.js
module.exports = HtmlClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Html/Html.jsx