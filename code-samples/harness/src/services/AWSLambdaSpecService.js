import dataService from '../apis/dataService'
import * as Service from './Service'

export const endpoints = Service.endpointPaths({
  specPost: ({ serviceId }) => `services/${serviceId}/lambda-specifications`,

  listSpecs: ({ serviceId }) => `/services/${serviceId}/lambda-specifications`,

  editSpec: ({ serviceId, specId }) => `/services/${serviceId}/lambda-specifications/${specId}`
})

export async function createSpec ({ serviceId, appId, body }) {
  const url = endpoints.specPost({ serviceId }, { appId })

  const { error, resource } = await dataService.makeRequest(url, { method: 'post', body })

  return { resource, error }
}

export async function getLambdaSpecs ({ serviceId, appId }) {
  const url = endpoints.listSpecs({ serviceId }, { appId })

  const { error, resource } = await dataService.makeRequest(url, { method: 'get' })

  return { specs: resource.response[0], error }
}

export async function editLambdaSpecs ({ serviceId, specId, appId, body }) {
  const url = endpoints.editSpec({ serviceId, specId }, { appId })

  const { error, resource } = await dataService.makeRequest(url, { method: 'put', body })

  return { resource, error }
}



// WEBPACK FOOTER //
// ../src/services/AWSLambdaSpecService.js