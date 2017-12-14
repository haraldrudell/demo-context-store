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
    Sephora.Util.InflatorComps.Comps['Payments'] = function Payments(){
        return PaymentsClass;
    }
}
// jscs:disable maximumLineLength
const {
 colors, fontSizes, site, lineHeights, space
} = require('style');
const { Box, Flex, Grid, Text } = require('components/display');
const AccountLayout = require('components/RichProfile/MyAccount/AccountLayout/AccountLayout');
const CreditCards = require('./CreditCards/CreditCards');
const PleaseSignInBlock = require('components/RichProfile/MyAccount/PleaseSignIn');
const GiftCards = require('./GiftCards/GiftCards');
const OtherPayments = require('./OtherPayments/OtherPayments');
const Divider = require('components/Divider/Divider');
const SectionDivider = require('components/SectionDivider/SectionDivider');
const Link = require('components/Link/Link');
const Image = require('components/Image/Image');
const Locale = require('utils/LanguageLocale.js');


const Payments = function () { };

const styles = {
    subhead: {
        fontSize: fontSizes.h3,
        fontWeight: 700,
        lineHeight: lineHeights[2]
    }
};

Payments.prototype.render = function () {
    const isMobile = Sephora.isMobile();
    const isDesktop = Sephora.isDesktop();

    const subheadDivider =
        isMobile ? <Divider marginY={space[4]} /> : null;

    const subheadColWidth = isDesktop ? '16em' : null;
    const contentColWidth = isDesktop ? 'fill' : null;

    return (
        <AccountLayout
            section='account'
            page='payments'
            title='Payments & Credits'>

            {!Sephora.isRootRender && this.isUserReady() &&
            <div>
                {!this.isUserAuthenticated() &&
                <PleaseSignInBlock />
                }

                {this.isUserAuthenticated() &&
                    <Box
                        paddingY={space[5]}>

                        {this.state.isPlaySubscribed && Locale.isUS() &&
                            <div>
                                <Flex
                                    flexFlow='row wrap'
                                    rounded={isDesktop}
                                    alignItems='center'
                                    lineHeight={2}
                                    _css={isDesktop ? {
                                        paddingTop: space[4],
                                        paddingBottom: space[4],
                                        paddingLeft: space[6],
                                        paddingRight: space[6],
                                        borderWidth: 2,
                                        borderColor: colors.nearWhite
                                    } : null}>
                                    <Image
                                        width={120} height={45}
                                        src='/img/ufe/logo-play.svg' />
                                    <Text
                                        is='p'
                                        _css={isMobile ? {
                                            flexBasis: '100%',
                                            marginTop: space[3]
                                        } : {
                                            flex: 1,
                                            marginLeft: space[5]
                                        }}>
                                        If you want to change the payment associated to your
                                        {' '}
                                        <b>PLAY! by SEPHORA</b> subscription, please go to
                                        {' '}
                                        <Link
                                            primary={true}
                                            href='/profile/MyAccount/Subscriptions'>
                                            Subscriptions
                                        </Link>.
                                    </Text>
                                </Flex>
                                <SectionDivider />
                            </div>
                        }

                        <Grid>
                            <Grid.Cell width={subheadColWidth}>
                                <Text
                                    is='h2'
                                    _css={styles.subhead}>
                                    Credit Cards
                                </Text>
                                {subheadDivider}
                            </Grid.Cell>
                            <Grid.Cell width={contentColWidth}>
                                {this.state.creditCards &&
                                    <CreditCards
                                        creditCards={this.state.creditCards} />
                                }
                            </Grid.Cell>
                        </Grid>

                        {this.state.paypal &&
                            <div>
                                <SectionDivider />
                                <Grid>
                                    <Grid.Cell
                                        width={subheadColWidth}>
                                        <Text
                                            is='h2'
                                            _css={styles.subhead}>
                                            Other Payments
                                        </Text>
                                        {subheadDivider}
                                    </Grid.Cell>
                                    <Grid.Cell
                                        width={contentColWidth}>
                                        <OtherPayments
                                            userProfileId={this.userProfileId}
                                            paypalEmail={this.state.paypal.email} />
                                    </Grid.Cell>
                                </Grid>
                            </div>
                        }

                        <SectionDivider />

                        <Grid>
                            <Grid.Cell width={subheadColWidth}>
                                <Text
                                    is='h2'
                                    _css={styles.subhead}>
                                    Gift Cards
                                </Text>
                                {subheadDivider}
                            </Grid.Cell>
                            <Grid.Cell width={contentColWidth}>
                                <GiftCards />
                            </Grid.Cell>
                        </Grid>

                    </Box>
                }
            </div>
            }

        </AccountLayout>
    );
};


// Added by sephora-jsx-loader.js
Payments.prototype.path = 'RichProfile/MyAccount/Payments';
// Added by sephora-jsx-loader.js
Object.assign(Payments.prototype, require('./Payments.c.js'));
var originalDidMount = Payments.prototype.componentDidMount;
Payments.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Payments');
if (originalDidMount) originalDidMount.apply(this);
if (Payments.prototype.ctrlr) Payments.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Payments');
// Added by sephora-jsx-loader.js
Payments.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Payments.prototype.class = 'Payments';
// Added by sephora-jsx-loader.js
Payments.prototype.getInitialState = function() {
    Payments.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Payments.prototype.render = wrapComponentRender(Payments.prototype.render);
// Added by sephora-jsx-loader.js
var PaymentsClass = React.createClass(Payments.prototype);
// Added by sephora-jsx-loader.js
PaymentsClass.prototype.classRef = PaymentsClass;
// Added by sephora-jsx-loader.js
Object.assign(PaymentsClass, Payments);
// Added by sephora-jsx-loader.js
module.exports = PaymentsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/Payments/Payments.jsx