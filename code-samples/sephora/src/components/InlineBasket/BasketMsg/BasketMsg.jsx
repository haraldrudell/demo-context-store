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
    Sephora.Util.InflatorComps.Comps['BasketMsg'] = function BasketMsg(){
        return BasketMsgClass;
    }
}
const { space } = require('style');
const { Box, Image, Text } = require('components/display');

const BasketMsg = function () { };

BasketMsg.prototype.render = function () {

    const {
        basket,
        ...props
    } = this.props;

    let heading;
    let message;

    // select only messages, not warnings or errors
    let messages = basket.basketLevelMessages &&
        basket.basketLevelMessages.filter(item => item.type === 'message');

    if (messages && messages.length) {
        let lastMessage = messages.pop();

        switch (lastMessage.messageLogo) {
            case 'freeShipLogo':
                heading =
                    <Text
                        fontSize='h3'
                        textTransform='uppercase'>
                        Free Shipping
                    </Text>;
                break;
            case 'vibBiLogo':
                heading =
                    <Image
                        src='/img/ufe/bi/logo-vib.svg'
                        width={41} height={20}
                        alt='VIB' />;
                break;
            case 'vibRougeLogo':
                heading =
                    <Image
                        src='/img/ufe/bi/logo-rouge.svg'
                        width={87} height={20}
                        alt='ROUGE' />;
                break;
            default:
                null;
        }
        message =
            <Text
                is='p'
                dangerouslySetInnerHTML={{ __html: lastMessage.messages[0] }} />;
    }

    return (
        heading || message ?
            <Box
                {...props}
                fontWeight={700}
                lineHeight={2}
                textAlign='center'>
                {heading &&
                    <Box
                        paddingTop={space[1]}
                        marginBottom={space[2]}>
                        {heading}
                    </Box>
                }
                {message && message}
            </Box>
        : null
    );
};


// Added by sephora-jsx-loader.js
BasketMsg.prototype.path = 'InlineBasket/BasketMsg';
// Added by sephora-jsx-loader.js
BasketMsg.prototype.class = 'BasketMsg';
// Added by sephora-jsx-loader.js
BasketMsg.prototype.getInitialState = function() {
    BasketMsg.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BasketMsg.prototype.render = wrapComponentRender(BasketMsg.prototype.render);
// Added by sephora-jsx-loader.js
var BasketMsgClass = React.createClass(BasketMsg.prototype);
// Added by sephora-jsx-loader.js
BasketMsgClass.prototype.classRef = BasketMsgClass;
// Added by sephora-jsx-loader.js
Object.assign(BasketMsgClass, BasketMsg);
// Added by sephora-jsx-loader.js
module.exports = BasketMsgClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/InlineBasket/BasketMsg/BasketMsg.jsx