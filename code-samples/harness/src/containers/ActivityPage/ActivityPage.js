import React from 'react'
import reactUpdate from 'react-addons-update'
import { Widget, Utils, StreamComponent, ChicletNotification, createPageContainer, PageBreadCrumbs } from 'components'
import streams from 'apis/streams'
import apis from 'apis/apis'
import ActivityListView from './views/ActivityListView'
import ActivityDetailModal from './ActivityDetailModal'
import css from './ActivityPage.css'
import { AppsDropdown } from 'components'
import { DataStore } from 'utils'

const fragmentArr = [{ data: [] }]

class ActivityPage extends React.Component {
  state = {
    data: {
      resource: {
        response: []
      }
    },
    showModal: false,
    showDetail: false,
    modalData: {},
    filteredData: []
  }
  accountId = Utils.accountIdFromUrl()

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  appIdFromUrl = Utils.appIdFromUrl()
  envIdFromUrl = Utils.envIdFromUrl()
  newActivities = 0

  title = this.renderTitleBreadCrumbs()
  pageName = 'History'

  fetchData = fetchTimestamp => {
    this.fetchTimestamp = fetchTimestamp || +new Date()
    const appIds = DataStore.getSelectedApps().map(app => app.appId)
    const accountId = Utils.accountIdFromUrl()
    this.newActivities = 0
    fragmentArr[0].data = [apis.fetchActivitiesData, appIds, accountId]

    this.props.spinner.show()

    Utils.fetchFragmentsToState(fragmentArr, this, (key, data) => this.handlePostData(key, data, fetchTimestamp))
  }

  handlePostData (k, d, fetchTimestamp) {
    // not handling data that coming back from an obsoleted request
    // TODO: Implement using async/await/abort later
    if (fetchTimestamp !== this.fetchTimestamp) {
      return
    }

    if (k === 'data' && d.resource.response) {
      if (this.props.location) {
        const queryParams = this.props.location.query
        if (queryParams.details) {
          const activity = d.resource.response.find(item => item.uuid === queryParams.details)

          if (activity) {
            setTimeout(() => {
              this.setState({ showModal: true, modalData: activity })
            }, 500)
          } else {
            apis.service
              .list(apis.getActivitiesEndpoint(this.appIdFromUrl, this.envIdFromUrl, null, queryParams.details))
              .then(resp => {
                this.setState({ showModal: true, modalData: resp.resource })
              })
              .catch(error => {
                throw error
              })
          }
        }
      }
    }

    this.props.spinner.hide()
  }

  handleStreamData = streamObj => {
    if (!streamObj || !streamObj.uuid) {
      return
    }

    if (streamObj.type === 'CREATE') {
      this.newActivities++
      this.setState({ __update: Date.now() })
    }

    if (streamObj.type === 'UPDATE') {
      // This looks like it will break if there are multiple appIds in the url
      apis.service
        .list(apis.getActivitiesEndpoint(this.appIdFromUrl, this.envIdFromUrl, null, streamObj.uuid))
        .then(resp => {
          if (resp.resource && Array.isArray(this.state.data.resource.response)) {
            let index = -1
            this.state.data.resource.response.map((item, i) => {
              if (item.uuid === resp.resource.uuid) {
                index = i
                return
              }
            })
            if (index >= 0) {
              const data = { resource: { response: [] } }
              data.resource.response[index] = { $set: resp.resource }
              this.setState({ data: reactUpdate(this.state.data, data) })
            }
          }
        })
        .catch(error => {
          throw error
        })
    }
  }

  hideDetails = () => {
    this.setState({ showDetail: false })
  }

  onSearchChanged = (ev, searchText) => {
    const _rData = Utils.getJsonValue(this, 'state.data.resource.response')
    const filteredData = _rData.filter(item => {
      return (
        (item.commandName && item.commandName.toLowerCase().indexOf(searchText) >= 0) ||
        (item.hostName && item.hostName.toLowerCase().indexOf(searchText) >= 0) ||
        (item.serviceTemplateName && item.serviceTemplateName.toLowerCase().indexOf(searchText) >= 0) ||
        (item.releaseName && item.releaseName.toLowerCase().indexOf(searchText) >= 0) ||
        (item.serviceName && item.serviceName.toLowerCase().indexOf(searchText) >= 0) ||
        (item.status && item.status.toLowerCase().indexOf(searchText) >= 0)
      )
    })
    this.setState({ filteredData })
  }

  onDetailsClick (activity) {
    Utils.showModal.bind(this, activity)
  }

  onChicletNotificationClick = () => {
    window.scrollTo(0, 0)
    this.fetchData()
  }

  // WidgetHeader = (props) => {
  //   const widgetData = Utils.getJsonValue(this, 'state.data.resource.response')
  //   return (
  //     <div className="wings-widget-header row">
  //       <SearchBox className="wings-card-search col-md-6 pull-right"
  //                  source={widgetData} onChange={this.onSearchChanged} />
  //     </div>
  //   )
  // }

  onAppsSelected = apps => {
    this.fetchData(+new Date())
  }
  renderTitleBreadCrumbs () {
    const bData = [{ label: 'History' }]
    return <PageBreadCrumbs data={bData} />
  }

  render () {
    const widgetViewParams = {
      data: this.state.data.resource.response,
      // data: this.state.filteredData,
      fetchData: this.fetchData,
      newActivities: this.newActivities,
      onDetailsClick: Utils.showModal.bind(this)
    }

    const widgetHeaderParams = {
      hideHeader: true,
      showSort: false,
      showSearch: false
    }

    return (
      <section className={css.main}>
        <section className="content">
          <AppsDropdown store={DataStore} onSelected={this.onAppsSelected} />
          <Widget
            {...this.props}
            title=""
            headerParams={widgetHeaderParams}
            views={[
              {
                name: '',
                icon: '',
                component: ActivityListView,
                params: widgetViewParams
              }
            ]}
          />
          <ChicletNotification
            count={this.newActivities}
            singleText="View 1 new Activity"
            pluralText={'View ' + this.newActivities + ' new Activities'}
            onClick={this.onChicletNotificationClick}
          />

          <ActivityDetailModal
            activity={this.state.modalData}
            show={this.state.showModal}
            onHide={Utils.hideModal.bind(this)}
          />
        </section>
        {/* This looks like it will break if there are multiple appIds in the url */}
        <StreamComponent
          url={streams.streamActivityEndPoint(this.appIdFromUrl, this.envIdFromUrl, this.accountId)}
          callback={this.handleStreamData}
        />
      </section>
    )
  }
}

export default createPageContainer()(ActivityPage)



// WEBPACK FOOTER //
// ../src/containers/ActivityPage/ActivityPage.js