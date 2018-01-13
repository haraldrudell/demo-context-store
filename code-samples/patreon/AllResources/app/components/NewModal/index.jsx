import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'
import { lockScroll, unlockScroll } from 'utilities/lock-scroll'
import { Motion, spring } from 'react-motion'
import Portal from 'react-portal'
import Flexy from 'components/Layout/Flexy'

export default class NewModal extends Component {
    static propTypes = {
        afterClose: PropTypes.func,
        backgroundColor: PropTypes.string,
        boxShadow: PropTypes.bool,
        ignoreTopOffset: PropTypes.bool,
        children: PropTypes.node,
        isOpen: PropTypes.bool,
        onRequestClose: PropTypes.func,
        overlayClosesModal: PropTypes.bool,
        buttons: PropTypes.arrayOf(PropTypes.object),
        closeOnEscape: PropTypes.bool,
        width: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
    }

    constructor() {
        super()
        this.state = {
            portalOpened: false,
            isVisible: false,
        }
    }

    static defaultProps = {
        afterClose: function() {},
        isOpen: false,
        overlayClosesModal: true,
        closeOnEscape: true,
        onRequestClose: function() {},
        width: 'lg',
        backgroundColor: '#fff',
        boxShadow: true,
        ignoreTopOffset: false,
    }

    componentWillMount() {
        // if portal is created opened, no animation is needed
        if (this.props.isOpen) {
            this.setState({
                portalOpened: true,
                isVisible: true,
            })
        }
    }

    componentDidMount() {
        if (this.props.closeOnEscape) {
            window.addEventListener('keydown', this.listenKeyboard, true)
        }
    }

    componentWillReceiveProps(nextProps) {
        // check if we just opened panel
        const hasOpened = !this.props.isOpen && nextProps.isOpen

        if (hasOpened) {
            // open portal and lock the scroll
            this.setState({ portalOpened: true })
            lockScroll()
        }

        // check if we just closed panel
        const hasClosed = this.props.isOpen && !nextProps.isOpen

        if (hasClosed) {
            // launch close animation and unlock scroll
            this.props.onRequestClose()
            this.setState({ isVisible: false })
            unlockScroll()
        }

        // check if we re-opened panel while closing
        const hasReopened =
            hasOpened && !this.state.isVisible && this.state.portalOpened

        if (hasReopened) {
            // re-launch animation
            this.setState({ isVisible: true })
        }
    }

    componentWillUnmount() {
        if (this.props.closeOnEscape) {
            window.removeEventListener('keydown', this.listenKeyboard, true)
        }
        unlockScroll()
    }

    listenKeyboard = event => {
        const escapePressed = event.key === 'Escape' || event.keyCode === 27
        if (escapePressed && this.state.portalOpened) {
            this.props.onRequestClose()
        }
    }

    handlePortalOpen = () => {
        // portal just open, launch animation
        this.setState({ isVisible: true })
    }

    handleRest = () => {
        // if not visible, close portal
        if (!this.state.isVisible) {
            this.props.afterClose()
            this.setState({
                portalOpened: false,
            })
        }
    }

    handleOverlayClick = () => {
        if (this.props.overlayClosesModal) {
            this.props.onRequestClose()
        }
    }

    handleDialogClick = event => {
        event.stopPropagation()
    }

    hasButtons = () => {
        const { buttons } = this.props
        return Boolean(buttons) && buttons.length > 0
    }

    renderButtons = motion => {
        if (!this.hasButtons()) {
            return null
        }
        return (
            <ButtonsContainer opacity={motion.opacity}>
                <Flexy direction={{ xs: 'row', md: 'column' }}>
                    {this.props.buttons}
                </Flexy>
            </ButtonsContainer>
        )
    }

    renderFakeButtons = motion => {
        if (!this.hasButtons()) {
            return null
        }
        return (
            <ButtonsContainer opacity={motion.opacity} isFake>
                <Flexy direction={{ xs: 'row', md: 'column' }}>
                    <FakeButton />
                </Flexy>
            </ButtonsContainer>
        )
    }

    renderBody = motion => {
        const {
            children,
            backgroundColor,
            boxShadow,
            ignoreTopOffset,
        } = this.props

        const widths = {
            xl: 1000,
            lg: 700,
            md: 500,
            sm: 300,
        }

        const style = {
            // overlay has pointer, set to default otherwise dialog has pointer too
            cursor: 'default',
            transform: `scale(${motion.scale})`,
            opacity: motion.opacity,
            maxWidth: widths[this.props.width],
        }

        return this.state.portalOpened ? (
            <BodyContainer>
                <ScrollContainer
                    hasButtons={this.hasButtons()}
                    ignoreTopOffset={ignoreTopOffset}
                >
                    <Body
                        style={style}
                        backgroundColor={backgroundColor}
                        boxShadow={boxShadow}
                        onClick={this.handleDialogClick}
                        className={'reactWrapper'}
                    >
                        {children}
                    </Body>
                </ScrollContainer>
            </BodyContainer>
        ) : null
    }

    renderOverlay = motion => {
        const { overlayClosesModal } = this.props

        return this.state.portalOpened ? (
            <Overlay
                overlayClosesModal={overlayClosesModal}
                opacity={motion.opacity}
                onClick={this.handleOverlayClick}
            />
        ) : null
    }

    renderContent = motion => {
        return (
            <Content
                isVisible={this.state.isVisible}
                hasButtons={this.hasButtons()}
            >
                {this.renderOverlay(motion)}
                <Flexy
                    direction={{ xs: 'column', md: 'row' }}
                    fluidWidth
                    fluidHeight
                >
                    {this.renderFakeButtons(motion)}
                    {this.renderBody(motion)}
                    {this.renderButtons(motion)}
                </Flexy>
            </Content>
        )
    }

    render() {
        const options = {
            stiffness: 180,
            damping: 19,
        }
        const motionStyle = {
            opacity: spring(this.state.isVisible ? 1 : 0, options),
            scale: spring(this.state.isVisible ? 1 : 0.3, options),
        }

        return (
            <Portal
                isOpened={this.state.portalOpened}
                onOpen={this.handlePortalOpen}
            >
                <Motion onRest={this.handleRest} style={motionStyle}>
                    {motion => this.renderContent(motion)}
                </Motion>
            </Portal>
        )
    }
}

const Body = styled.div`
    position: relative;
    outline: 0;
    width: 100%;
    margin-bottom: 1em;
    transform: translate3d(0, 0, 0);
    background: ${props => props.backgroundColor};
    display: inline-block;
    vertical-align: middle;
    box-sizing: border-box;
    text-size-adjust: 100%;

    border-radius: ${props => props.theme.strokeWidths.default};
    ${props =>
        props.boxShadow ? 'box-shadow: 0 1px 3px rgba(0, 0, 0, .2)' : ''};

    @media only screen and (max-width: 641px) {
        margin: 0;
        border-radius: 0;
        box-shadow: none;
        margin-top: 0;
    }

    @media only screen and (min-width: 641px) {
        max-width: 700px;
    }
`

const Overlay = styled.div`
    ${props => `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props.theme.colors.translucentOverlay};
    margin-top: -15%;

    cursor: ${props.overlayClosesModal ? 'pointer' : 'default'};
    opacity: ${props.opacity};
`};
`

const Content = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100vh;
    width: 100vw;
    overflow: auto;
    z-index: 99999;
    box-sizing: border-box;

    @media only screen and (max-width: 641px) {
        justify-content: flex-start;
    }

    pointer-events: ${props => (props.isVisible ? 'auto' : 'none')};
`

const BodyContainer = styled.div`
    flex: 1 1 auto;
    overflow: auto;
    order: 5;
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    @media (min-width: ${props =>
            props.theme.responsive.getBreakpoint('md')}rem) {
        height: 100vh;
        width: auto;
    }
`

const ScrollContainer = styled.div`
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    ${props =>
        props.hasButtons ? '' : `padding: ${props.theme.units.getValue(2)}`};
    box-sizing: border-box;
    max-width: 100%;

    @media (min-width: ${props =>
            props.theme.responsive.getBreakpoint('md')}rem) {
        padding: ${props => props.theme.units.getValue(4)}
            ${props => props.theme.units.getValue(4)}
            ${props => props.theme.units.getValue(2)}
            ${props => props.theme.units.getValue(4)};
    }

    @media only screen and (min-width: 641px) {
        ${props => (props.ignoreTopOffset ? '' : 'margin-top: -10vh')};
    }
`

const ButtonsContainer = styled.div`
    opacity: ${props => props.opacity};
    position: relative;
    z-index: 1000;
    flex: 0 1 auto;
    ${props => (props.isFake ? 'display: none' : '')};
    margin: ${props => props.theme.units.getValue(1)};
    order: 1;

    @media (min-width: ${props =>
            props.theme.responsive.getBreakpoint('md')}rem) {
        display: block;
        order: ${props => (props.isFake ? 0 : 10)};
    }
`

const FakeButton = styled.div`
    width: ${props => props.theme.units.getValue(4)};
    height: ${props => props.theme.units.getValue(4)};
`



// WEBPACK FOOTER //
// ./app/components/NewModal/index.jsx