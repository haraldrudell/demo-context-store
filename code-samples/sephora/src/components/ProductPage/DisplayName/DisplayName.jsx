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
    Sephora.Util.InflatorComps.Comps['DisplayName'] = function DisplayName(){
        return DisplayNameClass;
    }
}
const { Text } = require('components/display');
const Link = require('components/Link/Link');

const DisplayName = function () {};

DisplayName.prototype.render = function () {
    let {
        brand,
        displayName
    } = this.props;
    return (
        <Text
            is='h1'
            fontSize='h3'
            lineHeight={2}>
            {brand &&
                <Link
                    href={brand.targetUrl}
                    fontWeight={700}
                    textTransform='uppercase'>
                    <Text
                        dangerouslySetInnerHTML={{
                            __html: brand.displayName
                        }} />
                </Link>
            }
            <Text
                display='block'
                dangerouslySetInnerHTML={{
                    __html: displayName
                }} />
        </Text>
    );
};


// Added by sephora-jsx-loader.js
DisplayName.prototype.path = 'ProductPage/DisplayName';
// Added by sephora-jsx-loader.js
DisplayName.prototype.class = 'DisplayName';
// Added by sephora-jsx-loader.js
DisplayName.prototype.getInitialState = function() {
    DisplayName.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
DisplayName.prototype.render = wrapComponentRender(DisplayName.prototype.render);
// Added by sephora-jsx-loader.js
var DisplayNameClass = React.createClass(DisplayName.prototype);
// Added by sephora-jsx-loader.js
DisplayNameClass.prototype.classRef = DisplayNameClass;
// Added by sephora-jsx-loader.js
Object.assign(DisplayNameClass, DisplayName);
// Added by sephora-jsx-loader.js
module.exports = DisplayNameClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/DisplayName/DisplayName.jsx