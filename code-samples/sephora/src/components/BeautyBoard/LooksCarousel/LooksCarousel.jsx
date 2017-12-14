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
    Sephora.Util.InflatorComps.Comps['LooksCarousel'] = function LooksCarousel(){
        return LooksCarouselClass;
    }
}
const space = require('style').space;
const LookCard = require('../LookCard/LookCard');
const Carousel = require('components/Carousel/Carousel');

function LooksCarousel() {
    this.state = {
        looks: []
    };
}

LooksCarousel.prototype.render = function () {
    const isMobile = Sephora.isMobile();
    const showCount = isMobile ? 2 : 4;
    const shadowBlur = 5;

    // We are passing this.props.totalItems because the Carousel component needs to
    // know the real total items so the arrows and pagination keep working properly.
    // TODO: Refactor the Carousel component so it takes this.state.looks.length as
    // totalItems and the arrows keep working.
    return (
        <Carousel
            onLastItemVisible={this.getNextLooksPage}
            gutter={(isMobile ? space[3] : space[4]) - (shadowBlur * 2)}
            displayCount={showCount}
            totalItems={this.props.totalNumber}
            showArrows={!isMobile}>

            {this.state.looks.map(look =>
                <LookCard
                    look={look}
                    shadowBlur={shadowBlur}
                    isMyLooks={this.props.isMyLooks} />
            )}
        </Carousel>
    );
};


// Added by sephora-jsx-loader.js
LooksCarousel.prototype.path = 'BeautyBoard/LooksCarousel';
// Added by sephora-jsx-loader.js
Object.assign(LooksCarousel.prototype, require('./LooksCarousel.c.js'));
var originalDidMount = LooksCarousel.prototype.componentDidMount;
LooksCarousel.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: LooksCarousel');
if (originalDidMount) originalDidMount.apply(this);
if (LooksCarousel.prototype.ctrlr) LooksCarousel.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: LooksCarousel');
// Added by sephora-jsx-loader.js
LooksCarousel.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
LooksCarousel.prototype.class = 'LooksCarousel';
// Added by sephora-jsx-loader.js
LooksCarousel.prototype.getInitialState = function() {
    LooksCarousel.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
LooksCarousel.prototype.render = wrapComponentRender(LooksCarousel.prototype.render);
// Added by sephora-jsx-loader.js
var LooksCarouselClass = React.createClass(LooksCarousel.prototype);
// Added by sephora-jsx-loader.js
LooksCarouselClass.prototype.classRef = LooksCarouselClass;
// Added by sephora-jsx-loader.js
Object.assign(LooksCarouselClass, LooksCarousel);
// Added by sephora-jsx-loader.js
module.exports = LooksCarouselClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BeautyBoard/LooksCarousel/LooksCarousel.jsx