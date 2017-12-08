import dataService from '../apis/dataService'
import * as Service from './Service'

export const endpoints = Service.endpointPaths({
  artifactStreams: ({ artifactStreamId }) => `artifactstreams${Service.slash(artifactStreamId)}`
})

export async function fetchAppArtifactStreams ({ accountId, appId }) {
  const endpoint = endpoints.artifactStreams({}, { accountId, appId })
  const { resource, error } = await dataService.makeRequest(endpoint)
  return { artifactStreams: resource.response, error }
}

export async function fetchArtifactStream ({ accountId, appId, serviceId, streamId }) {
  const endpoint = endpoints.artifactStreams({ streamId }, { accountId, appId, settingId, serviceId })
  const { error, resource } = await dataService.makeRequest(endpoint)
  return { artifactStream: resource, error }
}

export async function getWebHookInfo ({ appId, streamId }) {
  const endpoint = endpoints.artifactStreams({ streamId }) + `/${streamId}/webhook_token?appId=${appId}`

  const { error, resource } = await dataService.makeRequest(endpoint)
  return { webHookInfo: resource, error }
}

export async function createArtifactStream ({ accountId, appId }, data) {
  const endpoint = endpoints.artifactStreams({}, { accountId, appId })
  const { error, resource } = await dataService.makeRequest(endpoint, { method: 'POST', body: data })

  return { artifactStream: resource, error }
}

export async function updateArtifactStream ({ accountId, appId, artifactStreamId }, data) {
  const endpoint = endpoints.artifactStreams({ artifactStreamId }, { accountId, appId })
  const { error, resource } = await dataService.makeRequest(endpoint, { method: 'PUT', body: data })

  return { artifactStream: resource, error }
}

export async function updateOrCreateArtifactStream ({ accountId, appId, artifactStreamId }, data) {
  return artifactStreamId
    ? await updateArtifactStream({ accountId, appId, artifactStreamId }, data)
    : await createArtifactStream({ accountId, appId }, data)
}



// WEBPACK FOOTER //
// ../src/services/ArtifactStreamService.js