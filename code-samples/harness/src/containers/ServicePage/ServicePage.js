import React from 'react'
import { observer } from 'mobx-react'
import { UIButton, NoDataCard, Widget, Utils, PageBreadCrumbs, createPageContainer } from 'components'
import { TourStage } from 'utils'
import ServiceCardView from './views/ServiceCardView'
import ServiceModal from './ServiceModal'
import CloneServiceModal from './CloneServiceModal'

import apis from 'apis/apis'
import css from './ServicePage.css'

// const SERVICE_NOT_CONFIGURED = 'SERVICE_NOT_CONFIGURED'

const fragmentArr = [{ data: [] }]

// ---------------------------------------- //

@observer
class ServicePage extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    ...Utils.getDefaultContextTypes()
  }
  state = {
    data: {},
    showModal: false,
    modalData: {},
    isTabInitialized: false,
    cloneModalActive: false,
    cloneData: {}
  }
  idFromUrl = Utils.appIdFromUrl()
  appIdFromUrl = Utils.appIdFromUrl()

  title = this.renderBreadCrumbs()
  pageName = 'Setup Services'
  autoFetch = false

  componentWillMount () {
    Utils.loadCatalogsToState(this)
  }

  componentDidMount () {
    /* console.log(this.props.renderEndTour)
    if (this.props.isTourOn && this.props.tourStage === TourStage.SERVICE) {
      const step2 = ServiceTourSteps.step2('.__addService', 'right', this.props.renderEndTour)
      setTimeout(() => {
        if ( this.props.showServiceDialog) {
          this.props.setCurrentStepStatus('inprogress')
          // this.props.setResume(false)
          this.props.goToStep(step2, 'step2', 2)
        } else {
          // this.props.setCurrentStepStatus('inprogress')
          this.props.addSteps(step2)
          this.props.onTourStart(true)
        }
      }, 1000)
    }

    if (SetupUtils.hasCode(SERVICE_NOT_CONFIGURED)) {
      setTimeout(() => {
        if (SetupUtils.verify(SERVICE_NOT_CONFIGURED)) {
          this.setState({ showModal: true, modalData: null })
        }
      }, 1000)
    }*/
  }

  componentWillReceiveProps (newProps) {
    // console.log('on props')
    this.fetchData({ appId: newProps.appId })
  }

  fetchData = ({ appId = this.props.appId }) => {
    if (appId) {
      fragmentArr[0].data = [apis.fetchServices, appId]

      // after routing back to this component, manually fetch data:
      if (!this.props.data) {
        Utils.fetchFragmentsToState(fragmentArr, this, null, () => {
          this.setState({ isTabInitialized: true })
        })
        this.state.data.resource = this.state.data.resource || { response: [] } // make sure we have 'response'
      }
    }
  }

  onSubmit = async (data, isEditing) => {
    await this.props.dataStore.fetchAllApps()
    if (!isEditing) {
      this.onNameClick(data)
    } else {
      this.fetchData({ appId: this.props.appId })
    }
    Utils.hideModal.bind(this)()
    /* if (isEditing) {
      apis.service
        .replace(apis.getServiceEndpoint(this.props.appId, data.uuid), {
          body: {
            appContainer: {
              uuid: data.appContainerUuid
            },
            ...Utils.getJsonFields(data, 'name, description, artifactType')
          }
        })
        .then(async () => {
          await this.props.dataStore.fetchAllApps() // refresh dataStore.apps (& their services)
          this.fetchData({ appId: this.props.appId })
        })
        .catch(error => {
          this.props.setCurrentStepStatus('paused')
        })
    } else {
      delete data['uuid']
      const body = Utils.getJsonFields(data, 'name, description, artifactType')
      if (data.appContainerUuid) {
        body.appContainer = {
          uuid: data.appContainerUuid
        }
      }
      apis.service
        .create(apis.getServiceEndpoint(this.props.appId), { body })
        .then(async res => {
          await this.props.dataStore.fetchAllApps() // refresh dataStore.apps (& their services)
          this.onNameClick(res.resource)
        })
        .catch(error => {
          this.props.setCurrentStepStatus('paused')
        })
    }
    Utils.hideModal.bind(this)()*/
  }

  onNameClick = service => {
    if (this.props.isTourOn) {
      // const isDocker = service.artifactType ? service.artifactType === 'DOCKER' : false
      const isDocker = service.hasOwnProperty('artifactType') && service.artifactType === 'DOCKER' ? true : false
      sessionStorage.setItem('isDocker', isDocker)
    }

    const path = this.props.path
    const { accountId, appId } = this.props.urlParams
    this.props.router.push(path.toSetupServiceDetails({ accountId, appId, serviceId: service.uuid }))
  }

  onCommandClick = (service, command) => {
    const { accountId, appId } = this.props.urlParams
    const url = this.props.path.toSetupServiceCommand({
      accountId,
      appId,
      serviceId: service.uuid,
      commandId: command
    })
    this.props.router.push(url)
  }

  onAddClick = () => {
    Utils.showModal.bind(this, null)()
    if (this.props.isTourOn && this.props.tourStage === TourStage.SERVICE) {
      this.props.onTourPause()
      this.props.setCurrentStepStatus('inprogress')
    }
  }

  onHideModal = () => {
    // if (!(this.props.isTourOn && this.props.tourStage === TourStage.SERVICE)) {
    Utils.hideModal.call(this)
    //  this.props.setCurrentStepStatus('paused')
    // }
  }

  widgetHeaderButton = props => {
    return (
      <UIButton icon="Add" medium onClick={this.onAddClick.bind(this)}>
        Add Service
      </UIButton>
    )
  }

  renderBreadCrumbs () {
    // const accountId = Utils.accountIdFromUrl()
    const path = this.props.path
    const urlParams = this.props.urlParams
    const appName = this.props.hasOwnProperty('appName') && this.props.appName ? this.props.appName : ''
    const bData = [
      { label: 'Setup', link: path.toSetup(urlParams) },
      { label: appName, link: path.toAppDetails(urlParams), dropdown: 'applications' },
      { label: 'Services', link: path.toSetupServices(urlParams), dropdown: 'application-children' }
    ]
    return <PageBreadCrumbs {...this.props} data={bData} />
  }

  // onCloneService = data => {
  //   const serviceId = data.uuid
  //   const obj = {}
  //   obj.name = data.name
  //   obj.description = data.description
  //   apis.service
  //     .create(apis.getCloneServiceUrl(serviceId, this.props.appId), { body: obj })
  //     .then(async () => {
  //       await this.props.dataStore.fetchAllApps()
  //       Utils.hideCloneModal.call(this)
  //       this.fetchData({})
  //     })
  //     .catch(error => {
  //       throw error
  //     })
  // }

  redirectToServiceDetail = data => {
    const path = this.props.path
    const { accountId, appId } = this.props.urlParams
    this.props.router.push(path.toSetupServiceDetails({ accountId, appId, serviceId: data.serviceId }))
    sessionStorage.setItem('artifactId', data.uuid)
  }

  render () {
    const data = Utils.getJsonValue(this, 'state.data.resource.response') || []
    const widgetComponentParams = {
      catalogs: this.state.catalogs,
      data: data,
      onNameClick: this.onNameClick,
      onCommandClick: this.onCommandClick,
      onClone: data => {
        this.setState({ cloneModalActive: true, cloneData: data })
      },
      onEdit: Utils.showModal.bind(this),
      onDelete: serviceId => {
        const appId = this.props.appId
        this.props.confirm.showConfirmDelete(async () => {
          console.log('--- Deleting: ', serviceId)
          apis.service
            .destroy(apis.getServiceEndpoint(appId, serviceId))
            .then(async () => {
              await this.props.dataStore.fetchAllApps() // refresh dataStore.apps (& their services)
              this.fetchData({ appId })
              this.props.toaster.show({ message: 'Service deleted successfully.' })
            })
            .catch(error => {
              throw error
            })
        })
      },
      accountId: this.props.accountId,
      appId: this.props.appId,
      noDataMessage:
        this.state.isTabInitialized && data.length === 0 ? ( // custom no-data message. (optional)
          <NoDataCard
            message="There are no Services."
            buttonText="Add Service"
            onClick={() => this.onAddClick.call(this)}
          />
        ) : null,
      redirectToServiceDetail: this.redirectToServiceDetail
    }

    const widgetHeaderParams = {
      leftItem: this.widgetHeaderButton(),
      showSearch: false
    }

    if (this.state.data) {
      return (
        <section className={css.main}>
          <section className="content">
            <div className="row">
              <div className="col-md-12">
                <Widget
                  {...this.props}
                  headerParams={widgetHeaderParams}
                  component={ServiceCardView}
                  params={widgetComponentParams}
                />
              </div>
            </div>
          </section>

          <ServiceModal
            data={this.state.modalData}
            dataStore={this.props.dataStore}
            appContainers={this.props.dataStore.appContainers.toJS()}
            show={this.state.showModal}
            onHide={this.onHideModal}
            onSubmit={this.onSubmit}
            appId={this.appIdFromUrl}
          />
          {this.state.cloneModalActive && (
            <CloneServiceModal
              {...this.props}
              onHide={_ => {
                this.fetchData({})
                this.setState({ cloneModalActive: false })
              }}
              cloneData={this.state.cloneData}
              dataStore={this.props.dataStore}
              type="Service"
            />
          )}
        </section>
      )
    }
  }
}

export default createPageContainer()(ServicePage)



// WEBPACK FOOTER //
// ../src/containers/ServicePage/ServicePage.js