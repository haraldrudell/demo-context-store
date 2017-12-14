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
    Sephora.Util.InflatorComps.Comps['CountrySwitcherPrompt'] = function CountrySwitcherPrompt(){
        return CountrySwitcherPromptClass;
    }
}
const { css } = require('glamor');
const space = require('style').space;
const { Box, Text } = require('components/display');
const Radio = require('components/Inputs/Radio/Radio');
const Locale = require('utils/LanguageLocale.js');
const Modal = require('components/Modal/Modal');
const canImg = Locale.flags.CA;
const usImg = Locale.flags.US;

const CountrySwitcherPrompt = function () {
    this.state = {
        currCtry: null,
        currLang: null
    };
};

CountrySwitcherPrompt.prototype.render = function () {
    return (
        <Modal
            width='auto'
            open={this.props.isOpen}
            onDismiss={this.closeCountryModal}>
            <Modal.Header>
                <Modal.Title>
                    Change Country
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Box fontSize='h3'>
                    <Radio
                        name='US'
                        tabIndex='-1'
                        checked={
                            this.state.currCtry === Locale.COUNTRIES.US
                        }
                        onChange={
                            () => {
                                this.open(Locale.COUNTRIES.US);
                                this.closeCountryModal();
                            }
                        }>
                        <img src={usImg} className={css({
                            height: '1em'
                        })} />
                        <Text marginLeft={space[2]}>US</Text>
                    </Radio>
                    <Radio
                        name='CA-EN'
                        tabIndex='-1'
                        checked={
                            this.state.currCtry === Locale.COUNTRIES.CA &&
                            this.state.currLang === Locale.LANGUAGES.EN
                        }
                        onChange={
                            () => {
                                this.state.currCtry === Locale.COUNTRIES.CA
                                ?
                                    this.switchCountry(Locale.COUNTRIES.CA)
                                :
                                    this.open(Locale.COUNTRIES.CA);
                                this.closeCountryModal();
                            }
                        }>
                        <img src={canImg} className={css({
                            height: '1em'
                        })} />
                        <Text marginLeft={space[2]}>ENG</Text>
                    </Radio>
                    <Radio
                        name='CA-FR'
                        tabIndex='-1'
                        checked={
                            this.state.currCtry === Locale.COUNTRIES.CA &&
                            this.state.currLang === Locale.LANGUAGES.FR
                        }
                        onChange={
                            () => {
                                this.state.currCtry === Locale.COUNTRIES.CA
                                    ?
                                    this.switchCountry(
                                        Locale.COUNTRIES.CA,
                                        Locale.LANGUAGES.FR)
                                    :
                                    this.open(Locale.COUNTRIES.CA, Locale.LANGUAGES.FR);
                                this.closeCountryModal();
                            }
                        }>
                        <img
                            src={canImg} className={css({
                                height: '1em'
                            })}/>
                        <Text marginLeft={space[2]}>FR</Text>
                    </Radio>
            </Box>
            </Modal.Body>
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
CountrySwitcherPrompt.prototype.path = 'GlobalModals/CountrySwitcherModal/CountrySwitcherPrompt';
// Added by sephora-jsx-loader.js
Object.assign(CountrySwitcherPrompt.prototype, require('./CountrySwitcherPrompt.c.js'));
var originalDidMount = CountrySwitcherPrompt.prototype.componentDidMount;
CountrySwitcherPrompt.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: CountrySwitcherPrompt');
if (originalDidMount) originalDidMount.apply(this);
if (CountrySwitcherPrompt.prototype.ctrlr) CountrySwitcherPrompt.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: CountrySwitcherPrompt');
// Added by sephora-jsx-loader.js
CountrySwitcherPrompt.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
CountrySwitcherPrompt.prototype.class = 'CountrySwitcherPrompt';
// Added by sephora-jsx-loader.js
CountrySwitcherPrompt.prototype.getInitialState = function() {
    CountrySwitcherPrompt.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
CountrySwitcherPrompt.prototype.render = wrapComponentRender(CountrySwitcherPrompt.prototype.render);
// Added by sephora-jsx-loader.js
var CountrySwitcherPromptClass = React.createClass(CountrySwitcherPrompt.prototype);
// Added by sephora-jsx-loader.js
CountrySwitcherPromptClass.prototype.classRef = CountrySwitcherPromptClass;
// Added by sephora-jsx-loader.js
Object.assign(CountrySwitcherPromptClass, CountrySwitcherPrompt);
// Added by sephora-jsx-loader.js
module.exports = CountrySwitcherPromptClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/CountrySwitcherModal/CountrySwitcherPrompt/CountrySwitcherPrompt.jsx