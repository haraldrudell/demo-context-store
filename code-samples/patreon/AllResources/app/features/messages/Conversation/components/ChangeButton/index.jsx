import t from 'prop-types'
import React from 'react'

const ChangeButton = ({ onClick }) => {
    return (
        <button className="button-reset link" onClick={onClick}>
            Change
        </button>
    )
}

ChangeButton.propTypes = {
    onClick: t.func,
}

export default ChangeButton



// WEBPACK FOOTER //
// ./app/features/messages/Conversation/components/ChangeButton/index.jsx