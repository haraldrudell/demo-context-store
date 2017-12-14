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
    Sephora.Util.InflatorComps.Comps['CatNavGroup'] = function CatNavGroup(){
        return CatNavGroupClass;
    }
}
const { space } = require('style');
const { Box } = require('components/display');
const CatNavHeading = require('../CatNavHeading/CatNavHeading');
const UrlUtils = require('utils/Url');

const CatNavGroup = function () { };

CatNavGroup.prototype.render = function () {
    const {
        child, trackNavClick, anaCategoryPath
    } = this.props;
    return (
        <div>
            <CatNavHeading
                href={UrlUtils.getLink(child.targetUrl)}
                marginBottom={child.hasChildCategories ? '0px' : null}
                onClick={() => trackNavClick(
                    ['top nav', 'shop', anaCategoryPath, child.displayName]
                )}>
                {child.displayName}
            </CatNavHeading>
            {child.hasChildCategories &&
                <Box
                    is='ul'
                    marginBottom={space[4]}>
                    {child.childCategories.map((innerChild, index) =>
                        <li>
                            <Box
                                key={index}
                                paddingY={space[1]}
                                hoverColor='gray'
                                href={UrlUtils.getLink(innerChild.targetUrl)}
                                onClick={() => trackNavClick(['top nav', 'shop', anaCategoryPath,
                                    child.displayName, innerChild.displayName]
                                )}>
                                {innerChild.displayName}
                            </Box>
                        </li>
                    )}
                </Box>
            }
        </div>
    );
};


// Added by sephora-jsx-loader.js
CatNavGroup.prototype.path = 'Header/Nav/CatNav/CatNavChild/CatNavGroup';
// Added by sephora-jsx-loader.js
CatNavGroup.prototype.class = 'CatNavGroup';
// Added by sephora-jsx-loader.js
CatNavGroup.prototype.getInitialState = function() {
    CatNavGroup.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
CatNavGroup.prototype.render = wrapComponentRender(CatNavGroup.prototype.render);
// Added by sephora-jsx-loader.js
var CatNavGroupClass = React.createClass(CatNavGroup.prototype);
// Added by sephora-jsx-loader.js
CatNavGroupClass.prototype.classRef = CatNavGroupClass;
// Added by sephora-jsx-loader.js
Object.assign(CatNavGroupClass, CatNavGroup);
// Added by sephora-jsx-loader.js
module.exports = CatNavGroupClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/CatNav/CatNavChild/CatNavGroup/CatNavGroup.jsx