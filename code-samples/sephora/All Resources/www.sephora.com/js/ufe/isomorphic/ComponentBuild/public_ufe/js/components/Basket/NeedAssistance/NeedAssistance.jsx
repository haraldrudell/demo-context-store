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
    Sephora.Util.InflatorComps.Comps['NeedAssistance'] = function NeedAssistance(){
        return NeedAssistanceClass;
    }
}
const { space } = require('style');
const { Box, Flex, Image, Text } = require('components/display');
const Link = require('components/Link/Link');
const IconInfo = require('components/Icon/IconInfo');
const UrlUtils = require('utils/Url');

const NeedAssistance = function () {
    this.state = {
        currentCountry: ''
    };
};

const US = 'US';
const CA = 'CA';

NeedAssistance.prototype.render = function () {
    const {
        currentCountry
    } = this.state;

    let isUs = currentCountry === US;
    let isInternationalShipping = !isUs && currentCountry !== CA;
    return (
        <Box
            marginTop={space[5]}
            padding={space[3]}
            border={2}
            borderColor='lightGray'>
            <Text
                is='h3' fontSize='h3'
                fontWeight={700}
                marginBottom={space[3]}>
                Need assistance?
            </Text>
            <Text is='p'>
                1-877-SEPHORA (1-877-737-4672)
                <br />
                <Link href={UrlUtils.getLink('/customer-service/contact-us')}>
                    TTY: 1-888-866-9845
                </Link>
            </Text>
            <Box
                marginY={space[2]}
                href={UrlUtils.getLink('/returns-exchanges')}>
                <Text>Free return shipping or return in store</Text>
                <Box
                    display='inline-block'
                    lineHeight={0}
                    padding={space[1]}
                    color='moonGray'
                    hoverColor='black'
                    fontSize='1.25em'>
                    <IconInfo />
                </Box>
            </Box>
            <Text is='p'>
                We accept
            </Text>
            <Flex
                alignItems='center'
                marginTop={space[1]}
                marginX={-space[1]}>
                {!isInternationalShipping && <Image
                    src='/img/ufe/icon-paypal.png'
                    alt='PayPal'
                    width={38}
                    height={22}
                    marginX={space[1]} />}
                <Image
                    src='/img/ufe/icon-visa.png'
                    alt='VISA'
                    width={38}
                    height={22}
                    marginX={space[1]} />
                <Image
                    src='/img/ufe/icon-mastercard.png'
                    alt='MasterCard'
                    width={38}
                    height={22}
                    marginX={space[1]} />
                {isUs &&
                    <Image
                        src='/img/ufe/icon-discover.png'
                        alt='Discover'
                        width={38}
                        height={22}
                        marginX={space[1]} />
                }
                <Image
                    src='/img/ufe/icon-amex.png'
                    alt='American Express'
                    width={38}
                    height={22}
                    marginX={space[1]} />
                {isUs &&
                    <Image
                        src='/img/ufe/icon-jcp.png'
                        alt='JcPenney'
                        width={38}
                        height={22}
                        marginX={space[1]} />
                }
            </Flex>
        </Box>
    );
};


// Added by sephora-jsx-loader.js
NeedAssistance.prototype.path = 'Basket/NeedAssistance';
// Added by sephora-jsx-loader.js
Object.assign(NeedAssistance.prototype, require('./NeedAssistance.c.js'));
var originalDidMount = NeedAssistance.prototype.componentDidMount;
NeedAssistance.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: NeedAssistance');
if (originalDidMount) originalDidMount.apply(this);
if (NeedAssistance.prototype.ctrlr) NeedAssistance.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: NeedAssistance');
// Added by sephora-jsx-loader.js
NeedAssistance.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
NeedAssistance.prototype.class = 'NeedAssistance';
// Added by sephora-jsx-loader.js
NeedAssistance.prototype.getInitialState = function() {
    NeedAssistance.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
NeedAssistance.prototype.render = wrapComponentRender(NeedAssistance.prototype.render);
// Added by sephora-jsx-loader.js
var NeedAssistanceClass = React.createClass(NeedAssistance.prototype);
// Added by sephora-jsx-loader.js
NeedAssistanceClass.prototype.classRef = NeedAssistanceClass;
// Added by sephora-jsx-loader.js
Object.assign(NeedAssistanceClass, NeedAssistance);
// Added by sephora-jsx-loader.js
module.exports = NeedAssistanceClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/NeedAssistance/NeedAssistance.jsx