import React from 'react'
import { Link } from 'react-router'
import css from './ApplicationCardView.css'
import apis from 'apis/apis'
import { Utils } from 'components'

const fragmentArr = [
  // { hosts: [] },
  // { artifacts: [] },
  { pipelines: [] },
  { workflows: [] }
]

class AppCardFooter extends React.Component {
  state = { }
  app = null

  componentWillMount () {
    this.init(this.props)
  }

  init (props) {
    if (!this.app && props.app !== undefined) {
      this.app = props.app
      this.fetchData()
    }
  }

  fetchData = () => {
    // fragmentArr[0].hosts = [apis.fetchAllHosts, this.app.uuid]
    // fragmentArr[1].artifacts = [apis.fetchArtifacts, this.app.uuid]
    fragmentArr[0].pipelines = [apis.fetchPipelines, this.app.uuid]
    fragmentArr[1].workflows = [ apis.fetchWorkflows, this.app.uuid ]

    // after routing back to this component, manually fetch data:
    if (__CLIENT__ && !this.props.data) {
      Utils.fetchFragmentsToState(fragmentArr, this)
    } else {
      this.setState(this.props)
    }
  }

  displayListMore (arr, limit = 2) {
    if (arr.length <= limit) {
      return arr.join(', ')
    }
    let str = arr.slice(0, limit).join(', ')
    str = str.length > 43 ? str.substring(0, 40) + '...' : str
    return str + ` & ${arr.length - limit} more`
  }

  displayNameList (arr, emptyMessage = String.fromCharCode(65112), property = 'name', limit = 2) {
    if (!arr ) {
      return String.fromCharCode(65112)
    }

    if (arr.length <= 0) {
      return emptyMessage
    }

    const dispArr = []
    arr.map((item) => dispArr.push(item[property]))
    return this.displayListMore(dispArr, limit)
  }

  getHosts () {
    return this.app.hosts ? this.app.hosts : this.props.hosts ? this.props.hosts : null
  }

  renderHosts (hosts, emptyMessage = String.fromCharCode(65112)) {
    if (!hosts || hosts.length <= 0 ) {
      return this.displayNameList(hosts, emptyMessage)
    }

    const envHosts = {}
    const _arr = []
    hosts.map((host) => {
      if (!envHosts[host.envId]) {
        envHosts[host.envId] = 1
      } else {
        envHosts[host.envId] = envHosts[host.envId] + 1
      }
    })

    this.app.environments.map((env) => {
      _arr.push({ name: `${env.name} (${envHosts[env.uuid] ? envHosts[env.uuid] : 0})` })
    })

    return (
      <span>
        {this.displayNameList(_arr)}
      </span>
    )
  }

  renderListTitle (url, title, arrProperty) {
    return (
      <span>
        <Link to={url}>
          {title}
        </Link>
          &nbsp;({arrProperty ? arrProperty.length : 0})
      </span>
    )
  }

  renderTitleForNoData (title) {
    return (
      <span className={css.noData}>
        {title}(0)
      </span>
    )
  }

  renderLeftPanel () {
    // const hosts = Utils.getJsonValue(this, 'state.hosts.resource.response')
    return (
      <dl className="dl-horizontal wings-dl __rightBorder">
        <dt>{this.renderListTitle(`/app/${this.app.uuid}/services`, 'Services', this.app.services)}</dt>
        <dd>{this.displayNameList(this.app.services, 'There are no Services')}</dd>
        <dt>{this.renderListTitle(`/app/${this.app.uuid}/environments`, 'Environments', this.app.environments)}</dt>
        <dd>{this.displayNameList(this.app.environments, 'There are no Environments')}</dd>
        {/* <dt>{this.renderListTitle(`/app/${this.app.uuid}/environments`, 'Hosts', hosts)}</dt>
        <dd>{this.renderHosts(hosts, 'There are no Hosts')}</dd> */}
      </dl>
    )
  }

  renderRightPanel () {
    // const artifacts = Utils.getJsonValue(this, 'state.artifacts.resource.response')
    const pipelines = Utils.getJsonValue(this, 'state.pipelines.resource.response')
    const workflows = Utils.getJsonValue(this, 'state.workflows.resource.response')
    return (
      <dl className="dl-horizontal wings-dl">
        {/* <dt>{this.renderListTitle(`/app/${this.app.uuid}/artifacts`, 'Artifacts', artifacts)} </dt>
        <dd>{this.displayNameList(artifacts, 'There are no Artifacts', 'displayName', 1)}</dd> */}
        <dt>{this.renderListTitle(`/app/${this.app.uuid}/continuous-delivery`, 'Pipelines', pipelines)} </dt>
        <dd>{this.displayNameList(pipelines, 'There are no Pipelines')}</dd>
        <dt>{this.renderListTitle(`/app/${this.app.uuid}/workflows`, 'Workflows', workflows)} </dt>
        <dd>{this.displayNameList(workflows, 'There are no Workflows')}</dd>
      </dl>
    )
  }

  renderLeftPanelForNoData () {
    return (
      <dl className="dl-horizontal wings-dl ">
        <dt>{this.renderTitleForNoData('Services', 0)}</dt>
        <dt>{this.renderTitleForNoData( 'Environments', 0)}</dt>
        <dt>{this.renderTitleForNoData('Hosts', 0)}</dt>
      </dl>
    )
  }

  renderRightPanelForNoData () {
    return (
      <dl className="dl-horizontal wings-dl">
        <dt>{this.renderTitleForNoData( 'Artifacts', 0)} </dt>

        <dt>{this.renderTitleForNoData('Pipelines', 0)} </dt>

        <dt>{this.renderTitleForNoData('Workflows', 0)} </dt>

      </dl>
    )
  }

  renderFooter () {
    return (
      <div className={'row ' + css.cardFooter}>
        <div className="col-md-6 col-xs-6">
          {this.renderLeftPanel()}
        </div>
        <div className="col-md-6 col-xs-6">
          {this.renderRightPanel()}
        </div>
      </div>
    )
  }

  renderFooterForNoData () {
    return (
      <div className={'row ' + css.cardFooter}>
        <div className="col-md-6 col-xs-6 __rightBorder">
          {this.renderLeftPanelForNoData()}
        </div>
        <div className="col-md-6 col-xs-6">
          {this.renderRightPanelForNoData()}
        </div>
      </div>
    )
  }

  render () {
    if (this.props.app) {
      return (
        this.renderFooter()
      )
    } else {
      return (
        this.renderFooterForNoData()
      )
    }
  }
}

export default Utils.createTransmitContainer(AppCardFooter, fragmentArr)



// WEBPACK FOOTER //
// ../src/containers/ApplicationPage/views/AppCardFooter.js