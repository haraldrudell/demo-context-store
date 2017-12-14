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
    Sephora.Util.InflatorComps.Comps['CatNavParent'] = function CatNavParent(){
        return CatNavParentClass;
    }
}
const { lineHeights, space } = require('style');
const { Box } = require('components/display');
const BccLink = require('components/Bcc/BccLink/BccLink');
const UrlUtils = require('utils/Url');

const CatNavParent = function () {
    this.state = {
        active: false
    };
};

CatNavParent.prototype.toggleActive = function (clear) {
    this.setState({
        active: !this.state.active
    }, clear ? this.props.changeCategory(null) : null);
};

CatNavParent.prototype.render = function () {
    let {
        category,
        openCategory,
        bccCategory,
        handleSwitchMenu,
        index,
        trackNavClick
    } = this.props;

    const styles = {
        width: '100%',
        textTransform: 'uppercase',
        lineHeight: lineHeights[2],
        paddingTop: space[3],
        paddingRight: space[3],
        paddingBottom: space[3],
        paddingLeft: space[5]
    };

    return (
        bccCategory ?
            <BccLink
                onMouseEnter={() => this.toggleActive(true)}
                onMouseLeave={this.toggleActive}
                _css={styles}
                style={{
                    fontWeight: this.state.active ? 700 : null
                }}
                anaNavPath={['top nav', bccCategory.displayTitle]}
                url={UrlUtils.getLink(bccCategory.targetScreen.targetUrl)}
                target={bccCategory.targetScreen.targetWindow}>
                {bccCategory.displayTitle}
            </BccLink>
        :
            <Box
                href={!Sephora.isTouch ? UrlUtils.getLink(category.targetUrl) : null}
                onMouseEnter={() => handleSwitchMenu(index, category)}
                _css={styles}
                style={{
                    fontWeight: openCategory && openCategory.categoryId === category.categoryId ? 700 : null
                }}
                onClick={() => trackNavClick(['top nav', 'shop', category.displayName])}>
                {category.displayName}
            </Box>
    );
};


// Added by sephora-jsx-loader.js
CatNavParent.prototype.path = 'Header/Nav/CatNav/CatNavParent';
// Added by sephora-jsx-loader.js
CatNavParent.prototype.class = 'CatNavParent';
// Added by sephora-jsx-loader.js
CatNavParent.prototype.getInitialState = function() {
    CatNavParent.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
CatNavParent.prototype.render = wrapComponentRender(CatNavParent.prototype.render);
// Added by sephora-jsx-loader.js
var CatNavParentClass = React.createClass(CatNavParent.prototype);
// Added by sephora-jsx-loader.js
CatNavParentClass.prototype.classRef = CatNavParentClass;
// Added by sephora-jsx-loader.js
Object.assign(CatNavParentClass, CatNavParent);
// Added by sephora-jsx-loader.js
module.exports = CatNavParentClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/CatNav/CatNavParent/CatNavParent.jsx