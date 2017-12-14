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
    Sephora.Util.InflatorComps.Comps['SocialReOptModal'] = function SocialReOptModal(){
        return SocialReOptModalClass;
    }
}
const { space, modal } = require('style');
const { Box, Grid, Image, Text } = require('components/display');
const Modal = require('components/Modal/Modal');
const ButtonOutline = require('components/Button/ButtonOutline');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const Link = require('components/Link/Link');
const Locale = require('utils/LanguageLocale.js');
const Checkbox = require('components/Inputs/Checkbox/Checkbox');


const SocialReOptModal = function () { };

SocialReOptModal.prototype.render = function () {

    return (
       <Modal
            open={this.props.isOpen}
            onDismiss={this.close}
            width={modal.WIDTH.SM}>
            <Modal.Header>
                <Modal.Title>
                    Updated Sephora Terms of Use
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Box
                    textAlign='center'
                    marginY={Sephora.isMobile() ? space[3] : null}>
                    <Image
                        display='block'
                        marginX='auto'
                        src='/img/ufe/bi/logo-bi-community.svg'
                        width={258} height={58}
                        marginBottom={space[4]}
                        alt='Beauty Insider Community' />
                    <Text
                        is='p'>
                        Real people. Real talk. Real time.
                        Find beauty inspiration, ask questions,
                        and get the right recommendations from
                        Beauty Insider members like you. You ready?
                    </Text>
                    <Text
                        is='p'
                        marginTop={space[6]}>
                        <b>Our Terms of Use have changed.</b>
                    </Text>
                </Box>
            </Modal.Body>

            <Modal.Footer hasBorder={true}>
                {Locale.isUS() ?
                    <Box
                        fontSize='h5'
                        textAlign='left'
                        marginBottom={space[5]}
                        color='silver'
                        lineHeight={2}>
                        By choosing “Continue” you agree to our
                        {' '}
                        <Link
                            primary={true}
                            onClick={()=> {
                                this.openTermsAndConditions();
                            }}>
                            Terms of Use
                        </Link>.
                        {' '}
                        Certain Community profile information is public. If you choose “Cancel“,
                        you will still have a public profile page. See
                        {' '}
                        <Link
                            primary={true}
                            onClick={()=> {
                                this.openTermsAndConditions();
                            }}>
                            Terms of Use
                        </Link>
                        {' '}
                        for more information.
                    </Box>
                :
                    <Box
                        fontSize='h5'
                        textAlign='left'
                        marginBottom={space[5]}
                        color='silver'
                        lineHeight={2}>
                        <Checkbox
                            name='TermsAndConditions'
                            checked={this.state.hasAcceptedTerms}
                            onChange={this.handleAcceptCommunityClick}>
                            <div>
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
                                Certain Community profile information is public. If you choose
                                “Cancel“, you will still have a public profile page. See
                                {' '}
                                <Link
                                    primary={true}
                                    onClick={()=> {
                                        this.openTermsAndConditions();
                                    }}>
                                    Terms of Use
                                </Link>
                                {' '}
                                for more information.
                            </div>
                        </Checkbox>
                        <Box marginTop={space[2]}>
                            {this.state.displayErrorMessage &&
                                <Text
                                    is='p'
                                    marginTop={space[2]}
                                    color='error'>
                                    You must agree to the Community Terms and Conditions to continue
                                </Text>
                            }
                        </Box>
                    </Box>
                }
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
                            onClick={this.handleClick}>
                            Continue
                        </ButtonPrimary>
                    </Grid.Cell>
                </Grid>
            </Modal.Footer>
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
SocialReOptModal.prototype.path = 'GlobalModals/SocialReOptModal';
// Added by sephora-jsx-loader.js
Object.assign(SocialReOptModal.prototype, require('./SocialReOptModal.c.js'));
var originalDidMount = SocialReOptModal.prototype.componentDidMount;
SocialReOptModal.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: SocialReOptModal');
if (originalDidMount) originalDidMount.apply(this);
if (SocialReOptModal.prototype.ctrlr) SocialReOptModal.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: SocialReOptModal');
// Added by sephora-jsx-loader.js
SocialReOptModal.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
SocialReOptModal.prototype.class = 'SocialReOptModal';
// Added by sephora-jsx-loader.js
SocialReOptModal.prototype.getInitialState = function() {
    SocialReOptModal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
SocialReOptModal.prototype.render = wrapComponentRender(SocialReOptModal.prototype.render);
// Added by sephora-jsx-loader.js
var SocialReOptModalClass = React.createClass(SocialReOptModal.prototype);
// Added by sephora-jsx-loader.js
SocialReOptModalClass.prototype.classRef = SocialReOptModalClass;
// Added by sephora-jsx-loader.js
Object.assign(SocialReOptModalClass, SocialReOptModal);
// Added by sephora-jsx-loader.js
module.exports = SocialReOptModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/SocialReOptModal/SocialReOptModal.jsx