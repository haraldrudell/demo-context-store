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
    Sephora.Util.InflatorComps.Comps['CountrySwitcherModal'] = function CountrySwitcherModal(){
        return CountrySwitcherModalClass;
    }
}
const {
    modal, space
} = require('style');
const Grid = require('components/Grid/Grid');
const Modal = require('components/Modal/Modal');
const Image = require('components/Image/Image');
const Text = require('components/Text/Text');
const ButtonOutline = require('components/Button/ButtonOutline');
const ButtonPrimary = require('components/Button/ButtonPrimary');

var CountrySwitcherModal = function () {
    this.setState({
        hasCommerceItems: 0
    });
};

CountrySwitcherModal.prototype.render = function () {
    // jscs:disable maximumLineLength
    const popupMsg =
        'You are about to switch to our ' + this.props.switchCountryName + ' shopping experience. '
        + (this.state.hasCommerceItems ? 'If there are any ' + this.props.switchCountryName + '-restricted items, they will be removed from shopping basket. ' : '')
        + 'Do you want to continue?';
    return (
        <Modal
            open={this.props.isOpen}
            onDismiss={this.close}>
            <Modal.Header>
                <Modal.Title>
                    Switch to {this.props.switchCountryName}
                    <Image
                        marginLeft={space[3]}
                        src={'/contentimages/country-flags/icon-flag-' +
                        this.props.desiredCountry.toLowerCase() + '.png'}
                        position='relative'
                        height='1em'
                        top='.125em' />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Text is='p'>
                    {popupMsg}
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Grid
                    gutter={modal.ACTIONS_GUTTER}
                    _css={Sephora.isDesktop() ? {
                        width: modal.ACTIONS_WIDTH,
                        marginLeft: 'auto'
                    } : {}}>
                    <Grid.Cell width={1 / 2}>
                        <ButtonOutline
                            block={true}
                            onClick={this.close}>
                            Cancel
                        </ButtonOutline>
                    </Grid.Cell>
                    <Grid.Cell width={1 / 2}>
                        <ButtonPrimary
                            block={true}
                            onClick={()=>this.switchCountry(this.props.desiredCountry, this.props.desiredLang)}>
                            Continue
                        </ButtonPrimary>
                    </Grid.Cell>
                </Grid>
            </Modal.Footer>
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
CountrySwitcherModal.prototype.path = 'GlobalModals/CountrySwitcherModal';
// Added by sephora-jsx-loader.js
Object.assign(CountrySwitcherModal.prototype, require('./CountrySwitcherModal.c.js'));
var originalDidMount = CountrySwitcherModal.prototype.componentDidMount;
CountrySwitcherModal.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: CountrySwitcherModal');
if (originalDidMount) originalDidMount.apply(this);
if (CountrySwitcherModal.prototype.ctrlr) CountrySwitcherModal.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: CountrySwitcherModal');
// Added by sephora-jsx-loader.js
CountrySwitcherModal.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
CountrySwitcherModal.prototype.class = 'CountrySwitcherModal';
// Added by sephora-jsx-loader.js
CountrySwitcherModal.prototype.getInitialState = function() {
    CountrySwitcherModal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
CountrySwitcherModal.prototype.render = wrapComponentRender(CountrySwitcherModal.prototype.render);
// Added by sephora-jsx-loader.js
var CountrySwitcherModalClass = React.createClass(CountrySwitcherModal.prototype);
// Added by sephora-jsx-loader.js
CountrySwitcherModalClass.prototype.classRef = CountrySwitcherModalClass;
// Added by sephora-jsx-loader.js
Object.assign(CountrySwitcherModalClass, CountrySwitcherModal);
// Added by sephora-jsx-loader.js
module.exports = CountrySwitcherModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/CountrySwitcherModal/CountrySwitcherModal.jsx