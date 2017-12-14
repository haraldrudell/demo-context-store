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
    Sephora.Util.InflatorComps.Comps['FindInStore'] = function FindInStore(){
        return FindInStoreClass;
    }
}
const { space } = require('style');
const { Box, Flex, Text } = require('components/display');
const InputZip = require('components/Inputs/InputZip/InputZip');
const IconLocateOutline = require('components/Icon/IconLocateOutline');
const Chevron = require('components/Chevron/Chevron');
const Arrow = require('components/Arrow/Arrow');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const SkuUtils = require('utils/Sku');
const GIFT_CARD_MESSAGE = 'Gift cards available at all stores';

const FindInStore = function () {
    this.storeZipCode = null;
    this.state = {
        hasInputText: false
    };
};

FindInStore.prototype.render = function () {
    let currentProduct = this.props;
    let { currentSku } = currentProduct;
    let isOnlineOnly = currentSku.isOnlineOnly;
    let isGiftCard = SkuUtils.isGiftCard(currentSku);

    return (Sephora.isMobile() ?
        <Box
            width='100%'
            onClick={!isOnlineOnly && !isGiftCard
                ? e => this.findInStore(e, currentProduct)
                : null
            }>
            <Box
                padding={space[4]}
                marginX={-space[4]}
                marginBottom={-space[4]}
                fontSize='h3'>
                { isGiftCard ? this.getGiftCardMessage()
                : isOnlineOnly ?
                    'Only available online'
                :
                    <Flex
                        alignItems='center'>
                        <IconLocateOutline
                            fontSize='1.5em'
                            marginRight={space[2]} />
                        Find in store
                        <Chevron
                            marginLeft='auto'
                            marginRight='.25em'
                            direction='right' />
                    </Flex>
                }
            </Box>
        </Box>
    :
        <div>
            { isGiftCard ?
                this.getGiftCardMessage()
            :
                <div>
                    <Box
                        fontSize='h5'
                        fontWeight={700}
                        marginBottom={space[1]}>
                        Find in store
                    </Box>
                    <Box
                        is='form'
                        method='post'
                        onSubmit={e => this.showFindInStore(e, currentProduct)}
                        rounded={true}
                        position='relative'
                        overflow='hidden'>
                        <InputZip
                            noMargin={true}
                            paddingRight='0px'
                            disabled={isOnlineOnly}
                            isOnlineOnly={isOnlineOnly}
                            onKeyUp={e => this.handleKeyUp(e)}
                            ref={
                                (c) => {
                                    if (c !== null) {
                                        this.storeZipCode = c;
                                    }
                                }
                            } />
                        {isOnlineOnly ||
                            <Box
                                position='absolute'
                                top={0} right={0}
                                transition='transform .15s'
                                style={{
                                    transform: `translate3d(${this.state.hasInputText ? '0' : '100%'}, 0, 0)`
                                }}>
                                <ButtonPrimary
                                    type='submit'
                                    paddingX='0px'
                                    width={36}
                                    backgroundColor='black'
                                    color='white'
                                    rounded='right'>
                                    <Arrow direction='right' />
                                </ButtonPrimary>
                            </Box>
                        }
                    </Box>
                </div>
            }
        </div>
    );
};


FindInStore.prototype.getGiftCardMessage = function () {
    return (
        <Text
            is='p'
            lineHeight={2}
            color='gray'>
            {GIFT_CARD_MESSAGE}
        </Text>
    );
};


// Added by sephora-jsx-loader.js
FindInStore.prototype.path = 'ProductPage/FindInStore';
// Added by sephora-jsx-loader.js
Object.assign(FindInStore.prototype, require('./FindInStore.c.js'));
var originalDidMount = FindInStore.prototype.componentDidMount;
FindInStore.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: FindInStore');
if (originalDidMount) originalDidMount.apply(this);
if (FindInStore.prototype.ctrlr) FindInStore.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: FindInStore');
// Added by sephora-jsx-loader.js
FindInStore.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
FindInStore.prototype.class = 'FindInStore';
// Added by sephora-jsx-loader.js
FindInStore.prototype.getInitialState = function() {
    FindInStore.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
FindInStore.prototype.render = wrapComponentRender(FindInStore.prototype.render);
// Added by sephora-jsx-loader.js
var FindInStoreClass = React.createClass(FindInStore.prototype);
// Added by sephora-jsx-loader.js
FindInStoreClass.prototype.classRef = FindInStoreClass;
// Added by sephora-jsx-loader.js
Object.assign(FindInStoreClass, FindInStore);
// Added by sephora-jsx-loader.js
module.exports = FindInStoreClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/FindInStore/FindInStore.jsx