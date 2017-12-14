// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var ProductFinderModal = function () {};

// Added by sephora-jsx-loader.js
ProductFinderModal.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
/* TODO: renable */
/* eslint-disable max-len */
const processEvent = require('analytics/processEvent');
const anaConsts = require('analytics/constants');

const showProductFinderModal = require('Actions').showProductFinderModal;
const store = require('Store');
const loadScripts = require('utils/LoadScripts');
const certonaUtils = require('utils/certona.js');
const updateProductFinderData = require('actions/CertonaActions').updateProductFinderData;
const isQuizSubmitted = require('actions/CertonaActions').isQuizSubmitted;
const UI = require('utils/UI');

const MAX_NUM_QUIZ_RESULTS = 20;

let productFinderScriptsLoaded = false;

let productFinderScript = 'https://s.certona.net/Sephora/ProductFinder/'+ 
        (Sephora.UFE_ENV === 'PROD' ? 'Production' : 'Development') + 
        '/productfinder.certona.sephora.min.js';

const scripts = [
    'https://s.certona.net/Shared/ProductFinder/resxclsx.js',
    productFinderScript
];

ProductFinderModal.prototype.ctrlr = function () {

    const templates = `<div id="divProductFinderPreview">
        <div id="divProgressBarContainer">
            <div id="${this.props.bccData.progressBarElementID}"></div>
            <div id="product-finder-progress-outer">
                <div id="product-finder-progress-inner"></div>
            </div>
        </div>
        <div id="divQuestionnaireContent">
            <div id="${this.props.bccData.insertionElementID}"></div>
        </div>
    </div>

    <!--Start Progress Bar Template-->
    <script type="text/x-handlebars-template" id="progress-bar">
        <div class="percent-text">
            {{percent}}% Complete
        </div>
    </script>
    <!--End Progress Bar Template-->

    <!--Start Select One Template-->
    <script type="text/x-handlebars-template" id="select_one">
        <div class="question">
            <div class="backContainer">
                <button class="insight-submit-btn" id="back" {{#unless showBackButton}}disabled{{/unless}}>Back</button>
            </div>
            <div class="productfinder-question-title">{{questionText}}</div>

            <div class="options">
                {{#each answers}}
                    <div class="certona-pf-input-container select-one{{#if selected}} selected{{/if}}  {{#if imageUrl}}has-img{{/if}}" data-answer-id="{{answerId}}" id="q{{../questionId}}_a{{answerId}}">
                        <input class="certona-pf-input-hidden" />
                        {{#if imageUrl}}<img class="productfinder-answer-image" src="{{imageUrl}}" border="0" />{{/if}}
                        <label class="productfinder-answer-text">{{answerText}}</label>
                        {{#if answerInfo}}
                            <div class="answer-info"></div>
                        {{/if}}
                    </div>
                {{/each}}
            </div>
            <div class="continueContainer">
                <button class="insight-submit-btn" disabled>Next</button>
            </div>
        </div>
    </script>
    <!--End Select One Template-->

    <!--Start Multi-Select Template-->
    <script type="text/x-handlebars-template" id="multi_select">
        <div class="question">
            <div class="backContainer">
                <button class="insight-submit-btn" id="back" {{#unless showBackButton}}disabled{{/unless}}>Back</button>
            </div>
            <div class="productfinder-question-title">{{questionText}}</div>
            <div class="options">
                {{#each answers}}
                    <div class="certona-pf-input-container multi-select {{#unless selected}}un{{/unless}}selected {{#if imageUrl}}has-img{{/if}}" data-answer-id="{{answerId}}" id="q{{../questionId}}_a{{answerId}}">
                        <input class="certona-pf-input-hidden" />
                        {{#if imageUrl}}<img class="productfinder-answer-image" src="{{imageUrl}}" border="0" />{{/if}}
                        <label class="productfinder-answer-text">{{answerText}}</label>
                        {{#if answerInfo}}
                            <div class="answer-info"></div>
                        {{/if}}
                    </div>
                {{/each}}
            </div>
            <div class="continueContainer">
                <button class="insight-submit-btn question{{questionId}}" id="multi-select-continue">Next</button>
            </div>
        </div>
    </script>
    <!--End Multi-Select Template-->`;

    let productFinderSetup = () => {
        this.setState({ content: templates }, () => this.productFinderSetup());
    };

    if (!productFinderScriptsLoaded) {
        loadScripts(scripts, productFinderSetup);

        productFinderScriptsLoaded = true;
    } else {
        productFinderSetup();
    }

};

ProductFinderModal.prototype.requestClose = function (e) {
    store.dispatch(showProductFinderModal(false));

    // Disconnect questions observer
    if (this.questionsObserver) {
        this.questionsObserver.disconnect();
    }

    const quizResultsValue = `productfinder:${this.props.bccData.name}:n/a:*results`;
    processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
        data: { 
            pageName: quizResultsValue,
            pageDetail: quizResultsValue,
            pageType: anaConsts.PAGE_TYPES.PRODUCT_FINDER
        } 
    });
};

ProductFinderModal.prototype.productFinderSetup = function () {
    let _this = this;

    /* TODO 17.6c - Fix this to use correct application ID based on environment and BCC data */
    var pf = new CertonaProductFinder({
        surveyId: Sephora.isMobile() ? this.props.bccData.mobileSurveyNumber
            : this.props.bccData.desktopSurveyNumber,
        applicationId: certonaUtils.getApplicationId(),
        token: 'Sephoraapi|AA07C05588D8464CAAF5AA80C79F8C5C',
        render: function () {
            _this.scrollQuestionToTop();
        },
        finishFunction: function (settings) {

            window.resx.rrqs = settings.filters;
            window.resx.event = 'surveyresults';
            window.resx.itemid = 'ProductFinder';
            window.resx.rrelem = _this.props.bccData.containerName;
            window.resx.rrnum = MAX_NUM_QUIZ_RESULTS;
            window.resx.rrec = true;
            window.resx.rrcall = 'Sephora.certonaProductFinder';

            certonaResx.run();

            _this.requestClose();
        }
    });

    // TODO: Delete once render function is fully tested
    // Certona provided a render function. Keeping setUpQuestionsDomObserver as a
    // backup as backup. 
    /*if (Sephora.isMobile()) {
        this.setUpQuestionsDomObserver();
    }*/

    certonaUtils.injectCertona();

    pf.startSurvey();
};

ProductFinderModal.prototype.setUpQuestionsDomObserver = function () {
    // Questions DOM wrapper.
    const questionsWrapper = document.getElementById('divQuestionnaireContent');

    if (questionsWrapper) {
        // Observer configuration.
        const observerConfig = {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        };

        // Create a new observer.
        // TODO: Remove observer once Certona adds a way to tell if the questions changed
        this.questionsObserver = UI.observeElement(this.scrollQuestionToTop);

        if (this.questionsObserver) {
            this.questionsObserver.observe(
                questionsWrapper, observerConfig
            );
        }
    }
};

ProductFinderModal.prototype.scrollQuestionToTop = function () {
    // We need to reset the scroll in this element.
    const scrollableEl = document.getElementById('productFinderModalScrollable');

    if (scrollableEl) {
        UI.scrollElementToTop(scrollableEl);
    }
};

Sephora.certonaProductFinder = function (recs) {
    store.dispatch(updateProductFinderData(recs));
    store.dispatch(isQuizSubmitted(true));
};


// Added by sephora-jsx-loader.js
module.exports = ProductFinderModal.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/ProductFinderModal/ProductFinderModal.c.js