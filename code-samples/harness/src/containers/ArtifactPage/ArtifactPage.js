import React from 'react'
import { WingsButtons, Widget, SearchBox, Utils, CompUtils, StreamComponent, AppStorage } from 'components'
import SimpleExecModal from '../DeploymentPage/SimpleExecModal'
import apis from 'apis/apis'
import ArtifactListView from './views/ArtifactListView'
import ArtifactModal from './ArtifactModal'
import css from './ArtifactPage.css'
import streams from 'apis/streams'

const fragmentArr = [{ data: [] }, { artifactStreamData: [] }]

const getDownloadEndpoint = (appId, artifactId) => {
  return `artifacts/${artifactId}/artifactFile?appId=${appId}`
}

class ArtifactPage extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    ...Utils.getDefaultContextTypes()
  }

  state = {
    data: {},
    showModal: false,
    modalData: {},
    filteredData: []
  }
  idFromUrl = Utils.getIdFromUrl()
  appIdFromUrl = Utils.appIdFromUrl()
  accountId = AppStorage.get('acctId')

  componentWillMount () {
    Utils.loadChildContextToState(this, 'app')
    this.fetchData()
    this.props.onPageWillMount(<h3>Artifacts</h3>, 'Artifacts')
  }

  componentWillUnmount () {
    Utils.unsubscribeAllPubSub(this)
  }

  fetchData = () => {
    fragmentArr[0].data = [apis.fetchArtifacts, this.appIdFromUrl]
    fragmentArr[1].artifactStreamData = [apis.fetchArtifactStreamsData, this.appIdFromUrl]

    // after routing back to this component, manually fetch data:
    if (__CLIENT__ && !this.props.data) {
      Utils.fetchFragmentsToState(fragmentArr, this)
      this.state.data.resource = this.state.data.resource || { response: [] } // make sure we have 'response'
    } else {
      this.setState(this.props)
    }
  }

  handleStreamData = streamObj => {
    if (!streamObj) {
      return
    }

    if (streamObj.uuid) {
      apis.service
        .list(apis.getArtifactEndPoint(this.appIdFromUrl, streamObj.uuid))
        .then(resp => {
          CompUtils.handleStreamData(this, resp, this.state.data, streamObj)
        })
        .catch(error => {
          throw error
        })
    }
  }

  onSubmit = data => {
    apis.service
      .create(apis.getArtifactEndPoint(this.appIdFromUrl), { body: JSON.stringify(data) })
      .then(() => this.fetchData())
      .catch(error => {
        this.fetchData()
        throw error
      })

    Utils.hideModal.bind(this)()
  }

  onDownload = artifact => {
    Utils.downloadFile(getDownloadEndpoint(this.appIdFromUrl, artifact.uuid), artifact.displayName)
  }

  hideSimpleExecModal = () => {
    this.setState({ showSimpleExecModal: false })
  }

  showSimpleExecModal = data => {
    this.setState({ showSimpleExecModal: true })
  }

  onDeploy = artifact => {
    this.setState({ showSimpleExecModal: true })
  }

  onSearchChanged = (ev, searchText) => {
    const _rData = Utils.getJsonValue(this, 'state.data.resource.response')
    const filteredData = _rData.filter(item => item.displayName.toLowerCase().indexOf(searchText) >= 0)
    this.setState({ filteredData })
  }

  onSimpleExecSubmit = formData => {
    const body = {
      workflowType: 'SIMPLE',
      serviceId: formData.service,
      serviceInstances: formData.serviceInstances,
      commandName: formData.commandName,
      executionStrategy: formData.executionStrategy,
      artifacts: formData.artifacts,
      executionCredential: formData.executionCredential
    }
    apis.service
      .fetch(`executions?appId=${this.appIdFromUrl}&envId=${formData.environment}`, {
        method: 'POST',
        body
      })
      .then(() => {
        this.hideSimpleExecModal()
        Utils.redirect({ appId: true, envId: formData.environment, page: 'executions' })
      })
  }

  hideSimpleExecModal = () => {
    this.setState({ showSimpleExecModal: false })
  }

  WidgetHeader = props => {
    const widgetData = Utils.getJsonValue(this, 'state.data.resource.response')
    return (
      <div className={css.alignHeader}>
        <WingsButtons.Execute text="Execute Command" className="" onClick={this.showSimpleExecModal.bind(this, null)} />
        <WingsButtons.Add
          text="Add Artifact"
          className=""
          data-name="add-new-artifact"
          onClick={Utils.showModal.bind(this, null)}
        />
        <SearchBox className="wings-card-search pull-right" source={widgetData} onChange={this.onSearchChanged} />
      </div>
    )
  }

  render () {
    const selectedApp = Utils.findApp(this) || Utils.appIdFromUrl()

    if (!selectedApp) {
      return null
    }

    const appServices = selectedApp.services
    const artifactStreamData = Utils.getJsonValue(this, 'state.artifactStreamData.resource.response')
    const widgetViewParams = {
      data: this.state.filteredData,
      artifactStreamData: artifactStreamData,
      services: appServices,
      onDeploy: this.onDeploy,
      onDownload: this.onDownload,
      showActions: false
    }

    return (
      <section className={css.main}>
        <section className="content">
          <Widget
            title=""
            headerComponent={this.WidgetHeader}
            views={[
              {
                name: '',
                component: ArtifactListView,
                params: widgetViewParams
              }
            ]}
          />
          <SimpleExecModal
            data={this.state.modalData}
            catalogs={this.state.catalogs}
            services={appServices || []}
            fetchService={apis.fetchService}
            fetchArtifacts={apis.fetchArtifacts}
            fetchInstances={apis.fetchInstances}
            show={this.state.showSimpleExecModal}
            onHide={this.hideSimpleExecModal.bind(this)}
            onSubmit={this.onSimpleExecSubmit}
          />
          <ArtifactModal
            data={this.state.modalData}
            artifactStreamData={artifactStreamData}
            appIdFromUrl={this.appIdFromUrl}
            show={this.state.showModal}
            onHide={Utils.hideModal.bind(this)}
            onSubmit={this.onSubmit}
          />
        </section>
        <StreamComponent
          url={streams.streamArtifactEndPoint(this.appIdFromUrl, this.accountId)}
          callback={this.handleStreamData}
        />
      </section>
    )
  }
}

export default Utils.createTransmitContainer(ArtifactPage, fragmentArr)



// WEBPACK FOOTER //
// ../src/containers/ArtifactPage/ArtifactPage.js