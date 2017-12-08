import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { WingsDynamicForm, WingsModal, CompUtils, FormUtils, MultiSelect, Utils } from 'components'
import css from './DCNodeSelectModal.css'
import { InfrasService } from 'services'

const baseSchema = {
  type: 'object',
  required: [],

  properties: {
    hosts: {
      type: 'string',
      title: 'Host Name(s)'
    },
    instanceCount: {
      type: 'integer',
      title: 'Instances (cumulative)'
    },
    instanceUnitType: {
      type: 'string',
      title: 'Instance Unit Type (Count/Percent)',
      enum: ['COUNT', 'PERCENTAGE'],
      enumNames: ['Count', 'Percent'],
      default: 'COUNT'
    },
    specificHosts: {
      type: 'boolean',
      title: 'Select specific hosts?',
      enumNames: ['Yes', 'No']
    },
    excludeSelectedHostsFromFuturePhases: {
      type: 'boolean',
      title: 'Exclude instances from future phases',
      default: true
    }
  }
}

const baseUiSchema = {
  specificHosts: {
    'ui:widget': 'radio',
    'custom:widget': 'radio'
  },
  hosts: {
    'ui:widget': 'hidden',
    'custom:widget': 'hostWidget'
  },
  instanceCount: {
    classNames: `${css.displaySameRow} ${css.paddingRight}`,
    'custom:widget': ''
  },

  instanceUnitType: {
    classNames: css.displaySameRow,
    'custom:widget': ''
  },

  'ui:order': ['specificHosts', 'instanceCount', 'instanceUnitType', 'hosts', 'excludeSelectedHostsFromFuturePhases']
}

export default class AWSNodeSelectModal extends React.Component {
  widgets = {
    hostWidget: props => {
      const valuesData = []
      for (let i = 0; i < props.schema.data.length; i++) {
        valuesData.push(props.schema.data[i].split(' [')[0])
      }
      const multiSelectData = Utils.enumArrToSelectArr(valuesData, props.schema.data)

      return (
        <MultiSelect
          description="Host Name(s)"
          data={multiSelectData}
          {...props}
          onChange={async val => {
            const form = this.form
            const formData = form.buffer.formData

            if (val === '' || !val) {
              delete formData['hosts']
            } else {
              formData['hosts'] = val
            }
            await form.updateChanges()
          }}
        />
      )
    }
  }
  state = {
    widgets: this.widgets,
    schema: {},
    uiSchema: {},
    formData: {},
    error: false,
    hosts: []
  }

  hostList = []
  form
  isEditing = false
  appId = this.props.urlParams.appId
  infraMappingId
  errorClass = ''
  errorMessage = ''

  async componentWillMount () {
    await this.init(this.props)
  }

  async componentWillReceiveProps (newProps) {
    await this.init(newProps)
  }

  init = async props => {
    if (props.show) {
      this.infraMappingId = props.custom.infraMappingId ? props.custom.infraMappingId : ''

      const formData = WingsDynamicForm.toFormData({ data: this.props.formData }) || {}

      await CompUtils.setComponentState(this, {
        initialized: true,
        schema: baseSchema,
        uiSchema: baseUiSchema,
        formData,
        widgets: this.widgets
      })
    }
  }

  fetchHosts = async form => {
    const infraMappingId = this.infraMappingId
    const appId = this.appId

    if (infraMappingId) {
      const { error, hosts } = await InfrasService.getHostsForInfraMappings({ infraMappingId, appId })

      if (error) {
        return
      }

      CompUtils.setComponentState(this, { hosts })

      form.buffer.schema.properties.instanceCount.maximum = hosts.length
    }
  }

  onInitializeForm = async form => {
    await form.setFormState({ loading: true })

    let formData = form.buffer.formData
    this.modifyFormDataForEdit(form)
    this.convertHostData(formData)

    await this.fetchHosts(form)

    await form.autoProcessInitialize()
    formData = form.buffer.formData
    await this.customizeForm(form, formData)

    await form.updateChanges()
  }

  customizeForm = async (form, formData) => {
    const uiSchema = form.buffer.uiSchema

    if (this.props.isUsingAutoScalingGroup) {
      form.hideFields(['specificHosts'])
      this.addPlaceHolderToUiSchema(uiSchema)
    } else {
      await this.onChangeOfSpecificHosts({ formData, form })
    }
  }

  modifyFormDataForEdit = form => {
    if (this.props.data) {
      const { nodeData } = this.props.data
      const { properties } = nodeData
      if (properties) {
        const formData = properties
        this.convertHostData(formData)
        form.buffer.formData = formData
      }
    }
  }

  onHide = async () => {
    await CompUtils.setComponentState(this, { initialized: false })
    this.props.onHide()
  }

  onChange = async ({ formData }) => {
    const form = this.form

    if (form.isFieldChanged('specificHosts')) {
      await this.onChangeOfSpecificHosts({ formData, form })
    }
    await form.updateChanges()
  }

  onChangeOfSpecificHosts = async ({ formData, form }) => {
    const specificHosts = formData.specificHosts

    const schema = form.buffer.schema
    const uiSchema = form.buffer.uiSchema
    schema.required = []
    if (specificHosts) {
      const hostProperty = schema.properties.hosts

      FormUtils.setEnumData(hostProperty, this.state.hosts)
      Utils.setFormRequired(schema, 'hosts', true)

      form.hideFields(['instanceCount', 'instanceUnitType'])
      form.showFields(['hosts'])
    } else {
      Utils.setFormRequired(schema, 'instanceCount', true)
      form.showFields(['instanceCount', 'instanceUnitType'])
      form.hideFields(['hosts'])
      this.addPlaceHolderToUiSchema(uiSchema)
    }
  }

  addPlaceHolderToUiSchema = uiSchema => {
    uiSchema.instanceCount['ui:placeholder'] = `Total ${this.state.hosts.length} nodes available`
  }

  convertHostData = formData => {
    if (formData.hostNames) {
      formData.hosts = formData.hostNames.join(',')
      delete formData.hostNames
    }
  }

  modifyHostData = formData => {
    if (formData.specificHosts) {
      if (formData.hosts) {
        formData['hostNames'] = formData.hosts.split(/[\n|,]/).filter(o => o.length > 0)
        delete formData.hosts

        delete formData.instanceCount
        delete formData.instanceUnitType
      } else {
        delete formData.hosts
        delete formData.hostNames
      }
    }
  }

  onSubmit = ({ formData }) => {
    const data = FormUtils.clone(formData)

    delete data.key
    if (this.isValidForm(formData)) {
      this.clearError()

      this.modifyHostData(data)

      this.props.onSubmit({ formData: data })
    } else {
      this.setError(formData.instanceCount, formData.instanceUnitType)
    }
  }

  clearError = () => {
    this.errorClass = ''
    this.errorMessage = ''

    this.setState({ error: false })
  }

  setError = (count, unitType) => {
    this.errorClass = css.error
    if (unitType === 'COUNT') {
      if (!count) {
        this.errorMessage = 'Count must be specified'
      } else if (count <= 0) {
        this.errorMessage = 'Count must be greater than zero'
      } else if (this.state.hosts.length > 0) {
        this.errorMessage = `Count may not be greater than ${this.state.hosts.length}`
      } else {
        this.errorMessage = 'No nodes are available from the service infrastructure'
      }
    } else {
      if (!count) {
        this.errorMessage = 'Percent must be specified'
      } else if (count <= 0) {
        this.errorMessage = 'Percent must be greater than zero'
      } else {
        this.errorMessage = 'Percent may not be greater than 100'
      }
    }

    this.setState({ error: true })
  }

  isValidForm = formData => {
    const isUsingAutoScalingGroup = this.props.isUsingAutoScalingGroup
    const instanceCount = formData.instanceCount
    const instanceUnitType = formData.instanceUnitType

    if (isUsingAutoScalingGroup || !formData.specificHosts) {
      return this.validateInstanceCount(instanceCount, instanceUnitType)
    } else {
      return true
    }
  }

  validateInstanceCount = (count, unitType) => {
    const hosts = this.state.hosts
    const hostLength = hosts.length

    if (unitType === 'COUNT' && count > 0 && count <= hostLength) {
      return true
    } else if (unitType === 'PERCENTAGE' && count > 0 && count <= 100) {
      return true
    }
    return false
  }

  render () {
    return (
      <WingsModal className={css.main} show={this.props.show} onHide={this.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Node Select</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsDynamicForm
            {...this.props}
            name="Node Select"
            ref={f => (this.form = f)}
            onInitializeForm={this.onInitializeForm}
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            widgets={this.state.widgets}
            onChange={this.onChange}
            widgets={this.state.widgets}
            onSubmit={this.onSubmit}
          >
            <Button bsStyle="default" type="submit" className="submit-button" disabled={this.state.submitting}>
              SUBMIT
            </Button>
            {this.state.error && <span className={this.errorClass}>{this.errorMessage}</span>}
          </WingsDynamicForm>
        </Modal.Body>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/WorkflowEditor/custom/NodeSelectModal.js