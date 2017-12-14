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
    Sephora.Util.InflatorComps.Comps['HeroMediaList'] = function HeroMediaList(){
        return HeroMediaListClass;
    }
}
const css = require('glamor').css;
const { Box, Image } = require('components/display');
const Carousel = require('components/Carousel/Carousel');
const Modal = require('components/Modal/Modal');
const BccVideo = require('components/Bcc/BccVideo/BccVideo');
const ProductImage = require('components/Product/ProductImage/ProductImage');
const skuUtils = require('utils/Sku');
const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;
const PanZoom = require('components/PanZoom/PanZoom');
const VirtualArtist = require('components/VirtualArtist/VirtualArtist');
const TryItOnButton = require('components/VirtualArtist/TryItOnButton/TryItOnButton');
const Loader = require('components/Loader/Loader');
const urlUtils = require('utils/Url');
const UIUtils = require('utils/UI');

const {
    colors, modal, shade, space, zIndex
} = require('style');

const THUMB_NAIL_GROUP_COUNT = 3;
const MEDIA_TYPE = {
    IMAGE: 'IMAGE',
    VIDEO: 'VIDEO',
    VIRTUAL_ARTIST: 'VIRTUAL_ARTIST'
};

const IMG_SIZE_MAX = IMAGE_SIZES[300];
const IMG_SIZE_ACTUAL = IMAGE_SIZES[450];
const IMG_SIZE_ZOOM = IMAGE_SIZES[1500];
const LOOP_THUMB_SIZE = 50;
const LOOP_SIZE = 500;
const LOOP_SCALE = IMG_SIZE_ZOOM / LOOP_SIZE;

const HeroMediaList = function () {
    this.state = {
        zoomModalImage: {},
        zoomable: true,
        isZoomModalOpen: false,
        heroThumbnailCarouselName: 'heroThumbnailCarousel',
        heroListCarouselName: 'heroListCarousel',
        mediaListComps: []
    };
};

HeroMediaList.prototype.MEDIA_TYPE = MEDIA_TYPE;

HeroMediaList.prototype.render = function () {
    this.mediaListItems = this.sortMediaItems();
    let isMobile = Sephora.isMobile();
    let zoomLoopCoords = this.getLoopCoords();
    let mediaListItemComponents = this.getMediaItems();
    let mediaListItemsThumbnails = this.getMediaItems(true);
    return (
        <Box
            position='relative'
            maxWidth={IMG_SIZE_MAX}
            marginX='auto'>
            <Carousel
                ref={carousel => this.heroListCarousel = carousel}
                name={this.state.heroListCarouselName}
                displayCount={1}
                totalItems={mediaListItemComponents.length}
                showArrows={false}
                preventScrollReset={true}
                showTouts={isMobile}>
                {mediaListItemComponents}
            </Carousel>
            {Sephora.isTouch &&
                <Modal
                    open={this.state.isZoomModalOpen}
                    width={modal.WIDTH.MD}
                    onDismiss={() => this.setState({ isZoomModalOpen: false })}>
                    <PanZoom
                        width='100%'
                        height={isMobile ? '100%' : modal.WIDTH.MD}>
                        <Loader isShown={true} />
                        <ProductImage
                            margin={isMobile ? 'auto' : modal.PADDING_FS}
                            disableLazyLoad={true}
                            skuImages={this.state.zoomModalImage}
                            size={IMG_SIZE_ZOOM} />
                    </PanZoom>
                </Modal>
            }
            {isMobile ||
                <div>
                    <Box
                        marginTop={space[2]}
                        marginBottom={space[5]}
                        fontSize='h5'
                        lineHeight={1}
                        minHeight={space[3]}
                        textAlign='center'>
                        {
                            this.state.zoomable ?
                                (Sephora.isTouch ? 'Tap' : 'Roll over') + ' image to zoom in' : ' '
                        }
                    </Box>
                    {this.mediaListItems.length > 1 &&
                    <Carousel
                        gutter={space[4]}
                        ref={carousel => this.heroThumbnailCarousel = carousel}
                        name={this.state.heroThumbnailCarouselName}
                        displayCount={THUMB_NAIL_GROUP_COUNT}
                        totalItems={mediaListItemComponents.length}
                        showArrows={true}
                        showTouts={false}
                        preventScrollReset={true}
                        isCenteredItems={THUMB_NAIL_GROUP_COUNT >
                        mediaListItemComponents.length}
                        hoverItemStyle={{ '& > div': { borderColor: colors.silver } }}
                        activeItemStyle={{ '& > div': { borderColor: colors.black } }}
                        fillTrailedGap={true}>
                        {mediaListItemsThumbnails}
                    </Carousel>
                    }
                    {this.state.isZoomLoopOpen &&
                    <div>
                        <Box
                            position='absolute'
                            top={-space[4]} left='100%'
                            marginLeft={space[6]}
                            zIndex={zIndex.MODAL}
                            overflow='hidden'
                            backgroundColor='white'
                            boxShadow={`3px 3px 20px ${shade[3]}`}>
                            <Loader isShown={true} />
                            <PanZoom
                                width={LOOP_SIZE}
                                height={LOOP_SIZE}
                                disableButtons={true}
                                scale={LOOP_SCALE}
                                x={zoomLoopCoords.x}
                                y={zoomLoopCoords.y}>
                                <ProductImage
                                    skuImages={this.state.zoomLoopImage}
                                    size={IMG_SIZE_ZOOM} />
                            </PanZoom>
                        </Box>
                        <svg>
                            <defs>
                                <mask id='heroHoverMediaMask'>
                                    <rect
                                        x={0} y={0}
                                        width={IMG_SIZE_MAX}
                                        height={IMG_SIZE_MAX}
                                        fill='#4d4d4d' />
                                    <rect
                                        x={this.state.zoomLoopCoords.x - LOOP_THUMB_SIZE}
                                        y={this.state.zoomLoopCoords.y - LOOP_THUMB_SIZE}
                                        width={LOOP_THUMB_SIZE * 2}
                                        height={LOOP_THUMB_SIZE * 2}
                                        fill='white' stroke='black' />
                                </mask>
                            </defs>
                        </svg>
                    </div>
                    }
                </div>
            }
        </Box>
    );
};

HeroMediaList.prototype.getLoopCoords = function () {
    if (this.state.isZoomLoopOpen) {
        let smallX = this.state.zoomLoopCoords.x;
        let smallY = this.state.zoomLoopCoords.y;
        let bigY = -(((smallY/IMG_SIZE_ACTUAL) * IMG_SIZE_ZOOM) - LOOP_SIZE);
        let bigX = -(((smallX/IMG_SIZE_ACTUAL) * IMG_SIZE_ZOOM) - LOOP_SIZE);
        return {
            x: bigX,
            y: bigY
        };
    }
    return null;
};

HeroMediaList.prototype.sortMediaItems = function () {
    let isMobile = Sephora.isMobile();
    let currentProduct = this.props.product;
    let {
        currentSku,
        hoveredSku,
        productVideos = []
    } = currentProduct;
    let {
        alternateImages = [],
        skuImages
    } = (hoveredSku || currentSku);

    // Hero Image
    let mediaListItems = skuImages ? [{
        type: MEDIA_TYPE.IMAGE, media: skuImages
    }] : [];

    // 2nd slot is for Sephora Virtual Artist, if enabled
    let {
        virtualArtist = {}
    } = this.props;
    if (virtualArtist.media && mediaListItems.length) {
        mediaListItems.push({
            type: MEDIA_TYPE.VIRTUAL_ARTIST,
            media: Object.assign({}, virtualArtist.media, {
                thumbAppliedMakeupImage: virtualArtist.appliedMakeupImage
            })
        });
        mediaListItems[0].showTryOnButton = true;
    }

    // Next slot is for First Product video (only for Desktop)
    productVideos = productVideos.slice();
    if (!isMobile && productVideos.length) {
        mediaListItems.push({
            type: MEDIA_TYPE.VIDEO, media: productVideos.splice(0, 1)[0]
        });
    }

    // All the Alt images go next
    alternateImages = alternateImages.slice();
    mediaListItems = mediaListItems.concat(alternateImages.map(item => {
        return {
            type: MEDIA_TYPE.IMAGE, media: item
        };
    }));

    // All the remaining videos
    mediaListItems = mediaListItems.concat(productVideos.map(item => {
        return {
            type: MEDIA_TYPE.VIDEO, media: item
        };
    }));

    return mediaListItems;
};

HeroMediaList.prototype.getMediaItems = function (isThumbnail) {
    let isMobile = Sephora.isMobile();

    // Determine if videos should be displayed on a modal or directly when clicked
    let showOverlayVideoOnMobile = this.props.showOverlayVideoOnMobile;
    let showOverlayVideo = showOverlayVideoOnMobile ? true : !isMobile;

    let getImage = (imageComponent, imageItem) => {
        return (
            <Box
                position='relative'
                height={0}
                overflow='hidden'
                paddingBottom='100%'>
                {
                    imageItem && imageItem.showTryOnButton && !isThumbnail ?
                        <Box
                            position='absolute'
                            top={space[4]}
                            right={space[4]}
                            zIndex={1}
                            onMouseEnter={e => this.enableZoom(false)}
                            onMouseLeave={e => this.enableZoom(true)} >
                            <TryItOnButton />
                        </Box> : null
                }
                {imageComponent}
            </Box>
        );
    };
    let getVideo = (item, index, key) => {
        return (
            <Box
                key={key}
                is='div'
                isVideo={true}
                onClick={() => {
                    this.sendAnalytics(MEDIA_TYPE.VIDEO, item);
                    if (showOverlayVideo) {
                        this.state.mediaListComps[index].openVideoModal();
                    }
                }
                }>
                <BccVideo
                    ref={bccVideo => this.state.mediaListComps[index] = bccVideo}
                    nested={true}
                    ooyalaId={item.filePath}
                    {...item} />
            </Box>
        );
    };
    let getThumbnail = function (thumbItem) {
        return (
            <Box
                position='relative'
                padding={1}
                border={3}
                rounded={7}
                borderColor='transparent'>
                <Box
                    overflow='hidden'
                    rounded={4}>
                    {thumbItem}
                </Box>
            </Box>
        );
    };

    return this.mediaListItems.map((arrItem, arrIndex) => {
        let item = Object.assign({}, arrItem.media),
            listItem;
        switch (arrItem.type) {
            case MEDIA_TYPE.IMAGE:
            default:
                let src = skuUtils.getImgSrc(IMAGE_SIZES[50], item);
                listItem = isThumbnail ?
                    getThumbnail(getImage(<Image
                        ref={image => this.state.mediaListComps[arrIndex] = image}
                        display='block'
                        position='absolute'
                        top={0} left={0}
                        width='100%' height='100%'
                        /* TODO: increase size after akamai image manager is in place */
                        src={src}
                        disableLazyLoad={true}/>)) :
                    getImage(isMobile ?
                        <ProductImage
                            isPageRenderImg={arrIndex === 0 && !isThumbnail ? true : false}
                            skuImages={item}
                            size={IMG_SIZE_ACTUAL}
                            disableLazyLoad={true}/>
                        :
                        this.getSVGImageForDesktop(item, (arrIndex === 0 && !isThumbnail)),
                            arrItem, src
                    );
                break;
            case MEDIA_TYPE.VIRTUAL_ARTIST:
                listItem = isThumbnail ?
                    getThumbnail(getImage(<Image
                        ref={image => this.state.mediaListComps[arrIndex] = image}
                        display='block'
                        position='absolute'
                        top={0} left={0}
                        width='100%' height='100%'
                        src={(item.thumbAppliedMakeupImage &&
                            item.thumbAppliedMakeupImage.imageData) ||
                            skuUtils.getImgSrc(IMAGE_SIZES[62], item)}
                        disableLazyLoad={true}/>)) :
                    getImage(<VirtualArtist
                        product={this.props.product}/>);
                break;
            case MEDIA_TYPE.VIDEO:
                item.thumbnailWidth = '100%';
                item.thumbnailRatio = isThumbnail ? 1 : 9 / 16;
                item.overlayFlag = showOverlayVideo;
                item.hideDescription = isThumbnail;
                listItem = isThumbnail ? getThumbnail(getVideo(item, arrIndex)) :
                    getVideo(item, arrIndex, item.filePath);
                break;
        }
        
        return listItem;
        
    });
};

HeroMediaList.prototype.getSVGImageForDesktop = function (item, includePerfMark) {
    let src = urlUtils.getImagePath(skuUtils.getImgSrc(IMG_SIZE_ACTUAL, item));
    let IEVersion = UIUtils.detectIEVersion();
    let onLoadPerfMark = includePerfMark ?
        "onload=\"" +
        // "console.log('Onload Image Load Triggered'); " +
        "Sephora.Util.Perf.markPageRenderDedup(this);\"}"
        : ""
    let inPagePerfMark = includePerfMark ?
        "<script>" +
        // "console.log('Script Image Load Triggered'); " +
        "Sephora.Util.Perf.report('Page Rendered', true);</script>"
        : ""
    return IEVersion && IEVersion < 15 ? <svg
        width={IMG_SIZE_MAX}
        height={IMG_SIZE_MAX}
        className={css({ pointerEvents: 'none' })}>
        <image style={{ mask: 'url(#heroHoverMediaMask)' }}
        width={IMG_SIZE_MAX} height={IMG_SIZE_MAX}
        src={src}
        href={src}/>
    </svg> : <svg
        width={IMG_SIZE_MAX}
        height={IMG_SIZE_MAX}
        className={css({ pointerEvents: 'none' })}
        dangerouslySetInnerHTML={{
            __html: '<image style="mask: url(#heroHoverMediaMask)" ' +
            'width="' + IMG_SIZE_MAX + '" height="' + IMG_SIZE_MAX +
            '" xlink:href="' + src + '" ' + onLoadPerfMark + '/>' + inPagePerfMark
        }} />;
};


// Added by sephora-jsx-loader.js
HeroMediaList.prototype.path = 'ProductPage/HeroMediaList';
// Added by sephora-jsx-loader.js
Object.assign(HeroMediaList.prototype, require('./HeroMediaList.c.js'));
var originalDidMount = HeroMediaList.prototype.componentDidMount;
HeroMediaList.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: HeroMediaList');
if (originalDidMount) originalDidMount.apply(this);
if (HeroMediaList.prototype.ctrlr) HeroMediaList.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: HeroMediaList');
// Added by sephora-jsx-loader.js
HeroMediaList.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
HeroMediaList.prototype.class = 'HeroMediaList';
// Added by sephora-jsx-loader.js
HeroMediaList.prototype.getInitialState = function() {
    HeroMediaList.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
HeroMediaList.prototype.render = wrapComponentRender(HeroMediaList.prototype.render);
// Added by sephora-jsx-loader.js
var HeroMediaListClass = React.createClass(HeroMediaList.prototype);
// Added by sephora-jsx-loader.js
HeroMediaListClass.prototype.classRef = HeroMediaListClass;
// Added by sephora-jsx-loader.js
Object.assign(HeroMediaListClass, HeroMediaList);
// Added by sephora-jsx-loader.js
module.exports = HeroMediaListClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/HeroMediaList/HeroMediaList.jsx