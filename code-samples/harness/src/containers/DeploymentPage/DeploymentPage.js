import React from 'react'
import scriptLoader from 'react-async-script-loader'
import {
  Confirm,
  createPageContainer,
  Widget,
  WingsButtons,
  asyncPoll,
  Utils,
  InfiniteScrollingSpinner,
  PageBreadCrumbs,
  RecordsFilter
} from 'components'
import NotificationSystem from 'react-notification-system'
import { Dropdown, MenuItem } from 'react-bootstrap'

import DeploymentCardView from './views/DeploymentCardView'
import StartDeploymentModal from '../ExecutionModal/StartDeploymentModal'
import { FiltersDataStore } from 'utils'
import apis from 'apis/apis'
import css from './DeploymentPage.css'
import DeploymentsByDateModal from '../Dashboard/DeploymentsByDateModal'
import cache from 'plain-cache'
import { LabellingDropdown } from '../../components/LabellingDropdown/LabellingDropdown'

const POLL_INTERVAL_TIMEOUT = 1000
const LIMIT = 20
const DEPLOYMENT_CACHE_KEY = 'DeploymentPageCache'
const DEPLOYMENT_CACHE_TIMEOUT = 1000 * 60 * 60 * 24

const getEndpoint = ({ execId, envId, fromTimestamp, offset, appId }) => {
  let url = (execId ? 'executions/' + execId : 'executions') + '?limit=' + LIMIT
  url += offset ? `&offset=${offset}` : ''
  url += envId ? '&envId=' + envId : ''

  if (fromTimestamp) {
    url += `&search[0][field]=createdAt&search[0][op]=GT&search[0][value]=${fromTimestamp}`
  } else {
    url += '&sort[0][field]=createdAt&sort[0][direction]=DESC'
  }

  url += `&appId=${appId}`

  return url
}

const getExecutionsEndpoint = (execId, envId, fromTimestamp, offset, limit = LIMIT, apiFilterParams = '') => {
  const accountId = Utils.accountIdFromUrl()

  let url = (execId ? 'executions/' + execId : 'executions') + '?limit=' + limit
  url += offset ? `&offset=${offset}` : ''
  url += '&accountId=' + accountId

  if (fromTimestamp) {
    url += `&search[0][field]=createdAt&search[0][op]=GT&search[0][value]=${fromTimestamp}`
  } else {
    url += '&sort[0][field]=createdAt&sort[0][direction]=DESC'
  }

  url += apiFilterParams

  return url
}

const fetchInitialExecutionsData = (envId, fromTimestamp, offset, limit, apiFilterParams) => {
  return apis.service
    .list(getExecutionsEndpoint(null, envId, fromTimestamp, offset, limit, apiFilterParams))
    .catch(error => {
      throw error
    })
}

const fragmentArr = [{ data: [] }]

class DeploymentPage extends React.Component {
  static contextTypes = Utils.getDefaultContextTypes() // TODO Any need for this? Should be removed
  noFilter = deployments => deployments

  state = {
    data: {},
    showModal: false,
    modalStartTime: Date.now(),
    deployments: [],
    hasNewItems: false,
    deploymentStats: [],
    sortingFunction: Utils.sortByMostRecent,
    deploymentsFilteringFunction: this.noFilter,
    includeNonProductionDeployments: true,
    topServices: [],
    showWorkflowExecModal: false,
    modalData: {},
    jsplumbLoaded: false,
    showAbortConfirm: false,
    abortingUuid: null,
    disableBtn: false,
    pausePolling: false,
    showFilters: false,
    numFiltersApplied: 0
  }
  envIdFromUrl = Utils.envIdFromUrl()

  title = <PageBreadCrumbs data={[{ label: 'Deployments' }]} />
  pageName = 'Deployments'
  isRerun = false
  initialSortCategoryIdx = 0

  componentWillMount () {
    const cachedData = cache.get(DEPLOYMENT_CACHE_KEY)

    if (cachedData) {
      this.isFirstFetchDone = true
      this.limit = cachedData.limit
      this.totalDeployments = cachedData.totalDeployments
      this.setState(cachedData.states)
      cache.del(DEPLOYMENT_CACHE_KEY)
    } else {
      this.isFirstFetchDone = false
      this.limit = LIMIT
    }
  }

  componentDidMount () {
    this.doPolling()
    this.scrollEvents = Utils.onScrollDownEvent({
      handler: this.infiniteScrollHandler
    })
  }

  componentWillUnmount () {
    clearTimeout(this.pollingTimeoutId)
    Utils.unsubscribeAllPubSub(this)
    this.scrollEvents.off('scroll:progress')

    const { deployments, deploymentStats, topServices } = this.state
    cache.set(
      DEPLOYMENT_CACHE_KEY,
      {
        states: { deployments, deploymentStats, topServices },
        limit: this.limit,
        totalDeployments: this.totalDeployments
      },
      DEPLOYMENT_CACHE_TIMEOUT
    )
  }

  componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) {
      // load finished
      this.setState({ jsplumbLoaded: true })
    }
  }

  fetchDataAfterFitler = ({ urlParams }) => {
    this.apiFilterParams = urlParams
    this.props.spinner.show()
    this.fetchData({})
  }

  fetchData = ({ fromTimestamp, offset, fetchKey = +new Date(), onFetchDone }) => {
    // TODO hack to avoid unneccessary rendering from fetchFragmentsToState(), remove when async/await in place
    const ctx = { setState: () => {} }
    this.accountIdFromUrl = Utils.accountIdFromUrl()

    // Remember latest fetch so only its data will be processed
    this.fetchKey = fetchKey

    // TODO Do async/await for these calls
    fragmentArr[0].data = [
      fetchInitialExecutionsData,
      this.envIdFromUrl,
      null,
      offset,
      this.limit,
      this.apiFilterParams
    ]

    Utils.fetchFragmentsToState(
      fragmentArr,
      ctx,
      null,
      ({ data: { resource: executions, resource: { response: deployments } } }) => {
        // only set new state for latest fetchKey
        if (this.fetchKey === fetchKey) {
          this.props.spinner.hide()
          this.setState({ deployments })
        }
        if (!this.isFirstFetchDone) {
          this.onFirstFetchDone(executions)
        }
        if (onFetchDone) {
          onFetchDone()
        }
      }
    )
  }

  onDateClick = item => this.setState({ showModal: true, modalStartTime: item.date })

  generateModalData = deployment => {
    const modalData = {}
    if (deployment) {
      modalData['applicationId'] = deployment.appId
      modalData['envId'] = deployment.envId
      modalData['orchestrationWorkflow'] = deployment.workflowId
      // check if artifacts are available
      modalData['artifacts'] = deployment.executionArgs.artifacts
        ? deployment.executionArgs.artifacts.map(artifact => artifact.uuid)
        : []
      /* Send workflow variables only when it is available */
      if (deployment.executionArgs.workflowVariables) {
        modalData['workflowVariables'] = deployment.executionArgs.workflowVariables
      }
    }
    return modalData
  }

  onRerunClick = deployment => {
    this.isRerun = true
    const modalData = this.generateModalData(deployment)
    this.setState({
      showWorkflowExecModal: true,
      modalData
    })
  }

  showWorkflowExecModal = data => {
    const modalData = data || {}
    modalData.refreshWorkflowExecModal = true
    this.setState({ showWorkflowExecModal: true, modalData, pausePolling: true })
  }

  setMenuItem (index) {
    this.initialSortCategoryIdx = index
    this.setSortFunction(this.sortMenuData[index])
  }

  showWorkflowExecOldModal = data => {
    const modalData = data || {}
    modalData.refreshWorkflowExecOldModal = true
    this.setState({ showWorkflowExecOldModal: true, modalData, pausePolling: true })
  }

  hideExecModal = () => {
    this.isRerun = false
    this.setState({ showWorkflowExecModal: false, pausePolling: false })
  }

  onWorkflowExecSubmit = (formData, isEditing) => {
    const body = {
      workflowType: 'ORCHESTRATION',
      orchestrationId: formData.orchestrationWorkflow,
      artifacts: formData.artifacts,
      executionCredential: formData.executionCredential,
      workflowVariables: formData.workflowVariables
    }

    return apis.service
      .fetch(
        getEndpoint({
          envId: formData.environment,
          appId: formData.applicationId
        }),
        {
          method: 'POST',
          body
        }
      )
      .then(res => {
        this.hideExecModal()
        // Utils.redirect({
        //   appId: formData.applicationId,
        //   envId: res.resource.envId,
        //   executionId: res.resource.uuid,
        //   page: 'detail'
        // })
        const { accountId } = this.props.urlParams
        this.props.router.push(
          this.props.path.toExecutionDetails({
            accountId,
            appId: formData.applicationId,
            envId: res.resource.envId,
            execId: res.resource.uuid
          })
        )
      })
  }

  refetchData = ({ fetchKey, onFetchDone }) => {
    this.fetchData({ fetchKey, onFetchDone })
  }

  infiniteScrollHandler = async done => {
    // Only handle infinite scrolling after first fetch is done, and there's more data on server
    if (!this.isFirstFetchDone || this.limit >= this.totalDeployments) {
      return
    }

    this.setState({ showInfiniteScrollingSpinner: true })
    this.limit += LIMIT

    this.refetchData({
      fetchKey: +new Date(),
      onFetchDone: () => {
        this.setState({ showInfiniteScrollingSpinner: false })
        done()
      }
    })
  }

  onFirstFetchDone = executions => {
    this.isFirstFetchDone = true
    this.totalDeployments = executions.total
  }

  doPolling = () => {
    this.pollingTimeoutId = setTimeout(() => {
      if (!this.state.pausePolling) {
        this.fetchData({
          fetchKey: Utils.buildSelectedAppIdsQueryParams(),
          onFetchDone: this.doPolling
        })
      } else {
        this.doPolling()
      }
    }, POLL_INTERVAL_TIMEOUT * 10)
  }

  onPollInterval = Utils.debounce(() => {}, POLL_INTERVAL_TIMEOUT, true) // TODO Remove this

  DeploymentCardViewWithPolling = asyncPoll(5 * POLL_INTERVAL_TIMEOUT, this.onPollInterval)(DeploymentCardView)

  // onDeploymentActivitiesParamsNameClick = (uuid) => {
  //   Utils.redirect({ appId: uuid, page: 'overview' })
  // }

  setSortFunction = sortMenuDataItem => this.setState({ sortingFunction: sortMenuDataItem.sortingFunction })

  sortMenuData = [
    {
      title: 'Most Recent Deployments',
      sortingFunction: Utils.sortByMostRecent
    },
    { title: 'Application Name', sortingFunction: Utils.sortByAppName },
    { title: 'Workflow Name', sortingFunction: Utils.sortByObjectName }
  ]

  toggleNonProductionDeployments = e => {
    const includeNonProductionDeployments = !this.state.includeNonProductionDeployments

    // Set the filtering function according to the state of the checkbox
    const deploymentsFilteringFunction = includeNonProductionDeployments
      ? this.includeNonProductionDeploymentsInDeployments
      : this.excludeNonProductionDeploymentsInDeployments

    this.setState({
      includeNonProductionDeployments,
      deploymentsFilteringFunction
    })
  }

  excludeNonProductionDeploymentsInDeployments = deployments =>
    deployments.filter(deployment => deployment.envType !== 'NON_PROD')
  includeNonProductionDeploymentsInDeployments = deployments => deployments

  getWorkflowExec = workflowExecId => {
    const items = Object.keys(this.sortedDeployments)
    let showingExec = null
    for (const itemId of items) {
      if (this.sortedDeployments[itemId].uuid === workflowExecId) {
        showingExec = this.sortedDeployments[itemId]
      }
    }
    return showingExec
  }

  onPauseClick = workflowExecId => {
    const showingWorkflowExec = this.getWorkflowExec(workflowExecId)
    return apis
      .interruptWorkflow(showingWorkflowExec.appId, showingWorkflowExec.envId, showingWorkflowExec.uuid, 'PAUSE_ALL')
      .then(res => {})
  }

  onResumeClick = workflowExecId => {
    const showingWorkflowExec = this.getWorkflowExec(workflowExecId)
    return apis
      .interruptWorkflow(showingWorkflowExec.appId, showingWorkflowExec.envId, showingWorkflowExec.uuid, 'RESUME_ALL')
      .then(res => {})
  }

  onAbortClick = workflowUuid => this.setState({ showAbortConfirm: true, abortingUuid: workflowUuid })

  onAbortConfirm = workflowUuid => {
    const showingWorkflowExec = this.getWorkflowExec(this.state.abortingUuid)
    this.setState({ showAbortConfirm: false, abortingUuid: null })
    apis
      .interruptWorkflow(showingWorkflowExec.appId, showingWorkflowExec.envId, this.state.abortingUuid, 'ABORT_ALL')
      .then(() => {
        Utils.addNotification(this.refs.notif, 'success', 'Workflow aborted!')
        this.fetchData({})
      })
  }

  closeFilter = () => this.setState({ showFilters: false })
  toggleFilter = () => this.setState({ showFilters: !this.state.showFilters })

  renderMenuTitles = menuTitles =>
    <Dropdown.Menu style={{ width: '285px' }}>
      {menuTitles.map((title, idx) =>
        <MenuItem key={idx} onSelect={this.setMenuItem.bind(this, idx)}>
          {title}
        </MenuItem>
      )}
    </Dropdown.Menu>

  updateNumFiltersApplied = ({ numFiltersApplied }) => {
    this.setState({ numFiltersApplied })
  }

  render () {
    const filteredDeployments = this.state.deploymentsFilteringFunction(Utils.getJsonValue(this, 'state.deployments'))
    this.sortedDeployments = this.state.sortingFunction(filteredDeployments)
    const widgetViewParams = {
      jsplumbLoaded: this.state.jsplumbLoaded,
      enableInifiteScrolling: false,
      data: this.sortedDeployments,
      // custom no-data message.
      noDataMessage: (
        <main className="no-data-box">
          There are no Deployments.
          <span className="wings-text-link cta-button" onClick={this.showWorkflowExecModal}>
            Start New Deployment
          </span>
        </main>
      ),
      /* fetchData: () => {
        console.debug('Fetching data from widget with polling...')
        this.fetchData({})
      }, DISABLE FOR NOW */
      onPauseClick: this.onPauseClick,
      onResumeClick: this.onResumeClick,
      onAbortClick: this.onAbortClick,
      hasNewItems: this.state.hasNewItems,
      onNameClick: Utils.redirectToWorkflow,
      onRerunClick: this.onRerunClick,
      onRollbackClick: this.onRollbackClick
    }
    const widgetHeaderParams = {
      sortMenuFunction: this.setSortFunction,
      sortMenuData: this.sortMenuData,
      hideHeader: true,
      headerClass: css.headerClass,
      headerComponent: null,
      showSort: true,
      showSearch: false
    }

    const filterProps = {
      urlParams: this.props.urlParams,
      spinner: this.props.spinner,
      apps: this.props.dataStore.apps,
      onClose: this.closeFilter,
      onRefilter: this.fetchDataAfterFitler,
      updateParentState: this.updateNumFiltersApplied
    }

    const menuTitles = this.sortMenuData.map(item => item.title)
    let filterMessage = ''

    switch (this.state.numFiltersApplied) {
      case 0:
        filterMessage = 'No Filters applied'
        break
      case 1:
        filterMessage = '1 Filter applied'
        break
      default:
        if (this.state.numFiltersApplied > 1) {
          filterMessage = this.state.numFiltersApplied + ' Filters applied'
          break
        } else {
          filterMessage = 'No Filters applied'
          break
        }
    }

    return (
      <section className={css.main + ' ' + 'content'}>
        <widget-header>
          <header-tools>
            <sort-tool>
              <WingsButtons.Execute
                text="Start New Deployment"
                className=""
                disableButton={this.state.disableBtn}
                onClick={this.showWorkflowExecModal}
              />
            </sort-tool>
            <filter-items>
              <LabellingDropdown
                width="250px"
                title="Sort by" // title can be a component
                label={menuTitles[this.initialSortCategoryIdx]} // label can be a component, too
                items={this.renderMenuTitles(menuTitles)}
              />
              <filter-icon-group onClick={this.toggleFilter}>
                <filter-icon class="icons8-filter" />
                <filter-message>
                  {filterMessage}
                </filter-message>
              </filter-icon-group>
            </filter-items>
          </header-tools>
          {this.state.showFilters && <RecordsFilter {...filterProps} store={FiltersDataStore} />}
        </widget-header>

        <Widget
          {...this.props}
          title=""
          headerParams={widgetHeaderParams}
          view={{
            name: '',
            icon: '',
            component: this.DeploymentCardViewWithPolling,
            params: widgetViewParams
          }}
        />

        {this.state.showInfiniteScrollingSpinner && <InfiniteScrollingSpinner />}

        {this.state.showWorkflowExecModal &&
          <StartDeploymentModal
            {...this.props}
            onHide={this.hideExecModal.bind(this)}
            apps={this.props.dataStore.apps}
            onSubmit={this.onWorkflowExecSubmit}
            show={this.state.showWorkflowExecModal}
            data={this.state.modalData}
            isRerun={this.isRerun}
          />}
        <DeploymentsByDateModal
          {...this.props}
          dataStore={this.props.dataStore}
          appId={Utils.buildSelectedAppIdsQueryParams()}
          show={this.state.showModal}
          onHide={Utils.hideModal.bind(this)}
          startTime={this.state.modalStartTime}
          noDataCls={this.state.noDataCls}
        />
        <Confirm
          visible={this.state.showAbortConfirm}
          onConfirm={this.onAbortConfirm}
          onClose={Utils.hideModal.bind(this, 'showAbortConfirm')}
          body="Are you sure you want to abort this?"
          confirmText="Confirm Abort"
          title="Aborting"
        >
          <button style={{ display: 'none' }} />
        </Confirm>
        <NotificationSystem ref="notif" />
      </section>
    )
  }
}

const WrappedPage = createPageContainer()(DeploymentPage)
const PageWithScripts = scriptLoader(Utils.getRootUrl() + 'libs/jsplumb/jsplumb-all.min.js')(WrappedPage)
const Page = Utils.createTransmitContainer(PageWithScripts, fragmentArr)

export default Page



// WEBPACK FOOTER //
// ../src/containers/DeploymentPage/DeploymentPage.js