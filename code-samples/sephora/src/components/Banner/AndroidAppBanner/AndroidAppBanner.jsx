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
    Sephora.Util.InflatorComps.Comps['AndroidAppBanner'] = function AndroidAppBanner(){
        return AndroidAppBannerClass;
    }
}
const space = require('style').space;
const Container = require('components/Container/Container');
const Link = require('components/Link/Link');
const IconCross = require('components/Icon/IconCross');
const Grid = require('components/Grid/Grid');
const Image = require('components/Image/Image');
const ButtonRed = require('components/Button/ButtonRed');
const StickyBanner = require('components/Banner/StickyBanner/StickyBanner');

// jscs:disable maximumLineLength
const GOOGLE_PLAY_STORE_URL = 'https://186781.measurementapi.com/serve?action=click&publisher_id=186781&site_id=126121&my_campaign=Android%20app%20mktg&my_site=mWeb&my_placement=HP%20slide_targeted';

const AndroidAppBanner = function () {
    this.state = {
        isOpen: false
    };
};

AndroidAppBanner.prototype.render = function () {
    return (
        <StickyBanner isOpen={this.state.isOpen}>
            <Container>
                <Grid alignItems='center'>
                    <Grid.Cell width='fit'>
                        <Link
                            display='block'
                            onClick={this.closeBanner}
                            fontSize={20}
                            padding={space[3]}
                            marginLeft={-space[3]}>
                            <IconCross x={true} />
                        </Link>
                    </Grid.Cell>
                    <Grid.Cell
                        width='fill'
                        display='flex'
                        justifyContent='center'>
                        <Grid
                            alignItems='center'>
                            <Grid.Cell width='fill'>
                                <Image
                                    display='block'
                                    src='/img/ufe/banner-android-app.gif'
                                    width={181} />
                            </Grid.Cell>
                            <Grid.Cell width='fit'>
                                <ButtonRed
                                    is='a'
                                    marginLeft={space[5]}
                                    target='_blank'
                                    href={GOOGLE_PLAY_STORE_URL}>
                                    View
                                </ButtonRed>
                            </Grid.Cell>
                        </Grid>
                    </Grid.Cell>
                </Grid>
            </Container>
        </StickyBanner>
    );
};


// Added by sephora-jsx-loader.js
AndroidAppBanner.prototype.path = 'Banner/AndroidAppBanner';
// Added by sephora-jsx-loader.js
Object.assign(AndroidAppBanner.prototype, require('./AndroidAppBanner.c.js'));
var originalDidMount = AndroidAppBanner.prototype.componentDidMount;
AndroidAppBanner.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: AndroidAppBanner');
if (originalDidMount) originalDidMount.apply(this);
if (AndroidAppBanner.prototype.ctrlr) AndroidAppBanner.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: AndroidAppBanner');
// Added by sephora-jsx-loader.js
AndroidAppBanner.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
AndroidAppBanner.prototype.class = 'AndroidAppBanner';
// Added by sephora-jsx-loader.js
AndroidAppBanner.prototype.getInitialState = function() {
    AndroidAppBanner.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
AndroidAppBanner.prototype.render = wrapComponentRender(AndroidAppBanner.prototype.render);
// Added by sephora-jsx-loader.js
var AndroidAppBannerClass = React.createClass(AndroidAppBanner.prototype);
// Added by sephora-jsx-loader.js
AndroidAppBannerClass.prototype.classRef = AndroidAppBannerClass;
// Added by sephora-jsx-loader.js
Object.assign(AndroidAppBannerClass, AndroidAppBanner);
// Added by sephora-jsx-loader.js
module.exports = AndroidAppBannerClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Banner/AndroidAppBanner/AndroidAppBanner.jsx