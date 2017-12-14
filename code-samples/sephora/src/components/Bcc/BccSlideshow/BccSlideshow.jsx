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
    Sephora.Util.InflatorComps.Comps['BccSlideshow'] = function BccSlideshow(){
        return BccSlideshowClass;
    }
}
const { media } = require('glamor');
const { breakpoints, site } = require('style');
const Box = require('components/Box/Box');
let Carousel = require('components/Carousel/Carousel');
let BccComponentList = require('components/Bcc/BccComponentList/BccComponentList');

let BccSlideshow = function () { };

BccSlideshow.prototype.render = function () {
    const {
        nested,
        children,
        delay,
        enableCarouselCircle,
        disableLazyLoad = false,
        ...props
    } = this.props;

    const isMobile = Sephora.isMobile();
    const isDesktop = Sephora.isDesktop();

    const autoStart = this.props.autoStart ? this.props.autoStart : null;
    const widescreen = isDesktop && !nested;
    const carouselMaxItems = this.props.images.length;
    let images = this.props.images.map(image => {
        image.disableLazyLoad = disableLazyLoad;
        return <BccComponentList
            items={[image]}
            nested={true} />;
    });

    if (enableCarouselCircle) {
        images.push(images[0]);
    }

    return (
        <Box
            data-lload={this.props.lazyLoad}
            _css={[
                nested || {
                    marginLeft: isMobile ? -site.PADDING_MW : -site.PADDING_FS,
                    marginRight: isMobile ? -site.PADDING_MW : -site.PADDING_FS
                },
                widescreen && media(breakpoints.LG, {
                    width: '100vw',
                    position: 'relative',
                    left: '50%',
                    marginLeft: '-50vw',
                    marginRight: 'auto'
                })
            ]}>
            <Box
                marginX='auto'
                maxWidth='100%'
                style={{
                    width: this.props.width
                }}>
                <Box
                    marginX='auto'
                    maxWidth={isDesktop ? site.MAX_WIDTH : null}>
                    <Carousel
                        slideshow={true}
                        autoStart={isMobile ? 1 : autoStart}
                        displayCount={1}
                        isEnableCircle={enableCarouselCircle}
                        totalItems={carouselMaxItems}
                        delay={delay}
                        controlHeight='auto'
                        isCenteredControls={true}
                        {...props}>
                        {images}
                    </Carousel>
                </Box>
            </Box>
        </Box>
    );
};


// Added by sephora-jsx-loader.js
BccSlideshow.prototype.path = 'Bcc/BccSlideshow';
// Added by sephora-jsx-loader.js
Object.assign(BccSlideshow.prototype, require('./BccSlideshow.c.js'));
var originalDidMount = BccSlideshow.prototype.componentDidMount;
BccSlideshow.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BccSlideshow');
if (originalDidMount) originalDidMount.apply(this);
if (BccSlideshow.prototype.ctrlr) BccSlideshow.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BccSlideshow');
// Added by sephora-jsx-loader.js
BccSlideshow.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BccSlideshow.prototype.class = 'BccSlideshow';
// Added by sephora-jsx-loader.js
BccSlideshow.prototype.getInitialState = function() {
    BccSlideshow.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BccSlideshow.prototype.render = wrapComponentRender(BccSlideshow.prototype.render);
// Added by sephora-jsx-loader.js
var BccSlideshowClass = React.createClass(BccSlideshow.prototype);
// Added by sephora-jsx-loader.js
BccSlideshowClass.prototype.classRef = BccSlideshowClass;
// Added by sephora-jsx-loader.js
Object.assign(BccSlideshowClass, BccSlideshow);
// Added by sephora-jsx-loader.js
module.exports = BccSlideshowClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Bcc/BccSlideshow/BccSlideshow.jsx