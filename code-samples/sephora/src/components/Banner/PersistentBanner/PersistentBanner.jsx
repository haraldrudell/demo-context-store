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
    Sephora.Util.InflatorComps.Comps['PersistentBanner'] = function PersistentBanner(){
        return PersistentBannerClass;
    }
}
const {
    colors, fontSizes, lineHeights, space
} = require('style');
const { Box } = require('components/display');
const COMPONENT_NAMES = require('utils/BCC').COMPONENT_NAMES;
const Container = require('components/Container/Container');
const BccComponentList = require('components/Bcc/BccComponentList/BccComponentList');

const PersistentBanner = function () {
    // TODO 17.4: Once any of those pages are UFE-ified, the isRendered default logic will need to
    // change. Right now we assume we only ever need to suppress in legacy
    this.state = {
        isOpen: true,
        isRendered: !Sephora.isLegacyMode
    };
};

PersistentBanner.prototype.render = function () {
    let {
        bannerData,
        isBanner1
    } = this.props;

    const linkAndMarkdownStyle = {
        fontSize: fontSizes.h5,
        fontWeight: 700,
        lineHeight: Sephora.isMobile() ? lineHeights[2] : null,
        paddingTop: space[2],
        paddingBottom: space[2],
        textTransform: 'uppercase',
        textAlign: 'center'
    };

    let propsCallback = function (componentType) {
        switch (componentType) {
            case COMPONENT_NAMES.LINK:
                return {
                    _css: linkAndMarkdownStyle,
                    hoverColor: colors.gray
                };
            case COMPONENT_NAMES.MARKDOWN:
                return {
                    _css: linkAndMarkdownStyle,
                    isFullWidth: true
                };
            default:
                return null;
        }
    };

    if (!Array.isArray(bannerData)) {
        bannerData = [bannerData];
    }

    if (COMPONENT_NAMES.TARGETER === bannerData[0].componentType) {
        bannerData[0].isContained = true;
    }

    bannerData[0].isTrackByName = true;

    let isContained = true;
    if (bannerData[0].componentType === COMPONENT_NAMES.MARKDOWN ||
        bannerData[0].componentType === COMPONENT_NAMES.TARGETER) {
        isContained = false;
    }

    const WrapComp = isContained ? Container : Box;

    // Disable lazy loading if banner is an image
    bannerData.forEach(banner => {
        if (banner.componentType === COMPONENT_NAMES.IMAGE) {
            banner.disableLazyLoad = true;
        }
    });

    return (
        this.state.isRendered ?
            <div
                style={{
                    display: isBanner1 && !this.state.isOpen ? 'none' : null
                }}>
                <WrapComp>
                    <BccComponentList
                        items={bannerData}
                        propsCallback={propsCallback} />
                </WrapComp>
            </div>
        : <div/>
    );
};


// Added by sephora-jsx-loader.js
PersistentBanner.prototype.path = 'Banner/PersistentBanner';
// Added by sephora-jsx-loader.js
Object.assign(PersistentBanner.prototype, require('./PersistentBanner.c.js'));
var originalDidMount = PersistentBanner.prototype.componentDidMount;
PersistentBanner.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: PersistentBanner');
if (originalDidMount) originalDidMount.apply(this);
if (PersistentBanner.prototype.ctrlr) PersistentBanner.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: PersistentBanner');
// Added by sephora-jsx-loader.js
PersistentBanner.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
PersistentBanner.prototype.class = 'PersistentBanner';
// Added by sephora-jsx-loader.js
PersistentBanner.prototype.getInitialState = function() {
    PersistentBanner.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
PersistentBanner.prototype.render = wrapComponentRender(PersistentBanner.prototype.render);
// Added by sephora-jsx-loader.js
var PersistentBannerClass = React.createClass(PersistentBanner.prototype);
// Added by sephora-jsx-loader.js
PersistentBannerClass.prototype.classRef = PersistentBannerClass;
// Added by sephora-jsx-loader.js
Object.assign(PersistentBannerClass, PersistentBanner);
// Added by sephora-jsx-loader.js
module.exports = PersistentBannerClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Banner/PersistentBanner/PersistentBanner.jsx