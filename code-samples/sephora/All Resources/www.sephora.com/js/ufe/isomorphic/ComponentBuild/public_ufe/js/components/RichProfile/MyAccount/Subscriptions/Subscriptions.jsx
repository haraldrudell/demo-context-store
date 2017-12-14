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
    Sephora.Util.InflatorComps.Comps['Subscriptions'] = function Subscriptions(){
        return SubscriptionsClass;
    }
}
// jscs:disable maximumLineLength
const AccountLayout = require('components/RichProfile/MyAccount/AccountLayout/AccountLayout');
const { space, site } = require('style');
const Divider = require('components/Divider/Divider');
const Text = require('components/Text/Text');
const PleaseSignInBlock = require('components/RichProfile/MyAccount/PleaseSignIn');
const Flash = require('./Flash/Flash');
const Play = require('./Play/Play');
const Locale = require('utils/LanguageLocale.js');

const Subscriptions = function () {
    this.state = {
        isUserAuthenticated: null,
        flash: null,
        play: null,
        isRouge: null
    };
};

Subscriptions.prototype.render = function () {
    return (
        <AccountLayout
            section='account'
            page='subscriptions'
            title='Subscriptions'>

            {!Sephora.isRootRender && this.isUserReady() &&
                <div>
                    {!this.isUserAuthenticated() &&
                        <PleaseSignInBlock />
                    }

                    {this.isUserAuthenticated() &&
                        Locale.isCanada() ?
                            <Text
                                is='p'
                                fontWeight={700}
                                marginY={space[5]}>
                                We’re sorry, subscription services aren’t available
                                in Canada at this time.
                            </Text>
                        :
                            <div>
                                {this.state.flash &&
                                    <Flash
                                        flash={this.state.flash}
                                        isRouge={this.state.isRouge} />
                                }

                                {(this.state.flash && this.state.play) ?
                                    Sephora.isMobile() ?
                                        <Divider
                                            height={space[2]}
                                            color='nearWhite'
                                            marginY={space[5]}
                                            marginX={-site.PADDING_MW} />
                                        : <Divider
                                            marginTop={space[4]}
                                            marginBottom={space[7]} />
                                : null}

                                {this.state.play &&
                                    <Play play={this.state.play} />
                                }
                            </div>
                    }
                </div>
            }
        </AccountLayout>
    );
};


// Added by sephora-jsx-loader.js
Subscriptions.prototype.path = 'RichProfile/MyAccount/Subscriptions';
// Added by sephora-jsx-loader.js
Object.assign(Subscriptions.prototype, require('./Subscriptions.c.js'));
var originalDidMount = Subscriptions.prototype.componentDidMount;
Subscriptions.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Subscriptions');
if (originalDidMount) originalDidMount.apply(this);
if (Subscriptions.prototype.ctrlr) Subscriptions.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Subscriptions');
// Added by sephora-jsx-loader.js
Subscriptions.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Subscriptions.prototype.class = 'Subscriptions';
// Added by sephora-jsx-loader.js
Subscriptions.prototype.getInitialState = function() {
    Subscriptions.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Subscriptions.prototype.render = wrapComponentRender(Subscriptions.prototype.render);
// Added by sephora-jsx-loader.js
var SubscriptionsClass = React.createClass(Subscriptions.prototype);
// Added by sephora-jsx-loader.js
SubscriptionsClass.prototype.classRef = SubscriptionsClass;
// Added by sephora-jsx-loader.js
Object.assign(SubscriptionsClass, Subscriptions);
// Added by sephora-jsx-loader.js
module.exports = SubscriptionsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/Subscriptions/Subscriptions.jsx