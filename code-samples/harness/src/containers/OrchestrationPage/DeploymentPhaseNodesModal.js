import React from 'react'
import { Modal } from 'react-bootstrap'
// import Form from 'react-jsonschema-form'
import { WingsModal, WingsForm } from 'components'

const schema = {
  type: 'object',
  required: ['names'],
  properties: {
    uuid: { type: 'string', title: 'uuid' },
    tagsLabels: {
      type: 'string',
      title: '  ',
      enum: ['provision', 'existing'],
      enumNames: ['Provision new Nodes', 'Use Existing Ones']
    },
    nodeTemplate: {
      type: 'string',
      title: 'Node Template',
      enum: ['acct-svc-image'],
      enumNames: ['acct-svc-image']
    },
    numNodes: { type: 'number', title: 'Number of Nodes' },
    names: { type: 'string', title: 'Tags/Labels' },
    failureStrategy: { type: 'boolean', default: true, title: 'Use default failure strategy' }
  }
}

const uiSchema = {
  uuid: { 'ui:widget': 'hidden' },
  tagsLabels: {
    'ui:widget': 'radio',
    'ui:options': {
      inline: true
    }
  }
}

const uiSchemaExisting = {
  uuid: { 'ui:widget': 'hidden' },
  tagsLabels: {
    'ui:widget': 'radio',
    'ui:options': {
      inline: true
    }
  },
  nodeTemplate: { 'ui:widget': 'hidden' },
  numNodes: { 'ui:widget': 'hidden' }
}

const log = type => {} // console.log.bind(console, type)

export default class DeploymentPhaseNodesModal extends React.Component {
  state = { schema, uiSchema, formData: {} }

  componentWillReceiveProps (newProps) {}

  onChange = ({ formData }) => {
    let uis = uiSchema
    if (formData.tagsLabels === 'existing') {
      uis = uiSchemaExisting
    }
    this.setState({ formData, uiSchema: uis })
  }

  onSubmit = ({ formData }) => {
    const isEditing = this.props.data ? true : false
    this.props.onSubmit(formData, isEditing)
  }

  render () {
    return (
      <WingsModal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Workflow</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsForm
            name="Workflow"
            ref="form"
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            onError={log('errors')}
          />
        </Modal.Body>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/OrchestrationPage/DeploymentPhaseNodesModal.js