// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var EditFlowModal = function () {};

// Added by sephora-jsx-loader.js
EditFlowModal.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const watch = require('redux-watch');
const showEditFlowModal = require('actions/ProfileActions').showEditFlowModal;

EditFlowModal.prototype.ctrlr = function () {

    //need to be able to add color iqs on the fly from color iq edit flow section
    let isColorIQSection = (this.props.title === 'Color IQ');
    if (isColorIQSection) {
        let biInfoWatch = watch(store.getState, 'user.beautyInsiderAccount');
        store.subscribe(biInfoWatch(newBiInfo => {
            this.setState({
                biAccount: newBiInfo
            });
        }));
    }
};

EditFlowModal.prototype.requestClose = function () {

    const isBioProfileSection = (this.props.title === 'Photos & Bio');
    //no getData function for some of the edit profile sections (Color IQ, Birthday)
    //when no getData function, then no need for saveProfileCallback. Just close modal.
    if (this.tabContent.getData) {
        const dataToSave = this.tabContent.getData();

        this.props.saveProfileCallback(
            dataToSave,
            store.dispatch(showEditFlowModal(false)),
            isBioProfileSection
        );
    } else {
        store.dispatch(showEditFlowModal(false));
    }
};


// Added by sephora-jsx-loader.js
module.exports = EditFlowModal.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/EditMyProfile/Modals/EditFlowModal/EditFlowModal.c.js