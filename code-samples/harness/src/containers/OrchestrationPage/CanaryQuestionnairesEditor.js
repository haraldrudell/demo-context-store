import React from 'react'
import { Checkbox } from 'react-bootstrap'
import { Utils } from 'components'
import scriptLoader from 'react-async-script-loader'

import WorkflowEditor from '../WorkflowEditor/WorkflowEditor'
import apis from 'apis/apis'
import css from './CanaryQuestionnairesEditor.css'

const fragmentArr = [
  { data: [] }, // will be set later
  { stencils: [] }
]

class CanaryQuestionnairesEditor extends React.Component {
  // TODO: propTypes
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    pubsub: React.PropTypes.object, // isRequired
    catalogs: React.PropTypes.object, // isRequired
    showRollbackPhases: false
  }
  pubsubToken = null
  state = { workflowData: {}, scriptsLoaded: false, data: {}, catalogs: {} }

  idFromUrl = Utils.getIdFromUrl()
  appIdFromUrl = Utils.appIdFromUrl()
  envIdFromUrl = Utils.envIdFromUrl()
  isEdit = true

  componentWillMount () {
    this.fetchData()
    this.props.onPageWillMount(<h3>Workflow Details</h3>, 'Setup-Workflow-Editor', {
      appId: Utils.appIdFromUrl(),
      id: Utils.getIdFromUrl()
    })
  }

  componentDidMount () {
    setTimeout(() => {
      // CompUtils.toggleSidebar(false)
      document.body.className += ' fit-height full-width-header'
    }, 100)
    window.scrollTo(0, 0)
  }

  componentWillUnmount () {
    document.body.className = Utils.removeClassName(document.body.className, 'fit-height full-width-header')
    // CompUtils.toggleSidebar(true)
    Utils.unsubscribeAllPubSub(this)
  }

  componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) {
      // load finished
      if (isScriptLoadSucceed) {
        this.setState({ scriptsLoaded: true, workflowData: this.workflowData })
      } else {
        this.props.onError()
      }
    }
  }

  fetchData = () => {
    fragmentArr[0].data = [apis.fetchWorkflowById, this.appIdFromUrl, this.idFromUrl]
    fragmentArr[1].stencils = [apis.fetchStencils, this.appIdFromUrl]

    // after routing back to this component, manually fetch data:
    if (__CLIENT__ && !this.props.data) {
      Utils.fetchFragmentsToState(fragmentArr, this)
    } else {
      this.setState(this.props)
    }

    // get Context data (catalogs) & set to state
    if (this.context.catalogs) {
      this.setState({ catalogs: this.context.catalogs })
    } else {
      this.pubsubToken = this.context.pubsub.subscribe('appsEvent', (msg, appData) => {
        this.context.catalogs = appData.catalogs
        this.setState({ catalogs: this.context.catalogs })
      })
    }
  }

  onSave = (data, callback) => {
    const body = this.state.data.resource
    body.setAsDefault = body.defaultVersion <= 1 ? true : data.setAsDefault
    body.notes = data.notes
    body.graph = {
      nodes: data.nodes,
      links: data.links
    }

    if (this.isEdit) {
      apis.service
        .fetch(apis.getOrchestrationEndpoint(this.appIdFromUrl, this.idFromUrl), {
          method: 'PUT',
          body
        })
        .then(resp => {
          try {
            callback ? callback(resp.resource.name, resp.resource.graph.version) : ''
          } catch (e) {}

          this.setState({ data: resp })
        })
    } else {
      apis.service
        .create(apis.getOrchestrationEndpoint(this.appIdFromUrl), {
          body: JSON.stringify(body)
        })
        .then(resp => {
          callback ? callback(resp.resource.name, resp.resource.graph.version) : ''
          this.isEdit = true
          this.idFromUrl = resp.resource.uuid
          this.setState({ data: resp })
        })
        .catch(error => {
          throw error
        })
    }
  }

  getHeadingName (workflow) {
    if (!workflow) {
      return 'Workflow'
    }

    const version = workflow.graph ? workflow.graph.version : 1

    return `${workflow.name} (version : ${version})`
  }

  defaultLinkClick = () => {
    Utils.redirect({ appId: this.appIdFromUrl, workflowId: this.idFromUrl, page: 'canary-questions' })
  }

  onShowRollbackCkBoxChange = ev => {
    this.setState({ showRollbackPhases: ev.target.checked })
  }

  render () {
    const workflow = Utils.getJsonValue(this, 'state.data.resource') || {}
    const stencils = Utils.getJsonValue(this, 'state.stencils.resource') || []
    const headingName = this.getHeadingName(workflow)
    const showSaveOptions = workflow && workflow.defaultVersion >= 2
    return (
      <section className={css.main}>
        <div className="__viewsLink">
          <Checkbox onChange={ev => this.onShowRollbackCkBoxChange(ev)}>Show Rollback</Checkbox>
        </div>

        {this.state.scriptsLoaded ? (
          <WorkflowEditor
            route={this.props.route}
            readOnly={true}
            data={workflow.orchestrationWorkflow}
            catalogs={this.state.catalogs}
            stencils={stencils}
            onSave={this.onSave}
            headingName={headingName}
            showSaveOptions={showSaveOptions}
            showRollbackPhases={this.state.showRollbackPhases}
          />
        ) : null}
      </section>
    )
  }
}

const PageWithScripts = scriptLoader(Utils.getRootUrl() + 'libs/jsplumb/jsplumb-all.min.js')(CanaryQuestionnairesEditor)
export default Utils.createTransmitContainer(PageWithScripts, fragmentArr)



// WEBPACK FOOTER //
// ../src/containers/OrchestrationPage/CanaryQuestionnairesEditor.js