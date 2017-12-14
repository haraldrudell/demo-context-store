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
    Sephora.Util.InflatorComps.Comps['CountrySwitcher'] = function CountrySwitcher(){
        return CountrySwitcherClass;
    }
}
const { site, space } = require('style');
const { Box, Flex, Image, Text } = require('components/display');

const Dropdown = require('components/Dropdown/Dropdown');
const Arrow = require('components/Arrow/Arrow');
const Locale = require('utils/LanguageLocale.js');

var CountrySwitcher = function () {
    this.canImg = '/contentimages/country-flags/icon-flag-ca.png';
    this.usImg = '/contentimages/country-flags/icon-flag-us.png';
    this.state = {
        showModal: false,
        flagSrc: '/img/ufe/placeholder.gif',
        countryText: ''
    };
};

CountrySwitcher.prototype.render = function () {

    const flagStyle = {
        height: '1em',
        width: '1.5em',
        marginRight: '.5em'
    };

    const currentCountry = (
        <Flex
            alignItems='center'
            paddingX={space[3]}
            height={site.TOP_BAR_HEIGHT}
            cursor='default'>
            <Image
                src={this.state.flagSrc}
                _css={flagStyle}
                data-at={Sephora.debug.dataAt('current_country_flag')}
                disableLazyLoad={true} />
            <Box
                width='2.16em'
                data-at={Sephora.debug.dataAt('current_country')}>
                {this.state.countryText}
            </Box>
            {!Sephora.isThirdPartySite ? <Arrow marginLeft='.5em' /> : ''}
        </Flex>
    );

    return (
      <div>
        {Sephora.isThirdPartySite ?
            currentCountry
        :
            <Dropdown isHover={true}>
                <Dropdown.Trigger>
                    {currentCountry}
                </Dropdown.Trigger>
                <Dropdown.Menu right={true}
                    paddingBottom={space[1]}
                    color='white' backgroundColor='black'>
                    { this.state.currCtry === Locale.COUNTRIES.CA &&
                        <Flex
                            cursor='pointer'
                            alignItems='center'
                            paddingX={space[3]}
                            paddingY={space[2]}
                            hoverColor='moonGray'
                            onClick={
                                ()=> {
                                    this.open(Locale.COUNTRIES.US);
                                }
                            }>

                            <Image
                                src={this.usImg}
                                _css={flagStyle}
                                disableLazyLoad={true} />
                            US
                        </Flex>
                    }
                    { (this.state.currCtry === Locale.COUNTRIES.US ||
                      this.state.currLang === Locale.LANGUAGES.FR) &&
                        <Flex
                            cursor='pointer'
                            alignItems='center'
                            paddingX={space[3]}
                            paddingY={space[2]}
                            hoverColor='moonGray'
                            onClick={
                                ()=> {
                                    this.state.currCtry === Locale.COUNTRIES.CA
                                    ?
                                        this.switchCountry(Locale.COUNTRIES.CA)
                                    :
                                        this.open(Locale.COUNTRIES.CA);
                                }
                            }>

                            <Image
                                src={this.canImg}
                                _css={flagStyle}
                                data-at={Sephora.debug.dataAt('country_flag_us')}
                                disableLazyLoad={true} />
                            <Text data-at={Sephora.debug.dataAt('country_us')}>
                                ENG
                            </Text>
                        </Flex>
                    }
                    { this.state.currLang === Locale.LANGUAGES.EN &&
                        <Flex
                            cursor='pointer'
                            alignItems='center'
                            paddingX={space[3]}
                            paddingY={space[2]}
                            hoverColor='moonGray'
                            onClick={
                                ()=> {
                                    this.state.currCtry === Locale.COUNTRIES.CA
                                    ?
                                        this.switchCountry(
                                            Locale.COUNTRIES.CA,
                                            Locale.LANGUAGES.FR)
                                    :
                                        this.open(Locale.COUNTRIES.CA, Locale.LANGUAGES.FR);
                                }
                            }>

                            <Image
                                src={this.canImg}
                                _css={flagStyle}
                                data-at={Sephora.debug.dataAt('country_flag_fr')}
                                disableLazyLoad={true} />
                            <Text data-at={Sephora.debug.dataAt('country_fr')}>
                                FR
                            </Text>
                        </Flex>
                    }
                </Dropdown.Menu>
            </Dropdown>
        }
      </div>
    );
};


// Added by sephora-jsx-loader.js
CountrySwitcher.prototype.path = 'CountrySwitcher';
// Added by sephora-jsx-loader.js
Object.assign(CountrySwitcher.prototype, require('./CountrySwitcher.c.js'));
var originalDidMount = CountrySwitcher.prototype.componentDidMount;
CountrySwitcher.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: CountrySwitcher');
if (originalDidMount) originalDidMount.apply(this);
if (CountrySwitcher.prototype.ctrlr) CountrySwitcher.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: CountrySwitcher');
// Added by sephora-jsx-loader.js
CountrySwitcher.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
CountrySwitcher.prototype.class = 'CountrySwitcher';
// Added by sephora-jsx-loader.js
CountrySwitcher.prototype.getInitialState = function() {
    CountrySwitcher.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
CountrySwitcher.prototype.render = wrapComponentRender(CountrySwitcher.prototype.render);
// Added by sephora-jsx-loader.js
var CountrySwitcherClass = React.createClass(CountrySwitcher.prototype);
// Added by sephora-jsx-loader.js
CountrySwitcherClass.prototype.classRef = CountrySwitcherClass;
// Added by sephora-jsx-loader.js
Object.assign(CountrySwitcherClass, CountrySwitcher);
// Added by sephora-jsx-loader.js
module.exports = CountrySwitcherClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/CountrySwitcher/CountrySwitcher.jsx