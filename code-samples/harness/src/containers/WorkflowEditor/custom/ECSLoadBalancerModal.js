import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { WingsForm, Utils, WingsModal, SearchableSelect } from 'components'
import css from './ECSLoadBalancerModal.css'
import apis from 'apis/apis'

const widgets = {
  SearchableSelect
}

const moreSchema = {
  loadBalancerName: {
    type: 'string',
    title: 'Elastic Load Balancer',
    enum: [],
    enumNames: []
  },
  targetGroupArn: {
    type: 'string',
    title: 'Target Group',
    enum: [],
    enumNames: []
  },
  roleArn: {
    type: 'string',
    description: 'Role with AmazonEC2ContainerServiceRole policy attached.',
    title: 'IAM Role',
    enum: [],
    enumNames: []
  }
}

const schema = {
  type: 'object',
  properties: {
    ecsServiceName: {
      type: 'string',
      title: 'ECS Service Name',
      default: '${app.name}__${service.name}__${env.name}'
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
    },
    serviceSteadyStateTimeout: {
      type: 'number',
      title: 'Service Steady State Wait Timeout (Minutes)',
      default: 10
    },
    useLoadBalancer: { type: 'boolean', title: 'Use Load Balancer?' }
  }
}

const uiSchema = {}

export default class ECSLoadBalancerModal extends React.Component {
  state = {
    key: Utils.randomInt(9999),
    formData: {},
    schema: schema,
    uiSchema: uiSchema,
    loadBalancers: [],
    roles: [],
    targetGroups: [],
    widgets
  }
  isEditing = false
  appIdFromUrl = Utils.appIdFromUrl()
  loadBalancers = null
  computeProviderId
  targetGroups = {}

  componentWillMount () {
    this.init(this.props)
  }

  componentWillReceiveProps (newProps) {
    this.init(newProps)
  }

  init (props) {
    if (props.show) {
      this.computeProviderId = props.computeProvider.uuid
      const formData = Utils.clone(props.formData)
      if (formData.loadBalancerName !== undefined) {
        // formData.useLoadBalancer = true
        this.fetchData(formData, formData.loadBalancerName)
      } else {
        formData.useLoadBalancer = false
        this.updateForm({ useLoadBalancer: formData.useLoadBalancer }, formData)
      }
      this.setState({ formData })
    }
  }

  /* Fetching loadbalancers and using loadbalancer names
  fetching targetGroups
  */
  fetchLBTargetGroups (appId, infraMappingId, formData, setLBName = '', callback) {
    if (appId && infraMappingId) {
      return apis.fetchLoadBalancerNames(appId, infraMappingId).then(result => {
        const lbArr = Object.keys(result.resource)
        formData.loadBalancerName = ''
        this.setState({ loadBalancers: lbArr })

        if (lbArr.length > 0) {
          formData.loadBalancerName = setLBName || lbArr[0] // to to "setLBName" to default to [0]
          return apis
            .fetchTargetGroupNames(appId, infraMappingId, formData.loadBalancerName)
            .then(res => {
              this.targetGroups = Object.keys(res.resource)
              this.setState({ targetGroups: res.resource }, () => {
                callback ? callback() : ''
              })
            })
            .catch(error => {
              this.targetGroups = []
              this.setState({ targetGroups: {} }, () => {
                callback ? callback() : ''
              })
            })
        }
      })
    }
  }

  /* on completion of loadbalancers,targetgroups and roles
    update the form
  */
  fetchData (formData, setLBName = '') {
    const arr = [
      this.fetchLBTargetGroups(Utils.appIdFromUrl(), this.props.custom.infraMappingId, formData, setLBName),
      this.fetchRoleNames(this.computeProviderId)
    ]
    Promise.all(arr)
      .then(response => {
        if (formData.loadBalancerName !== undefined) {
          this.updateForm({ useLoadBalancer: formData.useLoadBalancer }, formData)
        }
      })
      .catch(exception => console.log(exception))
  }

  fetchRoleNames (computeProviderId) {
    // Allow to call this only when it is some defined string
    if (computeProviderId) {
      return apis.fetchECSServiceRoles(computeProviderId).then(result => {
        this.setState({ roles: result.resource })
      })
    }
  }

  updateLoadBalancers () {}

  /* For already saved data load old data
  for new dont display load balancer fields */
  updateForm = (params, formData) => {
    const _schema = Utils.clone(schema)
    const _uiSchema = Utils.clone(this.state.uiSchema)

    if (params && params.useLoadBalancer !== undefined) {
      if (params.useLoadBalancer === true) {
        Object.assign(_schema.properties, moreSchema) // merge moreSchema
        _schema.properties.loadBalancerName.enum = this.state.loadBalancers
        _schema.properties.loadBalancerName.enumNames = this.state.loadBalancers
        _schema.properties.roleArn.enum = Object.keys(this.state.roles)
        _schema.properties.roleArn.enumNames = Object.values(this.state.roles)

        // _schema.properties.targetGroupArn.enum = Object.keys(this.state.targetGroups)
        // _schema.properties.targetGroupArn.enumNames = Object.values(this.state.targetGroups)
        _schema.properties.targetGroupArn.enum = this.targetGroups
        _schema.properties.targetGroupArn.enumNames = this.targetGroups
        _uiSchema.roleArn = { 'ui:widget': 'SearchableSelect', 'ui:placeholder': 'Select role' }
        _uiSchema['ui:order'] = [
          'ecsServiceName',
          'maxInstances',
          'serviceSteadyStateTimeout',
          'resizeStrategy',
          'useLoadBalancer',
          'loadBalancerName',
          'targetGroupArn',
          'roleArn'
        ]
      } else {
        _uiSchema['ui:order'] = [
          'ecsServiceName',
          'maxInstances',
          'resizeStrategy',
          'serviceSteadyStateTimeout',
          'useLoadBalancer'
        ]
        _uiSchema['ui:widget'] = 'hidden'
      }
    }

    this.setState({
      formData: formData,
      schema: _schema,
      uiSchema: _uiSchema,
      key: Math.random()
    })
  }

  onSubmit = ({ formData }) => {
    const data = Utils.clone(formData)
    this.props.onSubmit({ formData: data })
  }

  /*
    onchange of use load balancer value - show the form fields
    on change of loadbalancer names update targetgroups
   */
  onChange = ({ formData }) => {
    // const prevUseLoadBalancerVal = Utils.getJsonValue(this, 'state.formData.useLoadBalancerVal') || ''
    // const prevLoadBalancerName = Utils.getJsonValue(this, 'state.formData.loadBalancerName') || ''

    // if (formData.useLoadBalancer !== prevUseLoadBalancerVal) {
    //   if (formData.useLoadBalancer === true) {
    //     this.fetchData(formData)
    //   } else {
    //     this.updateForm({ useLoadBalancer: formData.useLoadBalancer }, formData)
    //   }
    // } else if (formData.loadBalancerName !== prevLoadBalancerName) {
    //   this.fetchData(formData)
    // }

    const useLoadBalancerVal = this.state.formData.useLoadBalancer
    const currentLoadBalancer = this.state.formData.loadBalancerName
    // const prevLoadBalancerName = Utils.getJsonValue(this, 'state.formData.loadBalancerName') || ''
    if (
      formData.useLoadBalancer !== useLoadBalancerVal &&
      currentLoadBalancer !== formData.loadBalancerName &&
      currentLoadBalancer !== undefined
    ) {
      // this.updateTargetGroups(formData.loadBalancerName )
      // this.fetchData(formData)
      this.fetchLBTargetGroups(Utils.appIdFromUrl(), this.props.custom.infraMappingId, formData)
    } else if (formData.useLoadBalancer !== useLoadBalancerVal) {
      this.setState({ formData })
      if (formData.useLoadBalancer === true) {
        this.fetchData(formData)
      } else {
        this.updateForm({ useLoadBalancer: formData.useLoadBalancer }, formData)
      }
    }

    const prevLoadBalancerName = Utils.getJsonValue(this, 'state.formData.loadBalancerName') || ''
    if (
      formData.useLoadBalancer === true &&
      formData.loadBalancerName &&
      formData.loadBalancerName !== prevLoadBalancerName
    ) {
      this.fetchData(formData, formData.loadBalancerName)
    }
  }

  updateTargetGroups (loadBalancerName) {
    apis
      .fetchTargetGroupNames(computeProviderId, loadBalancerName)
      .then(result => this.setState({ targetGroups: result.resource }))
  }

  onHide = () => {
    this.props.onHide()
  }

  render () {
    return (
      <WingsModal className={css.main} show={this.props.show} onHide={this.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>ECS Service Setup</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsForm
            key={this.state.key}
            name="ECS Service Setup"
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            widgets={this.state.widgets}
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
// ../src/containers/WorkflowEditor/custom/ECSLoadBalancerModal.js