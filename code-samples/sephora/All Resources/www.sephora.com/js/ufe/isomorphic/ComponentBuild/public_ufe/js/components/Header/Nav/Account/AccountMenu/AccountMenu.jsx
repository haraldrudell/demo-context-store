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
    Sephora.Util.InflatorComps.Comps['AccountMenu'] = function AccountMenu(){
        return AccountMenuClass;
    }
}
const space = require('style').space;
const { Box } = require('components/display');
const Link = require('components/Link/Link');
const Divider = require('components/Divider/Divider');
const UrlUtils = require('utils/Url');

/* eslint-disable max-len */
const thirdPartySignOutLink = 'https://www.sephora.com/profile/logout/logoutForSocial.jsp?provider=lithium&nextpage=';

const AccountMenu = function () {
    this.state = {
        isAnonymous: null
    };
};

AccountMenu.prototype.render = function () {
    const ANON_URL = '/about-beauty-insider';
    const RECOGNIZED_URL = '/profile/BeautyInsider';

    const isMobile = Sephora.isMobile();

    const linkStyle = {
        paddingTop: isMobile ? space[3] : space[2],
        paddingRight: space[4],
        paddingBottom: isMobile ? space[3] : space[2],
        paddingLeft: space[4],
        width: '100%'
    };

    return (
        <Box
            lineHeight={2}
            paddingTop={space[1]}>
            <Link
                display='block'
                _css={linkStyle}
                href='/profile/me'
                onClick={() => this.trackNavClick('Profile')}>
                Profile
            </Link>
            <Link
                display='block'
                _css={linkStyle}
                href={this.state.isAnonymous ? ANON_URL : RECOGNIZED_URL}
                onClick={() => this.trackNavClick('Beauty Insider')}>
                Beauty Insider
            </Link>
            <Link
                display='block'
                _css={linkStyle}
                href='/profile/Lists'
                onClick={() => this.trackNavClick('Lists')}>
                Lists
            </Link>
            <Link
                display='block'
                _css={linkStyle}
                href='/profile/MyAccount'
                onClick={() => this.trackNavClick('My Account')}>
                Account
            </Link>
            <Divider
                marginX={space[4]}
                marginY={space[2]}/>
            <Link
                display='block'
                _css={linkStyle}
                href='/profile/MyAccount/Orders'
                onClick={() => this.trackNavClick('Recent Orders')}>
                Orders
            </Link>
            <Link
                display='block'
                _css={linkStyle}
                href='/profile/MyAccount/Reservations'
                onClick={() => this.trackNavClick('Reservations')}>
                Reservations
            </Link>
            <Link
                display='block'
                _css={linkStyle}
                href={UrlUtils.getLink('/rewards')}
                onClick={() => this.trackNavClick('Rewards Bazaar')}>
                Rewards Bazaar
            </Link>
            {this.props.user.profileStatus && this.props.user.profileStatus !== 0 ?
                <div>
                    <Divider
                        marginX={space[4]}
                        marginY={space[2]} />
                    <Link
                        display='block'
                        _css={linkStyle}
                        href={Sephora.isThirdPartySite ? thirdPartySignOutLink : ''}
                        onClick={this.signOutClickHandler}>
                        Sign Out
                    </Link>
                </div>
                : null
            }
        </Box>
    );
};


// Added by sephora-jsx-loader.js
AccountMenu.prototype.path = 'Header/Nav/Account/AccountMenu';
// Added by sephora-jsx-loader.js
Object.assign(AccountMenu.prototype, require('./AccountMenu.c.js'));
var originalDidMount = AccountMenu.prototype.componentDidMount;
AccountMenu.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: AccountMenu');
if (originalDidMount) originalDidMount.apply(this);
if (AccountMenu.prototype.ctrlr) AccountMenu.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: AccountMenu');
// Added by sephora-jsx-loader.js
AccountMenu.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
AccountMenu.prototype.class = 'AccountMenu';
// Added by sephora-jsx-loader.js
AccountMenu.prototype.getInitialState = function() {
    AccountMenu.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
AccountMenu.prototype.render = wrapComponentRender(AccountMenu.prototype.render);
// Added by sephora-jsx-loader.js
var AccountMenuClass = React.createClass(AccountMenu.prototype);
// Added by sephora-jsx-loader.js
AccountMenuClass.prototype.classRef = AccountMenuClass;
// Added by sephora-jsx-loader.js
Object.assign(AccountMenuClass, AccountMenu);
// Added by sephora-jsx-loader.js
module.exports = AccountMenuClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/Account/AccountMenu/AccountMenu.jsx