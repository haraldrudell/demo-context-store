/* eslint-disable react/no-multi-comp */
/* modified version of react-modal-wrapper from https://github.com/1stdibs/react-modal-wrapper, supports React 0.13 */

import PropTypes from 'prop-types'

import React from 'react'
import ReactDOM from 'react-dom'
import ReactWrapper from 'components/ReactWrapper'
import Portal from 'react-portal'

import isNodeInRoot from 'utilities/is-node-in-root'

import { FlexModalContent, FlexModalWrapper } from './styled-components'

class ModalWrapper extends React.Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        className: PropTypes.string,
        maxWidth: PropTypes.string,
        useOverlay: PropTypes.bool,
        overlayStyle: PropTypes.object,
        overlayClassName: PropTypes.string,
        closeOnOutsideClick: PropTypes.bool,
        overflowHidden: PropTypes.bool,
        // passed by Portal
        closePortal: PropTypes.func,
    }

    static defaultProps = {
        useOverlay: true,
        overflowHidden: true,
    }

    componentDidMount() {
        //Setting overflow to hidden prevents page scrolling in background
        document.querySelector('body').style.overflow = 'hidden'
        if (this.props.closeOnOutsideClick) {
            ReactDOM.findDOMNode(this.wrapper).addEventListener(
                'mousedown',
                this.handleMouseClickOutside,
            )
        }
    }

    componentWillUnmount() {
        document.querySelector('body').style.overflow = 'inherit'
        ReactDOM.findDOMNode(this.wrapper).removeEventListener(
            'mousedown',
            this.handleMouseClickOutside,
        )
    }

    handleMouseClickOutside = e => {
        if (isNodeInRoot(e.target, ReactDOM.findDOMNode(this.wrapper))) {
            return
        }
        e.stopPropagation()
        this.props.closePortal()
    }

    render() {
        const {
            className,
            maxWidth,
            overlayClassName,
            overlayStyle,
            useOverlay,
            overflowHidden,
        } = this.props

        const inlineStyles = {}
        if (maxWidth) {
            inlineStyles.maxWidth = maxWidth
        }
        if (overflowHidden) {
            inlineStyles.overflowY = 'auto'
        }
        return (
            <FlexModalWrapper
                innerRef={ref => (this.wrapper = ref)}
                useOverlay={useOverlay}
                className={useOverlay ? overlayClassName : undefined}
                style={useOverlay ? overlayStyle : undefined}
            >
                <FlexModalContent
                    className={className}
                    style={inlineStyles}
                    innerRef={ref => (this.content = ref)}
                >
                    {this.props.children}
                </FlexModalContent>
            </FlexModalWrapper>
        )
    }
}

export default class extends React.Component {
    static displayName = 'FlexModalWrapper'

    static propTypes = {
        children: PropTypes.node.isRequired,
        className: PropTypes.string,
        maxWidth: PropTypes.string,
        useOverlay: PropTypes.bool,
        overlayStyle: PropTypes.object,
        overlayClassName: PropTypes.string,

        // Portal props
        isOpened: PropTypes.bool,
        openByClickOn: PropTypes.element,
        closeOnEsc: PropTypes.bool,
        closeOnOutsideClick: PropTypes.bool,
        onClose: PropTypes.func,
        beforeClose: PropTypes.func,
    }

    render() {
        const { children, ...other } = this.props
        const {
            className,
            closeOnOutsideClick,
            maxWidth,
            overlayStyle,
            overlayClassName,
            useOverlay,
            overflowHidden,
            ...portalOptions
        } = other
        return (
            <Portal {...portalOptions}>
                <ModalWrapper
                    {...{
                        className,
                        closeOnOutsideClick,
                        maxWidth,
                        overlayStyle,
                        overlayClassName,
                        useOverlay,
                        overflowHidden,
                    }}
                >
                    <ReactWrapper>
                        {children}
                    </ReactWrapper>
                </ModalWrapper>
            </Portal>
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/FlexModalWrapper/index.jsx