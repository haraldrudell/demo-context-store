// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var BccVideo = function () {};

// Added by sephora-jsx-loader.js
BccVideo.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
import { PropTypes } from 'react';

const shortId = require('shortid');
const loadScripts = require('utils/LoadScripts');
const ooyala = require('utils/ooyala');
// const anaUtils = require('analytics/utils');
const store = require('Store');
const Actions = require('Actions');
const utilityApi = require('services/api/utility');

let ooyalaScriptsRequested = false;

// TODO: revisit - having this here makes unit testing difficult because the require cahe does *not*
// seem to be correctly clearing between each test - this means that this variable is bleeding over
// between tests
let ooyalaReady = false;

const ooyalaLoader = [];


/**
 * Adds a player to the script load waiting queue.
 */
const queuePlayer = (player) => ooyalaLoader.push(player);

/**
 * Initializes all of the queued players.
 */
// TODO: move this back to a const once loadScripts has been fixed to be stubbable.  This is
// currently atached to BccVideo.prototype purely for testing purposes
BccVideo.prototype.loadPlayers = () => {
    ooyalaReady = true;
    ooyalaLoader.splice(0).forEach((currentPlayer) => currentPlayer.createPlayer());
};

/**
 * Array to keep track of videos clicked for analytics.
 */
const videoClicks = [];

/**
 * Loads a list of scripts and fires a callback when done.
 */

BccVideo.prototype.ctrlr = function () {
    this.setState({ id: shortId.generate() }, () => {
        if (this.videoWrapper) {
            this.initOoyalaPlayer();
        }
    });

    if (!ooyalaScriptsRequested) {
        this.setStylesheet();
        loadScripts([
            ooyala.external.core, ooyala.external.plugin, ooyala.external.skin,
            ooyala.external.heartBeat, ooyala.external.appMeasurement, ooyala.external.visitorApi,
            ooyala.external.omniture
        ], () => {
            global.OO.ready(this.loadPlayers);
        });

        ooyalaScriptsRequested = true;
    }

    if (!this.props.startImagePath) {
        this.setVideoThumbnail();
    }
};

BccVideo.prototype.setStylesheet = function () {
    const head = document.querySelectorAll('head')[0];
    const link = document.createElement('link');
    link.href = '/js/ufe/' + Sephora.buildMode + '/thirdparty/ooyala/html5-skin.min.css';
    link.rel = 'stylesheet';
    head.appendChild(link);
};

BccVideo.prototype.videoModalUpdated = function (videoContainer) {
    let isVideoModalOpen = !!videoContainer;

    if (isVideoModalOpen) {
        this.initOoyalaPlayer();
        this.modalVideoPlayerIsReady(isVideoModalOpen);
    } else {
        this.modalVideoPlayerIsReady(isVideoModalOpen);
        if (this.player) {
            this.player.destroy();
            delete this.player;
        }
    }
};

BccVideo.prototype.modalVideoPlayerIsReady = function (isVideoModalOpen) {
    if (!this.player) {
        return;
    }

    if (isVideoModalOpen) {

        // Plays de video
        this.player.play();

        this.trackPlay();
    } else {

        // Pauses the video
        this.player.pause();

        // Resets the video
        this.player.seek(0);
    }
};

BccVideo.prototype.openVideoModal = function () {
    store.dispatch(Actions.showVideoModal({
        isOpen: true,
        videoTitle: this.props.videoTitle,
        videoModalUpdated: this.videoModalUpdated.bind(this),
        video: this.video
    }));
};

BccVideo.prototype.trackPlay = function () {
    if (videoClicks.indexOf(this.props.ooyalaId) === -1) {
        videoClicks.push(this.props.ooyalaId);
        require('analytics/processEvent').process(
            require('analytics/constants').LINK_TRACKING_EVENT,
            {
                data: {
                    bindingMethods: require('analytics/bindings/pages/all/videoLoad'),
                    eventStrings: ['event102'],
                    internalCampaign: this.props.name + ':play',
                    videoName: [this.props.name, this.props.ooyalaId]
                }
            }
        );
    }
};

BccVideo.prototype.initOoyalaPlayer = function () {
    if (ooyalaReady) {
        this.createPlayer();
    } else {
        queuePlayer(this);
    }
};

BccVideo.prototype.createPlayer = function () {
    if (this.player) {
        return;
    }

    /*
    //Analytics
    //This data isn't ready/available earlier, so set it here
    this.playerParam.omniture.pageName = digitalData.page.attributes.sephoraPageInfo.pageName;
    this.playerParam.omniture.visitorId =
        anaUtils.safelyReadProperty('digitalData.user.0.profile.0.profileInfo.profileID');
    this.playerParam.omniture.reportSuiteId = digitalData.page.attributes.reportSuiteId;

    //Data specific to this video
    //TODO: set s.eVar53= "[page]_[video name]_[video id]" & set s.prop72 = "[Video Name]"

    //End Analytics
    */

    this.player = global.OO.Player.create(
        this.state.id, this.props.ooyalaId, this.playerParam
    );
};

BccVideo.prototype.componentWillUnmount = function () {
    if (this.player) {
        this.player.destroy();
    }
};

BccVideo.prototype.setVideoThumbnail = function () {
    return utilityApi.getOoyalaVideo(this.props.ooyalaId).
        then(data => {
            const thumbnail = data.content.items[0] ?
                    data.content.items[0].preview_image_url_ssl : null;
            this.setState({ thumbnail });
        });
};

BccVideo.prototype.PropTypes = {
    ooyalaId: PropTypes.string.isRequired,
    ooyalaBranding: PropTypes.string.isRequired,
    ooyalaPcode: PropTypes.string.isRequired
};


// Added by sephora-jsx-loader.js
module.exports = BccVideo.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Bcc/BccVideo/BccVideo.c.js