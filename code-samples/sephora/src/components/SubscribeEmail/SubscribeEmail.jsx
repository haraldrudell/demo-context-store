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
    Sephora.Util.InflatorComps.Comps['SubscribeEmail'] = function SubscribeEmail(){
        return SubscribeEmailClass;
    }
}
const { space } = require('style');
const { Box, Flex, Text } = require('components/display');
const Label = require('components/Inputs/Label/Label');
const IconInfo = require('components/Icon/IconInfo');
const Popover = require('components/Popover/Popover');
const Checkbox = require('components/Inputs/Checkbox/Checkbox');
const Locale = require('utils/LanguageLocale');

const SubscribeEmail = function () {
    this.state = {
        checked: this.props.checked
    };
};

SubscribeEmail.prototype.render = function () {
    const {
        isApplePaySignIn,
        disabled,
        checked,
        ...props
    } = this.props;

    return (
        <Box {...props}>
            {isApplePaySignIn ||
                <Label>Stay-in-the-know</Label>
            }
            <Flex alignItems='center'>
                <Checkbox
                    name='subscribeSephoraEmail'
                    checked={this.state.checked}
                    disabled={disabled}
                    onChange={this.handleSubscribe}>
                    <Text marginRight={space[1]}>
                        Subscribe to Sephora emails
                    </Text>
                </Checkbox>
                {Locale.getCurrentCountry() === Locale.COUNTRIES.CA &&
                    <Popover
                        content={`Sephora Beauty Canada, Inc. (600 de Maisonneuve Boulevard West,
                        Suite 2400, Montréal Quebec, H3A 3J2, sephora.ca) is requesting consent
                        on its own behalf and on behalf of Sephora USA, Inc. (525 Market Street,
                        Floor 32, San Francisco, CA 94105, sephora.com). You may withdraw your
                        consent at any time.`}
                        placement='top'>
                        <Box
                            padding={space[1]}
                            lineHeight={0}
                            color='moonGray'
                            hoverColor='black'>
                            <IconInfo />
                        </Box>
                    </Popover>
                }
            </Flex>
        </Box>
    );
};


// Added by sephora-jsx-loader.js
SubscribeEmail.prototype.path = 'SubscribeEmail';
// Added by sephora-jsx-loader.js
Object.assign(SubscribeEmail.prototype, require('./SubscribeEmail.c.js'));
var originalDidMount = SubscribeEmail.prototype.componentDidMount;
SubscribeEmail.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: SubscribeEmail');
if (originalDidMount) originalDidMount.apply(this);
if (SubscribeEmail.prototype.ctrlr) SubscribeEmail.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: SubscribeEmail');
// Added by sephora-jsx-loader.js
SubscribeEmail.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
SubscribeEmail.prototype.class = 'SubscribeEmail';
// Added by sephora-jsx-loader.js
SubscribeEmail.prototype.getInitialState = function() {
    SubscribeEmail.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
SubscribeEmail.prototype.render = wrapComponentRender(SubscribeEmail.prototype.render);
// Added by sephora-jsx-loader.js
var SubscribeEmailClass = React.createClass(SubscribeEmail.prototype);
// Added by sephora-jsx-loader.js
SubscribeEmailClass.prototype.classRef = SubscribeEmailClass;
// Added by sephora-jsx-loader.js
Object.assign(SubscribeEmailClass, SubscribeEmail);
// Added by sephora-jsx-loader.js
module.exports = SubscribeEmailClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/SubscribeEmail/SubscribeEmail.jsx