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
    Sephora.Util.InflatorComps.Comps['OtherPayments'] = function OtherPayments(){
        return OtherPaymentsClass;
    }
}
const { space } = require('style');
const Text = require('components/Text/Text');
const IconCross = require('components/Icon/IconCross');
const Link = require('components/Link/Link');
const Label = require('components/Inputs/Label/Label');
const Flex = require('components/Flex/Flex');
const Divider = require('components/Divider/Divider');

const OtherPayments = function () { };

OtherPayments.prototype.render = function () {
    return (
        <div>
            <Text
                is='p'
                marginBottom={space[4]}
                lineHeight={2}>
                PayPal Account
                <br />
                {this.props.paypalEmail}
            </Text>
            {this.state.isPaypalEnabled &&
                <div>
                    <Divider marginY={Sephora.isMobile() ? space[4] : space[5]} />
                    <Link
                        padding={space[2]}
                        margin={-space[2]}
                        onClick={this.removePaypal}>
                        <Flex alignItems='center'>
                            <IconCross x={true} fontSize='h3' />
                            <Text marginLeft={space[2]}>
                                Remove PayPal
                            </Text>
                        </Flex>
                    </Link>
                </div>
            }
        </div>
    );
};


// Added by sephora-jsx-loader.js
OtherPayments.prototype.path = 'RichProfile/MyAccount/Payments/OtherPayments';
// Added by sephora-jsx-loader.js
Object.assign(OtherPayments.prototype, require('./OtherPayments.c.js'));
var originalDidMount = OtherPayments.prototype.componentDidMount;
OtherPayments.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: OtherPayments');
if (originalDidMount) originalDidMount.apply(this);
if (OtherPayments.prototype.ctrlr) OtherPayments.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: OtherPayments');
// Added by sephora-jsx-loader.js
OtherPayments.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
OtherPayments.prototype.class = 'OtherPayments';
// Added by sephora-jsx-loader.js
OtherPayments.prototype.getInitialState = function() {
    OtherPayments.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
OtherPayments.prototype.render = wrapComponentRender(OtherPayments.prototype.render);
// Added by sephora-jsx-loader.js
var OtherPaymentsClass = React.createClass(OtherPayments.prototype);
// Added by sephora-jsx-loader.js
OtherPaymentsClass.prototype.classRef = OtherPaymentsClass;
// Added by sephora-jsx-loader.js
Object.assign(OtherPaymentsClass, OtherPayments);
// Added by sephora-jsx-loader.js
module.exports = OtherPaymentsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/Payments/OtherPayments/OtherPayments.jsx