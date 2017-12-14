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
    Sephora.Util.InflatorComps.Comps['MediaPopup'] = function MediaPopup(){
        return MediaPopupClass;
    }
}
const Modal = require('components/Modal/Modal');
const Html = require('components/Html/Html');
const BccImage = require('components/Bcc/BccImage/BccImage');
const BccMarkdown = require('components/Bcc/BccMarkdown/BccMarkdown');

const MediaPopup = function () {
    this.state = {
        regions: null,
        isOpen: this.props.isOpen
    };
};

MediaPopup.prototype.getContent = function () {
    const TYPES = {
        IMAGE: 1,
        HTML: 5,
        MARKDOWN: 57
    };

    let mappedContents = [];

    const regions = this.state.regions;

    if (regions && regions.content && regions.content.length) {
        regions.content.forEach(content => {
            switch (content.componentType) {
                case TYPES.IMAGE:
                    mappedContents.push(<BccImage {...content} />);
                    break;
                case TYPES.HTML:
                    mappedContents.push(
                        <Html
                            className={content.style.classes}
                            content={content.text} />);
                    break;
                case TYPES.MARKDOWN:
                    mappedContents.push(<BccMarkdown {...content} />);
                    break;
                default:
                    mappedContents = null;
            }
            return mappedContents;
        });
    }

    return mappedContents;
};

MediaPopup.prototype.render = function () {
    let content = null;
    let closeModal = this.props.onClose || this.requestClose;

    const right = this.state.regions && this.state.regions.right
        ? this.state.regions.right : null;

    const left = this.state.regions && this.state.regions.left
        ? this.state.regions.left : null;

    let components = null;

    if (this.props.showContent) {
        components = this.getContent();
    }

    return (
        <Modal
            open={this.state.isOpen && !!this.state.regions}
            onDismiss={closeModal}
            width={this.props.width}>
            {this.props.title &&
                <Modal.Header>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
            }
            <Modal.Body>
                {(left && left.length) &&
                    left.map(html =>
                        <Html
                            className={html.style.classes}
                            content={html.text} />
                    )
                }
                {components &&
                    components
                }
                {(right && right.length) &&
                    right.map(html =>
                        <Html
                            className={html.style.classes}
                            content={html.text} />
                    )
                }
            </Modal.Body>
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
MediaPopup.prototype.path = 'GlobalModals/MediaPopup';
// Added by sephora-jsx-loader.js
Object.assign(MediaPopup.prototype, require('./MediaPopup.c.js'));
var originalDidMount = MediaPopup.prototype.componentDidMount;
MediaPopup.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: MediaPopup');
if (originalDidMount) originalDidMount.apply(this);
if (MediaPopup.prototype.ctrlr) MediaPopup.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: MediaPopup');
// Added by sephora-jsx-loader.js
MediaPopup.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
MediaPopup.prototype.class = 'MediaPopup';
// Added by sephora-jsx-loader.js
MediaPopup.prototype.getInitialState = function() {
    MediaPopup.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
MediaPopup.prototype.render = wrapComponentRender(MediaPopup.prototype.render);
// Added by sephora-jsx-loader.js
var MediaPopupClass = React.createClass(MediaPopup.prototype);
// Added by sephora-jsx-loader.js
MediaPopupClass.prototype.classRef = MediaPopupClass;
// Added by sephora-jsx-loader.js
Object.assign(MediaPopupClass, MediaPopup);
// Added by sephora-jsx-loader.js
module.exports = MediaPopupClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/MediaPopup/MediaPopup.jsx