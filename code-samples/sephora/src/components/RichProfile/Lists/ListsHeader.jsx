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
    Sephora.Util.InflatorComps.Comps['ListsHeader'] = function ListsHeader(){
        return ListsHeaderClass;
    }
}
const { Box, Text } = require('components/display');
const { space } = require('style');
const Link = require('components/Link/Link');

const ListsHeader = function () {};

ListsHeader.prototype.render = function () {
    const isMobile = Sephora.isMobile();
    const {
        link,
        children,
        ...props
    } = this.props;

    return (
        <Box
            {...props}
            position='relative'>
            <Text
                is='h2'
                fontSize={isMobile ? 'h1' : 'h0'}
                lineHeight={1}
                serif={true}
                children={children} />
            {link &&
                <Link
                    href={link}
                    position='absolute'
                    right={0} bottom={0}
                    paddingY={space[2]}
                    marginY={-space[2]}
                    arrowDirection='right'>
                    View all
                </Link>
            }
        </Box>
    );
};


// Added by sephora-jsx-loader.js
ListsHeader.prototype.path = 'RichProfile/Lists';
// Added by sephora-jsx-loader.js
ListsHeader.prototype.class = 'ListsHeader';
// Added by sephora-jsx-loader.js
ListsHeader.prototype.getInitialState = function() {
    ListsHeader.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ListsHeader.prototype.render = wrapComponentRender(ListsHeader.prototype.render);
// Added by sephora-jsx-loader.js
var ListsHeaderClass = React.createClass(ListsHeader.prototype);
// Added by sephora-jsx-loader.js
ListsHeaderClass.prototype.classRef = ListsHeaderClass;
// Added by sephora-jsx-loader.js
Object.assign(ListsHeaderClass, ListsHeader);
// Added by sephora-jsx-loader.js
module.exports = ListsHeaderClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/Lists/ListsHeader.jsx