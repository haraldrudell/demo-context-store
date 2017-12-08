import React from 'react'
import { observer } from 'mobx-react'
import { Utils, CompUtils, AppStorage, PageBreadCrumbs } from 'components'
import scriptLoader from 'react-async-script-loader'
import NotificationSystem from 'react-notification-system'

import WorkflowEditor from '../WorkflowEditor/WorkflowEditor'
import apis from 'apis/apis'
import css from './CommandEditorPage.css'

const getEndpoint = (appId, id) => {
  const endpoint = 'services' + (id ? '/' + id : '')
  return appId ? `${endpoint}?appId=${appId}` : endpoint
}

const postEndpoint = (appId, id) => {
  return `services/${id}/commands?appId=${appId}`
}

const putEndpoint = (commandName, appId, id) => {
  return `services/${id}/commands/${commandName}?appId=${appId}`
}

const getCommandEndPoint = (appId, serviceId, commandName, version) => {
  let _url = `services/${serviceId}/commands/${commandName}?appId=${appId}`
  _url += version ? `&version=${version}` : ''
  return _url
}

const fragmentArr = [{ stencils: [] }, { service: [] }]

@observer
class CommandEditorPage extends React.Component {
  // TODO: propTypes
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    pubsub: React.PropTypes.object, // isRequired
    catalogs: React.PropTypes.object // isRequired
  }
  pubsubToken = null
  state = { scriptsLoaded: false, data: {}, catalogs: {}, service: {}, heading: 'Command' }
  appIdFromUrl = Utils.appIdFromUrl()
  isEdit = false

  fetchStencils = (appId, id) => {
    // const commandName = window.location.href.split('command/')[1].split('/')[0]
    const commandName = this.props.urlParams.commandId
    return apis.service
      .list(`services/${id}/commands/stencils?appId=${appId}&filterCommand=${commandName}`)
      .catch(error => {
        throw error
      })
  }

  fetchInitialData = (appId, serviceId) => {
    return apis.service.list(getEndpoint(appId, serviceId)).catch(error => {
      throw error
    })
  }

  componentWillMount () {
    this.fetchData()
    this.props.onPageWillMount(<h3>{this.renderTitleBreadCrumbs()}</h3>)
  }

  componentDidMount () {
    setTimeout(() => {
      CompUtils.toggleSidebar(false)
      document.body.className += ' fit-height'
    }, 100)
    window.scrollTo(0, 0)
  }

  renderTitleBreadCrumbs () {
    const path = this.props.path
    const urlParams = this.props.urlParams
    const app = Utils.findByUuid(this.props.dataStore.apps, urlParams.appId)
    const appName = app ? app.name : ''
    let serviceName = ''
    if (app && app.services) {
      const service = Utils.findByUuid(app.services, urlParams.serviceId)
      serviceName = service ? service.name : ''
    }
    const bData = [
      { label: 'Setup', link: path.toSetup(urlParams) },
      { label: appName, header: 'Application', link: path.toSetupServices(urlParams) },
      { label: serviceName, header: 'Service', link: path.toSetupServiceDetails(urlParams) },
      { label: urlParams.commandId, header: 'Command' }
    ]
    return <PageBreadCrumbs data={bData} />
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
        this.setState({ scriptsLoaded: true })
      } else {
        this.props.onError()
      }
    }
  }

  fetchData = () => {
    fragmentArr[0].stencils = [this.fetchStencils, this.appIdFromUrl, this.props.params.serviceId]
    fragmentArr[1].service = [this.fetchInitialData, this.appIdFromUrl, this.props.params.serviceId]

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

  onSave = (data, callback) => {
    const body = this.state.data
    body.setAsDefault = body.defaultVersion === 1 ? true : data.setAsDefault
    body.notes = data.notes
    delete body.command.uuid
    body.command.graph = { graphName: body.command.name, nodes: data.nodes, links: data.links }
    body.command.graph.nodes.map(node => {
      if (!node.properties) {
        node.properties = {}
      }
    })
    console.log(body)

    const findServiceCommand = (serviceCommand, service) =>
      service.serviceCommands.find(item => item.command.name === serviceCommand.command.name)

    const postSubmit = res => {
      const serviceCommand = findServiceCommand(body, res.resource)
      try {
        callback ? callback(serviceCommand, serviceCommand.name, serviceCommand.command.version) : ''
      } catch (e) {}
      this.setState({ data: serviceCommand })
    }

    if (this.isEdit) {
      apis.service
        .replace(putEndpoint(body.name, this.appIdFromUrl, this.props.params.serviceId), { body: JSON.stringify(body) })
        .then(res => postSubmit(res))
        .catch(error => {
          throw error
        })
    } else {
      apis.service
        .create(postEndpoint(this.appIdFromUrl, this.props.params.serviceId), { body: JSON.stringify(body) })
        .then(res => {
          this.isEdit = true
          postSubmit(res)
        })
        .catch(error => {
          throw error
        })
    }
  }

  postFetchData = (k, d) => {
    if (k === 'service') {
      const commands = this.state.service.resource.serviceCommands
      this.isEdit = false
      // const __resultCommand = commands.find(c => c.name === this.props.params.commandName)
      const __resultCommand = commands.find(c => c.name === this.props.urlParams.commandId)

      if (__resultCommand) {
        // EDIT mode
        this.isEdit = true
        const queryParams = this.props.location.query
        if (queryParams.version) {
          const { appId, serviceId, commandId } = this.props.urlParams
          apis.service
            .list(getCommandEndPoint(appId, serviceId, commandId, queryParams.version))
            .then(res => {
              this.setState({ data: res.resource })
            })
            .catch(error => {
              throw error
            })
        } else {
          this.setState({ data: __resultCommand })
        }
      } else {
        // CREATE mode - check if there is a New (creating) Command Name (key) from AppStorage:
        // const key = this.state.service.resource.uuid + '::' + this.props.params.commandName
        const key = this.props.urlParams.serviceId + '::' + this.props.urlParams.commandId

        if (AppStorage.has(key)) {
          const createData = JSON.parse(AppStorage.get(key))
          console.log('create Editor', createData)
          this.setState({ data: createData })
          AppStorage.remove(key)
        } else {
          this.setState({ data: { command: {} } })
          setTimeout(() => {
            // Utils.redirect({ appId: true, serviceId: this.props.params.serviceId, page: 'detail' })
            const { accountId, appId, serviceId } = this.props.urlParams
            const url = this.props.path.toSetupServiceDetails({
              accountId,
              appId,
              serviceId
            })
            this.context.router.push(url)
          }, 600)
        }
      }
    }
  }

  getHeadingName (command) {
    if (!command) {
      return 'Command'
    }
    const version = command.version || 1
    return `${command.name} (version : ${version})`
  }

  render () {
    const service = Utils.getJsonValue(this, 'state.service.resource') || {}
    const command = Utils.getJsonValue(this, 'state.data.command') || {}
    const stencils = Utils.getJsonValue(this, 'state.stencils.resource') || []
    const _heading = service ? service.name : 'Service'
    const showSaveOptions = this.state.data.defaultVersion && this.state.data.defaultVersion >= 1
    return (
      <section className={css.main}>
        {this.state.scriptsLoaded ? (
          <WorkflowEditor
            route={this.props.route}
            data={command}
            service={service}
            catalogs={this.state.catalogs}
            stencils={stencils}
            onSave={this.onSave}
            heading={_heading}
            headingName={this.getHeadingName(command)}
            showSaveOptions={showSaveOptions}
          />
        ) : null}
        <NotificationSystem ref="notif" />
      </section>
    )
  }
}

const PageWithScripts = scriptLoader(Utils.getRootUrl() + 'libs/jsplumb/jsplumb-all.min.js')(CommandEditorPage)
export default Utils.createTransmitContainer(PageWithScripts, fragmentArr)



// WEBPACK FOOTER //
// ../src/containers/CommandEditorPage/CommandEditorPage.js