/** THIS FILE IS A WORK IN PROGRESS - CURRENTLY BROKEN **/
import React from 'react'
// import Select from 'react-select'
import { Button, Modal } from 'react-bootstrap'
import { observer } from 'mobx-react'
import { WingsModal, WingsDynamicForm, CompUtils, FormFieldTemplate, FormUtils } from 'components' // SearchableSelect
import { SearchableSelect } from 'components'
import { SettingsService } from 'services'
// import apis from 'apis/apis'

import PackageBasedSourceForms from './forms/Package'
import ImageBasedSourceForms from './forms/Image'
// import { uiSchema } from './forms/Package/Bamboo'

const baseFieldOrder = ['artifactStreamType', 'settingId']

const baseSchema = {
  type: 'object',
  required: ['artifactStreamType', 'settingId'],
  properties: {
    uuid: { type: 'string', title: 'uuid' },
    name: { type: 'string', title: 'Name' },
    autoPopulate: { type: 'boolean', title: 'Auto Generate Name', default: true },
    artifactStreamType: { type: 'string', title: 'Source Type' },
    settingId: {
      type: 'string',
      title: 'Source Server',
      enum: [],
      enumNames: [],
      'custom:dataProvider': 'fetchSourceServers'
    }
  },
  dataProviders: {
    fetchSourceServers: async ({ formData, formProps }) => {
      const { accountId } = formProps
      // appId = form.props.appId,
      const { artifactType } = formProps

      let type = artifactType

      if (artifactType === 'AMAZON_S3' || artifactType === 'ECR') {
        type = 'AWS'
      } else if (artifactType === 'GCR') {
        type = 'GCP'
      }

      if (accountId && type) {
        const { settings } = await SettingsService.fetchSettings({ accountId, type })
        return settings
      }

      return []
    }
  }
}
const baseUiSchema = {
  uuid: { 'ui:widget': 'hidden' },
  name: { 'ui:disabled': true },
  artifactStreamType: { 'ui:widget': 'hidden' },
  settingId: { 'ui:placeholder': 'Select Source', 'ui:widget': 'SearchableSelect' },
  'ui:order': ['name', 'autoPopulate', '*']
}

@observer
class ArtifactSourceModal extends React.Component {
  state = {
    initialized: false,
    dependencyFieldOrder: [],
    schema: {},
    uiSchema: {},
    formData: {},
    widgets: {},
    isError: false
  }

  formEventHandlers

  setComponentState = async state => {
    await CompUtils.setComponentState(this, state)
  }

  componentWillMount = async () => {
    const sourceForms = this.props.imageBasedSource ? ImageBasedSourceForms : PackageBasedSourceForms

    // Handle specialized form and fallback to generic
    this.formType =
      sourceForms[this.props.artifactType + '_' + this.props.serviceArtifactType] || // (ex. ARTIFACTORY_RPM)
      sourceForms[this.props.artifactType]
    const dependencyFieldOrder = [].concat(baseFieldOrder, this.formType.dependencyFieldOrder)
    const layoutFieldOrder = [].concat(baseFieldOrder, this.formType.layoutFieldOrder)

    const formData = WingsDynamicForm.toFormData({ data: this.props.artifactSourceSelected }) || {}
    const schema = WingsDynamicForm.mergeSchemas(baseSchema, this.formType.schema, layoutFieldOrder)
    const uiSchema = WingsDynamicForm.mergeUiSchemas(baseUiSchema, this.formType.uiSchema, layoutFieldOrder)

    const widgets = { SearchableSelect, ...this.formType.widgets }
    formData.artifactStreamType = this.props.artifactType

    await this.setComponentState({
      initialized: true,
      dependencyFieldOrder,
      schema,
      uiSchema,
      formData,
      widgets
    })
    if (formData.uuid) {
      formData.autoPopulate
        ? this.removeNameFromRequired({ schema, uiSchema })
        : this.addNameToRequired({ schema, uiSchema })
    } else {
      this.removeNameFromRequired({ schema, uiSchema })
    }
  }

  onInitializeForm = async form => {
    this.formEventHandlers = this.formType.eventHandlers(this.form)
    await form.autoProcessInitialize(this.state.dependencyFieldOrder)
    // Custom type intializers

    const onInitializeForm = this.formEventHandlers.onInitializeForm
    if (onInitializeForm) {
      await onInitializeForm(form)
    }
    await form.setFormState({ loading: false })
  }

  onChange = async ({ formData }) => {
    const form = this.form

    if (form.isFieldChanged('artifactStreamType')) {
      this.wingsModal && this.wingsModal.resetErrorMessage()
    }

    await form.autoProcessChange(this.state.dependencyFieldOrder)

    const onChange = this.formEventHandlers.onChange

    if (onChange) {
      await onChange({ form, formData: form.buffer.formData })
    }

    if (form.isFieldChanged('autoPopulate')) {
      formData.autoPopulate ? await this.setUpNameAsRequiredField(true) : await this.setUpNameAsRequiredField(false)
      if (formData.autoPopulate) {
        form.buffer.formData.name = ''
      }
    }

    await form.updateChanges()
  }

  setUpNameAsRequiredField = async (isRequired, isEdit = false) => {
    const form = this.form
    const { schema, uiSchema } = form.buffer
    const requiredArr = schema.required
    if (isRequired) {
      this.removeNameFromRequired({ schema, uiSchema, requiredArr })
    } else {
      this.addNameToRequired({ schema, uiSchema, requiredArr })
    }

    await form.setFormState({ uiSchema, schema })
  }

  addNameToRequired = ({ schema, uiSchema, requiredArr = schema.required }) => {
    delete uiSchema.name['ui:disabled']
    uiSchema.name['ui:placeholder'] = 'Enter Custom Name'
    if (!requiredArr.includes('name')) {
      // requiredArr.push('name')
      FormUtils.setRequired(schema, ['name'], true)
    }
  }

  removeNameFromRequired = ({ schema, uiSchema, requiredArr = schema.required }) => {
    uiSchema.name['ui:disabled'] = true
    uiSchema.name['ui:placeholder'] = '(Name will be auto generated)'
    if (requiredArr.includes('name')) {
      requiredArr.splice('name')
    }
  }

  onSubmit = async ({ formData }) => {
    const form = this.form
    if (this.state.submitting) {
      return
    }
    const onSubmit = this.formEventHandlers.onSubmit
    await this.setComponentState({ submitting: true, initialized: false })
    // Custom type submit functions
    let error
    if (onSubmit) {
      const result = await onSubmit({ form, formData })
      error = result && result.error
    }
    await this.setComponentState({ submitting: false })
    if (!error) {
      setTimeout(_ => {
        // parent fetchData call needs fixing
        this.props.onSubmit()
        this.onHide()
      }, 50)
    } else {
      this.setState({ submitting: false, isError: true })
    }
  }

  onHide = async () => {
    await this.setComponentState({ initialized: false, schema: baseSchema, uiSchema: baseUiSchema })
    this.props.onHide()
  }

  render () {
    return (
      <WingsModal ref={m => (this.wingsModal = m)} show={true} onHide={this.onHide} submitting={this.state.submitting}>
        <Modal.Header closeButton>
          <Modal.Title>Artifact Source - {this.props.artifactTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsDynamicForm
            name="Artifact Source"
            ref={f => (this.form = f)}
            loading={!this.state.isError && (!this.state.submitting && Object.keys(this.state.formData).length > 1)}
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            widgets={this.state.widgets}
            onInitializeForm={this.onInitializeForm}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            serviceArtifactType={this.props.serviceArtifactType}
            artifactType={this.props.artifactType}
            accountId={this.props.accountId}
            appId={this.props.appId}
            serviceId={this.props.serviceId}
            FieldTemplate={FormFieldTemplate}
          >
            <Button bsStyle="default" type="submit" className="submit-button" disabled={this.state.submitting}>
              SUBMIT
            </Button>
          </WingsDynamicForm>
        </Modal.Body>
      </WingsModal>
    )
  }
}

export default ArtifactSourceModal



// WEBPACK FOOTER //
// ../src/containers/ServiceDetailPage/ArtifactSourceModal.js