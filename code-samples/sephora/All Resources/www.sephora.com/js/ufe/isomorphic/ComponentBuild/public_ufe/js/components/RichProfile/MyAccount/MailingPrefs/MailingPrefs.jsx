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
    Sephora.Util.InflatorComps.Comps['MailingPrefs'] = function MailingPrefs(){
        return MailingPrefsClass;
    }
}
const AccountLayout = require('components/RichProfile/MyAccount/AccountLayout/AccountLayout');
const { site, space } = require('style');
const Divider = require('components/Divider/Divider');
const PromotionalEmailsPrefs = require('./PromotionalEmailsPrefs/PromotionalEmailsPrefs');
const NotificationsAndRemindersPrefs = require('./NotificationsAndRemindersPrefs/NotificationsAndRemindersPrefs');
const PostalMailPrefs = require('./PostalMailPrefs/PostalMailPrefs');
const PleaseSignInBlock = require('components/RichProfile/MyAccount/PleaseSignIn');

const MailingPrefs = function () {
    this.state = {
        shouldShowPostalMailPrefs: false
    };
};

MailingPrefs.prototype.render = function () {

    const sectionDivider = Sephora.isMobile() ?
        <Divider
            height={space[2]}
            color='nearWhite'
            marginX={-site.PADDING_MW} />
        : <Divider />;
    return (
        <AccountLayout
            section='account'
            page='mail prefs'
            title='Email & Mail Preferences'>

            {!Sephora.isRootRender && this.isUserReady() &&
            <div>
                {!this.isUserAuthenticated() &&
                <PleaseSignInBlock />
                }

                {this.isUserAuthenticated() &&
                <div>
                    <PromotionalEmailsPrefs
                        ref={(comp) => this._promotionalEmailPrefs = comp}
                        onExpand={() => this.handleSectionExpand(
                            this._promotionalEmailPrefs)} />


                    {sectionDivider}
                    <NotificationsAndRemindersPrefs
                        ref={(comp) => this._notificationsAndRemindersPrefs = comp}
                        onExpand={() => this.handleSectionExpand(
                            this._notificationsAndRemindersPrefs)} />

                    {this.state.shouldShowPostalMailPrefs &&
                    <div>
                        {sectionDivider}
                        <PostalMailPrefs
                            ref={(comp) => this._postalMailPrefs = comp}
                            onExpand={() => this.handleSectionExpand(
                                this._postalMailPrefs)} />
                    </div>
                    }
                </div>
                }
            </div>
            }
        </AccountLayout>
    );
};


// Added by sephora-jsx-loader.js
MailingPrefs.prototype.path = 'RichProfile/MyAccount/MailingPrefs';
// Added by sephora-jsx-loader.js
Object.assign(MailingPrefs.prototype, require('./MailingPrefs.c.js'));
var originalDidMount = MailingPrefs.prototype.componentDidMount;
MailingPrefs.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: MailingPrefs');
if (originalDidMount) originalDidMount.apply(this);
if (MailingPrefs.prototype.ctrlr) MailingPrefs.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: MailingPrefs');
// Added by sephora-jsx-loader.js
MailingPrefs.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
MailingPrefs.prototype.class = 'MailingPrefs';
// Added by sephora-jsx-loader.js
MailingPrefs.prototype.getInitialState = function() {
    MailingPrefs.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
MailingPrefs.prototype.render = wrapComponentRender(MailingPrefs.prototype.render);
// Added by sephora-jsx-loader.js
var MailingPrefsClass = React.createClass(MailingPrefs.prototype);
// Added by sephora-jsx-loader.js
MailingPrefsClass.prototype.classRef = MailingPrefsClass;
// Added by sephora-jsx-loader.js
Object.assign(MailingPrefsClass, MailingPrefs);
// Added by sephora-jsx-loader.js
module.exports = MailingPrefsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/MailingPrefs/MailingPrefs.jsx