import React from 'react'
import { observer } from 'mobx-react'
import { Modal } from 'react-bootstrap'
import { UIButton, WingsModal, WingsDynamicForm, SearchableSelect } from 'components'
import { CompUtils, Utils } from 'components'
import TestCustomInput from './TestCustomInput'

// THIS TEST MODAL DEMONSTRATES:
//   WingsModal, WingsForm, jsonSchema, uiSchema, Editting case, setRequired, Loading text, Spinner,
//   fetching data onChange, Custom field (widget)
// BEST PRACTICES:
//   - Don't modify or clone schema or uiSchema directly
//      => use this.form.* methods or FormUtils or create a function to do that.
//   - Be careful with multiple setStates, better do it at 1 place,
//      => use await this.form.updateChanges(), or use setState callback or await to have synchronous setState.

const baseSchema = {
  type: 'object',
  required: ['name', 'appId', 'serviceId'],
  properties: {
    uuid: { type: 'string', title: 'uuid' },
    name: { type: 'string', title: 'Name' },
    appId: { type: 'string', title: 'Application', enum: [], enumNames: [] },
    serviceId: { type: 'string', title: 'Service', enum: [], enumNames: [] },
    customText: { type: 'string', title: 'Test Custom Input' }
  }
}
const baseUiSchema = {
  uuid: { 'ui:widget': 'hidden' }, // for Edit
  name: { 'ui:placeholder': 'Application Name' },
  appId: { 'ui:placeholder': 'Select Application', 'ui:widget': 'SearchableSelect' },
  serviceId: { 'ui:placeholder': 'Select Service', 'ui:widget': 'SearchableSelect' },
  customText: { 'ui:widget': 'hidden', 'custom:widget': 'TestCustomInput' }
}
const widgets = { TestCustomInput, SearchableSelect } // custom field widgets

const fetchServices = async () => {
  await Utils.sleep(1500)
  return [{ uuid: 'S1', name: 'Service 1' }, { uuid: 'S2', name: 'Service 2' }]
}

@observer
class TestModal extends React.Component {
  state = {
    schema: {},
    uiSchema: {},
    formData: {}
  }
  form

  async componentWillMount () {
    const formData = WingsDynamicForm.toFormData({ data: this.props.data }) || {} // API-data to formData (for Edit)

    await CompUtils.setComponentState(this, {
      schema: baseSchema,
      uiSchema: baseUiSchema,
      formData: formData
    })
  }

  onInitializeForm = form => {
    form.setEnumAndNames('appId', this.props.apps || this.props.dataStore.apps)
  }

  onChange = async ({ formData }) => {
    // onChange triggered for any field change.
    if (this.form.isFieldChanged('appId')) {
      // this.form.setRequired(['customText'], true)
      this.form.showFields(['customText'])

      const services = await fetchServices()
      this.form.setEnumAndNames('serviceId', services)
      delete formData.serviceId
    }
    await this.form.updateChanges({ formData })
  }

  onSubmit = async ({ formData }) => {
    this.setState({ submitting: true })
    await Utils.sleep(1500)
    const { error } = this.props.onSubmit({ formData }) // let parent handles submit
    if (!error) {
      this.onHide()
    }
  }

  onHide = () => {
    this.setState({ submitting: false })
    this.props.onHide()
  }

  render () {
    return (
      <WingsModal show={true} onHide={this.onHide} submitting={this.state.submitting}>
        <Modal.Header closeButton>
          <Modal.Title>Test Modal - Simple Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsDynamicForm
            name="Test Modal - Simple Form"
            ref={f => (this.form = f)}
            onInitializeForm={this.onInitializeForm}
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            widgets={widgets}
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

export default TestModal



// WEBPACK FOOTER //
// ../src/containers/TestPage/TestModal.js