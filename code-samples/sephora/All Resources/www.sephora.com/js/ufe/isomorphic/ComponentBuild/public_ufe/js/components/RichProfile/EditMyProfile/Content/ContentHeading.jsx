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
    Sephora.Util.InflatorComps.Comps['ContentHeading'] = function ContentHeading(){
        return ContentHeadingClass;
    }
}
const { space } = require('style');
const { Box, Image, Text } = require('components/display');

const ContentHeading = function () {};

ContentHeading.prototype.render = function () {
    return (
        <div>
            <Text
                is='h3'
                lineHeight={1}>
                <Text
                    fontWeight={700}>
                    {this.props.children}
                </Text>
                {this.props.parens &&
                    <Text
                        marginLeft={space[2]}
                        color='gray'>
                        ({this.props.parens})
                    </Text>
                }
            </Text>
            {this.props.isPrivate &&
                <Box
                    fontSize='h5'
                    marginTop={space[3]}
                    color='silver'>
                    <Image
                        src='/img/ufe/rich-profile/icon-lock-grey.svg'
                        width={11} height={17}
                        alt='Lock Icon'
                        verticalAlign='text-bottom' />
                    <Text marginLeft={space[2]}>
                        This info is not shown on your public profile
                    </Text>
                </Box>
            }
        </div>
    );
};


// Added by sephora-jsx-loader.js
ContentHeading.prototype.path = 'RichProfile/EditMyProfile/Content';
// Added by sephora-jsx-loader.js
ContentHeading.prototype.class = 'ContentHeading';
// Added by sephora-jsx-loader.js
ContentHeading.prototype.getInitialState = function() {
    ContentHeading.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ContentHeading.prototype.render = wrapComponentRender(ContentHeading.prototype.render);
// Added by sephora-jsx-loader.js
var ContentHeadingClass = React.createClass(ContentHeading.prototype);
// Added by sephora-jsx-loader.js
ContentHeadingClass.prototype.classRef = ContentHeadingClass;
// Added by sephora-jsx-loader.js
Object.assign(ContentHeadingClass, ContentHeading);
// Added by sephora-jsx-loader.js
module.exports = ContentHeadingClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/EditMyProfile/Content/ContentHeading.jsx