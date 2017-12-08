import React from 'react'
import {
  NoDataCard,
  UIButton,
  createPageContainer,
  WingsButtons,
  Confirm,
  Widget,
  SearchBox,
  PageBreadCrumbs,
  Utils,
  WingsCloneModal
} from 'components'
import NotificationSystem from 'react-notification-system'
import scriptLoader from 'react-async-script-loader'

import PipelineNewCardView from './views/PipelineNewCardView'
// import PipelineModal from './PipelineModal'
import PipelineEditorModal from './PipelineEditorModal'
// import EditPipelineStageModal from './EditPipelineStageModal'
import ExecutionModal from '../ExecutionModal/ExecutionModal'
import ExecPipelineModal from '../ArtifactPage/ExecPipelineModal'
import { PipelinesService, WorkflowService } from 'services'
import PipelineCardEdit from '../../pages/pipelines/PipelineCardEdit'

import apis from 'apis/apis'
import ABTest from '../../utils/ABTest'

const PIPELINE_PAGE_CLASS = 'pipeline-setup-page'

const fragmentArr = [
  { data: [] }, // will be set later
  { workflows: [] }
]
// ---------------------------------------- //

class EmptyComponent extends React.Component {
  render () {
    return null
  }
}

class PipelinePage extends React.Component {
  // TODO: propTypes
  static contextTypes = Utils.getDefaultContextTypes()
  title = this.renderBreadCrumbs()
  pageName = 'Setup Pipelines'
  state = {
    data: {},
    showModal: false,
    showExecModal: false,
    modalData: {},
    showArtifactModal: false,
    artifactModalData: {},
    filteredData: [],
    jsplumbLoaded: false,
    showCloneModal: false,
    cloneData: {}
  }
  accountIdFromUrl = this.props.urlParams.accountId // Utils.accountIdFromUrl()
  appIdFromUrl = this.props.urlParams.appId // Utils.appIdFromUrl()
  envId = Utils.envIdFromUrl()

  // fetchData = () => {
  //   fragmentArr[0].data = [ fetchInitialData, this.appIdFromUrl ]
  //   fragmentArr[1].workflows = [ apis.fetchWorkflows, this.appIdFromUrl ]

  //   // after routing back to this component, manually fetch data:
  //   if (__CLIENT__ && !this.props.data) {
  //     Utils.fetchFragmentsToState(fragmentArr, this)
  //   } else {
  //     this.setState(this.props)
  //   }
  // }

  fetchData = async () => {
    const { pipelines } = await PipelinesService.getPipelines(
      this.accountIdFromUrl,
      `&appId=${this.appIdFromUrl}&limit=1000`
    )
    const { workflows } = await WorkflowService.getWorkflows(
      this.accountIdFromUrl,
      `&appId=${this.appIdFromUrl}&limit=1000`
    )

    this.setState({ pipelines, workflows })
  }

  componentWillMount () {
    this.selectedApplication = Utils.findByUuid(this.props.dataStore.apps, this.appIdFromUrl)

    document.body.classList.add(PIPELINE_PAGE_CLASS)

    Utils.loadChildContextToState(this, 'app')
    const path = this.props.route.path

    this.setState({
      isNew: path.endsWith('/new'),
      isEdit: path.endsWith('/edit')
    })
  }

  componentWillUnmount () {
    document.body.classList.remove(PIPELINE_PAGE_CLASS)
    Utils.unsubscribeAllPubSub(this)
  }

  componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) {
      // load finished
      this.setState({ jsplumbLoaded: true })
    }
  }

  onSubmit = async (data, isEditing) => {
    const appId = this.props.urlParams.appId

    if (isEditing) {
      // Editing:
      const body = JSON.stringify(Utils.getJsonFields(data, 'name, description, pipelineStages'))
      const { error } = await PipelinesService.editItem(this.accountIdFromUrl, appId, data.uuid, body)
      if (!error) {
        await this.fetchData()
      } else {
        await this.fetchData()
        throw error
      }
    } else {
      // Adding:
      delete data['uuid']
      const { error } = await PipelinesService.createItem(this.accountIdFromUrl, appId, data)
      if (!error) {
        await this.fetchData()
      } else {
        await this.fetchData()
        throw error
      }
    }
    Utils.hideModal.bind(this)()
  }

  onDelete = item => {
    this.setState({ showConfirm: true, deletingId: item.uuid })
  }

  onDeleteConfirmed = async () => {
    // apis.service.destroy(getEndpoint(this.appIdFromUrl, this.state.deletingId))
    //   .then(() => this.fetchData())
    //   .catch(error => { this.fetchData(); throw error })
    // const query = Utils.getQueryParametersFromUrl(this.props.location.search)
    await PipelinesService.deleteItem(this.accountIdFromUrl, this.appIdFromUrl, this.state.deletingId)
    this.setState({ showConfirm: false, deletingId: '' })
    this.fetchData()
  }

  onNameClick = pipeline => {
    Utils.redirect({ appId: true, pipelineId: pipeline.uuid, page: 'editor' })
  }

  onSearchChanged = (ev, searchText) => {
    const _data = Utils.getJsonValue(this, 'state.data.resource.response') || []
    const filteredData = _data.filter(item => item.name.toLowerCase().indexOf(searchText.toLowerCase()) >= 0)
    this.setState({ filteredData })
  }

  showExecModal = pipeline => {
    // const modalData = data || {}
    // modalData.refreshWorkflowExecModal = true
    // this.setState({ showExecModal: true, modalData })

    // apis.service.fetch(`pipelines/executions?appId=${this.appIdFromUrl}&pipelineId=${data.uuid}`, {
    //   method: 'POST'
    // })
    //   .then(() => {
    //     this.hideExecModal()
    //     Utils.addNotification(this.refs.notif, 'success', 'Pipeline executed!')
    //   })

    // this.setState({ showArtifactModal: true })
    const pipelines = this.state.filteredData
    apis.fetchArtifacts(Utils.appIdFromUrl()).then(res => {
      const artifacts = res.resource.response

      apis.fetchArtifactStreamsData(Utils.appIdFromUrl()).then(res => {
        const artifactStreamData = res.resource.response
        const artifactModalData = {
          pipelines,
          artifacts,
          artifactStreamData,
          services: Utils.getJsonValue(this, 'state.app.services') || []
        }
        this.setState({ showArtifactModal: true, artifactModalData })
      })
    })
  }

  hideExecModal = () => {
    this.setState({ showExecModal: false })
  }

  onExecModalSubmit = formData => {
    const body = {
      artifacts: formData.artifacts
    }
    apis.service
      .fetch(`pipelines/${formData.uuid}/executions?appId=${this.appIdFromUrl}`, {
        method: 'POST',
        body
      })
      .then(() => {
        this.hideExecModal()
        // Utils.addNotification(this.refs.notif, 'success', 'Pipeline executed!')
        Utils.redirect({ appId: true, page: 'continuous-delivery' })
      })
  }

  addPipeline = () => {
    const { accountId, appId } = this.props.routeParams

    if (ABTest.isDeploymentV2Enabled) {
      this.props.router.push(this.props.path.toSetupPipeLinesNew({ accountId, appId }))
    } else {
      Utils.showModal.bind(this, null)()
    }
  }

  WidgetHeader = props => {
    const widgetData = Utils.getJsonValue(this, 'state.data.resource.response')
    const disableCls = widgetData !== null && widgetData.length === 0 ? 'disabled' : ''
    return (
      <div className="wings-widget-header col-md-12">
        <WingsButtons.Add text="Add Pipeline" className="" onClick={this.addPipeline} />

        <WingsButtons.Execute
          text="Execute Pipeline"
          className={disableCls}
          onClick={() => {
            if (widgetData.length > 0) {
              this.showExecModal()
            }
          }}
        />
        <SearchBox
          className="wings-card-search col-md-6 pull-right"
          source={widgetData}
          onChange={this.onSearchChanged}
        />
      </div>
    )
  }

  onArtifactSelected = formData => {
    this.setState({ showArtifactModal: false })
    // #TODO: allow multiple artifacts
    const execBody = {
      artifacts: Utils.mapToUuidArray(formData.artifacts),
      workflowType: 'PIPELINE'
      // workflowVariables: formData.workflowVariables
    }
    const pipeLineId = formData.pipelineSelect
    apis.service
      .fetch(`pipelines/executions?appId=${this.appIdFromUrl}&pipelineId=${pipeLineId}`, {
        method: 'POST',
        body: execBody
      })
      .then(() => {
        this.hideExecModal()
        // Utils.addNotification(this.refs.notif, 'success', 'Pipeline executed!')
        Utils.redirect({ appId: true, page: 'continuous-delivery' })
      })
  }

  clonePipeline = () => {
    Utils.showCloneModal.call(this)
  }

  onClonePipeline = data => {
    const pipelineId = data.uuid
    const obj = {}
    obj.name = data.name
    obj.description = !data.description ? '' : data.description
    apis.service
      .create(apis.getClonePipelineUrl(pipelineId, this.appIdFromUrl), {
        body: obj
      })
      .then(async () => {
        Utils.hideCloneModal.call(this)
        await this.fetchData({})
        this.forceUpdate()
      })
      .catch(error => {
        throw error
      })
  }

  renderBreadCrumbs () {
    const path = this.props.path
    const urlParams = this.props.urlParams
    const appName = this.props.appName || ''

    const bData = [
      { label: 'Setup', link: path.toSetup(urlParams) },
      { label: appName, link: path.toAppDetails(urlParams), dropdown: 'applications' },
      { label: 'Pipelines', link: path.toSetupPipeLines(urlParams), dropdown: 'application-children' }
    ]
    return <PageBreadCrumbs {...this.props} data={bData} />
  }

  renderNoData = () => {
    return <NoDataCard message="There are no Pipelines." buttonText="Add Pipeline" onClick={this.addPipeline} />
  }

  showEditStage = () => {
    this.setState({ showEditStage: true })
  }

  goToPipelines = () => {
    const { accountId, appId } = this.props.routeParams
    const { router, path } = this.props

    router.push(path.toSetupPipeLines({ accountId, appId }))
  }

  render () {
    const { accountId, appId, pipelineId } = this.props.routeParams

    // const pipelines = this.state.filteredData
    const pipelines = this.state.pipelines || []
    const appEnvs = Utils.findAppEnvs(this) || []
    // const workflows = Utils.getJsonValue(this, 'state.workflows.resource.response') || []
    const workflows = this.state.workflows || []
    const appServices = Utils.getJsonValue(this, 'state.app.services') || []
    const widgetViewParams = {
      jsplumbLoaded: this.state.jsplumbLoaded,
      data: pipelines,
      services: appServices,
      onExecClick: this.showExecModal,
      onNameClick: this.onNameClick,
      onClone: Utils.showCloneModal.bind(this),
      onEdit: Utils.showModal.bind(this),
      onDelete: this.onDelete,
      noDataMessage: this.renderNoData()
    }
    const widgetHeaderParams = {
      leftItem: (
        <span>
          <UIButton icon="Add" medium onClick={this.addPipeline}>
            Add Pipeline
          </UIButton>
        </span>
      ),
      showSearch: false
    }

    let editPipeline

    if (this.state.isEdit) {
      editPipeline = pipelines.filter(pipeline => pipeline.uuid === this.props.routeParams.pipelineId)
      editPipeline = Array.isArray(editPipeline) && editPipeline[0]
    }

    return (
      <section className={this.props.className}>
        <section className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              {!this.state.isNew &&
                !this.state.isEdit && (
                  <Widget
                    {...this.props}
                    title=""
                    headerComponent={this.WidgetHeader}
                    headerParams={widgetHeaderParams}
                    views={[
                      {
                        name: '',
                        icon: '',
                        component: ABTest.isDeploymentV2Enabled ? EmptyComponent : PipelineNewCardView,
                        params: widgetViewParams
                      }
                    ]}
                  />
                )}

              {/* Pipeline Setup Listing page */}
              {ABTest.isDeploymentV2Enabled &&
                !this.state.isNew &&
                !this.state.isEdit &&
                pipelines.map(pipeline => (
                  <PipelineCardEdit {...this.props}
                    key={pipeline.uuid}
                    pipeline={pipeline}
                    router={this.props.router}
                    path={this.props.path}
                    accountId={accountId}
                    appId={appId}
                    onClone={widgetViewParams.onClone}
                    onDelete={widgetViewParams.onDelete}
                    onEdit={_ =>
                      this.props.router.push(
                        this.props.path.toSetupPipeLinesEdit({
                          accountId,
                          appId,
                          pipelineId: pipeline.uuid
                        })
                      )
                    }
                  />
                ))}

              {/* Pipeline Create New */}
              {ABTest.isDeploymentV2Enabled &&
                this.state.isNew && (
                  <PipelineCardEdit {...this.props}
                    toaster={this.props.toaster}
                    router={this.props.router}
                    path={this.props.path}
                    accountId={accountId}
                    appId={appId}
                    environments={appEnvs}
                    workflows={workflows}
                    data={this.state.modalData}
                    goToPipelines={this.goToPipelines}
                    show={this.state.showEditStage}
                    createNew={true}
                    selectedApplication={this.selectedApplication}
                  />
                )}

              {/* Pipeline Edit */}
              {ABTest.isDeploymentV2Enabled &&
                this.state.isEdit &&
                this.state.pipelines &&
                this.state.workflows && (
                  <PipelineCardEdit {...this.props}
                    toaster={this.props.toaster}
                    router={this.props.router}
                    path={this.props.path}
                    accountId={accountId}
                    appId={appId}
                    pipelineId={pipelineId}
                    environments={appEnvs}
                    workflows={workflows}
                    data={this.state.modalData}
                    goToPipelines={this.goToPipelines}
                    show={this.state.showEditStage}
                    edit={true}
                    pipeline={editPipeline}
                    selectedApplication={this.selectedApplication}
                  />
                )}

              <PipelineEditorModal
                environments={appEnvs}
                workflows={workflows}
                data={this.state.modalData}
                show={this.state.showModal}
                onHide={Utils.hideModal.bind(this)}
                onSubmit={this.onSubmit}
              />
              <ExecutionModal
                data={this.state.modalData}
                forPipeline={true}
                fetchArtifacts={apis.fetchArtifacts}
                fetchOrchestrations={apis.fetchWorkflows}
                show={this.state.showExecModal}
                onHide={this.hideExecModal.bind(this)}
                onSubmit={this.onExecModalSubmit}
              />
              <ExecPipelineModal
                show={this.state.showArtifactModal}
                data={this.state.artifactModalData}
                onHide={Utils.hideModal.bind(this, 'showArtifactModal')}
                onSubmit={this.onArtifactSelected}
                appId={this.appIdFromUrl}
                envId={this.envId}
              />

              <Confirm
                visible={this.state.showConfirm}
                onConfirm={this.onDeleteConfirmed}
                onClose={Utils.hideModal.bind(this, 'showConfirm')}
                body="Are you sure you want to delete this?"
                confirmText="Confirm Delete"
                title="Deleting"
              >
                <button style={{ display: 'none' }} />
              </Confirm>
              <NotificationSystem ref="notif" />

              <WingsCloneModal
                show={this.state.showCloneModal}
                onHide={() => Utils.hideCloneModal.call(this)}
                cloneData={this.state.cloneData}
                type="Pipeline"
                onCloneSubmit={data => this.onClonePipeline(data)}
              />
            </div>
          </div>
        </section>
      </section>
    )
  }
}

const WrappedPage = createPageContainer()(PipelinePage)
const PageWithScripts = scriptLoader(Utils.getRootUrl() + 'libs/jsplumb/jsplumb-all.min.js')(WrappedPage)
export default Utils.createTransmitContainer(PageWithScripts, fragmentArr)



// WEBPACK FOOTER //
// ../src/containers/PipelinePage/PipelinePage.js