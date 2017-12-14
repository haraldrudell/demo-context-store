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
    Sephora.Util.InflatorComps.Comps['InfoModal'] = function InfoModal(){
        return InfoModalClass;
    }
}
const { modal } = require('style');
const { Box, Grid, Text } = require('components/display');
const Modal = require('components/Modal/Modal');
const ButtonOutline = require('components/Button/ButtonOutline');
const ButtonPrimary = require('components/Button/ButtonPrimary');

const InfoModal = function () {
    this.state = {
        isOpen: false
    };
};

InfoModal.prototype.render = function () {
    let getMessages = () => {
        let messages = [];
        this.props.message.forEach((value) => {
            messages.push(value);
            messages.push(<br />);
        });

        return messages;
    };

    const styles = {
        message: {
            '& p': {
                marginTop: 0,
                marginBottom: '1em'
            },
            /* No bottom margin on last paragraph */
            '& p:last-child': {
                marginBottom: 0
            }
        },
        button: Sephora.isDesktop() ? {
            minWidth: 138
        } : {}
    };

    let buttonText = this.props.buttonText || 'Close';
    let cancelText = this.props.cancelText || 'Cancel';

    return (

        <Modal
            open={this.props.isOpen}
            onDismiss={this.requestClose}
            showDismiss={this.props.showCancelButton}>
            {this.props.title &&
                <Modal.Header>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
            }
            <Modal.Body>
                {this.props.isHtml ?
                    <Box
                        dangerouslySetInnerHTML={{
                            __html: this.props.message
                        }}
                        _css={styles.message} />
                :
                    <Text is='p'>
                        {Array.isArray(this.props.message) ?
                            getMessages() : this.props.message}
                    </Text>
                }
            </Modal.Body>
            <Modal.Footer>
                <Grid
                    gutter={modal.ACTIONS_GUTTER}
                    _css={Sephora.isDesktop() ? {
                        width: modal.ACTIONS_WIDTH,
                        marginLeft: 'auto'
                    } : {}}>
                    <Grid.Cell width={1 / 2}>
                        {this.props.showCancelButton &&
                            <ButtonOutline
                                block={true}
                                onClick={this.requestClose}>
                                {cancelText}
                            </ButtonOutline>
                        }
                    </Grid.Cell>
                    <Grid.Cell width={1 / 2}>
                        <ButtonPrimary
                            block={true}
                            onClick={this.handleClick}>
                            {buttonText}
                        </ButtonPrimary>
                    </Grid.Cell>
                </Grid>
            </Modal.Footer>
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
InfoModal.prototype.path = 'GlobalModals/InfoModal';
// Added by sephora-jsx-loader.js
Object.assign(InfoModal.prototype, require('./InfoModal.c.js'));
var originalDidMount = InfoModal.prototype.componentDidMount;
InfoModal.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: InfoModal');
if (originalDidMount) originalDidMount.apply(this);
if (InfoModal.prototype.ctrlr) InfoModal.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: InfoModal');
// Added by sephora-jsx-loader.js
InfoModal.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
InfoModal.prototype.class = 'InfoModal';
// Added by sephora-jsx-loader.js
InfoModal.prototype.getInitialState = function() {
    InfoModal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
InfoModal.prototype.render = wrapComponentRender(InfoModal.prototype.render);
// Added by sephora-jsx-loader.js
var InfoModalClass = React.createClass(InfoModal.prototype);
// Added by sephora-jsx-loader.js
InfoModalClass.prototype.classRef = InfoModalClass;
// Added by sephora-jsx-loader.js
Object.assign(InfoModalClass, InfoModal);
// Added by sephora-jsx-loader.js
module.exports = InfoModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/InfoModal/InfoModal.jsx