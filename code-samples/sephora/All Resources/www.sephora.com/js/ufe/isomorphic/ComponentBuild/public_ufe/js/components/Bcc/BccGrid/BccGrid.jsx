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
    Sephora.Util.InflatorComps.Comps['BccGrid'] = function BccGrid(){
        return BccGridClass;
    }
}
const { space } = require('style');
const { Box, Grid, Image } = require('components/display');
let BccComponentList = require('components/Bcc/BccComponentList/BccComponentList');

let BccGrid = function () { };

BccGrid.prototype.render = function () {
    const {
        name, //BccName
        styleList,
        displayTitle,
        imagePath,
        targetUrl,
        subHead,
        cols,
        children,
        components,
        nested,
        isTopNav,
        parentTitle,
        disableLazyLoad = false,
        ...props
    } = this.props;
    let gutter = 0;
    if (this.props.styleList &&
        this.props.styleList.indexOf('HORIZONTAL_PADDING') !== -1) {
        gutter = space[4];
    }

    let getTitle = () => {
        let title = imagePath
            ? <Image
                src={imagePath}
                alt={displayTitle}
                disableLazyLoad={isTopNav || disableLazyLoad}/>
            : displayTitle;

        if (targetUrl) {
            title = <Box href={targetUrl}>{title}</Box>;
        }

        return title;
    };

    return (
        <div data-lload={this.props.lazyLoad}>
            {displayTitle || subHead ?
                <Box
                    marginBottom={space[5]}
                    textAlign={Sephora.isMobile() ? 'left' : 'center'}>
                    {displayTitle &&
                        <Box
                            is='h2'
                            lineHeight={1}
                            fontSize={Sephora.isMobile() ? 'h1' : 'h0'}
                            serif={true}>
                            {getTitle()}
                        </Box>
                    }
                    {subHead &&
                        <Box
                            is='h3'
                            fontWeight={300}
                            marginTop={displayTitle || imagePath ? space[2] : null}
                            fontSize={Sephora.isMobile() ? 'h4' : 'h3'}>
                            {subHead}
                        </Box>
                    }
                </Box>
                : null
            }

            <Grid gutter={gutter}>
                {
                    components.map((child, index) => {
                        child.disableLazyLoad = disableLazyLoad;
                        return <Grid.Cell key={index} width={cols ? 1 / cols : 1}>
                            <BccComponentList
                            items={[child]}
                            nested={nested}
                            isTopNav={isTopNav}
                            parentTitle={parentTitle} />
                        </Grid.Cell>;
                    })
                }
            </Grid>
        </div>
    );
};


// Added by sephora-jsx-loader.js
BccGrid.prototype.path = 'Bcc/BccGrid';
// Added by sephora-jsx-loader.js
BccGrid.prototype.class = 'BccGrid';
// Added by sephora-jsx-loader.js
BccGrid.prototype.getInitialState = function() {
    BccGrid.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BccGrid.prototype.render = wrapComponentRender(BccGrid.prototype.render);
// Added by sephora-jsx-loader.js
var BccGridClass = React.createClass(BccGrid.prototype);
// Added by sephora-jsx-loader.js
BccGridClass.prototype.classRef = BccGridClass;
// Added by sephora-jsx-loader.js
Object.assign(BccGridClass, BccGrid);
// Added by sephora-jsx-loader.js
module.exports = BccGridClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Bcc/BccGrid/BccGrid.jsx