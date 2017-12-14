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
    Sephora.Util.InflatorComps.Comps['PanZoom'] = function PanZoom(){
        return PanZoomClass;
    }
}
/* eslint-disable max-len */
const { Box, Flex } = require('components/display');
const Hammer = require('react-hammerjs');
const { colors, space } = require('style');

const ICON_SIZE = 32;

const PanZoom = function () {
    this._startX = 0;
    this._startY = 0;
    this.state = {
        scale: this.props.scale || 1,
        translate: {
            x: this.props.x || 0,
            y: this.props.y || 0
        }
    };
};

PanZoom.prototype.render = function () {
    let x = this.props.x || this.state.translate.x;
    let y = this.props.y || this.state.translate.y;
    let scale = this.props.scale || this.state.scale;

    const iconOffset = Sephora.isMobile() ? space[4] : space[6];

    const zoomIcon = {
        position: 'absolute',
        bottom: iconOffset,
        right: iconOffset,
        lineHeight: 0,
        backgroundColor: colors.white,
        borderRadius: 99999
    };

    return (
        <Hammer
            direction={Hammer.DIRECTION_ALL}
            onPan={this.onPan}
            onPanEnd={this.onPanEnd}
            onPanStart={this.onPanStart}
            onDoubleTap={this.onDoubleTap}
            options={{
                recognizers: {
                    swipe: {
                        enable: false
                    },
                    pinch: {
                        enable: false
                    },
                    press: {
                        enable: false
                    },
                    pan: {
                        enable: true
                    },
                    tap: {
                        enable: true
                    }
                }
            }}>
            <Box
                position='relative'
                overflow='hidden'
                width={this.props.width}
                height={this.props.height}>
                <Flex
                    position='absolute'
                    top={0} right={0} bottom={0} left={0}
                    style={{
                        transform: `translate(${x}px, ${y}px) ` +
                            `scale(${scale})`
                    }}>
                    {this.props.children}
                </Flex>
                {this.props.disableButtons ||
                    <div>
                        <Box
                            _css={[zoomIcon, {
                                bottom: iconOffset + ICON_SIZE + space[2]
                            }]}
                            onClick={()=> this.zoom(true)}>
                            <svg
                                width={ICON_SIZE} height={ICON_SIZE}
                                viewBox='0 0 32 32'>
                                <path d='M16 0C7.2 0 0 7.2 0 16s7.2 16 16 16 16-7.2 16-16S24.8 0 16 0zm0 30C8.3 30 2 23.7 2 16S8.3 2 16 2s14 6.3 14 14-6.3 14-14 14z'/>
                                <path d='M21 15h-4v-4c0-.6-.4-1-1-1s-1 .4-1 1v4h-4c-.6 0-1 .4-1 1s.4 1 1 1h4v4c0 .6.4 1 1 1s1-.4 1-1v-4h4c.6 0 1-.4 1-1s-.4-1-1-1z'/>
                            </svg>
                        </Box>
                        <Box
                            _css={zoomIcon}
                            onClick={()=> this.zoom(false)}>
                            <svg
                                width={ICON_SIZE} height={ICON_SIZE}
                                viewBox='0 0 32 32'>
                                <path d='M16 32C7.2 32 0 24.8 0 16S7.2 0 16 0s16 7.2 16 16-7.2 16-16 16zm0-30C8.3 2 2 8.3 2 16s6.3 14 14 14 14-6.3 14-14S23.7 2 16 2z'/>
                                <path d='M21 17H11c-.6 0-1-.4-1-1s.4-1 1-1h10c.6 0 1 .4 1 1s-.4 1-1 1z'/>
                            </svg>
                        </Box>
                    </div>
                }
            </Box>
        </Hammer>
    );
};


// Added by sephora-jsx-loader.js
PanZoom.prototype.path = 'PanZoom';
// Added by sephora-jsx-loader.js
Object.assign(PanZoom.prototype, require('./PanZoom.c.js'));
var originalDidMount = PanZoom.prototype.componentDidMount;
PanZoom.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: PanZoom');
if (originalDidMount) originalDidMount.apply(this);
if (PanZoom.prototype.ctrlr) PanZoom.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: PanZoom');
// Added by sephora-jsx-loader.js
PanZoom.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
PanZoom.prototype.class = 'PanZoom';
// Added by sephora-jsx-loader.js
PanZoom.prototype.getInitialState = function() {
    PanZoom.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
PanZoom.prototype.render = wrapComponentRender(PanZoom.prototype.render);
// Added by sephora-jsx-loader.js
var PanZoomClass = React.createClass(PanZoom.prototype);
// Added by sephora-jsx-loader.js
PanZoomClass.prototype.classRef = PanZoomClass;
// Added by sephora-jsx-loader.js
Object.assign(PanZoomClass, PanZoom);
// Added by sephora-jsx-loader.js
module.exports = PanZoomClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/PanZoom/PanZoom.jsx