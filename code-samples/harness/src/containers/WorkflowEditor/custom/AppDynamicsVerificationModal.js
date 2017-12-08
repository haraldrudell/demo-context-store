import React from 'react'
import { Modal } from 'react-bootstrap'
import { WingsForm, WingsModal, Utils, AppStorage, CustomFieldTemplate, FormUtils } from 'components'
import apis from 'apis/apis'
import css from './AppDynamicsVerificationModal.css'
const dependencyMap = {
  analysisServerConfigId: 'applicationId',
  applicationId: 'tierId'
}
export default class AppDynamicsVerificationModal extends React.Component {
  state = {
    formData: {},
    schema: {},
    uiSchema: {},
    initialized: false,
    submitting: false,
    defaultTimeDuration: ''
  }
  isEdit = false
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

  init (props) {
    const schema = !props.schema ? {} : Utils.clone(props.schema)
    const uiSchema = !props.uiSchema ? {} : Utils.clone(props.uiSchema)
    const formData = Utils.clone(props.formData)

    const applicationId = formData.applicationId
    const tierId = formData.tierId

    formData.applicationId = ''
    formData.tierId = ''
    this.customizeAppDynamicsUiSchema(uiSchema)

    const timeDuration =
      schema && schema.properties && schema.properties.timeDuration ? schema.properties.timeDuration.default : ''
    this.setState({
      schema,
      initialized: true,
      formData,
      defaultTimeDuration: timeDuration
    })

    if (formData.analysisServerConfigId) {
      this.isEdit = true
      this.onEdit(schema, uiSchema, formData)
      this.fetchDataForAppConfig(formData, applicationId, tierId, uiSchema)
    }
  }
  getDependentFormData = formData => {
    const dependentData = {}
    const schema = FormUtils.clone(this.state.schema)
    if (formData.analysisServerConfigId) {
      const enmIdx = schema.properties['analysisServerConfigId'].enum.findIndex(
        optn => optn === formData.analysisServerConfigId
      )
      const originalValue = schema.properties['analysisServerConfigId'].enumNames[enmIdx]
      const dependentField = dependencyMap.analysisServerConfigId
      dependentData[dependentField] = `analysisServerConfigId-${originalValue}`
    }
    if (formData.applicationId) {
      const enmIdx = schema.properties['applicationId'].enum.findIndex(optn => optn === formData.applicationId)
      const originalValue = schema.properties['applicationId'].enumNames[enmIdx]
      const dependentField = dependencyMapp.applicationId
      dependentData[dependentField] = `applicationId-${originalValue}`
    }
    return dependentData
  }
  onEdit = (schema, uiSchema, data) => {
    data.applicationId = ''
    data.tierId = ''
    schema.properties.applicationId['enum'] = ['']
    schema.properties.applicationId['enumNames'] = ['Loading...']
    schema.properties.tierId['enum'] = ['']
    schema.properties.tierId['enumNames'] = ['Loading...']
    uiSchema.analysisServerConfigId = { 'ui:disabled': true }

    this.setState({ schema, uiSchema, defaultTimeDuration: data.timeDuration })
  }
  fetchDataForAppConfig = (formData, applicationId, tierId, uiSchema) => {
    // const uiSchema = Utils.clone(this.state.uiSchema)
    // const schema = Utils.clone(this.state.schema)
    let data = Utils.clone(this.state.formData)
    const settingId = formData.analysisServerConfigId

    if (settingId) {
      const fetchArr = [
        this.fetchAppDynamicsApplications({ analysisServerConfigId: settingId }),
        this.fetchTierName({ analysisServerConfigId: settingId, applicationId: applicationId })
      ]
      Promise.all(fetchArr)
        .then(result => {
          uiSchema.analysisServerConfigId = {}
          uiSchema.tierId = {}
          uiSchema.applicationId = {}
          data = formData
          data.analysisServerConfigId = settingId
          // const appEnumIdx = schema.properties.applicationId.enu.findIndex ( (item) => item === data.applicationName)
          data.applicationId = applicationId
          data.tierId = tierId

          /*  uiSchema['ui:order'] = uiSchema['ui:order']*/
          this.setState({ submitting: false, uiSchema, formData: data })
        })
        .catch(error => {
          throw error
        })
    }
  }
  customizeAppDynamicsUiSchema = uiSchema => {
    uiSchema.applicationId = { 'ui:disabled': true }
    uiSchema.tierId = { 'ui:disabled': true }
    uiSchema.timeDuration = { 'ui:widget': this.renderTimeDurationUI }
    this.setState({ uiSchema })
  }

  renderTimeDurationUI = props => {
    const defaultValue = Number(this.state.defaultTimeDuration)

    return (
      <input
        type="number"
        className={css.numberInput}
        value={defaultValue}
        onChange={event => this.onNumberChange(event.currentTarget.value)}
      />
    )
  }

  onHide = () => {
    this.setState({ formData: {} })
    this.isEdit = false
    this.props.onHide()
  }
  onNumberChange = value => {
    const data = Utils.clone(this.state.formData)
    data.timeDuration = value.toString()
    this.setState({ formData: data, defaultTimeDuration: data.timeDuration })
  }

  onChange = ({ formData }) => {
    const data = Utils.clone(this.state.formData)
    const schema = Utils.clone(this.state.schema)
    //  const uiSchema = Utils.clone(this.state.uiSchema)
    if (formData.analysisServerConfigId !== data.analysisServerConfigId) {
      if (formData.analysisServerConfigId) {
        formData.applicationId = ''
        formData.tierId = ''
        schema.properties.applicationId['enum'] = ['']
        schema.properties.applicationId['enumNames'] = ['Loading...']
        this.setState({ submitting: true, formData, schema })
        this.fetchAppDynamicsApplications(formData)
      } else {
      }
    } else if (formData.applicationId !== data.applicationId && formData.applicationId !== '') {
      const enumIdx = schema.properties.applicationId.enum.findIndex(item => item === formData.applicationId)
      formData.applicationName = schema.properties.applicationId.enumNames[enumIdx]
      schema.properties.tierId['enum'] = ['']
      schema.properties.tierId['enumNames'] = ['Loading...']
      this.setState({ submitting: true, formData, schema })
      this.fetchTierName(formData)
    } else if (formData.tierId !== data.tierId) {
      const enumIdx = schema.properties.tierId.enum.findIndex(item => item === formData.tierId)
      formData.tierName = schema.properties.tierId.enumNames[enumIdx]
      this.setState({ formData })
    } else {
      this.setState({ formData })
    }
  }

  fetchApplication = (accountId, appId, settingId) => {
    if (accountId && appId && settingId) {
      return apis.service.list(apis.getTierNameForAppDynamicsApplication(accountId, settingId, appId))
    }
  }
  fetchAppDynamicsApplications = data => {
    const settingId = data.analysisServerConfigId
    const accountId = AppStorage.get('acctId')

    return apis.service
      .list(apis.getAppDynamicsApplications(accountId, settingId))
      .then(result => {
        const schema = Utils.clone(this.state.schema)
        const uiSchema = Utils.clone(this.state.uiSchema)
        if (!result || !result.resource || result.resource.length === 0) {
          return
        }
        schema.properties.applicationId = { type: 'string', title: 'Application Name' }
        schema.properties.applicationId['enum'] = result.resource.map(item => item.id.toString())
        schema.properties.applicationId['enumNames'] = result.resource.map(item => item.name)
        uiSchema.applicationId = {}
        uiSchema.timeDuration = { 'ui:widget': this.renderTimeDurationUI }
        this.setState({ schema, uiSchema, formData: data, submitting: false })
      })
      .catch(error => {
        const schema = Utils.clone(this.state.schema)
        schema.properties.applicationId = { type: 'string', title: 'Application Name' }
        schema.properties.applicationId['enum'] = ['']
        schema.properties.applicationId['enumNames'] = ['']
        this.setState({ submitting: false, schema })
      })
  }
  fetchTier = (accountId, appId, settingId) => {
    if (accountId && appId && settingId) {
      return apis.service.list(apis.getTierNameForAppDynamicsApplication(accountId, settingId, appId))
    }
  }
  fetchTierName = data => {
    const accountId = AppStorage.get('acctId')
    const settingId = data.analysisServerConfigId
    const appId = data.applicationId

    if (settingId && appId) {
      return apis.service
        .list(apis.getTierNameForAppDynamicsApplication(accountId, settingId, appId))
        .then(result => {
          const schema = Utils.clone(this.state.schema)
          const uiSchema = Utils.clone(this.state.uiSchema)
          schema.properties.tierId['enum'] = result.resource.map(item => item.id.toString())
          schema.properties.tierId['enumNames'] = result.resource.map(item => item.name)
          uiSchema.tierId = {}

          uiSchema.timeDuration = { 'ui:widget': this.renderTimeDurationUI }
          this.setState({ schema, uiSchema, formData: data, submitting: false })
        })
        .catch(error => {
          const schema = Utils.clone(this.state.schema)
          schema.properties.tierId['enum'] = ['']
          schema.properties.tierId['enumNames'] = ['']
          this.setState({ submitting: false, schema })
        })
    }
  }

  onSubmit = ({ formData }) => {
    const data = Utils.clone(formData)

    if (!Number(data.timeDuration)) {
      data.timeDuration = '15'
    }
    /* if (this.props.templateWorkflow) {
      FormUtils.transformDataForTemplatization(data, schema)
    }*/
    this.props.onSubmit({ formData: data })
  }

  renderFieldTemplate = () => {
    if (this.state.formData && this.isEdit) {
      if (this.props.templateWorkflow) {
        return CustomFieldTemplate
      } else {
        return undefined
      }
    }
  }
  validate = (formData, errors) => {
    const schema = Utils.clone(this.state.schema)
    FormUtils.transformDataForTemplatization(formData, schema)
    const templateExpressions = formData.templateExpressions
    if (templateExpressions) {
      for (const templateItem of templateExpressions) {
        const fieldName = templateItem.fieldName
        const dependentField = dependencyMap[fieldName]
        const ifDependentFieldExists = this.checkIfDependentFieldExists(dependentField, templateExpressions)
        if (!ifDependentFieldExists && dependentField) {
          const errorMsg = `Please Templatize ${dependentField} as ${fieldName} is Templatized`
          errors[dependentField].addError(errorMsg)
        } else {
          delete errors[dependentField]
        }
      }
    }
    return errors
  }

  checkIfDependentFieldExists = (dependentField, templateExpressions) => {
    for (const templateItem of templateExpressions) {
      const fieldName = templateItem.fieldName
      if (fieldName === dependentField) {
        return true
      }
    }
    return false
  }

  render () {
    return (
      <WingsModal className={css.main} show={this.props.show} onHide={this.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>AppDynamics Verification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsForm
            name="AppDynamics Verification"
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            onChange={this.onChange}
            onSubmit={this.onSubmit}

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
// ../src/containers/WorkflowEditor/custom/AppDynamicsVerificationModal.js