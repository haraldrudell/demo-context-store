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
    Sephora.Util.InflatorComps.Comps['AccountInfo'] = function AccountInfo(){
        return AccountInfoClass;
    }
}
// jscs:disable maximumLineLength
const space = require('style').space;
const { Box } = require('components/display');
const AccountLayout = require('components/RichProfile/MyAccount/AccountLayout/AccountLayout');
const Divider = require('components/Divider/Divider');
const Email = require('./AccountEmail/AccountEmail');
const Name = require('./AccountName/AccountName');
const Password = require('./AccountPassword/AccountPassword');
const PleaseSignInBlock = require('components/RichProfile/MyAccount/PleaseSignIn');

const AccountInfo = function () {
    this.state = {
        user: {},
        editSection: ''
    };
};

AccountInfo.prototype.render = function () {
    return (
        <AccountLayout
            section='account'
            page='account info'
            title='Account Information'>

            {!Sephora.isRootRender && this.isUserReady() &&
            <div>
                {!this.isUserAuthenticated() &&
                <PleaseSignInBlock />
                }

                {this.isUserAuthenticated() &&
                <Box marginY={space[5]}>
                    <AccountInfo.Name
                        user={this.state.user}
                        isEditMode={this.state.editSection === 'name'}
                        setEditSection={this.setEditSection} />
                    <Divider marginY={space[5]} />
                    <AccountInfo.Email
                        user={this.state.user}
                        isEditMode={this.state.editSection === 'email'}
                        setEditSection={this.setEditSection} />
                    <Divider marginY={space[5]} />
                    <AccountInfo.Password
                        isEditMode={this.state.editSection === 'password'}
                        setEditSection={this.setEditSection} />
                </Box>
                }
            </div>
            }
        </AccountLayout>
    );
};

AccountInfo.Email = Email;
AccountInfo.Name = Name;
AccountInfo.Password = Password;


// Added by sephora-jsx-loader.js
AccountInfo.prototype.path = 'RichProfile/MyAccount/AccountInfo';
// Added by sephora-jsx-loader.js
Object.assign(AccountInfo.prototype, require('./AccountInfo.c.js'));
var originalDidMount = AccountInfo.prototype.componentDidMount;
AccountInfo.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: AccountInfo');
if (originalDidMount) originalDidMount.apply(this);
if (AccountInfo.prototype.ctrlr) AccountInfo.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: AccountInfo');
// Added by sephora-jsx-loader.js
AccountInfo.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
AccountInfo.prototype.class = 'AccountInfo';
// Added by sephora-jsx-loader.js
AccountInfo.prototype.getInitialState = function() {
    AccountInfo.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
AccountInfo.prototype.render = wrapComponentRender(AccountInfo.prototype.render);
// Added by sephora-jsx-loader.js
var AccountInfoClass = React.createClass(AccountInfo.prototype);
// Added by sephora-jsx-loader.js
AccountInfoClass.prototype.classRef = AccountInfoClass;
// Added by sephora-jsx-loader.js
Object.assign(AccountInfoClass, AccountInfo);
// Added by sephora-jsx-loader.js
module.exports = AccountInfoClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/AccountInfo/AccountInfo.jsx