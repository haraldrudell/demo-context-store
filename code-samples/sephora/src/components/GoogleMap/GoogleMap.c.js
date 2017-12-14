// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var GoogleMap = function () {};

// Added by sephora-jsx-loader.js
GoogleMap.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const ReactDOM = require('react-dom');

GoogleMap.prototype.ctrlr = function () {
    this.loadJS('//maps.googleapis.com/maps/api/js?key=AIzaSyCPbJjMHMNa79cMFW-KUz7bP5RC4hMU7mg&' +
        'v=3.exp&sensor=false&callback=Sephora.initGmap');
    this.initializeGoogleMaps();
};

GoogleMap.prototype.initializeGoogleMaps = function () {
    let _this = this;

    Sephora.initGmap = function () {
        let gmap;
        let marker;
        const mapOptions = {
            zoom: 15,
            panControl: false,
            zoomControl: false,
            scaleControl: true,
            center: new google.maps.LatLng(_this.props.selectedStore.latitude,
                    _this.props.selectedStore.longitude),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        gmap = new google.maps.Map(ReactDOM.findDOMNode(_this.map), mapOptions);
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(_this.props.selectedStore.latitude,
                     _this.props.selectedStore.longitude),
            map: gmap,
            title: 'Sephora'
        });
    };

};

GoogleMap.prototype.loadJS = function (src) {
    var ref = window.document.getElementsByTagName('script')[0];
    var script = window.document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
};



// Added by sephora-jsx-loader.js
module.exports = GoogleMap.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GoogleMap/GoogleMap.c.js