import dataService from '../apis/dataService'
import * as Service from './Service'

export const endpoints = Service.endpointPaths({
  vaultApi: () => 'vault'
})

export async function saveHashiCorpKMS ({ accountId, body }) {
  const url = endpoints.vaultApi({}, { accountId })
  const { error, resource } = await dataService.makeRequest(url, { method: 'post', body })
  return { error, resource }
}

export async function listVaultKMS ({ accountId }) {
  const url = endpoints.vaultApi({}, { accountId })
  const { error, resource } = await dataService.makeRequest(url, { method: 'get' })
  return { error, resource }
}

export async function deleteVaultKMS ({ accountId, vaultConfigId }) {
  const url = endpoints.vaultApi({}, { accountId, vaultConfigId })
  const { error, resource } = await dataService.makeRequest(url, { method: 'delete' })
  return { error, resource }
}



// WEBPACK FOOTER //
// ../src/services/HashiCorpService.js