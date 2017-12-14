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
    Sephora.Util.InflatorComps.Comps['BccLink'] = function BccLink(){
        return BccLinkClass;
    }
}
const { site, space } = require('style');
const { Box, Grid, Text } = require('components/display');
const Chevron = require('components/Chevron/Chevron');
const urlUtils = require('utils/Url');

let BccLink = function () {};

BccLink.prototype.setTargetWindow = function (target) {
    let targetWindow = target;

    if (typeof targetWindow === 'string') {
        targetWindow = targetWindow.toLowerCase();
    }

    switch (targetWindow) {
        case 1:
        case '1':
        case '_blank':
        case 'blank':
        case 'overlay':
            return '_blank';
        default:
            return '_self';
    }
};

BccLink.prototype.render = function () {
    const {
        url,
        target,
        title,
        text,
        withArrow,
        modalTemplate,
        trackNavClick,
        anaNavPath,
        enableTesting,
        icid2,
        isTrackByName,
        name,
        componentName,
        componentType,
        ...props
    } = this.props;

    let targetWindow = this.setTargetWindow(target);

    let targetUrl;
    if (icid2 && url && url.indexOf('icid2') === -1) {
        targetUrl = urlUtils.addInternalTracking(url, [icid2]);
    } else if (isTrackByName && name) {
        targetUrl = urlUtils.addInternalTracking(url, [name]);
    } else {
        targetUrl = url;
    }

    const linkProps = {
        ...props,
        is: 'a',
        href: urlUtils.getLink(targetUrl),
        target: targetWindow,
        title: title,
        rel: targetWindow === '_blank' ? 'noopener' : null,
        onClick: (e) => {
            this.toggleOpen(e);
            if (anaNavPath) {
                this.trackNavClick(anaNavPath);
            }
        }
    };

    return (
        <div>
            {withArrow ?
                <Grid
                    {...linkProps}
                    alignItems='center'
                    paddingY={space[3]}
                    paddingRight={Sephora.isMobile() ? site.PADDING_MW : null}>
                    <Grid.Cell
                        width='fill'>
                        <Text truncate={true}>
                            {text}
                        </Text>
                    </Grid.Cell>
                    <Grid.Cell
                        width='fit'
                        marginLeft='.5em'>
                        <Chevron direction='right' />
                    </Grid.Cell>
                </Grid>
                :
                <Box
                    {...linkProps}>
                    {text}
                </Box>
            }
        </div>
    );
};


// Added by sephora-jsx-loader.js
BccLink.prototype.path = 'Bcc/BccLink';
// Added by sephora-jsx-loader.js
Object.assign(BccLink.prototype, require('./BccLink.c.js'));
var originalDidMount = BccLink.prototype.componentDidMount;
BccLink.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BccLink');
if (originalDidMount) originalDidMount.apply(this);
if (BccLink.prototype.ctrlr) BccLink.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BccLink');
// Added by sephora-jsx-loader.js
BccLink.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BccLink.prototype.class = 'BccLink';
// Added by sephora-jsx-loader.js
BccLink.prototype.getInitialState = function() {
    BccLink.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BccLink.prototype.render = wrapComponentRender(BccLink.prototype.render);
// Added by sephora-jsx-loader.js
var BccLinkClass = React.createClass(BccLink.prototype);
// Added by sephora-jsx-loader.js
BccLinkClass.prototype.classRef = BccLinkClass;
// Added by sephora-jsx-loader.js
Object.assign(BccLinkClass, BccLink);
// Added by sephora-jsx-loader.js
module.exports = BccLinkClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Bcc/BccLink/BccLink.jsx