import React from 'react'
import { Modal, Button } from 'react-bootstrap'

import { WingsModal, WingsDynamicForm, ServiceArtifactSelect, Utils, CompUtils, SearchableSelect } from 'components'
import DeploymentSubForm from './DeploymentSubForm'
import { WorkflowService } from 'services'
import css from './StartDeploymentModal.css'
import DeploymentNotes from '../DeploymentNotesForm/DeploymentNotesForm'

const fieldOrder = ['applicationId', 'orchestrationWorkflow']
const sortOrder = 'ASC'
const widgets = getForm => ({
  SearchableSelect,
  serviceArtifactSelection: props => {
    const form = getForm()
    if (!form) {
      return null
    }
    const onChange = props.onChange
    const fieldData = form.getFieldData('artifactSelect')

    const serviceNames = fieldData ? fieldData.serviceNames : []
    const resultObj = fieldData ? fieldData.groupedArtifacts : []
    const uniqServices = new Set(serviceNames)
    const data = form ? form.buffer.formData : {}
    const serviceArray = Array.from(uniqServices)

    const setArtifactsOnFormData = selectedArtifactStreams => {
      data.artifactSelect = selectedArtifactStreams
      onChange(selectedArtifactStreams)
    }
    const filterArtifactsByBuildNumber = async buildNumber => {
      const { data } = await form.fieldDataProviders.fetchArtifacts(buildNumber)
      return data
    }
    if (serviceArray.length > 0) {
      return (
        /*
          The props here are the input to the component
          services => list of services that which you want to list artifacts
        */
        <ServiceArtifactSelect
          services={serviceArray}
          selectedArtifacts={data.artifacts}
          artifacts={resultObj}
          setArtifactsOnFormData={setArtifactsOnFormData}
          filterArtifactSelectByBuildNumber={filterArtifactsByBuildNumber}
        />
      )
    } else {
      return <div />
    }
  }
})

export default class StartDeploymentModal extends React.Component {
  title = 'Start New Deployment'

  baseSchema = {
    type: 'object',
    required: ['applicationId', 'orchestrationWorkflow'],
    properties: {
      uuid: { type: 'string', title: 'uuid' },
      applicationId: {
        type: 'string',
        title: 'Application',
        enum: [],
        enumNames: [],
        'custom:dataProvider': 'fetchApplications'
      },
      orchestrationWorkflow: {
        type: 'string',
        title: 'Workflows',
        enum: [],
        enumNames: [],
        'custom:dataProvider': 'fetchWorkflows',
        'custom:options': [],
        'custom:ordering': true
      }
    },
    dataProviders: {
      fetchApplications: async ({ formData, formProps }) => {
        const apps = this.props.dataStore.apps
        return Utils.sortDataByKey(apps, 'name', sortOrder)
      },
      fetchWorkflows: async ({ formData }) => {
        const applicationId = formData.applicationId
        const responseObj = await WorkflowService.fetchWorkflowsByApplicationId(applicationId)
        // this.workflowList = responseObj.workflows
        const { workflows } = responseObj

        this.workflowList = Utils.clone(workflows)
        if (this.selectedApplication) {
          const environments = this.selectedApplication.environments
          Utils.addEnvironmentNameToWorkflow(workflows, 'name', environments)
        }

        const sortedWorkflows = Utils.sortDataByKey(workflows, 'name', sortOrder)
        const customOptions = Utils.getSelectOptionsForPipelineOrWorkflow(sortedWorkflows, 'workflows')
        return {
          data: sortedWorkflows,
          transformedData: sortedWorkflows || [{ name: 'No Workflows Available', uuid: null }],
          customOptions
        }
      }
    }
  }
  baseUiSchema = {
    uuid: { 'ui:widget': 'hidden' },
    applicationId: {
      'ui:placeholder': 'Select Application',
      'ui:widget': 'SearchableSelect',
      classNames: css.customField
    },
    orchestrationWorkflow: {
      'ui:placeholder': 'Select Workflow',
      'ui:widget': 'SearchableSelect',
      classNames: `${css.customField} ${css.pullRight}`
    }
  }
  state = {
    formData: {},
    initialized: false,
    widgets,
    showSubForm: false,
    subFormFields: [],
    error: false
  }
  form
  workflowList = []
  selectedWorkflow = {}
  selectedWorkflowServices = []
  selectedEnvironment
  showArtifact = false
  showeExecCred = false

  componentWillMount = async () => {
    const formData = WingsDynamicForm.toFormData({ data: this.props.data }) || {} // API-data to formData (for Edit)

    if (formData.applicationId) {
      this.selectedApplication = Utils.findByUuid(this.props.dataStore.apps, formData.applicationId)
    }

    await CompUtils.setComponentState(this, {
      initialized: true,
      fieldOrder,
      formData: formData,
      widgets: widgets(_ => this.form),
      loading: true
    })
  }

  modifyFormForRerun = form => {
    const { isRerun } = this.props
    if (isRerun) {
      form.hideFields(['applicationId', 'orchestrationWorkflow'])
    }
  }

  modifyWorkflowName = workflows => {}

  onInitializeForm = async form => {
    await form.autoProcessInitialize(fieldOrder)

    const formData = form.buffer.formData
    this.modifyFormForRerun(form)
    if (formData.orchestrationWorkflow) {
      this.selectedApplication = Utils.findByUuid(this.props.dataStore.apps, formData.applicationId)
      // this.filterApplicationById(formData.applicationId)
      const showSubForm = this.updateWorkflow(formData)
      CompUtils.setComponentState(this, {
        showSubForm,
        subFormFields: this.subFormFields,
        subFormKey: Math.random()
      })
    }
    // await this.setComponentState({ initialized: true })
  }

  onHide = () => {
    this.initialized = false
    this.props.onHide()
    CompUtils.setComponentState(this, { submitting: false })
  }

  setSubFormVisibility = () => {
    // const subFormFields = []
    let showSubForm = false
    const { requiredEntityTypes } = this.selectedWorkflow.orchestrationWorkflow

    if (this.workflowVariables && this.workflowVariables.length > 0) {
      showSubForm = true
      // subFormFields.push('workflowVariables')
    }
    if (Utils.checkAritfactExistenceOnRequiredEntities(requiredEntityTypes)) {
      showSubForm = true
    }

    if (Utils.checkSSHUserExistenceOnRequiredEntities(requiredEntityTypes)) {
      showSubForm = true
    }
    // this.subFormFields = subFormFields
    return showSubForm
  }

  getActualWorkflowName = workflowId => {
    const workflow = this.workflowList.find(workflow => workflow.uuid === workflowId)
    return workflow.name
  }

  updateWorkflow = formData => {
    this.selectedWorkflow = this.form.getFieldDataFromEnum('orchestrationWorkflow')
    const { isRerun } = this.props

    if (this.selectedWorkflow) {
      this.selectedEnvironment = this.selectedWorkflow.envId
      formData.environment = this.selectedEnvironment
      const { userVariables } = this.selectedWorkflow.orchestrationWorkflow
      this.workflowVariables = userVariables

      if (isRerun) {
        const workflowName = this.getActualWorkflowName(this.selectedWorkflow.uuid)
        this.props.getExecutionName(workflowName)
      }

      if (this.selectedWorkflow) {
        return this.setSubFormVisibility()
      } else {
        delete this.form.buffer.formData.orchestrationWorkflow
        return false
      }
    } else if (isRerun) {
      this.setState({ error: true })
    }
  }

  filterApplicationById = uuid => {
    const apps = this.props.dataStore.apps
    return apps.find(app => app.uuid === uuid)
  }

  onChange = async ({ formData }) => {
    const form = this.form
    const isWorkflowChanged = this.form.isFieldChanged('orchestrationWorkflow')
    let showSubForm = false
    const isAppChanged = this.form.isFieldChanged('applicationId')

    if (isAppChanged) {
      this.selectedApplication = Utils.findByUuid(this.props.dataStore.apps, formData.applicationId)
      if (!this.selectedApplication) {
        delete this.form.buffer.formData.applicationId
      }
    }

    if (isWorkflowChanged) {
      showSubForm = this.updateWorkflow(formData)
    }

    await form.autoProcessChange(fieldOrder)
    // this.updateSchemaWithRequiredEntities(isWorkflowChanged, isAppChanged)
    await form.updateChanges()

    CompUtils.setComponentState(this, {
      showSubForm,
      subFormKey: Math.random()
    })
  }

  updateFormData = ({ formData }) => {
    this.subFormData = formData
  }

  updateNotes = async notes => {
    this.formNotes = notes
  }

  onSubmit = async ({ formData }) => {
    if (this.state.showSubForm) {
      this.child.validateForm({ formData: this.subFormData }, isValid => {
        // callback function. Keep this function in SubForm & call it onError function
        if (isValid === true) {
          this.startDeployment(formData)
        }
      })
    } else {
      this.startDeployment(formData)
    }
  }

  startDeployment = formData => {
    const isEditing = this.props.data ? true : false
    let data = {}
    data = Object.assign(formData, this.subFormData)

    if (this.formNotes) {
      data.notes = this.formNotes
    }

    data.artifacts = []

    if (data.artifactSelect) {
      data.artifacts = Utils.mapToUuidArray(data.artifactSelect.split(','))
    }
    // TODO: get from 'is required' endpoint
    if (!data.executionCredential) {
      data.executionCredential = {}
    }
    data.executionCredential.executionType = 'SSH'

    Utils.request(this, this.props.onSubmit(data, isEditing))
  }

  validate = (formData, errors) => {
    if (formData.orchestrationWorkflow) {
      if (this.selectedWorkflow.orchestrationWorkflow.valid === false) {
        errors.orchestrationWorkflow.addError('The selected workflow is invalid or incomplete')
      }
    }
    return errors
  }

  setLoading = async loadingVal => {
    await CompUtils.setComponentState(this, {
      loading: false
    })
  }

  renderFormBody () {
    return (
      <WingsDynamicForm
        name={this.title}
        ref={f => (this.form = f)}
        onInitializeForm={this.onInitializeForm}
        onChange={this.onChange}
        onSubmit={this.onSubmit}
        schema={this.baseSchema}
        uiSchema={this.baseUiSchema}
        formData={this.state.formData}
        widgets={this.state.widgets}
        onSubmit={this.onSubmit}
        validate={this.validate}
        submitting={this.state.submitting}
        loading={this.state.loading}
      >
        <div className="sub-form">
          {this.state.showSubForm && (
            <DeploymentSubForm
              key={this.state.subFormKey}
              selectedWorkflow={this.selectedWorkflow}
              selectedApp={this.selectedApplication}
              ref={depSubForm => (this.child = depSubForm)}
              updateFormData={this.updateFormData}
              data={this.state.formData}
              isEditing={this.props.isRerun}
              showOnlyWorkflowVariables={false}
              loading={this.state.loading}
              setLoading={this.setLoading}
            />
          )}
          <DeploymentNotes updateNotes={this.updateNotes} showForm={true} />

          <Button bsStyle="default" type="submit" className="submit-button" disabled={this.state.submitting}>
            SUBMIT
          </Button>
          {this.state.error && (
            <div className="modal-error">{!this.selectedWorkflow && 'Workflow is removed after the last run'}</div>
          )}
        </div>
      </WingsDynamicForm>
    )
  }

  render () {
    if (this.props.renderAsSubForm) {
      return this.renderFormBody()
    }

    return (
      <WingsModal className={css.main} show={this.props.show} onHide={this.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{this.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.renderFormBody()}</Modal.Body>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ExecutionModal/StartDeploymentModal.js