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
    Sephora.Util.InflatorComps.Comps['SectionContainer'] = function SectionContainer(){
        return SectionContainerClass;
    }
}
const { measure, space } = require('style');
const { Box, Image, Text } = require('components/display');
const Link = require('components/Link/Link');
const Divider = require('components/Divider/Divider');
const Container = require('components/Container/Container');

const SectionContainer = function () {};

SectionContainer.prototype.render = function () {
    const {
        title,
        link,
        intro,
        isPrivate,
        hasDivider,
        children,
        ...props
    } = this.props;

    const pad = Sephora.isMobile() ? space[5] : space[6];

    return (
        <Box marginY={pad}>
            {hasDivider &&
                <Box
                    marginBottom={pad}
                    minHeight={Sephora.isMobile() ? space[2] : space[4]}
                    backgroundColor='nearWhite'>
                    {isPrivate &&
                        <Box
                            textAlign='center'
                            fontSize={Sephora.isMobile() ? 'h5' : 'h4'}
                            paddingY={space[4]}
                            lineHeight={1}
                            color='silver'>
                            <Image
                                src='/img/ufe/rich-profile/icon-lock-grey.svg'
                                height='1.25em'
                                alt='Lock Icon'
                                verticalAlign='text-bottom' />
                            <Text marginLeft='1em'>
                                Private content
                            </Text>
                        </Box>
                    }
                </Box>
            }
            <Container>
                {title &&
                    <Box
                        marginBottom={Sephora.isMobile() ? space[4] : space[5]}
                        textAlign={Sephora.isDesktop() ? 'center' : null}>
                        <Box
                            position='relative'>
                            <Text
                                is='h2'
                                fontSize={Sephora.isMobile() ? 'h1' : 'h0'}
                                serif={true}
                                lineHeight={1}>
                                {title}
                            </Text>
                            {link &&
                                <Link
                                    arrowDirection='right'
                                    href={link}
                                    position='absolute'
                                    bottom={0}
                                    right={0}
                                    lineHeight={2}
                                    padding={space[3]}
                                    margin={-space[3]}>
                                    {intro ? 'Explore' : 'View'} all
                                </Link>
                            }
                        </Box>
                        {intro &&
                            <Text
                                is='p'
                                fontSize={Sephora.isMobile() ? 'h4' : 'h3'}
                                lineHeight={2}
                                marginTop={space[4]}
                                marginX={Sephora.isDesktop() ? 'auto' : null}
                                maxWidth={measure.BASE}>
                                {intro}
                            </Text>
                        }
                        {Sephora.isMobile() &&
                            <Divider marginTop={space[4]} />
                        }
                    </Box>
                }
                {this.props.children}
            </Container>
        </Box>
    );
};


// Added by sephora-jsx-loader.js
SectionContainer.prototype.path = 'RichProfile/UserProfile/common/SectionContainer';
// Added by sephora-jsx-loader.js
SectionContainer.prototype.class = 'SectionContainer';
// Added by sephora-jsx-loader.js
SectionContainer.prototype.getInitialState = function() {
    SectionContainer.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
SectionContainer.prototype.render = wrapComponentRender(SectionContainer.prototype.render);
// Added by sephora-jsx-loader.js
var SectionContainerClass = React.createClass(SectionContainer.prototype);
// Added by sephora-jsx-loader.js
SectionContainerClass.prototype.classRef = SectionContainerClass;
// Added by sephora-jsx-loader.js
Object.assign(SectionContainerClass, SectionContainer);
// Added by sephora-jsx-loader.js
module.exports = SectionContainerClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/UserProfile/common/SectionContainer/SectionContainer.jsx