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
    Sephora.Util.InflatorComps.Comps['BiInfoCard'] = function BiInfoCard(){
        return BiInfoCardClass;
    }
}
const { space } = require('style');
const { Box, Grid, Image, Text } = require('components/display');
const Link = require('components/Link/Link');
const Divider = require('components/Divider/Divider');
const userUtils = require('utils/User');
const BI_TYPES = userUtils.types;

const BiInfoCard = function () {
    this.state = {
        realTimeVIBMessages: null,
        beautyBankPoints: 0
    };
};

BiInfoCard.prototype.render = function () {
    const {
        user,
        isShowViewActivity,
        shadow,
        children
    } = this.props;

    let isMobile = Sephora.isMobile();

    let vibSegment = user.beautyInsiderAccount.vibSegment;
    let statusDisplay = userUtils.displayBiStatus(vibSegment);

    const logoProps = {
        src: `/img/ufe/bi/logo-${statusDisplay.toLowerCase()}.svg`,
        height: 28,
        display: 'block',
        alt: statusDisplay
    };

    return (
        <Box
            marginBottom={isMobile ? space[2] : space[5]}
            rounded={true}
            boxShadow={`${shadow.offset} ${shadow.blur} rgba(0,0,0,${shadow.opacity})`}
            backgroundColor='white'
            lineHeight={2}>
            <Box
                paddingX={isMobile ? space[4] : space[5]}
                paddingY={space[4]}>
                <Grid
                    alignItems='center'
                    gutter={isMobile ? space[4] : space[6]}>
                    <Grid.Cell
                        width='fit'>
                        <Box
                            href='/rewards'>
                            {(() => {
                                switch (vibSegment) {
                                    case BI_TYPES.ROUGE:
                                        return <Image {...logoProps} width={121} />;
                                    case BI_TYPES.VIB:
                                        return <Image {...logoProps} width={56} />;
                                    default:
                                        return <Image {...logoProps} width={131} />;
                                }
                            })()}
                        </Box>
                    </Grid.Cell>
                    <Grid.Cell
                        width='fill'
                        borderRight={1}
                        borderColor='moonGray'>
                        <Box
                            fontSize='h3'
                            fontWeight={700}
                            marginBottom={!isMobile ? space[1] : null}>
                            Hello, { user.firstName }
                        </Box>
                        <Text
                            marginRight={space[2]}>
                            Status: {statusDisplay}
                        </Text>
                        { isShowViewActivity &&
                            <Link
                                primary={true}
                                href='/profile/BeautyInsider'>
                                View activity
                            </Link>
                        }
                    </Grid.Cell>
                    <Grid.Cell
                        width='fit'>
                        <Box
                            lineHeight={1}
                            marginLeft={space[2]}>
                            <Box
                                fontWeight={700}
                                fontSize={isMobile ? 'h3' : 'h1'}>
                                {this.state.beautyBankPoints}
                            </Box>
                            <Box
                                fontSize={isMobile ? 'h5' : 'h4'}>
                                points
                            </Box>
                        </Box>
                    </Grid.Cell>
                </Grid>
            </Box>
            {this.state.realTimeVIBMessages &&
                <div>
                    <Divider
                        color='moonGray' />
                    <Box
                        fontWeight={700}
                        textAlign='center'
                        padding={space[4]}>
                        {this.state.realTimeVIBMessages.map((message) => {
                                return <div
                                    dangerouslySetInnerHTML={{
                                        __html: message
                                    }}
                                />;
                            })
                        }
                    </Box>
                </div>
            }
            { children }
        </Box>
    );
};


// Added by sephora-jsx-loader.js
BiInfoCard.prototype.path = 'BiTopBar/BiInfoCard';
// Added by sephora-jsx-loader.js
Object.assign(BiInfoCard.prototype, require('./BiInfoCard.c.js'));
var originalDidMount = BiInfoCard.prototype.componentDidMount;
BiInfoCard.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BiInfoCard');
if (originalDidMount) originalDidMount.apply(this);
if (BiInfoCard.prototype.ctrlr) BiInfoCard.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BiInfoCard');
// Added by sephora-jsx-loader.js
BiInfoCard.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BiInfoCard.prototype.class = 'BiInfoCard';
// Added by sephora-jsx-loader.js
BiInfoCard.prototype.getInitialState = function() {
    BiInfoCard.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BiInfoCard.prototype.render = wrapComponentRender(BiInfoCard.prototype.render);
// Added by sephora-jsx-loader.js
var BiInfoCardClass = React.createClass(BiInfoCard.prototype);
// Added by sephora-jsx-loader.js
BiInfoCardClass.prototype.classRef = BiInfoCardClass;
// Added by sephora-jsx-loader.js
Object.assign(BiInfoCardClass, BiInfoCard);
// Added by sephora-jsx-loader.js
module.exports = BiInfoCardClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BiTopBar/BiInfoCard/BiInfoCard.jsx