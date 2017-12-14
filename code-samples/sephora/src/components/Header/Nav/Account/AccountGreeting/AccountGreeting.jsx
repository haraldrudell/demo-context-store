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
    Sephora.Util.InflatorComps.Comps['AccountGreeting'] = function AccountGreeting(){
        return AccountGreetingClass;
    }
}
/* eslint-disable max-len */
const space = require('style').space;
const { Box, Text } = require('components/display');
const Link = require('components/Link/Link');
const userUtils = require('utils/User');

const thirdPartySignInLink = 'https://www.sephora.com/profile/login/loginForSocial.jsp?provider=lithium&nextpage=';
const thirdPartyRegisterLink = 'https://www.sephora.com/profile/registration/registration.jsp?type=sephoraAccountRegistrationSocial&provider=lithium&nextpage=';

const AccountGreeting = function () {};

AccountGreeting.prototype.render = function () {
    const { user } = this.props;
    const isMobile = Sephora.isMobile();
    const isUserReady = user && user.profileLocale !== undefined;
    return (
        isUserReady ?
            <Box
                fontSize={!isMobile ? 'h5' : null}
                lineHeight={2}>
                <Text
                    is='p'
                    fontSize={isMobile ? 'h4' : 'h3'}
                    fontWeight={700}
                    truncate={true}
                    maxWidth={!isMobile ? '18ch' : null}
                    data-at={Sephora.debug.dataAt('welcome_text')}>
                    Hi, {user.firstName ? user.firstName : 'Beautiful'}
                </Text>
                {user.profileStatus === 0 || !user.profileStatus ?
                    <Box marginTop={space[1]}>
                        <Link
                            paddingY={space[1]}
                            marginY={-space[1]}
                            fontWeight={700}
                            href={Sephora.isThirdPartySite ?
                                thirdPartySignInLink : ''}
                            onClick={!Sephora.isThirdPartySite ?
                                this.signInHandler : ''}
                            data-at={Sephora.debug.dataAt('sign_in')}>
                            Sign In
                        </Link>
                        {' '}or{' '}
                        <Link
                            paddingY={space[1]}
                            marginY={-space[1]}
                            fontWeight={700}
                            href={Sephora.isThirdPartySite ?
                                thirdPartyRegisterLink : ''}
                            onClick={!Sephora.isThirdPartySite ?
                                this.registerHandler : ''}
                            data-at={Sephora.debug.dataAt('register')}>
                            Register
                        </Link>
                    </Box>
                    : user.beautyInsiderAccount ?
                        <Box marginTop={space[1]}>
                            <Text
                                data-at={Sephora.debug.dataAt('user_status')}>
                                {userUtils.displayBiStatus(user.beautyInsiderAccount.vibSegment)}
                            </Text>
                            <Text
                                marginLeft={space[2]}
                                data-at={Sephora.debug.dataAt('user_points')}>
                                {user.beautyInsiderAccount.promotionPoints + ' pt' +
                                (user.beautyInsiderAccount.promotionPoints !== 1 ? 's' : '')}
                            </Text>
                        </Box>
                    : null
                }
            </Box>
        : null
    );
};


// Added by sephora-jsx-loader.js
AccountGreeting.prototype.path = 'Header/Nav/Account/AccountGreeting';
// Added by sephora-jsx-loader.js
Object.assign(AccountGreeting.prototype, require('./AccountGreeting.c.js'));
var originalDidMount = AccountGreeting.prototype.componentDidMount;
AccountGreeting.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: AccountGreeting');
if (originalDidMount) originalDidMount.apply(this);
if (AccountGreeting.prototype.ctrlr) AccountGreeting.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: AccountGreeting');
// Added by sephora-jsx-loader.js
AccountGreeting.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
AccountGreeting.prototype.class = 'AccountGreeting';
// Added by sephora-jsx-loader.js
AccountGreeting.prototype.getInitialState = function() {
    AccountGreeting.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
AccountGreeting.prototype.render = wrapComponentRender(AccountGreeting.prototype.render);
// Added by sephora-jsx-loader.js
var AccountGreetingClass = React.createClass(AccountGreeting.prototype);
// Added by sephora-jsx-loader.js
AccountGreetingClass.prototype.classRef = AccountGreetingClass;
// Added by sephora-jsx-loader.js
Object.assign(AccountGreetingClass, AccountGreeting);
// Added by sephora-jsx-loader.js
module.exports = AccountGreetingClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/Account/AccountGreeting/AccountGreeting.jsx