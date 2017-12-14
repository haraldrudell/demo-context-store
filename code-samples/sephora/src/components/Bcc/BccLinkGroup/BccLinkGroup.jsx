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
    Sephora.Util.InflatorComps.Comps['BccLinkGroup'] = function BccLinkGroup(){
        return BccLinkGroupClass;
    }
}
const { site, space } = require('style');
const { Box, Image, Text } = require('components/display');
const BccLinkWrapper = require('components/Bcc/BccLinkGroup/BccLinkWrapper');
const TestTarget = require('components/TestTarget/TestTarget');

const BccLinkGroup = function () { };

BccLinkGroup.prototype.render = function () {
    const {
        componentName,
        componentType,
        enableTesting,
        name,
        nested,
        title,
        headerImage,
        mwebHeaderImage,
        altText,
        links,
        ...props
    } = this.props;

    /** outdent to hit browser edge if not nested within another component */
    const outdent = Sephora.isMobile() && !nested;

    const hasImgTitle = headerImage || mwebHeaderImage;

    return (
        <div>
            {(title || hasImgTitle) &&
                <Text
                    is='h2'
                    fontSize='h1'
                    lineHeight={1}
                    serif={true}
                    marginX={outdent && mwebHeaderImage ? -site.PADDING_MW : null}
                    marginBottom={hasImgTitle ? -1 : space[3]}>
                    {hasImgTitle
                        ? <Image
                            src={Sephora.isMobile() ? mwebHeaderImage : headerImage}
                            alt={altText}
                            marginX='auto'
                            display='block' />
                        : title
                    }
                </Text>
            }
            <Box
                is='ul'
                borderTop={1}
                borderBottom={1}
                borderColor='lightGray'
                marginX={outdent ? -site.PADDING_MW : null}>
                {links && links.map((link, linkIndex) => {
                    let linkProps = Object.assign({}, link, {
                        withArrow: true,
                        linkIndex: linkIndex,
                        url: link.targetScreen.targetUrl,
                        target: link.targetScreen.targetWindow,
                        title: link.altText,
                        text: link.displayTitle,
                        anaNavPath: [title, link.displayTitle],
                        modalTemplate: link.modalComponentTemplate
                    });
                    if (link.enableTesting) {
                        return <TestTarget
                                testComponent='BccLinkWrapper'
                                testEnabled
                                testName={link.testName}
                                isBcc
                                {...linkProps} />;
                    } else {
                        return <BccLinkWrapper {...linkProps} />;
                    }
                }
                )}
            </Box>
        </div>
    );
};


// Added by sephora-jsx-loader.js
BccLinkGroup.prototype.path = 'Bcc/BccLinkGroup';
// Added by sephora-jsx-loader.js
BccLinkGroup.prototype.class = 'BccLinkGroup';
// Added by sephora-jsx-loader.js
BccLinkGroup.prototype.getInitialState = function() {
    BccLinkGroup.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BccLinkGroup.prototype.render = wrapComponentRender(BccLinkGroup.prototype.render);
// Added by sephora-jsx-loader.js
var BccLinkGroupClass = React.createClass(BccLinkGroup.prototype);
// Added by sephora-jsx-loader.js
BccLinkGroupClass.prototype.classRef = BccLinkGroupClass;
// Added by sephora-jsx-loader.js
Object.assign(BccLinkGroupClass, BccLinkGroup);
// Added by sephora-jsx-loader.js
module.exports = BccLinkGroupClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Bcc/BccLinkGroup/BccLinkGroup.jsx