import React from 'react'
// import update from 'react-addons-update'
import { Button, Modal } from 'react-bootstrap'
// import Form from 'react-jsonschema-form'
import Select from 'react-select'
import FlipMove from 'react-flip-move'
import { WingsForm, TooltipOverlay, Utils } from 'components'
import css from './PipelineEditorModal.css'

const schema = {
  type: 'object',
  required: ['name'],
  properties: {
    uuid: { type: 'string', title: 'uuid', default: '' },
    name: { type: 'string', title: 'Name' },
    description: { type: 'string', title: 'Description', default: '' }
  }
}

const uiSchema = {
  uuid: { 'ui:widget': 'hidden' },
  name: { classNames: '__name' },
  description: { classNames: '__desc' }
}
const log = type => {} // console.log.bind(console, type)

export default class PipelineEditorModal extends React.Component {
  state = {
    schema,
    formData: null,
    pipelineStages: null,
    disableFlipMove: false,
    // example: { stage: 1, stageElement: { name: 'QA', type: 'ENV_STATE', properties: {...} } }
    selectedStageElement: null,
    errorMsg: ''
  }

  componentWillReceiveProps (newProps) {
    let formData = null
    if (newProps.data) {
      const { uuid, name, description, pipelineStages } = newProps.data
      formData = { uuid, name, description, pipelineStages }
      this.setState({ formData, pipelineStages, errorMsg: '' })
    } else {
      this.setState({
        formData: null,
        pipelineStages: [{ pipelineStageElements: [] }],
        selectedStageElement: null,
        errorMsg: ''
      })
    }
  }

  onChange = ({ formData }) => {
    this.setState({ formData })
  }

  onSaveClick = async () => {
    const formData = this.state.formData || {}
    formData.pipelineStages = this.state.pipelineStages || []

    const jsonStr = JSON.stringify(formData)
    if (!formData.name || formData.name.trim().length === 0) {
      this.setState({ errorMsg: 'Please enter Pipeline Name.' })
    } else if (jsonStr.indexOf('"workflowId":""') > 0) {
      this.setState({ errorMsg: 'Please assign Workflows for all of the selected Environments.' })
    } else if (jsonStr.indexOf('"pipelineStageElements":[]') > 0) {
      this.setState({ errorMsg: 'Pipeline Stage must not be empty.' })
    } else {
      // check for duplicate Stage Element Names
      let dupFound = ''
      let invalidFound = false
      const map = {}
      for (const stage of formData.pipelineStages) {
        for (const ele of stage.pipelineStageElements) {
          const workflow = this.props.workflows.find(wf => wf.uuid === ele.properties.workflowId)
          if (workflow && workflow.orchestrationWorkflow && workflow.orchestrationWorkflow.valid === false) {
            invalidFound = true
          }
          if (map[ele.name]) {
            dupFound = ele.name
            break
          } else {
            map[ele.name] = true
          }
        }
        if (dupFound) {
          break
        }
      }
      if (dupFound) {
        this.setState({ errorMsg: `"${dupFound}" should be assigned to one stage only.` })
        return
      }
      if (invalidFound) {
        this.setState({ errorMsg: 'Incomplete workflow is not allowed.' })
        return
      }
      const isEditing = this.props.data ? true : false
      await this.props.onSubmit(formData, isEditing)
    }
  }

  onAddStageClick = stageIdx => {
    const pipelineStages = this.state.pipelineStages || []
    const newStage = { pipelineStageElements: [] }
    if (typeof stageIdx !== 'undefined') {
      // disable animation, otherwise it only shows animation at the last pipe
      this.setState({ disableFlipMove: true }, () => {
        Utils.insertArrayAt(pipelineStages, stageIdx + 1, newStage)
        this.setState({ pipelineStages, selectedStageElement: null }, () => {
          this.setState({ disableFlipMove: false })
        })
      })
    } else {
      pipelineStages.push(newStage)
      this.setState({ pipelineStages, selectedStageElement: null })
    }
  }

  onEnvSelected = (stageIdx, item) => {
    if (item.value === 'APPROVAL') {
      this.onApprovalSelected(stageIdx, item)
      return
    }

    const pipelineStages = this.state.pipelineStages
    const eles = pipelineStages[stageIdx].pipelineStageElements
    const stageElement = {
      name: item.label,
      type: 'ENV_STATE',
      properties: {
        envId: item.value,
        workflowId: ''
      }
    }
    eles.push(stageElement)
    this.setState({
      pipelineStages,
      selectedStageElement: {
        stage: stageIdx,
        stageElement
      }
    })
  }

  onApprovalSelected = (stageIdx, item) => {
    const pipelineStages = this.state.pipelineStages
    const eles = pipelineStages[stageIdx].pipelineStageElements
    eles.push({
      name: item.label,
      type: 'APPROVAL',
      properties: {
        groupName: 'RM_TEAM'
      }
    })
    this.setState({ pipelineStages })
  }

  onDeleteElementClick = (stageIdx, env) => {
    const pipelineStages = this.state.pipelineStages
    pipelineStages[stageIdx].pipelineStageElements = pipelineStages[stageIdx].pipelineStageElements.filter(
      e => e.name !== env.name
    )
    this.setState({ pipelineStages }, () => {
      this.setState({ selectedStageElement: null })
    })
  }

  onStageDeleteClick = stageIdx => {
    // this.state.pipelineStages.splice(stageIdx, 1)
    // this.setState({ pipelineStages: this.state.pipelineStages })

    // this.setState({
    //   pipelineStages: update(this.state.pipelineStages, { $splice: [[ stageIdx, 1 ]] })
    // })
    delete this.state.pipelineStages[stageIdx]
    this.setState({ pipelineStages: this.state.pipelineStages, selectedStageElement: null })
    setTimeout(() => {
      this.setState({ disableFlipMove: true }, () => {
        // temporarily disable FlipMove while we're re-create array
        const newpipelineStages = this.state.pipelineStages.filter(s => typeof s !== 'undefined')
        this.setState({ pipelineStages: newpipelineStages }, () => {
          this.setState({ disableFlipMove: false })
        })
      })
    }, 500) // wait until FlipMove animation ended
  }

  onStageElementClick = (idx, stageElement) => {
    this.setState({
      selectedStageElement: {
        stage: idx,
        stageElement
      }
    })
  }

  onWorkflowSelected = (stageIdx, stageElement, selectedWorkflow) => {
    const pipelineStages = this.state.pipelineStages
    const stageEnv = this.props.environments.find(env => env.uuid === stageElement.properties.envId)
    const foundEl = pipelineStages[stageIdx].pipelineStageElements.find(el => el.name === stageElement.name)
    foundEl.properties.workflowId = selectedWorkflow.value
    this.state.selectedStageElement.stageElement = foundEl
    this.state.selectedStageElement.stageElement.name = selectedWorkflow.label
      .concat(' (')
      .concat(stageEnv.name)
      .concat(')')
    this.setState({ pipelineStages, selectedStageElement: this.state.selectedStageElement })
  }

  renderStageElementDetails = () => {
    const selectedEl = this.state.selectedStageElement

    if (selectedEl.stageElement.type === 'ENV_STATE') {
      let workflowOptions = []
      const envId = selectedEl.stageElement.properties.envId
      if (this.props.workflows) {
        const envWorkflows = this.props.workflows.filter(wf => wf.envId === envId)
        workflowOptions = envWorkflows.map(wf => {
          let label = wf.name
          if (wf.orchestrationWorkflow.valid === false) {
            label += ' (Incomplete)'
          }
          return { value: wf.uuid, label }
        })
      }
      return (
        <div className="__envDetails">
          <div className="__header">
            STAGE {selectedEl.stage + 1} - {selectedEl.stageElement.name}
          </div>
          <h5 className="__title">
            Deployment Workflow * <span>(Required)</span>
          </h5>
          <Select
            name="form-field-name"
            placeholder="Select Workflow"
            value={selectedEl.stageElement.properties.workflowId}
            options={workflowOptions}
            clearable={false}
            autosize={true}
            searchable={false}
            onChange={item => this.onWorkflowSelected(selectedEl.stage, selectedEl.stageElement, item)}
          />
        </div>
      )
    } else {
      return <div />
    }
  }

  render () {
    const pipelineStages = this.state.pipelineStages || []
    let envOptions = []
    if (this.props.environments) {
      envOptions = this.props.environments.map(env => {
        return { value: env.uuid, label: env.name }
      })
    }
    envOptions.unshift({
      label: 'ENVIRONMENTS',
      value: 'EnvironmentGroup',
      disabled: true
    })
    envOptions.push({
      label: 'APPROVAL',
      value: 'ApprovalGroup',
      disabled: true
    })
    envOptions.push({
      value: 'APPROVAL',
      label: 'Approval'
    })

    const selectedEl = this.state.selectedStageElement
    let elDetails
    if (selectedEl) {
      elDetails = this.renderStageElementDetails()
    }

    return (
      <Modal show={this.props.show} onHide={this.props.onHide} className={css.main}>
        <Modal.Header closeButton>
          <Modal.Title>Delivery Pipeline</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsForm
            name="Delivery Pipeline"
            ref="form"
            schema={this.state.schema}
            uiSchema={uiSchema}
            formData={this.state.formData}
            onChange={this.onChange}
            onError={log('errors')}
          >
            <div />
          </WingsForm>

          <div className="__pipes">
            <FlipMove disableAllAnimations={this.state.disableFlipMove}>
              <div className="__col">
                <div />
              </div>

              {pipelineStages.map((stage, idx) => {
                let pipeEndEl
                let addNextPipeEl
                if (idx === pipelineStages.length - 1) {
                  pipeEndEl = <div className="__pipeEnd" />
                } else {
                  addNextPipeEl = (
                    <div className="__addStageIcon __addNextPipeEl" onClick={() => this.onAddStageClick(idx)}>
                      <i className="icons8-plus-filled" />
                    </div>
                  )
                }

                let emptyStageCss = ''
                if (stage.pipelineStageElements.length === 0) {
                  emptyStageCss = '__emptyStageCss'
                }

                return (
                  <div className={`__col ${emptyStageCss}`} key={idx}>
                    {addNextPipeEl}

                    <div className="__pipe">
                      Stage {idx + 1}
                      <span className="__deleteStage" onClick={() => this.onStageDeleteClick(idx)}>
                        <i className="icons8-delete" />
                      </span>
                    </div>
                    {pipeEndEl}

                    <div>
                      {stage.pipelineStageElements.map(stageElement => {
                        let activeClass = ''
                        if (
                          selectedEl &&
                          selectedEl.stage === idx &&
                          selectedEl.stageElement.name === stageElement.name
                        ) {
                          activeClass = '__activeEl'
                        }
                        let errorIcon = null
                        if (stageElement.type !== 'APPROVAL' && !stageElement.properties.workflowId) {
                          errorIcon = (
                            <span>
                              <i className="icons8-high-priority icon" />
                            </span>
                          )
                        }
                        return (
                          <div
                            className={`__stageEl ${activeClass}`}
                            key={idx + stageElement.name}
                            onClick={() => this.onStageElementClick(idx, stageElement)}
                          >
                            {errorIcon}
                            <span>
                              {stageElement.name}
                            </span>
                            <span className="__deleteEnv" onClick={() => this.onDeleteElementClick(idx, stageElement)}>
                              <i className="icons8-delete" />
                            </span>
                          </div>
                        )
                      })}

                      <Select
                        name="form-field-name"
                        placeholder="Add Step"
                        value=""
                        options={envOptions}
                        clearable={false}
                        autosize={true}
                        searchable={false}
                        onChange={item => this.onEnvSelected(idx, item)}
                      />
                      {/* <Select
                        name="form-field-name"
                        placeholder="Add Approval"
                        value=""
                        options={approvalOptions}
                        clearable={false} autosize={true} searchable={false}
                        onChange={item => this.onApprovalSelected(idx, item)}
                      /> */}
                    </div>
                  </div>
                )
              })}

              <div className="__col">
                <TooltipOverlay tooltip="Add Pipeline Stage">
                  <div className="__addStageIcon" onClick={() => this.onAddStageClick()}>
                    <i className="icons8-plus-filled" />
                  </div>
                </TooltipOverlay>
              </div>
            </FlipMove>
          </div>

          {elDetails}

          <div className="__modalFooter">
            {this.state.errorMsg
              ? <div className="__errors">
                {this.state.errorMsg}
              </div>
              : null}
            <div>
              <Button className="submit-button" bsStyle="primary" onClick={this.onSaveClick}>
                SAVE
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/PipelinePage/PipelineEditorModal.js