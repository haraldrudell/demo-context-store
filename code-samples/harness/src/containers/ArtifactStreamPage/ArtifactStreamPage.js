import React from 'react'
import scriptLoader from 'react-async-script-loader'
import {
  WingsButtons,
  ConfirmDelete,
  Utils,
  ArtifactStreamTourModal,
  PageBreadCrumbs,
  createPageContainer
} from 'components'
import { TourStage } from 'utils'
import apis from 'apis/apis'
import ArtifactStreamCardView from './views/ArtifactStreamCardView'
import ArtifactActionModal from './ArtifactActionModal'
import css from './ArtifactStreamPage.css'

const fragmentArr = [{ data: [] }, { pipelines: [] }]

class ArtifactStreamPage extends React.Component {
  state = {
    data: {},
    showModal: false,
    showAddActionModal: false,
    showTourModal: false,
    actionModalArtifactStream: null,
    actionModalData: {},
    modalData: {},
    filteredData: [],
    noDataCls: 'hide',
    sortedStreamData: null,
    initialised: false
  }
  title = this.renderBreadCrumbs()
  pageName = 'Setup Triggers'
  autoFetch = false
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    ...Utils.getDefaultContextTypes()
  }

  componentWillMount () {
    Utils.loadCatalogsToState(this)
    this.fetchData({ appId: this.props.appId })
  }

  componentDidMount () {
    this.appIdFromUrl = this.props.appId
    /* if (this.props.isTourOn && this.props.tourStage === TourStage.ARTIFACT) {
      setTimeout(() => {
        this.props.addSteps(TourSteps.ARTIFACT_STREAM)
        this.props.onTourStart()
      }, 1000)
    }*/
  }

  componentWillUnmount () {
    Utils.unsubscribeAllPubSub(this)
  }
  componentWillReceiveProps (newProps) {
    /* if (newProps.activeKey === 5 &&
    newProps.appId && !this.state.initialised) {
      Utils.loadChildContextToState(this, 'app')
      this.appIdFromUrl = newProps.appId
      this.fetchData(newProps.appId)
      this.setState({ initialised: true })
    }*/
  }
  componentWillUnmount () {
    this.setState({ initialised: false })
  }

  fetchData = ({ appId = this.props.appId }) => {
    this.props.spinner.show()
    fragmentArr[0].data = [apis.fetchArtifactStreamsData, appId]
    fragmentArr[1].pipelines = [apis.fetchPipelines, appId]

    // after routing back to this component, manually fetch data:
    if (__CLIENT__ && !this.props.data) {
      Utils.fetchFragmentsToState(fragmentArr, this, (key, result) => {
        if (key === 'data') {
          if (result.resource.response) {
            if (result.resource.response.length > 0) {
              this.filterTriggerByActions(result.resource.response)
            } else {
              this.setState({ noDataCls: '' })
            }
            this.props.spinner.hide()
          }
        }
      })
      this.state.data.resource = this.state.data.resource || { response: [] } // make sure we have 'response'
    } else {
      this.setState(this.props)
    }
  }

  onSubmit = () => {
    this.fetchData({ appId: this.props.appId })
    if (this.props.isTourOn && this.props.tourStage === TourStage.ARTIFACT) {
      setTimeout(() => {
        this.setState({ showTourModal: true })
      }, 1000)
    }

    Utils.hideModal.call(this)
  }

  onSubmitAction = (artifactStream, data, isEdit) => {
    if (isEdit) {
      return apis.service.replace(
        apis.getArtifactStreamActionEndPoint(this.appIdFromUrl, artifactStream.uuid, data.uuid),
        { body: JSON.stringify(data) }
      )
    } else {
      return apis.service.create(apis.getArtifactStreamActionEndPoint(this.appIdFromUrl, artifactStream.uuid), {
        body: JSON.stringify(data)
      })
    }
  }

  afterSubmitAction = () => {
    this.fetchData(this.props.appId)
  }

  onDelete = id => {
    this.setState({ showConfirm: true, deletingId: id })
  }

  onDeleteConfirmed = () => {
    apis.service
      .destroy(apis.getArtifactStreamsEndPoint(this.appIdFromUrl, this.state.deletingId))
      .then(() => this.fetchData(this.props.appId))
      .catch(error => {
        throw error
      })
    this.setState({ showConfirm: false, deletingId: '' })
  }

  onAddAction = artifactStream => {
    this.setState({
      showAddActionModal: true,
      actionModalArtifactStream: null,
      actionModalData: null
    })
  }

  onEditAction = (artifactStream, action) => {
    this.setState({
      showAddActionModal: true,
      actionModalArtifactStream: artifactStream,
      actionModalData: action
    })
  }

  onDeleteAction = (artifactStream, id) => {
    this.setState({
      showActionConfirm: true,
      deletingArtifactStramId: artifactStream.uuid,
      deletingActionId: id
    })
  }

  onDeleteActionConfirmed = () => {
    apis.service
      .destroy(
        apis.getArtifactStreamActionEndPoint(
          this.appIdFromUrl,
          this.state.deletingArtifactStramId,
          this.state.deletingActionId
        )
      )
      .then(() => this.fetchData(this.props.appId))
      .catch(error => {
        throw error
      })
    this.setState({ showActionConfirm: false, deletingArtifactStramId: '', deletingActionId: '' })
  }

  onAddClick = () => {
    Utils.showModal.call(this, null)
    if (this.props.isTourOn && this.props.tourStage === TourStage.ARTIFACT) {
      this.props.onTourPause()
    }
  }

  onHideModal = () => {
    if (!(this.props.isTourOn && this.props.tourStage === TourStage.ARTIFACT)) {
      Utils.hideModal.call(this)
    }
  }

  onTourSubmit = () => {
    const selectedApp = Utils.findApp(this)
    const environments = selectedApp ? selectedApp.environments : []
    this.setState({ showTourModal: false })
    this.props.onTourStop()
    Utils.redirect({ appId: true, envId: environments[0].uuid, page: 'executions' })
  }

  onTourCancel = () => {
    this.setState({ showTourModal: false })
    this.props.onTourStop()
  }

  WidgetHeader = props => {
    return (
      <span>
        <WingsButtons.Add text="Add Artifact Stream" className="" onClick={this.onAddClick} />
      </span>
    )
  }

  renderBreadCrumbs () {
    const path = this.props.path
    const urlParams = this.props.urlParams
    const appName = this.props.appName || ''
    const bData = [
      { label: 'Setup', link: path.toSetup(urlParams) },
      { label: appName, link: path.toAppDetails(urlParams), dropdown: 'applications' },
      { label: 'Triggers', link: path.toSetupTriggers(urlParams), dropdown: 'application-children' }
    ]
    return <PageBreadCrumbs {...this.props} data={bData} />
  }

  filterTriggerByActions (data) {
    if (data) {
      const sortedData = Object.keys(data).reduce((result, key, index) => {
        const streamActions = data[key].streamActions
        if (streamActions.length > 0) {
          result.push(data[key])
        }
        return result
      }, [])
      if (sortedData.length > 0) {
        const data = Utils.sortDataByKey(sortedData, 'sourceName')
        this.setState({ noDataCls: 'hide', sortedStreamData: data })
      } else {
        this.setState({ noDataCls: '', sortedStreamData: null })
      }
    }
  }
  findApp = appId => {
    if (this.props.dataStore) {
      const apps = this.props.dataStore.apps
      return apps.find(app => app.uuid === appId)
    }
  }

  render () {
    const selectedApp = this.findApp(this.appIdFromUrl)
    const services = selectedApp ? selectedApp.services : []
    const environments = selectedApp ? selectedApp.environments : []
    const pipelines = Utils.getJsonValue(this, 'state.pipelines.resource.response') || []
    const widgetViewParams = {
      data: Utils.getJsonValue(this, 'state.data.resource.response') || [],
      sortedStreamData: Utils.getJsonValue(this, 'state.sortedStreamData') || [],
      environments: environments,
      services: services,
      pipelines: pipelines,
      onEdit: Utils.showModal.bind(this),
      onDelete: this.onDelete,
      appIdFromUrl: this.appIdFromUrl,
      onAddAction: this.onAddAction,
      onEditAction: this.onEditAction,
      onDeleteAction: this.onDeleteAction,
      catalogs: this.state.catalogs
    }
    return (
      <section className={css.main}>
        <section className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <span>
                <WingsButtons.Add
                  text="Add Auto Deployment Triggers"
                  className={css.addTriggersBtn}
                  onClick={() => {
                    widgetViewParams.onAddAction.call(this)
                  }}
                />
              </span>
            </div>
          </div>
          <ArtifactStreamCardView
            {...this.props}
            params={widgetViewParams}
            noDataCls={this.state.noDataCls}
            services={widgetViewParams.services}
            catalogs={widgetViewParams.catalogs}
          />
        </section>
        {this.state.showAddActionModal &&
          <ArtifactActionModal
            artifactStream={this.state.actionModalArtifactStream}
            data={this.state.actionModalData}
            environments={environments}
            fetchWorkflows={apis.fetchWorkflows}
            pipelines={pipelines}
            show={true}
            onHide={Utils.hideModal.bind(this, 'showAddActionModal')}
            appIdFromUrl={this.props.appId}
            urlParams={this.props.urlParams}
            isScriptLoaded={this.props.isScriptLoaded}
            onSubmit={this.onSubmitAction}
            artifactsData={widgetViewParams.data}
            services={widgetViewParams.services}
            afterSubmitAction={this.afterSubmitAction}
          />}
        <ConfirmDelete
          visible={this.state.showConfirm}
          onConfirm={this.onDeleteConfirmed}
          onClose={Utils.hideModal.bind(this, 'showConfirm')}
        />

        <ConfirmDelete
          visible={this.state.showActionConfirm}
          onConfirm={this.onDeleteActionConfirmed}
          onClose={Utils.hideModal.bind(this, 'showActionConfirm')}
        />
        <ArtifactStreamTourModal
          show={this.state.showTourModal}
          onHide={this.onTourCancel}
          onSubmit={this.onTourSubmit}
        />
      </section>
    )
  }
}
const WrappedPage = createPageContainer()(ArtifactStreamPage)
const PageWithScripts = scriptLoader(Utils.getRootUrl() + 'libs/cron-ui.js')(WrappedPage)
export default PageWithScripts



// WEBPACK FOOTER //
// ../src/containers/ArtifactStreamPage/ArtifactStreamPage.js