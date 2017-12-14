// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Carousel = function () {};

// Added by sephora-jsx-loader.js
Carousel.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const CarouselActions = require('actions/CarouselActions');

Carousel.prototype.ctrlr = function () {
    if (this.carousel) {
        // Adjust the carousel if the user is in a mobile
        // device and they change its orientation
        // https://jira.sephora.com/browse/ILLUPH-78406
        if (Sephora.isMobile()) {
            window.addEventListener('orientationchange', this.adjust);
        }

        // For slideshows with timed animations/auto scroll
        if (this.props.isEnableCircle && this.props.delay) {
            let intervalId = setInterval(() => {
                this.nextPage();
            }, this.props.delay);

            this.setState({ intervalId: intervalId });
        }
    }
};

Carousel.prototype.adjust = function (callback = () => { }) {
    // Make sure this.carousel exists. It might NOT exist if it has no children
    const width = this.carousel && this.carousel.getBoundingClientRect().width;
    const totalItems = this.props.totalItems || this.props.children.length;
    let totalWidth = width * (totalItems / this.props.displayCount);
    if (this.props.fillTrailedGap) {
        totalWidth += width;
    }

    if (width) {
        this.setState({
            visibleArea: width,
            scrollEnd: width * (
                Math.ceil(totalItems / this.props.displayCount) - 1),
            totalWidth: totalWidth,
            posX: -(width * (this.state.page - 1)),
            isResize: true
        }, callback);
    }
};

Carousel.prototype.handleMouseEnter = function() {
    // TODO: (micro optimization) Add listener to the carousel DOM element with 
    // addEventListener and then just remove it once it's run  instead 
    // of having to make this check every time the it is hovered over
    if (!this.isInitialized) {
        this.adjust(() => {
            this.isInitialized = true;
        });
    }
};

Carousel.prototype.handleSwipe = function (e) {
    const DIRECTION = {
        NEXT: 2,
        PREV: 4
    };

    if (Sephora.isTouch) {
        if (e.direction === DIRECTION.NEXT) {
            this.nextPage();
        } else if (e.direction === DIRECTION.PREV) {
            this.previousPage();
        }
    }
};

Carousel.prototype.componentWillReceiveProps = function (updatedProps) {
    if (updatedProps.totalItems) {
        this.setState({
            numberOfPages: Math.ceil(
                updatedProps.totalItems / updatedProps.displayCount)
        });
    }
};

Carousel.prototype.componentDidUpdate = function (prevProps) {
    if (prevProps.totalItems !== this.props.totalItems) {
        this.adjust(() => {
            if (!this.isFirstPage() && !this.props.preventScrollReset) {
                this.moveTo(1);
            }
        });
    }
};

Carousel.prototype.nextPage = function () {
    const isCircle = this.props.isEnableCircle;

    // For single loop auto scroll, clear the interval on the second to last page
    if ((this.state.page === this.state.numberOfPages - 1) && this.props.autoStart === 2) {
        clearInterval(this.state.intervalId);
    }

    if (isCircle && (this.isLastPage() || -this.state.posX > this.state.scrollEnd)) {
        // Copy of first page at the end is past the scrollEnd position,
        // so scroll past the boundaries to the copy
        if (this.isLastPage()) {
            this.setState({
                posX: this.state.posX - this.state.visibleArea,
                page: 1,
                isResize: false
            });
        } else {
            // Snap to first page then scroll right
            this.setState({
                page: 1,
                posX: 0,
                isResize: true
            }, () => {
                this.moveTo(this.state.page + 1);
            });
        }
    } else {
        if (this.state.page < this.state.numberOfPages) {
            this.moveTo(this.state.page + 1);
        }
    }
};

Carousel.prototype.previousPage = function () {
    if (this.props.isEnableCircle && this.isFirstPage()) {
        // Snap to copied page at the end then scroll left to final page
        this.setState({
            posX: -(this.state.scrollEnd + this.state.visibleArea),
            isResize: true
        }, () => {
            this.moveTo(this.state.numberOfPages);
        });
    } else {
        if (this.state.page > 1) {
            this.moveTo(this.state.page - 1);
        }
    }
};

Carousel.prototype.moveTo = function (page) {
    this.setState({
        posX: Math.max(-(this.state.visibleArea * (page - 1)),
            -this.state.totalWidth + this.state.visibleArea),
        isResize: false,
        page: page
    }, () => {
        if (this.isLastPage() && this.props.onLastItemVisible &&
            typeof this.props.onLastItemVisible === 'function') {
            this.props.onLastItemVisible();
        }
    });
};

Carousel.prototype.isLastPage = function () {
    return this.state.page === this.state.numberOfPages;
};

Carousel.prototype.isFirstPage = function () {
    return this.state.page === 1;
};

Carousel.prototype.getCurrentPage = function () {
    return this.state.page;
};

Carousel.prototype.getCurrentActiveItem = function () {
    return this.state.currentActiveItem;
};

Carousel.prototype.updateCurrentActiveItem = function (event, itemIndex) {
    this.setState({ currentActiveItem: itemIndex });
    store.dispatch(CarouselActions.carouselItemClicked(this.props.name, itemIndex));
};

Carousel.prototype.toggleHover = function (event, itemIndex) {
    if (!Sephora.isTouch) {
        let isHovered = event.type === 'mouseenter';
        this.setState({ currentHoverItem: isHovered ? itemIndex : -1 });
        store.dispatch(CarouselActions.carouselItemHovered(this.props.name, itemIndex, isHovered, {
            x: event.offsetX,
            y: event.offsetY
        }));
    }
};

Carousel.prototype.toggleMoveOver = function (event, itemIndex) {
    if (!Sephora.isTouch) {
        store.dispatch(CarouselActions.carouselItemMovedOver(this.props.name, itemIndex, {
            x: event.offsetX,
            y: event.offsetY
        }));
    }
};


// Added by sephora-jsx-loader.js
module.exports = Carousel.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Carousel/Carousel.c.js