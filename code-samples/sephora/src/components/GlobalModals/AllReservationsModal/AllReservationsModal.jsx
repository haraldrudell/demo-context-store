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
    Sephora.Util.InflatorComps.Comps['AllReservationsModal'] = function AllReservationsModal(){
        return AllReservationsModalClass;
    }
}
const space = require('style').space;
const { Box, Text } = require('components/display');
const ReservationsList = require('components/RichProfile/MyAccount/Reservations/ReservationsList');
const Modal = require('components/Modal/Modal');
const ButtonOutline = require('components/Button/ButtonOutline');
const Divider = require('components/Divider/Divider');
const Reservations = require('components/RichProfile/MyAccount/Reservations/Reservations.c');

const AllReservationsModal = function () { };

AllReservationsModal.prototype.render = function () {
    const {
        isOpen,
        upcomingReservations,
        previousReservations,
        addReservationUrl,
        editReservationUrl
    } = this.props;

    return (
       <Modal
            open={isOpen}
            onDismiss={this.close}>
            <Modal.Header>
                <Modal.Title>
                    My Reservations
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ButtonOutline
                    onClick={()=> {
                        Reservations.handleLaunchTimeTrade(addReservationUrl, isOpen);
                    }}>
                    Book a Reservation
                </ButtonOutline>
                <Text
                    is='h2' fontSize='h3'
                    fontWeight={700}
                    marginY={space[5]}>
                    Upcoming
                </Text>
                <Box fontSize={Sephora.isDesktop() ? 'h4' : null}>
                    { this.props.upcomingReservations.length > 0 ?
                        <ReservationsList
                            reservations={upcomingReservations}
                            editUrl={editReservationUrl}
                            closeAllReservationsModal={isOpen} />
                        :
                        <Text is='p'>
                            You have no upcoming reservations.
                        </Text>
                    }
                </Box>
                <Divider marginY={space[5]} />
                <Text
                    is='h2'
                    fontSize='h3'
                    fontWeight={700}
                    marginBottom={space[5]}>
                    Previous
                </Text>
                <Box
                    fontSize={Sephora.isDesktop() ? 'h4' : null}>
                    <ReservationsList reservations={this.props.previousReservations} />
                </Box>
            </Modal.Body>
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
AllReservationsModal.prototype.path = 'GlobalModals/AllReservationsModal';
// Added by sephora-jsx-loader.js
Object.assign(AllReservationsModal.prototype, require('./AllReservationsModal.c.js'));
var originalDidMount = AllReservationsModal.prototype.componentDidMount;
AllReservationsModal.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: AllReservationsModal');
if (originalDidMount) originalDidMount.apply(this);
if (AllReservationsModal.prototype.ctrlr) AllReservationsModal.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: AllReservationsModal');
// Added by sephora-jsx-loader.js
AllReservationsModal.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
AllReservationsModal.prototype.class = 'AllReservationsModal';
// Added by sephora-jsx-loader.js
AllReservationsModal.prototype.getInitialState = function() {
    AllReservationsModal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
AllReservationsModal.prototype.render = wrapComponentRender(AllReservationsModal.prototype.render);
// Added by sephora-jsx-loader.js
var AllReservationsModalClass = React.createClass(AllReservationsModal.prototype);
// Added by sephora-jsx-loader.js
AllReservationsModalClass.prototype.classRef = AllReservationsModalClass;
// Added by sephora-jsx-loader.js
Object.assign(AllReservationsModalClass, AllReservationsModal);
// Added by sephora-jsx-loader.js
module.exports = AllReservationsModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/AllReservationsModal/AllReservationsModal.jsx