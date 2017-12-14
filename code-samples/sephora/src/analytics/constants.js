/**
 * Constants for analytics.
 * These are not really constants as they are ultimately mutable properties
 * of an object, but they still serve their purpose of providing an alias
 * which can be used instead of a string.
 */

module.exports = (function () {
    const ASYNC_PAGE_LOAD = 'asyncPageLoad';
    const PAGE_LOAD = 'pageLoadEvent';
    const PRODUCT_PAGE_LOAD = 'productPageLoad';
    const LINK_TRACKING_EVENT = 'linkTrackingEvent';
    const DOUBLE_CLICK_FOOTER = 'doubleClickFooter';
    const DOUBLE_CLICK_PRODUCT_PAGE = 'doubleClickProductPage';

    /* Quick Look Events */
    const QUICK_LOOK_LOAD = 'quickLookLoad';

    /* Sign-In Events */
    const SIGN_IN_MODAL_LOAD = 'signInModalLoad';
    const SIGN_IN_SUCCESS = 'signInSuccess';
    const SIGN_IN_PAGE_TYPE_DETAIL = 'sign in';

    /* Registration Events */
    const REGISTER_MODAL_LOAD = 'registerModalLoad';

    /* End Quick Look Events */

    /* Used for Context */
    const QUICK_LOOK_MODAL = 'quickLookModal';

    /* SIGNAL (Tag Management System)
    ** The below constants are needed because Signal does not have find and replace.
    ** These will be referenced within Signal instead of being called directly so that we can make
    ** updates here and references will still point to the actual method, value, etc. */

    //This gets populated in loadAnalytics.js, to avoid a circular reference problem.
    let GET_MOST_RECENT_EVENT = function () {};

    /* End Signal Constants */

    const PAGE_VARIANTS = {
        SWATCHES: '1',
        ONLY_FEW_LEFT: '2',
        ALTERNATE_IMAGES: '3',
        HERO_VIDEOS: '4',
        HOW_TO_USE_TAB: '5',
        INGREDIENTS_TAB: '6',
        USE_IT_WITH: '7',
        EXPLORE_VIDEOS: '8',
        EXPLORE_ARTICLES: '9',
        EXPLORE_LOOKS: '10',
        YOU_MIGHT_ALSO_LIKE: '11',
        SIMILAR_PRODUCTS: '12',
        RECENTLY_VIEWED: '13',
        FIND_IN_A_STORE: '14'
    };

    const CUSTOMIZABLE_SETS_VARIANTS = {
        NOT_CUSTOMIZABLE: 0,
        IS_CUSTOMIZABLE_CHOOSE_FREE_ITEM: '1',
        IS_CUSTOMIZABLE: '2'
    };

    const REFERRER_DOMAINS = [
        'google.', 'bing.', 'a9.', '*, q', 'abacho.', 'ah-ha.', 'alexa.', 'allesklar.', 'wo,words',
        'alltheweb.', 'q,query', 'altavista.', 'aol.', 'arianna.', 'query,b1', 'asiaco.',
        'query,qry', 'ask.', 'q,ask', 'atlas.', 'austronaut.', 'begriff,suche', 'auyantepui.',
        'clave', 'bluewin.', 'qry,q', 'centrum.', 'club-internet.', 'dino-online.', 'dir.com.',
        'req', 'dmoz.', 'search', 'dogpile.', 'q,qkw', 'eniro.', 'euroseek.', 'string,query',
        'exalead.', 'excite.', 'search,s,qkw', 'findlink.', 'key', 'findwhat.', 'mt', 'fireball.',
        'freeserve.', 'gigablast.', 'go2net.', 'general', 'goeureka.', 'key', 'q,as_q,as_epq,as_oq',
        'googlesyndication.', 'url', 'greekspider.', 'keywords', 'hotbot.', 'query,mt', 'ilor.',
        'iltrovatore.', 'index.nana.co.il.', 'infoseek.', 'qt,q', 'infospace.', 'qkw',
        'intuitsearch.', 'iwon.', 'ixquick.', 'jubii.', 'query,soegeord', 'jyxo.', 'kanoodle.',
        'kataweb.', 'kvasir.', 'live.', 'looksmart.', 'qt,key,querystring', 'lycos.',
        'query,mt,q,qry', 'mamma.', 'metacrawler.', 'q,general,qry', 'msn.', 'q,mt', 'mywebsearch.',
        'searchfor', 'mysearch.', 'netex.', 'srchkey,keyword', 'netscape.',
        'search,searchstring,query', 'netster.', 'nettavisen.', 'query,q', 'ninemsn.', 'nlsearch.',
        'qr', 'nomade.', 'mt,s', 'northernlight.', 'oozap.', 'overture.', 'ozu.', 'passagen.',
        'quick.', 'ftxt_query', 'savvy.', 'scrubtheweb.', 'keyword,q', 'www.search.com.',
        'searchalot.', 'searchhippo.', 'sensis.', 'find', 'seznam.', 'w', 'soneraplaza.', 'qt',
        'splatsearch.', 'searchstring', 'sprinks.', 'terms', 'spray.', 'srch.', 'supereva.',
        'teoma.', 'thunderstone.', 'tiscali.ch.', 'key', 'tjohoo.', 'soktext,mt,query', 'track.',
        'truesearch.', 'tygo.', 'vinden.', 'virgilio.', 'qs', 'vivisimo.', 'voila.', 'kw', 'walla.',
        'wanadoo.', 'fkw', 'web.', 'su', 'webcrawler.', 'qkw,search,searchtext', 'webwatch.',
        'findindb', 'wepa.', 'query', 'wisenut.', 'xpsn.', 'kwd', 'ya.', 'yahoo.', 'p,va,vp,vo',
        'ynet.', 'zerx.'];

    // The most up-to-date event dictionary is supposed to be under
    // the following link:
    // jscs:disable maximumLineLength
    // https://jira.sephora.com/wiki/pages/viewpage.action
    // ?spaceKey=ANLYTX&title=SiteCatalyst+Variable+Mapping+and+Reports
    const Event = {

        INTERNAL_SEARCH: 'event1',

        EMAIL_OPT_IN: 'event6',

        REGISTRATION_WITH_BI: 'event11',
        REGISTRATION_WITHOUT_BI: 'event12',
        REGISTRATION_STEP_1: 'event14',
        REGISTRATION_SUCCESSFUL: 'event15',

        CAPTCHA_ENTERED: 'event39',
        CAPTCHA_FAILED: 'event65',

        SIGN_IN_SUCCESS: 'event100',
        SIGN_IN_ATTEMPT: 'event140',
        SIGN_IN_FAILED: 'event141',
        UPLOAD_PROFILE_PHOTO: 'event180',
        EDIT_ABOUT_ME_TEXT: 'event181',
        PRODUCT_VIEW: 'event24',
        PRODUCT_PAGE_VIEW: 'event200',
        PRODUCT_PAGE_COLORIQ_ENABLED: 'event201',

        // TODO: Assign better names to these constants
        EVENT_4: 'event4',
        EVENT_17: 'event17',
        EVENT_27: 'event27',
        EVENT_28: 'event28',
        ATB_FROM_BASKET_LOVE_CAROUSEL: 'event36',
        EVENT_37: 'event37',
        EVENT_61: 'event61',
        EVENT_71: 'event71',
        EVENT_86: 'event86',
        EVENT_102: 'event102',
        FLASH_ROUGE_ENROLL: 'event128',
        SC_VIEW: 'scView',
        SC_REMOVE: 'scRemove',
        SC_ADD: 'scAdd',

        ADD_REVIEW_RATE_AND_REVEW: 'event148',
        ADD_REVIEW_CONFIRMATION: 'event149'
    };

    const EVENT_NAMES = {
        ADD_TO_BASKET: 'add_to_basket',
        ADD_TO_LOVES: 'add_to_loves',
        REMOVE_FROM_LOVES: 'remove_from_loves',
        CERTONA_IMPRESSION: 'certona_impression',
        HERO_VIDEO_CLICK: 'HERO_VIDEO_CLICK'
    };

    const CONTEXT = {
        BASKET_PRODUCT: 'product',
        BASKET_SAMPLES: 'basket_samples',
        BASKET_REWARDS: 'basket_rewards',
        BASKET_LOVES: 'basket_loves',
        USE_IT_WITH: 'use it with',
        ADD_FLASH_BASKET_BANNER: 'add flash in basket banner',
        ROUGE_ENROLL_FLASH: 'rouge_enroll_flash'
    };

    const CAMPAIGN_STRINGS = {
        ADD_TO_BASKET: 'add-to-basket',
        ENROLL_IN_FLASH: 'flash basket banner:enroll in flash',
        ADD_FLASH_IN_BASKET_BANNER: 'flash basket banner:add to basket'
    };

    const LinkData = {
        SSI: 'stay signed in',
        SELECT_SAMPLES: 'basket:select samples:top',
        SELECT_REWARDS: 'basket:redeem rewards:top',
        CHECKOT_BUTTON_STANDARD: 'checkout:payment:standard',
        ENROLL_IN_FLASH: 'Enroll in Flash'
    };

    const PAGE_NAMES = {
        HOMEPAGE: 'home page',
        BASKET: 'basket',
        LISTS_MAIN: 'lists-main',
        MY_ACCOUNT: 'my-account',
        PROFILE: 'my-profile'
    };

    const PAGE_TYPES = {
        HOMEPAGE: 'home page',
        BASKET: 'basket',
        USER_PROFILE: 'user profile',
        COMMUNITY_PROFILE: 'cmnty profile',
        PRODUCT_FINDER: 'productfinder',
        PRODUCT: 'product'
    };

    return {
        ASYNC_PAGE_LOAD,
        PAGE_LOAD,
        PRODUCT_PAGE_LOAD,
        QUICK_LOOK_LOAD,
        GET_MOST_RECENT_EVENT,
        LINK_TRACKING_EVENT,
        DOUBLE_CLICK_FOOTER,
        DOUBLE_CLICK_PRODUCT_PAGE,
        SIGN_IN_MODAL_LOAD,
        SIGN_IN_SUCCESS,
        SIGN_IN_PAGE_TYPE_DETAIL,
        REGISTER_MODAL_LOAD,
        QUICK_LOOK_MODAL,
        REFERRER_DOMAINS,
        Event,
        EVENT_NAMES,
        CONTEXT,
        CAMPAIGN_STRINGS,
        LinkData,
        PAGE_NAMES,
        PAGE_TYPES,
        PAGE_VARIANTS,
        CUSTOMIZABLE_SETS_VARIANTS
    };

}());



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/constants.js