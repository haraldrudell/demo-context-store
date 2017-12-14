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
    Sephora.Util.InflatorComps.Comps['BccVideo'] = function BccVideo(){
        return BccVideoClass;
    }
}
const css = require('glamor').css;
const { site, modal, space } = require('style');
const { Box, Grid, Image } = require('components/display');

const Embed = require('components/Embed/Embed');
const Modal = require('components/Modal/Modal');
const Link = require('components/Link/Link');
const IconPlay = require('components/Icon/IconPlay');

const ooyala = require('utils/ooyala');
const urlUtils = require('utils/Url');

const BccVideo = function () {
    this.state = {
        isOpen: false,
        thumbnail: null
    };

    this.playerParam = {
        pcode: ooyala.pcode,
        playerBrandingId: ooyala.playerBrandingId,
        skin: { config: ooyala.external.config }
        //omniture: ooyala.omniture
    };
};

BccVideo.prototype.render = function () {
    if (!this.state.id) {
        return null;
    }

    const {
        name,
        ooyalaId,
        overlayFlag,
        style,
        startImagePath,
        thumbnailWidth = '100%',
        thumbnailRatio,
        videoTitle,
        videoSubHead,
        targetUrl,
        width,
        nested,
        disableLazyLoad = false,
        ...props
    } = this.props;

    const imageSrc = startImagePath || this.state.thumbnail || null;

    /* Remove intial growth transition */
    css.global('.oo-player', { transition: 'none !important' });
    /* 1. hide title/info text overlay */
    /* 2. reset ooyala min width of `320px` */
    css.global('.oo-state-screen-info', { display: 'none !important' });
    css.global('.oo-player-container', { minWidth: '0 !important' });

    const video =
        <Embed
            ratio={9 / 16}
            // make sure no nested ooyala indexes exceed ours
            zIndex={0}>
            <div
                id={this.state.id}
                onClick={this.trackPlay} />
        </Embed>;
    this.video = video;
    const targetUrlWithTracking = urlUtils.addInternalTracking(
        targetUrl, [name, 'shop-now']
    );

    return (
        <Box
            className={ style && style.classes ? style.classes : null }>
            {overlayFlag
                ?
                <Box textAlign='center'>
                    <Box
                        position='relative'
                        onClick={this.openVideoModal}
                        marginX='auto'
                        maxWidth='100%'
                        style={{
                            width: thumbnailWidth
                        }}>
                        {thumbnailRatio ?
                            <Box
                                backgroundPosition='center'
                                backgroundSize='cover'
                                style={{
                                    backgroundImage: 'url("' + imageSrc + '")',
                                    paddingBottom: `${thumbnailRatio * 100}%`
                                }} />
                        :
                            <Image
                                display='block'
                                src={imageSrc}
                                width={thumbnailWidth}
                                disableLazyLoad={disableLazyLoad} />
                        }
                        <Box
                            position='absolute'
                            top={0} left={0}
                            width='100%' height='100%'
                            backgroundColor='rgba(0,0,0,.25)'>
                            <IconPlay
                                color='white'
                                width='40%' height='40%'
                                position='absolute'
                                top='30%' left='30%' />
                        </Box>
                    </Box>
                    {this.getVideoDescription(targetUrlWithTracking)}
                </Box>
                :
                <Box
                    marginX='auto'
                    maxWidth='100%'
                    style={{
                        width: width
                    }}>
                    <Box
                        marginX={Sephora.isMobile() && !nested ?
                            -site.PADDING_MW : null}>
                        <Box
                            marginX='auto'
                            maxWidth='100%'
                            style={{
                                width: width
                            }}>
                            <div ref={(videoWrapper) => this.videoWrapper = videoWrapper}>
                                {video}
                            </div>
                        </Box>
                    </Box>
                    {this.getVideoDescription(targetUrlWithTracking)}
                </Box>
            }
        </Box>
    );
};

BccVideo.prototype.getVideoDescription = function (targetUrlWithTracking) {
    const {
        videoTitle,
        videoSubHead,
        targetUrl,
        hideDescription
    } = this.props;
    return (!hideDescription && (videoTitle || videoSubHead || targetUrl)) &&
        <Grid
            alignItems='center'
            justifyContent='flex-end'
            lineHeight={2}
            gutter={space[4]}
            marginTop={space[3]}>
            <Grid.Cell width='fill'>
                {videoTitle && <Box fontWeight={700}>{videoTitle}</Box>}
                {videoSubHead && videoSubHead}
            </Grid.Cell>
            <Grid.Cell width='fit'>
                {targetUrlWithTracking &&
                <Link
                    href={targetUrlWithTracking}
                    arrowDirection='right'
                    padding={space[2]}
                    margin={-space[2]}>
                    Shop now
                </Link>
                }
            </Grid.Cell>
        </Grid>;
};


// Added by sephora-jsx-loader.js
BccVideo.prototype.path = 'Bcc/BccVideo';
// Added by sephora-jsx-loader.js
Object.assign(BccVideo.prototype, require('./BccVideo.c.js'));
var originalDidMount = BccVideo.prototype.componentDidMount;
BccVideo.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BccVideo');
if (originalDidMount) originalDidMount.apply(this);
if (BccVideo.prototype.ctrlr) BccVideo.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BccVideo');
// Added by sephora-jsx-loader.js
BccVideo.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BccVideo.prototype.class = 'BccVideo';
// Added by sephora-jsx-loader.js
BccVideo.prototype.getInitialState = function() {
    BccVideo.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BccVideo.prototype.render = wrapComponentRender(BccVideo.prototype.render);
// Added by sephora-jsx-loader.js
var BccVideoClass = React.createClass(BccVideo.prototype);
// Added by sephora-jsx-loader.js
BccVideoClass.prototype.classRef = BccVideoClass;
// Added by sephora-jsx-loader.js
Object.assign(BccVideoClass, BccVideo);
// Added by sephora-jsx-loader.js
module.exports = BccVideoClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Bcc/BccVideo/BccVideo.jsx