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
    Sephora.Util.InflatorComps.Comps['EditMyProfileModal'] = function EditMyProfileModal(){
        return EditMyProfileModalClass;
    }
}
const modal = require('style').modal;
const Modal = require('components/Modal/Modal');

const EditMyProfileMW = require('components/RichProfile/EditMyProfile/EditMyProfileMW/EditMyProfileMW');
const EditMyProfileFS = require('components/RichProfile/EditMyProfile/EditMyProfileFS/EditMyProfileFS');

const PROFILE_CATEGORIES = [
    'Photos & Bio',
    'Skin',
    'Hair',
    'Eyes',
    'Color IQ',
    'Birthday'
];

const EditMyProfileModal = function () {
    this.state = {
        profileId: '',
        biAccount: null,
        socialProfile: null
    };
};

EditMyProfileModal.prototype.render = function () {

    // isLithiumSuccessful should always be true (display photos & bio tab)
    // unless this.state.isLithiumSuccessful becomes false (hide photos & bio tab)
    let isLithiumSuccessful = true;

    if (this.state.isLithiumSuccessful === false) {
        isLithiumSuccessful = false;
    }

    return (
        <Modal
            open={this.props.isOpen}
            onDismiss={this.requestClose}
            width={modal.WIDTH.LG}>

            <Modal.Header>
                <Modal.Title>
                    Edit Profile
                </Modal.Title>
            </Modal.Header>

            <Modal.Body style={{
                padding: 0
            }}>
                {
                    Sephora.isMobile()
                        ?
                        <EditMyProfileMW
                            isLithiumSuccessful={isLithiumSuccessful}
                            biAccount={this.state.biAccount}
                            socialProfile={this.state.socialProfile}
                            saveProfileCallback={this.saveProfileCallback}
                            linksList={PROFILE_CATEGORIES}
                            getCategoryContent={this.getCategoryContent} />
                        :
                        <EditMyProfileFS
                            isLithiumSuccessful={isLithiumSuccessful}
                            biAccount={this.state.biAccount}
                            socialProfile={this.state.socialProfile}
                            saveProfileCallback={this.saveProfileCallback}
                            linksList={PROFILE_CATEGORIES}
                            getCategoryContent={this.getCategoryContent} />
                }
            </Modal.Body>
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
EditMyProfileModal.prototype.path = 'RichProfile/EditMyProfile/Modals/EditMyProfileModal';
// Added by sephora-jsx-loader.js
Object.assign(EditMyProfileModal.prototype, require('./EditMyProfileModal.c.js'));
var originalDidMount = EditMyProfileModal.prototype.componentDidMount;
EditMyProfileModal.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: EditMyProfileModal');
if (originalDidMount) originalDidMount.apply(this);
if (EditMyProfileModal.prototype.ctrlr) EditMyProfileModal.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: EditMyProfileModal');
// Added by sephora-jsx-loader.js
EditMyProfileModal.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
EditMyProfileModal.prototype.class = 'EditMyProfileModal';
// Added by sephora-jsx-loader.js
EditMyProfileModal.prototype.getInitialState = function() {
    EditMyProfileModal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
EditMyProfileModal.prototype.render = wrapComponentRender(EditMyProfileModal.prototype.render);
// Added by sephora-jsx-loader.js
var EditMyProfileModalClass = React.createClass(EditMyProfileModal.prototype);
// Added by sephora-jsx-loader.js
EditMyProfileModalClass.prototype.classRef = EditMyProfileModalClass;
// Added by sephora-jsx-loader.js
Object.assign(EditMyProfileModalClass, EditMyProfileModal);
// Added by sephora-jsx-loader.js
module.exports = EditMyProfileModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/EditMyProfile/Modals/EditMyProfileModal/EditMyProfileModal.jsx