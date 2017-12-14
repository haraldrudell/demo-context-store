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
    Sephora.Util.InflatorComps.Comps['EmailSignUp'] = function EmailSignUp(){
        return EmailSignUpClass;
    }
}
const { buttons, space } = require('style');
const { Grid, Text } = require('components/display');
const InputEmail = require('components/Inputs/InputEmail/InputEmail');
const ButtonOutline = require('components/Button/ButtonOutline');
const Arrow = require('components/Arrow/Arrow');
const Fieldset = require('components/Fieldset/Fieldset');

const EmailSignUp = function () {
    this.state = {
        showError: false,
        showSuccess: false,
        showLoading: false
    };
};

EmailSignUp.prototype.render = function () {
    const invalidEmailError = 'Please re-enter your email address using the proper format.';

    return (
        <div>
            <Grid
                is='form'
                action=''
                width={Sephora.isDesktop() ? 400 : null}>
                <Grid.Cell
                    marginTop={Sephora.isDesktop() ? buttons.PADDING_Y : null}
                    marginBottom={Sephora.isMobile() ? space[2] : null}
                    marginRight={Sephora.isDesktop() ? space[3] : null}
                    width={Sephora.isDesktop() ? 'fit' : 1}>
                    <Text fontSize='h5'>
                        Sign up for Sephora Emails
                    </Text>
                </Grid.Cell>
                <Grid.Cell width={Sephora.isDesktop() ? 'fill' : 1}>
                    <Fieldset disabled={this.state.showLoading}>
                        <Grid>
                            <Grid.Cell width='fill'>
                                <InputEmail
                                    label='Email'
                                    hideLabel={true}
                                    knockout={true}
                                    name='email_signup'
                                    disabled={this.state.showLoading}
                                    invalidEmailError={invalidEmailError}
                                    placeholder='Email'
                                    noMargin={true}
                                    rounded='left'
                                    ref={
                                        (c) => {
                                            if (c !== null) {
                                                this.input = c;
                                            }
                                        }
                                    }
                                    showErrors={this.state.showError} />
                            </Grid.Cell>
                            <Grid.Cell width='fit'>
                                <ButtonOutline
                                    onClick={e => this.handleOnClick(e)}
                                    color='white'
                                    type='submit'
                                    rounded='right'>
                                    <Arrow
                                        direction='right'
                                        verticalAlign='initial' />
                                </ButtonOutline>
                            </Grid.Cell>
                        </Grid>
                    </Fieldset>
                    {this.state.showSuccess &&
                        <Text
                            is='p'
                            lineHeight={2}
                            marginTop={space[2]}
                            color='white'>
                            Thanks for signing up for Sephora emails!
                        </Text>
                    }
                </Grid.Cell>
            </Grid>
        </div>
    );
};


// Added by sephora-jsx-loader.js
EmailSignUp.prototype.path = 'EmailSignUp';
// Added by sephora-jsx-loader.js
Object.assign(EmailSignUp.prototype, require('./EmailSignUp.c.js'));
var originalDidMount = EmailSignUp.prototype.componentDidMount;
EmailSignUp.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: EmailSignUp');
if (originalDidMount) originalDidMount.apply(this);
if (EmailSignUp.prototype.ctrlr) EmailSignUp.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: EmailSignUp');
// Added by sephora-jsx-loader.js
EmailSignUp.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
EmailSignUp.prototype.class = 'EmailSignUp';
// Added by sephora-jsx-loader.js
EmailSignUp.prototype.getInitialState = function() {
    EmailSignUp.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
EmailSignUp.prototype.render = wrapComponentRender(EmailSignUp.prototype.render);
// Added by sephora-jsx-loader.js
var EmailSignUpClass = React.createClass(EmailSignUp.prototype);
// Added by sephora-jsx-loader.js
EmailSignUpClass.prototype.classRef = EmailSignUpClass;
// Added by sephora-jsx-loader.js
Object.assign(EmailSignUpClass, EmailSignUp);
// Added by sephora-jsx-loader.js
module.exports = EmailSignUpClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/EmailSignUp/EmailSignUp.jsx