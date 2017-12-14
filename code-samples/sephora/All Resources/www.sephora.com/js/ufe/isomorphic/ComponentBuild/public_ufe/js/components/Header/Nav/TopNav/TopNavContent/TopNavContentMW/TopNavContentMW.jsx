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
    Sephora.Util.InflatorComps.Comps['TopNavContentMW'] = function TopNavContentMW(){
        return TopNavContentMWClass;
    }
}
const HamburgerItem = require('components/Header/Nav/Hamburger/HamburgerItem/HamburgerItem');
const BccLink = require('components/Bcc/BccLink/BccLink');
const COMPONENT_NAMES = require('utils/BCC').COMPONENT_NAMES;

const TopNavContentMW = function () {
    this.state = {
        activeMenu: null,
        trackPath: [this.props.item.displayTitle],
        parsedContent: null
    };
};

TopNavContentMW.prototype.render = function () {
    let item = this.props.item;
    let linkPath = this.state.trackPath.slice();

    let hasChildren = comp => {
        switch (comp.componentType) {
            case COMPONENT_NAMES.LINK_GROUP:
            case COMPONENT_NAMES.GRID:
            case COMPONENT_NAMES.TARGETER:
                return true;
            default:
                return false;
        }
    };

    // Default BCC component conversion for Hamburger Menus
    let linkedComponent = (link, isMain) => {
        const linkName = link.displayTitle || link.title;
        if (link && linkName) {
            return <HamburgerItem.Title
                href={(!hasChildren(link) && link.targetScreen) ?
                    link.targetScreen.targetUrl : null}
                callback={() => this.handleClick(link, isMain)}
                title={(() => {
                    let title = linkPath.slice();
                    title.push(linkName);
                    return title;
                })()}>
                <BccLink
                    target={link.targetScreen ? link.targetScreen.targetWindow : null}
                    text={linkName}
                    modalTemplate={link.modalComponentTemplate}
                    enableTesting={link.enableTesting ? link.enableTesting : null} />
            </HamburgerItem.Title>;
        } else {
            return false;
        }
    };

    // Map grid components into links
    let mapGridLinks = (comp, isMain) => {
        let title;

        // TODO: Double check if this is still needed
        if (comp.targeterResult !== undefined) {
            comp.targeterResult.map(result =>
                title = result
            );
        } else {
            title = comp;
        }

        return linkedComponent(title, isMain);
    };

    let renderMenu = comp => {
        let inner;
        let targeter;

        // Determine how the menu's inner components will be rendered
        switch (comp.componentType) {
            case COMPONENT_NAMES.LINK_GROUP:
                inner = comp.links && comp.links.map(child => linkedComponent(child));
                break;

            case COMPONENT_NAMES.GRID:
                inner = comp.components && comp.components.map((child, index) =>
                    <HamburgerItem key={index}>
                        {mapGridLinks(child, false)}
                        <HamburgerItem.Menu>
                            {
                                /*
                                * A new Hamburger.Menu is instantiated recursively in case of
                                * nested grids, link groups, or targeters.
                                */
                                hasChildren(child) && renderMenu(child)
                            }
                        </HamburgerItem.Menu>
                    </HamburgerItem>
                );
                break;

            case COMPONENT_NAMES.TARGETER:

                // Targeter flag is used to avoid rendering two Headers
                // TODO: Double check if this is still needed.
                targeter = true;
                inner = comp.targeterResult.map(result => renderMenu(result));
                break;

            default:
                inner = linkedComponent(comp);
        }

        // Returns a new menu with standard HamburgerItem composition
        return (
            <HamburgerItem>
                {!targeter
                    ? <HamburgerItem.Header>{comp.displayTitle || comp.title}</HamburgerItem.Header>
                    : null
                }
                {inner}
            </HamburgerItem>
        );
    };

    return (
        <HamburgerItem>
            <HamburgerItem.Header
                href={item.targetUrl}>
                {item.displayTitle && item.displayTitle}
            </HamburgerItem.Header>
            {
                !this.state.parsedContent ? this.setContent(item) :
                    this.state.parsedContent.map(child => {
                        if (child.displayTitle || child.title) {
                            return mapGridLinks(child, true);
                        } else if (child.components) {
                            return child.components.map(innerChild =>
                                mapGridLinks(innerChild, true));
                        }
                })
            }
            <HamburgerItem.Menu>
                {this.state.activeMenu && renderMenu(this.state.activeMenu)}
            </HamburgerItem.Menu>
        </HamburgerItem>
    );
};

// Added by sephora-jsx-loader.js
TopNavContentMW.prototype.path = 'Header/Nav/TopNav/TopNavContent/TopNavContentMW';
// Added by sephora-jsx-loader.js
Object.assign(TopNavContentMW.prototype, require('./TopNavContentMW.c.js'));
var originalDidMount = TopNavContentMW.prototype.componentDidMount;
TopNavContentMW.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: TopNavContentMW');
if (originalDidMount) originalDidMount.apply(this);
if (TopNavContentMW.prototype.ctrlr) TopNavContentMW.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: TopNavContentMW');
// Added by sephora-jsx-loader.js
TopNavContentMW.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
TopNavContentMW.prototype.class = 'TopNavContentMW';
// Added by sephora-jsx-loader.js
TopNavContentMW.prototype.getInitialState = function() {
    TopNavContentMW.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
TopNavContentMW.prototype.render = wrapComponentRender(TopNavContentMW.prototype.render);
// Added by sephora-jsx-loader.js
var TopNavContentMWClass = React.createClass(TopNavContentMW.prototype);
// Added by sephora-jsx-loader.js
TopNavContentMWClass.prototype.classRef = TopNavContentMWClass;
// Added by sephora-jsx-loader.js
Object.assign(TopNavContentMWClass, TopNavContentMW);
// Added by sephora-jsx-loader.js
module.exports = TopNavContentMWClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/TopNav/TopNavContent/TopNavContentMW/TopNavContentMW.jsx