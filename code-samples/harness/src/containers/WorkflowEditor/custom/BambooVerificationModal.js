import React from 'react'
import { Modal } from 'react-bootstrap'
import Select from 'react-select'
import {
  WingsForm,
  WingsModal,
  Utils,
  InlineEditableText,
  ArtifactPlanSelection,
  CustomFieldTemplate,
  FormUtils
} from 'components'
import apis from 'apis/apis'
import css from './BambooVerificationModal.css'

const customSelect = props => {
  const options = Utils.enumArrToSelectArr(props.schema.enum || [], props.schema.enumNames || [])
  const placeholder = 'Please select a value...'

  return (
    <Select
      key={1}
      value={props.value ? props.value : null}
      placeholder={placeholder}
      options={options}
      onChange={selected => {
        const val = selected ? selected.value : null
        props.onChange(val)
      }}
    />
  )
}

const widgets = {
  customSelect: customSelect
}

export default class BambooVerificationModal extends React.Component {
  state = {
    formData: {},
    schema: {},
    uiSchema: {},
    initialized: false,
    submitting: false
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

  init = props => {
    const schema = !props.schema ? {} : Utils.clone(props.schema)
    const uiSchema = !props.uiSchema ? {} : Utils.clone(props.uiSchema)

    uiSchema.planName = { 'ui:widget': 'customSelect', 'ui:disabled': true }

    const formData = Utils.clone(props.formData)

    if (!formData.hasOwnProperty('timeoutMillis') || !formData.timeoutMillis) {
      formData.timeoutMillis = Number(schema.properties.timeoutMillis.default)
    }

    this.setState({ schema, initialized: true, formData, uiSchema })
    if (formData.planName) {
      this.fetchArtifactPlanNames(formData.bambooConfigId)
      if (this.props.templateWorkflow) {
        FormUtils.addTemplateFieldsToSchema(schema, formData)
        this.isEdit = true
      }
    }
  }

  onChange = ({ formData }) => {
    const prevFormData = Utils.clone(this.state.formData)
    if (formData && formData.bambooConfigId !== prevFormData.bambooConfigId) {
      this.appendingLoadingToDropDown()
      this.fetchArtifactPlanNames(formData.bambooConfigId)
    }
    this.setState({ formData })
  }

  fetchArtifactPlanNames = (bambooConfigId, parentPlanName = null) => {
    const appId = Utils.appIdFromUrl()
    const url = apis.getBuildSourcePlansEndpoint(appId, bambooConfigId, parentPlanName)
    apis.service
      .list(url)
      .then(res => {
        if (res.resource) {
          this.updatePlans(res.resource, bambooConfigId)
        } else {
          console.log('No plan names available')
        }
      })
      .catch(error => {
        throw error
      })
  }

  appendingLoadingToDropDown = () => {
    const schema = Utils.clone(this.state.schema)
    const uiSchema = Utils.clone(this.state.uiSchema)

    uiSchema.planName = { 'ui:disabled': true, 'ui:placeholder': 'Loading...' }
    if (!schema.properties.planName) {
      return
    }
    schema.properties.planName['enum'] = ['Loading...']
    schema.properties.planName['enumNames'] = ['Loading...']
    this.setState({ schema, uiSchema })
  }

  removeDisableOnFields = uiSchema => {
    if (uiSchema) {
      const formData = Utils.clone(this.state.formData)
      const uiClassName = { classNames: '__selectElement' }
      uiSchema.artifactStreamType = uiClassName
      uiSchema.settingId = { classNames: '__selectElement pull-right' }
      if (formData.artifactStreamType !== 'BAMBOO') {
        uiSchema.planName = { 'ui:widget': 'customSelect' }
      }
    }
  }

  updatePlans (plans) {
    if (plans) {
      const __schema = Utils.clone(this.state.schema)
      const __uiSchema = Utils.clone(this.state.uiSchema)

      if (Array.isArray(plans)) {
        __schema.properties.planName['enum'] = plans
        __schema.properties.planName['enumNames'] = plans
      } else {
        __schema.properties.planName['enum'] = Object.keys(plans)
        __schema.properties.planName['enumNames'] = Object.values(plans)

        // removing the disability on schema fields
        this.removeDisableOnFields(__uiSchema)
      }

      this.setState({
        schema: __schema,
        uiSchema: __uiSchema,
        key: Math.random()
      })
    }
  }

  filterPlanList = result => {
    return Object.values(result).map(res => {
      if (!res.folder) {
        return res.planName
      }
    })
  }

  modifyPlanUiSchema = (result, settingUuid) => {
    const appId = Utils.appIdFromUrl()
    const formData = Utils.clone(this.state.formData)
    return (
      <div>ArtifactPlanSelection MISSING </div>
      /*<ArtifactPlanSelection
        planList={result}
        appIdFromUrl={appId}
        settingUuId={settingUuid}
        modifyPlanName={this.modifyPlanName.bind(this)}
        modifyPlanNameEnum={this.modifyPlanNameEnum.bind(this)}
        planName={formData.planName}
      />*/
    )
  }

  modifyPlanNameEnum = list => {
    const __schema = Utils.clone(this.state.schema)
    const oldList = __schema.properties.planName.enum
    __schema.properties.planName.enum = oldList.concat(list)

    __schema.properties.planName.enumNames = oldList.concat(list)
    this.setState({ schema: __schema })
  }

  modifyPlanName = (planName, parentPlanName) => {
    const formData = Utils.clone(this.state.formData)
    formData.planName = this.getPlanPath(planName, parentPlanName)
    this.onChange({ formData })
  }

  onSubmit = ({ formData }) => {
    const schema = Utils.clone(this.state.schema)
    if (!formData.hasOwnProperty('timeoutMillis') || !formData.timeoutMillis) {
      formData.timeoutMillis = Number(schema.properties.timeoutMillis.default)
    }
    /* if (this.props.templateWorkflow) {
      FormUtils.transformDataForTemplatization(formData, schema)
    }*/
    this.props.onSubmit({ formData })
  }

  getPlanPath = (planName, parentPlanName, encode = false) => {
    const path = parentPlanName ? `${parentPlanName}/${planName}` : planName
    return encode ? encodeURIComponent(path) : path
  }

  onHide = () => {
    this.props.onHide()
  }

  getFieldTemplate = () => {
    if (this.state.formData && this.isEdit) {
      if (this.props.templateWorkflow) {
        return CustomFieldTemplate
      } else {
        return undefined
      }
    }
  }

  render () {
    return (
      <WingsModal className={css.main} show={this.props.show} onHide={this.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>
            <InlineEditableText onChange={this.props.onTitleChange}>
              {this.props.title} {/* adding inline editing*/}
            </InlineEditableText>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsForm
            name="Bamboo"
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            widgets={widgets}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            key={this.state.key}
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
// ../src/containers/WorkflowEditor/custom/BambooVerificationModal.js