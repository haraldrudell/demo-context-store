import React from 'react'
import {
  NoDataCard,
  UIButton,
  Confirm,
  Widget,
  CompUtils,
  Utils,
  PageBreadCrumbs,
  createPageContainer
} from 'components'
import { TourStage } from 'utils'
import EnvironmentCardView from './views/EnvironmentCardView'
import EnvironmentModal from './EnvironmentModal'
import CloneEnvironmentModal from './CloneEnvironmentModal'

import apis from 'apis/apis'
import css from './EnvironmentPage.css'

const getEndpoint = (appId, id) => {
  const endpoint = 'environments' + (id ? '/' + id : '')
  return appId ? `${endpoint}?appId=${appId}` : endpoint
}
const fetchInitialData = id => {
  return apis.service.list(getEndpoint(id)).catch(error => {
    throw error
  })
}
const fragmentArr = [
  { data: [] } // will be set later
]

// ---------------------------------------- //

class EnvironmentPage extends React.Component {
  // TODO: propTypes
  state = {
    data: {},
    showModal: false,
    cloneModalActive: false,
    cloneData: {},
    modalData: {},
    initialised: false,
    isTabInitialized: false
  }
  appIdFromUrl = Utils.appIdFromUrl()
  widgetViewParams = {}

  title = this.renderBreadCrumbs()
  pageName = 'Setup Environments'
  autoFetch = false

  componentWillMount () {
    //   this.props.onPageWillMount(<h3>Environments</h3>, 'Setup-Environments')
  }

  componentDidMount () {
    /* if (this.props.isTourOn && this.props.tourStage === TourStage.ENVIRONMENT) {
      setTimeout(() => {
        this.props.addSteps(TourSteps.ENVIRONMENT)
        this.props.onTourStart()
      }, 500)
    }*/
  }

  componentWillReceiveProps (newProps) {
    this.fetchData({ appId: newProps.appId })
    /* if (newProps.appId && newProps.activeKey === 2 &&
      !this.state.initialised) {
      this.fetchData({ appId: newProps.appId })
      this.setState({ initialised: false })
      }*/
  }

  componentWillUnmount () {
    this.setState({ initialised: false })
  }

  fetchData = ({ appId = this.props.appId }) => {
    CompUtils.fetchComputeProviders(this)
    fragmentArr[0].data = [fetchInitialData, appId]

    // after routing back to this component, manually fetch data:
    if (__CLIENT__ && !this.props.data) {
      Utils.fetchFragmentsToState(fragmentArr, this, () => {
        this.setState({ isTabInitialized: true })
      })
      this.state.data.resource = this.state.data.resource || { response: [] } // make sure we have 'response'
    } else {
      this.setState(this.props)
    }
  }

  onSubmit = (data, isEditing) => {
    const appId = this.props.appId
    if (isEditing) {
      apis.service
        .replace(getEndpoint(appId, data.uuid), {
          body: Utils.getJsonFieldsStr(data, 'name, description, environmentType')
        })
        .then(async () => {
          this.fetchData({ appId })
          await this.props.dataStore.fetchAllApps(this.props.urlParams.accountId) // refresh apps & their Envs.
        })
        .catch(error => {
          this.fetchData()
          throw error
        })
    } else {
      delete data['uuid']
      apis.service
        .create(getEndpoint(appId), {
          body: Utils.getJsonFieldsStr(data, 'name, description, environmentType')
        })
        .then(async res => {
          await this.props.dataStore.fetchAllApps(this.props.urlParams.accountId) // refresh apps & their Envs.
          this.onNameClick(res.resource)
        })
        .catch(error => {
          this.fetchData()
          throw error
        })
    }
  }

  onDelete = uuid => {
    this.setState({ showConfirm: true, deletingId: uuid })
  }

  onDeleteConfirmed = () => {
    const appId = this.props.appId
    apis.service
      .destroy(getEndpoint(appId, this.state.deletingId))
      .then(async () => {
        this.fetchData({ appId })
        await this.props.dataStore.fetchAllApps(this.props.urlParams.accountId) // refresh apps & their Envs.
      })
      .catch(error => {
        this.fetchData({ appId })
        throw error
      })
    this.setState({ showConfirm: false, deletingId: '' })
  }

  onNameClick = env => {
    if (env) {
      const path = this.props.path
      const { accountId, appId } = this.props.urlParams
      this.props.router.push(path.toEnvironmentsDetails({ accountId, appId, envId: env.uuid }))
    }
  }

  onAddClick = () => {
    Utils.showModal.call(this, null)
    if (this.props.isTourOn && this.props.tourStage === TourStage.ENVIRONMENT) {
      this.props.onTourPause()
    }
  }

  widgetHeaderButton = props => {
    return (
      <UIButton icon="Add" medium onClick={this.onAddClick.bind(this)}>
        Add Environment
      </UIButton>
    )
  }

  renderBreadCrumbs () {
    const path = this.props.path
    const urlParams = this.props.urlParams
    const appName = this.props.appName || ''
    const bData = [
      { label: 'Setup', link: path.toSetup(urlParams) },
      { label: appName, link: path.toAppDetails(urlParams), dropdown: 'applications' },
      { label: 'Environments', link: path.toSetupEnvironments(urlParams), dropdown: 'application-children' }
    ]
    return <PageBreadCrumbs {...this.props} data={bData} />
  }

  renderNoDataMessage = data => {
    if (this.state.isTabInitialized && data.length === 0) {
      return (
        <NoDataCard
          message="There are no Environments."
          buttonText="Add Environment"
          onClick={this.onAddClick.bind(this)}
        />
      )
    } else {
      return null
    }
  }

  render () {
    const computeProviders = Utils.getJsonValue(this, 'state.computeProviders.resource.response') || []
    const data = Utils.getJsonValue(this, 'state.data.resource.response') || []
    const objComputeProviders = {}
    computeProviders.map(computeProvider => {
      objComputeProviders[computeProvider.uuid] = computeProvider
    })
    const widgetViewParams = {
      data: data,
      objComputeProviders: objComputeProviders,
      onNameClick: this.onNameClick,
      onClone: data => {
        this.setState({ cloneModalActive: true, cloneData: data })
      },
      onEdit: Utils.showModal.bind(this),
      onDelete: this.onDelete,
      noDataMessage: this.renderNoDataMessage(data)
    }
    const headerParams = {
      leftItem: this.widgetHeaderButton(),
      showSearch: false
    }

    return (
      <section className={css.main}>
        <section className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <Widget
                {...this.props}
                title=""
                headerParams={headerParams}
                views={[
                  {
                    name: '',
                    component: EnvironmentCardView,
                    params: widgetViewParams
                  }
                ]}
              />
            </div>
          </div>
        </section>

        <EnvironmentModal
          data={this.state.modalData}
          show={this.state.showModal}
          onHide={Utils.hideModal.bind(this)}
          onSubmit={this.onSubmit}
        />

        {this.state.cloneModalActive && (
          <CloneEnvironmentModal
            onHide={_ => {
              this.fetchData({})
              this.setState({ cloneModalActive: false })
            }}
            cloneData={this.state.cloneData}
            dataStore={this.props.dataStore}
            type="Environment"
          />
        )}
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
const WrappedPage = createPageContainer()(EnvironmentPage)
export default Utils.createTransmitContainer(WrappedPage, fragmentArr)



// WEBPACK FOOTER //
// ../src/containers/EnvironmentPage/EnvironmentPage.js