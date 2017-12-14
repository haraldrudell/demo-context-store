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
    Sephora.Util.InflatorComps.Comps['PostalMailPrefs'] = function PostalMailPrefs(){
        return PostalMailPrefsClass;
    }
}
const { space } = require('style');
const { Box, Grid, Text } = require('components/display');
const Divider = require('components/Divider/Divider');
const Button = require('components/Button/Button');
const Link = require('components/Link/Link');
const Radio = require('components/Inputs/Radio/Radio');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const ButtonOutline = require('components/Button/ButtonOutline');
const AddressForm = require('components/Addresses/AddressForm/AddressForm');
const Locale = require('utils/LanguageLocale');
const {
 CANADA_LEGAL_COPY
} = require('components/constants');

const PostalMailPrefs = function () {
    this.state = {
        editMode: false,
        editedPrefs: null,
        prefs: null,
        defaultCountryCode: null,
        shouldShowCanadaLegalCopy: false,
        countryList: [

            // jscs:disable requireDotNotation
            {
                countryCode: 'US',
                countryLongName: Locale.COUNTRY_LONG_NAMES['US']
            },

            // jscs:disable requireDotNotation
            {
                countryCode: 'CA',
                countryLongName: Locale.COUNTRY_LONG_NAMES['CA']
            }
        ]
    };
};

PostalMailPrefs.prototype.render = function () {
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
                    Postal Mail
                </Text>
            </Grid.Cell>
            <Grid.Cell
                width={Sephora.isDesktop() ? 'fill' : null}
                order={Sephora.isMobile() ? 2 : null}>
                {Sephora.isMobile() &&
                    <Divider marginY={space[3]} />
                }
                <Text is='p'>
                    <b>Status:</b> { this.state.prefs.subscribed ?
                        'Subscribed' : 'Not subscribed'
                    }
                </Text>
                {this.state.editMode &&
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
                        {this.state.editedPrefs.subscribed &&
                            <Box marginTop={space[5]}>
                                <AddressForm
                                    isEditMode={true}
                                    address={this.state.editedPrefs.address}
                                    isPhoneFieldHidden={true}
                                    isFirstNameFieldDisabled={true}
                                    isLastNameFieldDisabled={true}
                                    country={this.state.defaultCountryCode}
                                    countryList={this.state.countryList}
                                    ref={comp => this._addressFormComponent = comp}
                                />
                            </Box>
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
                        <Text
                            is='p'
                            fontSize='h5'
                            color='gray'
                            marginTop={space[2]}>
                            {this.state.editedPrefs.subscribed &&
                                this.state.shouldShowCanadaLegalCopy ? CANADA_LEGAL_COPY :
                                'Sephora does not send postal mail outside the U.S. and Canada.'
                            }
                        </Text>
                    </Box>
                }
            </Grid.Cell>
            <Grid.Cell
                width='4em'
                textAlign='right'
                lineHeight={2}>
                {this.state.editMode ||
                    <Link
                        primary={true}
                        marginY={-space[2]}
                        paddingY={space[2]}
                        onClick={this.switchToEditMode}>
                        Edit
                    </Link>
                }
            </Grid.Cell>
        </Grid>
    );
};


// Added by sephora-jsx-loader.js
PostalMailPrefs.prototype.path = 'RichProfile/MyAccount/MailingPrefs/PostalMailPrefs';
// Added by sephora-jsx-loader.js
Object.assign(PostalMailPrefs.prototype, require('./PostalMailPrefs.c.js'));
var originalDidMount = PostalMailPrefs.prototype.componentDidMount;
PostalMailPrefs.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: PostalMailPrefs');
if (originalDidMount) originalDidMount.apply(this);
if (PostalMailPrefs.prototype.ctrlr) PostalMailPrefs.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: PostalMailPrefs');
// Added by sephora-jsx-loader.js
PostalMailPrefs.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
PostalMailPrefs.prototype.class = 'PostalMailPrefs';
// Added by sephora-jsx-loader.js
PostalMailPrefs.prototype.getInitialState = function() {
    PostalMailPrefs.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
PostalMailPrefs.prototype.render = wrapComponentRender(PostalMailPrefs.prototype.render);
// Added by sephora-jsx-loader.js
var PostalMailPrefsClass = React.createClass(PostalMailPrefs.prototype);
// Added by sephora-jsx-loader.js
PostalMailPrefsClass.prototype.classRef = PostalMailPrefsClass;
// Added by sephora-jsx-loader.js
Object.assign(PostalMailPrefsClass, PostalMailPrefs);
// Added by sephora-jsx-loader.js
module.exports = PostalMailPrefsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/MailingPrefs/PostalMailPrefs/PostalMailPrefs.jsx