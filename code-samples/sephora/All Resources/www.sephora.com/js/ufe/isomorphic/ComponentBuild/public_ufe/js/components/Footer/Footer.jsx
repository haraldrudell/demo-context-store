// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

const { colors, space } = require('style');
const { Box, Grid } = require('components/display');
const Container = require('components/Container/Container');
const SocialIcons = require('./SocialIcons/SocialIcons');
const FooterLinks = require('./FooterLinks/FooterLinks');
const Divider = require('components/Divider/Divider');
const EmailSignUp = require('components/EmailSignUp/EmailSignUp');
const Markdown = require('components/Markdown/Markdown');

const Footer = function () {
    this.state = {
        marginBottom: 0
    };
};

Footer.prototype.postLoad = true;

Footer.prototype.render = function () {
    const {
        legal = [{
            text: ''
        }],
        footerLinkGroups = []
    } = this.props;

    return (
        <Box
            backgroundColor='black'
            color='white'
            marginBottom={this.state.marginBottom}
            paddingY={Sephora.isMobile() ? space[5] : space[7]}>
            <Container>
                <FooterLinks linkGroups={footerLinkGroups} />
                <Divider marginY={space[5]} color='midGray' />
                <Grid>
                    <Grid.Cell width={Sephora.isDesktop() ? 'fit' : 1}>
                        <EmailSignUp />
                    </Grid.Cell>
                    <Grid.Cell
                        width={Sephora.isDesktop() ? 'fill' : 1}
                        marginTop={Sephora.isMobile() ? space[5] : null}
                        textAlign={Sephora.isMobile() ? 'center' : 'right'}>
                        <SocialIcons />
                    </Grid.Cell>
                </Grid>

                <Markdown
                    marginTop={Sephora.isMobile() ? space[5] : space[7]}
                    color='silver'
                    fontSize='h6'
                    textAlign='center'
                    _css={{
                        '& a:not([href^=tel])': {
                            textDecoration: 'underline',
                            ':hover': {
                                color: colors.white
                            }
                        }
                    }}
                    content={legal[0].text}
                    targetWindow={legal[0].targetWindow}
                    modalComponentTemplate={legal[0].modalComponentTemplate}
                    componentName={legal[0].componentName}
                />
            </Container>
        </Box>
    );
};


// Added by sephora-jsx-loader.js
Footer.prototype.path = 'Footer';
// Added by sephora-jsx-loader.js
Object.assign(Footer.prototype, require('./Footer.c.js'));
var originalDidMount = Footer.prototype.componentDidMount;
Footer.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Footer');
if (originalDidMount) originalDidMount.apply(this);
if (Footer.prototype.ctrlr) Footer.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Footer');
// Added by sephora-jsx-loader.js
Footer.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Footer.prototype.class = 'Footer';
// Added by sephora-jsx-loader.js
Footer.prototype.getInitialState = function() {
    Footer.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Footer.prototype.render = wrapComponentRender(Footer.prototype.render);
// Added by sephora-jsx-loader.js
var FooterClass = React.createClass(Footer.prototype);
// Added by sephora-jsx-loader.js
FooterClass.prototype.classRef = FooterClass;
// Added by sephora-jsx-loader.js
Object.assign(FooterClass, Footer);
// Added by sephora-jsx-loader.js
module.exports = FooterClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Footer/Footer.jsx