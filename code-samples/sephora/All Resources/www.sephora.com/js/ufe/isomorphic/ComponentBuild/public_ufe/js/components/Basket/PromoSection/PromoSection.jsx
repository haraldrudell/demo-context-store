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
    Sephora.Util.InflatorComps.Comps['PromoSection'] = function PromoSection(){
        return PromoSectionClass;
    }
}
const { forms, space } = require('style');
const { Box, Flex, Text } = require('components/display');
const TextInput = require('components/Inputs/TextInput/TextInput');
const Link = require('components/Link/Link');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const IconCross = require('components/Icon/IconCross');
const MobilePromoList = require('components/Basket/PromoSection/MobilePromoList/MobilePromoList');

let PromoSection = function () {
    this.state = {
        promoErrorMessage: null,
        basketPromosList: [],
        promoApplied: false,
        promoMessage: null
    };
    this.promoInput = null;
};

PromoSection.prototype.render = function () {
    let {
        basketPromosList = []
    } = this.state;
    let skuPromoApplied = !!basketPromosList.length;
    let promoApplied = skuPromoApplied || this.state.promoMessage;
    let allSkuPromoAreGlobal = this.allSkuPromoAreGlobal(basketPromosList);
    return (
        <div>
            <Flex
                marginBottom={space[2]}
                justifyContent='space-between'
                alignItems='baseline'>
                <Text
                    is='p'
                    fontWeight={700}>
                    {promoApplied ?
                        'Promo added' : 'Add promo code'
                    }
                </Text>
                { //TODO 17.5: Enable this once ILLUPH-77687 is played.
                  // commenting it this way as jscs is not happy with block comment
                    false &&
                        <Link
                             padding={space[2]}
                             margin={-space[2]}
                             arrowDirection='right'>
                             View promo codes
                         </Link>
                 }
            </Flex>
            <Text
                is='p'
                marginBottom={space[2]}
                fontSize='h5'
                color='error'>
                { this.state.promoErrorMessage || this.state.promoWarningMessage}
            </Text>
            {Sephora.isMobile() &&
                <MobilePromoList />}
                {!!basketPromosList.length && <Box marginBottom={space[2]}/>}
                {allSkuPromoAreGlobal ? null :

                    promoApplied ?
                        <Flex
                            alignItems='center'
                            border={1}
                            borderColor={forms.BORDER_FOCUS_COLOR}
                            height={forms.HEIGHT}
                            rounded={true}
                            onClick={this.removePromoCode}>
                            <Link
                                fontSize='h3'
                                lineHeight={0}
                                paddingX={space[3]}
                                paddingY={space[2]}>
                                <IconCross x={true}/>
                            </Link>
                            <Text
                                lineHeight={1}>
                                {this.state.promoMessage}
                            </Text>
                        </Flex>
                        :
                        <Box
                            is='form'
                            onSubmit={this.applyPromoCode}
                            overflow='hidden'
                            position='relative'
                            rounded={true}>
                            <TextInput
                                noMargin={true}
                                label='Promotion code'
                                hideLabel={true}
                                onKeyUp={ e => this.handleKeyUp(e)}
                                ref={
                                    (c) => {
                                        if (c !== null) {
                                            this.promoInput = c;
                                        }
                                    }
                                }
                                placeholder='Enter code (1 per order)'
                                data-at={Sephora.debug.dataAt('bsk_promo_input')}/>
                            <Box
                                position='absolute'
                                top={0} right={0}
                                transition='transform .15s'
                                style={{
                                    transform: `translate3d(${this.state.promoApplied ? '0' : '100%'}, 0, 0)`
                                }}>
                                <ButtonPrimary
                                    type='submit'
                                    rounded='right'>
                                    Apply
                                </ButtonPrimary>
                            </Box>
                        </Box>
                }
        </div>
    );
};

PromoSection.prototype.allSkuPromoAreGlobal = function (basketPromosList) {
    let allSkuPromoAreGlobal = !!basketPromosList.length;
    basketPromosList.forEach(skuPromo => {
        if (!skuPromo.isGlobalPromotion) {
            allSkuPromoAreGlobal = false;
        }
    });
    return allSkuPromoAreGlobal;
};


// Added by sephora-jsx-loader.js
PromoSection.prototype.path = 'Basket/PromoSection';
// Added by sephora-jsx-loader.js
Object.assign(PromoSection.prototype, require('./PromoSection.c.js'));
var originalDidMount = PromoSection.prototype.componentDidMount;
PromoSection.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: PromoSection');
if (originalDidMount) originalDidMount.apply(this);
if (PromoSection.prototype.ctrlr) PromoSection.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: PromoSection');
// Added by sephora-jsx-loader.js
PromoSection.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
PromoSection.prototype.class = 'PromoSection';
// Added by sephora-jsx-loader.js
PromoSection.prototype.getInitialState = function() {
    PromoSection.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
PromoSection.prototype.render = wrapComponentRender(PromoSection.prototype.render);
// Added by sephora-jsx-loader.js
var PromoSectionClass = React.createClass(PromoSection.prototype);
// Added by sephora-jsx-loader.js
PromoSectionClass.prototype.classRef = PromoSectionClass;
// Added by sephora-jsx-loader.js
Object.assign(PromoSectionClass, PromoSection);
// Added by sephora-jsx-loader.js
module.exports = PromoSectionClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/PromoSection/PromoSection.jsx