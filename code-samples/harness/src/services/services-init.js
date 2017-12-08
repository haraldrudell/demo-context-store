import xhr from 'xhr-async'
import './services-init.local'
import Utils from '../components/Utils/Utils'
import Logger from '../utils/Logger'

/*
 * Construct baseApi. For ci/qa/prod, baseApi is passed via a global apiUrl.
 */
const getApiBaseUrl = () => {
  const { apiUrl, location: { protocol, hostname } } = window
  return apiUrl ? apiUrl : window.location.port === '8000' ? `${protocol}//${hostname}:9090/api` : '/api'
}

xhr.defaults.baseURL = getApiBaseUrl()

xhr.before(({ headers }) => {
  if (localStorage.token) {
    headers.authorization = 'Bearer ' + localStorage.token
  }
})

xhr.after(({ status, statusText, error }) => {
  if (status === 401) {
    Logger.error({ status, statusText, error, url: location.href })
    Utils.saveActiveUrl()
    window.location = '#/login'
  }
})



// WEBPACK FOOTER //
// ../src/services/services-init.js