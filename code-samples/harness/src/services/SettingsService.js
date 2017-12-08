import dataService from '../apis/dataService'
import * as Service from './Service'
import { errorMessageFromResponse } from './ServicesUtils'
import xhr from 'xhr-async'

export const endpoints = Service.endpointPaths({
  settings: _ => 'settings',
  connectors: () => 'settings',
  newRelicApps: () => 'newrelic/applications',
  deleteSSHKeys: ({ attrId }) => `/settings/${attrId}`,
  settingsPath: ({ deletingId }) => `/settings/${deletingId}`
})

// ttps://localhost:9090/api/settings/ZWoNNTIiRiyNGEbi8eZgHw?isPluginSetting=true&accountId=kmpySmUISimoRrJL6NL73w
export async function fetchSettings ({ accountId, appId, type }) {
  const url = endpoints.settings({}, { accountId, appId, type })

  const { resource, error } = await dataService.makeRequest(url)
  return { settings: resource.response, error }
}

export async function fetchApplicationDefaults ({ accountId, appId }) {
  const url = `/settings?accountId=${accountId}&appId=${appId}`
  const { status, error, response } = await xhr.get(url)

  if (!error) {
    return { settings: response.resource.response }
  } else {
    return { status, error: errorMessageFromResponse(error, response) }
  }
}

export async function addApplicationDefaults ({ accountId, appId, defaults }) {
  const url = `/settings?accountId=${accountId}&appId=${appId}`
  const { status, error, response } = await xhr.post(url, {
    data: Object.assign({}, defaults, { category: 'SETTING' })
  })

  if (!error) {
    return { response: response.resource.response }
  } else {
    return { status, error: errorMessageFromResponse(error, response) }
  }
}

export async function updateApplicationDefaults ({ accountId, appId, uuid, defaults }) {
  const url = `/settings/${uuid}?accountId=${accountId}&appId=${appId}`
  const { status, error, response } = await xhr.put(url, {
    data: Object.assign({}, defaults, { category: 'SETTING', accountId })
  })

  if (!error) {
    return { response: response.resource.response }
  } else {
    return { status, error: errorMessageFromResponse(error, response) }
  }
}

export async function removeApplicationDefaults ({ accountId, appId, uuid }) {
  const url = `/settings/${uuid}?accountId=${accountId}&appId=${appId}`
  const { status, error, response } = await xhr.delete(url)

  if (!error) {
    return { status }
  } else {
    return { status, error: errorMessageFromResponse(error, response) }
  }
}

export async function fetchConnectors ({ accountId }) {
  const url = endpoints.connectors({}, { accountId, category: 'CONNECTOR' })

  const { resource, error } = await dataService.makeRequest(url)
  return { connectors: resource.response, error }
}

export async function fetchNewRelicApps ({ accountId, settingId }) {
  const url = endpoints.newRelicApps({}, { accountId, settingId })

  const { resource, error } = await dataService.makeRequest(url)
  return { apps: resource, error }
}

export async function removeSSHKeys ({ attrId, accountId }) {
  const url = endpoints.deleteSSHKeys({ attrId }, { accountId })
  const { resource, error } = await dataService.makeRequest(url, { method: 'DELETE' })
  return { resource, error }
}

export async function removeSettings ({ deletingId, accountId }) {
  const url = endpoints.settingsPath({ deletingId }, { isPluginSetting: true, accountId })
  const { resource, error } = await dataService.makeRequest(url, { method: 'DELETE' })
  return { resource, error }
}

export async function addSettings ({ accountId, body }) {
  const url = endpoints.settings({}, { isPluginSetting: true, accountId })
  const { resource, error } = await dataService.makeRequest(url, { method: 'POST', body })
  return { resource, error }
}



// WEBPACK FOOTER //
// ../src/services/SettingsService.js