import React from 'react'
import css from './ActionButtons.css'
import { ActionsDropdown } from '../ActionsDropdown/ActionsDropdown.js'

export class ActionButtons extends React.Component {
  state = {}

  render () {
    const { buttons } = this.props
    const actionIcons = [
      {
        label: 'Clone',
        element: <clone-icon class="harness-icon" />,
        onClick: buttons.cloneFunc
      },
      {
        label: 'Delete',
        element: <delete-icon class="harness-icon" />,
        onClick: buttons.deleteFunc
      }
    ]

    return (
      <div className={css.main}>
        <ActionsDropdown actionIcons={actionIcons} />
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/ActionButtons/ActionButtons.js