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
    Sephora.Util.InflatorComps.Comps['BccImage'] = function BccImage(){
        return BccImageClass;
    }
}
const css = require('glamor').css;
const site = require('style').site;
const { Box, Image } = require('components/display');
const urlUtils = require('utils/Url');
const trackNavClick = require('analytics/bindingMethods/pages/all/navClickBindings').trackNavClick;

var BccImage = function () {
    this.state = {
        hover: false
    };
};

BccImage.prototype.render = function () {
    let {
        name,
        nested,
        altText,
        width,
        height,
        imagePath,
        imageId,
        secondaryImagePath,
        targetScreen,
        children,
        modalComponentTemplate,
        hotSpots,
        parentTitle,
        contextualParentTitles,
        isTopNav,
        disableLazyLoad,
        ...props
    } = this.props;

    const withRatio = width && height;

    const imageAttrs = {
        useMap: hotSpots ? '#' + name : null,
        alt: altText ? altText : null,
        _css: withRatio ? {
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            bottom: 0,
            left: 0
        } : {
            maxWidth: '100%',
            marginLeft: 'auto',
            marginRight: 'auto'
        }
    };

    const outdent = Sephora.isMobile() && !nested ? -site.PADDING_MW : null;

    let anaNavPath = function () {
        let path = [parentTitle, 'image'];
        if (isTopNav) {
            path.unshift('top nav');
        }

        return path;
    };

    let imgTargetUrl = null;
    if (targetScreen) {
        if (targetScreen.targetUrl.indexOf('icid2') === -1) {
            imgTargetUrl = urlUtils.addInternalTracking(targetScreen.targetUrl, [name]);
        } else {
            imgTargetUrl = targetScreen.targetUrl;
        }
    }

    return (
        <Box marginX={outdent}>
            <Box
                href={urlUtils.getLink(imgTargetUrl)}
                title={targetScreen && altText ? altText : null}
                target={targetScreen && targetScreen.targetWindow === 1 ?
                    '_blank' : null}
                rel={targetScreen && targetScreen.targetWindow === 1 ?
                    'noopener' : null}
                onMouseEnter={secondaryImagePath ? this.toggleHover : null}
                onMouseLeave={secondaryImagePath ? this.toggleHover : null}
                onClick={imgTargetUrl || modalComponentTemplate ? (e) => {
                    if (parentTitle) {
                        trackNavClick(anaNavPath());
                    } else if (contextualParentTitles) {
                        trackNavClick(contextualParentTitles.concat(['image']));
                    }

                    if (modalComponentTemplate) {
                        e.preventDefault();
                        this.toggleOpen(modalComponentTemplate);
                    }
                } : null}

                marginX='auto'
                position='relative'
                maxWidth='100%'
                style={{
                    width: width
                }}>

                {withRatio &&
                    <Box
                        style={{
                            paddingBottom: `${height / width * 100}%`
                        }} />
                }

                <Image
                    data-at={Sephora.debug.dataAt('bcc_image_' + name)}
                    disableLazyLoad={isTopNav || disableLazyLoad}
                    src={imagePath}
                    {...imageAttrs}
                    id={imageId}
                    style={{
                        display: this.state.hover ? 'none' : 'block'
                    }} />

                {secondaryImagePath && !Sephora.isTouch &&
                    <Image
                        disableLazyLoad={isTopNav || disableLazyLoad}
                        src={secondaryImagePath}
                        {...imageAttrs}
                        style={{
                            display: this.state.hover ? 'block' : 'none'
                        }} />
                }

                {hotSpots &&
                    <map name={name}>
                        {hotSpots.map((hotSpot, index) =>
                            <area
                                key={index}
                                className={css({
                                    outline: 'none'
                                })}
                                shape={hotSpot.hotSpotShape}
                                coords={hotSpot.hotSpotCords}
                                alt={hotSpot.altText}
                                href={urlUtils.addInternalTracking(
                                    hotSpot.targetScreen.targetUrl,
                                    [hotSpot.hotSpotName]
                                )}
                                target={hotSpot.targetScreen.targetWindow === 1 ?
                                    '_blank' : null}
                                rel={hotSpot.targetScreen.targetWindow === 1 ?
                                    'noopener' : null} />
                        )}
                    </map>
                }
            </Box>
        </Box>
    );
};


// Added by sephora-jsx-loader.js
BccImage.prototype.path = 'Bcc/BccImage';
// Added by sephora-jsx-loader.js
Object.assign(BccImage.prototype, require('./BccImage.c.js'));
var originalDidMount = BccImage.prototype.componentDidMount;
BccImage.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BccImage');
if (originalDidMount) originalDidMount.apply(this);
if (BccImage.prototype.ctrlr) BccImage.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BccImage');
// Added by sephora-jsx-loader.js
BccImage.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BccImage.prototype.class = 'BccImage';
// Added by sephora-jsx-loader.js
BccImage.prototype.getInitialState = function() {
    BccImage.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BccImage.prototype.render = wrapComponentRender(BccImage.prototype.render);
// Added by sephora-jsx-loader.js
var BccImageClass = React.createClass(BccImage.prototype);
// Added by sephora-jsx-loader.js
BccImageClass.prototype.classRef = BccImageClass;
// Added by sephora-jsx-loader.js
Object.assign(BccImageClass, BccImage);
// Added by sephora-jsx-loader.js
module.exports = BccImageClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Bcc/BccImage/BccImage.jsx