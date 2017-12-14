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
    Sephora.Util.InflatorComps.Comps['MyBeautyInsider'] = function MyBeautyInsider(){
        return MyBeautyInsiderClass;
    }
}
const { colors, site, space } = require('style');
const { Box, Flex, Grid, Text } = require('components/display');
const BiTopBar = require('components/BiTopBar/BiTopBar');
const BiFullSection = require('components/BiTopBar/BiFullSection/BiFullSection');
const BeautyProfile = require('components/RichProfile/BeautyInsider/MyBeautyInsider/BeautyProfile/BeautyProfile');
const RecentBankActivity = require('components/RichProfile/BeautyInsider/MyBeautyInsider/PointsNSpendBank/RecentBankActivity/RecentBankActivity');
const Container = require('components/Container/Container');
const Divider = require('components/Divider/Divider');
const Link = require('components/Link/Link');
const BccComponentList = require('components/Bcc/BccComponentList/BccComponentList');
const BccImage = require('components/Bcc/BccImage/BccImage');

const communityUtils = require('utils/Community');
const SOCIAL_PROVIDERS = communityUtils.PROVIDER_TYPES;

const MyBeautyInsider = function () {
    this.state = {
        centerContent: null,
        rightContent: null,
        leftContent: null
    };
};

MyBeautyInsider.prototype.render = function () {
    const { user } = this.props;
    const isDesktop = Sephora.isDesktop();
    let centerContentData = this.state.centerContent;
    let rightContentData = this.state.rightContent;
    let leftContentData = this.state.leftContent;

    const bccDivider =
        <Divider
            marginX={-site.PADDING_MW}
            color='nearWhite'
            height={space[2]} />;

    return (
        <div>
            <BiTopBar>
                <BiFullSection
                    user={user}
                    isShowViewActivity={false} />
            </BiTopBar>
            <Container>
                {rightContentData &&
                    <Box
                        marginBottom={isDesktop ? space[5] : space[4]}>
                        <BccComponentList
                            items={rightContentData} />
                        {isDesktop || bccDivider}
                    </Box>
                }
                <Grid>
                    <Grid.Cell
                        paddingRight={isDesktop ? space[6] : null}
                        width={isDesktop ? 1 / 2 : null}>
                        <RecentBankActivity user={user} />
                    </Grid.Cell>
                    <Grid.Cell
                        width={isDesktop ? 1 / 2 : null}
                        _css={isDesktop ? {
                            borderLeftWidth: 1,
                            borderColor: colors.moonGray,
                            paddingLeft: space[6]
                        } : {
                            paddingBottom: space[4]
                        }}>
                        {isDesktop ||
                            <Divider
                                marginX={-site.PADDING_MW}
                                marginY={space[4]}
                                color='nearWhite'
                                height={space[2]} />
                        }
                        <Flex
                            justifyContent='space-between'
                            alignItems='baseline'>
                            <Text
                                is='h2'
                                fontSize='h1'
                                lineHeight={2}
                                serif={true}
                                marginBottom={isDesktop ? space[5] : space[4]}>
                                Beauty Traits
                            </Text>
                            <Link
                                onClick={this.openEditMyProfileModal}
                                primary={true}
                                padding={space[2]}
                                margin={-space[2]}>
                                Edit
                            </Link>
                        </Flex>
                        <BeautyProfile
                            biAccount={user.beautyInsiderAccount} />
                    </Grid.Cell>
                </Grid>
                <Grid
                    marginTop={isDesktop ? space[7] : null}
                    gutter={isDesktop ? space[5] : null}>
                    <Grid.Cell
                        width={isDesktop ? 1 / 2 : null}>
                        {(centerContentData && this.checkBirthDay()) &&
                            <div>
                                {isDesktop || bccDivider}
                                <BccImage
                                    name={centerContentData[0].name}
                                    width={centerContentData[0].width}
                                    altText={centerContentData[0].altText}
                                    height={centerContentData[0].height}
                                    imagePath={centerContentData[0].imagePath}
                                    imageId={centerContentData[0].imageId}
                                    targetScreen={centerContentData[0].targetScreen} />
                            </div>
                        }
                    </Grid.Cell>
                    <Grid.Cell
                        width={isDesktop ? 1 / 2 : null}>
                        {isDesktop || bccDivider}
                        <BccComponentList
                            nested={isDesktop}
                            items={leftContentData} />
                    </Grid.Cell>
                </Grid>
            </Container>
        </div>
    );
};


// Added by sephora-jsx-loader.js
MyBeautyInsider.prototype.path = 'RichProfile/BeautyInsider/MyBeautyInsider';
// Added by sephora-jsx-loader.js
Object.assign(MyBeautyInsider.prototype, require('./MyBeautyInsider.c.js'));
var originalDidMount = MyBeautyInsider.prototype.componentDidMount;
MyBeautyInsider.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: MyBeautyInsider');
if (originalDidMount) originalDidMount.apply(this);
if (MyBeautyInsider.prototype.ctrlr) MyBeautyInsider.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: MyBeautyInsider');
// Added by sephora-jsx-loader.js
MyBeautyInsider.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
MyBeautyInsider.prototype.class = 'MyBeautyInsider';
// Added by sephora-jsx-loader.js
MyBeautyInsider.prototype.getInitialState = function() {
    MyBeautyInsider.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
MyBeautyInsider.prototype.render = wrapComponentRender(MyBeautyInsider.prototype.render);
// Added by sephora-jsx-loader.js
var MyBeautyInsiderClass = React.createClass(MyBeautyInsider.prototype);
// Added by sephora-jsx-loader.js
MyBeautyInsiderClass.prototype.classRef = MyBeautyInsiderClass;
// Added by sephora-jsx-loader.js
Object.assign(MyBeautyInsiderClass, MyBeautyInsider);
// Added by sephora-jsx-loader.js
module.exports = MyBeautyInsiderClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/BeautyInsider/MyBeautyInsider/MyBeautyInsider.jsx