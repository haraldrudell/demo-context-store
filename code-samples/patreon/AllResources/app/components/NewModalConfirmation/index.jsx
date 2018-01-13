import t from 'prop-types'
import React, { Component } from 'react'

import Button from 'components/Button'
import Block from 'components/Layout/Block'
import Flexy from 'components/Layout/Flexy'
import NewModalWithContent from 'components/NewModalWithContent'

export default class NewModalConfirmation extends Component {
    static propTypes = {
        acceptContent: t.node,
        cancelContent: t.node,
        children: t.node.isRequired,
        closeOnEscape: t.bool,
        isLoading: t.bool,
        isOpen: t.bool,
        onAccept: t.func.isRequired,
        onCancel: t.func.isRequired,
        onRequestClose: t.func,
        overlayClosesModal: t.bool,
        title: t.string,
    }

    static defaultProps = {
        acceptContent: 'OK',
        cancelContent: 'Cancel',
        color: 'highlightSecondary',
        closeOnEscape: true,
        isLoading: false,
        isOpen: false,
        onRequestClose: function() {},
        overlayClosesModal: true,
        title: 'Something went wrong...',
    }

    renderFooter = () => {
        const cancelButton = (
            <Button
                color="lightestGray"
                data-tag="confirmation-modal-cancel-button"
                onClick={this.props.onCancel}
                size="sm"
            >
                {this.props.cancelContent}
            </Button>
        )

        const acceptButton = (
            <Button
                color="blue"
                data-tag="confirmation-modal-accept-button"
                isLoading={this.props.isLoading}
                onClick={this.props.onAccept}
                size="sm"
            >
                {this.props.acceptContent}
            </Button>
        )

        return (
            <Block m={2}>
                <Flexy justifyContent="flex-end">
                    <Block display="inline-block">{cancelButton}</Block>
                    <Block display="inline-block" ml={2}>
                        {acceptButton}
                    </Block>
                </Flexy>
            </Block>
        )
    }

    render() {
        return (
            <NewModalWithContent
                footer={this.renderFooter()}
                header={this.props.title}
                isOpen={this.props.isOpen}
                onRequestClose={this.props.onRequestClose}
                closeOnEscape={this.props.closeOnEscape}
                overlayClosesModal={this.props.overlayClosesModal}
            >
                <Block m={2}>{this.props.children}</Block>
            </NewModalWithContent>
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/NewModalConfirmation/index.jsx