import React from 'react'
import { Modal } from 'react-bootstrap'
import Select from 'react-select'
import { WingsForm, WingsModal, Utils, InlineEditableText, ArtifactJobSelection, CustomFieldTemplate } from 'components'
import apis from 'apis/apis'
import css from './JenkinsVerificationModal.css'

export default class JenkinsVerificationModal extends React.Component {
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

  customSelect = props => {
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

  init = props => {
    const schema = !props.schema ? {} : Utils.clone(props.schema)
    const uiSchema = !props.uiSchema ? {} : Utils.clone(props.uiSchema)
    uiSchema.jobName = { 'ui:disabled': true }
    const formData = Utils.clone(props.formData)

    if (!formData.hasOwnProperty('timeoutMillis') || !formData.timeoutMillis) {
      formData.timeoutMillis = Number(schema.properties.timeoutMillis.default)
    }

    this.setState({ schema, initialized: true, formData, uiSchema })
    if (formData.jobName) {
      // this.appendingLoadingToDropDown(schema)
      this.fetchArtifactJobNames(formData.jenkinsConfigId)
      if (this.props.templateWorkflow) {
        // FormUtils.addTemplateFieldsToSchema(schema, formData)
        this.isEdit = true
      }
    }
  }

  onChange = ({ formData }) => {
    const prevFormData = Utils.clone(this.state.formData)
    if (formData && formData.jenkinsConfigId !== prevFormData.jenkinsConfigId) {
      this.appendingLoadingToDropDown()
      this.fetchArtifactJobNames(formData.jenkinsConfigId)
    }
    this.setState({ formData })
  }

  fetchArtifactJobNames = (jenkisConfigId, parentJobName = null) => {
    const appId = Utils.appIdFromUrl()
    const url = apis.getJenkinsBuildJobsEndPoint(appId, jenkisConfigId, parentJobName)
    apis.service
      .list(url)
      .then(res => {
        if (res.resource) {
          this.updateJobs(res.resource, jenkisConfigId)
        } else {
          console.log('No job names available')
        }
      })
      .catch(error => {
        throw error
      })
  }

  appendingLoadingToDropDown = () => {
    const schema = Utils.clone(this.state.schema)
    const uiSchema = Utils.clone(this.state.uiSchema)

    uiSchema.jobName = { 'ui:disabled': true, 'ui:placeholder': 'Loading...' }
    if (!schema.properties.jobName) {
      return
    }
    schema.properties.jobName['enum'] = ['Loading...']
    schema.properties.jobName['enumNames'] = ['Loading...']
    this.setState({ schema, uiSchema })
  }

  updateJobs (jobs, jenkinsConfigId) {
    if (jobs) {
      const __schema = Utils.clone(this.state.schema)
      const _uiSchema = Utils.clone(this.state.uiSchema)
      const jobList = this.filterJobList(jobs)

      __schema.properties.jobName['enum'] = jobList
      __schema.properties.jobName['enumNames'] = jobList

      _uiSchema.jobName = { 'ui:widget': this.modifyJobUiSchema.bind(this, jobs, jenkinsConfigId) }
      this.setState({ schema: __schema, uiSchema: _uiSchema, key: Math.random() })
    }
  }

  filterJobList = result => {
    return Object.values(result).map(res => {
      if (!res.folder) {
        return res.jobName
      }
    })
  }

  modifyJobUiSchema = (result, settingUuid) => {
    const appId = Utils.appIdFromUrl()
    const formData = Utils.clone(this.state.formData)
    return (
      <ArtifactJobSelection
        jobList={result}
        appIdFromUrl={appId}
        settingUuId={settingUuid}
        modifyJobName={this.modifyJobName.bind(this)}
        modifyJobNameEnum={this.modifyJobNameEnum.bind(this)}
        jobName={formData.jobName}
      />
    )
  }

  modifyJobNameEnum = list => {
    const __schema = Utils.clone(this.state.schema)
    const oldList = __schema.properties.jobName.enum
    __schema.properties.jobName.enum = oldList.concat(list)

    __schema.properties.jobName.enumNames = oldList.concat(list)
    this.setState({ schema: __schema })
  }

  modifyJobName = (jobName, parentJobName) => {
    const formData = Utils.clone(this.state.formData)
    formData.jobName = this.getJobPath(jobName, parentJobName)
    this.onChange({ formData })
  }

  /* delete jobparameters on formdata if none of them are entered
 */
  modifyJobParameters = formData => {
    const jobParameters = formData.jobParameters
    if (jobParameters) {
      let noItemCount = 0

      for (const item of jobParameters) {
        if (!item.key && !item.value) {
          noItemCount++
        }
      }

      if (formData.jobParameters.length === noItemCount) {
        delete formData.jobParameters
      }
    }
  }

  onSubmit = ({ formData }) => {
    const schema = Utils.clone(this.state.schema)
    if (!formData.hasOwnProperty('timeoutMillis') || !formData.timeoutMillis) {
      formData.timeoutMillis = Number(schema.properties.timeoutMillis.default)
    }
    this.modifyJobParameters(formData)
    this.props.onSubmit({ formData })
  }

  getJobPath = (jobName, parentJobName, encode = false) => {
    const path = jobName
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
            name="Jenkins"
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
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
// ../src/containers/WorkflowEditor/custom/JenkinsVerificationModal.js