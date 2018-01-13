import t from 'prop-types'
import React from 'react'

import SafeActionButton from 'components/SafeActionButton'

const SafeDeleteButton = props => {
    return (
        <SafeActionButton
            dialogProps={{
                title: `Delete ${props.entity}?`,
                description: `Are you sure you want to delete this ${props.entity.toLowerCase()}? You cannot undo this action.`,
                confirmAction: props.confirmAction,
                confirmationButtonText: 'Delete',
                cancelButtonText: 'Cancel',
            }}
        >
            {props.children}
        </SafeActionButton>
    )
}
SafeDeleteButton.propTypes = {
    confirmAction: t.func,
    entity: t.string,
    children: t.node,
}

export default SafeDeleteButton



// WEBPACK FOOTER //
// ./app/components/SafeDeleteButton/index.jsx