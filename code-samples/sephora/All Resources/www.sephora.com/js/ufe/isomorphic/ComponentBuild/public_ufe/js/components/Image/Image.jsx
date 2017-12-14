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
    Sephora.Util.InflatorComps.Comps['Image'] = function Image(){
        return ImageClass;
    }
}
const Base = require('components/Base/Base');
const urlUtils = require('utils/Url');

let ReactDOM;
let LazyLoader;
let Events;

const Image = function () {
    if (!Sephora.isRootRender && !this.props.disableLazyLoad && Sephora.isLazyLoadEnabled) {
        this.state = { globalRef: { instance: this, attrs: {} } };
        Sephora.Util.InflatorComps.Comps.Image.instances.push(this.state.globalRef);
        
        let self = this;
        let originalDidMount = this.componentDidMount;
        this.componentDidMount = function () {
            let element = ReactDOM.findDOMNode(this);
            // Set all the current attributes in the global instance
            // This is commented out for now since its not needed, however if a use case comes
            // up in future where the attributes need to be preserved between server and client
            // this could be useful.
            // let currentAttrs = element.attributes;
            // for (let i = 0; i < currentAttrs.length; i++) {
            //     self.state.globalRef.attrs[currentAttrs[i].nodeName] = currentAttrs[i].nodeValue;
            // }
            // Update the global instance when an element attribute it updated
            let originalSetAttribute = element.setAttribute;
            element.setAttribute = function (attr, value) {
                self.state.globalRef.attrs[attr] = value;
                return originalSetAttribute.apply(this, arguments);
            };
            
            if (originalDidMount) {
                originalDidMount.apply(this);
            }
            Image.onInit(element);
        };
    }
};

Image.prototype.globalAccess = true;
if (!Sephora.isRootRender && Sephora.isLazyLoadEnabled) {
    
    ReactDOM = require('react-dom');
    Events = require('utils/framework/Events');
    LazyLoader = require('utils/framework/LazyLoad');
    
    Sephora.Util.InflatorComps.Comps.Image.instances = [];
    Image.onInit = function (InstanceElement) {
        LazyLoader.addLazyImage(InstanceElement);
    };
    Events.onLastLoadEvent(window, [Events.DOMContentLoaded], () => {
        let backEndImages = document.querySelectorAll('[data-ref~=Image]');
        for (let i = 0; i < backEndImages.length; i++) {
            Image.onInit(backEndImages[i]);
        }
    });
}

Image.prototype.getDefaultProps = function () {
    return { disableLazyLoad: false };
};

function imgOnLoad() {
    // console.log('React Image Load Triggered');
    Sephora.Util.Perf.markPageRenderDedup(ReactDOM.findDOMNode(this));
}
Image.prototype.render = function () {
    const {
        display,
        disableLazyLoad,
        maxWidth = '100%',
        src,
        srcSet,
        customSrc,
        isPageRenderImg,
        ...props
    } = this.props;

    const shouldDefault = !Sephora.isLazyLoadEnabled || disableLazyLoad;

    /* TODO: Add event that updates lazy load reference if an image has been rerendered.
     * If we have to we can give images IDs to sync them up across renders.
     */

    let imgPath = customSrc ? customSrc : urlUtils.getImagePath(src);
    let srcProps = {};

    if (shouldDefault) {
        srcProps = {
            src: imgPath,
            srcSet: srcSet
        };
        // console.log((performance && performance.now()) + ' Image default rendered: ' + imgPath);
    } else {

        // if (LazyLoader &&
        // Sephora.Util.InflatorComps.services.loadEvents.InPageCompsCtrlrsApplied &&
        // !Sephora.Util.InflatorComps.services.loadEvents.LazyLoadComplete) {
        //     /* If a new image is rendered after lazy load was initialized but
        //      * before page render is complete then register it for lazy loading.
        //      * This covers images added by certona for example.
        //      * This only applys to images being rendered in the browser.
        //      */
        //     this.componentDidMount = function() {
        //         LazyLoader.addLazyImage(ReactDOM.findDOMNode(this));
        //     };
        // }

        srcProps = {
            src: '/img/ufe/placeholder.gif',
            srcSet: '',
            'data-llimg': imgPath,
            'data-llset': srcSet
        };
    }

    let imgElement = <Base
        {...props}
        {...srcProps}
        onLoad={isPageRenderImg ? imgOnLoad : null}
        is='img'
        display={display || 'inline-block'}
        maxWidth={maxWidth} />;
    
    if (isPageRenderImg) {
        return <span>
            {imgElement}
            <script dangerouslySetInnerHTML={{__html:"Sephora.Util.Perf.markPageRender();"}}/>
        </span>
    } else {
        return imgElement;
    }
};


// Added by sephora-jsx-loader.js
Image.prototype.path = 'Image';
// Added by sephora-jsx-loader.js
Image.prototype.class = 'Image';
// Added by sephora-jsx-loader.js
Image.prototype.getInitialState = function() {
    Image.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Image.prototype.render = wrapComponentRender(Image.prototype.render);
// Added by sephora-jsx-loader.js
var ImageClass = React.createClass(Image.prototype);
// Added by sephora-jsx-loader.js
ImageClass.prototype.classRef = ImageClass;
// Added by sephora-jsx-loader.js
Object.assign(ImageClass, Image);
// Added by sephora-jsx-loader.js
module.exports = ImageClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Image/Image.jsx