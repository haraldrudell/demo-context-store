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
    Sephora.Util.InflatorComps.Comps['Logo'] = function Logo(){
        return LogoClass;
    }
}
const { Box, Image } = require('components/display');
const UrlUtils = require('utils/Url');
const LOGO_WIDTH = 216;
const LOGO_HEIGHT = 28;

var Logo = function () {};

Logo.prototype.render = function () {
    return (
        <Box
            href={UrlUtils.getLink('/')}
            onClick={this.trackClick}>
            <Image
                display='block'
                disableLazyLoad={true}
                src={this.props.image.targeterResult ?
                    this.props.image.targeterResult[0].imagePath :
                    this.props.image.imagePath}
                width={Sephora.isMobile() ? LOGO_WIDTH / 2 : LOGO_WIDTH}
                height={Sephora.isMobile() ? LOGO_HEIGHT / 2 : LOGO_HEIGHT} />
        </Box>
    );
};


// Added by sephora-jsx-loader.js
Logo.prototype.path = 'Header/Logo';
// Added by sephora-jsx-loader.js
Object.assign(Logo.prototype, require('./Logo.c.js'));
var originalDidMount = Logo.prototype.componentDidMount;
Logo.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Logo');
if (originalDidMount) originalDidMount.apply(this);
if (Logo.prototype.ctrlr) Logo.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Logo');
// Added by sephora-jsx-loader.js
Logo.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Logo.prototype.class = 'Logo';
// Added by sephora-jsx-loader.js
Logo.prototype.getInitialState = function() {
    Logo.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Logo.prototype.render = wrapComponentRender(Logo.prototype.render);
// Added by sephora-jsx-loader.js
var LogoClass = React.createClass(Logo.prototype);
// Added by sephora-jsx-loader.js
LogoClass.prototype.classRef = LogoClass;
// Added by sephora-jsx-loader.js
Object.assign(LogoClass, Logo);
// Added by sephora-jsx-loader.js
module.exports = LogoClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Logo/Logo.jsx