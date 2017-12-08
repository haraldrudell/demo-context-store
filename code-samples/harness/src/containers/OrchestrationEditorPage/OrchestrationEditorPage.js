import React from 'react'
import { Utils, CompUtils, AppStorage } from 'components'
import scriptLoader from 'react-async-script-loader'

import WorkflowEditor from '../WorkflowEditor/WorkflowEditor'
import apis from 'apis/apis'
import css from './OrchestrationEditorPage.css'

const fragmentArr = [
  { data: [] }, // will be set later
  { stencils: [] }
]

class OrchestrationEditorPage extends React.Component {
  // TODO: propTypes
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    pubsub: React.PropTypes.object, // isRequired
    catalogs: React.PropTypes.object // isRequired
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
      CompUtils.toggleSidebar(false)
      document.body.className += ' fit-height'
    }, 100)
    window.scrollTo(0, 0)
  }

  componentWillUnmount () {
    document.body.className = Utils.removeClassName(document.body.className, 'fit-height')
    CompUtils.toggleSidebar(true)
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
    const queryParams = this.props.location.query
    fragmentArr[0].data = [apis.fetchWorkflow, this.appIdFromUrl, this.idFromUrl, queryParams.version]
    fragmentArr[1].stencils = [apis.fetchStencils, this.appIdFromUrl]

    // after routing back to this component, manually fetch data:
    if (__CLIENT__ && !this.props.data) {
      Utils.fetchFragmentsToState(fragmentArr, this, this.postFetchData)
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

  postFetchData = (k, d) => {
    if (k === 'data') {
      if (!d.resource) {
        // CREATE mode
        const key = 'Workflow::' + this.idFromUrl

        if (AppStorage.has(key)) {
          const createData = JSON.parse(AppStorage.get(key))
          console.log('create Editor', createData)
          this.isEdit = false
          this.setState({ data: { resource: createData } })
          AppStorage.remove(key)
        } else {
          this.setState({ data: { resource: {} } })
          setTimeout(() => {
            Utils.redirect({ appId: true, page: 'workflows' })
          }, 600)
        }
      }
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

  render () {
    const workflow = Utils.getJsonValue(this, 'state.data.resource') || {}
    const stencils = Utils.getJsonValue(this, 'state.stencils.resource') || []
    const headingName = this.getHeadingName(workflow)
    const showSaveOptions = workflow && workflow.defaultVersion >= 2
    return (
      <section className={css.main}>
        {this.state.scriptsLoaded
          ? <WorkflowEditor
            route={this.props.route}
            data={workflow}
            catalogs={this.state.catalogs}
            stencils={stencils}
            onSave={this.onSave}
            headingName={headingName}
            showSaveOptions={showSaveOptions}
          />
          : null}
      </section>
    )
  }
}

const PageWithScripts = scriptLoader(Utils.getRootUrl() + 'libs/jsplumb/jsplumb-all.min.js')(OrchestrationEditorPage)
export default Utils.createTransmitContainer(PageWithScripts, fragmentArr)



// WEBPACK FOOTER //
// ../src/containers/OrchestrationEditorPage/OrchestrationEditorPage.js