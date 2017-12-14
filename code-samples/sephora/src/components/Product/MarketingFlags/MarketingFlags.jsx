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
    Sephora.Util.InflatorComps.Comps['MarketingFlags'] = function MarketingFlags(){
        return MarketingFlagsClass;
    }
}
const space = require('style').space;
const { Box, Text } = require('components/display');

const MarketingFlags = function () {};

MarketingFlags.prototype.render = function () {
    let {
        sku,
        ...props
    } = this.props;

    let flags = [];
    if (sku.isSephoraExclusive) {
        flags.push('exclusive');
    }

    if (sku.isLimitedEdition) {
        flags.push('limited edition');
    }

    if (sku.isOnlineOnly) {
        flags.push('online only');
    }

    return (flags.length > 0 ?
        <Box
            {...props}
            fontSize='h5'
            lineHeight={2}
            fontWeight={700}>
            {flags.map((flag, index) =>
                (
                    <Text key={index}>
                        {index > 0 &&
                            <Text marginX={space[1]}>&middot;</Text>
                        }
                        {flag}
                    </Text>
                )
            )}
        </Box>
    : null);
};


// Added by sephora-jsx-loader.js
MarketingFlags.prototype.path = 'Product/MarketingFlags';
// Added by sephora-jsx-loader.js
MarketingFlags.prototype.class = 'MarketingFlags';
// Added by sephora-jsx-loader.js
MarketingFlags.prototype.getInitialState = function() {
    MarketingFlags.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
MarketingFlags.prototype.render = wrapComponentRender(MarketingFlags.prototype.render);
// Added by sephora-jsx-loader.js
var MarketingFlagsClass = React.createClass(MarketingFlags.prototype);
// Added by sephora-jsx-loader.js
MarketingFlagsClass.prototype.classRef = MarketingFlagsClass;
// Added by sephora-jsx-loader.js
Object.assign(MarketingFlagsClass, MarketingFlags);
// Added by sephora-jsx-loader.js
module.exports = MarketingFlagsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Product/MarketingFlags/MarketingFlags.jsx