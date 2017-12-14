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
    Sephora.Util.InflatorComps.Comps['AccountNav'] = function AccountNav(){
        return AccountNavClass;
    }
}
const { site, shade, space } = require('style');
const Link = require('components/Link/Link');
const Divider = require('components/Divider/Divider');

const AccountNav = function () { };

AccountNav.prototype.render = function () {
    const {
        page
    } = this.props;

    let NavContent = [
        {
            href: '/profile/MyAccount',
            text: 'Account Information',
            isActive: page === 'account info'
        },
        {
            href: '/profile/MyAccount/Orders',
            text: 'Recent Orders',
            isActive: page === 'recent orders'
        },
        {
            href: '/profile/MyAccount/Subscriptions',
            text: 'Subscriptions',
            isActive: page === 'subscriptions'
        },
        {
            href: '/profile/MyAccount/Reservations',
            text: 'Reservations',
            isActive: page === 'reservations'
        },
        {
            href: '/profile/MyAccount/Addresses',
            text: 'Saved Addresses',
            isActive: page === 'saved addresses'
        },
        {
            href: '/profile/MyAccount/PaymentMethods',
            text: 'Payments & Credits',
            isActive: page === 'payments'
        },
        {
            href: '/profile/MyAccount/EmailPostal',
            text: 'Email & Mail Preferences',
            isActive: page === 'mail prefs'
        }
    ];

    return (
        <div>
            {Sephora.isMobile() &&
                <Divider
                    marginTop={space[5]}
                    marginBottom={space[3]}
                    height={space[2]}
                    color='nearWhite'
                    marginX={-site.PADDING_MW}/>
            }

            {NavContent.map((NavItem, index) =>
                <div>
                    {(Sephora.isMobile() && index > 0) &&
                        <Divider />
                    }
                    <Link
                        display='block'
                        href={NavItem.href}
                        paddingY={Sephora.isMobile() ? space[3] : space[2]}
                        fontWeight={NavItem.isActive ? 700 : null}
                        isActive={NavItem.isActive}>
                        {NavItem.text}
                    </Link>
                </div>
            )}
        </div>
    );
};


// Added by sephora-jsx-loader.js
AccountNav.prototype.path = 'RichProfile/MyAccount/AccountLayout';
// Added by sephora-jsx-loader.js
AccountNav.prototype.class = 'AccountNav';
// Added by sephora-jsx-loader.js
AccountNav.prototype.getInitialState = function() {
    AccountNav.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
AccountNav.prototype.render = wrapComponentRender(AccountNav.prototype.render);
// Added by sephora-jsx-loader.js
var AccountNavClass = React.createClass(AccountNav.prototype);
// Added by sephora-jsx-loader.js
AccountNavClass.prototype.classRef = AccountNavClass;
// Added by sephora-jsx-loader.js
Object.assign(AccountNavClass, AccountNav);
// Added by sephora-jsx-loader.js
module.exports = AccountNavClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/AccountLayout/AccountNav.jsx