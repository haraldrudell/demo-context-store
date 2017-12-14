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
    Sephora.Util.InflatorComps.Comps['TopNavContent'] = function TopNavContent(){
        return TopNavContentClass;
    }
}
const space = require('style').space;
const { Box, Grid } = require('components/display');
const BccComponentList = require('components/Bcc/BccComponentList/BccComponentList');
const TopNavContentMW = require('./TopNavContentMW/TopNavContentMW');

const TopNavContent = function () {};

TopNavContent.prototype.render = function () {
    const compsLimit = 4;

    let { item } = this.props;
    let bccComponents;

    if (Sephora.isDesktop()) {
        bccComponents = item.components && item.components.map(
            (component, index) =>
                <BccComponentList
                    items={[component]}
                    isTopNav={true}
                    nested={true}
                    key={index}
                    parentTitle={item.displayTitle} />
        );

        if (bccComponents.length > compsLimit) {
            bccComponents = bccComponents.slice(0, compsLimit);
        }
    }

    return (
        Sephora.isDesktop() ?
            <Box
                padding={space[5]}
                minHeight={448}>
                <Grid gutter={space[4]}>
                    {
                        bccComponents && bccComponents.map((component, index) =>
                            <Grid.Cell key={index} width={1 / 4}>
                                {component}
                            </Grid.Cell>
                        )
                    }
                </Grid>
            </Box> : <TopNavContentMW item={item} />
    );
};


// Added by sephora-jsx-loader.js
TopNavContent.prototype.path = 'Header/Nav/TopNav/TopNavContent';
// Added by sephora-jsx-loader.js
TopNavContent.prototype.class = 'TopNavContent';
// Added by sephora-jsx-loader.js
TopNavContent.prototype.getInitialState = function() {
    TopNavContent.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
TopNavContent.prototype.render = wrapComponentRender(TopNavContent.prototype.render);
// Added by sephora-jsx-loader.js
var TopNavContentClass = React.createClass(TopNavContent.prototype);
// Added by sephora-jsx-loader.js
TopNavContentClass.prototype.classRef = TopNavContentClass;
// Added by sephora-jsx-loader.js
Object.assign(TopNavContentClass, TopNavContent);
// Added by sephora-jsx-loader.js
module.exports = TopNavContentClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/TopNav/TopNavContent/TopNavContent.jsx