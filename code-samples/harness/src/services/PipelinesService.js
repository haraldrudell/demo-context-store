import dataService from '../apis/dataService'
import apis from '../apis/apis.js'

function getPipelinesEndPoint (accountId, action = '') {
  const endpoint = `pipelines${action}?accountId=${accountId}`
  return endpoint
}

// TODO: remove this, create/use 'getPipelines'
export async function fetchPipelines (accountId, appIdsQuery = '') {
  const _url = getPipelinesEndPoint(accountId) + appIdsQuery
  return apis.service.list(_url).catch(error => {
    throw error
  })
}

// TODO: remove this, create/use 'getPipelineExecutions'
export async function fetchPipelineExecutions (accountId, appIdsQuery = '') {
  const _url = getPipelinesEndPoint(accountId, '/executions') + appIdsQuery
  return apis.service.list(_url).catch(error => {
    throw error
  })
}

export async function getPipelines (accountId, filter = '') {
  const url = `pipelines?accountId=${accountId}` + filter
  try {
    const response = await dataService.fetch(url, {
      method: 'GET'
    })
    return { pipelines: response.resource.response }
  } catch (e) {
    return { error: e, status: e.status }
  }
}

export async function getPipelineServices (accountId, appId, pipelineId) {
  const url = `pipelines/${pipelineId}?accountId=${accountId}&appId=${appId}&withServices=true`
  const { error, resource } = await dataService.makeRequest(url)

  return error
    ? { error: error.details, status: error.status }
    : { pipeline: resource, services: resource.services, workflowDetails: resource.workflowDetails }
}

// --------- CRUD --------- //

export async function createItem (accountId, appId, formData) {
  const url = `pipelines?accountId=${accountId}&appId=${appId}`
  try {
    const response = await dataService.fetch(url, {
      method: 'POST',
      body: formData
    })
    return { response: response.resource }
  } catch (e) {
    return { error: e, status: e.status }
  }
}

export async function deleteItem (accountId, appId, id) {
  const url = `pipelines/${id}?accountId=${accountId}&appId=${appId}`
  try {
    const response = await dataService.fetch(url, {
      method: 'DELETE'
    })
    return { reponse: response.resource }
  } catch (e) {
    return { error: e, status: e.status }
  }
}

export async function editItem (accountId, appId, id, formData) {
  const url = `pipelines/${id}?accountId=${accountId}&appId=${appId}`
  try {
    const response = await dataService.fetch(url, {
      method: 'PUT',
      body: formData
    })
    return { reponse: response.resource }
  } catch (e) {
    return { error: e, status: e.status }
  }
}

async function interruptPipelineExecution ({ accountId, appId, executionUUID, interruptType }) {
  const url = `pipelines/executions/${executionUUID}?accountId=${accountId}&appId=${appId}`
  const data = { executionInterruptType: interruptType }

  try {
    const response = await dataService.fetch(url, { method: 'PUT', body: data })
    return { response: response.resource }
  } catch (e) {
    return { error: e, status: e.status }
  }
}

export async function abortPipelineExecution ({ accountId, appId, executionUUID }) {
  return interruptPipelineExecution({ accountId, appId, executionUUID, interruptType: 'ABORT_ALL' })
}

export async function pausePipelineExecution ({ accountId, appId, executionUUID }) {
  return interruptPipelineExecution({ accountId, appId, executionUUID, interruptType: 'PAUSE_ALL' })
}

export async function resumePipelineExecution ({ accountId, appId, executionUUID }) {
  return interruptPipelineExecution({ accountId, appId, executionUUID, interruptType: 'RESUME_ALL' })
}

export async function getRequiredEntitiesForPipelineExecution ({ appId, pipelineId }) {
  const endpoint = `pipelines/required-entities?appId=${appId}&pipelineId=${pipelineId}`
  const { error, resource } = await dataService.makeRequest(endpoint)
  return { error, resource }
}



// WEBPACK FOOTER //
// ../src/services/PipelinesService.js