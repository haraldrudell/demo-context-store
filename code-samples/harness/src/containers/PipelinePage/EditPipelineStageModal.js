import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import Select from 'react-select'
import css from './EditPipelineStageModal.css'
import { InlineEditableText, FormUtils } from 'components'
import DeploymentSubForm from '../ExecutionModal/DeploymentSubForm.js'
import WingsModal from '../../components/WingsModal/WingsModal'
import WingsForm from '../../components/WingsForm/WingsForm'
import clone from 'clone'

const STAGE_TYPE_EXECUTION = 'execution'
const STAGE_TYPE_APPROVAL = 'approval'

const schema = {
  type: 'object',
  required: ['stageType', 'workflow'],
  properties: {
    stageType: {
      type: 'string',
      title: 'Step type',
      default: STAGE_TYPE_EXECUTION,
      enum: [STAGE_TYPE_EXECUTION, STAGE_TYPE_APPROVAL],
      enumNames: ['Execution Step', 'Approval Step']
    },
    stepName: { type: 'string', title: 'Step Name', default: '', maxLength: 150 },
    parallel: { type: 'boolean', title: 'Execute in parallel with previous Step' },
    workflow: { type: 'string', title: 'Execute Workflow', default: '' }
  }
}

const uiSchema = {
  stageType: { 'ui:widget': 'radio' },
  workflow: { 'ui:placeholder': 'Execute Workflow' }
}
export default class EditPipelineStageModal extends React.Component {
  state = {
    formData: {},
    showSubForm: false,
    subFormKey: Math.random()
  }
  subFormData = {}
  initialised = false
  componentWillReceiveProps (newProps) {
    if (newProps.show && !this.initialised) {
      let showSubForm = false
      this.initialised = true
      const { edit, stage, index, forceParallel, parallel, stages } = newProps
      const stageElement = stage && stage.pipelineStageElements && stage.pipelineStageElements[0]
      const stepName = (edit && stageElement && stageElement.name) || ''
      const stageType = !edit
        ? STAGE_TYPE_EXECUTION
        : stageElement && stageElement.type === 'APPROVAL' ? STAGE_TYPE_APPROVAL : STAGE_TYPE_EXECUTION
      const workflowId =
        edit &&
        stageType === STAGE_TYPE_EXECUTION &&
        stageElement &&
        stageElement.properties &&
        stageElement.properties.workflowId
      const envId = workflowId && stageElement.properties.envId

      if (workflowId) {
        showSubForm = this.updateWorkflow(workflowId, stageType)
      }
      const stageName = (stage && stage.name) || (forceParallel && stages[index].name)

      const subFormData = {}
      subFormData['workflowVariables'] = stageElement ? stageElement.workflowVariables : null
      this.subFormData = subFormData

      const formData = {
        index,
        stageType,
        stageName,
        stepName,
        workflowId,
        workflowName: stepName,
        envId,
        parallel
      }
      const _schema = clone(schema)

      uiSchema.parallel = { 'ui:disabled': forceParallel || index === 0 ? true : false }
      this.activeStageType = stageType

      if (formData.stageType === STAGE_TYPE_APPROVAL) {
        delete _schema.properties.workflow
        delete _schema.properties.stepName
        _schema.required.pop()
      }

      const errorMsg =
        stageElement && stageElement.validationMessage
          ? this.getErrorMessage(stageElement.validationMessage)
          : undefined

      this.setState({
        errorMsg,
        schema: _schema,
        uiSchema,
        formData,
        showSubForm,
        subFormKey: Math.random()
      })

      this.updateForm(formData)
    }
  }

  getErrorMessage = validationMessage => {
    return `${validationMessage}.Please submit`
  }

  updateForm (formData) {
    uiSchema.workflow = { 'ui:widget': this.renderWorkflowSelect(formData) }
    this.setState({ uiSchema })
  }

  renderWorkflowSelect = formData => {
    const { props: newProps } = this
    let workflowOptions = []
    const envMap = {}

    if (newProps.environments) {
      newProps.environments.forEach(e => {
        envMap[e.uuid] = e
      })
    }

    if (newProps.workflows) {
      const envWorkflows = this.props.workflows
      workflowOptions = envWorkflows.map(wf => {
        let label = wf.name

        if (wf.orchestrationWorkflow.valid === false) {
          label += ' (Incomplete)'
        } else {
          label += wf.templatized ? ' (Workflow Template)' : envMap[wf.envId] ? ` (${envMap[wf.envId].name})` : ''
        }
        return { value: wf.uuid, label, envId: wf.envId }
      })
    }

    return props =>
      <Select
        name="form-field-name"
        placeholder="Select Workflow"
        value={props.value || (this.state.formData && this.state.formData.workflowId)}
        options={workflowOptions}
        clearable={false}
        autosize={true}
        searchable={true}
        onChange={item => {
          props.onChange(item.value)
          const showSubForm = this.updateWorkflow(item.value)
          const { formData } = this.state
          // formData.stageName = 'step1' // ? Sahithi? Why change stageName to 'step1' ???
          formData.workflowName = item.label
          formData.envId = item.envId
          formData.workflowId = item.value

          this.setState({ formData, showSubForm, subFormKey: Math.random() })
        }}
      />
  }

  updateWorkflow = (workflowId, stageType) => {
    const data = FormUtils.clone(this.state.formData)
    const { workflows } = this.props
    if ((data.workflowId !== workflowId && workflowId) || stageType !== data.stageType) {
      const filteredWorkflow = workflows.find(workflow => workflow.uuid === workflowId)
      if (filteredWorkflow) {
        this.selectedWorkflow = filteredWorkflow
        const { templatized } = this.selectedWorkflow
        if (templatized) {
          return true
        } else {
          return false
        }
      }
    }
  }

  onChange = ({ formData }) => {
    const _schema = clone(schema)

    if (this.state.errorMsg) {
      this.setState({ errorMsg: null })
    }

    if (formData.stageType !== this.activeStageType) {
      let showSubForm = clone(this.state.showSubForm)
      this.activeStageType = formData.stageType

      // 'ui:widget': 'hidden' not working for custom widget
      // manipulate on schema level instead of uiSchema
      if (formData.stageType === STAGE_TYPE_APPROVAL) {
        delete _schema.properties.workflow
        delete _schema.properties.stepName
        showSubForm = false
      } else {
        showSubForm = this.updateWorkflow(formData.workflowId, formData.stageType)
      }
      this.setState({ schema: _schema, formData, showSubForm, subFormKey: Math.random() })
    } else {
      this.setState({ formData })
    }
  }

  onSubmit = async () => {
    if (this.state.showSubForm) {
      this.child.validateForm({ formData: this.subFormData }, isValid => {
        // callback function. Keep this function in SubForm & call it onError function
        if (isValid === true) {
          this.submitForm()
        }
      })
    } else {
      this.submitForm()
    }
  }

  getEnvId = envId => {
    const templateEnvironment = this.subFormData['environment']

    if (templateEnvironment) {
      return templateEnvironment
    }
    return envId
  }

  submitForm = async () => {
    const { formData } = this.state
    const { stageType, stageName, stepName, workflowId, parallel, roles, users, envId, workflowName } = formData
    const { edit, index } = this.props

    if (stageName && stageName.length > 150) {
      return this.setState({ errorMsg: 'Stage name is too long. Please make it less than 150 characters' })
    }

    if (stageType !== STAGE_TYPE_APPROVAL) {
      if (!workflowId) {
        return this.setState({ errorMsg: 'A workflow must be selected' })
      }
    }

    const updatedEnvId = this.getEnvId(envId)

    this.props.onSubmit({
      stageType,
      stageName: /stage\s\d+/i.test(stageName) ? '' : stageName,
      stepName: stepName || workflowName,
      workflowId,
      envId: updatedEnvId,
      parallel,
      roles,
      users,
      edit,
      index,
      workflowVariables: this.subFormData.workflowVariables
    })
    this.initialised = false
    this.setState({ formData: {} })
  }

  updateFormData = ({ formData }) => {
    this.subFormData = formData
  }

  hideModal = () => {
    this.selectedWorkflow = {}
    this.showSubForm = false
    this.subFormData = {}
    this.initialised = false
    this.setState({ showSubForm: false, formData: {} })

    this.props.onHide()
  }

  render () {
    return (
      <WingsModal show={this.props.show} onHide={this.hideModal} className={css.main}>
        <Modal.Header closeButton>
          <Modal.Title>
            <InlineEditableText allowEmpty={true} onKeyUp={stageName => (this.state.formData.stageName = stageName)}>
              {this.state.formData.stageName}
            </InlineEditableText>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsForm
            name="EditPipelineStage"
            ref="form"
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            onError={this.onError}
          >
            <div className="sub-form">
              {this.state.showSubForm &&
                <DeploymentSubForm
                  selectedWorkflow={this.selectedWorkflow}
                  updateFormData={this.updateFormData}
                  ref={depSubForm => (this.child = depSubForm)}
                  data={this.state.formData}
                  isEditing={this.props.edit}
                  selectedApp={this.props.selectedApplication}
                  showOnlyWorkflowVariables={true}
                  key={this.state.subFormKey}
                  data={this.subFormData}
                />}

              <Button bsStyle="default" type="submit" className="submit-button" disabled={this.state.submitting}>
                SUBMIT
              </Button>
              {this.state.error && <div className="modal-error">Sub Form is incomplete</div>}
            </div>
          </WingsForm>
          {this.state.errorMsg &&
            <div className="errors">
              {this.state.errorMsg}
            </div>}
        </Modal.Body>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/PipelinePage/EditPipelineStageModal.js