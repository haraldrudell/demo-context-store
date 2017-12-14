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
    Sephora.Util.InflatorComps.Comps['GlobalModalsWrapper'] = function GlobalModalsWrapper(){
        return GlobalModalsWrapperClass;
    }
}
/*eslint max-len: ["error", 200]*/
const BccModal = require('components/Bcc/BccModal/BccModal');
const SignInModal = require('components/GlobalModals/SignInModal/SignInModal');
const RegisterModal = require('components/GlobalModals/RegisterModal/RegisterModal');
const BiRegisterModal = require('components/GlobalModals/BiRegisterModal/BiRegisterModal');
const ForgotPasswordModal = require('components/GlobalModals/ForgotPasswordModal/ForgotPasswordModal');
const InfoModal = require('components/GlobalModals/InfoModal/InfoModal');
const MediaPopup = require('components/GlobalModals/MediaPopup/MediaPopup');
const SampleModal = require('components/GlobalModals/SampleModal/SampleModal');
const VideoModal = require('components/GlobalModals/VideoModal/VideoModal');
const PromoModal = require('components/GlobalModals/PromoModal/PromoModal');
const ColorIQModal = require('components/GlobalModals/ColorIQModal/ColorIQModal');
const RewardModal = require('components/GlobalModals/RewardModal/RewardModal');
const QuickLookModal = require('components/GlobalModals/QuickLookModal/QuickLookModal');
const EmailMeWhenInStockModal = require('components/GlobalModals/EmailMeWhenInStockModal/EmailMeWhenInStockModal');
const CountrySwitcherModal = require('components/GlobalModals/CountrySwitcherModal/CountrySwitcherModal');
const CountrySwitcherPrompt = require('components/GlobalModals/CountrySwitcherModal/CountrySwitcherPrompt/CountrySwitcherPrompt');
const InternationalShippingModal = require('components/GlobalModals/InternationalShippingModal/InternationalShippingModal');
const AllReservationsModal = require('components/GlobalModals/AllReservationsModal/AllReservationsModal');
const TimeTradeModal = require('components/GlobalModals/TimeTradeModal/TimeTradeModal');
const EditMyProfileModal = require('components/RichProfile/EditMyProfile/Modals/EditMyProfileModal/EditMyProfileModal');
const EditFlowModal = require('components/RichProfile/EditMyProfile/Modals/EditFlowModal/EditFlowModal');
const ShareLinkModal = require('components/GlobalModals/ShareLinkModal/ShareLinkModal');
const SocialRegistrationModal = require('components/GlobalModals/SocialRegistrationModal/SocialRegistrationModal');
const SocialReOptModal = require('components/GlobalModals/SocialReOptModal/SocialReOptModal');
const ProductFinderModal = require('components/GlobalModals/ProductFinderModal/ProductFinderModal');
const FindInStoreModal = require('components/GlobalModals/FindInStore/FindInStoreModal/FindInStoreModal');
const FindInStoreMapModal = require('components/GlobalModals/FindInStore/FindInStoreMapModal/FindInStoreMapModal');
const UI = require('utils/UI');

const GlobalModalsWrapper = function () {
    this.state = {
        renderModals: false,
        showBccModal: false,
        bccModalTemplate: null,
        showQuickLookModal: false,
        showRegisterModal: false,
        showSignInModal: false,
        showApplePaySignIn: false,
        showBiRegisterModal: false,
        showForgotPasswordModal: false,
        showEmailMeWhenInStockModal: false,
        showInfoModal: false,
        showMoreReservationsModal: false,
        showTimeTradeModal: false,
        infoModalTitle: '',
        infoModalMessage: '',
        infoModalButtonText: '',
        infoModalCallback: null,
        infoModalCancelCallback: null,
        showInfoModalCancelButton: false,
        infoModalCancelText: '',
        infoModalMessageIsHtml: false,
        confirmMsgObj: {},
        showMediaModal: false,
        mediaModalId: '',
        mediaModalTitle: '',
        mediaModalClose: null,
        showSampleModal: false,
        showVideoModal: false,
        showPromoModal: false,
        showColorIQModal: false,
        colorIQModalCallback: null,
        showFindInStoreModal: false,
        showFindInStoreMapModal: false,
        currentProduct: null,
        selectedStore: null,
        storesToShow: null,
        sampleList: null,
        promosList: null,
        maxMsgSkusToSelect: 0,
        instructions: '',
        allowedQtyPerOrder: 0,
        samplesMessage: '',
        showRewardModal: false,
        rewardList: false,
        showCountrySwitchModal: false,
        showCountrySwitcherPrompt: false,
        showInternationalShippingModal: false,
        quickLookProduct: null,
        isQuickLook: null,
        skuType: null,
        quickLookSku: null,
        presetLogin: null,
        fName: null,
        lName: null,
        showEditMyProfileModal: false,
        showEditFlowModal: false,
        editFlowTitle: '',
        editFlowContent: null,
        biAccount: null,
        socialProfile: null,
        saveProfileCallback: null,
        showSocialRegistrationModal: false,
        isBi: false,
        socialRegistrationProvider: null,
        socialRegistrationCallback: null,
        socialRegistrationCancellationCallback: null,
        showSocialReOptModal: false,
        socialReOptCallback: null,
        socialReOptCancellationCallback: null,
        isCommunity: false,
        showProductFinderModal: false,
        guidedSellingData: null,
        zipCode: null,
        searchedDistance: null
    };
};

GlobalModalsWrapper.prototype.render = function () {
    let modalRender = () => {
        if (this.state.showBccModal) {
            return (
                <BccModal
                    modalState={this.state.showBccModal}
                    toggleFromParent={this.closeBccModal}
                    componentName={this.state.bccModalTemplate.componentName}
                    name={this.state.bccModalTemplate.name}
                    titleText={this.state.bccModalTemplate.titleText && !Sephora.isMobile()
                        ? this.state.bccModalTemplate.titleText : null}
                    titleImage={this.state.bccModalTemplate.titlePath
                        ? this.state.bccModalTemplate.titlePath : null}
                    isLarge={this.state.bccModalTemplate.design === 'Large' ? true : false}
                    isSmall={this.state.bccModalTemplate.design === 'Small' ? true : false}>
                    {
                        this.state.bccModalTemplate.components
                    }
                </BccModal>
            );
        }

        if (this.state.showSignInModal) {
            return (
                <SignInModal
                    isOpen={this.state.showSignInModal}
                    messages={this.state.signInMessages}
                    callback={this.state.signInCallback}
                    errback={this.state.signInErrback}
                    isNewUserFlow={this.state.isNewUserFlow}
                    isPlaySubscriptionOrder={this.props.signInData.isPlaySubscriptionOrder}
                    isEmailDisabled={this.props.signInData.isEmailDisabled}
                    isRadioDisabled={this.props.signInData.isRadioDisabled}
                    isSSIEnabled={this.props.signInData.isSSIEnabled} />
            );
        }

        if (this.state.showRegisterModal) {
            return (
                <RegisterModal
                    isOpen={this.state.showRegisterModal}
                    isSSIEnabled={this.props.registrationData.isSSIEnabled}
                    isCaptchaEnabled={this.props.registrationData.isCaptchaEnabled}
                    isEmailDisabled={this.props.registrationData.isEmailDisabled}
                    presetLogin={this.state.presetLogin}
                    isStoreUser={this.state.isStoreUser}
                    biData={this.state.biData}
                    callback={this.state.registerCallback}
                    errback={this.state.registerErrback}
                />
            );
        }

        //showBiRegisterModal must come before showQuickLookModal due to order of appearance
        if (this.state.showBiRegisterModal) {
            return (<BiRegisterModal
                isOpen={this.state.showBiRegisterModal}
                callback={this.state.biRegisterCallback}
                cancellationCallback={this.state.biRegisterCancellationCallback}
                isCommunity={this.state.isCommunity}
            />);
        }

        if (this.state.showQuickLookModal) {
            return (
                <QuickLookModal
                    isOpen={this.state.showQuickLookModal}
                    product={this.state.quickLookProduct}
                    skuType={this.state.skuType}
                    sku={this.state.quickLookSku}
                    isCertonaProduct={this.state.isCertonaProduct} />
            );
        }

        if (this.state.showEmailMeWhenInStockModal) {
            return (<EmailMeWhenInStockModal
                isOpen={this.state.showEmailMeWhenInStockModal}
                product={this.state.emailInStockProduct}
                currentSku={this.state.emailInStockSku}
                isQuickLook={this.state.isQuickLook}
                alreadySubscribed={this.state.emailInStockProduct.currentSku &&
                    this.state.emailInStockProduct.currentSku.actionFlags && 
                    this.state.emailInStockProduct.currentSku.actionFlags.backInStockReminderStatus === 'active'
                }
            />);
        }

        if (this.state.showCountrySwitcherModal) {
            return (
                <CountrySwitcherModal
                    isOpen={this.state.showCountrySwitcherModal}
                    desiredCountry={this.state.desiredCountry}
                    desiredLang={this.state.desiredLang}
                    switchCountryName={this.state.switchCountryName} />
            );
        }

        if (this.state.showForgotPasswordModal) {
            return (
                <ForgotPasswordModal
                    isOpen={this.state.showForgotPasswordModal}
                    presetLogin={this.state.presetLogin} />
            );
        }

        if (this.state.showInfoModal) {
            return (
                <InfoModal
                    isOpen={this.state.showInfoModal}
                    title={this.state.infoModalTitle}
                    message={this.state.infoModalMessage}
                    isHtml={this.state.infoModalMessageIsHtml}
                    buttonText={this.state.infoModalButtonText}
                    cancelText={this.state.infoModalCancelText}
                    showCancelButton={this.state.showInfoModalCancelButton}
                    callback={this.state.infoModalCallback}
                    cancelCallback={this.state.infoModalCancelCallback}
                    confirmMsgObj={this.state.confirmMsgObj} />
            );
        }

        if (this.state.showMediaModal) {
            return (
                <MediaPopup
                    showContent={true}
                    isOpen={this.state.showMediaModal}
                    mediaId={this.state.mediaModalId}
                    title={this.state.mediaModalTitle}
                    onClose={this.state.mediaModalClose}/>
            );
        }

        if (this.state.showSampleModal) {
            return (
                <SampleModal
                    showContent={true}
                    isOpen={this.state.showSampleModal}
                    sampleList={this.state.sampleList}
                    allowedQtyPerOrder={this.state.allowedQtyPerOrder}
                    samplesMessage={this.state.samplesMessage} />
            );
        }

        if (this.state.showVideoModal) {
            return (
                <VideoModal
                    showContent={true}
                    isOpen={this.state.showVideoModal}
                    videoTitle={this.state.videoTitle}
                    videoModalUpdated={this.state.videoModalUpdated}
                    video={this.state.video}/>
            );
        }

        if (this.state.showPromoModal) {
            return (
                <PromoModal
                    showContent={true}
                    isOpen={this.state.showPromoModal}
                    promosList={this.state.promosList}
                    maxMsgSkusToSelect={this.state.maxMsgSkusToSelect}
                    instructions= {this.state.instructions}/>
            );
        }

        if (this.state.showColorIQModal) {
            return (
                <ColorIQModal
                    isOpen={this.state.showColorIQModal}
                    callback={this.state.colorIQModalCallback} />
            );
        }

        if (this.state.showRewardModal) {
            return (
                <RewardModal
                    showContent={true}
                    isOpen={this.state.showRewardModal} />
            );
        }

        if (this.state.showCountrySwitcherPrompt) {
            return (
                <CountrySwitcherPrompt
                    isOpen={this.state.showCountrySwitcherPrompt} />
            );
        }

        if (this.state.showMoreReservationsModal) {
            return (
                <AllReservationsModal
                    isOpen={this.state.showMoreReservationsModal}
                    upcomingReservations={this.state.upcomingReservations}
                    previousReservations={this.state.previousReservations}
                    addReservationUrl={this.state.addReservationUrl}
                    editReservationUrl={this.state.editReservationUrl} />
            );
        }

        if (this.state.showTimeTradeModal) {
            return (
                <TimeTradeModal
                    isOpen={this.state.showTimeTradeModal}
                    timeTradeUrl={this.state.timeTradeUrl}
                    appointmentId={this.state.appointmentId}
                    clientLastName={this.state.clientLastName} />
            );
        }

        if (this.state.showInternationalShippingModal) {
            return (
                <InternationalShippingModal
                    isOpen={this.state.showInternationalShippingModal} />
            );
        }

        if (this.state.showSocialRegistrationModal) {
            return (
                <SocialRegistrationModal
                    isOpen={this.state.showSocialRegistrationModal}
                    socialRegistrationProvider={this.state.socialRegistrationProvider}
                    socialRegistrationCallback={this.state.socialRegistrationCallback}
                    cancellationCallback=
                        {this.state.socialRegistrationCancellationCallback} />
            );
        }

        if (this.state.showSocialReOptModal) {
            return (
                <SocialReOptModal
                    isOpen={this.state.showSocialReOptModal}
                    socialReOptCallback={this.state.socialReOptCallback}
                    cancellationCallback={this.state.socialReOptCancellationCallback} />
            );
        }

        if (this.state.showEditFlowModal) {
            return (
                <EditFlowModal
                    isOpen={this.state.showEditFlowModal}
                    title={this.state.editFlowTitle}
                    content={this.state.editFlowContent}
                    biAccount={this.state.biAccount}
                    socialProfile={this.state.socialProfile}
                    saveProfileCallback={this.state.saveProfileCallback} />
            );
        }

        if (this.state.showEditMyProfileModal) {
            return (
                <EditMyProfileModal
                    isOpen={this.state.showEditMyProfileModal} />
            );
        }

        if (this.state.showProductFinderModal) {
            return (
                <ProductFinderModal
                    isOpen={this.state.showProductFinderModal}
                    bccData={this.state.guidedSellingData} />
            );
        }

        if (this.state.showShareLinkModal) {
            return (
                <ShareLinkModal
                    isOpen={this.state.showShareLinkModal}
                    title={this.state.title}
                    shareUrl={this.state.shareUrl} />
            );
        }

        if (this.state.showFindInStoreModal) {
            return (
                <FindInStoreModal
                    isOpen={this.state.showFindInStoreModal}
                    currentProduct={this.state.currentProduct}
                    zipCode={this.state.zipCode}
                    searchedDistance={this.state.searchedDistance}
                    storesToShow={this.state.storesToShow}/>
            );
        }

        if (this.state.showFindInStoreMapModal) {
            return (
                <FindInStoreMapModal
                    isOpen={this.state.showFindInStoreMapModal}
                    currentProduct={this.state.currentProduct}
                    selectedStore={this.state.selectedStore}
                    zipCode={this.state.zipCode}
                    searchedDistance={this.state.searchedDistance}
                    storesToShow={this.state.storesToShow}/>
            );
        }

        //if no global modal is returned (modal was closed), set body overflow to auto
        if (!Sephora.isRootRender) {
            document.body.style.overflowY = 'auto';

            /* only for iOS devices */
            if (UI.isIOS()) {
                UI.unlockBackgroundPosition();
            }
        }

        return null;
    };

    return (
        <div>
            {
                !this.state.renderModals ? '' : modalRender()
            }
        </div>
    );
};


// Added by sephora-jsx-loader.js
GlobalModalsWrapper.prototype.path = 'GlobalModals/GlobalModalsWrapper';
// Added by sephora-jsx-loader.js
Object.assign(GlobalModalsWrapper.prototype, require('./GlobalModalsWrapper.c.js'));
var originalDidMount = GlobalModalsWrapper.prototype.componentDidMount;
GlobalModalsWrapper.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: GlobalModalsWrapper');
if (originalDidMount) originalDidMount.apply(this);
if (GlobalModalsWrapper.prototype.ctrlr) GlobalModalsWrapper.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: GlobalModalsWrapper');
// Added by sephora-jsx-loader.js
GlobalModalsWrapper.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
GlobalModalsWrapper.prototype.class = 'GlobalModalsWrapper';
// Added by sephora-jsx-loader.js
GlobalModalsWrapper.prototype.getInitialState = function() {
    GlobalModalsWrapper.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
GlobalModalsWrapper.prototype.render = wrapComponentRender(GlobalModalsWrapper.prototype.render);
// Added by sephora-jsx-loader.js
var GlobalModalsWrapperClass = React.createClass(GlobalModalsWrapper.prototype);
// Added by sephora-jsx-loader.js
GlobalModalsWrapperClass.prototype.classRef = GlobalModalsWrapperClass;
// Added by sephora-jsx-loader.js
Object.assign(GlobalModalsWrapperClass, GlobalModalsWrapper);
// Added by sephora-jsx-loader.js
module.exports = GlobalModalsWrapperClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/GlobalModalsWrapper/GlobalModalsWrapper.jsx