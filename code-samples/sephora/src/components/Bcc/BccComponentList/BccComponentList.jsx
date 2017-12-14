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
    Sephora.Util.InflatorComps.Comps['BccComponentList'] = function BccComponentList(){
        return BccComponentListClass;
    }
}
const { space } = require('style');

// IMPORTANT: Do not include BccComponentList in any asyncRender components.  Doing so will force
// it and all subcomponents to be included in the priority bundle

// BccComponentList dependencies need to be required in its constructor function
// because many of its dependency are also dependent upon it. This ensures that
// BccComponentList is exported before its referenced in one of its dependencies.
let BccStyleWrapper;
let BccImage;
let BccGrid;
let BccCarousel;
let BccLink;
let BccLinkGroup;
let BccLinkGroupTopNav;
let BccMarkdown;
let BccSlideshow;
let BccTargeter;
let BccVideo;
let BccProductFinder;
let Base;
let TestTarget;
let Html;

let BccComponentList = function () {
    BccStyleWrapper = require('components/Bcc/BccStyleWrapper/BccStyleWrapper');
    BccImage = require('components/Bcc/BccImage/BccImage');
    BccGrid = require('components/Bcc/BccGrid/BccGrid');
    BccCarousel = require('components/Bcc/BccCarousel/BccCarousel');
    BccLink = require('components/Bcc/BccLink/BccLink');
    BccLinkGroup = require('components/Bcc/BccLinkGroup/BccLinkGroup');
    BccLinkGroupTopNav = require('components/Bcc/BccLinkGroup/BccLinkGroupTopNav');
    BccMarkdown = require('components/Bcc/BccMarkdown/BccMarkdown');
    BccSlideshow = require('components/Bcc/BccSlideshow/BccSlideshow');
    BccTargeter = require('components/Bcc/BccTargeter/BccTargeter');
    BccVideo = require('components/Bcc/BccVideo/BccVideo');
    BccProductFinder = require('components/Bcc/BccProductFinder/BccProductFinder');
    Base = require('components/Base/Base');
    TestTarget = require('components/TestTarget/TestTarget');
    Html = require('components/Html/Html');

    this.carouselIndex = 0;
};

const COMPONENT_NAMES = require('utils/BCC').COMPONENT_NAMES;

const process = function (comps, nested, isTopNav, parentTitle, self) {
    const componentList = comps && comps.map((bccComp, index) => {
        let comp;

        /*
         * This is used to pass additional properties to components
         * which could be used for styling based on place they are needed
         * for example persistent banner
         */
        if (typeof self.props.propsCallback !== 'undefined') {
            if (COMPONENT_NAMES.TARGETER === bccComp.componentType) {
                Object.assign(bccComp, {
                    propsCallback: self.props.propsCallback
                });
            } else if (typeof bccComp.propsCallback !== 'undefined') {
                Object.assign(bccComp, bccComp.propsCallback(bccComp.componentType));
            } else if (typeof self.props.propsCallback === 'function') {
                Object.assign(bccComp, self.props.propsCallback(bccComp.componentType));
            }
        }

        /*eslint-disable no-case-declarations*/
        switch (bccComp.componentType) {
            case COMPONENT_NAMES.IMAGE:
                comp =
                    <BccImage
                        nested={nested}
                        isTopNav={isTopNav}
                        parentTitle={parentTitle}
                        contextualParentTitles={self.props.contextualParentTitles}
                        {...bccComp} />;
                break;
            case COMPONENT_NAMES.REWARDS_CAROUSEL:
            case COMPONENT_NAMES.CAROUSEL:
                const carouselItems = bccComp.skus || bccComp.biRewards || [];
                const carouselMaxItems = bccComp.carouselMaxSkus || carouselItems.length;
                const isEnableCircle = bccComp.isEnableCircle ?
                    bccComp.isEnableCircle :
                    bccComp.enableCircle ? bccComp.enableCircle : false;
                const carouselImageSize = bccComp.carouselImageSize || bccComp.skuImageSize;
                comp = <BccCarousel
                    totalItems={carouselItems.length}
                    isEnableCircle={isEnableCircle}
                    carouselImageSize={carouselImageSize}
                    carouselItems={carouselItems}
                    nested={nested}
                    carouselIndex={!nested ? self.carouselIndex += 1 : null}
                    lazyLoad='img'
                    {...bccComp} />;
                break;
            case COMPONENT_NAMES.GRID:

                /* TODO: API Team named title property like imageTitle,
                    this is due to change in 17.1*/
                comp = bccComp.components &&
                    <BccGrid
                        cols={Sephora.isMobile() ?
                            bccComp.mWebColumns : bccComp.desktopColumns}
                        parentTitle={parentTitle}
                        nested={true}
                        isTopNav={isTopNav}
                        lazyLoad='img'
                        {...bccComp} />;
                break;
            case COMPONENT_NAMES.LINK_GROUP:
                if (isTopNav) {
                    comp = bccComp.links &&
                        <BccLinkGroupTopNav
                            parentTitle={parentTitle}
                            contextualParentTitles={self.props.contextualParentTitles}
                            {...bccComp} />;
                } else {
                    comp = bccComp.links &&
                        <BccLinkGroup
                            nested={nested}
                            {...bccComp} />;
                }

                break;
            case COMPONENT_NAMES.PRODUCT_FINDER:
                comp =
                    <BccProductFinder
                        nested={nested}
                        {...bccComp } />;
                break;
            case COMPONENT_NAMES.LINK:
                const linkAttrs = {
                    url: bccComp.targetScreen.targetUrl,
                    target: bccComp.targetScreen.targetWindow,
                    title: bccComp.altText,
                    text: bccComp.displayTitle,
                    icid2: bccComp.icid2,
                    modalTemplate: bccComp.modalComponentTemplate,
                    componentName: bccComp.componentName
                };
                if (isTopNav) {
                    comp =
                        <BccLink
                            fontWeight={700}
                            paddingY={space[2]}
                            marginTop={-space[2]}
                            marginBottom={space[4]}
                            hoverColor='gray'
                            anaNavPath={['top nav', parentTitle, bccComp.displayTitle]}
                            {...linkAttrs} />;
                } else {
                    comp =
                        <BccLink
                            {...bccComp}
                            {...linkAttrs} />;
                }

                break;
            case COMPONENT_NAMES.MARKDOWN:
                comp =
                    <BccMarkdown
                        {...bccComp} />;
                break;
            case COMPONENT_NAMES.SLIDESHOW:
                comp = bccComp.images &&
                    <BccSlideshow
                        nested={nested}
                        lazyLoad='img'
                        {...bccComp} />;
                break;
            case COMPONENT_NAMES.VIDEO:
                comp =
                    <BccVideo
                        nested={nested}
                        ooyalaId={bccComp.filePath}
                        {...bccComp} />;
                break;
            case COMPONENT_NAMES.TARGETER:
                comp =
                    <BccTargeter
                        nested={nested}
                        {...bccComp} />;
                break;
            case COMPONENT_NAMES.HTML:
                comp =
                    <Html
                        content={bccComp.text} />;
                break;
            default:
                break;
        }

        if (bccComp.enableTesting) {
            comp = comp && <TestTarget
                key={index}
                isTopNav={isTopNav}
                testComponent={comp.type.prototype.class}
                testEnabled
                isBcc
                {...comp.props} />;
        } else {
            comp = comp && <BccStyleWrapper
                key={index}
                isTopNav={isTopNav}
                customStyle={bccComp.styleList}>
                {comp}
            </BccStyleWrapper>;
        }

        return comp;
    });

    return componentList;
};

BccComponentList.prototype.render = function () {
    const {
        items,
        nested,
        isTopNav,
        parentTitle,
        propsCallback,
        disableLazyLoadCount = null,
        ...props
    } = this.props;

    if (disableLazyLoadCount) {
        let contentLength = items.length;
        let max = disableLazyLoadCount <= contentLength ? disableLazyLoadCount : contentLength;
        for (let i = 0; i < max; i++) {
            items[i].disableLazyLoad = true;
        }
    }

    const componentList = process(items, nested, isTopNav, parentTitle, this);

    return (
        <Base {...props}>
            {componentList}
        </Base>
    );
};


// Added by sephora-jsx-loader.js
BccComponentList.prototype.path = 'Bcc/BccComponentList';
// Added by sephora-jsx-loader.js
BccComponentList.prototype.class = 'BccComponentList';
// Added by sephora-jsx-loader.js
BccComponentList.prototype.getInitialState = function() {
    BccComponentList.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BccComponentList.prototype.render = wrapComponentRender(BccComponentList.prototype.render);
// Added by sephora-jsx-loader.js
var BccComponentListClass = React.createClass(BccComponentList.prototype);
// Added by sephora-jsx-loader.js
BccComponentListClass.prototype.classRef = BccComponentListClass;
// Added by sephora-jsx-loader.js
Object.assign(BccComponentListClass, BccComponentList);
// Added by sephora-jsx-loader.js
module.exports = BccComponentListClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Bcc/BccComponentList/BccComponentList.jsx