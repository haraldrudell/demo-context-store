'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InfiniteScrollNext = exports.VirtualRepeat = undefined;
exports.configure = configure;

var _virtualRepeat = require('./virtual-repeat');

var _infiniteScrollNext = require('./infinite-scroll-next');

function configure(config) {
  config.globalResources('./virtual-repeat', './infinite-scroll-next');
}

exports.VirtualRepeat = _virtualRepeat.VirtualRepeat;
exports.InfiniteScrollNext = _infiniteScrollNext.InfiniteScrollNext;


//////////////////
// WEBPACK FOOTER
// ./~/aurelia-ui-virtualization/dist/commonjs/aurelia-ui-virtualization.js
// module id = aurelia-ui-virtualization
// module chunks = 4