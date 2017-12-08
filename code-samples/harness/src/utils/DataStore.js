import { observable, action } from 'mobx'
import apis from 'apis/apis'
import Utils from '../components/Utils/Utils'
import { browserHistory } from 'react-router'
import { ApplicationService } from 'services'

const SELECTED_APPS_LOCAL_STORAGE_KEY = 'DataStore_selectedApps'
const APPS_LOCAL_STORAGE_KEY = 'DataStore_apps'

class DataStore {
  @observable userData = {}
  @observable notificationGroups = []
  @observable appContainers = []
  @observable orchestrationsStencils = []
  @observable apps = []
  @observable catalogs = []

  constructor () {
    this.setApps(JSON.parse(localStorage[APPS_LOCAL_STORAGE_KEY] || null) || [])
  }

  @action
  setUserData (data) {
    this.userData = data
  }

  @action
  setApps (apps) {
    this.apps.replace(apps)
    this.updateSelectedApps()
  }

  @action
  setCatalogs (catalogs) {
    this.catalogs = catalogs
  }

  // Deprecated! => use: await dataStore.fetchAllApps()
  @action
  fetchApps (acctId) {
    return apis.fetchAllApps(acctId).then(res => {
      this.apps.replace(res.resource.response)
      this.updateSelectedApps()
    })
  }

  @action
  async fetchAllApps (acctId) {
    const accountId = acctId || Utils.accountIdFromUrl() // Utils.accountIdFromUrl() is deprecated!
    const { response, error } = await ApplicationService.getApplications(accountId)
    if (response) {
      this.apps.replace(response)
      this.updateSelectedApps()
    } else {
      console.error(error)
    }
  }

  getSelectedApps () {
    return this.apps.filter(app => app.isSelected)
  }

  @action
  updateSelectedApps = () => {
    const localSelectedApps = localStorage[SELECTED_APPS_LOCAL_STORAGE_KEY] || ''
    const { apps } = this

    const params = Utils.getQueryParametersFromUrl(window.location.hash)
    const appIds = params.appId && params.appId.length && params.appId

    if (appIds) {
      localStorage[SELECTED_APPS_LOCAL_STORAGE_KEY] = appIds
      apps.forEach(app => (app.isSelected = appIds.indexOf(app.appId) !== -1))
    } else {
      apps.forEach(app => (app.isSelected = localSelectedApps.indexOf(app.appId) !== -1))
    }

    // save apps into localStorage
    localStorage[APPS_LOCAL_STORAGE_KEY] = JSON.stringify(apps)
  }

  @action
  clearSelectedApps = () => {
    this.apps.forEach(app => (app.isSelected = false))
    delete localStorage[SELECTED_APPS_LOCAL_STORAGE_KEY]
  }

  @action
  fetchNotificationGroups (appId) {
    return apis.fetchNotificationGroups(appId).then(data => {
      this.notificationGroups = data.resource.response
    })
  }

  @action
  fetchAppContainers (acctId) {
    return apis.fetchAppContainers(acctId).then(data => {
      this.appContainers = data.resource.response
    })
  }
}

const dataStore = new DataStore()

browserHistory.listen(() => {
  dataStore.updateSelectedApps()
})

export default dataStore



// WEBPACK FOOTER //
// ../src/utils/DataStore.js