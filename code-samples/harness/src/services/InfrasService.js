import dataService from '../apis/dataService'
import * as Service from './Service'

export const endpoints = Service.endpointPaths({
  hostPath: ({ infraMappingId }) => `infrastructure-mappings/${infraMappingId}/hosts`
})

export async function getInfraMappings (accountId, filter = '') {
  const url = `infrastructure-mappings?&accountId=${accountId}` + filter
  try {
    const response = await dataService.fetch(url, {
      method: 'GET'
    })
    return { infraMappings: response.resource.response }
  } catch (e) {
    return { error: e, status: e.status }
  }
}

export async function getInfraMappingsForApplication (applicationId, envId, serviceIdArr) {
  let url = `infrastructure-mappings?&appId=${applicationId}&envId=${envId}`
  let filter

  if (serviceIdArr && Array.isArray(serviceIdArr) && serviceIdArr.length > 0) {
    filter = '&search[0][field]=serviceId&search[0][op]=IN'
    for (const serviceId of serviceIdArr) {
      filter += '&search[0][value]=' + serviceId
    }
  }
  url += filter

  try {
    const response = await dataService.fetch(url, {
      method: 'GET'
    })
    return { infraMappings: response.resource.response }
  } catch (e) {
    return { error: e, status: e.status }
  }
}

export async function getHostsForInfraMappings ({ infraMappingId, appId }) {
  const url = endpoints.hostPath({ infraMappingId }, { appId })
  const { error, resource } = await dataService.makeRequest(url)
  return { hosts: resource, error }
}



// WEBPACK FOOTER //
// ../src/services/InfrasService.js