import React from 'react'
import { Modal } from 'react-bootstrap'
import {
  WingsForm,
  WingsModal,
  Utils,
  FormUtils,
  MultiSelectDropdown,
  InlineEditableText,
  FormFieldTemplate
} from 'components'
import css from './AwsCodeDeployStepModal.css'

export default class AwsCodeDeployStepModal extends React.Component {
  state = {
    formData: {},
    schema: {},
    uiSchema: {},
    initialized: false,
    submitting: false,
    defaultTimeDuration: '',
    showMultiSelect: false
  }
  isEdit = false
  showAdvancedSettings = false
  componentWillMount () {
    if (this.props.show) {
      this.init(this.props)
    }
  }
  componentWillReceiveProps (newProps) {
    if (newProps.show) {
      this.init(newProps)
    }
  }

  init = async props => {
    const schema = !props.schema ? {} : FormUtils.clone(props.schema)
    const uiSchema = !props.uiSchema ? {} : FormUtils.clone(props.uiSchema)
    this.updateSchema(schema)
    this.showSettings(uiSchema)
    // this.hideAdvancedSettings(uiSchema)
    const formData = Utils.clone(props.formData)
    await this.setState({
      schema,
      uiSchema,
      formData
    })
  }

  updateSchema = schema => {
    schema.properties.autoRollbackConfigurations.items.enum = schema.properties.autoRollbackConfigurations.enum || []
    schema.properties.autoRollbackConfigurations.items.enumNames =
      schema.properties.autoRollbackConfigurations.enumNames || []

    delete schema.properties.autoRollbackConfigurations.enum

    delete schema.properties.autoRollbackConfigurations.enumNames
    schema.properties.autoRollbackConfigurations.uniqueItems = true
  }

  hideAdvancedSettings = uiSchema => {
    uiSchema.autoRollbackConfigurations = {
      'ui:widget': 'hidden'
    }
    uiSchema.enableAutoRollback = {
      'ui:widget': 'hidden'
    }
    uiSchema.fileExistsBehavior = {
      'ui:widget': 'hidden'
    }
    uiSchema.ignoreApplicationStopFailures = { 'ui:widget': 'hidden' }
  }
  showSettings = uiSchema => {
    let fileExistsUrl = 'http://docs.aws.amazon.com/codedeploy/latest/userguide/deployments-rollback-and-redeploy.html'
    fileExistsUrl += '#deployments-rollback-and-redeploy-content-options'
    let helpTextForEnableAutoRollBack = 'You can configure rollback options that apply only to this deployment. '
    helpTextForEnableAutoRollBack +=
      'The rollback options you select here are used instead of those configured for the deployment group'
    uiSchema.autoRollbackConfigurations = {
      'ui:widget': this.renderUiWidgetForAutoRollBack.bind(this),
      classNames: css.marginTop
    }
    uiSchema.enableAutoRollback = {
      classNames: css.customField,
      'ui:help': helpTextForEnableAutoRollBack
    }

    uiSchema.fileExistsBehavior = {
      'ui:help': `Choose the action for AWS CodeDeploy to take during a deployment when a file on a
        target instance has the same name as a file in the application revision, for the same target location.`,
      'custom:LinkText': 'Learn More',
      'custom:url': fileExistsUrl,
      classNames: css.marginTop
    }
    uiSchema.ignoreApplicationStopFailures = {
      'ui:help': 'Don\'t fail deployment to an instance if this lifecycle event on the instance fails',
      classNames: css.customField
    }
  }
  onEnableRollBackConfiguration = async (event, label) => {
    const formData = FormUtils.clone(this.state.formData)
    const isChecked = event.target.checked
    const showMultiSelect = isChecked ? true : false
    formData.enableAutoRollback = isChecked
    await this.setState({ formData, showMultiSelect, key: Math.random() })
  }
  getAutoRollBackEnumOptions = schema => {
    const enums = schema.items['enum']
    const enumNames = schema.items['enumNames']
    const autoRollBackOptns = []
    enums.map(option => {
      const enmIdx = schema.items['enum'].findIndex(optn => optn === option)
      const label = enumNames[enmIdx]
      autoRollBackOptns.push({ label, value: option })
    })
    return autoRollBackOptns
  }

  renderUiWidgetForAutoRollBack = props => {
    const autoRollBackOptns = this.getAutoRollBackEnumOptions(props.schema)
    return (
      <div>
        {this.state.formData.enableAutoRollback &&
          <MultiSelectDropdown
            description="Select Auto RollBack Configuration"
            {...props}
            data={autoRollBackOptns}
            onChange={val => {
              this.updateAutoRollBackOptions(val)
            }}
          />}
      </div>
    )
  }
  updateAutoRollBackOptions = (selectedValue, label) => {
    const selectedArr = selectedValue ? selectedValue.split(',') : []
    const data = FormUtils.clone(this.state.formData)
    if (selectedArr) {
      data['autoRollbackConfigurations'] = selectedArr
      this.setState({ formData: data })
    }
  }
  hideEnableAutoRollBack = uiSchema => {}
  onHide = () => {
    this.setState({ formData: {} })
    this.isEdit = false
    this.props.onHide()
  }

  toggleAdvancedSettings = () => {
    const uiSchema = FormUtils.clone(this.state.uiSchema)
    if (!this.showAdvancedSettings) {
      this.showAdvancedSettings = true
      this.showSettings(uiSchema)
    } else {
      this.showAdvancedSettings = false
      this.hideAdvancedSettings(uiSchema)
    }
    this.setState({ uiSchema, key: Math.random() })
  }

  renderAdvancedSettingsBtn = () => {
    return (
      <button className={'btn btn-link'} onClick={this.toggleAdvancedSettings}>
        Advanced Settings
      </button>
    )
  }
  onChange = ({ formData }) => {
    if (formData.enableAutoRollback !== this.state.formData.enableAutoRollback) {
      if (!formData.enableAutoRollback) {
        delete formData.autoRollbackConfigurations
      }
      this.setState({ formData, key: Math.random() })
    } else {
      this.setState({ formData })
    }
  }
  onSubmit = ({ formData }) => {
    this.props.onSubmit({ formData })
  }
  validate = ({ formData }) => {}
  render () {
    return (
      <WingsModal className={css.main} show={this.props.show} onHide={this.onHide}>
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
          >
            <button type="submit" className={`btn btn-primary ${css.submitBtn}`} disabled={this.state.submitting}>
              Submit
            </button>
          </WingsForm>
        </Modal.Body>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/WorkflowEditor/custom/AwsCodeDeployStepModal.js