import { observable, action } from 'mobx'
// import apis from 'apis/apis'
import Utils from '../components/Utils/Utils'
import { browserHistory } from 'react-router'
import { ApplicationService } from 'services'

const SELECTED_APPS_LOCAL_STORAGE_KEY = 'FiltersDataStore_selectedApps'
const APPS_LOCAL_STORAGE_KEY = 'FiltersDataStore_apps'

class FiltersDataStore {
  @observable apps = []

  constructor () {
    this.setApps(JSON.parse(localStorage[APPS_LOCAL_STORAGE_KEY] || null) || [])
  }

  @action
  setApps (apps) {
    this.apps.replace(apps)
    this.updateSelectedItems()
  }

  @action
  async fetchAllItems (acctId) {
    const accountId = acctId || Utils.accountIdFromUrl() // Utils.accountIdFromUrl() is deprecated!
    const { response, error } = await ApplicationService.getApplications(accountId)
    if (response) {
      this.apps.replace(response)
      this.updateSelectedItems()
    } else {
      console.error(error)
    }
  }

  getSelectedItems () {
    return this.apps.filter(app => app.isSelected)
  }

  @action
  updateSelectedItems = () => {
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
  clearSelectedItems = () => {
    this.apps.forEach(app => (app.isSelected = false))
    delete localStorage[SELECTED_APPS_LOCAL_STORAGE_KEY]
  }
}

const filtersDataStore = new FiltersDataStore()

browserHistory.listen(() => {
  filtersDataStore.updateSelectedItems()
})

export default filtersDataStore



// WEBPACK FOOTER //
// ../src/utils/FiltersDataStore.js