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
    Sephora.Util.InflatorComps.Comps['Reservations'] = function Reservations(){
        return ReservationsClass;
    }
}
const AccountLayout = require(
    'components/RichProfile/MyAccount/AccountLayout/AccountLayout');
const { site, space } = require('style');
const { Box, Grid, Text } = require('components/display');
const Container = require('components/Container/Container');
const Divider = require('components/Divider/Divider');
const Link = require('components/Link/Link');
const ButtonOutline = require('components/Button/ButtonOutline');
const ReservationsList = require('./ReservationsList');
const ReservationActions = require('actions/ReservationActions');
const PleaseSignInBlock = require(
    'components/RichProfile/MyAccount/PleaseSignIn');

const Reservations = function () {
    this.state = {
        upcoming: null,
        previous: null,
        addUrl: null,
        editUrl: null,
        error: false
    };
};

Reservations.prototype.render = function () {
    return (
        <AccountLayout
            section='account'
            page='reservations'
            title='Reservations'>

            {!Sephora.isRootRender && this.isUserReady() &&
            <div>
                {!this.isUserAuthenticated() &&
                <PleaseSignInBlock />
                }

                {this.isUserAuthenticated() &&
                <div>
                    <Text
                        is='p'
                        marginY={space[4]}>
                        Book a custom makeover or enroll in a class
                        to learn from our trusted Beauty Advisors.
                    </Text>
                    <Box marginBottom={space[5]}>
                        <ButtonOutline
                            block={Sephora.isMobile()}
                            size={Sephora.isDesktop() ? 'lg' : null}
                            disabled={this.state.error}
                            onClick={()=> {
                                this.handleLaunchTimeTrade(this.state.addUrl);
                            }}>
                            Book a Reservation
                        </ButtonOutline>
                    </Box>
                    { this.state.error ?
                        <Text is='p' color='error'>
                            Your appointment information is currently
                            unavailable. Please try again later.
                        </Text>
                        :
                        this.state.upcoming && this.state.previous &&
                        <Box
                            fontSize={Sephora.isDesktop() ? 'h4' : null}>
                            {Sephora.isDesktop() &&
                                <Divider marginBottom={space[5]} />
                            }
                            <Grid>
                                <Grid.Cell
                                    width={Sephora.isDesktop() ? 1 / 3 : null}>
                                    <Text
                                        is='h2' fontSize='h3'
                                        fontWeight={700}>
                                        Upcoming
                                    </Text>
                                    {Sephora.isMobile() && <Divider marginY={space[3]} />}
                                </Grid.Cell>
                                <Grid.Cell
                                    marginBottom={space[5]}
                                    width={Sephora.isDesktop() ? 2 / 3 : null}>
                                    { this.state.upcoming.length > 0 ?
                                        <ReservationsList
                                            reservations={this.state.upcoming}
                                            editUrl={this.state.editUrl} />
                                        :
                                        <Text is='p'>
                                            You have no upcoming reservations.
                                        </Text>
                                    }
                                </Grid.Cell>
                            </Grid>
                            {Sephora.isMobile() ?
                                <Divider
                                    height={space[2]}
                                    color='nearWhite'
                                    marginBottom={space[3]}
                                    marginX={-site.PADDING_MW} />
                                : <Divider marginBottom={space[5]} />
                            }
                            <Grid>
                                <Grid.Cell
                                    width={Sephora.isDesktop() ? 1 / 3 : null}>
                                    <Text
                                        is='h2' fontSize='h3'
                                        fontWeight={700}>
                                        Previous
                                    </Text>
                                    {Sephora.isMobile() &&
                                        <Divider marginY={space[3]} />
                                    }
                                </Grid.Cell>
                                <Grid.Cell
                                    marginBottom={space[5]}
                                    width={Sephora.isDesktop() ? 2 / 3 : null}>
                                    { this.state.previous.length > 0 ?
                                        <ReservationsList reservations={
                                        this.state.previous.slice(0, 10)} />
                                        :
                                        <Text is='p'>
                                            You have no previous reservations.
                                        </Text>
                                    }
                                </Grid.Cell>
                            </Grid>
                            { this.state.previous.length > 10 &&
                                <Box
                                    textAlign='center'
                                    marginBottom={space[5]}>
                                    <Divider />
                                    <Link
                                        primary={true}
                                        padding={space[3]}
                                        onClick={()=> {
                                            this.showMoreReservationsModal(
                                                this.state.upcoming,
                                                this.state.previous,
                                                this.state.addUrl,
                                                this.state.editUrl
                                            );
                                        }}>
                                        Show more
                                    </Link>
                                </Box>
                            }
                        </Box>
                    }
                </div>
                }
            </div>
            }
        </AccountLayout>
    );
};


// Added by sephora-jsx-loader.js
Reservations.prototype.path = 'RichProfile/MyAccount/Reservations';
// Added by sephora-jsx-loader.js
Object.assign(Reservations.prototype, require('./Reservations.c.js'));
var originalDidMount = Reservations.prototype.componentDidMount;
Reservations.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Reservations');
if (originalDidMount) originalDidMount.apply(this);
if (Reservations.prototype.ctrlr) Reservations.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Reservations');
// Added by sephora-jsx-loader.js
Reservations.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Reservations.prototype.class = 'Reservations';
// Added by sephora-jsx-loader.js
Reservations.prototype.getInitialState = function() {
    Reservations.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Reservations.prototype.render = wrapComponentRender(Reservations.prototype.render);
// Added by sephora-jsx-loader.js
var ReservationsClass = React.createClass(Reservations.prototype);
// Added by sephora-jsx-loader.js
ReservationsClass.prototype.classRef = ReservationsClass;
// Added by sephora-jsx-loader.js
Object.assign(ReservationsClass, Reservations);
// Added by sephora-jsx-loader.js
module.exports = ReservationsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/Reservations/Reservations.jsx