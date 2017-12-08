import React from 'react'
import { Utils } from 'components'
import apis from 'apis/apis'
import ActivityModal from '../ActivityModal'
import NodeDetailsPanel from '../../WorkflowView/NodeDetailsPanel'
import css from './ActivityDetailView.css'

export default class ActivityDetailView extends React.Component {

  state = { detailsLoaded: false }
  selectedNode = null
  activity = null

  componentWillMount () {
    this.init(this.props)
  }

  init (props) {
    if (!this.activity) {
      this.activity = props.activity
      this.fetchNodeDetails(this.activity.workflowExecutionId, this.activity.stateExecutionInstanceId)
    }
  }

  onShowActivity = (activityUuid) => {
    Utils.hideModal.bind(this)()
    const modalActivity = {
      uuid: activityUuid
    }
    this.setState({ showActivityModal: true, modalActivity })
  }

  fetchNodeDetails = (executionId, stateExecutionId) => {
    let envId = ''
    let appId = ''

    if (this.props.activity) {
      envId = this.props.activity.environmentId
      appId = this.props.activity.appId
    }

    if (this.state.detailsLoaded) {
      return
    }

    if (!executionId || !stateExecutionId) {
      this.setState({ detailsLoaded: true })
      return
    }

    apis.service.list(apis.getStateExecutionEndPoint(appId, envId, executionId, stateExecutionId))
      .then((resp) => {
        if (resp.resource) {
          this.selectedNode = resp.resource
          this.setState({ detailsLoaded: true })
        }
      })
      .catch(error => { throw error })
  }

  render () {
    if (this.state.detailsLoaded) {
      if (this.selectedNode) {
        return (
          <div className={css.main}>
            <NodeDetailsPanel
              data={this.selectedNode}
              onHide={Utils.hideModal.bind(this)}
              onShowActivity={this.onShowActivity}
              appId={this.activity.appId}
              envId={this.activity.environmentId}
            />
          </div>
        )
      } else if (this.activity) {
        return (
          <div className={css.main}>
            <ActivityModal
              useDebounce={true}
              modalView={false}
              checkAutoRefresh={true}
              activity={this.activity}
              appId={this.activity.appId}
              envId={this.activity.environmentId}
              show={true}
              onHide={() => {}}
            />
          </div>
        )
      }
    }

    return (
      <div className={css.main}> <span className="wings-spinner" /> </div>
    )

  }

}



// WEBPACK FOOTER //
// ../src/containers/ActivityPage/views/ActivityDetailView.js