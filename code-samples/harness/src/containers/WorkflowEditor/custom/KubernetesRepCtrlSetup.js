import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { WingsForm, Utils, WingsModal } from 'components'
import css from './KubernetesRepCtrlSetup.css'

const replicationControllerNameProp = {
  replicationControllerName: {
    type: 'string',
    title: 'Kubernetes Replication Controller Name',
    default: '${app.name}.${service.name}.${env.name}'
  },
  maxInstances: {
    type: 'number',
    title: 'Minimum total instances for percentage based deployment',
    default: 10
  },
  resizeStrategy: {
    type: 'string',
    title: 'Resize Strategy',
    enum: ['RESIZE_NEW_FIRST', 'DOWNSIZE_OLD_FIRST'],
    enumNames: [
      'Add new instances first, then downsize old instances',
      'Downsize old instances first, then add new instances'
    ],
    default: 'RESIZE_NEW_FIRST'
  }
}

const serviceTypeProp = {
  serviceType: {
    type: 'string',
    title: 'Kubernetes Service Type',
    enum: ['None', 'ClusterIP', 'LoadBalancer', 'NodePort', 'ExternalName'],
    enumNames: ['None', 'Cluster IP', 'Load Balancer', 'Node Port', 'External Name'],
    default: 'None'
  }
}

const portProp = {
  port: { type: 'number', title: 'Port', default: 80 },
  targetPort: { type: 'number', title: 'Target Port', default: 8080 },
  protocol: { type: 'string', title: 'Protocol', enum: ['TCP', 'UDP'], default: 'TCP' }
}

const externalIPsProp = {
  externalIPs: { type: 'string', title: 'External IPs' }
}

const schemas = {
  default: {
    type: 'object',
    properties: {
      ...replicationControllerNameProp,
      ...serviceTypeProp
    }
  },
  None: {
    type: 'object',
    properties: {
      ...replicationControllerNameProp,
      ...serviceTypeProp
    }
  },
  ClusterIP: {
    type: 'object',
    properties: {
      ...replicationControllerNameProp,
      ...serviceTypeProp,
      ...portProp,
      clusterIP: { type: 'string', title: 'Cluster IP' },
      ...externalIPsProp
    }
  },
  LoadBalancer: {
    type: 'object',
    properties: {
      ...replicationControllerNameProp,
      ...serviceTypeProp,
      ...portProp,
      loadBalancerIP: { type: 'string', title: 'Load Balancer IP' },
      ...externalIPsProp
    }
  },
  NodePort: {
    type: 'object',
    properties: {
      ...replicationControllerNameProp,
      ...serviceTypeProp,
      ...portProp,
      nodePort: { type: 'number', title: 'Node Port' },
      ...externalIPsProp
    }
  },
  ExternalName: {
    type: 'object',
    properties: {
      ...replicationControllerNameProp,
      ...serviceTypeProp,
      externalName: { type: 'string', title: 'External Name' },
      ...externalIPsProp
    }
  }
}

const uiSchema = {
  externalIPs: { 'ui:placeholder': 'IP1, IP2, ...' }
}

export default class KubernetesRepCtrlSetup extends React.Component {
  state = {
    formData: {},
    schema: schemas.default,
    uiSchema: uiSchema
  }
  isEditing = false
  appIdFromUrl = Utils.appIdFromUrl()

  componentWillMount () {
    this.init(this.props)
  }

  componentWillReceiveProps (newProps) {
    this.init(newProps)
  }

  init (props) {
    if (props.show) {
      const formData = Utils.clone(props.formData)
      console.log('Props: ', props)
      // this.fetchData(formData)
      this.updateForm({ serviceType: formData.serviceType }, formData)
    }
  }

  updateForm = (params, formData) => {
    let schema = this.state.schema

    if (params && params.serviceType) {
      schema = schemas[params.serviceType]
    }

    this.setState({ formData: formData, schema })
  }

  onSubmit = ({ formData }) => {
    const data = Utils.clone(formData)
    delete data.key

    this.props.onSubmit({ formData: data })
  }

  onChange = ({ formData }) => {
    const prevServiceType = Utils.getJsonValue(this, 'state.formData.serviceType') || ''
    if (formData.serviceType !== prevServiceType) {
      this.updateForm({ serviceType: formData.serviceType }, formData)
    }
  }

  onHide = () => {
    this.props.onHide()
  }

  render () {
    return (
      <WingsModal className={css.main} show={this.props.show} onHide={this.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Kubernetes Service Setup</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsForm
            name="Kubernetes Service Setup"
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
          >
            <Button bsStyle="default" type="submit">
              SUBMIT
            </Button>
          </WingsForm>
        </Modal.Body>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/WorkflowEditor/custom/KubernetesRepCtrlSetup.js