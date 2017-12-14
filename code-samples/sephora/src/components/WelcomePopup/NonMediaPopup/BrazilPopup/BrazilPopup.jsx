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
    Sephora.Util.InflatorComps.Comps['BrazilPopup'] = function BrazilPopup(){
        return BrazilPopupClass;
    }
}
const { space } = require('style');
const { Box, Flex, Grid, Text } = require('components/display');
const Modal = require('components/Modal/Modal');
const Divider = require('components/Divider/Divider');
const ButtonRed = require('components/Button/ButtonRed');
const ButtonOutline = require('components/Button/ButtonOutline');

const BrazilPopup = function () { };

BrazilPopup.prototype.render = function () {
    return (
        <Modal
            open={this.props.isOpen}
            onDismiss={this.props.onDismiss}
            width={Sephora.isDesktop() ? 756 : null}>
            {Sephora.isMobile() &&
                <Modal.Header>
                    <Modal.Title>Welcome Sephora.com.br</Modal.Title>
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
                                href='https://sephora.com.br'
                                width={132}>
                                Brazil
                            </ButtonRed>
                        </Flex>
                    </div>
                    :
                    <Box textAlign='center'>
                        <Text
                            is='h1'
                            textTransform='uppercase'
                            letterSpacing={1}
                            fontSize='h1'
                            lineHeight={2}
                            marginTop={space[5]}
                            marginBottom={space[3]}>
                            Bem vindo À
                            <br />
                            <Text
                                fontWeight={700}
                                fontSize={46}>
                                Sephora.com.br
                            </Text>
                        </Text>
                        <Text
                            is='h2'
                            textTransform='uppercase'
                            fontSize='h2' lineHeight={2}
                            letterSpacing={1}
                            fontWeight={300}
                            marginBottom={space[3]}>
                            Explore uma infinita variedade de produtos de
                            beleza das melhores é mais desejadas marcas do mundo.
                        </Text>
                        <Grid
                            textAlign='left'
                            width={480}
                            marginX='auto'>
                            <Grid.Cell
                                width={1 / 2}>
                                Frete grátis em todas as compras
                                <br />
                                Marcas exclusivas
                            </Grid.Cell>
                            <Grid.Cell
                                width={1 / 2}>
                                Ganhe brindes e amostras
                                <br />
                                Conheça nossas lojas
                            </Grid.Cell>
                        </Grid>
                        <Box marginY={space[5]}>
                            <ButtonRed
                                href='https://sephora.com.br'>
                                Confira
                            </ButtonRed>
                        </Box>
                        <Text
                            is='p'
                            fontSize='h5'
                            color='gray'>
                            Não deseja receber no Brasil?
                            {' '}
                            <Text
                                is='a'
                                textDecoration='underline'
                                hoverColor='black'
                                href='https://sephora.com'>
                                Clique aqui
                            </Text>
                            {' '}
                            e vá para Sephora.com.
                        </Text>

                        <Divider marginY={space[5]} />

                        <Text
                            is='h1'
                            textTransform='uppercase'
                            fontSize='h1'
                            lineHeight={2}
                            letterSpacing={1}
                            marginTop={space[5]}
                            marginBottom={space[3]}>
                            Welcome to
                            <br />
                            <Text
                                fontWeight={700}
                                fontSize={46}>
                                Sephora.com.br
                            </Text>
                        </Text>
                        <Text
                            is='h2'
                            textTransform='uppercase'
                            fontSize='h2'
                            lineHeight={2}
                            letterSpacing={1}
                            fontWeight={300}
                            marginBottom={space[3]}>
                            Explore an endless variety of beauty products of
                             the best and most desired brands in the world
                        </Text>
                        <Grid
                            textAlign='left'
                            width={480}
                            marginX='auto'>
                            <Grid.Cell
                                width={1 / 2}>
                                Free shipping on all purchases
                                <br />
                                Exclusive brands
                            </Grid.Cell>
                            <Grid.Cell
                                width={1 / 2}>
                                Get freebies and samples
                                <br />
                                Discover our stores
                            </Grid.Cell>
                        </Grid>
                        <Box marginY={space[5]}>
                            <ButtonRed
                                href='https://sephora.com.br'>
                                Shop Now
                            </ButtonRed>
                        </Box>
                        <Text
                            is='p'
                            color='gray'
                            fontSize='h5'>
                            Not shipping to Brazil?
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
                    </Box>
                }
            </Modal.Body>
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
BrazilPopup.prototype.path = 'WelcomePopup/NonMediaPopup/BrazilPopup';
// Added by sephora-jsx-loader.js
BrazilPopup.prototype.class = 'BrazilPopup';
// Added by sephora-jsx-loader.js
BrazilPopup.prototype.getInitialState = function() {
    BrazilPopup.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BrazilPopup.prototype.render = wrapComponentRender(BrazilPopup.prototype.render);
// Added by sephora-jsx-loader.js
var BrazilPopupClass = React.createClass(BrazilPopup.prototype);
// Added by sephora-jsx-loader.js
BrazilPopupClass.prototype.classRef = BrazilPopupClass;
// Added by sephora-jsx-loader.js
Object.assign(BrazilPopupClass, BrazilPopup);
// Added by sephora-jsx-loader.js
module.exports = BrazilPopupClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/WelcomePopup/NonMediaPopup/BrazilPopup/BrazilPopup.jsx