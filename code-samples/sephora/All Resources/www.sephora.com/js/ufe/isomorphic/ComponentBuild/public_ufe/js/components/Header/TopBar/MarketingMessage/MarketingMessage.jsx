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
    Sephora.Util.InflatorComps.Comps['MarketingMessage'] = function MarketingMessage(){
        return MarketingMessageClass;
    }
}
const COMPONENT_NAMES = require('utils/BCC').COMPONENT_NAMES;
const Markdown = require('components/Markdown/Markdown');
const BccLink = require('components/Bcc/BccLink/BccLink');
const { css } = require('glamor');
const processTargeters = require('utils/BCC').processTargeters;
const anaNavPath = ['toolbar', 'promotions', 'promotions', 'promotions'];

const MarketingMessage = function () {
    this.state = {
        limit: 1,
        renderedMessages: []
    };
};

MarketingMessage.prototype.index = 0;

// iterate over the messages to define the component needed.
MarketingMessage.prototype.defineCompType = function (bccMessages) {
    return bccMessages && bccMessages.map((item, index) => {

        let renderedComp = null;

        switch (item.componentType) {
            case COMPONENT_NAMES.LINK:
                renderedComp = <BccLink
                        key={index}
                        hoverColor='moonGray'
                        url={item.targetScreen.targetUrl}
                        target={item.targetScreen.targetWindow}
                        text={item.displayTitle}
                        anaNavPath={anaNavPath.concat(['promotions-' + item.name])}
                        modalTemplate={Sephora.isThirdPartySite
                            ? ''
                            : item.modalComponentTemplate}
                        componentName={item.componentName}
                        enableTesting={item.enableTesting} />;
                break;
            case COMPONENT_NAMES.MARKDOWN:
                renderedComp = <Markdown
                        key={index}
                        anaNavPath={anaNavPath.concat(['promotions-' + item.name])}
                        content={item.text}/>;
                break;
            case COMPONENT_NAMES.TARGETER:

                //isTargeter?
                if (!!item.targeterName) {
                    processTargeters(item.targeterName, (targeterResult) => {
                        if (targeterResult.length) {
                            renderedComp = targeterResult;
                        }
                    });
                }

                break;
        }

        return <div className={ css({ display: 'none' }) }>{renderedComp}</div>;
    });
};

MarketingMessage.prototype.render = function () {
    const {
        marketingMessages = [],
        ...props
    } = this.props;

    return (
        <div>
          {this.state.renderedMessages}
        </div>
    );
};


// Added by sephora-jsx-loader.js
MarketingMessage.prototype.path = 'Header/TopBar/MarketingMessage';
// Added by sephora-jsx-loader.js
Object.assign(MarketingMessage.prototype, require('./MarketingMessage.c.js'));
var originalDidMount = MarketingMessage.prototype.componentDidMount;
MarketingMessage.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: MarketingMessage');
if (originalDidMount) originalDidMount.apply(this);
if (MarketingMessage.prototype.ctrlr) MarketingMessage.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: MarketingMessage');
// Added by sephora-jsx-loader.js
MarketingMessage.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
MarketingMessage.prototype.class = 'MarketingMessage';
// Added by sephora-jsx-loader.js
MarketingMessage.prototype.getInitialState = function() {
    MarketingMessage.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
MarketingMessage.prototype.render = wrapComponentRender(MarketingMessage.prototype.render);
// Added by sephora-jsx-loader.js
var MarketingMessageClass = React.createClass(MarketingMessage.prototype);
// Added by sephora-jsx-loader.js
MarketingMessageClass.prototype.classRef = MarketingMessageClass;
// Added by sephora-jsx-loader.js
Object.assign(MarketingMessageClass, MarketingMessage);
// Added by sephora-jsx-loader.js
module.exports = MarketingMessageClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/TopBar/MarketingMessage/MarketingMessage.jsx