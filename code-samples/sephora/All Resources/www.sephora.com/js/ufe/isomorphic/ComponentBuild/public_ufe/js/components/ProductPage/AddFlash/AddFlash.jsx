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
    Sephora.Util.InflatorComps.Comps['AddFlash'] = function AddFlash(){
        return AddFlashClass;
    }
}
const { colors, space } = require('style');
const { Box } = require('components/display');
const Link = require('components/Link/Link');
const Checkbox = require('components/Inputs/Checkbox/Checkbox');
const BccMarkdown = require('components/Bcc/BccMarkdown/BccMarkdown');

const AddFlash = function() {
    this.state = {
        flashInBasket: false,
        currentSku: null,
        checked: false,
        disabled: false,
        showFlashCheckBox: false
    };
};

AddFlash.prototype.render = function() {
    if (!this.state.showFlashCheckBox) {
        return null;
    }
    const isMobile = Sephora.isMobile();
    const pad = isMobile ? space[3] : space[2];
    let message = this.state.flashInBasket ?
        <Box>
            Sephora FLASH has been added
            {' '}
            to your basket.
            {' '}
            <Link
                primary={true}
                children='View basket'
                href='/basket' />
        </Box>
        :
        <BccMarkdown
            {...this.state.addFlashOnPdpContent}
            _css={{
                '& ins': {
                    color: colors.linkPrimary,
                    textDecoration: 'none',
                    transition: 'opacity .2s',
                    ':active': {
                        opacity: 0.5
                    },
                    ':hover': !Sephora.isTouch ? {
                        opacity: 0.5
                    } : null
                }
            }} />;

    return <Box rounded={2}
                marginTop={isMobile ? space[4] : null}
                marginBottom={isMobile ? space[4] : space[3]}
                paddingX={pad}
                backgroundColor='nearWhite'>
                <Checkbox
                    checked={this.state.checked}
                    onClick={this.addFlashToBasket}
                    isSmall={!isMobile}
                    hasCenteredBox={true}
                    paddingY={pad}
                    disabled={this.state.disabled}>
                    {message}
                </Checkbox>
            </Box>;
};


// Added by sephora-jsx-loader.js
AddFlash.prototype.path = 'ProductPage/AddFlash';
// Added by sephora-jsx-loader.js
Object.assign(AddFlash.prototype, require('./AddFlash.c.js'));
var originalDidMount = AddFlash.prototype.componentDidMount;
AddFlash.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: AddFlash');
if (originalDidMount) originalDidMount.apply(this);
if (AddFlash.prototype.ctrlr) AddFlash.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: AddFlash');
// Added by sephora-jsx-loader.js
AddFlash.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
AddFlash.prototype.class = 'AddFlash';
// Added by sephora-jsx-loader.js
AddFlash.prototype.getInitialState = function() {
    AddFlash.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
AddFlash.prototype.render = wrapComponentRender(AddFlash.prototype.render);
// Added by sephora-jsx-loader.js
var AddFlashClass = React.createClass(AddFlash.prototype);
// Added by sephora-jsx-loader.js
AddFlashClass.prototype.classRef = AddFlashClass;
// Added by sephora-jsx-loader.js
Object.assign(AddFlashClass, AddFlash);
// Added by sephora-jsx-loader.js
module.exports = AddFlashClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/AddFlash/AddFlash.jsx