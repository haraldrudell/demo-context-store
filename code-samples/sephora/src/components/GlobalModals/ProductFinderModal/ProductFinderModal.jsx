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
    Sephora.Util.InflatorComps.Comps['ProductFinderModal'] = function ProductFinderModal(){
        return ProductFinderModalClass;
    }
}
/* eslint-disable max-len */
const { colors, fontSizes, lineHeights, modal, space } = require('style');
const Modal = require('components/Modal/Modal');
const CustomScroll = require('components/CustomScroll/CustomScroll');

var ProductFinderModal = function () {
    this.state = {
        content: ''
    };
};

ProductFinderModal.prototype.render = function () {
    const isMobile = Sephora.isMobile();
    const isDesktop = Sephora.isDesktop();
    const navBarHeight = isMobile ? 48 : 60;
    const answerMargin = space[2];
    const bccData = this.props.bccData;
    return (
         <Modal
            open={true}
            width={modal.WIDTH.LG}
            isFixedHeader={true}
            onDismiss={this.requestClose}>
            <Modal.Header>
                <Modal.Title
                    children={bccData.productFinderName} />
            </Modal.Header>
            <Modal.Body
                noPadding={true}
                noScroll={true}
                style={{
                    height: isDesktop ? 552 : null,
                    paddingBottom: navBarHeight,
                    backgroundImage: `url(${isMobile
                        ? bccData.mobileBackgroundPath
                        : bccData.desktopBackgroundPath})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                }}>
                <CustomScroll
                    id='productFinderModalScrollable'
                    padding={isMobile ? modal.PADDING_MW : modal.PADDING_FS}
                    height='100%'
                    textAlign='center'
                    marginBottom={navBarHeight}
                    lineHeight={2}
                    dangerouslySetInnerHTML={{
                        __html: this.state.content
                    }}
                    _css={{
                        '& .options': {
                            overflow: 'hidden',
                            maxWidth: isDesktop ? '83%' : null,
                            margin: isMobile ? -answerMargin : `-${answerMargin}px auto`
                        },
                        '& .certona-pf-input-hidden': {
                            display: 'none'
                        },
                        '& .productfinder-question-title': {
                            fontSize: fontSizes.h2,
                            marginBottom: isMobile ? space[4] : space[6],
                            fontWeight: 700
                        },
                        '& .backContainer, & .continueContainer': {
                            position: isMobile ? 'fixed' : 'absolute',
                            zIndex: 1,
                            right: 0,
                            bottom: 0
                        },
                        '& .backContainer': {
                            left: 0,
                            backgroundColor: colors.white,
                            boxShadow: '0 -2px 8px 0 rgba(0,0,0,0.10)'
                        },
                        '& .continueContainer': {
                            fontWeight: 700
                        },
                        '& .insight-submit-btn': {
                            display: 'block',
                            font: 'inherit',
                            height: navBarHeight,
                            border: 0,
                            background: 'none',
                            padding: `0 ${isMobile ? modal.PADDING_MW : modal.PADDING_FS}px`,
                            fontSize: isMobile ? fontSizes.h4 : fontSizes.h3,
                            '&:focus': {
                                outline: 0
                            },
                            '&:disabled': {
                                opacity: 0.3,
                                cursor: 'default'
                            }
                        },
                        '& .certona-pf-input-container': {
                            boxSizing: 'border-box',
                            display: 'inline-block',
                            width: isMobile ? `calc(100% - ${answerMargin * 2}px)`
                                : `calc(100% * 1 / 2 - ${answerMargin * 2}px)`,
                            margin: answerMargin,
                            padding: 2,
                            cursor: 'pointer',
                            fontSize: fontSizes.h3,
                            backgroundColor: colors.white,
                            boxShadow: '0 0 4px 0 rgba(0,0,0,0.25)',
                            border: '4px solid transparent',
                            borderRadius: 4,
                            '&:active, &.selected': {
                                borderColor: colors.black
                            },
                            '&.has-img, &:first-child:nth-last-child(n + 5), &:first-child:nth-last-child(n + 5) ~ *': isDesktop ? {
                                float: 'left'
                            } : null,
                            /* IE11 bug; allow :active state styling by
                               disabling pointer events on nested elements */
                            '& > *': {
                                pointerEvents: 'none'
                            }
                        },
                        '& .productfinder-answer-image': {
                            display: 'block',
                            maxWidth: '100%'
                        },
                        '& .productfinder-answer-text': {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            fontSize: fontSizes.h4,
                            lineHeight: lineHeights[2],
                            height: (fontSizes.h4 * lineHeights[2] * 2) + space[2],
                            paddingLeft: space[3],
                            paddingRight: space[3],
                            '&:empty': {
                                display: 'none'
                            }
                        },
                        '& #product-finder-progress-outer': {
                            backgroundColor: colors.moonGray,
                            borderRadius: 4,
                            width: isDesktop ? 334 : '100%',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginTop: isDesktop ? -space[4] : null,
                            marginBottom: space[6]
                        },
                        '& #product-finder-progress-inner': {
                            backgroundColor: colors.black,
                            borderRadius: 4,
                            height: 4,
                            width: 0,
                            transition: 'width .3s'
                        },
                        '& .percent-text': {
                            display: 'none'
                        }
                    }} />
            </Modal.Body>
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
ProductFinderModal.prototype.path = 'GlobalModals/ProductFinderModal';
// Added by sephora-jsx-loader.js
Object.assign(ProductFinderModal.prototype, require('./ProductFinderModal.c.js'));
var originalDidMount = ProductFinderModal.prototype.componentDidMount;
ProductFinderModal.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ProductFinderModal');
if (originalDidMount) originalDidMount.apply(this);
if (ProductFinderModal.prototype.ctrlr) ProductFinderModal.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ProductFinderModal');
// Added by sephora-jsx-loader.js
ProductFinderModal.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ProductFinderModal.prototype.class = 'ProductFinderModal';
// Added by sephora-jsx-loader.js
ProductFinderModal.prototype.getInitialState = function() {
    ProductFinderModal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ProductFinderModal.prototype.render = wrapComponentRender(ProductFinderModal.prototype.render);
// Added by sephora-jsx-loader.js
var ProductFinderModalClass = React.createClass(ProductFinderModal.prototype);
// Added by sephora-jsx-loader.js
ProductFinderModalClass.prototype.classRef = ProductFinderModalClass;
// Added by sephora-jsx-loader.js
Object.assign(ProductFinderModalClass, ProductFinderModal);
// Added by sephora-jsx-loader.js
module.exports = ProductFinderModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/ProductFinderModal/ProductFinderModal.jsx