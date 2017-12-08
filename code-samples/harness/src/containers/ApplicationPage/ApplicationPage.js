import React from 'react'
import reactUpdate from 'react-addons-update'
import { Confirm, Utils, SetupUtils, AppStorage, WingsTour } from 'components'
import { TourStage, TourSteps } from 'utils'
import ApplicationCardView from './views/ApplicationCardView'
import ApplicationModal from './ApplicationModal'
import ApplicationPageHeader from './ApplicationPageHeader'

import apis from 'apis/apis'
import css from './ApplicationPage.css'

const SERVICE_NOT_CONFIGURED = 'SERVICE_NOT_CONFIGURED'

const fragmentArr = [
  { data: [] } // will be set later
]

class ApplicationPage extends React.Component {
  static contextTypes = Utils.getDefaultContextTypes()
  // TODO: propTypes
  state = {
    data: {},
    showModal: false,
    modalData: {},
    searchText: '',
    appBarCls: '__hide',
    userName: '',
    tourType: '',
    showTourModal: false
  }
  pubsubToken = []
  dataLoaded = []
  acctId = AppStorage.get('acctId')

  componentWillMount () {
    this.fetchData()
    this.props.onPageWillMount(<h3 className="wings-page-header">All Applications</h3>, 'All-Applications')
  }

  componentDidMount () {
    if (this.props.isTourOn && this.props.tourStage === TourStage.APPLICATION) {
      this.props.addSteps(TourSteps.APPLICATION)
      this.props.onTourStart(true)
    }
  }

  componentWillReceiveProps (newProps) {
    const name = Utils.getJsonValue(newProps, 'dataStore.userData.name') || ''
    if (name) {
      this.setState({ userName: name })
    }
  }

  startTour = (e, tourType) => {
    e.preventDefault()
    this.props.onTourStart(true)
    this.props.addSteps(TourSteps.APPLICATION)
  }

  fetchApplications (filter) {
    return apis.fetchAllApps(this.acctId, filter).then(result => {
      if (result.resource.response.length === 0) {
        this.setState({ appBarCls: '' })
      } else {
        this.setState({ appBarCls: '__hide' })
        return [result.resource]
      }
    })
  }

  fetchData = (filter = '&overview=true&sort[0][field]=name&sort[0][direction]=ASC', filterType = 'Name A-Z') => {
    this.setState({ filterType })
    const sortOrder = filterType === 'Name A-Z' ? 'ASC' : filterType === 'Name Z-A' ? 'DESC' : 'ASC'
    fragmentArr[0].data = [apis.fetchAllApps, this.acctId, filter]
    if (__CLIENT__ && !this.props.apps) {
      Utils.fetchFragmentsToState(fragmentArr, this, (k, d) => {
        if (d.resource.response.length === 0) {
          this.setState({ appBarCls: '' })
        } else {
          this.setState({ appBarCls: '__hide' })

          this.sortData(d.resource.response, sortOrder)
        }
        this.fetchMoreData(k, d)
      })
      this.state.data.resource = this.state.data.resource || { response: [] } // make sure we have 'response'
      this.sortData(this.state.data.resource.response, sortOrder)
    } else {
      this.setState(this.props)
    }
  }

  sortData = (data, order) => {
    if (data.length > 1) {
      return Utils.sortDataByKey(data, 'name', order)
    }
  }

  fetchMoreData = (key, data) => {
    this.dataLoaded[key] = true
    if (data && data.resource && data.resource.response && data.resource.response.length > 0) {
      data.resource.response.map((orig, index) => {
        if (Array.isArray(orig.recentExecutions)) {
          orig.recentExecutions.reverse()
          orig.currentShowing = orig.recentExecutions.length
          orig.hasRight = false
          orig.hasLeft = false

          if (orig.recentExecutions.length > 3) {
            orig.hasLeft = true
          }

          if (orig.recentExecutions.length >= 5) {
            const app = Utils.clone(orig)
            this.fetchExecutions(app, index)
          }
        }
      })
    }
  }

  fetchExecutions = (app, index) => {
    const updateApp = (app, index) => {
      const data = { resource: { response: [] } }
      data.resource.response[index] = { $set: app }
      this.setState({ data: reactUpdate(this.state.data, data) })
    }

    apis.service
      .list(apis.getExecutionsEndPoint(app.uuid))
      .then(resp => {
        app.recentExecutions = resp.resource.response.reverse()
        app.currentShowing = resp.resource.response.length
        updateApp(app, index)
      })
      .catch(error => {
        throw error
      })
  }

  componentWillUnmount () {
    Utils.unsubscribeAllPubSub(this)
  }

  onSubmit = (data, isEditing) => {
    if (isEditing) {
      const copydata = {
        name: data.name,
        description: data.description,
        uuid: data.uuid,
        accountId: data.accountId
      }
      apis.service
        .replace(['apps', data.uuid], {
          body: JSON.stringify(copydata)
        })
        .then(resp => {
          this.fetchData()
          this.props.dataStore.fetchApps(this.acctId)
        })
        .catch('error => { throw error }')
    } else {
      delete data['uuid']
      apis.service
        .create(['apps' + '?accountId=' + this.acctId], {
          body: JSON.stringify(data)
        })
        .then(resp => {
          if (this.props.isTourOn) {
            this.props.setTourStage(TourStage.SERVICE)
            Utils.redirect({ appId: resp.resource.uuid, page: 'setup' })
          } else {
            SetupUtils.setCode(SERVICE_NOT_CONFIGURED)
            Utils.redirect({ appId: resp.resource.uuid, page: 'services' })
          }
          this.props.dataStore.fetchApps(this.acctId)
        })
        .catch(error => {
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
      .destroy(['apps', this.state.deletingId])
      .then(() => {
        this.props.dataStore.fetchApps(this.acctId)
        this.fetchData()
      })
      .catch(error => {
        throw error
      })
    this.setState({ showConfirm: false, deletingId: '' })
  }

  onNameClick = uuid => {
    Utils.redirect({ appId: uuid, page: 'overview' })
  }

  onSetupClick = app => {
    Utils.redirect({ appId: app.uuid, page: 'setup' })
  }

  onEditClick = app => {
    Utils.showModal.call(this, app)
  }

  onAddClick = () => {
    Utils.showModal.call(this, null)
    if (this.props.isTourOn && this.props.tourStage === TourStage.APPLICATION) {
      this.props.onTourPause()
    }
  }

  onSearchChanged = (ev, searchText) => {
    this.setState({ searchText: searchText })
  }

  onHideModal = () => {
    /* if (!(this.props.isTourOn && this.props.tourStage === TourStage.APPLICATION)) {*/
    Utils.hideModal.call(this)
    // }
  }

  onFilterMenuChanged = objFilter => {
    this.dataLoaded['data'] = false
    this.setState({ data: {} })
    if (objFilter.item === 'Name Z-A') {
      this.fetchData('&overview=true&sort[0][field]=name&sort[0][direction]=DESC', 'Name Z-A')
    } else if (objFilter.item === 'Name A-Z' || objFilter.item === '') {
      this.fetchData('&overview=true&sort[0][field]=name&sort[0][direction]=ASC', 'Name A-Z')
    }
  }

  renderAppInfo = () => {
    if (this.state.userName !== '') {
      return (
        <div className={`userActionMessage ${this.state.appBarCls}`}>
          Hi {this.state.userName}. To get started,&nbsp;&nbsp; <a onClick={this.onAddClick}>Add an Application</a>
          &nbsp; or open the &nbsp;
          <a onClick={e => this.startTour(e, 'product')}>Setup Guide.</a>
        </div>
      )
    }
  }

  render () {
    const params = {
      data: Utils.getJsonValue(this, 'state.data.resource.response') || [],
      onNameClick: this.onNameClick,
      onEdit: this.onEditClick,
      onSetup: this.onSetupClick,
      onDelete: this.onDelete,
      fetchData: this.fetchData,
      searchText: this.state.searchText
    }
    return (
      <section className={css.home}>
        <section className="content">
          <ApplicationPageHeader
            routerProps={this.props.routerProps}
            onAddClick={this.onAddClick}
            onSearchChanged={this.onSearchChanged}
            onFilterMenuChanged={this.onFilterMenuChanged}
            filterType={this.state.filterType}
          />
          {this.renderAppInfo()}
          {!this.dataLoaded['data'] && <span className="wings-spinner" />}
          {this.state.appBarCls === '__hide' &&
            <ApplicationCardView params={params} noDataCls={this.state.appBarCls} />}
        </section>

        <ApplicationModal
          isTourOn={this.props.isTourOn}
          data={this.state.modalData}
          show={this.state.showModal}
          onHide={this.onHideModal}
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
        <WingsTour
          show={this.state.showTourModal}
          onHide={Utils.hideModal.bind(this, 'showTourModal')}
          tourType={this.state.tourType}
          {...this.props}
        />
      </section>
    )
  }
}

export default Utils.createTransmitContainer(ApplicationPage, [])



// WEBPACK FOOTER //
// ../src/containers/ApplicationPage/ApplicationPage.js