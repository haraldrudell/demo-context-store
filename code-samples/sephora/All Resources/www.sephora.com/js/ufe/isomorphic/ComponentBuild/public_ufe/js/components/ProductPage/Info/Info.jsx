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
    Sephora.Util.InflatorComps.Comps['Info'] = function Info(){
        return InfoClass;
    }
}
/* eslint-disable max-len */
const { colors, fontSizes, lineHeights, space } = require('style');
const { Box, Flex, Image, Text } = require('components/display');
const Collapse = require('react-smooth-collapse');
const Link = require('components/Link/Link');
const Chevron = require('components/Chevron/Chevron');
const Ellipsis = require('components/Ellipsis/Ellipsis');
const skuUtils = require('utils/Sku');
const { PROP_65_MSG } = require('components/constants');

const TAB_LABEL = {
    'DETAILS': 'Details',
    'USE': 'How to Use',
    'FAQ': 'FAQ',
    'INGREDIENTS': 'Ingredients',
    'BRAND': 'About the Brand',
    'SHIPPING': 'Shipping & Returns'
};

const Info = function () {
    this.state = {
        expandedTab: Sephora.isDesktop() ? 0 : null
    };
};

Info.prototype.render = function () {

    let currentProduct = this.props;
    let {
        currentSku
    } = currentProduct;

    let currentSkuType = skuUtils.getProductType(currentSku);

    let isReward = currentSkuType === skuUtils.skuTypes.REWARD;
    let isFlashOrPlay =
        currentSkuType === skuUtils.skuTypes.FLASH ||
        currentSkuType === skuUtils.skuTypes.SUBSCRIPTION;

    let brandName = '';
    let brandDescription = '';
    let brandPageUrl = '';
    let brandProductUrl = '';

    if (currentProduct.brand) {
        brandName = currentProduct.brand.displayName;
        brandDescription = (currentProduct.brand.longDescription) ?
                                currentProduct.brand.longDescription
                            : currentProduct.brand.description;

        if (currentProduct.brand.targetUrl) {
            let icid2Prefix = '?icid2=product_about brand_';
            brandPageUrl = currentProduct.brand.targetUrl + icid2Prefix + 'visit brand lp';
            brandProductUrl = currentProduct.brand.targetUrl + icid2Prefix + 'shop all&products=all';
        }
    }

    let tabs = [];
    if (currentProduct.longDescription) {
        tabs.push({
            label: TAB_LABEL.DETAILS,
            content: currentProduct.longDescription
        });
    }
    if (currentProduct.suggestedUsage) {
        tabs.push({
            label: isFlashOrPlay || isReward ? TAB_LABEL.FAQ : TAB_LABEL.USE,
            content: currentProduct.suggestedUsage
        });
    }
    if (currentSku.ingredientDesc) {
        tabs.push({
            label: TAB_LABEL.INGREDIENTS,
            content: currentSku.ingredientDesc
        });
    }
    if (Sephora.isDesktop() && !isFlashOrPlay && !isReward) {
        if (currentProduct.brand) {
            tabs.push({ label: TAB_LABEL.BRAND });
        }
        tabs.push({ label: TAB_LABEL.SHIPPING });
    }

    let currentTab = this.state.expandedTab;
    const borderColor = colors.lightGray;

    // TODO: rm once tab content uses markdown component
    const htmlCompStyle = {
        '& h1, & h2, & h3, & h4, & h5, & h6': {
            marginTop: '1em',
            marginBottom: '.5em',
            lineHeight: lineHeights[2]
        },
        '& h1': { fontSize: fontSizes.h1 },
        '& h2': { fontSize: fontSizes.h2 },
        '& h3': { fontSize: fontSizes.h3 },
        '& h4': { fontSize: fontSizes.h4 },
        '& h5': { fontSize: fontSizes.h5 },
        '& h6': { fontSize: fontSizes.h6 },
        '& p, & ul, & ol': {
            marginTop: 0,
            marginBottom: '1em'
        },
        /* Flush list indentation */
        '& ul, & ol': {
            paddingLeft: 0,
            marginLeft: '1.25em'
        },
        /* No top margin on first element */
        '& > :first-child': {
            marginTop: 0
        },
        /* No bottom margin on last element */
        '& > :last-child': {
            marginBottom: 0
        },
        '& a': {
            color: colors.linkPrimary,
            textDecoration: 'none',
            ':active': {
                opacity: 0.5
            },
            ':hover': !Sephora.isTouch ? {
                opacity: 0.5
            } : null
        },
        /* prevent b tag from oddly affecting line height */
        '& b': {
            lineHeight: 1
        }
    };

    return (tabs.length > 0 ?
        Sephora.isMobile() ?
        <Box
            borderBottom={1}
            borderColor={borderColor}
            marginX={-space[4]}>
            {tabs.map((tab, index) => {
                let isActive = currentTab === index;
                return (
                    <div>
                        <Flex
                            cursor='pointer'
                            lineHeight={1}
                            fontSize='h3'
                            padding={space[4]}
                            alignItems='center'
                            justifyContent='space-between'
                            borderTop={1}
                            borderColor={borderColor}
                            onClick={() => {
                                this.toggleTabs(index);
                            }}>
                            {tab.label}
                            <Chevron
                                direction={isActive ? 'up' : 'down'} />
                        </Flex>
                        <Collapse
                            heightTransition='400ms ease'
                            expanded={isActive}>
                            <Box
                                paddingX={space[4]}
                                paddingBottom={space[4]}>
                                <Ellipsis
                                    text='read more'
                                    isToggle={true}
                                    numberOfLines={8}
                                    _css={htmlCompStyle}
                                    htmlContent={tab.content}/>
                            </Box>
                        </Collapse>
                    </div>
                );
            })}
        </Box>
    :
        <div>
            {tabs.map((tab, index) => {
                let isActive = currentTab === index;
                return (
                    <Box
                        display='inline-block'
                        fontSize='h5'
                        marginBottom={-1}
                        marginRight={-1}
                        border={1}
                        lineHeight={1}
                        paddingTop={space[3]}
                        paddingX={space[4]}
                        _css={isActive ? {
                            fontWeight: 700,
                            borderColor: borderColor,
                            borderBottomColor: colors.white
                        } : {
                            borderColor: 'transparent',
                            borderLeftColor: index > 0 ? borderColor : null
                        }}
                        onClick={() => {
                            this.toggleTabs(index);
                        }}>
                        <Box
                            borderBottom={3}
                            borderColor={isActive ? colors.black : 'transparent'}
                            paddingX={space[2]}
                            paddingBottom={space[2]}>
                            {tab.label}
                        </Box>
                    </Box>
                );
            })}
            <Box
                padding={space[5]}
                border={1}
                borderColor={borderColor}>
                {tabs.map((tab, index) => {
                    let isActive = currentTab === index;
                    let content;
                    switch (tab.label) {
                        case TAB_LABEL.BRAND:
                            content =
                                <div>
                                    { currentProduct.brand.targetUrl
                                        ?
                                        <Box
                                            href={brandPageUrl}>
                                            <Image
                                                src={currentProduct.brand.logo} />
                                        </Box> :
                                        <div>
                                            <Image
                                                src={currentProduct.brand.logo} />
                                        </div>
                                    }
                                    <Box
                                        marginBottom={space[5]}>
                                        {brandDescription}
                                    </Box>
                                    { currentProduct.brand.targetUrl &&
                                        <div>
                                            <div>
                                                <Link
                                                    paddingY={space[1]}
                                                    arrowDirection='right'
                                                    primary={true}
                                                    href={brandPageUrl}>
                                                    Visit the {brandName} boutique
                                                </Link>
                                            </div>
                                            <div>
                                                <Link
                                                    paddingY={space[1]}
                                                    arrowDirection='right'
                                                    primary={true}
                                                    href={brandProductUrl}>
                                                    Shop all {brandName} products
                                                </Link>
                                            </div>
                                        </div>
                                    }
                                </div>;
                            break;
                        case TAB_LABEL.SHIPPING:
                            content =
                                <div>
                                    {currentSku.isHazmat &&
                                        <Text
                                            is='p'
                                            marginBottom='1em'>
                                            Shipping restriction: this item will ship via standard ground. Therefore, it cannot be shipped to Alaska, Hawaii, Puerto Rico and remote Canadian regions.
                                        </Text>
                                    }
                                    {(this.state.isUS && currentSku.isProp65) &&
                                        <Text
                                            is='p'
                                            marginBottom='1em'
                                            fontStyle='italic'>
                                            {PROP_65_MSG}
                                        </Text>
                                    }
                                    <Text
                                        is='p'
                                        marginBottom='1em'>
                                        Get more information about
                                        {' '}
                                        <Link
                                            primary={true}
                                            onClick={this.showShippingTerms}>
                                            shipping rates, schedules, methods,
                                            {' '}
                                            {this.state.isUS || 'and'} restrictions
                                        </Link>
                                        {this.state.isUS &&
                                            <span>, and
                                                {' '}
                                                <Link
                                                    primary={true}
                                                    onClick={this.showInternationalShippingTerms}>
                                                    International Shipping
                                                </Link>
                                            </span>
                                        }.
                                    </Text>
                                    <Text
                                        is='p'>
                                        If you are not completely satisfied with an online
                                        purchase or gift, you may return your U.S. or Canadian
                                        purchase in stores or by mail. Restrictions apply for
                                        returns made outside the U.S.
                                    </Text>
                                </div>;
                            break;
                        default:
                            content =
                                <Box
                                    _css={htmlCompStyle}
                                    dangerouslySetInnerHTML={{
                                        __html: tab.content
                                    }} />;
                            break;
                    }
                    return (
                        <Box
                            style={{
                                display: !isActive ? 'none' : null
                            }}>
                            {content}
                        </Box>
                    );
                })}
            </Box>
        </div>
    : null);
};


// Added by sephora-jsx-loader.js
Info.prototype.path = 'ProductPage/Info';
// Added by sephora-jsx-loader.js
Object.assign(Info.prototype, require('./Info.c.js'));
var originalDidMount = Info.prototype.componentDidMount;
Info.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Info');
if (originalDidMount) originalDidMount.apply(this);
if (Info.prototype.ctrlr) Info.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Info');
// Added by sephora-jsx-loader.js
Info.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Info.prototype.class = 'Info';
// Added by sephora-jsx-loader.js
Info.prototype.getInitialState = function() {
    Info.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Info.prototype.render = wrapComponentRender(Info.prototype.render);
// Added by sephora-jsx-loader.js
var InfoClass = React.createClass(Info.prototype);
// Added by sephora-jsx-loader.js
InfoClass.prototype.classRef = InfoClass;
// Added by sephora-jsx-loader.js
Object.assign(InfoClass, Info);
// Added by sephora-jsx-loader.js
module.exports = InfoClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/Info/Info.jsx