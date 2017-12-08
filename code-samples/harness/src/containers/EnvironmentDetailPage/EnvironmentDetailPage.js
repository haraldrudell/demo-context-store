import React from 'react'
import { OverviewCard, Confirm, Utils, PageBreadCrumbs, createPageContainer } from 'components'
import { Dropdown } from 'react-bootstrap'
import { TourStage, TourSteps } from 'utils'
import apis from 'apis/apis'
import EnvironmentModal from '../EnvironmentPage/EnvironmentModal'
import css from './EnvironmentDetailPage.css'
import ServiceTemplatePage from '../ServiceTemplatePage/ServiceTemplatePage'

const fetchEnv = (envId, appId) => {
  return apis.service.list('environments/' + envId + '?appId=' + appId).catch(error => {
    throw error
  })
}

const getEndpoint = (appId, id) => {
  const endpoint = 'environments' + (id ? '/' + id : '')
  return appId ? `${endpoint}?appId=${appId}` : endpoint
}

const fragmentArr = [
  { data: [] } // will be set later
]

// ---------------------------------------- //

class EnvironmentDetailPage extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  // TODO: propTypes
  state = { data: {}, showModal: false, modalData: {} }
  // envIdFromUrl = Utils.envIdFromUrl()
  // appIdFromUrl = Utils.appIdFromUrl()
  title = this.renderBreadCrumbs()
  pageName = 'Setup Environments'

  componentWillMount () {
    this.getQueryParameters()
    this.fetchData()
    // this.props.onPageWillMount(<h3>{this.renderTitleBreadCrumbs()}</h3>, 'Setup Environment Details')
  }

  getQueryParameters = () => {
    if (this.props.urlParams) {
      const { accountId, appId, envId } = this.props.urlParams
      this.acctId = accountId
      this.appIdFromUrl = appId
      this.envIdFromUrl = envId
    }
  }

  componentDidMount () {
    if (this.props.isTourOn && this.props.tourStage === TourStage.ENVIRONMENT) {
      setTimeout(() => {
        this.props.addSteps(TourSteps.ENVIRONMENT_SELECT_HOST)
        this.props.onTourStart(true)
      }, 800)
    }
  }

  onSubmit = (data, isEditing) => {
    if (isEditing) {
      apis.service
        .replace(getEndpoint(this.appIdFromUrl, data.uuid), {
          body: Utils.getJsonFieldsStr(data, 'name, description')
        })
        .then(() => this.fetchData())
        .catch(error => {
          this.fetchData()
          throw error
        })
    } else {
      delete data['uuid']
      apis.service
        .create(getEndpoint(this.appIdFromUrl), {
          body: Utils.getJsonFieldsStr(data, 'name, description')
        })
        .then(() => this.fetchData())
        .catch(error => {
          this.fetchData()
          throw error
        })
    }
    Utils.hideModal.bind(this)()
  }

  onDelete = uuid => {
    this.setState({ showConfirm: true, deletingId: uuid })
  }

  onDeleteConfirmed = () => {
    apis.service
      .destroy(getEndpoint(this.appIdFromUrl, this.state.deletingId))
      .then(() => Utils.redirect({ appId: true, page: 'environments' }))
      .catch(error => {
        this.fetchData()
        throw error
      })
    this.setState({ showConfirm: false, deletingId: '' })
  }

  fetchData = () => {
    fragmentArr[0].data = [fetchEnv, this.envIdFromUrl, this.appIdFromUrl]

    // after routing back to this component, manually fetch data:
    if (__CLIENT__ && !this.props.data) {
      Utils.fetchFragmentsToState(fragmentArr, this)
    } else {
      this.setState(this.props)
    }
  }

  renderMenuDetails = env => {
    return (
      <div className="__dropDownMenu">
        <dl className="dl-horizontal wings-dl __dl">
          <dt>Type</dt>
          <dd>{Utils.expandEnvType({ envType: env.environmentType })}</dd>
          <dt>Description</dt>
          <dd>{env.description}</dd>
          <dt>Modified</dt>
          <dd>{Utils.formatDate(env.lastUpdatedAt) + ' by ' + (env.lastUpdatedBy && env.lastUpdatedBy.name)}</dd>
          <dt>Created</dt>
          <dd>{Utils.formatDate(env.createdAt) + ' by ' + (env.createdBy && env.createdBy.name)}</dd>
        </dl>
      </div>
    )
  }

  headerComponent = () => {
    const env = Utils.getJsonValue(this, 'state.data.resource') || {}

    if (!env || !env.createdAt) {
      return <span />
    }

    return (
      <span>
        {env.name}
        <Dropdown id="_deploymentCardOverviewMenu" className="wings-threedots" role="button">
          <span className="light __stepMenu" bsRole="toggle">
            &nbsp;<i className="icons8-info" />
          </span>
          <Dropdown.Menu bsRole="menu">{this.renderMenuDetails(env)}</Dropdown.Menu>
        </Dropdown>
      </span>
    )
  }

  renderBreadCrumbs () {
    const path = this.props.path
    const urlParams = this.props.urlParams
    const appName = this.props.appName
    const bData = [
      { label: 'Setup', link: path.toSetup(urlParams) },
      { label: appName, link: path.toAppDetails(urlParams), dropdown: 'applications' },
      { label: 'Environments', link: path.toSetupEnvironments(urlParams), dropdown: 'application-children' },
      { label: this.props.environmentName }
    ]
    return <PageBreadCrumbs {...this.props} data={bData} />
  }

  renderOverviewCard = ({ environment }) => {
    const getName = environment => {
      return {
        key: 'Name',
        value: environment.name
      }
    }

    const getDescription = environment => {
      if (environment.description) {
        return {
          key: 'Description',
          value: environment.description
        }
      }
    }

    const getEnvType = environment => {
      return {
        key: 'Environment Type',
        value: Utils.expandEnvType({ envType: environment.environmentType })
      }
    }

    const kvPairs = [getName(environment), getDescription(environment), getEnvType(environment)]

    const overviewCardProps = {
      header: {
        title: 'Environment Overview',
        actionIconFunctions: {
          edit: Utils.showModal.bind(this, environment),
          clone: data => {
            this.setState({ cloneModalActive: true, cloneData: environment })
          }
        }
      },
      kvPairs
    }
    return <OverviewCard {...overviewCardProps} />
  }

  render () {
    const environment = Utils.getJsonValue(this.state, 'data.resource')

    return (
      <section className={css.main}>
        <section className="content">
          {environment && this.renderOverviewCard({ environment })}
          <ServiceTemplatePage {...this.props} headerComponent={this.headerComponent} />
        </section>

        <EnvironmentModal
          data={this.state.modalData}
          show={this.state.showModal}
          onHide={Utils.hideModal.bind(this)}
          onSubmit={this.onSubmit}
        />
        <Confirm
          visible={this.state.showConfirm}
          onConfirm={this.onDeleteConfirmed}
          onClose={Utils.hideModal.bind(this, 'showConfirm')}
          body="Are you sure you want to delete this?"
          confirmText="Confirm Delete"
          title="Deleting"
        >
          <button style={{ display: 'none' }} />
        </Confirm>
      </section>
    )
  }
}

export default createPageContainer()(EnvironmentDetailPage)



// WEBPACK FOOTER //
// ../src/containers/EnvironmentDetailPage/EnvironmentDetailPage.js