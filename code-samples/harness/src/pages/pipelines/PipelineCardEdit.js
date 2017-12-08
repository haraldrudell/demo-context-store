import React from 'react'
// import { Utils } from 'components'
// import { findAll } from 'find-object'
import StageView from './views/StageView'
import expandableView from 'expandable-view'
import css from './PipelineCardView.css'
import './views/ExecutionStatus.css'
import EditPipelineStageModal from '../../containers/PipelinePage/EditPipelineStageModal'
import clone from 'clone'
import { PipelinesService } from 'services'
import { PageBreadCrumbs, Utils } from 'components'
import { Link } from 'react-router'
import { Popover, Intent, Position, Tooltip } from '@blueprintjs/core'
import { parallelGrouping } from './PipelineUtils'
import deepEqual from 'fast-deep-equal'
import { ActionButtons } from 'components'
import SetupAsCodePanel from '../../containers/SetupAsCode/SetupAsCodePanel.js'

export default class PipelineCardEdit extends React.Component {
  state = {
    showEditModal: false,
    name: '',
    description: '',
    stages: [],
    autoSave: true,
    prevInfo: null // Used for auto save
  }

  componentWillMount () {
    if (this.props.edit) {
      this.props.updatePageTitle(this.renderBreadCrumbs())
    }
  }

  adjustGraphics () {
    if (this.expandableView) {
      expandableView.update(this.expandableView, true)

      this.expandableView.querySelectorAll('stage-view hr').forEach((hr, index, hrs) => {
        if (hrs[index + 1]) {
          hr.style.width =
            hrs[index + 1].nextElementSibling.getBoundingClientRect().left -
            hr.nextElementSibling.getBoundingClientRect().left +
            'px'
        }
      })
    }
  }

  componentDidMount () {
    this.adjustGraphics()
  }

  componentDidUpdate (prevProps, prevState) {
    const { state: { stages, name, description, prevInfo, autoSave } } = this
    const info = [stages, name, description]

    this.adjustGraphics()

    if (autoSave && prevInfo && !deepEqual(prevInfo, info) && stages.length) {
      // schedule to auto-save after 2 seconds, this makes sure
      // latest edit in name/description will be picked
      clearTimeout(this.autoSaveTimeoutId)
      this.autoSaveTimeoutId = setTimeout(async _ => {
        const success = await this.saveEditing(true)

        if (success) {
          this.setState({
            prevInfo: clone(info),
            autoSaveTime: +new Date()
          })
        }
      }, 1500)
    }

    if (!prevInfo) {
      this.setState({ prevInfo: clone(info) })
    }
  }

  componentWillUnmount () {
    expandableView.destroy(this.expandableView)
  }

  componentWillReceiveProps (props) {
    const { pipeline } = props

    if (pipeline) {
      this.setState({
        stages: clone(pipeline.pipelineStages),
        name: pipeline.name,
        description: pipeline.description
      })
    }
  }

  renderBreadCrumbs () {
    const { path, urlParams, pipeline } = this.props
    const appName = this.props.appName || ''

    const bData = [
      { label: 'Setup', link: path.toSetup(urlParams) },
      { label: appName, link: path.toAppDetails(urlParams), dropdown: 'applications' },
      { label: 'Pipelines', link: path.toSetupPipeLines(urlParams), dropdown: 'application-children' },
      { label: pipeline.name }
    ]
    return <PageBreadCrumbs {...this.props} data={bData} />
  }

  /*
   * Manipulate stages before sending them to back-end.
   */
  transformStages = stages => {
    // auto-rename approval stages so they are not duplicated
    stages.forEach((stage, index) => {
      if (stage.pipelineStageElements[0].type === 'APPROVAL') {
        stage.pipelineStageElements[0].name = 'Approval ' + index
      }
    })

    return stages
  }

  /*
   * Some front-end validations (back-end validation is still on-going)
   */
  validateStages = stages => {
    const { workflows } = this.props
    const workflowStages = stages.filter(stage => stage.pipelineStageElements[0].type !== 'APPROVAL')
    const duplicates = {}
    let index = workflowStages.length

    if (!stages.length) {
      return 'A pipeline must have at least one stage.'
    }

    while (index--) {
      const properties = workflowStages[index].pipelineStageElements[0].properties
      const { name, workflowId } = properties
      const workflow = workflows.find(wf => wf.uuid === workflowId)

      if (duplicates[name]) {
        return 'Error: Duplicate step names (' + name + ')'
      } else {
        duplicates[name] = name
      }

      if (!workflow.templatized && duplicates[workflowId]) {
        return 'Error: Duplicate non-templatized workflows (' + workflow.name + ')'
      } else {
        duplicates[workflowId] = workflowId
      }
    }
  }

  saveEditing = async (noSuccessToast = false) => {
    const { createNew, accountId, appId, toaster, router, path } = this.props
    const { stages } = this.state
    const { name, description } = this.state
    const data = {
      name,
      description,
      pipelineStages: this.transformStages(clone(stages))
    }
    let success = false
    const validationError = this.validateStages(stages)

    toaster.clear()

    if (!createNew) {
      data.uuid = this.props.pipelineId
    }

    if (!this.state.name) {
      return
    }

    if (validationError) {
      return toaster.showError({ message: validationError })
    }

    if (createNew) {
      const { error, response: newPipeline } = await PipelinesService.createItem(accountId, appId, data)

      if (error) {
        toaster.showError({
          message: 'We are unable to create a new pipeline at the moment. Please check back later.'
        })
      } else {
        router.replace(path.toSetupPipeLinesEdit({ accountId, appId, pipelineId: newPipeline.uuid }))
      }
    } else {
      const body = JSON.stringify(Utils.getJsonFields(data, 'name, description, pipelineStages'))
      const { error } = await PipelinesService.editItem(accountId, appId, data.uuid, body)

      if (error) {
        toaster.showError({
          message: 'We are unable to save pipeline at the moment. Please check back later.'
        })
        // TODO Currently backend does not return error messages
        console.error(error)
      } else {
        if (!noSuccessToast) {
          toaster.show({
            intent: Intent.PRIMARY,
            message: 'Pipeline saved as "' + this.state.name + '"',
            timeout: 5000
          })
        }
        success = true
      }
    }

    this.adjustGraphics()
    return success
  }

  renderActionButtons = ({ item }) => {
    const selectId = item.uuid
    const setUpAsCode = (
      <Popover
        position={Position.LEFT_TOP}
        useSmartArrowPositioning={true}
        content={<SetupAsCodePanel {...this.props} selectId={selectId} />}
      >
        <i className="icons8-source-code" />
      </Popover>
    )
    const buttons = {
      cloneFunc: this.props.onClone.bind(this, item),
      deleteFunc: this.props.onDelete.bind(this, item)
    }

    const setupAsCodeProps = {
      props: this.props,
      selectId: item.uuid
    }

    const actionButtonsProps = {
      item,
      buttons,
      setupAsCodeProps
    }

    return (
      <div className={css.actions}>
        {setUpAsCode}
        <ActionButtons {...actionButtonsProps} />
      </div>
    )
  }

  renderCardHeader () {
    const { pipeline, createNew, edit, accountId, appId, path } = this.props

    return (
      (((edit && pipeline) || createNew) && (
        <header>
          <section>
            <label>Name*:</label>
            <Tooltip content="Enter pipeline name" position={Position.TOP} isOpen={!this.state.name}>
              <input
                placeholder="Name"
                value={this.state.name}
                onChange={e => this.setState({ name: e.target.value })}
              />
            </Tooltip>
            <label>Description:</label>
            <input
              placeholder="Description"
              value={this.state.description}
              onChange={e => this.setState({ description: e.target.value })}
            />
          </section>
        </header>
      )) ||
      (!edit &&
        pipeline && (
          <header>
            <h5>
              <Link to={path.toSetupPipeLinesEdit({ accountId, appId, pipelineId: pipeline.uuid })}>
                {pipeline.name}
              </Link>
            </h5>
            {this.renderActionButtons({ item: pipeline })}
          </header>
        ))
    )
  }

  renderCardFooter () {
    const CHECKED = this.state.autoSave && { checked: true }
    const { state: { autoSave, autoSaveTime }, props: { edit } } = this

    return (
      <footer>
        <label>
          <input type="checkbox" {...CHECKED} onChange={_ => this.setState({ autoSave: !autoSave })} />
          &nbsp;&nbsp;Auto save every change
          {autoSaveTime && (
            <span>
              &nbsp;&nbsp;(saved at <time dateTime={new Date(autoSaveTime)}>{Utils.formatDate(autoSaveTime)}</time>)
            </span>
          )}
        </label>

        <form-buttons>
          <button className="btn btn-secondary" onClick={this.props.goToPipelines}>
            {edit ? 'Back' : 'Cancel'}
          </button>
          {!autoSave && (
            <button onClick={this.saveEditing} className="btn btn-primary">
              Save
            </button>
          )}
        </form-buttons>
      </footer>
    )
  }

  openEditModal = ({ index = 0, stage, edit }) => {
    const { stages } = this.state
    const parallel = index !== 0 && this.isStageParallel(stages[index])
    const forceParallel = !edit && this.isStageParallel(stages[index])

    this.setState({
      showEditModal: true,
      index,
      edit,
      stage,
      forceParallel,
      parallel
    })
  }

  hideEditModal = () => {
    this.setState({ showEditModal: false })
  }

  renderName (stage) {
    return stage && stage.pipelineStageElements && stage.pipelineStageElements[0] && stage.pipelineStageElements[0].name
  }

  renameParallelGroupWhenUpsertAtIndex = (stages, index) => {
    const stage = stages[index]
    const { name } = stage
    const parallel = stage.parallel || this.isStageParallel(stages[index + 1])

    if (parallel) {
      let i = index + 1

      while (stages[i] && this.isStageParallel(stages[i])) {
        stages[i].name = name
        i++
      }

      if (stage.parallel) {
        i = index - 1
        while (stages[i] && this.isStageParallel(stages[i])) {
          stages[i].name = name
          i--
        }

        if (stages[i] && !this.isStageParallel(stages[i])) {
          stages[i].name = name
        }
      }
    }
  }

  addOrEditPipelineStage = ({
    stageType,
    stageName,
    stepName,
    workflowId,
    envId,
    parallel,
    roles,
    users,
    edit,
    index,
    workflowVariables
  }) => {
    this.hideEditModal()

    const { stages } = this.state
    const stage = this.createStage({
      index,
      stageType,
      stageName,
      stepName,
      workflowId,
      envId,
      parallel,
      workflowVariables
    })

    if (edit) {
      this.state.stages[index] = stage
    } else {
      this.state.stages.splice(this.state.index, 0, stage)
    }

    this.renameParallelGroupWhenUpsertAtIndex(stages, index) // update names for parallel groups
    this.setState({ stages: stages })
  }

  isStageParallel = stage => {
    return stage && !!stage.parallel
  }

  setStageParallel = stage => {
    stage.parallel = true
  }

  createStage ({ index, stageType, stageName = null, stepName, envId, workflowId, parallel, workflowVariables }) {
    const parallelValue = index && parallel ? true : false

    return stageType === 'execution'
      ? {
        name: stageName,
        parallel: parallelValue,
        pipelineStageElements: [
          {
            name: stepName,
            type: 'ENV_STATE',
            properties: {
              envId,
              workflowId
            },
            workflowVariables
          }
        ]
      }
      : {
        name: stageName,
        parallel: parallelValue,
        pipelineStageElements: [
          {
            name: 'Approval', // should this be editable also?
            properties: {
              groupName: 'RM_TEAM'
            },
            type: 'APPROVAL'
          }
        ]
      }
  }

  addStageAtIndex = (index, e) => {
    this.setState({ index })
    e.stopPropagation()
    this.openEditModal({ index })
  }

  deleteStageAtIndex = (index, e) => {
    const { stages } = this.state

    e.stopPropagation()
    stages.splice(index, 1)
    this.setState({ stages })
  }

  renderHeader (stage, index) {
    const { name } = stage
    return (name && name !== 'false' && name) || (stage.group && 'STAGE ' + stage.group) || 'STAGE ' + (index + 1)
  }

  onDrag = ({ fromIndex, toIndex }) => {
    fromIndex = parseInt(fromIndex)
    toIndex = parseInt(toIndex)

    const { stages } = this.state
    const nextIndex = fromIndex < toIndex ? toIndex + 1 : toIndex
    const movedStage = stages[fromIndex]
    let shouldResetStageName = false
    const oldParallel = movedStage.parallel

    // If stage is a head of a parallel group, promote its right sibling to be new head
    if (!movedStage.parallel && this.isStageParallel(stages[fromIndex + 1])) {
      stages[fromIndex + 1].parallel = false
      shouldResetStageName = true
    }

    // Reset parallel state, new parallel state is based on destination
    movedStage.parallel = false

    // Reset parallel state if becomes first stage
    if (toIndex === 0 && this.isStageParallel(movedStage)) {
      movedStage.parallel = false
    }

    // Reset movedStage.name to default if it's moved out of a parallel group
    if (shouldResetStageName || oldParallel !== movedStage.parallel) {
      movedStage.name = null
    }

    // If dragged into a parallel group, movedStage becomes a part of the parallel group
    if (this.isStageParallel(stages[nextIndex])) {
      movedStage.name = stages[nextIndex].name
      this.setStageParallel(movedStage)
    }

    // Move stage from fromIndex to toIndex
    stages.splice(toIndex, 0, stages.splice(fromIndex, 1)[0])

    this.setState({ stages })
  }

  renderCardBody () {
    const { pipeline, createNew, edit, accountId, appId, path, router } = this.props
    const listing = !createNew && !edit
    // stages is used for rendering purposes only
    const stages = parallelGrouping(clone(this.state.stages))

    return (
      <section>
        <expandable-view ref={view => (this.expandableView = view)}>
          <expandable-view-wrapper>
            <expandable-view-content>
              {stages &&
                stages.map((stage, index) => {
                  const { properties } = stage.pipelineStageElements[0]
                  const type = stage.pipelineStageElements[0].type

                  stage.name = this.renderHeader(stage, properties, index)

                  return (
                    <StageView
                      key={index}
                      index={index}
                      type={type}
                      editMode={createNew || edit ? true : false}
                      status={null}
                      header={stage.name}
                      parallel={stage.parallelAttrs}
                      name={this.renderName(stage)}
                      description={undefined}
                      selected={this.selectedId === index}
                      onClick={_ => {
                        if (listing) {
                          router.push(path.toSetupPipeLinesEdit({ accountId, appId, pipelineId: pipeline.uuid }))
                        } else {
                          this.openEditModal({ stage, index, edit: true })
                        }
                      }}
                      onEdit={_ => this.openEditModal({ stage, index, edit: true })}
                      onAdd={e => this.addStageAtIndex(index + 1, e)}
                      onDelete={e => this.deleteStageAtIndex(index, e)}
                      onDrag={this.onDrag}
                    />
                  )
                })}
              {((edit && stages) || createNew) && (
                <StageView
                  placeholder={true}
                  onClick={_ => this.openEditModal({ index: (stages && stages.length) || 0 })}
                />
              )}
            </expandable-view-content>
          </expandable-view-wrapper>
          <button>Previous</button>
          <button>Next</button>
        </expandable-view>
      </section>
    )
  }

  render () {
    const { createNew, edit } = this.props
    const props = createNew ? { 'create-new': true } : edit ? { edit: true } : { listing: true }

    return (
      <ui-card class={css.main} {...props}>
        {this.renderCardHeader()}
        {this.renderCardBody()}

        <EditPipelineStageModal
          className="edit-pipeline-stage-modal"
          {...this.props}
          show={this.state.showEditModal}
          edit={this.state.edit}
          parallel={this.state.parallel}
          forceParallel={this.state.forceParallel}
          index={this.state.index}
          stages={this.state.stages}
          stage={this.state.stage}
          onHide={this.hideEditModal}
          onSubmit={this.addOrEditPipelineStage}
        />
        {(createNew || edit) && this.renderCardFooter()}
      </ui-card>
    )
  }
}



// WEBPACK FOOTER //
// ../src/pages/pipelines/PipelineCardEdit.js