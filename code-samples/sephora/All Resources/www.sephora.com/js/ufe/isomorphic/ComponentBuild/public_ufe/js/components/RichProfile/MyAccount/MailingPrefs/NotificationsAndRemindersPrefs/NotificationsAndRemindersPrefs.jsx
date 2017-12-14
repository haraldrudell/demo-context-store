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
    Sephora.Util.InflatorComps.Comps['NotificationsAndRemindersPrefs'] = function NotificationsAndRemindersPrefs(){
        return NotificationsAndRemindersPrefsClass;
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
const Modal = require('components/Modal/Modal');
const { CANADA_LEGAL_COPY } = require('components/constants');

const NotificationsAndRemindersPrefs = function () {
    this.state = {
        editMode: false,
        editedPrefs: null,
        prefs: null
    };
};

NotificationsAndRemindersPrefs.prototype.render = function () {
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
                    Notifications
                    {Sephora.isDesktop() ? <br /> : ' '}
                    &amp; Reminders
                </Text>
            </Grid.Cell>
            <Grid.Cell
                width={Sephora.isDesktop() ? 'fill' : null}
                order={Sephora.isMobile() ? 2 : null}>
                {Sephora.isMobile() &&
                    <Divider marginY={space[3]} />
                }
                <Text is='p' marginBottom={space[2]}>
                    We’ll send you special personalized recommendations
                    and other emails based on categories you shop most.
                </Text>
                <Text is='p' marginBottom={space[3]}>
                    <Link
                        primary={true}
                        onClick={this.handleSeeSampleEmailClick}>
                        See sample email
                    </Link>
                </Text>
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
                            src={'/img/ufe/email-samples/email-example-notify.jpg'}
                            display='block'
                            marginX='auto' />
                    </Modal.Body>
                </Modal>
            </Grid.Cell>
        </Grid>
    );
};


// Added by sephora-jsx-loader.js
NotificationsAndRemindersPrefs.prototype.path = 'RichProfile/MyAccount/MailingPrefs/NotificationsAndRemindersPrefs';
// Added by sephora-jsx-loader.js
Object.assign(NotificationsAndRemindersPrefs.prototype, require('./NotificationsAndRemindersPrefs.c.js'));
var originalDidMount = NotificationsAndRemindersPrefs.prototype.componentDidMount;
NotificationsAndRemindersPrefs.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: NotificationsAndRemindersPrefs');
if (originalDidMount) originalDidMount.apply(this);
if (NotificationsAndRemindersPrefs.prototype.ctrlr) NotificationsAndRemindersPrefs.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: NotificationsAndRemindersPrefs');
// Added by sephora-jsx-loader.js
NotificationsAndRemindersPrefs.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
NotificationsAndRemindersPrefs.prototype.class = 'NotificationsAndRemindersPrefs';
// Added by sephora-jsx-loader.js
NotificationsAndRemindersPrefs.prototype.getInitialState = function() {
    NotificationsAndRemindersPrefs.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
NotificationsAndRemindersPrefs.prototype.render = wrapComponentRender(NotificationsAndRemindersPrefs.prototype.render);
// Added by sephora-jsx-loader.js
var NotificationsAndRemindersPrefsClass = React.createClass(NotificationsAndRemindersPrefs.prototype);
// Added by sephora-jsx-loader.js
NotificationsAndRemindersPrefsClass.prototype.classRef = NotificationsAndRemindersPrefsClass;
// Added by sephora-jsx-loader.js
Object.assign(NotificationsAndRemindersPrefsClass, NotificationsAndRemindersPrefs);
// Added by sephora-jsx-loader.js
module.exports = NotificationsAndRemindersPrefsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/MailingPrefs/NotificationsAndRemindersPrefs/NotificationsAndRemindersPrefs.jsx