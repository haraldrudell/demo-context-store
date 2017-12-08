import React from 'react'
import { observer } from 'mobx-react'
import { WingsModal, Utils } from 'components'
import { Button, Modal } from 'react-bootstrap'
import { WingsForm, ServiceArtifactSelect, FormFieldTemplate, SearchableSelect } from 'components'
import css from './ExecPipelineModal.css'
import DeploymentNotes from '../DeploymentNotesForm/DeploymentNotesForm.js'

import { PipelinesService } from 'services'
import apis from 'apis/apis'
const requiredEntities = {
  artifact: 'ARTIFACT'
}
const widgets = {
  SearchableSelect
}

const schema = {
  type: 'object',
  required: ['appId', 'pipelineSelect', 'artifacts'],
  properties: {
    appId: { type: 'string', title: 'Application', enum: [], enumNames: [] },
    pipelineSelect: {
      type: 'string',
      title: 'Pipeline',
      enum: [],
      enumNames: []
    },
    artifacts: {
      type: 'string',
      title: 'Artifacts'
    },
    workflowVariables: {
      type: 'object',
      title: 'Workflow Variables',
      required: [],
      properties: {}
    }
  }
}

const uiSchema = {
  appId: {
    'ui:placeholder': 'Select Application',
    'ui:widget': 'SearchableSelect'
  },
  pipelineSelect: {
    'ui:placeholder': 'Select Pipeline',
    'ui:widget': 'SearchableSelect'
  },
  artifacts: { 'ui:widget': 'hidden' },
  workflowVariables: { 'ui:widget': 'hidden' }
}

@observer
export default class ExecPipelineModalV2 extends React.Component {
  state = {
    key: '',
    artifacts: [],
    selectedArtifacts: [],
    errors: '',
    schema,
    formData: {},
    serviceList: [],
    uiSchema,
    services: [],
    artifactClsName: '__hide',
    widgets,
    loading: true
  }
  artifactDataList = []
  artifactStreamData = []
  accountId = Utils.accountIdFromUrl()
  initialized = false

  componentWillReceiveProps (newProps) {
    if (newProps.show && !this.initialized) {
      this.initialized = true
      this.updateForm({ props: newProps, noUserInteraction: true })
    }
  }

  async updateForm ({ formData = {}, props = this.props, noUserInteraction = false }) {
    const _schema = Utils.clone(schema)
    const _uiSchema = Utils.clone(uiSchema)
    const { execution, pipelines, dataStore: { apps: allApps } } = props

    // If values exist in formData, use them (they are results of user interaction),
    // otherwise, get from props in which values are passed from a re-run action
    formData.appId = formData.appId || (noUserInteraction && props.appId)
    formData.pipelineSelect = formData.pipelineSelect || (noUserInteraction && props.pipelineId)
    formData.artifacts =
      formData.artifacts || (noUserInteraction && execution && this.buildFormDataArtifactsFromProps(props))

    _schema.properties.appId.enum = [...allApps.map(item => item.uuid)]
    _schema.properties.appId.enumNames = [...allApps.map(item => item.name)]

    // pipelineSelect is a sub-set of pipelines based on appId
    const filteredPipelines = formData.appId
      ? pipelines && pipelines.filter(pipeline => pipeline.appId === formData.appId)
      : []

    // Utils.addValidStatusToWorkflow(filteredPipelines, 'name', 'pipelines')
    _schema.properties.pipelineSelect.enum = filteredPipelines.map(item => item.uuid)
    _schema.properties.pipelineSelect.enumNames = filteredPipelines.map(item => item.name)

    const customOptions = Utils.getSelectOptionsForPipelineOrWorkflow(filteredPipelines, 'pipelines')

    _schema.properties.pipelineSelect['custom:options'] = customOptions
    _uiSchema.artifacts = { 'ui:widget': 'hidden' }
    this.modifySchemaForRerun(_uiSchema)
    const loading = execution ? true : false

    this.setState({ schema: _schema, uiSchema: _uiSchema, formData, loading })

    // If execution is passed, this is a re-run, fetch, fill, and select artifacts

    if (noUserInteraction && execution) {
      // this.fetchArtifacts({ formData })
      await this.checkForRequiredEntities({ formData })
    }
  }

  modifySchemaForRerun = _uiSchema => {
    const { pipelineId, pipelines } = this.props
    if (pipelineId) {
      _uiSchema['appId']['ui:widget'] = 'hidden'
      _uiSchema['pipelineSelect']['ui:widget'] = 'hidden'

      const selectedPipeline = pipelines.find(pipeline => pipeline.uuid === pipelineId)
      if (selectedPipeline) {
        this.props.getExecutionName(selectedPipeline.name)
      }
    }
  }

  buildFormDataArtifactsFromProps = props => {
    const artifacts = Utils.getJsonValue(props, 'execution.executionArgs.artifacts')
    return artifacts ? artifacts.map(artifact => artifact.uuid) : undefined
  }

  fetchArtifacts = async ({ formData }) => {
    const { accountId } = this.props
    const { appId, pipelineSelect } = formData
    const { services, error } = await PipelinesService.getPipelineServices(accountId, appId, pipelineSelect)

    if (error) {
      return this.setState({ errors: 'Failed to fetch pipeline services' })
    }

    const serviceIds = services.map(service => service.uuid)

    this.serviceIdList = serviceIds

    this.setState({ serviceArray: services })

    this.artifactDataList = []
    this.artifactStreamData = []

    const fetchArr = [this.getArtifacts(appId, serviceIds), this.getArtifactStreams(appId, serviceIds)]

    await Promise.all(fetchArr).then(_ => {
      const _uiSchema = Utils.clone(this.state.uiSchema)
      const artifacts = this.artifactDataList
      const streamData = this.artifactStreamData
      const groupedArtifacts = ServiceArtifactSelect.groupArtifactBuildsByService(services, artifacts, streamData)
      const uiWidget =
        groupedArtifacts.serviceNames.length > 0 ? this.renderArtifactComponent.bind(this, groupedArtifacts) : 'hidden'

      _uiSchema.artifacts = {
        'ui:widget': uiWidget,
        classNames: '__artifactSelect'
      }

      this.setState({
        services: services,
        serviceList: serviceIds,
        artifactList: this.artifactDataList,
        formData,
        uiSchema: _uiSchema,
        loading: false,
        key: Math.random()
      })
    })
  }

  onChange = async ({ formData }) => {
    if (this.state.formData.appId !== formData.appId) {
      this.updateForm({ formData })
    } else if (this.state.formData.pipelineSelect !== formData.pipelineSelect) {
      await this.checkForRequiredEntities({ formData })
    }
  }

  checkForRequiredEntities = async ({ formData }) => {
    const { appId, pipelineSelect: pipelineId } = formData
    const { error, resource: reqEntities } = await PipelinesService.getRequiredEntitiesForPipelineExecution({
      appId,
      pipelineId
    })
    if (error) {
      return
    }
    this.pipelineRequiredEntities = reqEntities
    if (reqEntities.includes(requiredEntities.artifact)) {
      this.fetchArtifacts({ formData })
    } else {
      this.setState({ formData, loading: false })
    }
  }

  getArtifacts = (appId, serviceIdArr, searchFilter = null) => {
    return apis.fetchArtifactsForPipeLines(appId, serviceIdArr, searchFilter).then(artifactsData => {
      this.artifactDataList = artifactsData.resource.response
    })
  }

  getArtifactStreams = (appId, serviceIdArr) => {
    return apis.fetchServiceArtifactStreamDataForDeployment(appId, serviceIdArr).then(result => {
      this.artifactStreamData = result.resource.response
    })
  }

  filterArtifactSelectByBuildNumber = buildNumber => {
    const formData = Utils.clone(this.state.formData)
    const serviceArr = Utils.clone(this.state.serviceArray)
    const serviceIds = serviceArr.map(service => service.uuid)
    this.serviceIdList = serviceIds
    const fetchArr = [
      this.getArtifacts(formData.appId, serviceIds, buildNumber),
      this.getArtifactStreams(formData.appId, serviceIds)
    ]

    return Promise.all(fetchArr).then(response => {
      return this.setUiWidget(serviceArr)
    })
  }

  setUiWidget = serviceArr => {
    const groupedArtifactsObj = ServiceArtifactSelect.groupArtifactBuildsByService(
      serviceArr,
      this.artifactDataList,
      this.artifactStreamData
    )
    return groupedArtifactsObj
  }

  isFormValid = formData => {
    const artifactExists = formData.artifacts && formData.artifacts.length > 0
    if (!this.pipelineRequiredEntities.includes(requiredEntities.artifact)) {
      return true
    } else if (formData.pipelineSelect !== '' && artifactExists) {
      if (this.serviceIdList && this.serviceIdList.length === formData.artifacts.length) {
        return true
      }
      return false
    }
    return false
  }

  onSubmit = () => {
    const uiSchema = Utils.clone(this.state.uiSchema)
    const formData = Utils.clone(this.state.formData)
    const artifactExists = formData.artifacts && formData.artifacts.length > 0

    if (this.isFormValid(formData)) {
      let data = {}
      data = Object.assign(formData, { notes: this.formNotes })
      this.props.onSubmit(data)

      this.initialized = false

      this.resetFormData()
    } else {
      let errorMessage

      if (formData.pipelineSelect === '' && !artifactExists) {
        errorMessage = 'Please select Pipeline and Artifact to execute.'
      } else if (formData.pipelineSelect === '') {
        errorMessage = 'Please select Pipeline to execute.'
      } else if (!artifactExists) {
        const uiWidget = uiSchema.artifacts['ui:widget']
        errorMessage =
          uiWidget !== 'hidden' ? 'Please select Artifacts to execute.' : 'Incomplete as there are no artifacts'
      } else if (this.serviceIdList && this.serviceIdList.length !== formData.artifacts.length) {
        errorMessage = 'Please Select Artifacts for all pipeline services'
      }

      this.setState({ errors: errorMessage, errorCls: css.error })
    }
  }

  renderArtifactComponent = (result, props) => {
    if (result.serviceNames.length > 0) {
      return (
        <ServiceArtifactSelect
          groupedServiceArtifactStreams={result}
          selectedArtifacts={this.state.formData.artifacts}
          setArtifactsOnFormData={this.updateArtifacts}
          filterArtifactSelectByBuildNumber={this.filterArtifactSelectByBuildNumber}
        />
      )
    } else {
      return <div />
    }
  }

  updateArtifacts = selectedValue => {
    const artifacts = selectedValue.split(',')
    const formData = Utils.clone(this.state.formData)
    formData.artifacts = artifacts
    this.setState({ formData })
  }

  hideModal = () => {
    this.artifactServices = []
    this.initialized = false
    this.props.onHide()
  }

  resetFormData = () => {
    this.initialised = false
    this.setState({ formData: {}, schema: {}, uiSchema: {} })
  }

  updateNotes = notes => {
    this.formNotes = notes
  }

  renderFormBody () {
    return (
      <div>
        <WingsForm
          name="Execute Pipeline"
          ref="form"
          schema={this.state.schema}
          uiSchema={this.state.uiSchema}
          formData={this.state.formData}
          FieldTemplate={FormFieldTemplate}
          onChange={this.onChange}
          key={this.state.key}
          widgets={this.state.widgets}
          className={css.main}
        >
          <DeploymentNotes updateNotes={this.updateNotes} showForm={true} />
          <div /> {/* use empty div to remove the default Submit button */}
          <div className="__footer">
            <Button bsStyle="primary" onClick={this.onSubmit} className="submit-button">
              Submit
            </Button>
          </div>
          <div className={this.state.errorCls}>{this.state.errors}</div>
        </WingsForm>
      </div>
    )
  }

  renderLoading = () => {
    return (
      <div className="big-loader-area">
        <i className="wings-spinner" />
        {'LOADING'}
      </div>
    )
  }

  renderContent = () => {
    const { loading } = this.state
    if (loading) {
      return this.renderLoading()
    } else {
      return this.renderFormBody()
    }
  }

  render () {
    if (this.props.renderAsSubForm) {
      return this.renderContent()
    }
    return (
      <WingsModal show={this.props.show} onHide={this.hideModal} className={css.main}>
        <Modal.Header closeButton>
          <Modal.Title>Execute Pipeline</Modal.Title>
        </Modal.Header>

        <Modal.Body>{this.renderContent()}</Modal.Body>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ArtifactPage/ExecPipelineModalV2.js