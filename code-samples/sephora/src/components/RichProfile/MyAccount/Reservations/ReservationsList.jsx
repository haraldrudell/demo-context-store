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
    Sephora.Util.InflatorComps.Comps['ReservationsList'] = function ReservationsList(){
        return ReservationsListClass;
    }
}
const { space } = require('style');
const dateUtils = require('utils/Date.js');
const Grid = require('components/Grid/Grid');
const Link = require('components/Link/Link');
const Text = require('components/Text/Text');
const Reservations = require('components/RichProfile/MyAccount/Reservations/Reservations.c');

const ReservationsList = function () { };

ReservationsList.prototype.render = function () {
    const {
        reservations,
        editUrl,
        closeAllReservationsModal
    } = this.props;

    return (
        <div>
            {reservations.map((reservation, index) =>
                <Grid
                    marginTop={index > 0 ? space[5] : null}>
                    <Grid.Cell
                        width='fill'>
                        <Text fontWeight={700}>
                            {reservation.activityName}
                        </Text>
                        <br />
                        <Text color='gray'>
                            {reservation.locationName}
                        </Text>
                    </Grid.Cell>
                    <Grid.Cell
                        width={Sephora.isMobile() ? '7em' : '8em'}
                        _css={Sephora.isMobile() ? { order: -1 } : {}}>
                        <Text>
                            {dateUtils.formatDateMDY(reservation.startDate)}
                        </Text>
                        <br />
                        <Text>
                            {dateUtils.getReservationTime(reservation.startDate)}
                        </Text>
                    </Grid.Cell>
                    <Grid.Cell
                        width='4em'
                        textAlign='right'>
                        {reservation.isEditable &&
                            <Link
                                primary={true}
                                padding={space[2]}
                                margin={-space[2]}
                                onClick={()=> {
                                    Reservations.handleLaunchTimeTrade(
                                        editUrl,
                                        closeAllReservationsModal,
                                        reservation.appointmentId,
                                        reservation.clientLastName
                                    );
                                }
                            }>
                                Edit
                            </Link>
                        }
                    </Grid.Cell>
                </Grid>
            )}
        </div>
    );
};


// Added by sephora-jsx-loader.js
ReservationsList.prototype.path = 'RichProfile/MyAccount/Reservations';
// Added by sephora-jsx-loader.js
ReservationsList.prototype.class = 'ReservationsList';
// Added by sephora-jsx-loader.js
ReservationsList.prototype.getInitialState = function() {
    ReservationsList.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ReservationsList.prototype.render = wrapComponentRender(ReservationsList.prototype.render);
// Added by sephora-jsx-loader.js
var ReservationsListClass = React.createClass(ReservationsList.prototype);
// Added by sephora-jsx-loader.js
ReservationsListClass.prototype.classRef = ReservationsListClass;
// Added by sephora-jsx-loader.js
Object.assign(ReservationsListClass, ReservationsList);
// Added by sephora-jsx-loader.js
module.exports = ReservationsListClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/Reservations/ReservationsList.jsx