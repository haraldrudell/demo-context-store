import t from 'prop-types'
import React from 'react'
import ConfirmationDialog from 'components/ConfirmationDialog'

class SafeActionButton extends React.Component {
    static propTypes = {
        dialogProps: t.shape({
            show: t.bool,
            title: t.string,
            description: t.node,
            confirmationButtonText: t.string,
            cancelButtonText: t.string,
            confirmAction: t.func,
        }).isRequired,
        children: t.node,
    }

    static displayName = 'SafeActionButton'

    state = {
        isOpen: false,
    }

    onButtonClick = () => {
        this.setState({ isOpen: true })
    }

    confirmAction = e => {
        this.setState({ isOpen: false })
        this.props.dialogProps.confirmAction()
    }

    close = callback => {
        this.setState({ isOpen: false })
        this.safeExecute(callback)
    }

    safeExecute = func => {
        if (func) {
            func()
        }
    }

    render() {
        let dialogProps = this.props.dialogProps
        const buttonChild = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
                onClick: this.onButtonClick,
            })
        })
        if (!dialogProps.cancelButtonText) {
            dialogProps.cancelButtonText = 'Cancel'
        }
        return (
            <span>
                {buttonChild}
                <ConfirmationDialog
                    {...this.props.dialogProps}
                    show={this.state.isOpen}
                    confirmAction={this.confirmAction}
                    cancelAction={() => this.close(dialogProps.cancelAction)}
                    close={() => this.close(dialogProps.close)}
                />
            </span>
        )
    }
}

export default SafeActionButton



// WEBPACK FOOTER //
// ./app/components/SafeActionButton/index.jsx