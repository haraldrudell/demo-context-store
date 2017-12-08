import dataService from '../apis/dataService'
import * as Service from './Service'

export const endpoints = Service.endpointPaths({
  editConfigVars: ({ id }) => `service-variables/${id}`,
  configFilesPath: ({ id }) => `configs/${id}`
})

export async function editConfigurationVariables ({ appId, entityId, id, entityType, body }) {
  const url = endpoints.editConfigVars({ id }, { entityId, appId, entityType })
  const { resource, error } = await dataService.makeRequest(url, { method: 'PUT', body })

  return { resource, error }
}

export async function deleteConfigurationVariables ({ appId, entityId, id, entityType }) {
  const url = endpoints.editConfigVars({ id }, { entityId, appId, entityType })
  const { resource, error } = await dataService.makeRequest(url, { method: 'DELETE' })

  return { resource, error }
}

export async function deleteConfigurationFiles ({ appId, entityId, id, entityType }) {
  const url = endpoints.configFilesPath({ id }, { entityId, appId, entityType })
  const { resource, error } = await dataService.makeRequest(url, { method: 'DELETE' })

  return { resource, error }
}



// WEBPACK FOOTER //
// ../src/services/ConfigsService.js