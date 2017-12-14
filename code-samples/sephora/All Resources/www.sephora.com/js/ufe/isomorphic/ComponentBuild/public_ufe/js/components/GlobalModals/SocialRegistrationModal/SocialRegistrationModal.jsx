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
    Sephora.Util.InflatorComps.Comps['SocialRegistrationModal'] = function SocialRegistrationModal(){
        return SocialRegistrationModalClass;
    }
}
/* eslint-disable max-len */
const { space, modal } = require('style');
const { Box, Grid, Image, Text } = require('components/display');
const Modal = require('components/Modal/Modal');
const BiRegisterForm = require('components/BiRegisterForm/BiRegisterForm');
const userUtils = require('utils/User');
const Label = require('components/Inputs/Label/Label');
const Date = require('utils/Date');
const Select = require('components/Inputs/Select/Select');
const TextInput = require('components/Inputs/TextInput/TextInput');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const formValidator = require('utils/FormValidator');
const Link = require('components/Link/Link');
const ButtonOutline = require('components/Button/ButtonOutline');
const MIN_NICKNAME_LENGTH = 4;
const MAX_NICKNAME_LENGTH = 15;
const Locale = require('utils/LanguageLocale');
const Checkbox = require('components/Inputs/Checkbox/Checkbox');
const SubscribeEmail = require('components/SubscribeEmail/SubscribeEmail');

const SocialRegistrationModal = function () {
    this.state = { errorMessages: null };
};

SocialRegistrationModal.prototype.render = function () {

    const isUserBI = userUtils.isBI();
    const isMobile = Sephora.isMobile();
    const isCanada = Locale.isCanada();

    return (
        <Modal
            open={this.props.isOpen}
            onDismiss={this.close}
            width={modal.WIDTH.SM}>
            <Modal.Header>
                <Modal.Title>
                    Sephora Beauty Insider Community
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Box
                    textAlign='center'
                    marginY={isMobile ? space[3] : null}>
                    <Image
                        display='block'
                        marginX='auto'
                        src='/img/ufe/bi/logo-bi-community.svg'
                        width={258} height={58}
                        marginBottom={space[4]}
                        alt='Beauty Insider Community' />
                    <Text
                        is='p'
                        marginBottom={space[4]}>
                        Real people. Real talk. Real time.
                        Find beauty inspiration, ask questions,
                        and get the right recommendations from
                        Beauty Insider members like you. You ready?
                    </Text>
                </Box>
                <TextInput
                    name='nickname'
                    label='Nickname'
                    noMargin={true}
                    required={true}
                    maxLength={15}
                    placeholder='Required (4-15 characters)'
                    value={this.nicknameInput && this.nicknameInput.getValue()}
                    ref={comp => this.nicknameInput = comp}
                    invalid={this.state.invalidNickname}
                    validate={
                        (nickname) => {
                            if (formValidator.isEmpty(nickname)) {
                                return 'Nickname required.';
                            } else if (!formValidator.isValidLength(nickname, MIN_NICKNAME_LENGTH, MAX_NICKNAME_LENGTH)) {
                                return 'Nicknames must be 4 to 15 characters (letters or numbers) long. Special characters are not allowed.';
                            } else if (!formValidator.isAlphaNumeric(nickname)) {
                                return 'Please remove special characters from your nickname.';
                            }
                            return null;
                        }
                    } />
                {this.state.errorMessages &&
                    this.state.errorMessages.map((error, index) =>
                        <Text
                            key={index}
                            is='p'
                            color='error'
                            fontSize='h5'
                            marginY={space[2]}
                            lineHeight={2}>
                            {error}
                        </Text>
                    )
                }
                {isCanada &&
                    <Box
                        marginTop={space[2]}>
                        <Checkbox
                            checked={this.state.isAcceptCommunity}
                            onChange={this.handleAcceptCommunityClick}
                            name='accept_community'>
                            Join Community and agree to Terms of Use.
                        </Checkbox>
                        {this.state.displayJoinCommunityError &&
                            <Text
                                is='p'
                                marginTop={space[2]}
                                color='error'>
                                You must agree to the Community Terms and Conditions to continue
                            </Text>
                        }
                    </Box>
                }
                {isUserBI ||
                    <Box
                        borderTop={1}
                        borderColor='lightGray'
                        marginTop={space[4]}
                        paddingTop={space[4]}>
                        <Text
                            is='p'
                            textAlign='center'
                            marginBottom={space[4]}>
                            Enter your birthday for a free gift during your birthday
                            month—one of the perks of being a Beauty Insider.
                        </Text>
                        <BiRegisterForm
                            isSocialRegistration
                            ref={comp => this.biForm = comp} />
                        {isCanada &&
                            <Box
                                marginTop={space[2]}>
                                <Checkbox
                                    checked={this.state.isJoinBI}
                                    onChange={this.handleJoinBIClick}
                                    name='join_bi'>
                                    Join Beauty Insider and agree to Beauty Insider Terms and Conditions.
                                </Checkbox>
                                {this.state.displayJoinBIError &&
                                    <Text
                                        is='p'
                                        marginTop={space[2]}
                                        color='error'>
                                        You must agree to the Beauty Insider Terms and Conditions to continue
                                    </Text>
                                }
                                <SubscribeEmail
                                    marginTop={space[5]}
                                    ref={comp => this.subscribeEmail = comp} />
                            </Box>
                        }
                    </Box>
                }
            </Modal.Body>
            <Modal.Footer hasBorder={true}>
                <Box
                    fontSize='h5'
                    textAlign='left'
                    marginBottom={space[5]}
                    color='silver'
                    lineHeight={2}>
                    {!isUserBI ?
                        <Text is='p'>
                            Join Community & agree to
                            {' '}
                            <Link
                                primary={true}
                                onClick={()=> {
                                    this.openTermsAndConditions();
                                }}>
                                Terms of Use
                            </Link>.
                            {' '}
                            Certain Community profile information is public. You will also join Sephora's Beauty Insider program and agree to the
                            {' '}
                            <Link
                                primary={true}
                                onClick={()=> {
                                    this.openTermsAndConditions(true);
                                }}>
                                Beauty Insider Terms & Conditions
                            </Link>
                            {isCanada ? '.' : ' and to automatically receive emails.'}
                        </Text>
                        :
                        <Text is='p'>
                            Join Community & agree to
                            {' '}
                            <Link
                                primary={true}
                                onClick={()=> {
                                    this.openTermsAndConditions();
                                }}>
                                Terms of Use
                            </Link>.
                            {' '}
                            Certain Community profile information is public.
                        </Text>
                    }
                </Box>
                <Grid
                    gutter={modal.ACTIONS_GUTTER}
                    _css={!isMobile ? {
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
                            onClick={() => {
                                this.handleJoinClick();
                            }}>
                            Join Now
                        </ButtonPrimary>
                    </Grid.Cell>
                </Grid>
            </Modal.Footer>
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
SocialRegistrationModal.prototype.path = 'GlobalModals/SocialRegistrationModal';
// Added by sephora-jsx-loader.js
Object.assign(SocialRegistrationModal.prototype, require('./SocialRegistrationModal.c.js'));
var originalDidMount = SocialRegistrationModal.prototype.componentDidMount;
SocialRegistrationModal.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: SocialRegistrationModal');
if (originalDidMount) originalDidMount.apply(this);
if (SocialRegistrationModal.prototype.ctrlr) SocialRegistrationModal.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: SocialRegistrationModal');
// Added by sephora-jsx-loader.js
SocialRegistrationModal.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
SocialRegistrationModal.prototype.class = 'SocialRegistrationModal';
// Added by sephora-jsx-loader.js
SocialRegistrationModal.prototype.getInitialState = function() {
    SocialRegistrationModal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
SocialRegistrationModal.prototype.render = wrapComponentRender(SocialRegistrationModal.prototype.render);
// Added by sephora-jsx-loader.js
var SocialRegistrationModalClass = React.createClass(SocialRegistrationModal.prototype);
// Added by sephora-jsx-loader.js
SocialRegistrationModalClass.prototype.classRef = SocialRegistrationModalClass;
// Added by sephora-jsx-loader.js
Object.assign(SocialRegistrationModalClass, SocialRegistrationModal);
// Added by sephora-jsx-loader.js
module.exports = SocialRegistrationModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/SocialRegistrationModal/SocialRegistrationModal.jsx