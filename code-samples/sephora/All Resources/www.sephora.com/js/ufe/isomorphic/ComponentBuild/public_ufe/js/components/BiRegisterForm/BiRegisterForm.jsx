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
    Sephora.Util.InflatorComps.Comps['BiRegisterForm'] = function BiRegisterForm(){
        return BiRegisterFormClass;
    }
}
const { space } = require('style');
const Link = require('components/Link/Link');
const Select = require('components/Inputs/Select/Select');
const Fieldset = require('components/Fieldset/Fieldset');
const FormValidator = require('utils/FormValidator');
const Text = require('components/Text/Text');
const Image = require('components/Image/Image');
const Grid = require('components/Grid/Grid');
const Checkbox = require('components/Inputs/Checkbox/Checkbox');
const Label = require('components/Inputs/Label/Label');
const Date = require('utils/Date');

const BiRegisterForm = function () {
    this.state = {
        isOpen: false,
        joinBICheckbox: this.props.isStoreUser || false,
        biFormError: null,
        biMonth: (this.props.biData && this.props.biData.bMon) || '',
        biDay: (this.props.biData && this.props.biData.bDay) || '',
        biYear: (this.props.biData && this.props.biData.bYear) || '',
        monthInvalid: false,
        dayInvalid: false,
        yearInvald: false,
        isCALocale: false
    };

};

BiRegisterForm.prototype.render = function () {
    const {
        isSocialRegistration,
        isApplePaySignIn,
        isStoreUser,
        disabled
    } = this.props;

    return (
        <div>
            {!(isApplePaySignIn || isSocialRegistration) &&
                <div>
                    <Image
                        disableLazyLoad={true}
                        display='block'
                        src='/img/ufe/bi/logo-beauty-insider.svg'
                        width={184} height={28}
                        marginBottom={space[3]}
                        marginX='auto' />
                    <Text
                        is='p'
                        marginBottom={space[3]}
                        textAlign='center'>
                        Become a Beauty Insider!
                        Join our free rewards program for free
                        deluxe samples, birthday gifts, and more.
                    </Text>
                </div>
            }
            {this.state.biFormError !== null && isApplePaySignIn &&
            <Text
                is='p'
                marginTop={space[2]}
                lineHeight={2}
                color='error'
                fontSize='h5'>
                {this.state.biFormError}
            </Text>
            }
            {!isSocialRegistration &&
            <Checkbox
                checked={this.state.joinBICheckbox}
                disabled={isStoreUser}
                onChange={this.handleJoinBIClick}
                name='join_bi'>
                <span>
                    {isApplePaySignIn ?
                        'Join Beauty Insider & agree to'
                        :
                    'Join and agree to' }
                    {' '}
                    <Link
                        textDecoration='underline'
                        onClick={this.handleTermsClick}>
                        {isApplePaySignIn ? 'Terms & Conditions' :
                        'BI Terms & Conditions'}
                    </Link>
                </span>
            </Checkbox>
            }
            {!isApplePaySignIn &&
                <div>
                    {!(this.state.isCALocale || isSocialRegistration) &&
                    <Text
                        is='p'
                        color='gray'
                        fontSize='h5'>
                        By joining, you will automatically receive
                        Beauty Insider offers via email.
                    </Text>
                    }
                    <Label marginTop={space[3]}>Birth date</Label>
                    <Grid gutter={space[1]}>
                        <Grid.Cell width={1 / 3}>
                            <Select
                                noMargin={true}
                                hideLabel={true}
                                name='biRegMonth'
                                disabled={disabled}
                                value={this.state.biMonth}
                                onChange={this.handleMonthSelect}
                                onKeyDown={this.handleKeyDown}
                                invalid={this.state.monthInvalid}>
                                <option value=''>Month</option>
                                {
                                    Date.getMonthArray().map((name, index) =>
                                        <option key={index} value={index + 1}>{name}</option>
                                    )
                                }
                            </Select>
                        </Grid.Cell>
                        <Grid.Cell width={1 / 3}>
                            <Select
                                noMargin={true}
                                hideLabel={true}
                                name='biRegDay'
                                disabled={disabled}
                                value={this.state.biDay}
                                onChange={this.handleDaySelect}
                                onKeyDown={this.handleKeyDown}
                                invalid={this.state.dayInvalid}>
                                <option value=''>Day</option>
                                {
                                    Date.getDayArray().map((day, index) =>
                                        <option key={index} value={day}>{day}</option>
                                    )
                                }
                            </Select>
                        </Grid.Cell>
                        <Grid.Cell width={1 / 3}>
                            <Select
                                noMargin={true}
                                hideLabel={true}
                                name='biRegYear'
                                disabled={disabled}
                                value={this.state.biYear}
                                onChange={this.handleYearSelect}
                                onKeyDown={this.handleKeyDown}
                                invalid={this.state.yearInvalid}>
                                <option value=''>Year</option>
                                {
                                    Date.getYearArray().map((year, index) =>
                                        <option key={index} value={year}>{year}</option>
                                    )
                                }
                            </Select>
                        </Grid.Cell>
                    </Grid>
                    {this.state.biFormError !== null &&
                    <Text
                        is='p'
                        marginTop={space[2]}
                        lineHeight={2}
                        color='error'
                        fontSize='h5'>
                        {this.state.biFormError}
                    </Text>
                    }
                </div>
            }
        </div>
    );
};


// Added by sephora-jsx-loader.js
BiRegisterForm.prototype.path = 'BiRegisterForm';
// Added by sephora-jsx-loader.js
Object.assign(BiRegisterForm.prototype, require('./BiRegisterForm.c.js'));
var originalDidMount = BiRegisterForm.prototype.componentDidMount;
BiRegisterForm.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BiRegisterForm');
if (originalDidMount) originalDidMount.apply(this);
if (BiRegisterForm.prototype.ctrlr) BiRegisterForm.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BiRegisterForm');
// Added by sephora-jsx-loader.js
BiRegisterForm.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BiRegisterForm.prototype.class = 'BiRegisterForm';
// Added by sephora-jsx-loader.js
BiRegisterForm.prototype.getInitialState = function() {
    BiRegisterForm.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BiRegisterForm.prototype.render = wrapComponentRender(BiRegisterForm.prototype.render);
// Added by sephora-jsx-loader.js
var BiRegisterFormClass = React.createClass(BiRegisterForm.prototype);
// Added by sephora-jsx-loader.js
BiRegisterFormClass.prototype.classRef = BiRegisterFormClass;
// Added by sephora-jsx-loader.js
Object.assign(BiRegisterFormClass, BiRegisterForm);
// Added by sephora-jsx-loader.js
module.exports = BiRegisterFormClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BiRegisterForm/BiRegisterForm.jsx