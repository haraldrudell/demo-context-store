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
    Sephora.Util.InflatorComps.Comps['AllStoreServices'] = function AllStoreServices(){
        return AllStoreServicesClass;
    }
}
/* eslint-disable max-len */
const { space } = require('style');
const { Text, Box } = require('components/display');
const Link = require('components/Link/Link');
const Service = require('./Service/Service');
const PleaseSignInBlock = require('components/RichProfile/MyAccount/PleaseSignIn');
const Container = require('components/Container/Container');
const ButtonOutline = require('components/Button/ButtonOutline');
const EmptyService = require('components/RichProfile/StoreServices/EmptyService/EmptyService');
const dmgUtil = require('utils/dmg');

const AllStoreServices = function () {
    this.state = {
        currentPage: 1,
        limit: dmgUtil.PAGE_SKUS_LIMIT
    };
};

AllStoreServices.prototype.render = function () {
    let isMobile = Sephora.isMobile();

    const pageTitle = (
        <Text
            is='h2'
            fontSize={isMobile ? 'h1' : 'h0'}
            textAlign={!isMobile ? 'center' : null}
            lineHeight={1}
            serif={true}>
            In-store Services
        </Text>
    );

    return (
        <div>
            {!Sephora.isRootRender && this.isUserReady() &&
                <Box
                    paddingY={isMobile ? space[4] : space[6]}>
                    <Container>
                        <Box
                            position='relative'>
                            <Link
                                href='/profile/Lists'
                                padding={space[2]}
                                margin={-space[2]}
                                arrowDirection='left'
                                arrowPosition='before'
                                _css={isMobile ? {
                                    marginBottom: space[1]
                                } : {
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0
                                }}>
                                Back to Lists
                            </Link>
                            {pageTitle}
                        </Box>
                    </Container>

                    {this.isUserAtleastRecognized() ||
                        <Container textAlign='center'>
                            <PleaseSignInBlock />
                        </Container>
                    }

                    {this.isUserAtleastRecognized() &&
                        <div>
                            {this.state.services &&
                                <div>
                                    {this.state.services.map(
                                        service => {
                                            return (
                                                <Service service={service} />
                                            );
                                        }

                                    )}
                                    {this.state.shouldShowMore &&
                                        <ButtonOutline
                                            block={true}
                                            size='lg'
                                            marginTop={space[6]}
                                            maxWidth='24em'
                                            marginX='auto'
                                            onClick={e => this.showMoreServices(e)}>
                                            Show More
                                        </ButtonOutline>
                                    }
                                </div>
                            }
                            {this.state.isEmptyService &&
                                <Container
                                    textAlign={!isMobile ? 'center' : null}>
                                    <EmptyService />
                                </Container>
                            }
                        </div>
                    }
                </Box>
            }

        </div>
    );
};


// Added by sephora-jsx-loader.js
AllStoreServices.prototype.path = 'RichProfile/StoreServices';
// Added by sephora-jsx-loader.js
Object.assign(AllStoreServices.prototype, require('./AllStoreServices.c.js'));
var originalDidMount = AllStoreServices.prototype.componentDidMount;
AllStoreServices.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: AllStoreServices');
if (originalDidMount) originalDidMount.apply(this);
if (AllStoreServices.prototype.ctrlr) AllStoreServices.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: AllStoreServices');
// Added by sephora-jsx-loader.js
AllStoreServices.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
AllStoreServices.prototype.class = 'AllStoreServices';
// Added by sephora-jsx-loader.js
AllStoreServices.prototype.getInitialState = function() {
    AllStoreServices.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
AllStoreServices.prototype.render = wrapComponentRender(AllStoreServices.prototype.render);
// Added by sephora-jsx-loader.js
var AllStoreServicesClass = React.createClass(AllStoreServices.prototype);
// Added by sephora-jsx-loader.js
AllStoreServicesClass.prototype.classRef = AllStoreServicesClass;
// Added by sephora-jsx-loader.js
Object.assign(AllStoreServicesClass, AllStoreServices);
// Added by sephora-jsx-loader.js
module.exports = AllStoreServicesClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/StoreServices/AllStoreServices.jsx