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
    Sephora.Util.InflatorComps.Comps['BiFullSection'] = function BiFullSection(){
        return BiFullSectionClass;
    }
}
const { space } = require('style');
const { Box, Grid } = require('components/display');
const BiInfoCard = require('../BiInfoCard/BiInfoCard');
const Chevron = require('components/Chevron/Chevron');
const ButtonWhite = require('components/Button/ButtonWhite');
const BiBarcode = require('components/BiBarcode/BiBarcode');

const BiFullSection = function () {
    this.state = {
        isShowBarcode: false
    };
};

BiFullSection.prototype.render = function () {
    const {
        user,
        isShowViewActivity,
        shadow
    } = this.props;

    const buttonProps = {
        block: true,
        size: Sephora.isDesktop() ? 'lg' : null,
        shadowOffset: shadow.offset,
        shadowBlur: shadow.blur,
        shadowOpacity: shadow.opacity
    };

    return (
        <div>
            <BiInfoCard
                user={user}
                isShowViewActivity={isShowViewActivity}
                shadow={shadow}>
                { Sephora.isMobile() &&
                    <Box
                        marginX={space[2]}
                        paddingBottom={space[2]}>
                        <Box
                            textAlign='center'
                            rounded={true}
                            backgroundColor='lightGray'>
                            <Box
                                overflow='hidden'
                                transition='height 300ms'
                                style={{
                                    height: this.state.isShowBarcode ? 98 : 0
                                }}>
                                <Box
                                    padding={space[2]}>
                                    <BiBarcode
                                        profileId={user.profileId} />
                                </Box>
                            </Box>
                            <Box
                                width='100%'
                                padding={space[2]}
                                onClick={() => {
                                    this.setState({
                                        isShowBarcode: !this.state.isShowBarcode
                                    });
                                }}>
                                { this.state.isShowBarcode ? 'Hide' : 'Show' } card
                                <Chevron
                                    marginLeft='.5em'
                                    direction={ this.state.isShowBarcode ? 'up' : 'down' } />
                            </Box>
                        </Box>
                    </Box>
                }
            </BiInfoCard>
            <Grid
                fit={true}
                gutter={Sephora.isMobile() ? space[2] : space[4]}>
                <Grid.Cell>
                    <ButtonWhite
                        href='/about-beauty-insider'
                        {...buttonProps}>
                        Explore Benefits
                    </ButtonWhite>
                </Grid.Cell>
                <Grid.Cell>
                    <ButtonWhite
                        href='/rewards'
                        {...buttonProps}>
                        Rewards Bazaar
                    </ButtonWhite>
                </Grid.Cell>
            </Grid>
        </div>
    );
};


// Added by sephora-jsx-loader.js
BiFullSection.prototype.path = 'BiTopBar/BiFullSection';
// Added by sephora-jsx-loader.js
Object.assign(BiFullSection.prototype, require('./BiFullSection.c.js'));
var originalDidMount = BiFullSection.prototype.componentDidMount;
BiFullSection.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BiFullSection');
if (originalDidMount) originalDidMount.apply(this);
if (BiFullSection.prototype.ctrlr) BiFullSection.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BiFullSection');
// Added by sephora-jsx-loader.js
BiFullSection.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BiFullSection.prototype.class = 'BiFullSection';
// Added by sephora-jsx-loader.js
BiFullSection.prototype.getInitialState = function() {
    BiFullSection.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BiFullSection.prototype.render = wrapComponentRender(BiFullSection.prototype.render);
// Added by sephora-jsx-loader.js
var BiFullSectionClass = React.createClass(BiFullSection.prototype);
// Added by sephora-jsx-loader.js
BiFullSectionClass.prototype.classRef = BiFullSectionClass;
// Added by sephora-jsx-loader.js
Object.assign(BiFullSectionClass, BiFullSection);
// Added by sephora-jsx-loader.js
module.exports = BiFullSectionClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BiTopBar/BiFullSection/BiFullSection.jsx