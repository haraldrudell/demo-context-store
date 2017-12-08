import React from 'react'
import Confirm from './Confirm'

export default class ConfirmDelete extends React.Component {
  render () {
    return (
      <Confirm
        visible={this.props.visible}
        onConfirm={this.props.onConfirm}
        onClose={this.props.onClose}
        body="Are you sure you want to delete this?"
        confirmText="Confirm Delete"
        title="Deleting">
        <button style={{ display: 'none' }} />
      </Confirm>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/Confirm/ConfirmDelete.js