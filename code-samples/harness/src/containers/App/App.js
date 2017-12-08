import React from 'react'
// import { addLocaleData, IntlProvider } from 'react-intl'g
import { addLocaleData } from 'react-intl'

import { AppHeader, AppContent, AppGlobalNotification, Utils, TourProgress, Confirm } from 'components'
import { Tracker, DataStore } from 'utils'
import { RouteTransition } from 'react-router-transition'
import { spring } from 'react-motion'
import pubsub from 'pubsub-js'
import reactUpdate from 'react-addons-update'
import Joyride from 'react-joyride'
import RoutePaths from '../../routes/RoutePaths'
import apis from 'apis/apis'
import queryString from 'query-string'
import 'styles.base.css'
import 'styles/jsPlumbToolkit-wings.base.css'
import 'styles/adminLTE/wings-skin-blue-light.base.css'
import 'styles/react-select-box/select-box.base.css'
import 'styles/react-tagsInput/react-tagsInput.base.css'
import 'react-select/dist/react-select.css'
import css from './App.css'

import enLocaleData from 'react-intl/locale-data/en'
import jaLocaleData from 'react-intl/locale-data/ja'
addLocaleData(enLocaleData)
addLocaleData(jaLocaleData)

const fragmentArr = [
  { userData: [] },
  { catalogsData: [] },
  { apps: [] } // will be set later
]

class App extends React.Component {
  static contextTypes = {
    data: React.PropTypes.object
  }
  static childContextTypes = {
    catalogs: React.PropTypes.object,
    pubsub: React.PropTypes.object,
    app: React.PropTypes.object,
    apps: React.PropTypes.array
  }
  getChildContext () {
    return {
      pubsub,
      catalogs: this.state.catalogsData.resource,
      app: this.state.appData.resource,
      apps: this.state.apps && this.state.apps.resource ? this.state.apps.resource.response : []
    }
  }
  state = {
    catalogsData: {},
    userData: {},
    appData: {},
    isTourOn: false, // whether app is in tour mode
    tourStage: 0, // 1- applications, 2- setup, 3 -environment
    steps: [],
    pageTitle: null, // object
    dataStore: null,
    showServiceDialog: false,
    serviceTourStage: 0,
    serviceTourStageNum: 0,
    showResume: false,
    showEndTour: false,
    currentStepStatus: 'not started',
    items: []
  }
  contextData = {}
  dataStore = null
  joyride = null

  componentWillReceiveProps (newProps) {
    if (this.props.location.pathname !== newProps.location.pathname) {
      this.setState({ pageTitle: null })
    }
  }

  componentWillMount () {
    this.fetchData()
    this.refreshCurrentApp()
    this.setState({ dataStore: DataStore })
  }

  fetchData = () => {
    const _this = this
    fragmentArr[0].userData = [apis.fetchUser]
    fragmentArr[1].catalogsData = [apis.fetchCatalogs]
    // fragmentArr[2].apps = [ apis.fetchAllApps, AppStorage.get('acctId') ]
    // TODO: Remove cached when all urls are fixed
    fragmentArr[2].apps = [apis.fetchAllApps, this.props.params.accountId || Utils.cachedAccountId()]

    if (__CLIENT__ && !this.props.data) {
      Utils.fetchFragmentsToState(fragmentArr, this, this.publishData, data => {
        if (data && data.userData && data.userData.resource) {
          const ds = _this.state.dataStore
          ds.setUserData(data.userData.resource)
          ds.setApps(data.apps.resource.response)
          ds.setCatalogs(data.catalogsData.resource)
          _this.setState({ dataStore: ds })
        }
      })
    } else {
      this.setState(this.props)
    }
  }

  refreshCurrentApp = () => {
    // const _appId = Utils.appIdFromUrl()
    const query = Utils.getQueryParametersFromUrl(this.props.location.search)
    let _appId = Utils.appIdFromUrl()
    if (!_appId) {
      _appId = query && query.hasOwnProperty('appId') ? query.appId[0] : ''
    }
    if (_appId && _appId.length > 0) {
      Utils.fetchFragmentsToState([{ appData: [apis.fetchOneApp, _appId] }], this, (key, data) => {
        return this.publishData(key, data)
      })
    }
  }

  // check if the current app (state.appData) existed in state.apps. If not, add it to state.apps & publish
  verifyAppinAllApps = () => {
    if (this.state.apps && this.state.apps.resource.response && this.state.appData.resource) {
      const currentApp = this.state.apps.resource.response.find(item => item.uuid === this.state.appData.resource.uuid)

      if (!currentApp) {
        const data = { resource: { response: [] } }
        data.resource.response[this.state.apps.resource.response.length] = { $set: this.state.appData.resource }
        this.setState({ apps: reactUpdate(this.state.apps, data) })
        this.contextData.apps = this.state.apps.resource.response
        pubsub.publish('appsEvent', this.contextData)
      }
    }
  }

  publishData = (key, data) => {
    if (key === 'apps') {
      if (data && data.resource) {
        this.contextData.apps = data.resource.response
      }
    }
    if (key === 'catalogsData') {
      if (data && data.resource) {
        this.contextData.catalogs = data.resource
      }
    }
    if (key === 'appData') {
      if (data && data.resource) {
        this.contextData.app = data.resource
        this.verifyAppinAllApps()
      }
    }
    pubsub.publish('appsEvent', this.contextData)
  }

  onPageWillMount = (PageTitleComponent, pageName, trackerObj) => {
    // page component can set titleComp & call this function
    // set titleComp to state
    if (pageName) {
      const obj = typeof trackerObj !== 'undefined' ? trackerObj : { appId: Utils.appIdFromUrl() }
      Tracker.log(pageName, obj)
    }
    this.updatePageTitle(PageTitleComponent)
  }

  updatePageTitle = PageTitleComponent => {
    this.setState({ pageTitle: PageTitleComponent })
  }

  // / --- Tour related

  onTourStart = (autoStart = false, callback) => {
    this.joyride.start(autoStart)

    this.setState({ isTourOn: true }, () => {
      if (callback) {
        callback()
      }
    })
  }

  onTourPause = () => {
    this.joyride.stop()
    this.setState({ steps: [] })
  }

  onTourStop = () => {
    this.joyride.stop()
    if (this.state.isTourOn) {
      /*  bugmuncher.set_options({ 'api_key': 'dfb2bd6fa8f0cd828be1',
    'style': 'tab' })*/
      this.setState({ isTourOn: false, tourStage: 0, steps: [] })
    }
  }

  addSteps = (steps, callback) => {
    if (!Array.isArray(steps)) {
      steps = [steps]
    }

    if (!steps.length) {
      return false
    }
    this.setState({ steps: this.joyride.parseSteps(steps) }, () => {
      if (callback) {
        callback()
      }
    })
  }

  tourCallback = tourProps => {
    if (tourProps.action === 'click') {
      const el = tourProps.step.selector
      const domEl = document.querySelector(el)
      this.onTourPause()
      domEl.click()

      if (this.state.serviceTourStageNum === 4) {
        this.setCurrentStepStatus('paused')
      }
    }
  }
  setTourStage = tourStage => {
    this.setState({ tourStage })
  }
  setServiceTourStage = (stage, stageNum) => {
    this.setState({ serviceTourStage: stage, serviceTourStageNum: stageNum })
  }
  resetServiceTourStage () {
    this.setState({ serviceTourStage: 0, serviceTourStageNum: 0 })
  }
  renderEndTour = () => {
    return (
      <a
        onClick={() => {
          this.endServiceTour()
          this.setState({ showEndTour: true })
          // this.onTourStop()
        }}
        className="endTour"
      >
        {' '}
        End Tour{' '}
      </a>
    )
  }
  endServiceTour = () => {
    this.onTourStop()
    this.setState({ showServiceDialog: false })
    this.removeTourGuideSessionVars()
    Utils.showBugMuncher()
  }
  removeTourGuideSessionVars = () => {
    sessionStorage.removeItem('tourServiceId')
    sessionStorage.removeItem('tourAppId')
    sessionStorage.removeItem('isDocker')
  }
  goToStep = (stepName, stage, stageNum, callback) => {
    if (this.state.isTourOn) {
      this.onTourPause()
      this.addSteps(stepName, callback)
      if (stage) {
        this.setServiceTourStage(stage, stageNum)
        this.onTourStart(true)
      }
    }
  }
  isTourStageOn = tourStage => {
    if (this.state.isTourOn && this.state.tourStage === tourStage) {
      return true
    }
    return false
  }
  setResume = resume => {
    this.setState({ showResume: resume })
  }
  setCurrentStepStatus = status => {
    if (this.state.isTourOn) {
      this.setState({ currentStepStatus: status })
    }
  }
  scrollElementIntoViewIfNeeded (domNode) {
    React.findDOMNode(domNode).scrollIntoView()
    // Determine if `domNode` fully fits inside `containerDomNode`.
    // If not, set the container's scrollTop appropriately.
  }

  // -- End Tour related

  // TODO: Fix this: Safari throws an error if we use IntlProvider.
  // <IntlProvider locale={currentLocale} defaultLocale="en-US" messages={messages}>
  setServiceDialog = value => {
    this.setState({ showServiceDialog: value })
  }

  render () {
    const tourProps = {
      isTourOn: this.state.isTourOn,
      tourStage: this.state.tourStage,
      serviceTourStage: this.state.serviceTourStage,
      serviceTourStageNum: this.state.serviceTourStageNum,
      showServiceDialog: this.state.showServiceDialog,
      showResume: this.state.showResume,
      currentStepStatus: this.state.currentStepStatus
    }
    const tourMethods = {
      goToStep: this.goToStep,
      isTourStageOn: this.isTourStageOn,
      addSteps: this.addSteps,
      onTourStart: this.onTourStart,
      onTourPause: this.onTourPause,
      onTourStop: this.onTourStop,
      setTourStage: this.setTourStage,
      renderEndTour: this.renderEndTour,
      setServiceTourStage: this.setServiceTourStage,
      resetServiceTourStage: this.resetServiceTourStage,
      setResume: this.setResume,
      setCurrentStepStatus: this.setCurrentStepStatus,
      endServiceTour: this.endServiceTour
    }

    const queryParams = queryString.parse((this.props.location && this.props.location.search) || '')
    const urlParams = {
      accountId: Utils.cachedAccountId() // TODO: Remove this after all the URLs are fixed with accountId
    }
    Object.assign(urlParams, queryParams, this.props.params)

    // const fullscreenNav = // When to show nav fullscreen
    //   typeof this.props.params.executionId !== 'undefined' || this.props.location.pathname.includes('/editor')

    return (
      <div>
        <div className="wrapper">
          {/* <AppNavBar
            dataStore={this.state.dataStore}
            routerProps={this.props}
            urlParams={urlParams}
            path={RoutePaths}
            pageTitle={this.state.pageTitle}
            refreshCurrentApp={this.refreshCurrentApp}
            userData={this.state.userData}
            {...tourProps}
            {...tourMethods}
            showServiceDialog={this.state.showServiceDialog}
            fullscreen={fullscreenNav}
            setServiceDialog={this.setServiceDialog}
          /> */}
          <AppHeader
            dataStore={this.state.dataStore}
            routerProps={this.props}
            urlParams={urlParams}
            path={RoutePaths}
            pageTitle={this.state.pageTitle}
          />

          <section className={css.wingsMainSection}>
            <AppContent routerProps={this.props} refreshCurrentApp={this.refreshCurrentApp}>
              <AppGlobalNotification routerProps={this.props} {...tourProps} {...tourMethods} />
              <Joyride
                ref={c => (this.joyride = c)}
                steps={this.state.steps}
                showOverlay={true}
                callback={this.tourCallback}
                scrollToSteps={true}
              />
              <RouteTransition
                pathname={this.props.location.pathname}
                atEnter={{ opacity: 0 }}
                atLeave={{ opacity: spring(1, { stiffness: 200, damping: 22 }) }}
                atActive={{ opacity: spring(1, { stiffness: 200, damping: 22 }) }}
              >
                {/* Component (which is mapped in "routes.js") will be loaded here  */}
                {React.cloneElement(this.props.children, {
                  dataStore: this.state.dataStore,
                  routerProps: this.props,
                  urlParams: urlParams,
                  path: RoutePaths,
                  onPageWillMount: this.onPageWillMount,
                  updatePageTitle: this.updatePageTitle,
                  ...tourProps,
                  ...tourMethods,
                  removeSessionVariables: this.removeTourGuideSessionVars
                })}
              </RouteTransition>
            </AppContent>
          </section>
        </div>

        <TourProgress
          show={this.state.isTourOn}
          {...tourProps}
          {...tourMethods}
          showServiceDialog={this.state.showServiceDialog}
          resumeClass={this.state.resumeClass}
        />

        <Confirm
          visible={this.state.showEndTour}
          onConfirm={() => {
            this.onTourStop()
            this.setState({ showEndTour: false })
          }}
          onClose={() => {
            this.setState({ showEndTour: false })
          }}
          body="Are you sure you want to end tour?"
          confirmText="Confirm tour end"
          title="Ending Tour"
        >
          <button style={{ display: 'none' }} />
        </Confirm>
      </div>
    )
  }
}

export default Utils.createTransmitContainer(App, fragmentArr)

App.contextTypes = {
  router: React.PropTypes.object.isRequired
}



// WEBPACK FOOTER //
// ../src/containers/App/App.js