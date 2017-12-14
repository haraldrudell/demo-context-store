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
    Sephora.Util.InflatorComps.Comps['BiWelcomeCard'] = function BiWelcomeCard(){
        return BiWelcomeCardClass;
    }
}
const { space } = require('style');
const { Box, Image } = require('components/display');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const BiWelcomeCard = function () {};

BiWelcomeCard.prototype.render = function () {
    const {
        joinNowCTA,
        shadow
    } = this.props;

    let clickHandler = joinNowCTA ? this.joinBi : this.signIn;
    let buttonCTA = joinNowCTA ? 'Join Now' : 'Sign In';
    return (
        <Box
            rounded={true}
            boxShadow={`${shadow.offset} ${shadow.blur} rgba(0,0,0,${shadow.opacity})`}
            backgroundColor='white'
            textAlign='center'
            padding={Sephora.isMobile() ? space[2] : space[5]}>
            <Box
                fontSize='h3'
                lineHeight={1}
                marginTop={Sephora.isMobile() ? space[2] : null}
                serif={true}>
                Welcome to
            </Box>
            <Image
                display='block'
                src='/img/ufe/bi/logo-beauty-insider.svg'
                alt='Beauty Insider'
                width={240} height={36}
                marginX='auto'
                marginTop={space[2]}
                marginBottom={space[4]} />
            <ButtonPrimary
                block={true}
                onClick={clickHandler}
                marginX='auto'
                size={Sephora.isDesktop() ? 'lg' : null}
                maxWidth={Sephora.isDesktop() ? '50%' : null}>
                { buttonCTA }
            </ButtonPrimary>
        </Box>
    );
};


// Added by sephora-jsx-loader.js
BiWelcomeCard.prototype.path = 'BiTopBar/BiWelcomeCard';
// Added by sephora-jsx-loader.js
Object.assign(BiWelcomeCard.prototype, require('./BiWelcomeCard.c.js'));
var originalDidMount = BiWelcomeCard.prototype.componentDidMount;
BiWelcomeCard.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BiWelcomeCard');
if (originalDidMount) originalDidMount.apply(this);
if (BiWelcomeCard.prototype.ctrlr) BiWelcomeCard.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BiWelcomeCard');
// Added by sephora-jsx-loader.js
BiWelcomeCard.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BiWelcomeCard.prototype.class = 'BiWelcomeCard';
// Added by sephora-jsx-loader.js
BiWelcomeCard.prototype.getInitialState = function() {
    BiWelcomeCard.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BiWelcomeCard.prototype.render = wrapComponentRender(BiWelcomeCard.prototype.render);
// Added by sephora-jsx-loader.js
var BiWelcomeCardClass = React.createClass(BiWelcomeCard.prototype);
// Added by sephora-jsx-loader.js
BiWelcomeCardClass.prototype.classRef = BiWelcomeCardClass;
// Added by sephora-jsx-loader.js
Object.assign(BiWelcomeCardClass, BiWelcomeCard);
// Added by sephora-jsx-loader.js
module.exports = BiWelcomeCardClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BiTopBar/BiWelcomeCard/BiWelcomeCard.jsx