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
    Sephora.Util.InflatorComps.Comps['BackToTopButton'] = function BackToTopButton(){
        return BackToTopButtonClass;
    }
}
const { zIndex, space } = require('style');
const Chevron = require('components/Chevron/Chevron');
const ButtonWhite = require('components/Button/ButtonWhite');
const { Flex, Text } = require('components/display');

const BackToTopButton = function () {
    this.state = {
        isShown: false
    };
};

BackToTopButton.prototype.render = function () {
    const isMobile = Sephora.isMobile();

    const button =
        <ButtonWhite
            onClick={this.onClick}
            width={32} height={32}
            position='fixed'
            zIndex={zIndex.BACK_TO_TOP}
            right={0} bottom={256}
            fontSize={16}
            lineHeight={0}
            padding='0px'
            rounded='left'
            minHeight={0}>
            <Chevron direction='up' />
        </ButtonWhite>;

    const backToTopButton =
        <Flex
            cursor='pointer'
            fontSize='h3'
            borderTop={space[2]}
            borderColor='lightGray'
            padding={space[4]}
            marginTop={space[4]}
            marginX={-space[4]}
            marginBottom={-space[6]}
            lineHeight={1}
            alignItems='center'
            justifyContent='center'
            onClick={this.onClick}>
            <Text paddingRight={space[2]}>
                Back to top
            </Text>
            <Chevron
                direction='up' />
        </Flex>;

    return (
        <div>
            {isMobile ?
                backToTopButton
                :
                this.state.isShown ? button : null
            }
        </div>);
};


// Added by sephora-jsx-loader.js
BackToTopButton.prototype.path = 'BackToTopButton';
// Added by sephora-jsx-loader.js
Object.assign(BackToTopButton.prototype, require('./BackToTopButton.c.js'));
var originalDidMount = BackToTopButton.prototype.componentDidMount;
BackToTopButton.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BackToTopButton');
if (originalDidMount) originalDidMount.apply(this);
if (BackToTopButton.prototype.ctrlr) BackToTopButton.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BackToTopButton');
// Added by sephora-jsx-loader.js
BackToTopButton.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BackToTopButton.prototype.class = 'BackToTopButton';
// Added by sephora-jsx-loader.js
BackToTopButton.prototype.getInitialState = function() {
    BackToTopButton.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BackToTopButton.prototype.render = wrapComponentRender(BackToTopButton.prototype.render);
// Added by sephora-jsx-loader.js
var BackToTopButtonClass = React.createClass(BackToTopButton.prototype);
// Added by sephora-jsx-loader.js
BackToTopButtonClass.prototype.classRef = BackToTopButtonClass;
// Added by sephora-jsx-loader.js
Object.assign(BackToTopButtonClass, BackToTopButton);
// Added by sephora-jsx-loader.js
module.exports = BackToTopButtonClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BackToTopButton/BackToTopButton.jsx