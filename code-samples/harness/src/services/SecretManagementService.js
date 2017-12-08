import dataService from '../apis/dataService'
import * as Service from './Service'

export const endpoints = Service.endpointPaths({
  saveGlobalKMS: () => 'kms/save-global-kms',
  saveKMS: () => '/kms/save-kms',
  listKMS: () => 'secrets/list-values',
  listConfiguredKMS: () => 'secrets/list-configs',
  deleteKMS: () => 'kms/delete-kms',
  migrateKMS: () => 'secrets/transition-config',
  usageLog: () => 'secrets/usage',
  changeLog: () => 'secrets/change-logs',
  setUpLog: () => 'secrets/list-secret-usage'
})

export async function saveGlobalKms ({ accountId, body }) {
  const url = endpoints.saveGlobalKMS({}, { accountId })
  const { error, resource } = await dataService.makeRequest(url, { method: 'post', body })
  return { error, resource }
}

export async function saveKMS ({ accountId, body, requestType }) {
  const url = endpoints.saveKMS({}, { accountId })
  const { error, resource } = await dataService.makeRequest(url, { method: 'post', body })
  return { error, resource }
}

export async function listKMS ({ accountId }) {
  const url = endpoints.listKMS({}, { accountId })
  const { error, resource } = await dataService.makeRequest(url, { method: 'GET' })
  return { error, resource }
}

export async function listConfiguredKMS ({ accountId }) {
  const url = endpoints.listConfiguredKMS({}, { accountId })
  const { error, resource } = await dataService.makeRequest(url, { method: 'GET' })
  return { error, resource }
}

export async function deleteKMS ({ accountId, kmsConfigId }) {
  const url = endpoints.deleteKMS({}, { accountId, kmsConfigId })
  const { error, resource } = await dataService.makeRequest(url, { method: 'GET' })
  return { error, resource }
}
/*
@QueryParam("accountId") final String accountId,
      @QueryParam("fromEncryptionType") EncryptionType fromEncryptionType, @QueryParam("fromKmsId") String fromKmsId,
      @QueryParam("toEncryptionType") EncryptionType toEncryptionType, @QueryParam("toKmsId") String toKmsId
*/
export async function migrateKMS ({ accountId, fromKmsId, toKmsId, fromEncryptionType, toEncryptionType }) {
  const url = endpoints.migrateKMS({}, { accountId, fromKmsId, toKmsId, fromEncryptionType, toEncryptionType })
  const { error, resource } = await dataService.makeRequest(url, { method: 'GET' })
  return { error, resource }
}

export async function getUsageLog ({ accountId, entityId, type }) {
  const url = endpoints.usageLog({}, { accountId, entityId, type })
  const { error, resource } = await dataService.makeRequest(url, { method: 'GET' })
  return { error, resource }
}

export async function getChangeLog ({ accountId, entityId, type }) {
  const url = endpoints.changeLog({}, { accountId, entityId, type })
  const { error, resource } = await dataService.makeRequest(url, { method: 'GET' })
  return { error, resource }
}

export async function getSetUpLog ({ accountId, uuid }) {
  const url = endpoints.setUpLog({}, { accountId, uuid })
  const { error, resource } = await dataService.makeRequest(url, { method: 'GET' })
  return { error, resource }
}



// WEBPACK FOOTER //
// ../src/services/SecretManagementService.js