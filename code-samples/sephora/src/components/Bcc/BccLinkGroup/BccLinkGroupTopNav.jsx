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
    Sephora.Util.InflatorComps.Comps['BccLinkGroupTopNav'] = function BccLinkGroupTopNav(){
        return BccLinkGroupTopNavClass;
    }
}
const { space } = require('style');
const { Box } = require('components/display');
const BccLink = require('components/Bcc/BccLink/BccLink');
const CatNavHeading = require('components/Header/Nav/CatNav/CatNavChild/CatNavHeading/CatNavHeading');
const trackNavClick = require('analytics/bindingMethods/pages/all/navClickBindings').trackNavClick;

const BccLinkGroupTopNav = function () { };

BccLinkGroupTopNav.prototype.render = function () {
    const {
        links,
        title,
        parentTitle,
        contextualParentTitles,
        ...props
    } = this.props;

    return (
        <div>
            {title &&
                <CatNavHeading
                    marginBottom={links ? '0px' : null}>
                    {title}
                </CatNavHeading>
            }
            {links &&
                <Box
                    is='ul'
                    marginBottom={space[4]}>
                    {links.map((link, index) =>
                        <li
                            key={index}
                            onClick={() => {
                                if (contextualParentTitles) {
                                    trackNavClick(
                                        contextualParentTitles.concat([title, link.displayTitle])
                                    );
                                } else {
                                    trackNavClick(
                                        ['top nav', parentTitle, title, link.displayTitle]
                                    );
                                }
                            }
                            }>
                            <BccLink
                                paddingY={space[1]}
                                hoverColor='gray'
                                url={link.targetScreen.targetUrl}
                                target={link.targetScreen.targetWindow}
                                title={link.altText}
                                text={link.displayTitle}
                                modalTemplate={link.modalComponentTemplate}
                                enableTesting={link.enableTesting} />
                        </li>
                    )}
                </Box>
            }
        </div>
    );
};


// Added by sephora-jsx-loader.js
BccLinkGroupTopNav.prototype.path = 'Bcc/BccLinkGroup';
// Added by sephora-jsx-loader.js
BccLinkGroupTopNav.prototype.class = 'BccLinkGroupTopNav';
// Added by sephora-jsx-loader.js
BccLinkGroupTopNav.prototype.getInitialState = function() {
    BccLinkGroupTopNav.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BccLinkGroupTopNav.prototype.render = wrapComponentRender(BccLinkGroupTopNav.prototype.render);
// Added by sephora-jsx-loader.js
var BccLinkGroupTopNavClass = React.createClass(BccLinkGroupTopNav.prototype);
// Added by sephora-jsx-loader.js
BccLinkGroupTopNavClass.prototype.classRef = BccLinkGroupTopNavClass;
// Added by sephora-jsx-loader.js
Object.assign(BccLinkGroupTopNavClass, BccLinkGroupTopNav);
// Added by sephora-jsx-loader.js
module.exports = BccLinkGroupTopNavClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Bcc/BccLinkGroup/BccLinkGroupTopNav.jsx