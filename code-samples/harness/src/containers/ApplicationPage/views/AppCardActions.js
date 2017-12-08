import React from 'react'
import { Dropdown, MenuItem } from 'react-bootstrap'
import { Popover, Position } from '@blueprintjs/core'
import SetupAsCodePanel from '../../SetupAsCode/SetupAsCodePanel'
import css from './AppCardActions.css'

export default class AppCardActions extends React.Component {
  renderThreeDotMenu (app, params) {
    return (
      <Dropdown id={app.uuid} pullRight id="threedots" className="wings-threedots">
        <i className="fa fa-ellipsis-v" bsRole="toggle" />
        <Dropdown.Menu bsRole="menu">
          <MenuItem eventKey="1" onClick={e => params.onEdit(app)}>
            <span>
              <i className="icons8-pencil-tip" />&nbsp;Edit
            </span>
          </MenuItem>
          {/* <MenuItem eventKey="1" onClick={(e) => params.onSetup(app)}>
            <span><i className="icons8-settings-2"></i>&nbsp;Setup</span>
          </MenuItem>*/}
          <MenuItem divider />
          <MenuItem eventKey="2" onClick={e => params.onDelete(app.uuid)}>
            <span>
              <i className="icons8-waste" data-name="delete-icon" />&nbsp;Delete
            </span>
          </MenuItem>
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  renderMenuForNoApps () {
    return (
      <Dropdown id={1} pullRight className="wings-threedots">
        <i className="fa fa-ellipsis-v" bsRole="toggle" />
        <Dropdown.Menu bsRole="menu">
          <MenuItem eventKey="1">
            <span>
              <i className="icons8-pencil-tip" />&nbsp;Edit
            </span>
          </MenuItem>
          <MenuItem eventKey="1">
            <span>
              <i className="icons8-settings-2" />&nbsp;Setup
            </span>
          </MenuItem>
          <MenuItem divider />
          <MenuItem eventKey="2">
            <span>
              <i className="icons8-waste" />&nbsp;Delete
            </span>
          </MenuItem>
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  render () {
    if (this.props.app) {
      const { app } = this.props
      return (
        <div key={app.uuid} className={css.main}>
          <Popover
            position={Position.LEFT_TOP}
            useSmartArrowPositioning={true}
            content={<SetupAsCodePanel {...this.props} selectId={app.uuid} />}
          >
            <i className="icons8-source-code" />
          </Popover>
          {this.renderThreeDotMenu(app, this.props.params)}
        </div>
      )
    } else {
      return (
        <div key={1}>
          {this.renderMenuForNoApps()}
        </div>
      )
    }
  }
}



// WEBPACK FOOTER //
// ../src/containers/ApplicationPage/views/AppCardActions.js