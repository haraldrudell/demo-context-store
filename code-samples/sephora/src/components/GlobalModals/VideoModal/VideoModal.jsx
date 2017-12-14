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
    Sephora.Util.InflatorComps.Comps['VideoModal'] = function VideoModal(){
        return VideoModalClass;
    }
}
const Modal = require('components/Modal/Modal');
const {
    modal
} = require('style');

const VideoModal = function () {
    this.state = {};
};

VideoModal.prototype.render = function () {
    return (<Modal
        open={this.props.isOpen}
        onDismiss={this.isDone}
        width={modal.WIDTH.XL}>
        {this.props.videoTitle &&
        <Modal.Header>
            <Modal.Title>
                {this.props.videoTitle}
            </Modal.Title>
        </Modal.Header>
        }
        <Modal.Body>
            <div ref={(videoWrapper) => this.props.videoModalUpdated(videoWrapper)}>
                {this.props.video}
            </div>
        </Modal.Body>
    </Modal>
    );
};


// Added by sephora-jsx-loader.js
VideoModal.prototype.path = 'GlobalModals/VideoModal';
// Added by sephora-jsx-loader.js
Object.assign(VideoModal.prototype, require('./VideoModal.c.js'));
var originalDidMount = VideoModal.prototype.componentDidMount;
VideoModal.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: VideoModal');
if (originalDidMount) originalDidMount.apply(this);
if (VideoModal.prototype.ctrlr) VideoModal.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: VideoModal');
// Added by sephora-jsx-loader.js
VideoModal.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
VideoModal.prototype.class = 'VideoModal';
// Added by sephora-jsx-loader.js
VideoModal.prototype.getInitialState = function() {
    VideoModal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
VideoModal.prototype.render = wrapComponentRender(VideoModal.prototype.render);
// Added by sephora-jsx-loader.js
var VideoModalClass = React.createClass(VideoModal.prototype);
// Added by sephora-jsx-loader.js
VideoModalClass.prototype.classRef = VideoModalClass;
// Added by sephora-jsx-loader.js
Object.assign(VideoModalClass, VideoModal);
// Added by sephora-jsx-loader.js
module.exports = VideoModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/VideoModal/VideoModal.jsx