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
    Sephora.Util.InflatorComps.Comps['PromotionalEmailsPrefs'] = function PromotionalEmailsPrefs(){
        return PromotionalEmailsPrefsClass;
    }
}
const { space } = require('style');
const { Box, Grid, Image, Text } = require('components/display');
const Divider = require('components/Divider/Divider');
const Button = require('components/Button/Button');
const Link = require('components/Link/Link');
const Radio = require('components/Inputs/Radio/Radio');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const ButtonOutline = require('components/Button/ButtonOutline');
const Select = require('components/Inputs/Select/Select');
const TextInput = require('components/Inputs/TextInput/TextInput');
const FormValidator = require('utils/FormValidator');
const Modal = require('components/Modal/Modal');
const { CANADA_LEGAL_COPY } = require('components/constants');

const { PROMOTIONAL_EMAILS_PREFS_COUNTRIES,
        PromotionalEmailsPrefsFrequency } = require('services/api/profile/constants');

const EmailFrequencyDisplayMap = {
    [PromotionalEmailsPrefsFrequency.DAILY]: 'All Offers',
    [PromotionalEmailsPrefsFrequency.WEEKLY]: 'Weekly',
    [PromotionalEmailsPrefsFrequency.MONTHLY]: 'Monthly'
};

const CountryMap = (function (countryPairs) {
    let map = {};
    countryPairs.forEach((pair) => {
        map[pair[0]] = pair[1];
    });
    return map;
}(PROMOTIONAL_EMAILS_PREFS_COUNTRIES));

const PromotionalEmailsPrefs = function () {
    this.state = {
        editMode: false,
        shouldShowZipPostalCodeInput: false,
        editedPrefs: null,
        prefs: null,
        formErrors: {}
    };
};

PromotionalEmailsPrefs.prototype.render = function () {
    let commonHeaderBlock = (
        <div>
            {Sephora.isMobile() &&
                <Divider marginY={space[3]} />
            }
            <Text is='p' marginBottom={space[2]}>
                We'll send you special offers, store news,
                and updates on the latest beauty trends.
            </Text>
            <Text is='p' marginBottom={space[3]}>
                <Link
                    primary={true}
                    onClick={this.handleSeeSampleEmailClick}>
                    See sample email
                </Link>
            </Text>
        </div>
    );

    let currentStatusBlock = this.state.prefs && (
        <Text is='p' marginBottom={space[2]}>
            <b>Status:</b> { this.state.prefs.subscribed ?
                'Subscribed' : 'Not subscribed'
            }
        </Text>
    );

    let currentFrequencyBlock =
        this.state.prefs && this.state.prefs.frequency && (

        <Text is='p' marginBottom={space[2]}>
            <b>Frequency:</b> {
                EmailFrequencyDisplayMap[this.state.prefs.frequency]
            }
        </Text>
    );

    let currentCountryBlock =
        this.state.prefs && this.state.prefs.country && (

        <Text is='p' marginBottom={space[2]}>
            <b>Country:</b> {
                CountryMap[this.state.prefs.country]
            }
        </Text>
    );

    let currentZipPostalBlock =
        this.state.prefs && this.state.prefs.zipPostalCode && (

        <Text is='p' marginBottom={space[2]}>
            <b>Postal code:</b> {
                this.state.prefs.zipPostalCode
            }
        </Text>
    );

    return this.state.prefs && (
        <Grid
            gutter={space[3]}
            alignItems='baseline'
            paddingY={space[5]}>

            <Grid.Cell
                width={Sephora.isMobile() ? 'fill' : '16em'}>
                <Text
                    is='h2' fontSize='h3'
                    fontWeight={700} lineHeight={2}>
                    Promotional
                    {Sephora.isDesktop() ? <br /> : ' '}
                    Emails
                </Text>
            </Grid.Cell>

            {this.state.editMode &&
                <Grid.Cell
                    width={Sephora.isDesktop() ? 'fill' : null}
                    order={Sephora.isMobile() ? 2 : null}>
                    {commonHeaderBlock}

                    {currentStatusBlock}
                    <Box marginTop={space[2]}>
                        <Radio
                            name='subunsub'
                            checked={this.state.editedPrefs.subscribed}
                            value={1}
                            onChange={e => this.handleStatusChange(e)}>
                            Subscribe
                        </Radio>
                        <Radio
                            name='subunsub'
                            checked={!this.state.editedPrefs.subscribed}
                            value={0}
                            onChange={e => this.handleStatusChange(e)}>
                            Unsubscribe
                        </Radio>
                    </Box>

                    {this.state.editedPrefs.subscribed &&
                        <div>
                            <Divider marginY={space[3]} />
                            {currentFrequencyBlock}
                            <Box marginTop={space[2]}>
                                <Radio
                                    name='freq'
                                    checked={this.state.editedPrefs.frequency ===
                                        PromotionalEmailsPrefsFrequency.DAILY}
                                    onChange={e => this.handleFrequencyChange(e)}
                                    value={PromotionalEmailsPrefsFrequency.DAILY}>
                                    All Offers
                                </Radio>
                                <Radio
                                    name='freq'
                                    checked={this.state.editedPrefs.frequency ===
                                        PromotionalEmailsPrefsFrequency.WEEKLY}
                                    onChange={e => this.handleFrequencyChange(e)}
                                    value={PromotionalEmailsPrefsFrequency.WEEKLY}>
                                    Weekly
                                </Radio>
                                <Radio
                                    name='freq'
                                    checked={this.state.editedPrefs.frequency ===
                                        PromotionalEmailsPrefsFrequency.MONTHLY}
                                    onChange={e => this.handleFrequencyChange(e)}
                                    value={PromotionalEmailsPrefsFrequency.MONTHLY}>
                                    Monthly
                                </Radio>
                                <Divider marginY={space[3]} />
                            </Box>

                            <Text is='p'>
                                <b>Postal code:</b> Enter your ZIP postal code to hear
                                about store events near you.
                            </Text>
                            <Box marginTop={space[3]}>
                                <Select
                                    label='Country'
                                    name='country'
                                    onChange={this.handleCountryChange}>{

                                    PROMOTIONAL_EMAILS_PREFS_COUNTRIES.map((value, index) =>
                                    <option
                                        key={index}
                                        value={value[0]}
                                        selected={this.state.editedPrefs.country ===
                                        value[0]}>
                                        {value[1]}
                                    </option>
                                    )}
                                </Select>
                                {this.state.shouldShowZipPostalCodeInput &&
                                <TextInput
                                    label='ZIP code'
                                    type='text'
                                    name='zipPostalCode'
                                    ref={(component) => {
                                        if (component !== null) {
                                            this._zipPostalCodeInput = component;
                                        }
                                    }}

                                    onChangeHook={() => {
                                        this.state.formErrors.zipPostalCode = null;
                                    }}

                                    validate={(zipPostalCode) => {
                                        if (FormValidator.isEmpty(zipPostalCode)) {
                                            return 'Please enter ZIP/Postal code.';
                                        }

                                        return this.state.formErrors.zipPostalCode || null;
                                    }}

                                    value={this.state.editedPrefs.zipPostalCode}
                                />
                                }
                            </Box>
                        </div>
                    }

                    <Grid
                        marginTop={space[5]}
                        gutter={space[3]}>
                        <Grid.Cell width={1 / 2}>
                            <ButtonOutline
                                block={true}
                                onClick={this.handleCancelClick}>
                                Cancel
                            </ButtonOutline>
                        </Grid.Cell>
                        <Grid.Cell width={1 / 2}>
                            <ButtonPrimary
                                block={true}
                                onClick={this.handleUpdateClick}>
                                Save
                            </ButtonPrimary>
                        </Grid.Cell>
                    </Grid>

                    {this.shouldShowCanadaLegalCopy() &&
                        <Text
                            is='p'
                            marginTop={space[3]}
                            fontSize='h6'
                            color='gray'>
                            {CANADA_LEGAL_COPY}
                        </Text>
                    }
                </Grid.Cell>
            }

            {!this.state.editMode &&
                <Grid.Cell
                    width={Sephora.isDesktop() ? 'fill' : null}
                    order={Sephora.isMobile() ? 2 : null}>
                    {commonHeaderBlock}
                    {currentStatusBlock}
                    {this.state.prefs && this.state.prefs.subscribed &&
                        currentFrequencyBlock}
                    {this.state.prefs && this.state.prefs.subscribed &&
                        currentCountryBlock}
                    {this.state.prefs && this.state.prefs.subscribed &&
                        currentZipPostalBlock}
                </Grid.Cell>
            }

            <Grid.Cell
                width='4em'
                textAlign='right'
                lineHeight={2}>
                {this.state.editMode ||
                    <Link
                        primary={true}
                        paddingY={space[2]}
                        marginY={-space[2]}
                        onClick={this.switchToEditMode}>
                        Edit
                    </Link>
                }

                {/* Ideally, this popup should go through
                    the GlobalModalsWrapper,
                    but since the latter can be leveraged via an action only
                    (and we definitelly don't need an action here), there should
                    be a refactoring in GlobalModalsWrapper first. */}
                <Modal
                    open={this.state.showSampleEmail}
                    onDismiss={this.handleSeeSampleEmailDismiss}>
                    <Modal.Body>
                        <Image
                            src={'/img/ufe/email-samples/email-example-promo.jpg'}
                            display='block'
                            marginX='auto' />
                    </Modal.Body>
                </Modal>
            </Grid.Cell>
        </Grid>
    );
};


// Added by sephora-jsx-loader.js
PromotionalEmailsPrefs.prototype.path = 'RichProfile/MyAccount/MailingPrefs/PromotionalEmailsPrefs';
// Added by sephora-jsx-loader.js
Object.assign(PromotionalEmailsPrefs.prototype, require('./PromotionalEmailsPrefs.c.js'));
var originalDidMount = PromotionalEmailsPrefs.prototype.componentDidMount;
PromotionalEmailsPrefs.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: PromotionalEmailsPrefs');
if (originalDidMount) originalDidMount.apply(this);
if (PromotionalEmailsPrefs.prototype.ctrlr) PromotionalEmailsPrefs.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: PromotionalEmailsPrefs');
// Added by sephora-jsx-loader.js
PromotionalEmailsPrefs.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
PromotionalEmailsPrefs.prototype.class = 'PromotionalEmailsPrefs';
// Added by sephora-jsx-loader.js
PromotionalEmailsPrefs.prototype.getInitialState = function() {
    PromotionalEmailsPrefs.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
PromotionalEmailsPrefs.prototype.render = wrapComponentRender(PromotionalEmailsPrefs.prototype.render);
// Added by sephora-jsx-loader.js
var PromotionalEmailsPrefsClass = React.createClass(PromotionalEmailsPrefs.prototype);
// Added by sephora-jsx-loader.js
PromotionalEmailsPrefsClass.prototype.classRef = PromotionalEmailsPrefsClass;
// Added by sephora-jsx-loader.js
Object.assign(PromotionalEmailsPrefsClass, PromotionalEmailsPrefs);
// Added by sephora-jsx-loader.js
module.exports = PromotionalEmailsPrefsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/MailingPrefs/PromotionalEmailsPrefs/PromotionalEmailsPrefs.jsx