import React from 'react'
import { AppsDropdown, CompUtils, WingsButtons, Utils, PageBreadCrumbs } from 'components'
import apis from 'apis/apis'
import PipelineExecCardView from './views/PipelineExecCardView'
import ExecPipelineModalV2 from '../../containers/ArtifactPage/ExecPipelineModalV2'
import css from './PipelinesExecutionPage.css'
import { PipelinesService } from 'services'
import PipelineCardView from './PipelineCardView'
import ABTest from '../../utils/ABTest'

const POLL_INTERVAL = 5000

const fragmentArr = [
  // { pipelines: [] },
  { executions: [] }
]

export default class PipelinesExecutionPage extends React.Component {
  // TODO: propTypes
  static contextTypes = Utils.getDefaultContextTypes()
  state = {
    pipelines: {},
    filteredData: [],
    selectedPipeLine: false,
    jsplumbLoaded: false,
    showArtifactModal: false,
    artifactModalData: null,
    initialFetchComplete: false
  }
  appIdFromUrl = Utils.appIdFromUrl()
  accountIdFromUrl = Utils.accountIdFromUrl()
  objPipelines = {}
  pollingHandler = null
  pollingFetchDone = false
  title = this.renderTitleBreadCrumbs()
  pageName = 'Pipelines'

  get header () {
    return <AppsDropdown store={this.props.dataStore} onSelected={this.onAppsSelected} />
  }

  onAppsSelected = async () => {
    await this.fetchInitialData()
  }

  async componentWillMount () {
    Utils.loadChildContextToState(this, 'app')
    this.setState({ initialFetchComplete: false })
    // this.fetchData()
    await this.fetchInitialData()
    this.pollingHandler = setInterval(this.onPollInterval, POLL_INTERVAL)
  }

  componentWillUnmount () {
    clearInterval(this.pollingHandler)
  }

  componentWillReceiveProps (newProps, { isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) {
      // load finished
      this.setState({ jsplumbLoaded: true })
    }
  }

  fetchData = () => {
    // this.appIdFromUrl = Utils.appIdFromUrl()
    this.accountIdFromUrl = Utils.accountIdFromUrl()
    if (!this.accountIdFromUrl) {
      return
    }
    // fragmentArr[0].pipelines = [ PipelinesService.fetchPipelines, this.accountIdFromUrl,
    //   Utils.buildSelectedAppIdsQueryParams() ]
    fragmentArr[0].executions = [
      PipelinesService.fetchPipelineExecutions,
      this.accountIdFromUrl,
      Utils.buildSelectedAppIdsQueryParams()
    ]

    // after routing back to this component, manually fetch data:
    if (!this.props.pipelines) {
      Utils.fetchFragmentsToState(fragmentArr, this, this.updatePipelineInfo.bind(this), () => {
        this.pollingFetchDone = true
        this.setState({ initialFetchComplete: true })
      })
    } else {
      this.setState(this.props)
    }
  }

  fetchInitialData = async () => {
    this.accountIdFromUrl = Utils.accountIdFromUrl()
    if (!this.accountIdFromUrl) {
      return
    }
    const { pipelines } = await PipelinesService.getPipelines(
      this.accountIdFromUrl,
      Utils.buildSelectedAppIdsQueryParams()
    )
    this.setState({ pipelines })

    // fragmentArr[0].pipelines = [ PipelinesService.fetchPipelines, this.accountIdFromUrl ]
    fragmentArr[0].executions = [
      PipelinesService.fetchPipelineExecutions,
      this.accountIdFromUrl,
      Utils.buildSelectedAppIdsQueryParams()
    ]

    // after routing back to this component, manually fetch data:
    if (__CLIENT__ && !this.props.pipelines) {
      Utils.fetchFragmentsToState(fragmentArr, this, this.updatePipelineInfo.bind(this), () => {
        this.pollingFetchDone = true
        this.setState({ initialFetchComplete: true })
      })
    } else {
      this.setState(this.props)
    }
  }

  updatePipelineInfo (key, pipelinesRes) {
    if (pipelinesRes && pipelinesRes.resource) {
      const pipelines = pipelinesRes.resource.response || []

      pipelines.map(item => {
        this.objPipelines[item.uuid] = item.name
      })

      if (this.objPipelines && this.objPipelines.length > 0) {
        const selectedPipeLine = Object.keys(this.objPipelines)[0]
        this.fetchExecutions(selectedPipeLine)
        this.setState({ selectedPipeLine: selectedPipeLine })
      }
    }
  }

  fetchExecutions (selectedPipeLine) {
    apis.service
      .list(getExecutionsEndPoint(this.appIdFromUrl, selectedPipeLine))
      .then(res => {
        if (res.resource) {
          this.updateExecutions(res.resource.response)
        } else {
          //  console.log('No Builds available')
        }
      })
      .catch(error => {
        throw error
      })
  }

  updateExecutions (data) {
    this.setState({ data })
  }

  onNameClick = () => {}

  onDelete = () => {}

  // pipeLineChanged = (event) => {
  //   const selectedPipeLine = event.target.value
  //   this.fetchExecutions(selectedPipeLine)
  //   this.setState( { 'selectedPipeLine': selectedPipeLine })
  // }

  // renderDropDown () {
  //   const _keysArr = Object.keys(this.objPipelines) || []
  //
  //   if (_keysArr.length <= 0) {
  //     return ''
  //   } else {
  //     return (
  //       <select className="form-control" value={this.state.selectedPipeLine} onChange={this.pipeLineChanged}>
  //         { _keysArr.map((key) =>
  //           <option key={key} value={key}>{this.objPipelines[key]}</option>
  //         )}
  //       </select>
  //     )
  //   }
  // }

  showExecModal = async () => {
    await PipelinesService.fetchPipelines(
      Utils.accountIdFromUrl(),
      Utils.buildSelectedAppIdsQueryParams()
    ).then(res => {
      //   const pipelines = res.resource.response

      //   apis.fetchArtifacts(this.appIdFromUrl).then((res) => {
      //     const artifacts = res.resource.response

      //     apis.fetchArtifactStreamsData(this.appIdFromUrl).then((res) => {
      //       const artifactStreamData = res.resource.response
      //       const artifactModalData = {
      //         pipelines,
      //         artifacts,
      //         artifactStreamData,
      //         services: Utils.getJsonValue(this, 'state.app.services') || []
      //       }
      //       this.setState({ showArtifactModal: true, artifactModalData })
      //     })
      // })
      this.setState({ showArtifactModal: true })
    })
  }

  onAddPipeline = () => {
    const apps = this.props.dataStore.getSelectedApps()
    if (apps && apps[0]) {
      // Utils.redirectToPipelinesSetupPage(apps[0].uuid)
      const { accountId } = this.props.urlParams
      this.props.router.push(this.props.path.toSetupPipeLines({ accountId, appId: apps[0].uuid }))
    }
  }

  onArtifactSelected = formData => {
    const execBody = {
      artifacts: Utils.mapToUuidArray(formData.artifacts),
      workflowType: 'PIPELINE'
    }
    const pipeLineId = formData.pipelineSelect
    apis.service
      .fetch(`pipelines/executions?appId=${formData.appId}&pipelineId=${pipeLineId}`, {
        method: 'POST',
        body: execBody
      })
      .then(() => {
        this.setState({ showArtifactModal: false })
        // Utils.addNotification(this.refs.notif, 'success', 'Pipeline executed!')
        this.fetchData()
      })
  }

  onPollInterval = Utils.debounce(
    () => {
      if (this.state.showArtifactModal) {
        return
      }
      // console.log('Polling... ', this.pollingFetchDone)
      if (this.pollingFetchDone) {
        this.pollingFetchDone = false
        this.fetchData()
      } else {
        // console.log('Polling... Last fetching has not been done! ')
      }
    },
    500,
    true
  )

  noExecutionsMessage = () => {
    const apps = this.props.dataStore.getSelectedApps()
    if (!apps || !apps[0]) {
      return null
    }
    return (
      <ui-card>
        <main className="no-data-box">
          <span>No Pipelines have been executed.</span>
          <span className="wings-text-link cta-button" onClick={() => this.showExecModal()}>
            Execute Pipeline
          </span>
        </main>
      </ui-card>
    )
  }

  noPipelinesMessage = () => {
    const apps = this.props.dataStore.getSelectedApps()
    if (!apps || !apps[0]) {
      return null
    }
    return (
      <ui-card>
        <main className="no-data-box">
          <span>There are no Pipelines.</span>
          <span className="wings-text-link cta-button" onClick={this.onAddPipeline}>
            Add new Pipeline
          </span>
        </main>
      </ui-card>
    )
  }

  renderTitleBreadCrumbs () {
    const bData = [{ label: 'Pipelines' }]
    return <PageBreadCrumbs data={bData} />
  }

  onRerunClick = ({ appId: selectedAppId, pipelineId: selectedPipelineId, execution }) => {
    this.setState({
      selectedAppId,
      selectedPipelineId,
      showArtifactModal: true,
      selectedExecution: execution
    })
  }

  render () {
    const executions = Utils.getJsonValue(this, 'state.executions.resource.response') || []
    const pipelines = Utils.getJsonValue(this, 'state.pipelines') || []

    return (
      <section className={css.main}>
        <section className="content">
          <div className="__actionHeader">
            <WingsButtons.Execute
              disableButton={pipelines && pipelines.length === 0}
              text="Execute Pipeline"
              className=""
              onClick={() => this.showExecModal()}
            />
          </div>

          {/* Before first fetch, show the spinner. */}
          <div>
            {!this.state.initialFetchComplete &&
              CompUtils.renderLoadingStatus({ state: { loadingStatus: 1 } }, pipelines, '')}
          </div>

          {/* After first fetch, show the 'no pipelines' message, if applicable. */}
          {pipelines && pipelines.length === 0 && this.state.initialFetchComplete && this.noPipelinesMessage()}

          {(ABTest.isDeploymentV2Enabled &&
            pipelines &&
            pipelines.length > 0 &&
            this.state.initialFetchComplete &&
            executions &&
            executions.length > 0 &&
            executions.map(execution => (
              <PipelineCardView
                {...this.props}
                path={this.props.path}
                router={this.props.router}
                routeParams={this.props.routeParams}
                key={execution.uuid}
                // executions={executions}
                execution={execution}
                pipelines={pipelines}
                onRerunClick={this.onRerunClick}
              />
            ))) ||
            this.noExecutionsMessage()}

          {/* After first fetch, if there are Pipelines, show the
          'No Pipelines have been executed.' message, if applicable. */}
          {!ABTest.iisDeploymentV2Enabled &&
            pipelines &&
            pipelines.length > 0 &&
            this.state.initialFetchComplete &&
            executions &&
            executions.length === 0 &&
            this.noExecutionsMessage()}

          {!ABTest.isDeploymentV2Enabled && (
            <PipelineExecCardView {...this.props} pipelines={pipelines} executions={executions} />
          )}

          <ExecPipelineModalV2
            {...this.props}
            show={this.state.showArtifactModal}
            onHide={_ => {
              this.setState({
                showArtifactModal: false,
                selectedExecution: null,
                selectedAppId: null,
                selectedPipelineId: null
              })
            }}
            pipelines={pipelines}
            accountId={this.props.urlParams.accountId}
            appId={this.state.selectedAppId}
            pipelineId={this.state.selectedPipelineId}
            execution={this.state.selectedExecution}
            onSubmit={this.onArtifactSelected}
          />
        </section>
      </section>
    )
  }
}



// WEBPACK FOOTER //
// ../src/pages/pipelines/PipelinesExecutionPage.js