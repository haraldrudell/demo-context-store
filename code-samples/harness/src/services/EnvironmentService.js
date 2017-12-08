import dataService from '../apis/dataService'
import * as Service from './Service'

export const endpoints = Service.endpointPaths({
  environments: ({ environmentId, environmentAction }) => {
    return `environments${Service.action(environmentId, environmentAction)}`
  }
})

export async function cloneEnvironment ({ accountId, appId, environmentId }, data) {
  const endpoint = endpoints.environments({ environmentId, environmentAction: 'clone' }, { accountId, appId })

  const { error, resource } = await dataService.makeRequest(endpoint, { method: 'POST', body: data })

  return { environment: resource.response, error }
}

export async function fetchServices ({ accountId, appId, environmentId }) {
  const endpoint = endpoints.environments({ environmentId, environmentAction: 'services' }, { accountId, appId })

  const { error, resource } = await dataService.makeRequest(endpoint)

  return { services: resource.response, error }
}



// WEBPACK FOOTER //
// ../src/services/EnvironmentService.js