webpackJsonp(["auth"],{

/***/ "./app/actions/facebook.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.facebookAuth = exports.POST_DISCONNECT_FACEBOOK = exports.POST_CONNECT_FACEBOOK = undefined;
exports.connectFacebook = connectFacebook;
exports.disconnectFacebook = disconnectFacebook;

var _apiRequestAction = __webpack_require__("./app/actions/api-request-action.js");

var _apiRequestAction2 = _interopRequireDefault(_apiRequestAction);

var _jsonApiUrl = __webpack_require__("./app/utilities/json-api-url.js");

var _jsonApiUrl2 = _interopRequireDefault(_jsonApiUrl);

var _analytics = __webpack_require__("./app/analytics/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var POST_CONNECT_FACEBOOK = exports.POST_CONNECT_FACEBOOK = 'POST_CONNECT_FACEBOOK';
var POST_DISCONNECT_FACEBOOK = exports.POST_DISCONNECT_FACEBOOK = 'POST_DISCONNECT_FACEBOOK';

function connectFacebook(data) {
    return function (dispatch) {
        var uri = '/user/connect-facebook';
        var body = {
            data: data
        };
        return dispatch((0, _apiRequestAction2.default)(POST_CONNECT_FACEBOOK, (0, _jsonApiUrl2.default)(uri), { body: body, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }));
    };
}

function disconnectFacebook() {
    return function (dispatch) {
        (0, _analytics.logSettingsEvent)({
            title: _analytics.SETTINGS_PAGE_EVENTS.UPDATE_FACEBOOK_CONNECT_BEGAN,
            info: { enable: false }
        });
        var uri = '/user/disconnect-facebook';
        return dispatch((0, _apiRequestAction2.default)(POST_DISCONNECT_FACEBOOK, (0, _jsonApiUrl2.default)(uri)));
    };
}

var facebookAuth = exports.facebookAuth = function facebookAuth() {
    var FB = window.FB;
    return new Promise(function (resolve, reject) {
        if (!FB) {
            console.error('FB lib has not been initialized');
            return reject();
        }

        FB.getLoginStatus(function (statusResponse) {
            if (statusResponse.status === 'connected') {
                return resolve(statusResponse.authResponse);
            }

            FB.login(function (loginResponse) {
                if (loginResponse.authResponse) {
                    return resolve(loginResponse.authResponse);
                } else {
                    return reject();
                }
            });
        });
    });
};

/***/ }),

/***/ "./app/features/Auth/components/DeviceVerification/index.jsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _dec3, _class, _class2, _temp2;

var _react = __webpack_require__("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _get = __webpack_require__("./node_modules/lodash/get.js");

var _get2 = _interopRequireDefault(_get);

var _recompose = __webpack_require__("./node_modules/recompose/index.js");

var _withPreset = __webpack_require__("./app/libs/with-preset/index.js");

var _withRouting = __webpack_require__("./app/libs/with-routing/index.js");

var _Block = __webpack_require__("./app/components/Layout/Block/index.jsx");

var _Block2 = _interopRequireDefault(_Block);

var _Card = __webpack_require__("./app/components/Card/index.jsx");

var _Card2 = _interopRequireDefault(_Card);

var _Text = __webpack_require__("./app/components/Text/index.jsx");

var _Text2 = _interopRequireDefault(_Text);

var _LoadingSpinner = __webpack_require__("./app/components/LoadingSpinner/index.jsx");

var _LoadingSpinner2 = _interopRequireDefault(_LoadingSpinner);

var _TextButton = __webpack_require__("./app/components/TextButton/index.jsx");

var _TextButton2 = _interopRequireDefault(_TextButton);

var _Icon = __webpack_require__("./app/components/Icon/index.jsx");

var _Icon2 = _interopRequireDefault(_Icon);

var _withRedirect = __webpack_require__("./app/utilities/with-redirect.js");

var _withRedirect2 = _interopRequireDefault(_withRedirect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DeviceVerification = (_dec = (0, _recompose.withProps)(function (props) {
    return {
        isAttemptingVerification: Boolean((0, _get2.default)(props, 'location.query.token'))
    };
}), _dec2 = (0, _withPreset.withPreset)('verificationTokenExpired'), _dec3 = (0, _withPreset.withPreset)('otherDeviceVerified'), (0, _withRouting.withRouting)(_class = _dec(_class = _dec2(_class = _dec3(_class = (_temp2 = _class2 = function (_Component) {
    _inherits(DeviceVerification, _Component);

    function DeviceVerification() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, DeviceVerification);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = DeviceVerification.__proto__ || Object.getPrototypeOf(DeviceVerification)).call.apply(_ref, [this].concat(args))), _this), _this.renderVerificationAttemptFailure = function () {
            var _this$props = _this.props,
                redirectParam = _this$props.redirectParam,
                verificationTokenExpired = _this$props.verificationTokenExpired;

            var message = verificationTokenExpired ? 'The verification link you opened has expired.' : 'We don\u2019t recognize the verification link you opened.';
            var logInLink = redirectParam ? (0, _withRedirect2.default)('/login', redirectParam) : '/login';
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    _Block2.default,
                    { textAlign: 'center', mb: 2 },
                    _react2.default.createElement(_Icon2.default, {
                        type: 'warningLg',
                        size: 'xxxl',
                        color: ['navy', 'coral']
                    })
                ),
                _react2.default.createElement(
                    _Block2.default,
                    { mb: 2 },
                    _react2.default.createElement(
                        _Text2.default,
                        { align: 'center', el: 'p' },
                        message
                    )
                ),
                _react2.default.createElement(
                    _Text2.default,
                    { align: 'center', el: 'div' },
                    _react2.default.createElement(
                        _TextButton2.default,
                        { href: logInLink },
                        'Log in'
                    ),
                    ' or',
                    ' ',
                    _react2.default.createElement(
                        _TextButton2.default,
                        { href: 'https://patreon.zendesk.com/hc/en-us/requests/new' },
                        'contact support'
                    ),
                    '.'
                )
            );
        }, _this.renderVerificationSent = function () {
            var _this$props2 = _this.props,
                email = _this$props2.email,
                isLoading = _this$props2.isLoading,
                onResendEmailToken = _this$props2.onResendEmailToken;

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    _Block2.default,
                    { textAlign: 'center', mb: 2 },
                    _react2.default.createElement(_Icon2.default, {
                        type: 'devicesLg',
                        size: 'xxxl',
                        color: ['navy', 'coral']
                    })
                ),
                _react2.default.createElement(
                    _Block2.default,
                    { mb: 2 },
                    _react2.default.createElement(
                        _Text2.default,
                        { align: 'center', el: 'p' },
                        'We need to verify this device to keep your account secure.',
                        ' ',
                        email ? _react2.default.createElement(
                            'span',
                            null,
                            'We\u2019ve sent an email to',
                            ' ',
                            _react2.default.createElement(
                                _Text2.default,
                                { weight: 'bold' },
                                email
                            ),
                            '.'
                        ) : 'We\u2019ve sent you an email.',
                        ' ',
                        'Open the link in the email to continue.'
                    )
                ),
                _react2.default.createElement(
                    _Block2.default,
                    { mb: 2 },
                    _react2.default.createElement(
                        _Text2.default,
                        { align: 'center', el: 'div' },
                        'This email may take up to 5 minutes to be sent.'
                    )
                ),
                _react2.default.createElement(
                    _Text2.default,
                    { align: 'center', el: 'div' },
                    'Can\u2019t find the verification email?'
                ),
                _react2.default.createElement(
                    _Text2.default,
                    { align: 'center', el: 'div' },
                    isLoading ? _react2.default.createElement(
                        _Block2.default,
                        { display: 'inline-block', mr: 1 },
                        _react2.default.createElement(_LoadingSpinner2.default, {
                            size: 'sm',
                            color: 'gray2',
                            center: false
                        })
                    ) : null,
                    _react2.default.createElement(
                        _TextButton2.default,
                        { href: 'https://patreon.zendesk.com/hc/en-us/articles/115003578386-Not-receiving-emails-from-Patreon' },
                        'Review your email filters'
                    ),
                    ' ',
                    'or',
                    ' ',
                    _react2.default.createElement(
                        _TextButton2.default,
                        {
                            onClick: function onClick() {
                                return onResendEmailToken();
                            },
                            disabled: isLoading
                        },
                        'Resend verification email'
                    ),
                    ' '
                )
            );
        }, _this.renderVerificationRequired = function () {
            var isAttemptingVerification = _this.props.isAttemptingVerification;

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    _Text2.default,
                    { align: 'center', scale: '2', el: 'h1', weight: 'bold' },
                    'Verify this device'
                ),
                _react2.default.createElement(
                    _Card2.default,
                    null,
                    isAttemptingVerification ? _this.renderVerificationAttemptFailure() : _this.renderVerificationSent()
                )
            );
        }, _this.renderOtherDeviceVerified = function () {
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    _Text2.default,
                    { align: 'center', scale: '2', el: 'h1', weight: 'bold' },
                    'Device verified'
                ),
                _react2.default.createElement(
                    _Card2.default,
                    null,
                    _react2.default.createElement(
                        _Block2.default,
                        { textAlign: 'center', mb: 2 },
                        _react2.default.createElement(_Icon2.default, {
                            type: 'devicesLg',
                            size: 'xxxl',
                            color: ['navy', 'coral']
                        })
                    ),
                    _react2.default.createElement(
                        _Text2.default,
                        { align: 'center', el: 'p' },
                        'We\u2019ve successfully verified your other device. Log in again on the original device to continue.'
                    )
                )
            );
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(DeviceVerification, [{
        key: 'render',
        value: function render() {
            return this.props.otherDeviceVerified ? this.renderOtherDeviceVerified() : this.renderVerificationRequired();
        }
    }]);

    return DeviceVerification;
}(_react.Component), _class2.propTypes = {
    isAttemptingVerification: _propTypes2.default.bool.isRequired,
    email: _propTypes2.default.string,
    redirectParam: _propTypes2.default.string,
    verificationTokenExpired: _propTypes2.default.bool,
    otherDeviceVerified: _propTypes2.default.bool,
    onResendEmailToken: _propTypes2.default.func.isRequired,
    isLoading: _propTypes2.default.bool.isRequired
}, _temp2)) || _class) || _class) || _class) || _class);
exports.default = DeviceVerification;

/***/ }),

/***/ "./app/features/Auth/components/ExpiredPasswordReset/index.jsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2;

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__("react");

var _react2 = _interopRequireDefault(_react);

var _get = __webpack_require__("./node_modules/lodash/get.js");

var _get2 = _interopRequireDefault(_get);

var _Block = __webpack_require__("./app/components/Layout/Block/index.jsx");

var _Block2 = _interopRequireDefault(_Block);

var _Button = __webpack_require__("./app/components/Button/index.jsx");

var _Button2 = _interopRequireDefault(_Button);

var _CardWithHeader = __webpack_require__("./app/components/CardWithHeader/index.jsx");

var _CardWithHeader2 = _interopRequireDefault(_CardWithHeader);

var _Text = __webpack_require__("./app/components/Text/index.jsx");

var _Text2 = _interopRequireDefault(_Text);

var _analytics = __webpack_require__("./app/analytics/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var REASON_PASSWORD_LEAK = 'password_leak';
var REASON_SUSPICIOUS_ACTIVITY = 'suspicious_activity';

var ExpiredPasswordReset = (_temp2 = _class = function (_Component) {
    _inherits(ExpiredPasswordReset, _Component);

    function ExpiredPasswordReset() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, ExpiredPasswordReset);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ExpiredPasswordReset.__proto__ || Object.getPrototypeOf(ExpiredPasswordReset)).call.apply(_ref, [this].concat(args))), _this), _this.renderReason = function () {
            if (_this.props.expireReason === REASON_PASSWORD_LEAK) {
                return _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                        _Text2.default,
                        { el: 'p' },
                        'To be super clear \u2014 your Patreon account is safe and sound, and we\u2019re just expiring your password as a proactive security measure.'
                    ),
                    _react2.default.createElement(
                        _Text2.default,
                        { el: 'p' },
                        'We found that your same username/password combination may have been compromised during a leak on another service. We hope you take this opportunity to create a new, stronger password for Patreon that is different from your passwords elsewhere.'
                    )
                );
            }
            if (_this.props.expireReason === REASON_SUSPICIOUS_ACTIVITY) {
                return _react2.default.createElement(
                    _Text2.default,
                    { el: 'p' },
                    'We expire passwords from time to time as a proactive security measure. We detected suspicious activity in your account. To keep your account secure, we expired your password.'
                );
            }
            return _react2.default.createElement(
                _Text2.default,
                { el: 'p' },
                'We expire passwords from time to time as a proactive security measure. To keep your account secure, we expired your password.'
            );
        }, _this.renderInfoLink = function () {
            if (_this.props.expireReason === REASON_PASSWORD_LEAK) {
                return _react2.default.createElement(
                    _Block2.default,
                    { mt: 2 },
                    _react2.default.createElement(
                        _Text2.default,
                        { el: 'p' },
                        _react2.default.createElement(
                            'a',
                            {
                                href: 'https://patreon.zendesk.com/hc/en-us/articles/115005625346',
                                target: '_blank'
                            },
                            'Learn more about protecting your password'
                        )
                    )
                );
            }
            return null;
        }, _this.renderSuccess = function () {
            return _react2.default.createElement(
                _Block2.default,
                null,
                _react2.default.createElement(
                    _Text2.default,
                    { el: 'p' },
                    _react2.default.createElement(
                        _Text2.default,
                        { weight: 'bold' },
                        'Success!'
                    )
                ),
                _react2.default.createElement(
                    _Text2.default,
                    { el: 'p' },
                    'We sent a password reset link to',
                    ' ',
                    _react2.default.createElement(
                        _Text2.default,
                        { weight: 'bold' },
                        _this.props.email
                    ),
                    '. This email may take a few minutes to arrive in your inbox.'
                ),
                _this.renderInfoLink()
            );
        }, _this.renderPrompt = function () {
            var isLoading = (0, _get2.default)(_this.props.forgotPassword, 'request.isLoading');
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    _Block2.default,
                    { mb: 2 },
                    _react2.default.createElement(
                        _Text2.default,
                        { el: 'h1', size: 2 },
                        'Please create a new password. Safety first!'
                    )
                ),
                _react2.default.createElement(
                    _Block2.default,
                    { mb: 4 },
                    _this.renderReason()
                ),
                _react2.default.createElement(
                    _Button2.default,
                    {
                        color: 'blue',
                        type: 'submit',
                        fluid: true,
                        block: true,
                        isLoading: isLoading,
                        onClick: _this.handleClick
                    },
                    'Create New Password'
                )
            );
        }, _this.handleClick = function () {
            (0, _analytics.logExpiredPasswordEvent)({
                title: _analytics.EXPIRED_PASSWORD_EVENTS.CLICKED_SEND_RESET_EMAIL
            });

            _this.props.forgotPassword.actions.post({
                data: {
                    email: _this.props.email,
                    expired_password_email: true
                }
            });
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(ExpiredPasswordReset, [{
        key: 'render',
        value: function render() {
            var emailSent = (0, _get2.default)(this.props.forgotPassword, 'request.isLoaded');
            return _react2.default.createElement(
                _CardWithHeader2.default,
                { title: 'Password Expired', size: 'md', hasHeaderBorder: true },
                emailSent ? this.renderSuccess() : this.renderPrompt()
            );
        }
    }]);

    return ExpiredPasswordReset;
}(_react.Component), _class.propTypes = {
    email: _propTypes2.default.string.isRequired,
    forgotPassword: _propTypes2.default.object.isRequired,
    expireReason: _propTypes2.default.string
}, _temp2);
exports.default = ExpiredPasswordReset;

/***/ }),

/***/ "./app/features/Auth/components/Login/index.jsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _class, _class2, _temp2;

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__("react");

var _react2 = _interopRequireDefault(_react);

var _reactRecaptcha = __webpack_require__("./node_modules/react-recaptcha/dist/react-recaptcha.js");

var _reactRecaptcha2 = _interopRequireDefault(_reactRecaptcha);

var _reform = __webpack_require__("./app/libs/reform/index.jsx");

var _reform2 = _interopRequireDefault(_reform);

var _recompose = __webpack_require__("./node_modules/recompose/index.js");

var _get = __webpack_require__("./node_modules/lodash/get.js");

var _get2 = _interopRequireDefault(_get);

var _Button = __webpack_require__("./app/components/Button/index.jsx");

var _Button2 = _interopRequireDefault(_Button);

var _ButtonWithIcon = __webpack_require__("./app/components/ButtonWithIcon/index.jsx");

var _ButtonWithIcon2 = _interopRequireDefault(_ButtonWithIcon);

var _Input = __webpack_require__("./app/components/Form/Input/index.jsx");

var _Input2 = _interopRequireDefault(_Input);

var _Text = __webpack_require__("./app/components/Text/index.jsx");

var _Text2 = _interopRequireDefault(_Text);

var _Card = __webpack_require__("./app/components/Card/index.jsx");

var _Card2 = _interopRequireDefault(_Card);

var _Block = __webpack_require__("./app/components/Layout/Block/index.jsx");

var _Block2 = _interopRequireDefault(_Block);

var _TextButton = __webpack_require__("./app/components/TextButton/index.jsx");

var _TextButton2 = _interopRequireDefault(_TextButton);

var _login = __webpack_require__("./app/features/Auth/reform-declarations/login.js");

var _login2 = _interopRequireDefault(_login);

var _constants = __webpack_require__("./app/features/Auth/constants/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var inputs = [{
    type: 'email',
    name: 'email',
    placeHolder: 'Email',
    autoFocus: true,
    icon: {
        type: 'email',
        size: 'xs',
        color: 'gray3'
    }
}, {
    type: 'password',
    name: 'password',
    placeHolder: 'Password',
    icon: {
        type: 'key',
        size: 'xs',
        color: 'gray3'
    }
}, {
    type: 'text',
    name: 'twoFactorCode',
    placeHolder: 'Two-Factor Code',
    autoFocus: true,
    icon: {
        type: 'lock',
        size: 'xs',
        color: 'gray3'
    }
}];

var LoginForm = (_dec = (0, _reform2.default)((0, _login2.default)('login')), _dec2 = (0, _recompose.withState)('recaptchaVerified', 'setRecaptchaVerified', false), _dec(_class = _dec2(_class = (_temp2 = _class2 = function (_Component) {
    _inherits(LoginForm, _Component);

    function LoginForm() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, LoginForm);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = LoginForm.__proto__ || Object.getPrototypeOf(LoginForm)).call.apply(_ref, [this].concat(args))), _this), _this.submitHandler = function (e, authType) {
            e.preventDefault();
            var model = _this.props.reform.login.model;
            _this.props.onSubmit(model, authType);
            return false;
        }, _this.contextHandler = function (e, authType) {
            e.preventDefault();
            _this.props.onChangeContext(authType);
            return false;
        }, _this.onCaptchaVerify = function (response) {
            var _this$props = _this.props,
                setRecaptchaVerified = _this$props.setRecaptchaVerified,
                onRecaptchaVerified = _this$props.onRecaptchaVerified;

            setRecaptchaVerified(true);
            if (onRecaptchaVerified) {
                onRecaptchaVerified(response);
            }
        }, _this.isProbablyNotABot = function () {
            var _this$props2 = _this.props,
                recaptchaVerified = _this$props2.recaptchaVerified,
                showRecaptcha = _this$props2.showRecaptcha;

            return !showRecaptcha || !!recaptchaVerified;
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(LoginForm, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                error = _props.error,
                hideTitle = _props.hideTitle,
                isLoading = _props.isLoading,
                onResendCode = _props.onResendCode,
                showRecaptcha = _props.showRecaptcha,
                smsTwoFactorMetaData = _props.smsTwoFactorMetaData,
                twoFactorRequired = _props.twoFactorRequired;
            var _props$reform$login = this.props.reform.login,
                bindInput = _props$reform$login.bindInput,
                dirtyState = _props$reform$login.dirtyState,
                model = _props$reform$login.model,
                validation = _props$reform$login.validation;


            var twoFactorInputs = function twoFactorInputs(input) {
                return input.name === 'twoFactorCode';
            };
            var loginInputs = function loginInputs(input) {
                return input.name === 'email' || input.name === 'password';
            };

            var inputElements = inputs.filter(twoFactorRequired ? twoFactorInputs : loginInputs).map(function (input, i) {
                var field = validation.fields[input.name];
                var errorMessage = (0, _get2.default)(field, 'errors[0]', undefined);
                var dataEntered = input.name in model;
                var hasBlurred = (0, _get2.default)(dirtyState, input.name + '.hasBlurred', false);
                // @TODO: Change placeholder to label when we actually launch rebrand
                return _react2.default.createElement(
                    _Block2.default,
                    { mb: 1, key: 'input-' + input.name },
                    _react2.default.createElement(_Input2.default, _extends({}, bindInput(input.name), {
                        autoFocus: !!input.autoFocus,
                        type: input.type,
                        label: input.placeHolder,
                        icon: input.icon,
                        error: hasBlurred && dataEntered && errorMessage
                    }))
                );
            });

            var last3 = (0, _get2.default)(smsTwoFactorMetaData, 'phoneLastThree');
            var twoFactorTitle = last3 ? 'We sent an SMS authentication code to your phone number ending in ' + last3 : 'Two-Factor authentication required';

            var actionText = twoFactorRequired ? 'Verify' : 'Log in';
            var errorColor = twoFactorRequired ? 'gray1' : 'error';
            var stepDisabled = !validation.isValid && !twoFactorRequired;

            return _react2.default.createElement(
                'div',
                null,
                !hideTitle && _react2.default.createElement(
                    _Text2.default,
                    { align: 'center', scale: '2', el: 'h1', weight: 'bold' },
                    'Log in'
                ),
                _react2.default.createElement(
                    _Block2.default,
                    { mb: 5 },
                    _react2.default.createElement(
                        _Card2.default,
                        null,
                        !twoFactorRequired && _react2.default.createElement(
                            'span',
                            null,
                            _react2.default.createElement(
                                _ButtonWithIcon2.default,
                                {
                                    icon: 'socialRoundedFacebook',
                                    color: 'facebookBlue',
                                    size: 'md',
                                    iconSize: 'xs',
                                    onClick: function onClick(e) {
                                        return _this2.submitHandler(e, _constants.FACEBOOK_LOGIN);
                                    },
                                    fluid: true,
                                    block: true,
                                    disabled: isLoading
                                },
                                'Continue with Facebook'
                            ),
                            _react2.default.createElement(
                                _Block2.default,
                                { mv: 4 },
                                _react2.default.createElement(
                                    _Text2.default,
                                    { align: 'center', el: 'p', color: 'gray3' },
                                    'or log in with email'
                                )
                            )
                        ),
                        twoFactorRequired && _react2.default.createElement(
                            _Block2.default,
                            { mb: 4 },
                            _react2.default.createElement(
                                _Text2.default,
                                {
                                    align: 'center',
                                    scale: '1',
                                    el: 'p',
                                    color: errorColor
                                },
                                twoFactorTitle
                            )
                        ),
                        error && error !== 'Two Factor Auth Required' && _react2.default.createElement(
                            _Text2.default,
                            {
                                align: 'center',
                                scale: '1',
                                el: 'p',
                                color: 'error',
                                'data-tag': 'login-error'
                            },
                            error
                        ),
                        _react2.default.createElement(
                            'form',
                            {
                                onSubmit: function onSubmit(e) {
                                    return _this2.submitHandler(e, _constants.LOGIN);
                                },
                                'data-tag': 'login-form'
                            },
                            inputElements,
                            !twoFactorRequired && _react2.default.createElement(
                                _Block2.default,
                                { mv: 3 },
                                _react2.default.createElement(
                                    _Text2.default,
                                    { align: 'right', el: 'div' },
                                    _react2.default.createElement(
                                        _TextButton2.default,
                                        {
                                            onClick: function onClick(e) {
                                                return _this2.contextHandler(e, _constants.FORGOT_PASSWORD);
                                            }
                                        },
                                        'Forgot Password?'
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                _Block2.default,
                                { mv: 2 },
                                _react2.default.createElement(
                                    'span',
                                    null,
                                    showRecaptcha && _react2.default.createElement(_reactRecaptcha2.default, {
                                        render: 'explicit',
                                        onloadCallback: function onloadCallback() {},
                                        verifyCallback: this.onCaptchaVerify,
                                        sitekey: _constants.RECAPTCHA_KEY
                                    })
                                )
                            ),
                            _react2.default.createElement(
                                _Block2.default,
                                { mv: 2 },
                                _react2.default.createElement(
                                    _Button2.default,
                                    {
                                        color: 'blue',
                                        type: 'submit',
                                        disabled: stepDisabled,
                                        fluid: true,
                                        block: true,
                                        isLoading: isLoading
                                    },
                                    actionText
                                )
                            )
                        ),
                        !twoFactorRequired && _react2.default.createElement(
                            _Text2.default,
                            { align: 'center', el: 'div' },
                            _react2.default.createElement(
                                _Text2.default,
                                null,
                                'New to Patreon? '
                            ),
                            _react2.default.createElement(
                                _TextButton2.default,
                                {
                                    onClick: function onClick(e) {
                                        return _this2.contextHandler(e, _constants.SIGNUP);
                                    }
                                },
                                'Sign Up'
                            )
                        ),
                        !!twoFactorRequired && !!smsTwoFactorMetaData && _react2.default.createElement(
                            _Text2.default,
                            { align: 'center', el: 'div' },
                            _react2.default.createElement(
                                _TextButton2.default,
                                { onClick: function onClick(e) {
                                        return onResendCode();
                                    } },
                                'Resend verification code'
                            )
                        )
                    )
                )
            );
        }
    }]);

    return LoginForm;
}(_react.Component), _class2.propTypes = {
    error: _propTypes2.default.string,
    hideTitle: _propTypes2.default.bool,
    isLoading: _propTypes2.default.bool,
    onChangeContext: _propTypes2.default.func,
    onRecaptchaVerified: _propTypes2.default.func,
    onResendCode: _propTypes2.default.func,
    onSubmit: _propTypes2.default.func,
    recaptchaVerified: _propTypes2.default.bool.isRequired,
    setRecaptchaVerified: _propTypes2.default.func.isRequired,
    showRecaptcha: _propTypes2.default.bool.isRequired,
    smsTwoFactorMetaData: _propTypes2.default.object,
    twoFactorRequired: _propTypes2.default.bool,
    reform: _propTypes2.default.shape({
        login: _propTypes2.default.shape({
            model: _propTypes2.default.shape({
                email: _propTypes2.default.string.isRequired,
                password: _propTypes2.default.string.isRequired
            }).isRequired,
            bindInput: _propTypes2.default.func.isRequired,
            // TODO: more specificity
            dirtyState: _propTypes2.default.object.isRequired,
            validation: _propTypes2.default.object.isRequired
        }).isRequired
    }).isRequired
}, _temp2)) || _class) || _class);
exports.default = LoginForm;

/***/ }),

/***/ "./app/features/Auth/components/Signup/index.jsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _dec3, _class, _class2, _temp2;

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__("react");

var _react2 = _interopRequireDefault(_react);

var _get = __webpack_require__("./node_modules/lodash/get.js");

var _get2 = _interopRequireDefault(_get);

var _reform = __webpack_require__("./app/libs/reform/index.jsx");

var _reform2 = _interopRequireDefault(_reform);

var _reactRecaptcha = __webpack_require__("./node_modules/react-recaptcha/dist/react-recaptcha.js");

var _reactRecaptcha2 = _interopRequireDefault(_reactRecaptcha);

var _recompose = __webpack_require__("./node_modules/recompose/index.js");

var _Button = __webpack_require__("./app/components/Button/index.jsx");

var _Button2 = _interopRequireDefault(_Button);

var _Block = __webpack_require__("./app/components/Layout/Block/index.jsx");

var _Block2 = _interopRequireDefault(_Block);

var _Card = __webpack_require__("./app/components/Card/index.jsx");

var _Card2 = _interopRequireDefault(_Card);

var _Input = __webpack_require__("./app/components/Form/Input/index.jsx");

var _Input2 = _interopRequireDefault(_Input);

var _Text = __webpack_require__("./app/components/Text/index.jsx");

var _Text2 = _interopRequireDefault(_Text);

var _TextButton = __webpack_require__("./app/components/TextButton/index.jsx");

var _TextButton2 = _interopRequireDefault(_TextButton);

var _Checkbox = __webpack_require__("./app/components/Form/Checkbox/index.jsx");

var _Checkbox2 = _interopRequireDefault(_Checkbox);

var _ButtonWithIcon = __webpack_require__("./app/components/ButtonWithIcon/index.jsx");

var _ButtonWithIcon2 = _interopRequireDefault(_ButtonWithIcon);

var _signup = __webpack_require__("./app/features/Auth/reform-declarations/signup.js");

var _signup2 = _interopRequireDefault(_signup);

var _constants = __webpack_require__("./app/features/Auth/constants/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var inputs = [{
    type: 'text',
    name: 'name',
    label: 'Full Name',
    icon: {
        type: 'profile',
        size: 'xs',
        color: 'gray3'
    }
}, {
    type: 'email',
    name: 'email',
    label: 'Email',
    icon: {
        type: 'email',
        size: 'xs',
        color: 'gray3'
    }
}, {
    type: 'email',
    name: 'confirmEmail',
    label: 'Confirm Email',
    icon: {
        type: 'email',
        size: 'xs',
        color: 'gray3'
    }
}, {
    type: 'password',
    name: 'password',
    label: 'Password',
    icon: {
        type: 'key',
        size: 'xs',
        color: 'gray3'
    }
}];

var defaultTitle = 'or sign up with e-mail';
var facebookTitle = 'Finish signing up with Facebook by entering your e-mail address.';

var SignupForm = (_dec = (0, _reform2.default)((0, _signup2.default)('signup')), _dec2 = (0, _recompose.withState)('termsIsChecked', 'setTermIsChecked', false), _dec3 = (0, _recompose.withState)('recaptchaVerified', 'setRecaptchaVerified', false), _dec(_class = _dec2(_class = _dec3(_class = (_temp2 = _class2 = function (_Component) {
    _inherits(SignupForm, _Component);

    function SignupForm() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, SignupForm);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SignupForm.__proto__ || Object.getPrototypeOf(SignupForm)).call.apply(_ref, [this].concat(args))), _this), _this.submitHandler = function (e, authType) {
            e.preventDefault();
            var model = _this.props.reform.signup.model;
            _this.props.onSubmit(model, authType);
            return false;
        }, _this.contextHandler = function (e, authType) {
            e.preventDefault();
            _this.props.onChangeContext(authType);
            return false;
        }, _this.onCaptchaVerify = function (response) {
            var _this$props = _this.props,
                setRecaptchaVerified = _this$props.setRecaptchaVerified,
                onRecaptchaVerified = _this$props.onRecaptchaVerified;

            setRecaptchaVerified(true);
            if (onRecaptchaVerified) {
                onRecaptchaVerified(response);
            }
        }, _this.isProbablyNotABot = function () {
            var _this$props2 = _this.props,
                recaptchaVerified = _this$props2.recaptchaVerified,
                showRecaptcha = _this$props2.showRecaptcha;

            return !showRecaptcha || !!recaptchaVerified;
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(SignupForm, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                error = _props.error,
                facebookEnabled = _props.facebookEnabled,
                hideTitle = _props.hideTitle,
                isLoading = _props.isLoading,
                onChangeContext = _props.onChangeContext,
                setTermIsChecked = _props.setTermIsChecked,
                showRecaptcha = _props.showRecaptcha,
                termsIsChecked = _props.termsIsChecked;
            var _props$reform$signup = this.props.reform.signup,
                bindInput = _props$reform$signup.bindInput,
                dirtyState = _props$reform$signup.dirtyState,
                validation = _props$reform$signup.validation,
                model = _props$reform$signup.model;

            var ctaMessage = facebookEnabled ? facebookTitle : defaultTitle;
            var validEmail = validation.fields.email.isValid;

            var signupOrFacebookInputs = function signupOrFacebookInputs(input) {
                return facebookEnabled && input.name === 'name' || facebookEnabled && input.name === 'password' ? false : true;
            };

            var inputElements = inputs.filter(signupOrFacebookInputs).map(function (input, i) {
                var field = validation.fields[input.name];
                var errorMessage = (0, _get2.default)(field, 'errors[0]', undefined);
                var dataEntered = input.name in model;
                var hasBlurred = (0, _get2.default)(dirtyState, input.name + '.hasBlurred', false);
                return _react2.default.createElement(
                    _Block2.default,
                    { pb: 1, key: input.name },
                    _react2.default.createElement(_Input2.default, _extends({}, bindInput(input.name), {
                        type: input.type,
                        label: input.label,
                        icon: input.icon,
                        error: hasBlurred && dataEntered && errorMessage
                    }))
                );
            });

            return _react2.default.createElement(
                'div',
                null,
                !hideTitle && _react2.default.createElement(
                    _Text2.default,
                    { align: 'center', scale: '2', el: 'h1', weight: 'bold' },
                    'Sign Up'
                ),
                _react2.default.createElement(
                    _Block2.default,
                    { mb: 5 },
                    _react2.default.createElement(
                        _Card2.default,
                        null,
                        !facebookEnabled && _react2.default.createElement(
                            _ButtonWithIcon2.default,
                            {
                                icon: 'socialRoundedFacebook',
                                color: 'facebookBlue',
                                size: 'md',
                                iconSize: 'xs',
                                onClick: function onClick(e) {
                                    return _this2.submitHandler(e, _constants.FACEBOOK_SIGNUP);
                                },
                                fluid: true,
                                block: true,
                                disabled: isLoading
                            },
                            'Sign up with Facebook'
                        ),
                        _react2.default.createElement(
                            _Block2.default,
                            { mv: 4 },
                            _react2.default.createElement(
                                _Text2.default,
                                { align: 'center', el: 'p', color: 'gray3' },
                                ctaMessage
                            )
                        ),
                        error && _react2.default.createElement(
                            _Text2.default,
                            { align: 'center', scale: '1', el: 'p', color: 'error' },
                            error
                        ),
                        _react2.default.createElement(
                            'form',
                            {
                                onSubmit: function onSubmit(e) {
                                    return _this2.submitHandler(e, _constants.SIGNUP);
                                },
                                className: 'mb-md'
                            },
                            inputElements,
                            _react2.default.createElement(
                                _Block2.default,
                                { pv: 2 },
                                _react2.default.createElement(_Checkbox2.default, {
                                    noMargin: true,
                                    checked: termsIsChecked,
                                    onChange: function onChange(e) {
                                        return setTermIsChecked(!termsIsChecked);
                                    },
                                    name: 'tosagree',
                                    description: _react2.default.createElement(
                                        'span',
                                        null,
                                        _react2.default.createElement(
                                            _Text2.default,
                                            null,
                                            'You agree to our',
                                            ' ',
                                            _react2.default.createElement(
                                                _TextButton2.default,
                                                {
                                                    onClick: function onClick(e) {
                                                        return onChangeContext(_constants.TERMS);
                                                    }
                                                },
                                                'Terms of Use'
                                            )
                                        )
                                    )
                                })
                            ),
                            _react2.default.createElement(
                                _Block2.default,
                                { mv: 2 },
                                _react2.default.createElement(
                                    'span',
                                    null,
                                    showRecaptcha && _react2.default.createElement(_reactRecaptcha2.default, {
                                        render: 'explicit',
                                        onloadCallback: function onloadCallback() {},
                                        verifyCallback: this.onCaptchaVerify,
                                        sitekey: _constants.RECAPTCHA_KEY
                                    })
                                )
                            ),
                            _react2.default.createElement(
                                _Block2.default,
                                { mv: 2 },
                                _react2.default.createElement(
                                    _Button2.default,
                                    {
                                        color: 'blue',
                                        type: 'submit',
                                        id: 'patreon-normal-signup-button',
                                        disabled: !termsIsChecked || !this.isProbablyNotABot() || !facebookEnabled && !validation.isValid || !!facebookEnabled && !validEmail,
                                        fluid: true,
                                        block: true,
                                        isLoading: isLoading
                                    },
                                    'Sign up'
                                )
                            )
                        ),
                        _react2.default.createElement(
                            _Text2.default,
                            { align: 'center', el: 'div' },
                            _react2.default.createElement(
                                _TextButton2.default,
                                {
                                    onClick: function onClick(e) {
                                        return _this2.contextHandler(e, _constants.LOGIN);
                                    }
                                },
                                'Log in'
                            )
                        )
                    )
                )
            );
        }
    }]);

    return SignupForm;
}(_react.Component), _class2.propTypes = {
    error: _propTypes2.default.object,
    facebookEnabled: _propTypes2.default.bool,
    hideTitle: _propTypes2.default.bool,
    isLoading: _propTypes2.default.bool,
    onRecaptchaVerified: _propTypes2.default.func,
    onChangeContext: _propTypes2.default.func,
    onSubmit: _propTypes2.default.func.isRequired,
    recaptchaVerified: _propTypes2.default.bool.isRequired,
    setRecaptchaVerified: _propTypes2.default.func.isRequired,
    setTermIsChecked: _propTypes2.default.func.isRequired,
    showRecaptcha: _propTypes2.default.bool.isRequired,
    termsIsChecked: _propTypes2.default.bool.isRequired,
    reform: _propTypes2.default.shape({
        signup: _propTypes2.default.shape({
            model: _propTypes2.default.shape({
                email: _propTypes2.default.string.isRequired,
                confirmEmail: _propTypes2.default.string.isRequired,
                name: _propTypes2.default.string.isRequired,
                password: _propTypes2.default.string.isRequired
            }).isRequired,
            bindInput: _propTypes2.default.func.isRequired,
            // TODO: more specificity
            dirtyState: _propTypes2.default.object.isRequired,
            validation: _propTypes2.default.object.isRequired
        })
    }).isRequired
}, _temp2)) || _class) || _class) || _class);
exports.default = SignupForm;

/***/ }),

/***/ "./app/features/Auth/constants/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
// auth context views/pages
var SIGNUP = exports.SIGNUP = 'SIGNUP';
var LOGIN = exports.LOGIN = 'LOGIN';
var TERMS = exports.TERMS = 'TERMS';
var FORGOT_PASSWORD = exports.FORGOT_PASSWORD = 'FORGOT_PASSWORD';
var FACEBOOK_SIGNUP = exports.FACEBOOK_SIGNUP = 'FACEBOOK_SIGNUP';
var FACEBOOK_LOGIN = exports.FACEBOOK_LOGIN = 'FACEBOOK_LOGIN';
var DEVICE_VERIFICATION = exports.DEVICE_VERIFICATION = 'DEVICE_VERIFICATION';
var PASSWORD_EXPIRATION = exports.PASSWORD_EXPIRATION = 'PASSWORD_EXPIRATION';

// auth error codes
var EMAIL_REQUIRED_WITH_FACEBOOK = exports.EMAIL_REQUIRED_WITH_FACEBOOK = 'EmailRequiredWithFacebook';
var TOTP_TWO_FACTOR_REQUIRED = exports.TOTP_TWO_FACTOR_REQUIRED = 'TOTPTwoFactorRequired';
var TWO_FACTOR_REQUIRED = exports.TWO_FACTOR_REQUIRED = 'TwoFactorRequired';
var SMS_TWO_FACTOR_REQUIRED = exports.SMS_TWO_FACTOR_REQUIRED = 'SMSTwoFactorRequired';
var INVALID_TOKEN = exports.INVALID_TOKEN = 'InvalidToken';
var TWO_FACTOR_INVALID = exports.TWO_FACTOR_INVALID = 'TwoFactorInvalid';
var CAPTCHA_REQUIRED = exports.CAPTCHA_REQUIRED = 'FlaggedAsBot';
var BAD_CAPTCHA = exports.BAD_CAPTCHA = 'BadCaptcha';
var DEVICE_VERIFICATION_EMAIL_REQUIRED = exports.DEVICE_VERIFICATION_EMAIL_REQUIRED = 'DeviceVerificationViaEmailRequired';
var PASSWORD_EXPIRED = exports.PASSWORD_EXPIRED = 'PasswordExpired';

var RECAPTCHA_KEY = exports.RECAPTCHA_KEY = '6LeM_iEUAAAAANqpzY3A5ZzlYu0Ytwo-dHgZoLhn';

/***/ }),

/***/ "./app/features/Auth/index.jsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _dec3, _class, _class2, _temp2;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__("react");

var _react2 = _interopRequireDefault(_react);

var _reselect = __webpack_require__("./node_modules/reselect/lib/index.js");

var _reactRedux = __webpack_require__("./node_modules/react-redux/es/index.js");

var _get = __webpack_require__("./node_modules/lodash/get.js");

var _get2 = _interopRequireDefault(_get);

var _csrf = __webpack_require__("./app/utilities/csrf.js");

var _mallard = __webpack_require__("./app/libs/mallard/index.js");

var _mallard2 = _interopRequireDefault(_mallard);

var _reform = __webpack_require__("./app/libs/reform/index.jsx");

var _nion = __webpack_require__("./node_modules/nion/lib/index.js");

var _nion2 = _interopRequireDefault(_nion);

var _jsonApi = __webpack_require__("./app/utilities/json-api/index.js");

var _facebook = __webpack_require__("./app/actions/facebook.js");

var _googleAnalytics = __webpack_require__("./app/constants/google-analytics.js");

var _auth = __webpack_require__("./app/features/Auth/mallard-declarations/auth.js");

var _auth2 = _interopRequireDefault(_auth);

var _Signup = __webpack_require__("./app/features/Auth/components/Signup/index.jsx");

var _Signup2 = _interopRequireDefault(_Signup);

var _Login = __webpack_require__("./app/features/Auth/components/Login/index.jsx");

var _Login2 = _interopRequireDefault(_Login);

var _DeviceVerification = __webpack_require__("./app/features/Auth/components/DeviceVerification/index.jsx");

var _DeviceVerification2 = _interopRequireDefault(_DeviceVerification);

var _ExpiredPasswordReset = __webpack_require__("./app/features/Auth/components/ExpiredPasswordReset/index.jsx");

var _ExpiredPasswordReset2 = _interopRequireDefault(_ExpiredPasswordReset);

var _constants = __webpack_require__("./app/features/Auth/constants/index.js");

var _analytics = __webpack_require__("./app/analytics/index.js");

var _logger = __webpack_require__("./app/analytics/logger/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getFacebookAuthToken = function getFacebookAuthToken(state) {
    return (0, _get2.default)(state, 'facebook.accessToken', null);
};
var getRedirectParam = function getRedirectParam(state) {
    return (0, _get2.default)(state, 'routing.location.query.ru', null);
};
var getEmailFromLoginForm = function getEmailFromLoginForm(state) {
    return (0, _get2.default)((0, _reform.selectResourceForKey)('login')(state), 'model.email', null);
};

var mapStateToProps = (0, _reselect.createStructuredSelector)({
    facebookAuthToken: getFacebookAuthToken,
    redirectParam: getRedirectParam,
    emailFromLoginForm: getEmailFromLoginForm
});

var mergeProps = function mergeProps(stateProps, dispatchProps, ownProps) {
    return _extends({}, ownProps, stateProps, dispatchProps);
};

var Auth = (_dec = (0, _nion2.default)({
    currentUser: {
        endpoint: (0, _jsonApi.buildUrl)('/user', {})
    },
    smsVerification: {
        endpoint: (0, _jsonApi.buildUrl)('/phones/send-verification'),
        apiType: 'api'
    },
    deviceVerificationViaEmail: {
        endpoint: (0, _jsonApi.buildUrl)('/device-verification/email/resend'),
        apiType: 'api'
    },
    forgotPassword: {
        endpoint: (0, _jsonApi.buildUrl)('/auth/forgot-password')
    }
}), _dec2 = (0, _reactRedux.connect)(mapStateToProps, function () {
    return {};
}, mergeProps), _dec3 = (0, _mallard2.default)(function (props) {
    return {
        auth: (0, _auth2.default)('auth', props)
    };
}), _dec(_class = _dec2(_class = _dec3(_class = (_temp2 = _class2 = function (_Component) {
    _inherits(Auth, _Component);

    function Auth() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Auth);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Auth.__proto__ || Object.getPrototypeOf(Auth)).call.apply(_ref, [this].concat(args))), _this), _this.callLogEvent = function (logFn, title, authMethod) {
            var logObj = { title: title };
            if (authMethod) {
                logObj['info'] = {
                    method: authMethod
                };
            }
            logFn(logObj);
        }, _this.callGoogleAnalyticsEvent = function (eventCategory) {
            (0, _logger.logBlogGoogleAnalyticsEvent)(eventCategory, _googleAnalytics.GOOGLE_ANALYTICS_CONVERSION);
        }, _this.isLoading = function () {
            var isRedirecting = _this.props.isRedirecting;
            var _this$props$nion = _this.props.nion,
                smsVerification = _this$props$nion.smsVerification,
                currentUser = _this$props$nion.currentUser,
                deviceVerificationViaEmail = _this$props$nion.deviceVerificationViaEmail;

            var requestIsLoading = (0, _get2.default)(currentUser, 'request.isLoading', false);
            var smsResendIsLoading = (0, _get2.default)(smsVerification, 'request.isLoading', false);
            var emailResendIsLoading = (0, _get2.default)(deviceVerificationViaEmail, 'request.isLoading', false);
            return requestIsLoading || smsResendIsLoading || emailResendIsLoading || isRedirecting;
        }, _this.onResendCode = function () {
            var smsTwoFactorMetaData = _this.props.mallard.auth.value.smsTwoFactorMetaData;
            var smsVerification = _this.props.nion.smsVerification;

            smsVerification.actions.post({
                data: {
                    phone_last_three: smsTwoFactorMetaData.phoneLastThree,
                    phone_number_id: smsTwoFactorMetaData.phoneNumberId,
                    timestamp: smsTwoFactorMetaData.timestamp,
                    token: smsTwoFactorMetaData.token
                }
            });
        }, _this.onResendEmailToken = function () {
            var emailFactorMetaData = _this.props.mallard.auth.value.emailFactorMetaData;

            if (!emailFactorMetaData) {
                return;
            }
            var deviceVerificationViaEmail = _this.props.nion.deviceVerificationViaEmail;

            deviceVerificationViaEmail.actions.post({
                data: {
                    verification_factor_email_id: emailFactorMetaData.verificationFactorEmailId,
                    timestamp: emailFactorMetaData.timestamp,
                    checksum: emailFactorMetaData.checksum,
                    context: emailFactorMetaData.context,
                    redirect_target: emailFactorMetaData.redirectTarget
                }
            });
        }, _this.onCaptchaVerified = function (responseData) {
            var setCaptchaVerificationData = _this.props.mallard.auth.actions.setCaptchaVerificationData;

            if (responseData) {
                setCaptchaVerificationData(responseData);
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Auth, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            /*
                this is sort of a workaround, nion promises do not return meta data
                we will add that, but it's fairly large change as the response signatures
                of every nion action promise would need to be modified so that we can return
                objects that can be destructured w/ mulitple arguments
            */
            var csrfCignature = (0, _get2.default)(this.props.nion, 'currentUser.meta.csrf_token', (0, _get2.default)(this.props.nion, 'currentUser.extra.meta.csrf_token', null));
            if (csrfCignature) {
                (0, _csrf.setCsrfSignature)(csrfCignature);
            }
        }
    }, {
        key: 'signup',
        value: function signup(newUserPayload, authMethod) {
            var _this2 = this;

            var currentUser = this.props.nion.currentUser;


            this.callLogEvent(_analytics.logSignupEvent, _analytics.SIGN_UP_EVENTS.SUBMITTED, authMethod);

            currentUser.actions.post(newUserPayload.toRequest(), {
                endpoint: (0, _jsonApi.buildUrl)('/user', {
                    include: ['campaign']
                })
            }).then(function (newUser) {
                _this2.callLogEvent(_analytics.logSignupEvent, _analytics.SIGN_UP_EVENTS.SUCCESS, authMethod);
                _this2.props.onSuccess(newUser);
                _this2.callGoogleAnalyticsEvent(_analytics.SIGN_UP_EVENTS.DOMAIN);
            }).catch(function (error) {
                var _handleAuthError = (0, _auth.handleAuthError)(_this2.props.mallard.auth, error),
                    twoFactorRequiredError = _handleAuthError.sms,
                    captchaRequiredError = _handleAuthError.captcha,
                    deviceVerificationRequriedError = _handleAuthError.device;

                if (twoFactorRequiredError) {
                    // in the case a user is using the signup form to login and 2fa is required
                    // change the view state to LOGIN to be prompted for 2fa code entry
                    _this2.changeContext(_constants.LOGIN);
                    window.scrollTo(0, 0);
                    return;
                }

                if (deviceVerificationRequriedError) {
                    _this2.changeContext(_constants.DEVICE_VERIFICATION);
                    window.scrollTo(0, 0);
                    return;
                }

                if (captchaRequiredError) {
                    return;
                }

                _this2.callLogEvent(_analytics.logSignupEvent, _analytics.SIGN_UP_EVENTS.ERROR, authMethod);
            });
        }
    }, {
        key: 'login',
        value: function login(userPayload, authMethod) {
            var _this3 = this;

            var currentUser = this.props.nion.currentUser;


            this.callLogEvent(_analytics.logLoginEvent, _analytics.LOG_IN_EVENTS.SUBMITTED, authMethod);

            currentUser.actions.post(userPayload.toRequest(), {
                endpoint: (0, _jsonApi.buildUrl)('/login', {
                    include: ['campaign']
                })
            }).then(function (user) {
                _this3.callLogEvent(_analytics.logLoginEvent, _analytics.LOG_IN_EVENTS.SUCCESS, authMethod);
                _this3.props.onSuccess(user);
            }).catch(function (error) {
                var _handleAuthError2 = (0, _auth.handleAuthError)(_this3.props.mallard.auth, error),
                    twoFactorRequiredError = _handleAuthError2.sms,
                    captchaRequiredError = _handleAuthError2.captcha,
                    deviceVerificationRequriedError = _handleAuthError2.device,
                    passwordExpiredError = _handleAuthError2.passwordResetRequired;

                // don't log two factor required as an error and scroll to top of page


                if (twoFactorRequiredError || captchaRequiredError) {
                    window.scrollTo(0, 0);
                    return;
                }

                if (deviceVerificationRequriedError) {
                    _this3.changeContext(_constants.DEVICE_VERIFICATION);
                    window.scrollTo(0, 0);
                    return;
                }

                if (passwordExpiredError) {
                    _this3.changeContext(_constants.PASSWORD_EXPIRATION);
                    window.scrollTo(0, 0);
                    return;
                }

                _this3.callLogEvent(_analytics.logLoginEvent, _analytics.LOG_IN_EVENTS.ERROR, authMethod);
            });
        }
    }, {
        key: 'handleAuth',
        value: function handleAuth(model, type) {
            var _this4 = this;

            var _props$mallard$auth$v = this.props.mallard.auth.value,
                captchaVerificationData = _props$mallard$auth$v.captchaVerificationData,
                facebookAuthToken = _props$mallard$auth$v.facebookAuthToken,
                twoFactorRequired = _props$mallard$auth$v.twoFactorRequired;
            var setFacebookAuthToken = this.props.mallard.auth.actions.setFacebookAuthToken;
            var redirectParam = this.props.redirectParam;


            var authRequestPayload = new _jsonApi.JsonApiPayload('user', {
                email: Boolean(model.email) ? model.email : undefined,
                password: Boolean(model.password) ? model.password : undefined
            });

            if (captchaVerificationData) {
                authRequestPayload.addAttribute('recaptcha_response_field', captchaVerificationData);
            }

            if (facebookAuthToken) {
                authRequestPayload.addAttribute('fb_access_token', facebookAuthToken);
            }

            if (twoFactorRequired) {
                authRequestPayload.addAttribute('two_factor_code', model.twoFactorCode);
            }

            if (redirectParam) {
                authRequestPayload.addMetaAttribute('redirect_target', redirectParam);
            }

            if (type === _constants.SIGNUP) {
                authRequestPayload.addAttribute('name', model.name);
                this.signup(authRequestPayload, _analytics.AUTH_METHODS.EMAIL);
            }

            if (type === _constants.LOGIN) {
                this.login(authRequestPayload, _analytics.AUTH_METHODS.EMAIL);
            }

            if (type === _constants.FACEBOOK_LOGIN) {
                (0, _facebook.facebookAuth)().then(function (authResponse) {
                    var accessToken = (0, _get2.default)(authResponse, 'accessToken');
                    setFacebookAuthToken(accessToken);
                    authRequestPayload.addAttribute('fb_access_token', accessToken);
                    _this4.login(authRequestPayload, _analytics.AUTH_METHODS.FACEBOOK);
                });
            }

            if (type === _constants.FACEBOOK_SIGNUP) {
                (0, _facebook.facebookAuth)().then(function (authResponse) {
                    var accessToken = (0, _get2.default)(authResponse, 'accessToken');
                    if (!accessToken) {
                        // TODO: show error auth state
                    }

                    setFacebookAuthToken(accessToken);
                    authRequestPayload.addAttribute('email', model.email);
                    authRequestPayload.addAttribute('fb_access_token', accessToken);

                    if (model.password) {
                        authRequestPayload.addAttribute('password', model.password);
                    }

                    _this4.signup(authRequestPayload, _analytics.AUTH_METHODS.FACEBOOK);
                });
            }
        }
    }, {
        key: 'changeContext',
        value: function changeContext(type) {
            var setDisplayForm = this.props.mallard.auth.actions.setDisplayForm;

            if (type === _constants.LOGIN) {
                this.callLogEvent(_analytics.logLoginEvent, _analytics.LOG_IN_EVENTS.LANDED);
                setDisplayForm(_constants.LOGIN);
            }

            if (type === _constants.SIGNUP) {
                this.callLogEvent(_analytics.logSignupEvent, _analytics.SIGN_UP_EVENTS.LANDED);
                setDisplayForm(_constants.SIGNUP);
            }

            if (type === _constants.DEVICE_VERIFICATION) {
                this.callLogEvent(_analytics.logSignupEvent, _analytics.SIGN_UP_EVENTS.LANDED);
                setDisplayForm(_constants.DEVICE_VERIFICATION);
            }

            if (type === _constants.PASSWORD_EXPIRATION) {
                this.callLogEvent(_analytics.logExpiredPasswordEvent, _analytics.EXPIRED_PASSWORD_EVENTS.LANDED);
                setDisplayForm(_constants.PASSWORD_EXPIRATION);
            }

            if (type === _constants.TERMS) {
                window.open('/legal', '_blank');
            }

            if (type === _constants.FORGOT_PASSWORD) {
                window.open('/forgetPass', '_blank');
            }

            if (this.props.onChangeContext) {
                this.props.onChangeContext(type);
            }
        }
    }, {
        key: 'getError',
        value: function getError() {
            var hasError = (0, _get2.default)(this.props.nion.currentUser, 'request.isError');
            var requestErrors = (0, _get2.default)(this.props.nion.currentUser, 'request.errors');
            var errorMessage = (0, _get2.default)(requestErrors, '[0].detail') || (0, _get2.default)(requestErrors, '[0].title');

            if (hasError && errorMessage) {
                return errorMessage;
            } else if (hasError) {
                return 'Something went wrong. We were unable to create or login your account.';
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this5 = this;

            var hideTitle = this.props.hideTitle;
            var _props$mallard$auth$v2 = this.props.mallard.auth.value,
                captchaRequired = _props$mallard$auth$v2.captchaRequired,
                displayForm = _props$mallard$auth$v2.displayForm,
                emailRequiredWithFacebook = _props$mallard$auth$v2.emailRequiredWithFacebook,
                smsTwoFactorMetaData = _props$mallard$auth$v2.smsTwoFactorMetaData,
                twoFactorRequired = _props$mallard$auth$v2.twoFactorRequired;


            var _onSubmit = function _onSubmit(model, type) {
                return _this5.handleAuth(model, type);
            };
            var _onChangeContext = function _onChangeContext(type) {
                return _this5.changeContext(type);
            };

            if (displayForm === _constants.SIGNUP) {
                return _react2.default.createElement(_Signup2.default, {
                    onSubmit: _onSubmit,
                    onChangeContext: _onChangeContext,
                    isLoading: this.isLoading(),
                    error: this.getError(),
                    facebookEnabled: emailRequiredWithFacebook,
                    twoFactorRequired: twoFactorRequired,
                    hideTitle: hideTitle,
                    showRecaptcha: captchaRequired,
                    onRecaptchaVerified: this.onCaptchaVerified
                });
            } else if (displayForm === _constants.DEVICE_VERIFICATION) {
                return _react2.default.createElement(_DeviceVerification2.default, {
                    onResendEmailToken: this.onResendEmailToken,
                    isLoading: this.isLoading(),
                    redirectParam: this.props.redirectParam,
                    email: this.props.emailFromLoginForm
                });
            } else if (displayForm === _constants.PASSWORD_EXPIRATION) {
                return _react2.default.createElement(_ExpiredPasswordReset2.default, {
                    email: this.props.emailFromLoginForm,
                    forgotPassword: this.props.nion.forgotPassword,
                    expireReason: this.props.mallard.auth.value.passwordResetDetail
                });
            }
            return _react2.default.createElement(_Login2.default, {
                onSubmit: _onSubmit,
                onChangeContext: _onChangeContext,
                isLoading: this.isLoading(),
                error: this.getError(),
                hideTitle: hideTitle,
                twoFactorRequired: twoFactorRequired,
                smsTwoFactorMetaData: smsTwoFactorMetaData,
                onResendCode: this.onResendCode,
                showRecaptcha: captchaRequired,
                onRecaptchaVerified: this.onCaptchaVerified
            });
        }
    }]);

    return Auth;
}(_react.Component), _class2.propTypes = {
    mallard: _propTypes2.default.shape({
        auth: _propTypes2.default.shape({
            value: _propTypes2.default.shape({
                captchaRequired: _propTypes2.default.bool.isRequired,
                captchaVerificationData: _propTypes2.default.string,
                displayForm: _propTypes2.default.string.isRequired,
                facebookAuthToken: _propTypes2.default.string,
                twoFactorRequired: _propTypes2.default.bool.isRequired,
                smsTwoFactorMetaData: _propTypes2.default.object,
                emailRequiredWithFacebook: _propTypes2.default.bool.isRequired,
                emailFactorMetaData: _propTypes2.default.object,
                passwordResetRequired: _propTypes2.default.bool.isRequired,
                passwordResetDetail: _propTypes2.default.string
            }).isRequired,
            actions: _propTypes2.default.shape({
                setDisplayForm: _propTypes2.default.func.isRequired,
                setCaptchaRequired: _propTypes2.default.func.isRequired,
                setCaptchaVerificationData: _propTypes2.default.func.isRequired,
                setEmailRequiredWithFacebook: _propTypes2.default.func.isRequired,
                setFacebookAuthToken: _propTypes2.default.func.isRequired,
                setSmsTwoFactorMetaData: _propTypes2.default.func.isRequired,
                setTwoFactorRequired: _propTypes2.default.func.isRequired,
                setDeviceVerificationViaEmailRequired: _propTypes2.default.func.isRequired,
                setEmailFactorMetaData: _propTypes2.default.func.isRequired,
                setPasswordResetRequired: _propTypes2.default.func.isRequired,
                setPasswordResetDetail: _propTypes2.default.func.isRequired
            }).isRequired
        })
    }).isRequired,
    hideTitle: _propTypes2.default.bool,
    onChangeContext: _propTypes2.default.func,
    isRedirecting: _propTypes2.default.bool,
    redirectParam: _propTypes2.default.string,
    emailFromLoginForm: _propTypes2.default.string,
    onSuccess: _propTypes2.default.func
}, _class2.defaultProps = {
    hideTitle: true
}, _temp2)) || _class) || _class) || _class);
exports.default = Auth;

/***/ }),

/***/ "./app/features/Auth/mallard-declarations/auth.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handleAuthError = undefined;

var _get = __webpack_require__("./node_modules/lodash/get.js");

var _get2 = _interopRequireDefault(_get);

var _constants = __webpack_require__("./app/features/Auth/constants/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getErrorCodeName = function getErrorCodeName(errorObject) {
    var requestErrors = (0, _get2.default)(errorObject, 'errors');
    return (0, _get2.default)(requestErrors, '[0].codeName');
};
var getErrorCodeDetail = function getErrorCodeDetail(errorObject) {
    var requestErrors = (0, _get2.default)(errorObject, 'errors');
    return (0, _get2.default)(requestErrors, '[0].detail');
};

var handleTwoFactorError = function handleTwoFactorError(auth, error) {
    var errorCodeName = getErrorCodeName(error);
    var twoFactorRequiredError = errorCodeName === _constants.TWO_FACTOR_REQUIRED || errorCodeName === _constants.TOTP_TWO_FACTOR_REQUIRED || errorCodeName === _constants.SMS_TWO_FACTOR_REQUIRED;

    auth.actions.setTwoFactorRequired(twoFactorRequiredError || errorCodeName === _constants.INVALID_TOKEN || errorCodeName === _constants.TWO_FACTOR_INVALID);

    var errorMetaData = (0, _get2.default)(error, 'errors[0].meta');
    if (errorMetaData && errorCodeName === _constants.SMS_TWO_FACTOR_REQUIRED) {
        auth.actions.setSmsTwoFactorMetaData(errorMetaData);
    }

    return twoFactorRequiredError;
};

var handleDeviceAuthError = function handleDeviceAuthError(auth, error) {
    var errorCodeName = getErrorCodeName(error);
    var deviceVerificationViaEmailRequired = errorCodeName === _constants.DEVICE_VERIFICATION_EMAIL_REQUIRED;
    auth.actions.setDeviceVerificationViaEmailRequired(deviceVerificationViaEmailRequired);

    var errorMetaData = (0, _get2.default)(error, 'errors[0].meta');
    if (errorMetaData && errorCodeName === _constants.DEVICE_VERIFICATION_EMAIL_REQUIRED) {
        auth.actions.setEmailFactorMetaData(errorMetaData);
    }

    return deviceVerificationViaEmailRequired;
};

var handleCaptchaError = function handleCaptchaError(auth, error) {
    var errorCodeName = getErrorCodeName(error);
    var captchaIsRequired = errorCodeName === _constants.CAPTCHA_REQUIRED;
    auth.actions.setCaptchaRequired(captchaIsRequired);
    return captchaIsRequired;
};

var handleEmailRequiredWithFacebookError = function handleEmailRequiredWithFacebookError(auth, error) {
    var errorCodeName = getErrorCodeName(error);
    var emailIsRequiredWithFacebook = errorCodeName === _constants.EMAIL_REQUIRED_WITH_FACEBOOK;
    auth.actions.setEmailRequiredWithFacebook(emailIsRequiredWithFacebook);
    return emailIsRequiredWithFacebook;
};

var handlePasswordExpiredError = function handlePasswordExpiredError(auth, error) {
    var errorCodeName = getErrorCodeName(error);
    var passwordResetRequired = errorCodeName === _constants.PASSWORD_EXPIRED;
    auth.actions.setPasswordResetRequired(passwordResetRequired);

    var errorCodeDetail = getErrorCodeDetail(error);
    if (errorCodeDetail && errorCodeName === _constants.PASSWORD_EXPIRED) {
        auth.actions.setPasswordResetDetail(errorCodeDetail);
    }

    return passwordResetRequired;
};

var handleAuthError = exports.handleAuthError = function handleAuthError(auth, error) {
    return {
        sms: handleTwoFactorError(auth, error),
        device: handleDeviceAuthError(auth, error),
        captcha: handleCaptchaError(auth, error),
        emailWithFacebook: handleEmailRequiredWithFacebookError(auth, error),
        passwordResetRequired: handlePasswordExpiredError(auth, error)
    };
};

exports.default = function (dataKey, props) {
    return {
        dataKey: dataKey,
        initialValue: {
            displayForm: !Boolean(props.displayForm) ? _constants.LOGIN : props.displayForm,
            facebookAuthToken: props.facebookAuthToken,

            captchaRequired: props.showRecaptcha,
            captchaVerificationData: undefined,
            twoFactorRequired: false,
            smsTwoFactorMetaData: undefined,
            emailRequiredWithFacebook: false,
            deviceVerificationViaEmailRequired: false,
            emailFactorMetaData: undefined,
            passwordResetRequired: false,
            passwordResetDetail: undefined
        },
        actions: {
            setCaptchaRequired: function setCaptchaRequired(auth, captchaRequired) {
                return auth.set('captchaRequired', captchaRequired);
            },
            setCaptchaVerificationData: function setCaptchaVerificationData(auth, captchaVerificationData) {
                return auth.set('captchaVerificationData', captchaVerificationData);
            },
            setDisplayForm: function setDisplayForm(auth, displayForm) {
                return auth.set('displayForm', displayForm);
            },
            setFacebookAuthToken: function setFacebookAuthToken(auth, facebookAuthToken) {
                return auth.set('facebookAuthToken', facebookAuthToken);
            },
            setTwoFactorRequired: function setTwoFactorRequired(auth, twoFactorRequired) {
                return auth.set('twoFactorRequired', twoFactorRequired);
            },
            setSmsTwoFactorMetaData: function setSmsTwoFactorMetaData(auth, smsTwoFactorMetaData) {
                return auth.set('smsTwoFactorMetaData', smsTwoFactorMetaData);
            },
            setEmailRequiredWithFacebook: function setEmailRequiredWithFacebook(auth, emailRequiredWithFacebook) {
                return auth.set('emailRequiredWithFacebook', emailRequiredWithFacebook);
            },
            setDeviceVerificationViaEmailRequired: function setDeviceVerificationViaEmailRequired(auth, deviceVerificationViaEmailRequired) {
                return auth.set('deviceVerificationViaEmailRequired', deviceVerificationViaEmailRequired);
            },
            setEmailFactorMetaData: function setEmailFactorMetaData(auth, emailFactorMetaData) {
                return auth.set('emailFactorMetaData', emailFactorMetaData);
            },
            setPasswordResetRequired: function setPasswordResetRequired(auth, passwordResetRequired) {
                return auth.set('passwordResetRequired', passwordResetRequired);
            },
            setPasswordResetDetail: function setPasswordResetDetail(auth, passwordResetDetail) {
                return auth.set('passwordResetDetail', passwordResetDetail);
            }
        }
    };
};

/***/ }),

/***/ "./app/features/Auth/reform-declarations/login.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _validation = __webpack_require__("./app/libs/reform/src/validation/index.js");

var _helpers = __webpack_require__("./app/libs/reform/src/validation/helpers.js");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = function (propKey) {
    var dataKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'login';
    return _defineProperty({}, propKey, {
        dataKey: dataKey,
        initialModel: {
            email: '',
            password: ''
        },
        validation: {
            email: (0, _helpers.validateOrFail)([{
                rules: [(0, _validation.type)('string'), _validation.email],
                errorResult: 'Please enter a valid email.'
            }]),
            password: (0, _helpers.validateOrFail)([{
                rules: [(0, _validation.type)('string'), (0, _validation.minLength)(1)],
                errorResult: 'Please enter a password.'
            }])
        }
    });
};

/***/ }),

/***/ "./app/features/Auth/reform-declarations/signup.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _validation = __webpack_require__("./app/libs/reform/src/validation/index.js");

var _helpers = __webpack_require__("./app/libs/reform/src/validation/helpers.js");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = function (propName) {
    var dataKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'signup';
    return _defineProperty({}, propName, {
        dataKey: dataKey,
        initialModel: {
            name: '',
            email: '',
            confirmEmail: '',
            password: ''
        },
        validation: {
            name: (0, _helpers.validateOrFail)([{
                rules: [(0, _validation.type)('string'), (0, _validation.minLength)(1)],
                errorResult: 'Name is required.'
            }]),
            email: (0, _helpers.validateOrFail)([{
                rules: [(0, _validation.type)('string'), _validation.email],
                errorResult: 'Please enter a valid email.'
            }]),
            confirmEmail: (0, _helpers.validateOrFail)([{
                rules: [(0, _validation.type)('string'), _validation.email, (0, _validation.valuesAreEqual)('email')],
                errorResult: 'Your email confirmation does not match.'
            }]),
            password: (0, _helpers.validateOrFail)([{
                rules: [(0, _validation.type)('string'), (0, _validation.minLength)(6)],
                errorResult: 'Password needs to be at least 6 characters.'
            }])
        }
    });
};

/***/ }),

/***/ "./app/pages/auth/client-render.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // named client-render as we want this isolated for testing purposes,
// but naming it render.js would compile it into our ssr service,
// which this page is not yet ready for

var _react = __webpack_require__("react");

var _react2 = _interopRequireDefault(_react);

var _renderPage = __webpack_require__("./app/shared/render-page/index.js");

var _renderPage2 = _interopRequireDefault(_renderPage);

var _configureStore2 = __webpack_require__("./app/shared/configure-store/index.js");

var _configureStore3 = _interopRequireDefault(_configureStore2);

var _reactRouter = __webpack_require__("./node_modules/react-router/es/index.js");

var _routes = __webpack_require__("./app/pages/auth/routes.jsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _configureStore = (0, _configureStore3.default)({}, {
        router: { initialRoute: options.route }
    }),
        store = _configureStore.store,
        history = _configureStore.history;

    var routes = (0, _routes.makeRoutes)(store);
    var Auth = function Auth() {
        return _react2.default.createElement(
            _reactRouter.Router,
            { history: history },
            routes
        );
    };

    return (0, _renderPage2.default)(Auth, _extends({ store: store }, options));
};

/***/ }),

/***/ "./app/pages/auth/components/App/index.jsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _class, _class2, _temp;

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__("react");

var _react2 = _interopRequireDefault(_react);

var _reselect = __webpack_require__("./node_modules/reselect/lib/index.js");

var _reactRouter = __webpack_require__("./node_modules/react-router/es/index.js");

var _reactRedux = __webpack_require__("./node_modules/react-redux/es/index.js");

var _recompose = __webpack_require__("./node_modules/recompose/index.js");

var _get = __webpack_require__("./node_modules/lodash/get.js");

var _get2 = _interopRequireDefault(_get);

var _withPreset = __webpack_require__("./app/libs/with-preset/index.js");

var _Grid = __webpack_require__("./app/components/Layout/Grid/index.jsx");

var _Grid2 = _interopRequireDefault(_Grid);

var _constants = __webpack_require__("./app/features/Auth/constants/index.js");

var _sanitizeUrl = __webpack_require__("./app/utilities/sanitize-url.js");

var _sanitizeUrl2 = _interopRequireDefault(_sanitizeUrl);

var _analytics = __webpack_require__("./app/analytics/index.js");

var _auth = __webpack_require__("./app/shared/events/auth.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LOGIN_ROUTE = '/login';
var SIGNUP_ROUTE = '/signup';
var DEVICE_VERIFICATION_ROUTE = '/auth/verify-device';
var HOME_ROUTE = '/home';

var mapStateToProps = (0, _reselect.createStructuredSelector)({
    mainServer: (0, _withPreset.selectPreset)('mainServer'),
    redirectUrl: (0, _withPreset.selectPreset)('redirectUrl', '/home'),
    showRecaptcha: (0, _withPreset.selectPreset)('showCaptcha', false)
});

var App = (_dec = (0, _reactRedux.connect)(mapStateToProps), _dec2 = (0, _recompose.withState)('isRedirecting', 'setIsRedirecting', false), _dec(_class = _dec2(_class = (_temp = _class2 = function (_Component) {
    _inherits(App, _Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.onAuthSuccess = function (user) {
            var _this$props = _this.props,
                redirectUrl = _this$props.redirectUrl,
                mainServer = _this$props.mainServer,
                setIsRedirecting = _this$props.setIsRedirecting;

            var campaign = (0, _get2.default)(user, 'campaign');
            var publishedAt = (0, _get2.default)(campaign, 'publishedAt');

            setIsRedirecting(true);

            var url = redirectUrl;
            if (!url && campaign && publishedAt) {
                url = HOME_ROUTE;
            }

            var finalUrl = '' + mainServer + url;
            if (url.indexOf('https://') === 0 || url.indexOf('http://') === 0) {
                finalUrl = url;
            }

            window.location.href = (0, _sanitizeUrl2.default)(finalUrl);
        };

        _this.onChangeContext = function (type) {
            if (type === _constants.LOGIN) {
                _reactRouter.browserHistory.push(LOGIN_ROUTE);
            } else if (type === _constants.PASSWORD_EXPIRATION) {
                _reactRouter.browserHistory.push(LOGIN_ROUTE);
            } else if (type === _constants.DEVICE_VERIFICATION) {
                _reactRouter.browserHistory.push(DEVICE_VERIFICATION_ROUTE);
            } else {
                _reactRouter.browserHistory.push(SIGNUP_ROUTE);
            }
        };

        (0, _auth.logAuthEvent)(_analytics.AUTH_EVENTS.LANDED, {
            page: 'auth'
        });
        return _this;
    }

    _createClass(App, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                showRecaptcha = _props.showRecaptcha,
                isRedirecting = _props.isRedirecting;

            var route = this.props.children;
            var displayForm = _constants.LOGIN;
            if (route.props.location.pathname === SIGNUP_ROUTE) {
                displayForm = _constants.SIGNUP;
            } else if (route.props.location.pathname === DEVICE_VERIFICATION_ROUTE) {
                displayForm = _constants.DEVICE_VERIFICATION;
            }

            var stepProps = {
                hideTitle: false,
                onSuccess: this.onAuthSuccess,
                onChangeContext: this.onChangeContext,
                isRedirecting: isRedirecting,
                displayForm: displayForm,
                showRecaptcha: showRecaptcha
            };

            var step = route && _react2.default.cloneElement(route, stepProps);
            return _react2.default.createElement(
                'div',
                { className: 'containerInner fullWidthMobile' },
                _react2.default.createElement(
                    _Grid2.default,
                    { maxWidth: 'sm', ph: { xs: 0, sm: 0 }, pv: { xs: 2, sm: 2 } },
                    step
                )
            );
        }
    }]);

    return App;
}(_react.Component), _class2.propTypes = {
    children: _propTypes2.default.node,
    isRedirecting: _propTypes2.default.bool,
    mainServer: _propTypes2.default.string,
    redirectUrl: _propTypes2.default.string,
    setIsRedirecting: _propTypes2.default.func,
    showRecaptcha: _propTypes2.default.bool
}, _temp)) || _class) || _class);
exports.default = App;

/***/ }),

/***/ "./app/pages/auth/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _clientRender = __webpack_require__("./app/pages/auth/client-render.js");

var _clientRender2 = _interopRequireDefault(_clientRender);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _clientRender2.default)();

/***/ }),

/***/ "./app/pages/auth/routes.jsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.makeRoutes = undefined;

var _react = __webpack_require__("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__("./node_modules/react-router/es/index.js");

var _App = __webpack_require__("./app/pages/auth/components/App/index.jsx");

var _App2 = _interopRequireDefault(_App);

var _Auth = __webpack_require__("./app/features/Auth/index.jsx");

var _Auth2 = _interopRequireDefault(_Auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var makeRoutes = exports.makeRoutes = function makeRoutes(store) {
    return _react2.default.createElement(
        _reactRouter.Route,
        { path: '/', component: _App2.default },
        _react2.default.createElement(_reactRouter.Route, { path: 'login', key: 'login', component: _Auth2.default }),
        _react2.default.createElement(_reactRouter.Route, { path: 'signup', key: 'signup', component: _Auth2.default }),
        _react2.default.createElement(_reactRouter.Route, {
            path: 'auth/verify-device',
            key: 'device-verification',
            component: _Auth2.default
        })
    );
};

/***/ }),

/***/ "./app/shared/events/auth.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.logAuthEvent = undefined;

var _analytics = __webpack_require__("./app/analytics/index.js");

var logAuthEvent = exports.logAuthEvent = function logAuthEvent(eventName, properties) {
    return (0, _analytics.logEvent)({
        domain: _analytics.AUTH_EVENTS.DOMAIN,
        title: eventName,
        info: properties
    });
};

/***/ }),

/***/ "./node_modules/react-recaptcha/dist/react-recaptcha.js":
/***/ (function(module, exports, __webpack_require__) {

!function(e,t){ true?module.exports=t(__webpack_require__("react")):"function"==typeof define&&define.amd?define(["react"],t):"object"==typeof exports?exports.ReactRecaptcha=t(require("react")):e.ReactRecaptcha=t(e.React)}(this,function(e){return function(e){function t(r){if(a[r])return a[r].exports;var n=a[r]={exports:{},id:r,loaded:!1};return e[r].call(n.exports,n,n.exports,t),n.loaded=!0,n.exports}var a={};return t.m=e,t.c=a,t.p="",t(0)}([function(e,t,a){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function e(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,a,r){return a&&e(t.prototype,a),r&&e(t,r),t}}(),l=a(6),c=r(l),p=a(4),u=r(p),d={className:u.default.string,onloadCallbackName:u.default.string,elementID:u.default.string,onloadCallback:u.default.func,verifyCallback:u.default.func,expiredCallback:u.default.func,render:u.default.string,sitekey:u.default.string,theme:u.default.string,type:u.default.string,verifyCallbackName:u.default.string,expiredCallbackName:u.default.string,size:u.default.string,tabindex:u.default.string,hl:u.default.string,badge:u.default.string},f={elementID:"g-recaptcha",onloadCallback:void 0,onloadCallbackName:"onloadCallback",verifyCallback:void 0,verifyCallbackName:"verifyCallback",expiredCallback:void 0,expiredCallbackName:"expiredCallback",render:"onload",theme:"light",type:"image",size:"normal",tabindex:"0",hl:"en",badge:"bottomright"},h=function(){return"undefined"!=typeof window&&"undefined"!=typeof window.grecaptcha},b=void 0,y=function(e){function t(e){n(this,t);var a=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return a._renderGrecaptcha=a._renderGrecaptcha.bind(a),a.reset=a.reset.bind(a),a.state={ready:h(),widget:null},a.state.ready||(b=setInterval(a._updateReadyState.bind(a),1e3)),a}return i(t,e),s(t,[{key:"componentDidMount",value:function(){this.state.ready&&this._renderGrecaptcha()}},{key:"componentDidUpdate",value:function(e,t){var a=this.props,r=a.render,n=a.onloadCallback;"explicit"===r&&n&&this.state.ready&&!t.ready&&this._renderGrecaptcha()}},{key:"componentWillUnmount",value:function(){clearInterval(b)}},{key:"reset",value:function(){var e=this.state,t=e.ready,a=e.widget;t&&null!==a&&grecaptcha.reset(a)}},{key:"_updateReadyState",value:function(){h()&&(this.setState({ready:!0}),clearInterval(b))}},{key:"_renderGrecaptcha",value:function(){this.state.widget=grecaptcha.render(this.props.elementID,{sitekey:this.props.sitekey,callback:this.props.verifyCallback?this.props.verifyCallback:void 0,theme:this.props.theme,type:this.props.type,size:this.props.size,tabindex:this.props.tabindex,hl:this.props.hl,badge:this.props.badge,"expired-callback":this.props.expiredCallback?this.props.expiredCallback:void 0}),this.props.onloadCallback&&this.props.onloadCallback()}},{key:"render",value:function(){return"explicit"===this.props.render&&this.props.onloadCallback?c.default.createElement("div",{id:this.props.elementID,"data-onloadcallbackname":this.props.onloadCallbackName,"data-verifycallbackname":this.props.verifyCallbackName}):c.default.createElement("div",{id:this.props.elementID,className:"g-recaptcha","data-sitekey":this.props.sitekey,"data-theme":this.props.theme,"data-type":this.props.type,"data-size":this.props.size,"data-badge":this.props.badge,"data-tabindex":this.props.tabindex})}}]),t}(l.Component);t.default=y,y.propTypes=d,y.defaultProps=f,e.exports=t.default},function(e,t){"use strict";function a(e){return function(){return e}}var r=function(){};r.thatReturns=a,r.thatReturnsFalse=a(!1),r.thatReturnsTrue=a(!0),r.thatReturnsNull=a(null),r.thatReturnsThis=function(){return this},r.thatReturnsArgument=function(e){return e},e.exports=r},function(e,t,a){"use strict";function r(e,t,a,r,o,i,s,l){if(n(t),!e){var c;if(void 0===t)c=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var p=[a,r,o,i,s,l],u=0;c=new Error(t.replace(/%s/g,function(){return p[u++]})),c.name="Invariant Violation"}throw c.framesToPop=1,c}}var n=function(e){};e.exports=r},function(e,t,a){"use strict";var r=a(1),n=a(2),o=a(5);e.exports=function(){function e(e,t,a,r,i,s){s!==o&&n(!1,"Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types")}function t(){return e}e.isRequired=e;var a={array:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t};return a.checkPropTypes=r,a.PropTypes=a,a}},function(e,t,a){e.exports=a(3)()},function(e,t){"use strict";var a="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";e.exports=a},function(t,a){t.exports=e}])});

/***/ }),

/***/ "multi babel-polyfill /root/patreon_react_features/app/pages/auth/index.js":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./node_modules/babel-polyfill/lib/index.js");
module.exports = __webpack_require__("./app/pages/auth/index.js");


/***/ }),

/***/ "react":
/***/ (function(module, exports) {

module.exports = React;

/***/ }),

/***/ "react-dom":
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ })

},["multi babel-polyfill /root/patreon_react_features/app/pages/auth/index.js"]);


// WEBPACK FOOTER //
// auth.deec0f4c7ed4f2d1a34a.bundle.js