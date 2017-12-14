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
    Sephora.Util.InflatorComps.Comps['BccMarkdown'] = function BccMarkdown(){
        return BccMarkdownClass;
    }
}
const Box = require('components/Box/Box');
const Container = require('components/Container/Container');
const Markdown = require('components/Markdown/Markdown');

const BccMarkdown = function () { };

BccMarkdown.prototype.render = function () {
    const {
        name,
        backGroundColor,
        text,
        isFullWidth,
        enableTesting,
        contentType,
        componentName,
        componentType,
        targetWindow,
        modalComponentTemplate,
        ...props
    } = this.props;

    const WrapComp = isFullWidth ? Container : Box;

    return (
        <Box
            backgroundColor={backGroundColor}>
            <WrapComp>
                <Markdown
                    {...props}
                    targetWindow={targetWindow}
                    modalComponentTemplate={modalComponentTemplate}
                    content={text} />
            </WrapComp>
        </Box>
    );
};


// Added by sephora-jsx-loader.js
BccMarkdown.prototype.path = 'Bcc/BccMarkdown';
// Added by sephora-jsx-loader.js
BccMarkdown.prototype.class = 'BccMarkdown';
// Added by sephora-jsx-loader.js
BccMarkdown.prototype.getInitialState = function() {
    BccMarkdown.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BccMarkdown.prototype.render = wrapComponentRender(BccMarkdown.prototype.render);
// Added by sephora-jsx-loader.js
var BccMarkdownClass = React.createClass(BccMarkdown.prototype);
// Added by sephora-jsx-loader.js
BccMarkdownClass.prototype.classRef = BccMarkdownClass;
// Added by sephora-jsx-loader.js
Object.assign(BccMarkdownClass, BccMarkdown);
// Added by sephora-jsx-loader.js
module.exports = BccMarkdownClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Bcc/BccMarkdown/BccMarkdown.jsx