import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'
import NewModal from 'components/NewModal'
import Icon from 'components/Icon'

export default class Lightbox extends Component {
    static propTypes = {
        originalImageSrc: PropTypes.string,
        isOpen: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)
        this.state = {
            isMaxHeightEnabled: false,
        }
    }

    toggleMaxHeight = () => {
        if (this.state.isMaxHeightEnabled) {
            this.disableMaxHeight()
        } else {
            this.enableMaxHeight()
        }
    }

    enableMaxHeight = () => {
        this.setState({ isMaxHeightEnabled: true })
    }

    disableMaxHeight = () => {
        this.setState({ isMaxHeightEnabled: false })
    }

    render() {
        const buttons = [
            <Icon
                type="cancel"
                color="white"
                size="xs"
                onClick={this.props.onClose}
                padding={1.5}
            />,
        ]
        if (this.state.isMaxHeightEnabled) {
            buttons.push(
                <Icon
                    type="expand"
                    color="white"
                    size="xs"
                    onClick={this.disableMaxHeight}
                    padding={1.5}
                />,
            )
        } else {
            buttons.push(
                <Icon
                    type="contract"
                    color="white"
                    size="xs"
                    onClick={this.enableMaxHeight}
                    padding={1.5}
                />,
            )
        }

        return (
            <NewModal
                isOpen={this.props.isOpen}
                onRequestClose={this.props.onClose}
                width="xl"
                backgroundColor="transparent"
                boxShadow={false}
                buttons={buttons}
                ignoreTopOffset
            >
                <LightboxedImage
                    src={this.props.originalImageSrc}
                    maxHeight={this.state.isMaxHeightEnabled}
                    onClick={() => this.toggleMaxHeight()}
                />
            </NewModal>
        )
    }
}

const LightboxedImage = styled.img`
    height: 'auto';
    ${props => (props.maxHeight ? 'max-height: 90vh' : '')};
    cursor: ${props => (props.maxHeight ? 'zoom-in' : 'zoom-out')};
    max-width: 100%;
    margin: 0 auto;
    display: flex;
`



// WEBPACK FOOTER //
// ./app/components/LightboxImageWrapper/Lightbox/index.jsx