import React from 'react'
import { Utils, CompUtils } from 'components'
import scriptLoader from 'react-async-script-loader'

import WorkflowEditor from '../WorkflowEditor/WorkflowEditor'
import apis from 'apis/apis'
import css from './PipelineEditorPage.css'

const getEndpoint = (appId, id) => {
  const endpoint = 'pipelines' + (id ? '/' + id : '')
  return appId ? `${endpoint}?appId=${appId}` : endpoint
}
const fetchInitialData = (appId, id) => {
  return apis.service.list(getEndpoint(appId, id)).catch(error => {
    throw error
  })
}
const fetchStencils = appId => {
  return apis.service.list(`pipelines/stencils?appId=${appId}`).catch(error => {
    throw error
  })
}
const fragmentArr = [
  { data: [] }, // will be set later
  { stencils: [] }
]

class PipelineEditorPage extends React.Component {
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

  componentWillMount () {
    this.fetchData()
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

  fetchData = () => {
    fragmentArr[0].data = [fetchInitialData, this.appIdFromUrl, this.idFromUrl]
    fragmentArr[1].stencils = [fetchStencils, this.appIdFromUrl]

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

  onSave = (data, callback) => {
    const body = this.state.data.resource
    body.graph = {
      nodes: data.nodes,
      links: data.links
    }
    apis.service
      .fetch(getEndpoint(this.appIdFromUrl, this.idFromUrl), {
        method: 'PUT',
        body
      })
      .then(() => {
        callback ? callback() : ''
      })
  }

  render () {
    const pipeline = Utils.getJsonValue(this, 'state.data.resource') || {}
    const stencils = Utils.getJsonValue(this, 'state.stencils.resource') || []
    return (
      <section className={css.main}>
        {this.state.scriptsLoaded ? (
          <WorkflowEditor
            route={this.props.route}
            data={pipeline}
            catalogs={this.state.catalogs}
            stencils={stencils}
            onSave={this.onSave}
          />
        ) : null}
      </section>
    )
  }
}

const PageWithScripts = scriptLoader(Utils.getRootUrl() + 'libs/jsplumb/jsplumb-all.min.js')(PipelineEditorPage)
export default Utils.createTransmitContainer(PageWithScripts, fragmentArr)



// WEBPACK FOOTER //
// ../src/containers/PipelineEditorPage/PipelineEditorPage.js