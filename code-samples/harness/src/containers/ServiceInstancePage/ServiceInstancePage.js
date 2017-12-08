import React from 'react'
import { Widget, SearchBox, WingsButtons, Utils } from 'components'
import apis from 'apis/apis'

import ServiceInstanceCardView from './views/ServiceInstanceCardView'
import ServiceInstanceListView from './views/ServiceInstanceListView'
import SimpleExecModal from '../DeploymentPage/SimpleExecModal'
import NotificationSystem from 'react-notification-system'
import css from './ServiceInstancePage.css'

const getEndpoint = (appId, envId) => {
  return 'service-instances/' + '?appId=' + appId + '&envId=' + envId
}

const fetchInitialData = (appId, envId) => {
  return apis.service.list(getEndpoint(appId, envId)).catch(error => {
    throw error
  })
}

const fragmentArr = [{ data: [] }]

class ServiceInstancePage extends React.Component {
  static contextTypes = Utils.getDefaultContextTypes()

  state = { data: {}, showSimpleExecModal: false, showDetail: false, modalData: {}, filteredData: [] }
  selectedInstances = []
  appIdFromUrl = Utils.appIdFromUrl()
  envIdFromUrl = Utils.envIdFromUrl()

  componentWillMount () {
    this.fetchData()
    Utils.loadChildContextToState(this, 'app')
    this.props.onPageWillMount(<h3>Instances</h3>, 'Instances')
  }

  componentWillUnmount () {
    Utils.unsubscribeAllPubSub(this)
  }

  fetchData = () => {
    fragmentArr[0].data = [fetchInitialData, this.appIdFromUrl, this.envIdFromUrl]

    // after routing back to this component, manually fetch data:
    if (__CLIENT__ && !this.props.data) {
      Utils.fetchFragmentsToState(fragmentArr, this)
      this.state.data.resource = this.state.data.resource || { response: [] } // make sure we have 'response'
    } else {
      this.setState(this.props)
    }
    Utils.loadCatalogsToState(this)
  }

  onSubmit = formData => {
    const body = {
      workflowType: 'SIMPLE',
      serviceId: formData.service,
      serviceInstances: formData.serviceInstances,
      commandName: formData.commandName,
      executionStrategy: formData.executionStrategy,
      artifacts: formData.artifacts,
      executionCredential: formData.executionCredential
    }
    apis.service
      .fetch(`executions?appId=${this.appIdFromUrl}&envId=${this.envIdFromUrl}`, {
        method: 'POST',
        body
      })
      .then(() => {
        this.hideSimpleExecModal()
        Utils.redirect({ appId: true, envId: true, page: 'executions' })
      })
  }

  hideDetails = () => {
    this.setState({ showDetail: false })
  }

  onSearchChanged = (ev, searchText) => {
    const _rData = Utils.getJsonValue(this, 'state.data.resource.response')
    const filteredData = _rData.filter(item => {
      return (
        (item.artifact && item.artifact.displayName.toLowerCase().indexOf(searchText) >= 0) ||
        (item.hostName && item.hostName.toLowerCase().indexOf(searchText) >= 0) ||
        (item.release && item.release.releaseName.toLowerCase().indexOf(searchText) >= 0) ||
        (item.serviceName && item.serviceName.toLowerCase().indexOf(searchText) >= 1)
      )
    })
    this.setState({ filteredData })
  }

  showSimpleExecModal = data => {
    if (this.selectedInstances.length === 0) {
      Utils.addNotification(this.refs.notif, 'warning', 'Please select one more or Instances.')
      return
    }
    const sameServiceId = this.selectedInstances[0].serviceId
    for (const item of this.selectedInstances) {
      if (item.serviceId !== sameServiceId) {
        Utils.addNotification(this.refs.notif, 'warning', 'Selected Instances must belong to the same Service.')
        return
      }
    }
    const modalData = data || {}
    modalData.refreshSimpleExecModal = true
    modalData.service = sameServiceId
    modalData.serviceInstanceSelect = this.selectedInstances.map(item => item['uuid']).join(',')
    this.setState({ showSimpleExecModal: true, modalData })
  }

  hideSimpleExecModal = () => {
    this.setState({ showSimpleExecModal: false })
  }

  WidgetHeader = props => {
    const serviceInstances = Utils.getJsonValue(this, 'state.data.resource.response')
    return (
      <div className="wings-widget-header col-md-12">
        <WingsButtons.Execute text="Execute Command" className="" onClick={this.showSimpleExecModal.bind(this, null)} />
        <SearchBox
          className="wings-card-search col-md-6 pull-right"
          source={serviceInstances}
          onChange={this.onSearchChanged}
        />
      </div>
    )
  }

  onSelectionChanged = selectedInstances => {
    this.selectedInstances = selectedInstances
  }

  render () {
    const appServices = Utils.getJsonValue(this, 'state.app.services') || []
    const serviceInstances = Utils.getJsonValue(this, 'state.data.resource.response')

    const widgetViewParams = {
      data: this.state.filteredData,
      onNameClick: this.onNameClick,
      onDelete: this.onDelete,
      onSelectionChanged: this.onSelectionChanged
    }

    return (
      <section className={css.main}>
        <section className="content-header" />
        <section className="content">
          <Widget
            title=""
            headerComponent={this.WidgetHeader}
            views={[
              {
                name: '',
                icon: 'fa-th-list',
                component: ServiceInstanceListView,
                params: widgetViewParams
              },
              {
                name: '',
                icon: 'fa-th-large',
                component: ServiceInstanceCardView,
                params: widgetViewParams
              }
            ]}
          />
          <SimpleExecModal
            data={this.state.modalData}
            catalogs={this.state.catalogs}
            services={appServices}
            serviceInstances={serviceInstances}
            fetchService={apis.fetchService}
            fetchArtifacts={apis.fetchArtifacts}
            fetchInstances={apis.fetchInstances}
            show={this.state.showSimpleExecModal}
            onHide={this.hideSimpleExecModal.bind(this)}
            onSubmit={this.onSubmit}
          />
        </section>
        <NotificationSystem ref="notif" />
      </section>
    )
  }
}

export default Utils.createTransmitContainer(ServiceInstancePage, fragmentArr)



// WEBPACK FOOTER //
// ../src/containers/ServiceInstancePage/ServiceInstancePage.js