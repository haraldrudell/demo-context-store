import React from 'react'
import { observer } from 'mobx-react'
import { Modal } from 'react-bootstrap'
import { UIButton, WingsModal, WingsDynamicForm, Utils, CompUtils } from 'components'
import TestCustomInput from './TestCustomInput'

// THIS TEST MODAL DEMONSTRATES:
//   - Hierarchical dropdowns (Apps => Services => Infrastructures) with ajax data & Edit flow.

const fieldOrder = ['name', 'appId', 'serviceId', 'infraId']
const fetchApplications = async ({ formData, formProps }) => {
  await Utils.sleep(100)
  return formProps.dataStore.apps
}
const fetchServices = async () => {
  await Utils.sleep(200)
  return [{ uuid: 'S1', name: 'Service 1' }, { uuid: 'S2', name: 'Service 2' }]
}

const fetchInfras = async () => {
  await Utils.sleep(200)
  return [({ uuid: 'I1', name: 'Infra 1' }, { uuid: 'I2', name: 'Infra 2' })]
}

const baseSchema = {
  type: 'object',
  required: ['appId'],
  properties: {
    uuid: { type: 'string', title: 'uuid' },
    name: { type: 'string', title: 'Name' },
    appId: {
      type: 'string',
      title: 'Application',
      enum: [],
      enumNames: [],
      'custom:dataProvider': 'fetchApplications'
    },
    serviceId: {
      type: 'string',
      title: 'Service',
      enum: [],
      enumNames: [],
      'custom:dataProvider': 'fetchServices'
    },
    // 'custom:dataTransformer': (response) => { transformed:true} }, // TODO: later
    infraId: {
      type: 'string',
      title: 'Service Infrastructure',
      enum: [],
      enumNames: [],
      'custom:dataProvider': 'fetchInfras'
    },

    customText: { type: 'string', title: 'Test Custom Input' },

    environmentMapping: {
      type: 'object',
      properties: {
        service1: {
          type: 'string',
          enum: [],
          enumNames: [],
          'custom:dataProvider': 'fetchServices'
        },
        environment1: {
          type: 'string',
          enum: [],
          enumNames: [],
          'custom:dataProvider': 'fetchInfras'
        },
        service2: {
          type: 'string',
          enum: [],
          enumNames: [],
          'custom:dataProvider': 'fetchServices'
        },
        environment2: {
          type: 'string',
          enum: [],
          enumNames: [],
          'custom:dataProvider': 'fetchInfras'
        }
      },
      dataProviders: {
        fetchServices,
        fetchInfras,
        fetchApplications
      }
    }
  },
  dataProviders: {
    fetchServices,
    fetchInfras,
    fetchApplications
  }
}

const baseUiSchema = {
  uuid: { 'ui:widget': 'hidden' }, // for Edit
  name: { 'ui:placeholder': 'Application Name' },
  appId: { 'ui:placeholder': 'Select Application' },
  serviceId: { 'ui:placeholder': 'Select Service' },
  infraId: { 'ui:placeholder': 'Select Infrastructure' },
  customText: { 'custom:widget': 'TestCustomInput' },
  environmentMapping: {
    service1: { 'ui:placeholder': 'Select s1' },
    environment1: { 'ui:placeholder': 'Select e1' },
    service2: { 'ui:placeholder': 'Select s2' },
    environment2: { 'ui:placeholder': 'Select e2' }
  }
}

const widgets = { TestCustomInput }

@observer
class TestDependencyModal extends React.Component {
  state = {}

  componentWillMount = async () => {
    const formData = WingsDynamicForm.toFormData({ data: this.props.data }) || {} // API-data to formData (for Edit)
    await CompUtils.setComponentState(this, {
      initialized: true,
      fieldOrder: fieldOrder,
      schema: baseSchema,
      uiSchema: baseUiSchema,
      formData: formData
    })
  }

  onInitializeForm = async form => {
    // form.mergeFieldDataProvidersWith(baseDataProviders)
    // form.mergeFieldDataProvidersWith({
    //   fetchApplications: async () => {
    //     await Utils.sleep(1500)
    //     return this.props.dataStore.apps
    //   }
    // })s
    // For Edit flow: auto-process the Form & populate data:

    const formData = this.state.formData
    formData.environmentMapping = formData.environmentMapping || {}
    const formEnvData = formData && formData.environmentMapping
    await form.autoProcessInitialize(fieldOrder)
    await form.autoProcessSubfieldInitialize('environmentMapping', ['service1', 'environment1'], formEnvData)
    await form.autoProcessSubfieldInitialize('environmentMapping', ['service2', 'environment2'], formEnvData)
  }

  onChange = async ({ formData }) => {
    const form = this.form
    const formEnvData = formData && formData.environmentMapping
    await form.autoProcessChange(fieldOrder)

    await form.autoProcessSubfieldChange('environmentMapping', ['service1', 'environment1'], formEnvData)

    await form.autoProcessSubfieldChange('environmentMapping', ['service2', 'environment2'], formEnvData)
    await form.updateChanges()
  }

  onSubmit = async ({ formData }) => {
    this.setState({ submitting: true })
    await Utils.sleep(1500)
    this.onHide()
  }

  onHide = () => {
    this.setState({ submitting: false })
    this.props.onHide()
  }

  render () {
    return (
      <WingsModal show={true} onHide={this.onHide} submitting={this.state.submitting}>
        <Modal.Header closeButton>
          <Modal.Title>Test Modal - Dependency Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsDynamicForm
            name="Test Modal - Dependency Form"
            ref={f => (this.form = f)}
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            onInitializeForm={this.onInitializeForm}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            widgets={widgets}
            dataStore={this.props.dataStore}
          >
            <UIButton type="submit" disabled={this.state.submitting}>
              SUBMIT
            </UIButton>
          </WingsDynamicForm>
        </Modal.Body>
      </WingsModal>
    )
  }
}

export default TestDependencyModal



// WEBPACK FOOTER //
// ../src/containers/TestPage/TestDependencyModal.js