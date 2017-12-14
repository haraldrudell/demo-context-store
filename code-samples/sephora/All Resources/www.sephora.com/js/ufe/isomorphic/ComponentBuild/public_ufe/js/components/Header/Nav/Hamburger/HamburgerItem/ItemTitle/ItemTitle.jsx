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
    Sephora.Util.InflatorComps.Comps['ItemTitle'] = function ItemTitle(){
        return ItemTitleClass;
    }
}
const { colors, fontSizes, lineHeights, space } = require('style');
const { Box, Grid } = require('components/display');
const Chevron = require('components/Chevron/Chevron');
const trackNavClick = require('analytics/bindingMethods/pages/all/navClickBindings').trackNavClick;

const ItemTitle = function () { };

ItemTitle.prototype.handleClick = function () {
    if (!this.props.href) {
        this.props.toggleSubmenu(true, this.props.callback);
    } else {
        let path = this.props.title;
        path.unshift('top nav');
        trackNavClick(path);
    }
};

ItemTitle.prototype.render = function () {
    const {
        href,
        isAccount,
        isMainMenu,
        isLast
    } = this.props;

    const styles = {
        root: {
            /*
                prevent iOS safari from setting the `inner`
                border to black when :visited
            */
            '&:visited > *': {
                color: 'inherit'
            }
        },
        inner: isAccount ? {
            padding: space[4],
            backgroundColor: colors.black,
            color: colors.white
        } : {
            fontWeight: isMainMenu ? 700 : null,
            fontSize: fontSizes.h4,
            lineHeight: lineHeights[2],
            paddingTop: space[4],
            paddingBottom: space[4],
            paddingRight: space[4],
            marginLeft: space[4],
            borderBottomWidth: isLast && isMainMenu ? 0 : 1,
            borderColor: colors.lightGray
        }
    };
    return (
        <Box
            onClick={this.handleClick}
            href={href}
            _css={styles.root}
            width='100%'>
            <Grid
                alignItems='center'
                _css={styles.inner}>
                <Grid.Cell width='fill'>
                    {this.props.children}
                </Grid.Cell>
                {!href &&
                    <Grid.Cell
                        width='fit'
                        lineHeight={0}
                        marginLeft={space[3]}>
                        <Chevron />
                    </Grid.Cell>
                }
            </Grid>
        </Box>
    );
};


// Added by sephora-jsx-loader.js
ItemTitle.prototype.path = 'Header/Nav/Hamburger/HamburgerItem/ItemTitle';
// Added by sephora-jsx-loader.js
ItemTitle.prototype.class = 'ItemTitle';
// Added by sephora-jsx-loader.js
ItemTitle.prototype.getInitialState = function() {
    ItemTitle.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ItemTitle.prototype.render = wrapComponentRender(ItemTitle.prototype.render);
// Added by sephora-jsx-loader.js
var ItemTitleClass = React.createClass(ItemTitle.prototype);
// Added by sephora-jsx-loader.js
ItemTitleClass.prototype.classRef = ItemTitleClass;
// Added by sephora-jsx-loader.js
Object.assign(ItemTitleClass, ItemTitle);
// Added by sephora-jsx-loader.js
module.exports = ItemTitleClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/Hamburger/HamburgerItem/ItemTitle/ItemTitle.jsx