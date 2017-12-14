// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

/* eslint-disable max-len */
const { zIndex } = require('style');
const { Box } = require('components/display');
const TOKY_WOKY_PROD_ID = '340';

const TokyWoky = function () {
    this.state = {
        isTokyWokyReady: false
    };
};

TokyWoky.prototype.postLoad = true;

TokyWoky.prototype.render = function () {
    let chatEnabled = true;
    let testAndTargetHide = this.props.targetResults && this.props.targetResults.hideChat;
    if (testAndTargetHide) {
        chatEnabled = false;
    }
    let showChat = chatEnabled && this.props.targetResolved && Sephora.configurationSettings.isPPagesChatEnabled;

    return (
        <div>
            {this.state.isTokyWokyReady && (showChat || this.props.isCommunitySignIn) &&
                <Box
                    zIndex={zIndex.CHAT}>
                    <div id='toky' />
                    <script
                        type='text/javascript'
                        dangerouslySetInnerHTML={{
                            __html: `
                            var toky_auth_apiKey = ${JSON.stringify(this.state.tokyWokyAuthPublicKey)};
                            var toky_auth_message = ${JSON.stringify(this.state.tokyWokyAuthMessage)};
                            var toky_auth_hmac = ${JSON.stringify(this.state.tokyWokyAuthHmac)};
                            var toky_auth_timestamp =
                                ${JSON.stringify(this.state.tokyWokyAuthTimestamp)};

                            (function () {
                                let toky = global.window.document.createElement('script');
                                toky.type = 'text/javascript';
                                toky.async = true;
                                let tokyClientId = Sephora.configurationSettings.tokyWoky ?
                                    Sephora.configurationSettings.tokyWoky.customerId :
                                    TOKY_WOKY_PROD_ID;
                                toky.src = '//sephora.d-tokywoky.com/webview/' +
                                    tokyClientId + '/embed.js';
                                (global.window.document.getElementsByTagName('head')[0] ||
                                    global.window.document.getElementsByTagName('body')[0])
                                    .appendChild(toky);
                            }());`
                        }} />
                </Box>
            }
        </div>
    );
};


// Added by sephora-jsx-loader.js
TokyWoky.prototype.path = 'TokyWoky';
// Added by sephora-jsx-loader.js
Object.assign(TokyWoky.prototype, require('./TokyWoky.c.js'));
var originalDidMount = TokyWoky.prototype.componentDidMount;
TokyWoky.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: TokyWoky');
if (originalDidMount) originalDidMount.apply(this);
if (TokyWoky.prototype.ctrlr) TokyWoky.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: TokyWoky');
// Added by sephora-jsx-loader.js
TokyWoky.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
TokyWoky.prototype.class = 'TokyWoky';
// Added by sephora-jsx-loader.js
TokyWoky.prototype.getInitialState = function() {
    TokyWoky.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
TokyWoky.prototype.render = wrapComponentRender(TokyWoky.prototype.render);
// Added by sephora-jsx-loader.js
var TokyWokyClass = React.createClass(TokyWoky.prototype);
// Added by sephora-jsx-loader.js
TokyWokyClass.prototype.classRef = TokyWokyClass;
// Added by sephora-jsx-loader.js
Object.assign(TokyWokyClass, TokyWoky);
// Added by sephora-jsx-loader.js
module.exports = TokyWokyClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/TokyWoky/TokyWoky.jsx