// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var BccImage = function () {};

// Added by sephora-jsx-loader.js
BccImage.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const update = require('react-addons-update');
const store = require('Store');
const showBccModal = require('Actions').showBccModal;
const Debounce = require('utils/Debounce').debounce;

BccImage.prototype.ctrlr = function () {
    if (this.props.hotSpots) {
        let img = document.getElementById(this.props.imageId);
        if (img.offsetWidth !== this.props.width) {
            // Size initial hot spots
            this.resizeImageMap(img);
        }

        window.addEventListener('resize', Debounce(this.resizeImageMap.bind(this, img), 250));
    }
};

BccImage.prototype.toggleHover = function () {
    if (!Sephora.isTouch && Sephora.isDesktop()) {
        this.setState(update(this.state, {
            hover: {
                $set: !this.state.hover
            }
        }));
    }
};

BccImage.prototype.toggleOpen = function (modalTemplate) {
    store.dispatch(showBccModal(true, modalTemplate, this.props.componentName));
};

BccImage.prototype.resizeImageMap = function (img) {

    let proportion = img.offsetWidth / this.props.width;
    let areas = document.querySelectorAll('map[name="' + this.props.name + '"] area');
    let c = 'coords';

    [].forEach.call(areas, function (area) {

        let coordsS = area.dataset[c] = area.dataset[c] || area.getAttribute(c);
        let coordsA = coordsS.split(',');
        let coordsPercent = [];

        coordsA.forEach(function (val, i) {
            coordsPercent[i] = Number(val * proportion);
        });

        area.setAttribute(c, coordsPercent.join(','));
    });
};


// Added by sephora-jsx-loader.js
module.exports = BccImage.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Bcc/BccImage/BccImage.c.js