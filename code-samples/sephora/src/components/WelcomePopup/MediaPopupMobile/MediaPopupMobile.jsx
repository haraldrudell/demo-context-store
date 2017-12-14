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
    Sephora.Util.InflatorComps.Comps['MediaPopupMobile'] = function MediaPopupMobile(){
        return MediaPopupMobileClass;
    }
}
const space = require('style').space;
const Modal = require('components/Modal/Modal');
const Text = require('components/Text/Text');
const Flex = require('components/Flex/Flex');
const ButtonRed = require('components/Button/ButtonRed');
const ButtonOutline = require('components/Button/ButtonOutline');

const MediaPopupMobile = function () { };

MediaPopupMobile.prototype.render = function () {
    return (
        <Modal
            open={this.props.isOpen}
            onDismiss={this.props.onDismiss}>
            {this.props.modalData && this.props.modalData.title &&
                <Modal.Header>
                    <Modal.Title>{this.props.modalData.title}</Modal.Title>
                </Modal.Header>
            }
            <Modal.Body>
                <div>
                    <Text
                        is='p'
                        marginBottom={space[3]}>
                        Select shopping experience
                    </Text>
                    <Flex
                        justifyContent='space-between'>
                        <ButtonOutline
                            block
                            onClick={this.props.onDismiss}
                            width={132}>
                            United States
                        </ButtonOutline>
                        {this.props.modalData && this.props.modalData.country &&
                            <ButtonRed
                                block
                                href={this.props.modalData.link}
                                width={132}>
                                {this.props.modalData.country}
                            </ButtonRed>
                        }

                    </Flex>
                </div>
            </Modal.Body>
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
MediaPopupMobile.prototype.path = 'WelcomePopup/MediaPopupMobile';
// Added by sephora-jsx-loader.js
MediaPopupMobile.prototype.class = 'MediaPopupMobile';
// Added by sephora-jsx-loader.js
MediaPopupMobile.prototype.getInitialState = function() {
    MediaPopupMobile.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
MediaPopupMobile.prototype.render = wrapComponentRender(MediaPopupMobile.prototype.render);
// Added by sephora-jsx-loader.js
var MediaPopupMobileClass = React.createClass(MediaPopupMobile.prototype);
// Added by sephora-jsx-loader.js
MediaPopupMobileClass.prototype.classRef = MediaPopupMobileClass;
// Added by sephora-jsx-loader.js
Object.assign(MediaPopupMobileClass, MediaPopupMobile);
// Added by sephora-jsx-loader.js
module.exports = MediaPopupMobileClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/WelcomePopup/MediaPopupMobile/MediaPopupMobile.jsx