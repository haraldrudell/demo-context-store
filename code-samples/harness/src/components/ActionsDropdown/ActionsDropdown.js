import React from 'react'
import { Dropdown, MenuItem } from 'react-bootstrap'
import css from './ActionsDropdown.css'

export class ActionsDropdown extends React.Component {
  renderMenuItems = ({ actionIcons }) =>
    actionIcons.map((actionIcon, actionIconIdx) => (
      <MenuItem eventKey={actionIconIdx} key={actionIconIdx} onClick={actionIcon.onClick}>
        {actionIcon.element}
        <action-icon-label>{actionIcon.label}</action-icon-label>
      </MenuItem>
    ))

  render () {
    const { actionIcons = [] } = this.props

    return (
      <div className={css.main}>
        <Dropdown id={1} pullRight id="threedots">
          <i data-name="three-dot-menu-icon" className="fa fa-ellipsis-v three-dots" bsRole="toggle" />
          <Dropdown.Menu bsRole="menu">{this.renderMenuItems({ actionIcons })}</Dropdown.Menu>
        </Dropdown>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/ActionsDropdown/ActionsDropdown.js