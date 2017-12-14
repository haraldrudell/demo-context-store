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
    Sephora.Util.InflatorComps.Comps['LeftNav'] = function LeftNav(){
        return LeftNavClass;
    }
}
const { site, space } = require('style');
const { Box, Flex } = require('components/display');
const IconSearch = require('components/Icon/IconSearch');
const Location = require('utils/Location');

/* Container component for MW Hamburger and Search buttons */
const LeftNav = function () { };

LeftNav.prototype.render = function () {
    return (
        <Flex
            marginX={-space[3]}
            alignItems='center'>
            <Box
                is='button'
                paddingX={space[3]}
                width={site.HEADER_HEIGHT_MW}
                height={site.HEADER_HEIGHT_MW}
                onClick={this.handleMenuClick}>
                <Box marginY={space[1]} borderTop={2} />
                <Box marginY={space[1]} borderTop={2} />
                <Box marginY={space[1]} borderTop={2} />
            </Box>
            {!Location.isBasketPage() ?
                <Flex
                    isInline={true}
                    alignItems='center'
                    paddingX={space[2]}
                    height={site.HEADER_HEIGHT_MW}
                    onClick={(e) => this.handleSearchClick(e)}>
                    <IconSearch fontSize='h2' />
                </Flex> : null
            }
        </Flex>
    );
};


// Added by sephora-jsx-loader.js
LeftNav.prototype.path = 'Header/Nav/LeftNav';
// Added by sephora-jsx-loader.js
Object.assign(LeftNav.prototype, require('./LeftNav.c.js'));
var originalDidMount = LeftNav.prototype.componentDidMount;
LeftNav.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: LeftNav');
if (originalDidMount) originalDidMount.apply(this);
if (LeftNav.prototype.ctrlr) LeftNav.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: LeftNav');
// Added by sephora-jsx-loader.js
LeftNav.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
LeftNav.prototype.class = 'LeftNav';
// Added by sephora-jsx-loader.js
LeftNav.prototype.getInitialState = function() {
    LeftNav.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
LeftNav.prototype.render = wrapComponentRender(LeftNav.prototype.render);
// Added by sephora-jsx-loader.js
var LeftNavClass = React.createClass(LeftNav.prototype);
// Added by sephora-jsx-loader.js
LeftNavClass.prototype.classRef = LeftNavClass;
// Added by sephora-jsx-loader.js
Object.assign(LeftNavClass, LeftNav);
// Added by sephora-jsx-loader.js
module.exports = LeftNavClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/LeftNav/LeftNav.jsx