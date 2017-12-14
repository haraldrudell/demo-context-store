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
    Sephora.Util.InflatorComps.Comps['Carousel'] = function Carousel(){
        return CarouselClass;
    }
}
const { colors, space } = require('style');
const { Box, Flex } = require('components/display');
const Arrow = require('components/Arrow/Arrow');
const Hammer = require('react-hammerjs');

const Carousel = function () {
    this.state = {
        page: 1,
        numberOfPages: Math.ceil(this.props.totalItems / this.props.displayCount),
        visibleArea: 0,
        scrollEnd: 0,
        posX: 0,
        isResize: false,
        currentActiveItem: 0,
        currentHoverItem: -1
    };
    this.ARROWS = {
        NEXT: 'next',
        PREV: 'prev'
    };
};

/** props for Carousel
  * slideshow: boolean; display as a slideshow for styling reasons
  * showArrows: boolean; display the side arrows
  * gutter: number; space inbetween carousel items
  * REQUIRED displayCount: number; how many items to display in a slide
  * flex: boolean; display the carousel item as flex
  * controlHeight: number; sets height of control arrows
  * controlWidth: number; sets width of control arrows (not slideshow)
  * controlStyles: object; custom control arrow styles
  * isCenteredControls: boolean; center arrows vertically
  * isCenteredItems: boolean; center carousel items horizontally
  * isEnableCircle: boolean, will circulate slides
  * REQUIRED children: either singlular component or array of components; items to be displayed
  * showTouts: boolean, circles at the bottom of slides that allow for switching between slides
  * REQUIRED totalItems: number; total items in carousel
  * delay: number; if slideshow and isEnableCircle enabled, will auto change slides based on delay
*/

Carousel.prototype.render = function () {
    let {
        slideshow,
        showArrows,
        gutter,
        displayCount,
        flex,
        controlHeight = '100%',
        controlWidth = space[6],
        controlStyles,
        isCenteredControls,
        isCenteredItems,
        children,
        totalItems,
        showTouts
    } = this.props;

    const isMobile = Sephora.isMobile();

    showTouts = showTouts && totalItems > displayCount;

    let touts;
    if (showTouts) {
        let pages = [];
        for (let i = 1; i <= this.state.numberOfPages; i++) {
            const dotSize = isMobile ? 8 : 10;
            let child = children[i - 1];
            let isVideo = child.props.isVideo;
            let disabled = i === this.state.page;
            pages.push(
                <Box
                    marginX={3}
                    disabled={disabled}
                    lineHeight={0}
                    transition='opacity .2s'
                    onClick={() => this.moveTo(i)}
                    _css={!slideshow ? {
                        opacity: 0.1,
                        ':disabled': { opacity: 1 }
                    } : {}}>
                    {isVideo ?
                        <Arrow
                            fontSize={dotSize + 5}
                            marginLeft={2}
                            direction='right' />
                        :
                        <Box
                            circle={true}
                            width={dotSize}
                            height={dotSize}
                            _css={slideshow ? {
                                borderWidth: 1,
                                borderColor: colors.white,
                                boxShadow: '0 0 4px rgba(0,0,0,.5)',
                                ':disabled &': {
                                    backgroundColor: colors.white
                                }
                            } : {
                                backgroundColor: colors.black
                            }} />
                        }
                </Box>
            );
        }
        touts = (
            <Flex
                alignItems='center'
                justifyContent='center'
                _css={slideshow ? {
                    position: 'absolute',
                    right: 0,
                    bottom: space[2],
                    left: 0
                } : { marginTop: space[5] }}>
                {pages}
            </Flex>
        );
    }

    const controlStyle = (nav) => [
        {
            fontSize: 36,
            lineHeight: 0,
            height: controlHeight,
            overflow: 'hidden',
            position: 'absolute',
            textAlign: nav === this.ARROWS.PREV ? 'left' : 'right',
            left: nav === this.ARROWS.PREV ? 0 : null,
            right: nav === this.ARROWS.NEXT ? 0 : null,
            '&:disabled': { color: colors.lightGray },
            '&:not(:disabled):hover': { color: colors.midGray },
            '& > svg': {
                width: '.5em',
                height: '1em',
                fill: 'currentColor'
            }
        },
        slideshow ? {
            backgroundColor: colors.white,
            padding: space[3]
        } : {
            top: 0,
            width: controlWidth
        },
        isCenteredControls && {
            top: '50%',
            transform: 'translate(0, -50%)'
        },
        (slideshow ||
        (totalItems <= displayCount)) && { '&:disabled': { visibility: 'hidden' } },
        controlStyles
    ];

    const isControlDisabled = (nav) => ((nav === 'prev' && (this.state.page === 1))
        || (nav === 'next' && (this.state.page === this.state.numberOfPages)))
        && !this.props.isEnableCircle;

    const ItemComp = flex ? Flex : Box;
    const itemGutter = gutter ? (gutter / 2) : null;
    const items = React.Children.map(children, (child, index) =>
        <ItemComp
            is='div'
            _css={[
                this.props.itemStyle,
                (!Sephora.isTouch && index === this.state.currentHoverItem) &&
                    this.props.hoverItemStyle,
                index === this.state.currentActiveItem && this.props.activeItemStyle
            ]}
            key={this.getChildKey(child, index)}
            paddingX={gutter ? (gutter / 2) : null}
            flexShrink={0}
            onClick={e => this.updateCurrentActiveItem(e, index)}
            onMouseEnter={e => this.toggleHover(e, index)}
            onMouseLeave={e => this.toggleHover(e, index)}
            onMouseMove={e => this.toggleMoveOver(e, index)}
            style={{
                width: (displayCount ? 1 / displayCount * 100 : 100) + '%'
            }}>
            {child}
        </ItemComp>);
    /* eslint max-len: [2, 275] */
    return (
        <div
            data-lload={this.props.lazyLoad}
            onTouchStart={isMobile ? this.handleMouseEnter : null}
            onMouseEnter={!isMobile ? this.handleMouseEnter : null}>
            <Box
                position='relative'
                paddingX={showArrows && !slideshow ? controlWidth : null}>
                <Box
                    position='relative'
                    overflow='hidden'>
                    <Hammer
                        onSwipe={this.handleSwipe}
                        options={{
                            recognizers: {
                                swipe: { enable: Sephora.isTouch },
                                pan: { enable: false },
                                press: { enable: false },
                                tap: { enable: false }
                            }
                        }}>
                        <Box
                            display='flex'
                            marginX={gutter ? -(gutter / 2) : null}
                            justifyContent={isCenteredItems ? 'center' : null}
                            style={{
                                transform: 'translate3d(' + this.state.posX + 'px, 0, 0)',
                                WebkitTransform: 'translate3d(' + this.state.posX + 'px, 0, 0)',
                                transition: 'transform ' + (this.state.isResize ? '0ms' : '300ms'),
                                WebkitTransition: 'transform ' + (
                                    this.state.isResize ? '0ms' : '300ms'
                                )
                            }}
                            baseRef={(carousel) => this.carousel = carousel}>
                            {items}
                        </Box>
                    </Hammer>
                </Box>
                {
                    showArrows &&
                    <div>
                        <Box
                            _css={controlStyle(this.ARROWS.PREV)}
                            onClick={this.previousPage}
                            data-at={Sephora.debug.dataAt('carousel_prev')}
                            disabled={isControlDisabled(this.ARROWS.PREV)}>
                            <svg viewBox='0 0 16 32'>
                                <path d='M2.2 16.052l13.5-14.33c.1-.098.3-.397.3-.695 0-.498-.4-.995-.9-.995-.3 0-.5.2-.6.298L.4 15.256c-.2.298-.4.497-.4.796 0 .298.1.398.2.497l.1.1L14.5 31.67c.1.1.3.3.6.3.5 0 .9-.5.9-.996 0-.3-.2-.498-.3-.697L2.2 16.05z' />
                            </svg>
                        </Box>
                        <Box
                            _css={controlStyle(this.ARROWS.NEXT)}
                            onClick={this.nextPage}
                            data-at={Sephora.debug.dataAt('carousel_next')}
                            disabled={isControlDisabled(this.ARROWS.NEXT)}>
                            <svg viewBox='0 0 16 32'>
                                <path d='M13.8 15.952L.3 30.28c-.1.1-.3.398-.3.697 0 .497.4.995.9.995.3 0 .5-.2.6-.3L15.6 16.75c.2-.298.4-.497.4-.796 0-.298-.1-.398-.2-.497l-.1-.1L1.5.33C1.4.23 1.2.032.9.032c-.5 0-.9.497-.9.995 0 .298.2.497.3.696l13.5 14.23z' />
                            </svg>
                        </Box>
                    </div>
                }
                {(showTouts && slideshow) && touts}
            </Box>
            {(showTouts && !slideshow) && touts}
        </div>
    );
};

Carousel.prototype.getChildKey = function (child, index) {
    return (child && child.key) || index;
};


// Added by sephora-jsx-loader.js
Carousel.prototype.path = 'Carousel';
// Added by sephora-jsx-loader.js
Object.assign(Carousel.prototype, require('./Carousel.c.js'));
var originalDidMount = Carousel.prototype.componentDidMount;
Carousel.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Carousel');
if (originalDidMount) originalDidMount.apply(this);
if (Carousel.prototype.ctrlr) Carousel.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Carousel');
// Added by sephora-jsx-loader.js
Carousel.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Carousel.prototype.class = 'Carousel';
// Added by sephora-jsx-loader.js
Carousel.prototype.getInitialState = function() {
    Carousel.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Carousel.prototype.render = wrapComponentRender(Carousel.prototype.render);
// Added by sephora-jsx-loader.js
var CarouselClass = React.createClass(Carousel.prototype);
// Added by sephora-jsx-loader.js
CarouselClass.prototype.classRef = CarouselClass;
// Added by sephora-jsx-loader.js
Object.assign(CarouselClass, Carousel);
// Added by sephora-jsx-loader.js
module.exports = CarouselClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Carousel/Carousel.jsx