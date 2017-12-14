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
    Sephora.Util.InflatorComps.Comps['EmptyService'] = function EmptyService(){
        return EmptyServiceClass;
    }
}
const { space } = require('style');
const { Text } = require('components/display');
const ButtonPrimary = require('components/Button/ButtonPrimary');

const EmptyService = function() {
    this.state = {
        isTimeTradeDown: false
    };
};

EmptyService.prototype.render = function () {
    let isMobile = Sephora.isMobile();
    return (
        <div>
            <Text
                is='p'
                lineHeight={2}
                fontSize={!isMobile ? 'h3' : null}
                marginTop={space[2]}
                marginBottom={space[5]}>
                Treat yourself to a custom makeover.
                {isMobile ? ' ' : <br />}
                Products from your services will appear here.
            </Text>
            <ButtonPrimary
                size={!isMobile ? 'lg' : null}
                minWidth={this.props.buttonWidth}
                disabled={this.state.isTimeTradeDown}
                onClick={this.handleBookReservation}>
                Book a Reservation
            </ButtonPrimary>
            {this.state.isTimeTradeDown &&
                <Text
                    is='p'
                    lineHeight={2}
                    marginTop={space[2]}
                    color='error'>
                    Booking a reservation is unavailable at this time.
                </Text>
            }
        </div>
    );
};


// Added by sephora-jsx-loader.js
EmptyService.prototype.path = 'RichProfile/StoreServices/EmptyService';
// Added by sephora-jsx-loader.js
Object.assign(EmptyService.prototype, require('./EmptyService.c.js'));
var originalDidMount = EmptyService.prototype.componentDidMount;
EmptyService.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: EmptyService');
if (originalDidMount) originalDidMount.apply(this);
if (EmptyService.prototype.ctrlr) EmptyService.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: EmptyService');
// Added by sephora-jsx-loader.js
EmptyService.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
EmptyService.prototype.class = 'EmptyService';
// Added by sephora-jsx-loader.js
EmptyService.prototype.getInitialState = function() {
    EmptyService.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
EmptyService.prototype.render = wrapComponentRender(EmptyService.prototype.render);
// Added by sephora-jsx-loader.js
var EmptyServiceClass = React.createClass(EmptyService.prototype);
// Added by sephora-jsx-loader.js
EmptyServiceClass.prototype.classRef = EmptyServiceClass;
// Added by sephora-jsx-loader.js
Object.assign(EmptyServiceClass, EmptyService);
// Added by sephora-jsx-loader.js
module.exports = EmptyServiceClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/StoreServices/EmptyService/EmptyService.jsx