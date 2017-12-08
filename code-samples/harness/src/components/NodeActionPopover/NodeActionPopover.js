import React from 'react'
import css from './NodeActionPopover.css'

class NodeActionPopover extends React.Component {
  showNodeCls = ''
  state = { showNodeCls: css.main }

  onMenuItemClick = action => {
    const nodeData = this.props.data
    /*
     Sending NodeName as parameter
     this nodename is used to load the stencil modal
    */
    //  await this.setState({ showNodeCls: css.hide })
    this.props.onNodeActionClick(action, nodeData)
  }

  render () {
    const summary = (
      <div>
        <ul className={css.menu}>
          <li onClick={() => this.onMenuItemClick('IGNORE')}>
            <i className={'icons8-start ' + css.icon} />Ignore Failure
          </li>
          <li onClick={() => this.onMenuItemClick('MARK_SUCCESS')}>
            <i className={'icons8-checkmark ' + css.icon} />Mark as Success
          </li>
          <li onClick={() => this.onMenuItemClick('RETRY')}>
            <i className={'icons8-repeat ' + css.icon} />Retry
          </li>
          <li onClick={() => this.onMenuItemClick('RETRY_WITH_PARAMETERS')}>
            <i className={'icons8-repeat ' + css.icon} />Retry With Parameters
          </li>
          <li onClick={() => this.onMenuItemClick('END_EXECUTION')}>
            <i className={'icons8-cancel ' + css.icon} />End Execution
          </li>
        </ul>
        <hr className={css.separator} />
        <ul className={css.menu}>
          <li onClick={() => this.onMenuItemClick('ABORT_ALL')}>
            <i className={'icons8-stop ' + css.icon} />Abort Workflow
          </li>
          <li onClick={() => this.onMenuItemClick('ROLLBACK')}>
            <i className={'icons8-recurring-appointment ' + css.icon} />Rollback Workflow
          </li>
        </ul>
      </div>
    )

    return (
      <div className={css.main}>
        {summary}
      </div>
    )
  }
}

export default NodeActionPopover



// WEBPACK FOOTER //
// ../src/components/NodeActionPopover/NodeActionPopover.js