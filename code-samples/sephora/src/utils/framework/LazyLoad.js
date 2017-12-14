const Events = require('utils/framework/Events');
const ServiceUtils = require('utils/Services');
const ReactDOM = require('react-dom');
const Perf = require('utils/framework/Perf');

const DATA_ATTRIBUTES = {
    TARGET: 'data-lload',
    IMAGE: 'data-llimg',
    SRCSET: 'data-llset'
};

const TYPES = {
    COMPONENT: 'component',
    IMAGE: 'image'
};

/**
 * Creates the lazy loader instance.
 */

let LazyLoaderInstance;
const LazyLoader = function () {
    this.lastScrollPosition = this._getVerticalOffset();

    /**
     * The lazy loader instance will have a store of targets. A target can be an individual item
     * like a component or image, but can also be a container marked to have its inner images or
     * components lazy loaded. On page scroll we check if the targets are in the viewport, and
     * handle accordingly. currentTargets only stores targets that haven't been loaded.
     */
    this.currentTargets = [];
    /**
     * Sometimes images can be added to a target after its been loaded. allTargets is used to
     * maintain an array of all lazyLoad targets in case a lazy Image is added to a target that
     * has already loaded.
     */
    this.targets = [];
    this.requestAnimationFrameSupported = 'requestAnimationFrame' in window;
};

LazyLoader.prototype.requestFrame = function (callback) {
    if (this.requestAnimationFrameSupported) {
        return requestAnimationFrame(callback);
    } else {
        return callback();
    }
};

/**
 * @param  {number} currentPosition - Current vertical offset
 * @param  {number} lastPosition - Previous vertical offset
 * @return {boolean} - True if last position is greater
 */
LazyLoader.prototype._scrolledUpwards = function (currentPosition, lastPosition) {
    return lastPosition > currentPosition;
};

/**
 * @return {number} - window's current Y offset.
 */
LazyLoader.prototype._getVerticalOffset = function () {
    return window.pageYOffset;
};

/** Checks whether a given element is in the viewport
 * @param  {object} element - A DOM Element object
 * @param {object} elementRect - Optional getBoundingClientRect return oject to use
 * @return {boolean} - Whether element is in viewport or not
 */

LazyLoader.prototype._isInViewport = function (element, elementRect = null) {
    const rect = elementRect ? elementRect : element.getBoundingClientRect();
    const innerHeight = window.innerHeight;
    return (
        (rect.top >= 0 && rect.top <= innerHeight) ||
        (rect.bottom >= 0 && rect.bottom <= innerHeight)
    );
};

/**
 * @param  {number} elementTop - DOM element getBoundingClientRect().top value
 * @return {number} - Distance to window top
 */
LazyLoader.prototype._getDistanceToTop = function (elementTop) {
    /* We can determine an element's distance from the top by adding the page's Y offset and the
    element's top distance from the viewport. We can used the cached value for page Y offset
    stored in this.lastScrollPosition. */
    let location = this.lastScrollPosition + elementTop;
    return location >= 0 ? location : 0;
};

/**
 * @param  {obj} child - DOM element
 * @param  {string} attribute - data-attribute used to find the parent element
 * @param  {string} value - value of said data-attribute
 */
LazyLoader.prototype._findParentByAttribute = function(child, attribute, value) {
    return new Promise((resolve, reject) => {
        let parent = child.parentNode;
        while (parent && parent !== document.body) {
            const parentLoadAttribute = parent.getAttribute(attribute);

            if (parentLoadAttribute) {
                if (parentLoadAttribute === 'false') {
                    reject();
                } else if (parentLoadAttribute === value) {
                    resolve(parent);
                }
            }

            parent = parent.parentNode;
        }
        resolve(null);
    });
};

LazyLoader.prototype._handleScroll = function () {
    let currentTargets = this.currentTargets;
    let targetsLength = currentTargets.length;

    if (targetsLength) {
        let i;
        let target;

        this.requestFrame(() => {
            let currentPosition = this._getVerticalOffset();

            /**
             * We loop over the target store in different directions depending whether the user
             * scrolled upwards or downwards. The reason for this is that since targets are sorted
             * by their proximity to the top, if the first-checked target is not in the viewport
             * then we don't really need to check for the following targets. In this case we
             * break the loop.
             *
             * However, in some scenarios an element can have an offsetTop property of 0, so we
             * don't break the loop until the next element with a positive offseTop property
             * is confirmed as either in-viewport or out-of-viewport.
             */

            if (!this._scrolledUpwards(currentPosition, this.lastScrollPosition)) {

                // Forward loop
                for (i = 0; i < targetsLength; i += 1) {
                    target = currentTargets[i];
                    if (this._isInViewport(target.container)) {
                        target.loadItems();
                    } else {
                        if (target.container.offsetTop !== 0) {
                            break;
                        }
                    }
                }
            } else {
                // Backward loop
                for (i = targetsLength - 1; i >= 0; i -= 1) {
                    target = currentTargets[i];
                    if (this._isInViewport(target.container)) {
                        target.loadItems();
                    } else {
                        if (target.container.offsetTop !== 0) {
                            break;
                        }
                    }
                }
            }

            // Update the last scroll position
            this.lastScrollPosition = currentPosition;

            /**
             * Targets that have been loaded are removed from the target store to avoid further
             * unnecessary checks.
             */
            this.currentTargets = currentTargets.filter(item => item.loaded === false);
        });
    }

    return;
};

/**
 * @param  {object} lazyImage - DOM image object
 * @param  {string} imagePath - image's source url
 * @param  {string} srcsetPath - image's srcset
 */
LazyLoader.prototype._loadImage = function(lazyImage, imagePath, srcsetPath) {
    /* We're using setAttribute explicitly instead of lazyImage.src as it looks like this is
    a probable cause to why some images in iOS Safari fail to set the attribute correctly,
    which results in no image shown despite being lazy load successfully. */
    // console.log(performance.now() + ' Lazy Image Loaded: ', lazyImage);
    if (imagePath) {
        lazyImage.setAttribute('src', imagePath);
    }
    if (srcsetPath) {
        lazyImage.setAttribute('srcset', srcsetPath);
    }
};

/** Registers the lazy-loaded item to its associated target if its target has been stored already,
 * or else adds a new target (with its lazy-loaded item) to the target store.
 * @param  {object} itemTarget - DOM element to lazy load
 * @param  {string} type - Type of element to lazy load (image or component)
 * @param  {function} callback - Callback to execute when item is ready to load
 */
LazyLoader.prototype._registerItem = function (itemTarget, type, callback) {
    let targets = this.targets;
    let currentTargets = this.currentTargets;
    let i = 0;
    let target;

    // If targets have already been registered, but this item has not been added to one of them.
    while (i < targets.length && target === undefined) {

        /** If the item's target is already in the target store, add it to said
         * target's item store.
         */
        if (targets[i].container === itemTarget) {
            target = targets[i];
            target.items.push(callback);

            if (target.loaded) {
                callback();
            }
        }

        i++;
    }

    /**
     * If the item was not added per above, then the item's target has not been stored yet.
     * Add the target and its associated item.
     */
    if (target === undefined) {
        target = {
            container: itemTarget,
            items: [callback],
            type: type,
            loaded: false,
            loadItems: function () {
                // Resolve all of the target's lazy loaded items
                for (let x = 0, max = this.items.length; x < max; x += 1) {
                    this.items[x]();
                }

                // Mark as loaded
                this.loaded = true;

                // Visualize what is getting loaded, for development purposes only
                // this.container.style.border = '3px solid red';
                Perf.report(['Lazy Target Loaded', this.container], false);

            }
        };

        targets.push(target);

        this.requestFrame(() => {
            // TODO: Calculate location here and cache it so that it does not need to be calculated
            // on each sort once we disable lazy loading of async components
            // let itemTargetRect = itemTarget.getBoundingClientRect();
            // target.loaded = this._isInViewport(itemTarget, itemTargetRect);
            // target.location = this._getDistanceToTop(itemTargetRect.top);

            target.loaded = this._isInViewport(itemTarget);

            if (!target.loaded) {
                currentTargets.push(target);

                // Sort targets by their proximity to the top.
                this.sortCurrentTargets();

            } else {
                // console.log('Lazy Target immediate load.', itemTarget);
                target.loadItems();
            }
        });
    }
};

LazyLoader.prototype.sortCurrentTargets = function () {
    if (this.currentTargets.length && this.currentTargets.length > 1) {
        this.currentTargets.sort((a, b) => {
            // const positionA = a.location;
            // const positionB = b.location;

            const positionA = this._getDistanceToTop(a.container.getBoundingClientRect().top);
            const positionB = this._getDistanceToTop(b.container.getBoundingClientRect().top);

            if (positionA > positionB) {
                return 1;
            } else if (positionA < positionB) {
                return -1;
            } else {
                return 0;
            }
        });
    }
};

/**
 * @param  {object} lazyImage - DOM element for image
 */
LazyLoader.prototype.addLazyImage = function (lazyImage) {
    const imagePath = lazyImage.getAttribute(DATA_ATTRIBUTES.IMAGE);
    const srcsetPath = lazyImage.getAttribute(DATA_ATTRIBUTES.SRCSET);
    const callback = this._loadImage.bind(this, lazyImage, imagePath, srcsetPath);

    this._findParentByAttribute(lazyImage, DATA_ATTRIBUTES.TARGET, 'img')
    .then(parent => {
        const lazyTarget = parent || lazyImage;
        this._registerItem(lazyTarget, TYPES.IMAGE, callback);
    }, () => this._loadImage(lazyImage, imagePath, srcsetPath));
};

/**
 * @param  {object} lazyComponent - Component instance
 * @param  {function} callback - Callback to execute when lazy loading
 */
LazyLoader.prototype.addLazyComponent = function (component, callback) {
    let componentElement = ReactDOM.findDOMNode(component);

    if (componentElement) {
        this._registerItem(componentElement, TYPES.COMPONENT, callback);
    }
};

LazyLoader.prototype.start = function () {
    // Fire lazy load check once initially
    Perf.report('LazyLoading Start');

    window.addEventListener(Events.DebouncedScroll, this._handleScroll.bind(this));

    /** Disable lazy loading after these load events have fired.
     * It is assumed that any new images added to the page past this point are a
     * response to user actions and should therefore be loaded immediately
     */
    let shouldServiceRun = ServiceUtils.shouldServiceRun;
    let dependencies = [Events.UserInfoCtrlrsApplied];

    if (shouldServiceRun.certona()) {
        dependencies.push(Events.CertonaCtrlrsApplied);
    }

    if (shouldServiceRun.testTarget()) {
        dependencies.push(Events.TestTargetCtrlrsApplied);
    }

    // Trigger lazy load complete
    Events.onLastLoadEvent(window, dependencies, this._triggerLoadComplete.bind(this));

    // Load images if PostLoad fires and they have not been loaded yet
    Events.onLastLoadEvent(window, [Events.PostLoad], this._loadAllImages.bind(this));
};

LazyLoader.prototype._triggerLoadComplete = function () {
    Perf.report('LazyLoading Complete');
    Sephora.isLazyLoadEnabled = false;
    Sephora.Util.InflatorComps.services.loadEvents[Events.LazyLoadComplete] = true;
    window.dispatchEvent(new CustomEvent(Events.LazyLoadComplete));
};

LazyLoader.prototype._loadAllImages = function () {
    this.currentTargets.forEach(target => {
        if (!target.loaded && target.type === TYPES.IMAGE) {
            target.loadItems();
        }
    });
};

LazyLoader.prototype.DATA_ATTRIBUTES = DATA_ATTRIBUTES;

LazyLoaderInstance = new LazyLoader();
module.exports = LazyLoaderInstance;



// WEBPACK FOOTER //
// ./public_ufe/js/utils/framework/LazyLoad.js