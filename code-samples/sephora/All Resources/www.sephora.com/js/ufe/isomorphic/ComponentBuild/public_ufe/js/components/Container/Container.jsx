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
    Sephora.Util.InflatorComps.Comps['Container'] = function Container(){
        return ContainerClass;
    }
}
const { site } = require('style');
const { Box } = require('components/display');

const Container = function () {};

Container.prototype.render = function () {
    const isMobile = Sephora.isMobile();
    return (
        <Box
            {...this.props}
            width={!isMobile ? site.WIDTH : null}
            paddingX={isMobile ? site.PADDING_MW : site.PADDING_FS}
            marginX='auto'
            baseStyle={{ boxSizing: 'content-box' }} />
    );
};


// Added by sephora-jsx-loader.js
Container.prototype.path = 'Container';
// Added by sephora-jsx-loader.js
Container.prototype.class = 'Container';
// Added by sephora-jsx-loader.js
Container.prototype.getInitialState = function() {
    Container.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Container.prototype.render = wrapComponentRender(Container.prototype.render);
// Added by sephora-jsx-loader.js
var ContainerClass = React.createClass(Container.prototype);
// Added by sephora-jsx-loader.js
ContainerClass.prototype.classRef = ContainerClass;
// Added by sephora-jsx-loader.js
Object.assign(ContainerClass, Container);
// Added by sephora-jsx-loader.js
module.exports = ContainerClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Container/Container.jsx