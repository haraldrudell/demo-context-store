import t from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Measure from 'react-measure'

import Modal from 'components/NewModalWithContent'
import Confetti from 'components/Effects/Confetti'
import Snow from 'components/Effects/Snow'
import Text from 'components/Text'
import Button from 'components/Button'
import Block from 'components/Layout/Block'

import isCanvasSupported from 'utilities/is-canvas-supported'
import withRenderAsClient from 'libs/with-render-as-client'

import { getIsModalOpen, closeModal as dispatchCloseModal } from '../../core'

import { ConfettiContainer, ModalContentContainer } from './styled-components'

const CONFETTI_Z_INDEX = 500000

@connect(
    createStructuredSelector({
        isModalOpen: getIsModalOpen,
    }),
    {
        closeModal: dispatchCloseModal,
    },
)
@withRenderAsClient
class LaunchCelebrationContainer extends Component {
    handleRequestClose = () => {
        const { closeModal, onCloseModal } = this.props
        closeModal()
        onCloseModal()
    }

    renderConfetti(contentRect) {
        const { snowMode } = this.props
        if (
            contentRect.bounds.width > 0 &&
            contentRect.bounds.height > 0 &&
            isCanvasSupported()
        ) {
            if (snowMode) {
                return (
                    <Snow
                        onClick={this.handleRequestClose}
                        width={contentRect.bounds.width}
                        height={contentRect.bounds.height}
                    />
                )
            } else {
                return (
                    <Confetti
                        onClick={this.handleRequestClose}
                        width={contentRect.bounds.width}
                        height={contentRect.bounds.height}
                    />
                )
            }
        }

        return (
            <Block onClick={this.handleRequestClose} fluidWidth fluidHeight />
        )
    }

    render() {
        const { isModalOpen, renderAsClient } = this.props
        return (
            <Measure bounds client>
                {({ measureRef, contentRect }) => {
                    return (
                        <div
                            ref={measureRef}
                            style={{
                                width: '100%',
                                height: '100%',
                                position: 'fixed',
                                zIndex: CONFETTI_Z_INDEX,
                            }}
                        >
                            <ConfettiContainer isOpen={isModalOpen}>
                                <Modal
                                    isOpen={isModalOpen}
                                    onRequestClose={this.handleRequestClose}
                                >
                                    <ModalContentContainer>
                                        <Block m={2}>
                                            <Text
                                                el="div"
                                                align="center"
                                                size={{ xs: 3, md: 4 }}
                                            >
                                                Congratulations!
                                            </Text>
                                        </Block>
                                        <Block m={2}>
                                            <Text
                                                el="div"
                                                align="center"
                                                size={1}
                                            >
                                                Celebrations are in order. Now,
                                                go forth and create awesome
                                                things.
                                            </Text>
                                        </Block>
                                        <Button
                                            onClick={this.handleRequestClose}
                                            color="primary"
                                        >
                                            Okay!
                                        </Button>
                                    </ModalContentContainer>
                                </Modal>
                                {isModalOpen &&
                                    renderAsClient &&
                                    this.renderConfetti(contentRect)}
                            </ConfettiContainer>
                        </div>
                    )
                }}
            </Measure>
        )
    }
}

LaunchCelebrationContainer.defaultProps = {
    onCloseModal: () => {},
}

LaunchCelebrationContainer.propTypes = {
    isModalOpen: t.bool,
    closeModal: t.func,
    onCloseModal: t.func,
    renderAsClient: t.bool,
    snowMode: t.bool,
}

export default LaunchCelebrationContainer



// WEBPACK FOOTER //
// ./app/modules/LaunchCelebrationModal/containers/LaunchCelebrationContainer/index.jsx