import dataService from '../apis/dataService'
import * as Service from './Service'

export const endpoints = Service.endpointPaths({
  services: ({ serviceId, serviceAction }) => `services${Service.action(serviceId, serviceAction)}`,
  createService: () => 'services',

  updateService: ({ serviceId }) => `/services/${serviceId}`
})

export async function fetchServices ({ accountId, appId }) {
  const endpoint = endpoints.services({}, { accountId, appId })

  const { error, resource } = await dataService.makeRequest(endpoint)

  return { services: resource.response, error }
}

export async function cloneService ({ accountId, appId, serviceId }, data) {
  const endpoint = endpoints.services({ serviceId, serviceAction: 'clone' }, { accountId, appId })

  const { error, resource } = await dataService.makeRequest(endpoint, {
    method: 'POST',
    // TODO: Change when backend supports
    body: data.service
  })

  return { service: resource.response, error }
}

export async function updateContainerTaskAdvanced ({
  accountId,
  appId,
  serviceId,
  taskId,
  advancedType,
  advancedConfig,
  reset = false
}) {
  let url = `services/${serviceId}/containers/tasks/${taskId}/advanced`
  url += `?accountId=${accountId}&appId=${appId}&reset=${reset}`
  try {
    const response = await dataService.fetch(url, {
      method: 'PUT',
      body: {
        advancedType,
        advancedConfig
      }
    })
    return { reponse: response.resource }
  } catch (e) {
    return { error: e, status: e.status }
  }
}

export async function createService ({ appId, body }) {
  const url = endpoints.createService({}, { appId })

  const { error, resource } = await dataService.makeRequest(url, { method: 'post', body })

  return { resource, error }
}

export async function editService ({ serviceId, appId, body }) {
  const url = endpoints.updateService({ serviceId }, { appId })

  const { error, resource } = await dataService.makeRequest(url, { method: 'put', body })

  return { resource, error }
}



// WEBPACK FOOTER //
// ../src/services/ServicesService.js