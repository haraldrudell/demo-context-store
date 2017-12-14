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
    Sephora.Util.InflatorComps.Comps['RewardModal'] = function RewardModal(){
        return RewardModalClass;
    }
}
const space = require('style').space;
const Modal = require('components/Modal/Modal');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const Link = require('components/Link/Link');
const Text = require('components/Text/Text');
const Rewards = require('components/Basket/Rewards/Rewards');
const userUtils = require('utils/User');
const basketUtils = require('utils/Basket');

const RewardModal = function () {
    this.state = {
        biPoints: null
    };
};

RewardModal.prototype.render = function () {
    return (

        <Modal
            open={this.props.isOpen}
            onDismiss={this.isDone}
            isFixedHeader={true}
            isFixedSubheader={true}
            showDismiss={false}>
            <Modal.Header>
                <Modal.Title>
                    Beauty Insider rewards
                </Modal.Title>
                <Link
                    primary={true}
                    padding={space[3]}
                    margin={-space[3]}
                    onClick={this.isDone}>
                    Done
                </Link>
            </Modal.Header>
            <Modal.Subheader>
                <Text>
                    Status: <b>{userUtils.getBiStatusText()}</b>
                </Text>
                <Text fontWeight={700}>
                    {this.state.biPoints} points
                </Text>
            </Modal.Subheader>
            <Modal.Body>
                <Rewards />
            </Modal.Body>
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
RewardModal.prototype.path = 'GlobalModals/RewardModal';
// Added by sephora-jsx-loader.js
Object.assign(RewardModal.prototype, require('./RewardModal.c.js'));
var originalDidMount = RewardModal.prototype.componentDidMount;
RewardModal.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: RewardModal');
if (originalDidMount) originalDidMount.apply(this);
if (RewardModal.prototype.ctrlr) RewardModal.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: RewardModal');
// Added by sephora-jsx-loader.js
RewardModal.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
RewardModal.prototype.class = 'RewardModal';
// Added by sephora-jsx-loader.js
RewardModal.prototype.getInitialState = function() {
    RewardModal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
RewardModal.prototype.render = wrapComponentRender(RewardModal.prototype.render);
// Added by sephora-jsx-loader.js
var RewardModalClass = React.createClass(RewardModal.prototype);
// Added by sephora-jsx-loader.js
RewardModalClass.prototype.classRef = RewardModalClass;
// Added by sephora-jsx-loader.js
Object.assign(RewardModalClass, RewardModal);
// Added by sephora-jsx-loader.js
module.exports = RewardModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/RewardModal/RewardModal.jsx