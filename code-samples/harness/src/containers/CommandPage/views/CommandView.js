import React from 'react'
import PipelineWorkflowView from '../../WorkflowView/PipelineWorkflowView'
import css from './CommandView.css'

export default class CommandView extends React.Component {
  state = { jsplumbLoaded: false }

  componentWillReceiveProps (newProps) {
    if (newProps && newProps.jsplumbLoaded === true) {
      this.setState({ jsplumbLoaded: true })
    }
  }

  render () {
    return (
      <div className={`box-solid wings-card ${css.main}`}>
        <div className="box-header">
          <button className="btn btn-link __command" onClick={this.props.onAdd.bind(this, null)}>
            <i className="icons8-plus-math" /> Add Command
          </button>
          <span className="pull-right">
            <button className="btn btn-link __viewHistory" title="View History" onClick={this.props.onHistoryClick}>
              <i className="icons8-past-2" />
            </button>
          </span>
        </div>
        <div className="box-body __body wings-card-body">
          {this.props.data.map(item => (
            <dl key={item.name} className="dl-horizontal wings-dl __dl">
              <dt>
                <span>
                  <div className="wings-text-link __command __commandName" onClick={this.props.onEdit.bind(this, item)}>
                    {item.name}
                  </div>
                  <div className="manageVersion" onClick={this.props.onManageVersion.bind(this, item)}>
                    manage version
                  </div>
                </span>
              </dt>
              <dd>
                <PipelineWorkflowView
                  parentId={item.uuid}
                  data={item.command}
                  pipeline={item.command}
                  jsplumbLoaded={this.state.jsplumbLoaded}
                />

                <span className="item-actions">
                  <i className="icons8-copy-2" onClick={this.props.onClone.bind(this, item)} />
                  <i className="icons8-pencil-tip" onClick={this.props.onEdit.bind(this, item)} />
                  <i className="icons8-waste" onClick={this.props.onDelete.bind(this, item.uuid)} />
                </span>
              </dd>
            </dl>
          ))}
        </div>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/CommandPage/views/CommandView.js