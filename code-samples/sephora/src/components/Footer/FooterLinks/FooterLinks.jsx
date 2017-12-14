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
    Sephora.Util.InflatorComps.Comps['FooterLinks'] = function FooterLinks(){
        return FooterLinksClass;
    }
}
const Collapse = require('react-smooth-collapse');
const { space } = require('style');
const { Box, Flex, Grid, Text } = require('components/display');
const BccLink = require('components/Bcc/BccLink/BccLink');
const Chevron = require('components/Chevron/Chevron');
const trackNavClick = require('analytics/bindingMethods/pages/all/navClickBindings').trackNavClick;

const FooterLinks = function () {
    this.state = {
        opened: null,
        isAnonymous: null
    };
};

FooterLinks.prototype.isBILink = function (link) {
    if (link.displayTitle === 'Beauty Insider') {
        return true;
    } else {
        return false;
    }
};

FooterLinks.prototype.getBITargetUrl = function () {
    const ANON_URL = '/about-beauty-insider';
    const RECOGNIZED_URL = '/profile/BeautyInsider';

    if (this.state.isAnonymous) {
        return ANON_URL;
    } else {
        return RECOGNIZED_URL;
    }
};

FooterLinks.prototype.render = function () {

    return (
        <Grid
            gutter={Sephora.isDesktop() ? space[5] : null}>
            {
                this.props.linkGroups && this.props.linkGroups.map((linkGroup, index) =>
                    <Grid.Cell
                        key={index}
                        width={Sephora.isMobile() ? 1 : 1 / 4}>
                        {Sephora.isMobile()
                            ?
                            <Flex
                                justifyContent='space-between'
                                alignItems='baseline'
                                paddingY={space[2]}
                                is='h4'
                                onClick={() => this.setState({
                                    opened: index === this.state.opened ? null : index
                                })}>
                                <Text fontWeight={700}>
                                    {linkGroup.title}
                                </Text>
                                <Chevron
                                    direction={this.state.opened === index ? 'up' : 'down'} />
                            </Flex>
                            :
                            <Text
                                is='h4'
                                fontWeight={700}
                                marginBottom={space[2]}>
                                {linkGroup.title}
                            </Text>
                        }
                        <Collapse
                            heightTransition='400ms ease'
                            expanded={Sephora.isDesktop() || this.state.opened === index}>
                            <Box
                                paddingBottom={space[3]}>
                                {linkGroup.links.map((link, linkIndex) =>
                                    <BccLink
                                        key={linkIndex}
                                        paddingY={Sephora.isMobile() ? space[2] : space[1]}
                                        paddingLeft={Sephora.isMobile() ? space[3] : null}
                                        fontSize={Sephora.isDesktop() ? 'h5' : null}
                                        hoverColor='moonGray'
                                        url={
                                            this.isBILink(link) ? this.getBITargetUrl() :
                                            link.targetScreen.targetUrl
                                            }
                                        target={link.targetScreen.targetWindow}
                                        title={link.altText}
                                        text={link.displayTitle}
                                        modalTemplate={link.modalComponentTemplate}
                                        enableTesting={link.enableTesting}
                                        trackNavClick={trackNavClick}
                                        anaNavPath={
                                            ['footer nav', linkGroup.title, link.displayTitle]
                                        }
                                        />)
                                }
                            </Box>
                        </Collapse>
                    </Grid.Cell>
                )
            }
        </Grid>
    );
};


// Added by sephora-jsx-loader.js
FooterLinks.prototype.path = 'Footer/FooterLinks';
// Added by sephora-jsx-loader.js
Object.assign(FooterLinks.prototype, require('./FooterLinks.c.js'));
var originalDidMount = FooterLinks.prototype.componentDidMount;
FooterLinks.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: FooterLinks');
if (originalDidMount) originalDidMount.apply(this);
if (FooterLinks.prototype.ctrlr) FooterLinks.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: FooterLinks');
// Added by sephora-jsx-loader.js
FooterLinks.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
FooterLinks.prototype.class = 'FooterLinks';
// Added by sephora-jsx-loader.js
FooterLinks.prototype.getInitialState = function() {
    FooterLinks.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
FooterLinks.prototype.render = wrapComponentRender(FooterLinks.prototype.render);
// Added by sephora-jsx-loader.js
var FooterLinksClass = React.createClass(FooterLinks.prototype);
// Added by sephora-jsx-loader.js
FooterLinksClass.prototype.classRef = FooterLinksClass;
// Added by sephora-jsx-loader.js
Object.assign(FooterLinksClass, FooterLinks);
// Added by sephora-jsx-loader.js
module.exports = FooterLinksClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Footer/FooterLinks/FooterLinks.jsx