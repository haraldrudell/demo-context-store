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
    Sephora.Util.InflatorComps.Comps['CanadaPopup'] = function CanadaPopup(){
        return CanadaPopupClass;
    }
}
const { space } = require('style');
const { Box, Flex, Grid, Text } = require('components/display');
const Modal = require('components/Modal/Modal');
const Divider = require('components/Divider/Divider');
const ButtonRed = require('components/Button/ButtonRed');
const ButtonOutline = require('components/Button/ButtonOutline');

const CanadaPopup = function () { };

CanadaPopup.prototype.render = function () {
    return (
        <Modal
            open={this.props.isOpen}
            onDismiss={this.props.onDismiss}
            width={Sephora.isDesktop() ? 756 : null}>
            {Sephora.isMobile() &&
                <Modal.Header>
                    <Modal.Title>Welcome Sephora.ca</Modal.Title>
                </Modal.Header>
            }
            <Modal.Body>
                {Sephora.isMobile() ?
                    <div>
                        <Text
                            is='p'
                            marginBottom={space[3]}>
                            Select shopping experience
                        </Text>
                        <Flex
                            justifyContent='space-between'>
                            <ButtonOutline
                                block
                                onClick={this.props.onDismiss}
                                width={132}>
                                United States
                            </ButtonOutline>
                            <ButtonRed
                                block
                                href='https://sephora.ca'
                                width={132}>
                                Canada
                            </ButtonRed>
                        </Flex>
                    </div>
                    :
                    <Box textAlign='center'>
                        <Text
                            is='h1'
                            textTransform='uppercase'
                            fontSize='h1'
                            letterSpacing={1}
                            marginTop={space[5]}
                            marginBottom={space[3]}>
                            Welcome to
                            <br />
                            <img
                                src='/img/ufe/hd-sephora-ca.png'
                                width={378}
                                height={40}
                                alt='Sephora.CA' />
                        </Text>
                        <Text
                            is='h2'
                            textTransform='uppercase'
                            fontSize='h2'
                            letterSpacing={1}
                            fontWeight={300}
                            marginBottom={space[3]}>
                            It’s never been easier to shop in Canada
                        </Text>
                        <Grid
                            textAlign='left'
                            marginLeft={space[7]}>
                            <Grid.Cell
                                width={1 / 2}>
                                Free 2-4 day shipping on orders over C$50
                                <br />
                                C$7.95 for standard shipping
                            </Grid.Cell>
                            <Grid.Cell
                                width={1 / 2}>
                                Exclusive offers
                                <br />
                                Check in-store stock at your local store
                            </Grid.Cell>
                        </Grid>
                        <Box marginY={space[5]}>
                            <ButtonRed
                                href='https://sephora.ca'>
                                Shop Now
                            </ButtonRed>
                        </Box>
                        <Text
                            is='p'
                            fontSize='h5'
                            color='gray'>
                            Not shipping to Canada?
                            {' '}
                            <Text
                                is='a'
                                textDecoration='underline'
                                hoverColor='black'
                                href='https://sephora.com'>
                                Click here
                            </Text>
                            {' '}
                            to go to Sephora.com.
                        </Text>

                        <Divider marginY={space[5]} />

                        <Text
                            is='h1'
                            textTransform='uppercase'
                            fontSize='h1'
                            letterSpacing={1}
                            marginTop={space[5]}
                            marginBottom={space[3]}>
                            Bienvenue � 
                            <br />
                            <img
                                src='/img/ufe/hd-sephora-ca.png'
                                width={378}
                                height={40}
                                alt='Sephora.CA' />
                        </Text>
                        <Text
                            is='h2'
                            textTransform='uppercase'
                            fontSize='h2'
                            letterSpacing={1}
                            fontWeight={300}
                            marginBottom={space[3]}>
                            Maintenant si facile de magasiner au Canada
                        </Text>
                        <Grid
                            textAlign='left'
                            marginLeft={space[7]}>
                            <Grid.Cell
                                width={1 / 2}
                                paddingRight={space[5]}>
                                Expédition gratuite entre 2 et 4 jours
                                pour toutes les commandes de plus de 50 $ C
                                <br />
                                Frais de livraison standard de 7,95 $ C
                            </Grid.Cell>
                            <Grid.Cell
                                width={1 / 2}>
                                Promotions spéciales
                                <br />
                                Vérifiez les stocks dans votre magasin local
                            </Grid.Cell>
                        </Grid>
                        <Box marginY={space[5]}>
                            <ButtonRed
                                href='https://sephora.ca'>
                                Magasinez Maintenant
                            </ButtonRed>
                        </Box>
                        <Text
                            is='p'
                            fontSize='h5'
                            color='gray'>
                            Pas de livraison au Canada?
                            {' '}
                            <Text
                                is='a'
                                textDecoration='underline'
                                hoverColor='black'
                                href='https://sephora.com'>
                                Cliquez ici
                            </Text>.
                        </Text>
                    </Box>
                }
            </Modal.Body>
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
CanadaPopup.prototype.path = 'WelcomePopup/NonMediaPopup/CanadaPopup';
// Added by sephora-jsx-loader.js
CanadaPopup.prototype.class = 'CanadaPopup';
// Added by sephora-jsx-loader.js
CanadaPopup.prototype.getInitialState = function() {
    CanadaPopup.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
CanadaPopup.prototype.render = wrapComponentRender(CanadaPopup.prototype.render);
// Added by sephora-jsx-loader.js
var CanadaPopupClass = React.createClass(CanadaPopup.prototype);
// Added by sephora-jsx-loader.js
CanadaPopupClass.prototype.classRef = CanadaPopupClass;
// Added by sephora-jsx-loader.js
Object.assign(CanadaPopupClass, CanadaPopup);
// Added by sephora-jsx-loader.js
module.exports = CanadaPopupClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/WelcomePopup/NonMediaPopup/CanadaPopup/CanadaPopup.jsx