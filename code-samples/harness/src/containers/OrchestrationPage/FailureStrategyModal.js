import React from 'react'
import { Modal } from 'react-bootstrap'
import { WingsModal, Utils } from 'components'
import FailureStrategyPanel from './views/FailureStrategyPanel'
// import css from './NewWorkflowModal.css'

export default class FailureStrategyModal extends React.Component {
  state = {
    failureStrategies: [],
    editingItem: null,
    selectedPhaseStep: null
  }

  componentWillReceiveProps (newProps) {
    if (newProps.show) {
      this.init(newProps)
    }
  }

  init (props) {
    const failureStrategies = Utils.getJsonValue(props, 'data.failureStrategies') || []
    const editingItem = Utils.getJsonValue(props, 'data.failureStrategyModalEditingItem')
    const selectedPhaseStep = Utils.getJsonValue(props, 'data.selectedPhaseStep')
    this.setState({ failureStrategies, editingItem, selectedPhaseStep })
  }

  // onSubmit = () => {
  //   this.props.onSubmit(this.state.failureStrategies)
  // }

  onChange = strats => {
    this.setState({ failureStrategies: strats })
    this.props.onChange(strats)
  }

  render () {
    const failureStrategies = this.state.failureStrategies || []
    return (
      <WingsModal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Failure Strategy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FailureStrategyPanel
            isCustomModal={this.props.isCustomModal}
            failureStrategies={failureStrategies}
            editingItem={this.state.editingItem}
            selectedPhaseStep={this.state.selectedPhaseStep}
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



// WEBPACK FOOTER //
// ../src/containers/OrchestrationPage/FailureStrategyModal.js