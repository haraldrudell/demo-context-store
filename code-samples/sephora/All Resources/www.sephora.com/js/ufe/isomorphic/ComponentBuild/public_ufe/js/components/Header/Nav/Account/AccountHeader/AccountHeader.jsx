// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

const { colors, dropdown, space, zIndex } = require('style');
const { Box, Flex } = require('components/display');
const Dropdown = require('components/Dropdown/Dropdown');
const Arrow = require('components/Arrow/Arrow');

const AccountGreeting = require('../AccountGreeting/AccountGreeting');
const AccountMenu = require('../AccountMenu/AccountMenu');

const AccountHeader = function () {
    this.state = {
        user: {},
        socialProfile: null,
        isLithiumSuccessful: true,
        isOpen: false
    };
};

AccountHeader.prototype.asyncRender = 'UserInfo';

AccountHeader.prototype.render = function () {
    const isTablet = Sephora.isTouch && Sephora.isDesktop();
    const closedIndex = isTablet ? zIndex.DROPDOWN + 2 : null;

    const shouldDisplayAvatar = this.state.isLithiumSuccessful
        && this.state.socialProfile
        && this.state.socialProfile.avatar;

    const AVATAR_SIZE = 40;

    return (
        <Dropdown
            isHover={true}
            delayedHover={true}
            marginRight={space[2]}
            onTrigger={this.toggleOpen}>
            <Dropdown.Trigger>
                <Flex
                    position='relative'
                    cursor='default'
                    fontSize='h5'
                    alignItems='center'
                    paddingLeft={space[4]}
                    paddingRight={space[6]}
                    borderRight={1}
                    minWidth={180} height={54}
                    style={{
                        boxShadow: this.state.isOpen ? dropdown.SHADOW : null,
                        zIndex: this.state.isOpen ? zIndex.DROPDOWN : closedIndex,
                        borderRightColor: this.state.isOpen
                            ? 'transparent'
                            : colors.lightGray
                    }}>
                    <Arrow
                        direction={this.state.isOpen ? 'up' : 'down'}
                        _css={{
                            position: 'absolute',
                            top: '50%',
                            right: space[3],
                            transform: 'translate(0, -50%)'
                        }} />
                    {shouldDisplayAvatar &&
                        <Box
                            data-at={Sephora.debug.dataAt('user_avatar_' +
                                this.state.socialProfile.avatar)}
                            circle={true}
                            border={2}
                            width={AVATAR_SIZE}
                            height={AVATAR_SIZE}
                            marginLeft={-2}
                            marginRight={space[2]}
                            backgroundPosition='center'
                            backgroundSize='cover'
                            style={{
                                backgroundImage: `url(${this.state.socialProfile.avatar})`
                            }} />
                    }
                    <AccountGreeting
                        user={this.state.user}
                        socialProfile={this.state.socialProfile}
                        isLithiumSuccessful={this.state.isLithiumSuccessful} />
                </Flex>
                <Box
                    style={this.state.isOpen ? {
                        position: 'absolute',
                        zIndex: zIndex.DROPDOWN + 1,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: colors.white,
                        height: 5
                    } : null} />
            </Dropdown.Trigger>
            <Dropdown.Menu
                paddingBottom={space[3]}>
                <AccountMenu user={this.state.user} />
            </Dropdown.Menu>
        </Dropdown>
    );
};


// Added by sephora-jsx-loader.js
AccountHeader.prototype.path = 'Header/Nav/Account/AccountHeader';
// Added by sephora-jsx-loader.js
Object.assign(AccountHeader.prototype, require('./AccountHeader.c.js'));
var originalDidMount = AccountHeader.prototype.componentDidMount;
AccountHeader.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: AccountHeader');
if (originalDidMount) originalDidMount.apply(this);
if (AccountHeader.prototype.ctrlr) AccountHeader.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: AccountHeader');
// Added by sephora-jsx-loader.js
AccountHeader.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
AccountHeader.prototype.class = 'AccountHeader';
// Added by sephora-jsx-loader.js
AccountHeader.prototype.getInitialState = function() {
    AccountHeader.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
AccountHeader.prototype.render = wrapComponentRender(AccountHeader.prototype.render);
// Added by sephora-jsx-loader.js
var AccountHeaderClass = React.createClass(AccountHeader.prototype);
// Added by sephora-jsx-loader.js
AccountHeaderClass.prototype.classRef = AccountHeaderClass;
// Added by sephora-jsx-loader.js
Object.assign(AccountHeaderClass, AccountHeader);
// Added by sephora-jsx-loader.js
module.exports = AccountHeaderClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/Account/AccountHeader/AccountHeader.jsx