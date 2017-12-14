webpackJsonp([1],{

/***/ "./src/build/postLoadList.js":
/*!***********************************!*\
  !*** ./src/build/postLoadList.js ***!
  \***********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	TokyWoky: function TokyWoky() {
		return __webpack_require__(/*! ../components/TokyWoky/TokyWoky.jsx */ "./src/components/TokyWoky/TokyWoky.jsx");
	},
	Footer: function Footer() {
		return __webpack_require__(/*! ../components/Footer/Footer.jsx */ "./src/components/Footer/Footer.jsx");
	}
};

// WEBPACK FOOTER //
// ./public_ufe/js/build/postLoadList.js

/***/ }),

/***/ "./src/components/Footer/Footer.c.js":
/*!*******************************************!*\
  !*** ./src/components/Footer/Footer.c.js ***!
  \*******************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Added by sephora-jsx-loader.js

// Added by sephora-jsx-loader.js

var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = __webpack_require__(/*! utils/framework/wrapComponentRender */ "./src/utils/framework/wrapComponentRender.js");

// Added by sephora-jsx-loader.js
var wrapComponentRender = __webpack_require__(/*! utils/framework/wrapComponentRender */ "./src/utils/framework/wrapComponentRender.js").wrapComponentRender;

// Added by sephora-jsx-loader.js
var Footer = function Footer() {};

// Added by sephora-jsx-loader.js
Footer.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
var store = __webpack_require__(/*! Store */ "./src/store/Store.js");
var watch = __webpack_require__(/*! redux-watch */ "./node_modules/redux-watch/index.js");

Footer.prototype.ctrlr = function () {
    var _this = this;

    var bannerWatch = watch(store.getState, 'stickyBanner');
    var banner = store.getState().stickyBanner;
    if (banner && banner.height) {
        this.setState({
            marginBottom: banner.height
        });
    }

    store.subscribe(bannerWatch(function (newState) {
        _this.setState({
            marginBottom: newState.height
        });
    }));
};

// Added by sephora-jsx-loader.js
module.exports = Footer.prototype;

// WEBPACK FOOTER //
// ./public_ufe/js/components/Footer/Footer.c.js

/***/ }),

/***/ "./src/components/Footer/Footer.jsx":
/*!******************************************!*\
  !*** ./src/components/Footer/Footer.jsx ***!
  \******************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Added by sephora-jsx-loader.js

// Added by sephora-jsx-loader.js

var _jsxFileName = '/opt/foxyboy/sw/pri/code-samples/sephora/src/components/Footer/Footer.jsx';
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = __webpack_require__(/*! utils/framework/wrapComponentRender */ "./src/utils/framework/wrapComponentRender.js");

// Added by sephora-jsx-loader.js
var wrapComponentRender = __webpack_require__(/*! utils/framework/wrapComponentRender */ "./src/utils/framework/wrapComponentRender.js").wrapComponentRender;

var _require = __webpack_require__(/*! style */ "./src/style.js"),
    colors = _require.colors,
    space = _require.space;

var _require2 = __webpack_require__(/*! components/display */ "./src/components/display.js"),
    Box = _require2.Box,
    Grid = _require2.Grid;

var Container = __webpack_require__(/*! components/Container/Container */ "./src/components/Container/Container.jsx");
var SocialIcons = __webpack_require__(/*! ./SocialIcons/SocialIcons */ "./src/components/Footer/SocialIcons/SocialIcons.jsx");
var FooterLinks = __webpack_require__(/*! ./FooterLinks/FooterLinks */ "./src/components/Footer/FooterLinks/FooterLinks.jsx");
var Divider = __webpack_require__(/*! components/Divider/Divider */ "./src/components/Divider/Divider.jsx");
var EmailSignUp = __webpack_require__(/*! components/EmailSignUp/EmailSignUp */ "./src/components/EmailSignUp/EmailSignUp.jsx");
var Markdown = __webpack_require__(/*! components/Markdown/Markdown */ "./src/components/Markdown/Markdown.jsx");

var Footer = function Footer() {
    this.state = {
        marginBottom: 0
    };
};

Footer.prototype.postLoad = true;

Footer.prototype.render = function () {
    var _props = this.props,
        _props$legal = _props.legal,
        legal = _props$legal === undefined ? [{
        text: ''
    }] : _props$legal,
        _props$footerLinkGrou = _props.footerLinkGroups,
        footerLinkGroups = _props$footerLinkGrou === undefined ? [] : _props$footerLinkGrou;


    return React.createElement(
        Box,
        {
            backgroundColor: 'black',
            color: 'white',
            marginBottom: this.state.marginBottom,
            paddingY: Sephora.isMobile() ? space[5] : space[7], __source: {
                fileName: _jsxFileName,
                lineNumber: 38
            },
            __self: this
        },
        React.createElement(
            Container,
            {
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 43
                },
                __self: this
            },
            React.createElement(FooterLinks, { linkGroups: footerLinkGroups, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 44
                },
                __self: this
            }),
            React.createElement(Divider, { marginY: space[5], color: 'midGray', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 45
                },
                __self: this
            }),
            React.createElement(
                Grid,
                {
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 46
                    },
                    __self: this
                },
                React.createElement(
                    Grid.Cell,
                    { width: Sephora.isDesktop() ? 'fit' : 1, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 47
                        },
                        __self: this
                    },
                    React.createElement(EmailSignUp, {
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 48
                        },
                        __self: this
                    })
                ),
                React.createElement(
                    Grid.Cell,
                    {
                        width: Sephora.isDesktop() ? 'fill' : 1,
                        marginTop: Sephora.isMobile() ? space[5] : null,
                        textAlign: Sephora.isMobile() ? 'center' : 'right', __source: {
                            fileName: _jsxFileName,
                            lineNumber: 50
                        },
                        __self: this
                    },
                    React.createElement(SocialIcons, {
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 54
                        },
                        __self: this
                    })
                )
            ),
            React.createElement(Markdown, {
                marginTop: Sephora.isMobile() ? space[5] : space[7],
                color: 'silver',
                fontSize: 'h6',
                textAlign: 'center',
                _css: {
                    '& a:not([href^=tel])': {
                        textDecoration: 'underline',
                        ':hover': {
                            color: colors.white
                        }
                    }
                },
                content: legal[0].text,
                targetWindow: legal[0].targetWindow,
                modalComponentTemplate: legal[0].modalComponentTemplate,
                componentName: legal[0].componentName,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 58
                },
                __self: this
            })
        )
    );
};

// Added by sephora-jsx-loader.js
Footer.prototype.path = 'Footer';
// Added by sephora-jsx-loader.js
Object.assign(Footer.prototype, __webpack_require__(/*! ./Footer.c.js */ "./src/components/Footer/Footer.c.js"));
var originalDidMount = Footer.prototype.componentDidMount;
Footer.prototype.componentDidMount = function () {
    //console.log('Non-root componentDidMount Fired: Footer');
    if (originalDidMount) originalDidMount.apply(this);
    if (Footer.prototype.ctrlr) Footer.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Footer');
// Added by sephora-jsx-loader.js
Footer.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Footer.prototype.class = 'Footer';
// Added by sephora-jsx-loader.js
Footer.prototype.getInitialState = function () {
    Footer.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Footer.prototype.render = wrapComponentRender(Footer.prototype.render);
// Added by sephora-jsx-loader.js
var FooterClass = React.createClass(Footer.prototype);
// Added by sephora-jsx-loader.js
FooterClass.prototype.classRef = FooterClass;
// Added by sephora-jsx-loader.js
Object.assign(FooterClass, Footer);
// Added by sephora-jsx-loader.js
module.exports = FooterClass;

// WEBPACK FOOTER //
// ./public_ufe/js/components/Footer/Footer.jsx

/***/ }),

/***/ "./src/components/Footer/SocialIcons/SocialIcons.jsx":
/*!***********************************************************!*\
  !*** ./src/components/Footer/SocialIcons/SocialIcons.jsx ***!
  \***********************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Added by sephora-jsx-loader.js

// Added by sephora-jsx-loader.js

var _jsxFileName = '/opt/foxyboy/sw/pri/code-samples/sephora/src/components/Footer/SocialIcons/SocialIcons.jsx';
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = __webpack_require__(/*! utils/framework/wrapComponentRender */ "./src/utils/framework/wrapComponentRender.js");

// Added by sephora-jsx-loader.js
var wrapComponentRender = __webpack_require__(/*! utils/framework/wrapComponentRender */ "./src/utils/framework/wrapComponentRender.js").wrapComponentRender;

// Added by sephora-jsx-loader.js
if (!Sephora.isRootRender) {
    Sephora.Util.InflatorComps.Comps['SocialIcons'] = function SocialIcons() {
        return SocialIconsClass;
    };
}
var space = __webpack_require__(/*! style */ "./src/style.js").space;

var _require = __webpack_require__(/*! components/display */ "./src/components/display.js"),
    Box = _require.Box,
    Flex = _require.Flex;

var IconFacebook = __webpack_require__(/*! components/Icon/IconFacebook */ "./src/components/Icon/IconFacebook.jsx");
var IconTwitter = __webpack_require__(/*! components/Icon/IconTwitter */ "./src/components/Icon/IconTwitter.jsx");
var IconInstagram = __webpack_require__(/*! components/Icon/IconInstagram */ "./src/components/Icon/IconInstagram.jsx");
var IconYoutube = __webpack_require__(/*! components/Icon/IconYoutube */ "./src/components/Icon/IconYoutube.jsx");
var IconPinterest = __webpack_require__(/*! components/Icon/IconPinterest */ "./src/components/Icon/IconPinterest.jsx");
var IconGoogle = __webpack_require__(/*! components/Icon/IconGoogle */ "./src/components/Icon/IconGoogle.jsx");
var IconTumblr = __webpack_require__(/*! components/Icon/IconTumblr */ "./src/components/Icon/IconTumblr.jsx");
var IconWanelo = __webpack_require__(/*! components/Icon/IconWanelo */ "./src/components/Icon/IconWanelo.jsx");

var SocialIcons = function SocialIcons() {};

SocialIcons.prototype.render = function () {

    var iconPadding = space[1];

    /* TODO: move links to one place in an utility file as constants and use for href's below */

    return React.createElement(
        Flex,
        {
            isInline: true,
            marginX: -iconPadding,
            lineHeight: 0,
            fontSize: 'h1', __source: {
                fileName: _jsxFileName,
                lineNumber: 38
            },
            __self: this
        },
        React.createElement(
            Box,
            {
                href: 'https://www.facebook.com/sephora/',
                paddingX: iconPadding, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 43
                },
                __self: this
            },
            React.createElement(IconFacebook, {
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 46
                },
                __self: this
            })
        ),
        React.createElement(
            Box,
            {
                href: 'https://twitter.com/sephora',
                paddingX: iconPadding, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 48
                },
                __self: this
            },
            React.createElement(IconTwitter, {
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 51
                },
                __self: this
            })
        ),
        React.createElement(
            Box,
            {
                href: 'https://www.instagram.com/sephora/',
                paddingX: iconPadding, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 53
                },
                __self: this
            },
            React.createElement(IconInstagram, {
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 56
                },
                __self: this
            })
        ),
        React.createElement(
            Box,
            {
                href: 'https://www.youtube.com/user/sephora/tutorials',
                paddingX: iconPadding, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 58
                },
                __self: this
            },
            React.createElement(IconYoutube, {
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 61
                },
                __self: this
            })
        ),
        React.createElement(
            Box,
            {
                href: 'https://www.pinterest.com/sephora/',
                paddingX: iconPadding, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 63
                },
                __self: this
            },
            React.createElement(IconPinterest, {
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 66
                },
                __self: this
            })
        ),
        React.createElement(
            Box,
            {
                href: 'https://plus.google.com/+Sephora',
                paddingX: iconPadding, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 68
                },
                __self: this
            },
            React.createElement(IconGoogle, {
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 71
                },
                __self: this
            })
        ),
        React.createElement(
            Box,
            {
                href: 'https://theglossy.sephora.com/',
                paddingX: iconPadding, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 73
                },
                __self: this
            },
            React.createElement(IconTumblr, {
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 76
                },
                __self: this
            })
        ),
        React.createElement(
            Box,
            {
                href: 'https://wanelo.com/sephora',
                paddingX: iconPadding, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 78
                },
                __self: this
            },
            React.createElement(IconWanelo, {
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 81
                },
                __self: this
            })
        )
    );
};

// Added by sephora-jsx-loader.js
SocialIcons.prototype.path = 'Footer/SocialIcons';
// Added by sephora-jsx-loader.js
SocialIcons.prototype.class = 'SocialIcons';
// Added by sephora-jsx-loader.js
SocialIcons.prototype.getInitialState = function () {
    SocialIcons.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
SocialIcons.prototype.render = wrapComponentRender(SocialIcons.prototype.render);
// Added by sephora-jsx-loader.js
var SocialIconsClass = React.createClass(SocialIcons.prototype);
// Added by sephora-jsx-loader.js
SocialIconsClass.prototype.classRef = SocialIconsClass;
// Added by sephora-jsx-loader.js
Object.assign(SocialIconsClass, SocialIcons);
// Added by sephora-jsx-loader.js
module.exports = SocialIconsClass;

// WEBPACK FOOTER //
// ./public_ufe/js/components/Footer/SocialIcons/SocialIcons.jsx

/***/ }),

/***/ "./src/components/Icon/IconFacebook.jsx":
/*!**********************************************!*\
  !*** ./src/components/Icon/IconFacebook.jsx ***!
  \**********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Added by sephora-jsx-loader.js

// Added by sephora-jsx-loader.js

var _jsxFileName = '/opt/foxyboy/sw/pri/code-samples/sephora/src/components/Icon/IconFacebook.jsx';
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = __webpack_require__(/*! utils/framework/wrapComponentRender */ "./src/utils/framework/wrapComponentRender.js");

// Added by sephora-jsx-loader.js
var wrapComponentRender = __webpack_require__(/*! utils/framework/wrapComponentRender */ "./src/utils/framework/wrapComponentRender.js").wrapComponentRender;

// Added by sephora-jsx-loader.js
if (!Sephora.isRootRender) {
    Sephora.Util.InflatorComps.Comps['IconFacebook'] = function IconFacebook() {
        return IconFacebookClass;
    };
}
/* eslint-disable max-len */
var Icon = __webpack_require__(/*! ./Icon */ "./src/components/Icon/Icon.jsx");

var IconFacebook = function IconFacebook() {};

IconFacebook.prototype.render = function () {
    return React.createElement(
        Icon,
        Object.assign({}, this.props, {
            viewBox: '0 0 125 125', __source: {
                fileName: _jsxFileName,
                lineNumber: 25
            },
            __self: this
        }),
        React.createElement('path', { d: 'M107.1 12.5H18c-3.1 0-5.5 2.4-5.5 5.5v88.9c0 3.2 2.4 5.6 5.5 5.6h47.9V73.8H53V58.7h13V47.6c0-12.9 7.9-20 19.4-20 5.5 0 10.2.4 11.7.6v13.5h-8c-6.3 0-7.5 2.9-7.5 7.4v9.7h14.9l-1.9 15.1H81.5v38.7H107c3.1 0 5.5-2.4 5.5-5.5V18c.1-3.1-2.4-5.5-5.4-5.5z', __source: {
                fileName: _jsxFileName,
                lineNumber: 28
            },
            __self: this
        })
    );
};

// Added by sephora-jsx-loader.js
IconFacebook.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconFacebook.prototype.class = 'IconFacebook';
// Added by sephora-jsx-loader.js
IconFacebook.prototype.getInitialState = function () {
    IconFacebook.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconFacebook.prototype.render = wrapComponentRender(IconFacebook.prototype.render);
// Added by sephora-jsx-loader.js
var IconFacebookClass = React.createClass(IconFacebook.prototype);
// Added by sephora-jsx-loader.js
IconFacebookClass.prototype.classRef = IconFacebookClass;
// Added by sephora-jsx-loader.js
Object.assign(IconFacebookClass, IconFacebook);
// Added by sephora-jsx-loader.js
module.exports = IconFacebookClass;

// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconFacebook.jsx

/***/ }),

/***/ "./src/components/Icon/IconGoogle.jsx":
/*!********************************************!*\
  !*** ./src/components/Icon/IconGoogle.jsx ***!
  \********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Added by sephora-jsx-loader.js

// Added by sephora-jsx-loader.js

var _jsxFileName = '/opt/foxyboy/sw/pri/code-samples/sephora/src/components/Icon/IconGoogle.jsx';
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = __webpack_require__(/*! utils/framework/wrapComponentRender */ "./src/utils/framework/wrapComponentRender.js");

// Added by sephora-jsx-loader.js
var wrapComponentRender = __webpack_require__(/*! utils/framework/wrapComponentRender */ "./src/utils/framework/wrapComponentRender.js").wrapComponentRender;

// Added by sephora-jsx-loader.js
if (!Sephora.isRootRender) {
    Sephora.Util.InflatorComps.Comps['IconGoogle'] = function IconGoogle() {
        return IconGoogleClass;
    };
}
/* eslint-disable max-len */
var Icon = __webpack_require__(/*! ./Icon */ "./src/components/Icon/Icon.jsx");

var IconGoogle = function IconGoogle() {};

IconGoogle.prototype.render = function () {
    return React.createElement(
        Icon,
        Object.assign({}, this.props, {
            viewBox: '0 0 100 100', __source: {
                fileName: _jsxFileName,
                lineNumber: 25
            },
            __self: this
        }),
        React.createElement('path', { d: 'M.1 48.4c.3-16.3 15.3-30.7 31.7-30.1 7.8-.3 15.1 3.1 21.2 7.8-2.5 2.9-5.3 5.7-8 8.3-7.3-4.9-17.5-6.4-24.7-.6-10.4 7.2-10.8 24-.9 31.7 9.7 8.7 27.9 4.4 30.6-9-6-.1-12.1 0-18.2-.2v-11H62c.6 8.5-.5 17.6-5.7 24.5-7.9 11.3-23.8 14.5-36.2 9.8S-1 61.7.1 48.4zm81.7-12.1h9c0 3.1 0 6 .1 9 3.1 0 6 0 9 .1v9c-3.1 0-6 0-9 .1 0 3.1 0 6-.1 9h-9c0-3.1 0-6-.1-9-3.1 0-6-.1-9-.1v-9c3.1 0 6 0 9-.1 0-2.9 0-6 .1-9z', __source: {
                fileName: _jsxFileName,
                lineNumber: 28
            },
            __self: this
        })
    );
};

// Added by sephora-jsx-loader.js
IconGoogle.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconGoogle.prototype.class = 'IconGoogle';
// Added by sephora-jsx-loader.js
IconGoogle.prototype.getInitialState = function () {
    IconGoogle.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconGoogle.prototype.render = wrapComponentRender(IconGoogle.prototype.render);
// Added by sephora-jsx-loader.js
var IconGoogleClass = React.createClass(IconGoogle.prototype);
// Added by sephora-jsx-loader.js
IconGoogleClass.prototype.classRef = IconGoogleClass;
// Added by sephora-jsx-loader.js
Object.assign(IconGoogleClass, IconGoogle);
// Added by sephora-jsx-loader.js
module.exports = IconGoogleClass;

// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconGoogle.jsx

/***/ }),

/***/ "./src/components/Icon/IconPinterest.jsx":
/*!***********************************************!*\
  !*** ./src/components/Icon/IconPinterest.jsx ***!
  \***********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Added by sephora-jsx-loader.js

// Added by sephora-jsx-loader.js

var _jsxFileName = '/opt/foxyboy/sw/pri/code-samples/sephora/src/components/Icon/IconPinterest.jsx';
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = __webpack_require__(/*! utils/framework/wrapComponentRender */ "./src/utils/framework/wrapComponentRender.js");

// Added by sephora-jsx-loader.js
var wrapComponentRender = __webpack_require__(/*! utils/framework/wrapComponentRender */ "./src/utils/framework/wrapComponentRender.js").wrapComponentRender;

// Added by sephora-jsx-loader.js
if (!Sephora.isRootRender) {
    Sephora.Util.InflatorComps.Comps['IconPinterest'] = function IconPinterest() {
        return IconPinterestClass;
    };
}
/* eslint-disable max-len */
var Icon = __webpack_require__(/*! ./Icon */ "./src/components/Icon/Icon.jsx");

var IconPinterest = function IconPinterest() {};

IconPinterest.prototype.render = function () {
    return React.createElement(
        Icon,
        Object.assign({}, this.props, {
            viewBox: '0 0 125 125', __source: {
                fileName: _jsxFileName,
                lineNumber: 25
            },
            __self: this
        }),
        React.createElement('path', { d: 'M62.5 12.5c-27.6 0-50 22.4-50 50s22.4 50 50 50 50-22.4 50-50-22.4-50-50-50zm0 93.4c-4.4 0-8.7-.6-12.8-1.9 1.8-2.8 4.4-7.6 5.4-11.4.5-2 2.7-10.3 2.7-10.3 1.4 2.7 5.6 4.9 9.9 4.9 13.1 0 22.5-12 22.5-26.9 0-14.3-11.7-25.1-26.7-25.1-18.7 0-28.6 12.5-28.6 26.2 0 6.3 3.4 14.3 8.8 16.7.8.4 1.3.2 1.5-.6.1-.6.8-3.6 1.2-4.9.1-.4.1-.8-.3-1.3-1.8-2.2-3.3-6.2-3.3-9.9 0-9.6 7.3-18.8 19.6-18.8 10.6 0 18.1 7.3 18.1 17.6 0 11.7-5.9 19.8-13.6 19.8-4.2 0-7.5-3.5-6.4-7.8C61.7 67 64 61.4 64 57.8c0-3.4-1.8-6.1-5.5-6.1-4.3 0-7.8 4.5-7.8 10.5 0 3.8 1.3 6.4 1.3 6.4S47.7 87 46.8 90.4c-.8 3.8-.5 8.9-.1 12.4-16.1-6.3-27.6-22-27.6-40.3 0-23.9 19.4-43.4 43.4-43.4 23.9 0 43.4 19.4 43.4 43.4 0 23.9-19.5 43.4-43.4 43.4z', __source: {
                fileName: _jsxFileName,
                lineNumber: 28
            },
            __self: this
        })
    );
};

// Added by sephora-jsx-loader.js
IconPinterest.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconPinterest.prototype.class = 'IconPinterest';
// Added by sephora-jsx-loader.js
IconPinterest.prototype.getInitialState = function () {
    IconPinterest.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconPinterest.prototype.render = wrapComponentRender(IconPinterest.prototype.render);
// Added by sephora-jsx-loader.js
var IconPinterestClass = React.createClass(IconPinterest.prototype);
// Added by sephora-jsx-loader.js
IconPinterestClass.prototype.classRef = IconPinterestClass;
// Added by sephora-jsx-loader.js
Object.assign(IconPinterestClass, IconPinterest);
// Added by sephora-jsx-loader.js
module.exports = IconPinterestClass;

// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconPinterest.jsx

/***/ }),

/***/ "./src/components/Icon/IconTumblr.jsx":
/*!********************************************!*\
  !*** ./src/components/Icon/IconTumblr.jsx ***!
  \********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Added by sephora-jsx-loader.js

// Added by sephora-jsx-loader.js

var _jsxFileName = '/opt/foxyboy/sw/pri/code-samples/sephora/src/components/Icon/IconTumblr.jsx';
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = __webpack_require__(/*! utils/framework/wrapComponentRender */ "./src/utils/framework/wrapComponentRender.js");

// Added by sephora-jsx-loader.js
var wrapComponentRender = __webpack_require__(/*! utils/framework/wrapComponentRender */ "./src/utils/framework/wrapComponentRender.js").wrapComponentRender;

// Added by sephora-jsx-loader.js
if (!Sephora.isRootRender) {
    Sephora.Util.InflatorComps.Comps['IconTumblr'] = function IconTumblr() {
        return IconTumblrClass;
    };
}
/* eslint-disable max-len */
var Icon = __webpack_require__(/*! ./Icon */ "./src/components/Icon/Icon.jsx");

var IconTumblr = function IconTumblr() {};

IconTumblr.prototype.render = function () {
    return React.createElement(
        Icon,
        Object.assign({}, this.props, {
            viewBox: '0 0 125 125', __source: {
                fileName: _jsxFileName,
                lineNumber: 25
            },
            __self: this
        }),
        React.createElement('path', { d: 'M75 112.5c10 0 19.9-3.6 23.2-7.9l.7-.9-6.2-18.4c-.1-.2-.2-.3-.4-.3H78.4c-.2 0-.4-.1-.4-.3-.2-.6-.3-1.4-.3-2.3V60c0-.2.2-.4.4-.4h16.3c.2 0 .4-.2.4-.4v-23c0-.2-.2-.4-.4-.4H78.2c-.2 0-.4-.2-.4-.4V12.9c0-.2-.2-.4-.4-.4H48.9c-2 0-4.4 1.5-4.7 4.3-1.4 11.6-6.7 18.5-16.7 21.9l-1.1.3c-.2.1-.3.2-.3.4v19.8c0 .2.2.4.4.4h10.1v24.3c.1 19.4 13.6 28.6 38.4 28.6zm19.1-9.4c-3.1 3-9.5 5.2-15.7 5.3h-.7c-20.2 0-25.6-15.4-25.6-24.5v-28c0-.2-.2-.4-.4-.4H42c-.2 0-.4-.2-.4-.4V42.3c0-.2.1-.3.3-.4 10.4-4.1 16.3-12.1 17.8-24.6.1-.7.7-.7.7-.7h13c.2 0 .4.2.4.4v22.4c0 .2.2.4.4.4h16.2c.2 0 .4.2.4.4V55c0 .2-.2.4-.4.4H74.1c-.2 0-.4.2-.4.4v26.6c.1 6 3 9 8.6 9 2.3 0 4.9-.5 7.2-1.4.2-.1.5 0 .5.3l4.1 12.3c.2.2.1.4 0 .5z', __source: {
                fileName: _jsxFileName,
                lineNumber: 28
            },
            __self: this
        })
    );
};

// Added by sephora-jsx-loader.js
IconTumblr.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconTumblr.prototype.class = 'IconTumblr';
// Added by sephora-jsx-loader.js
IconTumblr.prototype.getInitialState = function () {
    IconTumblr.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconTumblr.prototype.render = wrapComponentRender(IconTumblr.prototype.render);
// Added by sephora-jsx-loader.js
var IconTumblrClass = React.createClass(IconTumblr.prototype);
// Added by sephora-jsx-loader.js
IconTumblrClass.prototype.classRef = IconTumblrClass;
// Added by sephora-jsx-loader.js
Object.assign(IconTumblrClass, IconTumblr);
// Added by sephora-jsx-loader.js
module.exports = IconTumblrClass;

// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconTumblr.jsx

/***/ }),

/***/ "./src/components/Icon/IconTwitter.jsx":
/*!*********************************************!*\
  !*** ./src/components/Icon/IconTwitter.jsx ***!
  \*********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Added by sephora-jsx-loader.js

// Added by sephora-jsx-loader.js

var _jsxFileName = '/opt/foxyboy/sw/pri/code-samples/sephora/src/components/Icon/IconTwitter.jsx';
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = __webpack_require__(/*! utils/framework/wrapComponentRender */ "./src/utils/framework/wrapComponentRender.js");

// Added by sephora-jsx-loader.js
var wrapComponentRender = __webpack_require__(/*! utils/framework/wrapComponentRender */ "./src/utils/framework/wrapComponentRender.js").wrapComponentRender;

// Added by sephora-jsx-loader.js
if (!Sephora.isRootRender) {
    Sephora.Util.InflatorComps.Comps['IconTwitter'] = function IconTwitter() {
        return IconTwitterClass;
    };
}
/* eslint-disable max-len */
var Icon = __webpack_require__(/*! ./Icon */ "./src/components/Icon/Icon.jsx");

var IconTwitter = function IconTwitter() {};

IconTwitter.prototype.render = function () {
    return React.createElement(
        Icon,
        Object.assign({}, this.props, {
            viewBox: '0 95 125 125', __source: {
                fileName: _jsxFileName,
                lineNumber: 25
            },
            __self: this
        }),
        React.createElement('path', { d: 'M112.5 126.6c-3.8 1.7-7.7 2.7-11.8 3.3 4.3-2.5 7.5-6.6 9.1-11.4-4 2.4-8.4 4.1-13.1 4.9-7.8-8.2-20.7-8.6-29.1-.8-5.4 5.1-7.6 12.5-5.9 19.6-16.5-.8-31.9-8.6-42.3-21.5C14 130 16.8 142 25.8 148c-3.3-.1-6.4-.9-9.3-2.5v.2c0 9.8 6.8 18.2 16.4 20.1-3.1.8-6.2.9-9.3.3 2.7 8.3 10.4 14.1 19.2 14.2-7.3 5.7-16.2 8.8-25.5 8.8-1.7 0-3.3-.1-4.8-.3 9.4 6 20.3 9.3 31.5 9.2 37.7 0 58.4-31.3 58.4-58.4 0-.8 0-1.8-.1-2.6 4-2.8 7.5-6.3 10.2-10.4z', __source: {
                fileName: _jsxFileName,
                lineNumber: 28
            },
            __self: this
        })
    );
};

// Added by sephora-jsx-loader.js
IconTwitter.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconTwitter.prototype.class = 'IconTwitter';
// Added by sephora-jsx-loader.js
IconTwitter.prototype.getInitialState = function () {
    IconTwitter.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconTwitter.prototype.render = wrapComponentRender(IconTwitter.prototype.render);
// Added by sephora-jsx-loader.js
var IconTwitterClass = React.createClass(IconTwitter.prototype);
// Added by sephora-jsx-loader.js
IconTwitterClass.prototype.classRef = IconTwitterClass;
// Added by sephora-jsx-loader.js
Object.assign(IconTwitterClass, IconTwitter);
// Added by sephora-jsx-loader.js
module.exports = IconTwitterClass;

// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconTwitter.jsx

/***/ }),

/***/ "./src/components/Icon/IconWanelo.jsx":
/*!********************************************!*\
  !*** ./src/components/Icon/IconWanelo.jsx ***!
  \********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Added by sephora-jsx-loader.js

// Added by sephora-jsx-loader.js

var _jsxFileName = '/opt/foxyboy/sw/pri/code-samples/sephora/src/components/Icon/IconWanelo.jsx';
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = __webpack_require__(/*! utils/framework/wrapComponentRender */ "./src/utils/framework/wrapComponentRender.js");

// Added by sephora-jsx-loader.js
var wrapComponentRender = __webpack_require__(/*! utils/framework/wrapComponentRender */ "./src/utils/framework/wrapComponentRender.js").wrapComponentRender;

// Added by sephora-jsx-loader.js
if (!Sephora.isRootRender) {
    Sephora.Util.InflatorComps.Comps['IconWanelo'] = function IconWanelo() {
        return IconWaneloClass;
    };
}
/* eslint-disable max-len */
var Icon = __webpack_require__(/*! ./Icon */ "./src/components/Icon/Icon.jsx");

var IconWanelo = function IconWanelo() {};

IconWanelo.prototype.render = function () {
    return React.createElement(
        Icon,
        Object.assign({}, this.props, {
            viewBox: '0 0 130 130', __source: {
                fileName: _jsxFileName,
                lineNumber: 25
            },
            __self: this
        }),
        React.createElement('path', { d: 'M17.5 17.5h27.1v27.1H17.5V17.5zm33.9 0h27.1v27.1H51.4V17.5zm34 0h27.1v27.1H85.4V17.5zM17.5 51.4h27.1v27.1H17.5V51.4zm33.9 0h27.1v27.1H51.4V51.4zm34 0h27.1v27.1H85.4V51.4zm-67.9 34h27.1v27.1H17.5V85.4zm33.9 0h27.1v27.1H51.4V85.4z', __source: {
                fileName: _jsxFileName,
                lineNumber: 28
            },
            __self: this
        })
    );
};

// Added by sephora-jsx-loader.js
IconWanelo.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconWanelo.prototype.class = 'IconWanelo';
// Added by sephora-jsx-loader.js
IconWanelo.prototype.getInitialState = function () {
    IconWanelo.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconWanelo.prototype.render = wrapComponentRender(IconWanelo.prototype.render);
// Added by sephora-jsx-loader.js
var IconWaneloClass = React.createClass(IconWanelo.prototype);
// Added by sephora-jsx-loader.js
IconWaneloClass.prototype.classRef = IconWaneloClass;
// Added by sephora-jsx-loader.js
Object.assign(IconWaneloClass, IconWanelo);
// Added by sephora-jsx-loader.js
module.exports = IconWaneloClass;

// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconWanelo.jsx

/***/ })

});
//# sourceMappingURL=harness.js.map