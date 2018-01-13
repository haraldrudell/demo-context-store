import PropTypes from 'prop-types'
import React from 'react'

import Block from 'components/Layout/Block'
import Button from 'components/Button'
import Flexy from 'components/Layout/Flexy'
import Modal from 'components/Modal'
import Text from 'components/Text'
import TextButton from 'components/TextButton'

export default class extends React.Component {
    static propTypes = {
        show: PropTypes.bool,
        close: PropTypes.func.isRequired,
        title: PropTypes.string,
        description: PropTypes.node,
        confirmationButtonText: PropTypes.string,
        cancelButtonText: PropTypes.string,
        confirmAction: PropTypes.func,
        cancelAction: PropTypes.func,
    }

    render() {
        const {
            cancelAction,
            cancelButtonText,
            confirmAction,
            confirmationButtonText,
            close,
            description,
            show,
            title,
        } = this.props
        let cancelButton = null
        if (cancelButtonText) {
            cancelButton = (
                <Block mt={3}>
                    <TextButton onClick={cancelAction}>
                        {cancelButtonText}
                    </TextButton>
                </Block>
            )
        }
        return (
            <Modal show={show} close={close} maxWidth="600px">
                <Block ph={6} pv={2}>
                    <Flexy
                        display="flex"
                        direction="column"
                        alignItems="center"
                    >
                        <Block>
                            <Text align="center" el="p" size={3} weight="bold">
                                {title}
                            </Text>
                        </Block>
                        <Block mt={2} mb={4}>
                            <Text align="center" el="p">
                                {description}
                            </Text>
                        </Block>
                        <Block>
                            <Button
                                color="secondary"
                                size="mdsm"
                                data-tag="confirmButton"
                                onClick={confirmAction}
                            >
                                {confirmationButtonText}
                            </Button>
                        </Block>
                        {cancelButton}
                    </Flexy>
                </Block>
            </Modal>
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/ConfirmationDialog/index.jsx