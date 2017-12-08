import React from 'react'
import { observer } from 'mobx-react'
import { Modal } from 'react-bootstrap'
import { WingsModal, Utils } from 'components'
import NotificationStrategyPanel from './views/NotificationStrategyPanel'
// import css from './NewWorkflowModal.css'

@observer
class NotificationStrategyModal extends React.Component {
  state = { notificationGroups: [] }

  componentWillReceiveProps (newProps) {
    if (newProps.show) {
      this.init(newProps)
    }
  }

  init (props) {
    const notificationGroups = Utils.getJsonValue(props, 'data.notificationGroups') || []
    const notificationRules = Utils.getJsonValue(props, 'data.notificationRules') || []
    this.setState({ notificationGroups, notificationRules })
  }

  // onSubmit = () => {
  //   this.props.onSubmit(this.state.notificationGroups)
  // }

  onChange = strats => {
    this.setState({ notificationGroups: strats })
    this.props.onChange(strats)
  }

  render () {
    const notificationGroups = this.state.notificationGroups || []
    const notificationRules = this.state.notificationRules || []
    return (
      <WingsModal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Notification Strategy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NotificationStrategyPanel
            dataStore={this.props.dataStore}
            notificationRules={notificationRules}
            notificationGroups={notificationGroups}
            editingItem={this.props.data.notifStrategyModalEditingItem}
            onChange={this.onChange}
          />
        </Modal.Body>
        {/* <Modal.Footer>
          <Button onClick={this.onSubmit.bind(this)}>Submit</Button>
        </Modal.Footer> */}
      </WingsModal>
    )
  }
}

export default NotificationStrategyModal



// WEBPACK FOOTER //
// ../src/containers/OrchestrationPage/NotificationStrategyModal.js