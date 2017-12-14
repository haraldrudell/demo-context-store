// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var TopNavContentMW = function () {};

// Added by sephora-jsx-loader.js
TopNavContentMW.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const COMPONENT_NAMES = require('utils/BCC').COMPONENT_NAMES;
const processTargeters = require('utils/BCC').processTargeters;

TopNavContentMW.prototype.ctrlr = function () {};

TopNavContentMW.prototype.handleClick = function (link, isMain) {
    let linkPath = this.state.trackPath.slice();
    linkPath.push(link.displayTitle);

    if (isMain) {
        this.setState({
            activeMenu: link,
            trackPath: linkPath
        });
    } else {
        this.setState({
            trackPath: linkPath
        });
    }
};

TopNavContentMW.prototype.setContent = function (content) {
    const comps = [];

    /** Given that retrieving a targeter result is an async operation, we must first check if
     * there is any targeter at all and handle it with state before actually rendering,
     * else the targeter result won't render.
     * */
    content.components && content.components.map((child, index) => {
        if (child.componentType === COMPONENT_NAMES.TARGETER) {
            processTargeters(child.targeterName, results => {
                if (results.length) {

                    /* Keep the same index as the original targeter element */
                    comps.splice(index, 0, results[0]);
                }
            });
        } else {
            comps.push(child);
        }
    });

    this.setState({
        parsedContent: comps
    });
};

TopNavContentMW.prototype.componentWillReceiveProps = function (nextProps) {

    /* Reset state when changing main menu */
    if (nextProps.item.displayTitle !== this.props.item.displayTitle) {
        this.setState({
            parsedContent: null,
            activeMenu: null
        });
    }

    return;
};


// Added by sephora-jsx-loader.js
module.exports = TopNavContentMW.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/TopNav/TopNavContent/TopNavContentMW/TopNavContentMW.c.js