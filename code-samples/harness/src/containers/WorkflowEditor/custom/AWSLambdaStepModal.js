import React from 'react'
import { Modal } from 'react-bootstrap'
import {
  WingsForm,
  WingsModal,
  Utils,
  FormUtils,
  InlineEditableText,
  FormFieldTemplate,
  SearchableSelect
} from 'components'
const widgets = {
  SearchableSelect
}
export default class AwsLambdaStepModal extends React.Component {
  state = {
    formData: {},
    schema: {},
    uiSchema: {},
    initialized: false,
    widgets
  }

  componentWillMount () {
    if (this.props.show) {
      this.init(this.props)
    }
  }
  componentWillReceiveProps (newProps) {
    if (newProps.show) {
      const { appId } = newProps

      this.applicationId = appId
      this.init(newProps)
    }
  }
  init = async props => {
    const schema = !props.schema ? {} : FormUtils.clone(props.schema)
    const uiSchema = !props.uiSchema ? {} : FormUtils.clone(props.uiSchema)
    if (schema) {
      await this.updateSchema(schema, uiSchema)
    }
    // this.showSettings(uiSchema)
    // this.hideAdvancedSettings(uiSchema)
    const formData = Utils.clone(props.formData)

    if (!this.props.data) {
      formData.aliases = '${env.name}'
    } else if (formData.aliases) {
      formData.aliases = formData.aliases.join(',')
    }
    await this.setState({
      schema,
      uiSchema,
      formData
    })
  }
  updateSchema = async (schema, uiSchema) => {
    if (schema) {
      schema.properties.aliases = {
        type: 'string',
        title: 'Aliases',
        default: '${env.name}'
      }

      const uiOrder = uiSchema['ui:order']
      uiOrder.push('aliases')
      /* const applicationId = this.props.appId
      const { infraMappingId } = this.props.custom
      const roleProperty = schema.properties.role
      if (roleProperty) {
        const { roles } = await InfrasService.getIamRoles({ applicationId, infraMappingId })
        roleProperty.enum = Object.keys(roles)
        roleProperty.enumNames = Object.values(roles)
        uiSchema.role = { 'ui:widget': 'SearchableSelect' }
      }*/
    }
  }

  onChange = ({ formData }) => {}

  modifyAliasesOnFormData = formData => {
    if (formData.aliases) {
      const aliases = formData.aliases
      const aliasArr = aliases.split(',')

      formData.aliases = aliasArr
    }
  }

  onSubmit = ({ formData }) => {
    this.modifyAliasesOnFormData(formData)

    this.props.onSubmit({ formData })
  }

  validate = ({ formData }) => {}

  onHide = () => {
    this.props.onHide()
  }

  render () {
    return (
      <WingsModal show={this.props.show} onHide={this.onHide}>
        <Modal.Header closeButton>
          <InlineEditableText onChange={this.props.onTitleChange}>
            {this.props.title}
          </InlineEditableText>
        </Modal.Header>
        <Modal.Body>
          <WingsForm
            name="Aws Code Deploy"
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            key={this.state.key}
            FieldTemplate={FormFieldTemplate}
            widgets={this.state.widgets}
          >
            <button type="submit" className="btn btn-primary" disabled={this.state.submitting}>
              Submit
            </button>
          </WingsForm>
        </Modal.Body>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/WorkflowEditor/custom/AWSLambdaStepModal.js