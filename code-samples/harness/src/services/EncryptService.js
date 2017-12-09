import dataService from '../apis/dataService'
import * as Service from './Service'
import xhr from 'xhr-async'
export const endpoints = Service.endpointPaths({
  addEncryptKey: () => 'secrets/add-secret',
  listVariables: () => 'secrets/list-secrets',
  editEncryptKey: () => 'secrets/update-secret',
  deleteEncryptKey: () => 'secrets/delete-secret',
  addFile: () => 'secrets/add-file',
  deleteFile: () => 'secrets/delete-file',
  updateFile: () => 'secrets/update-file'
})

export async function saveEncryptKey ({ accountId, body }) {
  const url = endpoints.addEncryptKey({}, { accountId })

  const { error, resource } = await dataService.makeRequest(url, { method: 'post', body })
  return { error, resource }
}

export async function listEncryptedVariables ({ accountId, type }) {
  const url = endpoints.listVariables({}, { accountId, type })
  const { error, resource } = await dataService.makeRequest(url, { method: 'get' })
  return { error, resource }
}

export async function updateKey ({ accountId, uuid, body }) {
  const url = endpoints.editEncryptKey({}, { accountId, uuid })
  const { error, resource } = await dataService.makeRequest(url, { method: 'POST', body })
  return { error, resource }
}

export async function deleteEncryptVariable ({ accountId, uuid }) {
  const url = endpoints.deleteEncryptKey({}, { accountId, uuid })
  const { error, resource } = await dataService.makeRequest(url, { method: 'DELETE' })
  return { error, resource }
}

export async function createEncryptFile ({ accountId, body }) {
  const url = endpoints.addFile({}, { accountId })
  const { error, response } = await xhr.post(url, { data: body })
  const { resource } = response
  return { error, resource }
}

export async function deleteEncryptFile ({ accountId, uuid }) {
  const url = endpoints.deleteFile({}, { accountId, uuid })
  const { error, resource } = await dataService.makeRequest(url, { method: 'DELETE' })
  return { error, resource }
}

export async function editEncryptFile ({ accountId, body }) {
  const url = endpoints.updateFile({}, { accountId })
  const { error, resource } = await dataService.makeRequest(url, { method: 'POST', body })
  return { error, resource }
}



// WEBPACK FOOTER //
// ../src/services/EncryptService.js