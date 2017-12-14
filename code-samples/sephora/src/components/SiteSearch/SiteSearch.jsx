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
    Sephora.Util.InflatorComps.Comps['SiteSearch'] = function SiteSearch(){
        return SiteSearchClass;
    }
}
const css = require('glamor').css;
const {
    colors, forms, dropdown, site, overlay, space, shade, zIndex
} = require('style');
const { Box } = require('components/display');
const Location = require('utils/Location');
const IconSearch = require('components/Icon/IconSearch');
const IconCross = require('components/Icon/IconCross');
const TextInput = require('components/Inputs/TextInput/TextInput');
const Link = require('components/Link/Link');
const ReactDOM = require('react-dom');
const UI = require('utils/UI');

var SiteSearch = function () {
    this.state = {
        focus: false,
        isFixed: false,
        isTooltipVisible: false,
        inline: Location.isHomePage()
    };
    this.textInput = null;
};

SiteSearch.prototype.render = function () {
    const MW = Sephora.isMobile();

    /**
     * This action will never happen on component load
     * So it's the only wrapper fix for serverside rendering
     * where document object is not accessible.
     *
     * After the browser page load, all code inside this condition
     * is fully accessible for any async actions
     */
    let offset = 0;
    if (!Sephora.isRootRender && MW) {
        UI.preventBackgroundScroll(this.state.focus);
        if (this.state.focus) {
            let el = ReactDOM.findDOMNode(this);
            if (window.scrollY > el.offsetTop) {
                offset = window.scrollY - el.offsetTop + site.HEADER_HEIGHT_MW;
            }
        }
    }

    const fixedStyle = this.state.isFixed ? {
        position: 'fixed',
        left: 0,
        right: 0
    } : {};

    let open = (this.state.inline && !this.state.isFixed) ||
        (this.state.isFixed && this.state.focus);

    /**
     * Visibility of tooltip is defined by:
     * 1. scroll position (during scroll it's visible only on top of the page)
     * 2. only for mobileWeb
     * 4. if searchbar is in focus state, then tooltip is always presented
     */
    // TODO 2017.7 Tooltip is temporarily fully hidden to support the ppage improvements.
    // Bring it back into PriorityLoaded file with debounced scroll event
    let isTooltipVisible = false;

    const searchPadding = space[2];
    const searchHeight = forms.HEIGHT + searchPadding * 2;

    const styles = {
        form: css({
            position: 'relative',
            width: MW ? '100%' : site.SIDEBAR_WIDTH,
            paddingTop: MW ? searchPadding : null,
            paddingBottom: MW ? searchPadding : null,
            paddingLeft: MW ? site.PADDING_MW : null,
            paddingRight: MW ? site.PADDING_MW : null,
            backgroundColor: MW ? colors.nearWhite : null,
            display: !MW || open ? 'flex' : 'none',
            alignItems: 'center',
            zIndex: MW ? zIndex.HEADER - 1 : null
        }),
        arrow: css({
            position: 'absolute',
            backfaceVisibility: 'hidden',
            top: this.state.isFixed ? offset - 5 : -5,
            left: 60,
            width: 9,
            height: 9,
            backgroundColor: colors.nearWhite,
            backgroundImage: 'linear-gradient(to left top, transparent, ' + shade[1] + ')',
            transform: 'rotate(45deg)',
            boxShadow: 'inset 1px 1px 3px ' + shade[1],
            zIndex: zIndex.HEADER
        }),
        wrapper: css({
            position: 'relative',
            flexBasis: '100%'
        }),
        results: {
            position: 'absolute',
            zIndex: zIndex.HEADER,
            backgroundColor: colors.white,
            boxShadow: MW ? null : dropdown.SHADOW,
            top: '100%',
            left: 0,
            minWidth: '100%',
            whiteSpace: MW ? null : 'nowrap'
        },
        result: {
            width: 'auto',
            minWidth: '100%',
            paddingLeft: MW ? site.PADDING_MW : forms.PADDING_X,
            paddingRight: MW ? site.PADDING_MW : forms.PADDING_X,
            ':hover': {
                backgroundColor: shade[1]
            }
        },
        navbarBackdropStyle: css({
            position: 'fixed',
            zIndex: zIndex.HEADER - 1,
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            backgroundColor: overlay.COLOR,
            opacity: overlay.OPACITY
        })
    };

    // return empty div tags for mw legacy non third party pages
    if (Sephora.isLegacyMode && MW) {
        return (<div></div>);
    }

    return (
        <Box
            position='relative'
            height={this.state.inline && MW ? searchHeight : null}>
            {MW && this.state.focus &&
                <div className={styles.navbarBackdropStyle}
                    onTouchMove={e => e.preventDefault()}
                    onClick={e => this.handleBackdropClick(e)}>
                </div>
            }
            <div className={css(styles.form, fixedStyle)}>
                <div className={styles.wrapper}>
                    <form
                        onSubmit={Sephora.isThirdPartySite ? '' : e => this.handleSubmit(e)}
                        action={Sephora.isThirdPartySite ?
                            'https://www.sephora.com/shop/search' : '/shop/search'}>
                        <TextInput
                            noMargin={true}
                            hideLabel={true}
                            autoOff={true}
                            name='keyword'
                            label='Search'
                            type='search'
                            maxLength='70'
                            placeholder='Search'
                            ref={(input) => this.textInput = input}
                            _css={{
                                paddingLeft: MW ? null : 30,
                                paddingRight: 24
                            }}
                            value={this.textInput && this.textInput.getValue()}
                            onFocus={Sephora.isThirdPartySite ? '' : e => this.handleFocus(e)}
                            onBlur={Sephora.isThirdPartySite ? '' : e => this.handleBlur(e)}
                            onKeyUp={Sephora.isThirdPartySite ? '' : e => this.handleKeyUp(e)}/>
                    </form>

                    {Sephora.isDesktop() &&
                        <IconSearch
                            color='gray'
                            position='absolute'
                            top='50%' left={9}
                            fontSize={16}
                            transform='translate(0, -50%)'
                            _css={{
                                pointerEvents: 'none'
                            }} />
                    }
                    {
                        this.textInput && this.textInput.getValue() && !Sephora.isThirdPartySite ?
                            <Link
                                muted={true}
                                paddingX={space[2]}
                                lineHeight={0}
                                fontSize='16'
                                position='absolute'
                                top={1} right={1} bottom={1}
                                onClick={(e) => this.handleClearClick(e)}>
                                <IconCross x={true} />
                            </Link>
                        : null
                    }
                </div>
                {
                    MW && this.state.focus &&
                    <Link
                        paddingLeft={space[3]}
                        paddingY={space[2]}
                        onClick={(e) => this.handleCancelClick(e)}>
                        Cancel
                    </Link>
                }
                {
                    !Sephora.isThirdPartySite &&
                    this.state.focus &&
                    this.state.results &&
                    this.state.results.length ?
                        <Box
                            paddingY={space[2]}
                            _css={styles.results}>
                            {
                                (!this.textInput || !this.textInput.getValue()) &&
                                <Box
                                    paddingY={space[2]}
                                    color='gray'
                                    _css={styles.result}>
                                    Previous Searches
                                </Box>
                            }
                            {this.state.results.map((result, index) =>
                                <Box
                                    key={index}
                                    paddingY={space[2]}
                                    _css={styles.result}
                                    onClick={e => this.handleItemClick(e, result)}
                                    dangerouslySetInnerHTML={{
                                        __html: this.highlight(
                                        result.value, this.textInput.getValue())
                                    }}>
                                </Box>
                            )}
                        </Box> : null
                }
            </div>
            { isTooltipVisible && <span className={styles.arrow} /> }
        </Box>
    );
};


// Added by sephora-jsx-loader.js
SiteSearch.prototype.path = 'SiteSearch';
// Added by sephora-jsx-loader.js
Object.assign(SiteSearch.prototype, require('./SiteSearch.c.js'));
var originalDidMount = SiteSearch.prototype.componentDidMount;
SiteSearch.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: SiteSearch');
if (originalDidMount) originalDidMount.apply(this);
if (SiteSearch.prototype.ctrlr) SiteSearch.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: SiteSearch');
// Added by sephora-jsx-loader.js
SiteSearch.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
SiteSearch.prototype.class = 'SiteSearch';
// Added by sephora-jsx-loader.js
SiteSearch.prototype.getInitialState = function() {
    SiteSearch.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
SiteSearch.prototype.render = wrapComponentRender(SiteSearch.prototype.render);
// Added by sephora-jsx-loader.js
var SiteSearchClass = React.createClass(SiteSearch.prototype);
// Added by sephora-jsx-loader.js
SiteSearchClass.prototype.classRef = SiteSearchClass;
// Added by sephora-jsx-loader.js
Object.assign(SiteSearchClass, SiteSearch);
// Added by sephora-jsx-loader.js
module.exports = SiteSearchClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/SiteSearch/SiteSearch.jsx