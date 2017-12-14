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
    Sephora.Util.InflatorComps.Comps['TimeTradeModal'] = function TimeTradeModal(){
        return TimeTradeModalClass;
    }
}
const space = require('style').space;
const Modal = require('components/Modal/Modal');
const { Box } = require('components/display');

const TimeTradeModal = function () { };

TimeTradeModal.prototype.render = function () {
    return (
       <Modal
            width={790}
            open={this.props.isOpen}
            onDismiss={this.close}>
            <Box
                is='iframe'
                src={this.props.timeTradeUrl}
                name='olrVendorContent'
                id='olrVendorContent'
                padding={space[5]}
                width='100%'
                height={672} />
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
TimeTradeModal.prototype.path = 'GlobalModals/TimeTradeModal';
// Added by sephora-jsx-loader.js
Object.assign(TimeTradeModal.prototype, require('./TimeTradeModal.c.js'));
var originalDidMount = TimeTradeModal.prototype.componentDidMount;
TimeTradeModal.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: TimeTradeModal');
if (originalDidMount) originalDidMount.apply(this);
if (TimeTradeModal.prototype.ctrlr) TimeTradeModal.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: TimeTradeModal');
// Added by sephora-jsx-loader.js
TimeTradeModal.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
TimeTradeModal.prototype.class = 'TimeTradeModal';
// Added by sephora-jsx-loader.js
TimeTradeModal.prototype.getInitialState = function() {
    TimeTradeModal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
TimeTradeModal.prototype.render = wrapComponentRender(TimeTradeModal.prototype.render);
// Added by sephora-jsx-loader.js
var TimeTradeModalClass = React.createClass(TimeTradeModal.prototype);
// Added by sephora-jsx-loader.js
TimeTradeModalClass.prototype.classRef = TimeTradeModalClass;
// Added by sephora-jsx-loader.js
Object.assign(TimeTradeModalClass, TimeTradeModal);
// Added by sephora-jsx-loader.js
module.exports = TimeTradeModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/TimeTradeModal/TimeTradeModal.jsx