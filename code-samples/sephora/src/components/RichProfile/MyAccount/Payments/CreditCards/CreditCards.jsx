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
    Sephora.Util.InflatorComps.Comps['CreditCards'] = function CreditCards(){
        return CreditCardsClass;
    }
}
// jscs:disable maximumLineLength
const { space } = require('style');
const Divider = require('components/Divider/Divider');
const Grid = require('components/Grid/Grid');
const Flex = require('components/Flex/Flex');
const Checkbox = require('components/Inputs/Checkbox/Checkbox');
const Text = require('components/Text/Text');
const IconCross = require('components/Icon/IconCross');
const Link = require('components/Link/Link');
const CreditCardForm = require('./CreditCardForm/CreditCardForm');
const DateUtil = require('utils/Date');
const Locale = require('utils/LanguageLocale');
const COUNTRIES = Locale.COUNTRIES;

const CreditCards = function () {
    this.state = {
        creditCards: null,
        isEditMode: false,
        isAddCard: false,
        editCardId: null
    };
};

CreditCards.prototype.render = function () {
    let creditCards = this.state.creditCards || this.props.creditCards;
    return (
        <div>
            {creditCards && creditCards.length ?
                creditCards.map(card =>
                <div>
                    {this.state.isEditMode && (card.creditCardId === this.state.editCardId) ?
                        <CreditCardForm
                            isEditMode={true}
                            creditCard={card}
                            allCreditCards={creditCards}
                            userProfileId={this.userProfileId}
                            countryList={this.billingCountries}
                            country={card.address.country}
                            cancelAddOrEditCardCallback={this.cancelAddOrEditCardCallback}
                            updateCardsCallback={this.updateCardsCallback}
                            isInternational={card.address.country !== COUNTRIES.US} />
                        :
                        <Grid>
                            <Grid.Cell width='fill'>
                                {card.isExpired &&
                                    <Text
                                        is='p'
                                        lineHeight={2}
                                        color='error'
                                        fontSize='h5'
                                        marginBottom={space[2]}>
                                        This card is expired. Please update your card information.
                                    </Text>
                                }
                                <Text
                                    is='p'
                                    marginBottom={space[2]}
                                    lineHeight={2}>
                                    {card.cardType} ending in
                                    {' '}
                                    {this.shortenCardNumber(card.cardNumber)}
                                    <br />
                                    {card.cardType !== 'JCPenney' &&
                                        `Expires ${DateUtil.getShortenedMonth(card.expirationMonth)}
                                        ${card.expirationYear}`
                                    }
                                </Text>
                                {card.isDefault ?
                                    <Text
                                        is='p'
                                        color='silver'>
                                        Default credit card
                                    </Text>
                                    :
                                    <Checkbox
                                        onChange={
                                            e => this.chooseDefaultCreditCard(card.creditCardId)
                                        }>
                                        Make default credit card
                                    </Checkbox>
                                }
                            </Grid.Cell>
                            <Grid.Cell
                                width='4em'
                                textAlign='right'>
                                <Link
                                    primary={true}
                                    lineHeight={2}
                                    paddingY={space[2]}
                                    marginY={-space[2]}
                                    onClick={() => {
                                        this.setState({
                                            isEditMode: true,
                                            isAddCard: false,
                                            editCardId: card.creditCardId
                                        });
                                    }}>
                                    Edit
                                </Link>
                            </Grid.Cell>
                        </Grid>
                    }
                    <Divider marginY={Sephora.isMobile() ? space[4] : space[5]} />
                </div>
            ) : null}
            {!this.state.isAddCard ?
                <Link
                    padding={space[2]}
                    margin={-space[2]}
                    onClick={this.showAddCardForm}>
                    <Flex alignItems='center'>
                        <IconCross fontSize='h3' />
                        <Text marginLeft={space[2]}>
                            Add credit card
                        </Text>
                    </Flex>
                </Link>
                :
                <CreditCardForm
                    cancelAddOrEditCardCallback={this.cancelAddOrEditCardCallback}
                    updateCardsCallback={this.updateCardsCallback}
                    userProfileId={this.userProfileId}
                    countryList={this.billingCountries}
                    country={Locale.getCurrentCountry().toUpperCase()}
                    isInternational={Locale.getCurrentCountry().toUpperCase() !== COUNTRIES.US}/>
            }
        </div>
    );
};


// Added by sephora-jsx-loader.js
CreditCards.prototype.path = 'RichProfile/MyAccount/Payments/CreditCards';
// Added by sephora-jsx-loader.js
Object.assign(CreditCards.prototype, require('./CreditCards.c.js'));
var originalDidMount = CreditCards.prototype.componentDidMount;
CreditCards.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: CreditCards');
if (originalDidMount) originalDidMount.apply(this);
if (CreditCards.prototype.ctrlr) CreditCards.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: CreditCards');
// Added by sephora-jsx-loader.js
CreditCards.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
CreditCards.prototype.class = 'CreditCards';
// Added by sephora-jsx-loader.js
CreditCards.prototype.getInitialState = function() {
    CreditCards.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
CreditCards.prototype.render = wrapComponentRender(CreditCards.prototype.render);
// Added by sephora-jsx-loader.js
var CreditCardsClass = React.createClass(CreditCards.prototype);
// Added by sephora-jsx-loader.js
CreditCardsClass.prototype.classRef = CreditCardsClass;
// Added by sephora-jsx-loader.js
Object.assign(CreditCardsClass, CreditCards);
// Added by sephora-jsx-loader.js
module.exports = CreditCardsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/Payments/CreditCards/CreditCards.jsx