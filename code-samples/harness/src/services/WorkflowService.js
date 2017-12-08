import dataService from '../apis/dataService'
import * as Service from './Service'

export const endpoints = Service.endpointPaths({
  workflows: ({ workflowId, workflowAction }) => `workflows${Service.action(workflowId, workflowAction)}`
})

export async function getWorkflows (accountId, filter = '') {
  const url = `workflows?accountId=${accountId}` + filter
  try {
    const response = await dataService.fetch(url, {
      method: 'GET'
    })
    return { workflows: response.resource.response }
  } catch (e) {
    return { error: e, status: e.status }
  }
}

// Deprecated
export function getWorkflowActionUrl (appId, workflowId, action) {
  return `workflows/${workflowId}/${action}?appId=${appId}`
}

export async function fetchWorkflowsByApplicationId (appId, envId) {
  let endpoint = `/workflows?appId=${appId}&previousExecutionsCount=2`
  endpoint += envId ? `&envId=${envId}` : ''
  const { error, resource } = await dataService.makeRequest(endpoint, { method: 'GET' })

  return { workflows: resource.response, error }
}

export async function cloneWorkflow ({ accountId, appId, workflowId }, data) {
  const endpoint = endpoints.workflows({ workflowId, workflowAction: 'clone' }, { accountId, appId })
  const { error, resource } = await dataService.makeRequest(endpoint, { method: 'POST', body: data })

  return { workflow: resource.response, error }
}

export async function getStencils ({ appId, workflowId }) {
  const endpoint = `workflows/stencils?appId=${appId}&workflowId=${workflowId}`
  const { error, resource } = await dataService.makeRequest(endpoint, { method: 'GET' })
  return { stencils: resource, error }
}

export async function cloneWorkflowPhases ({ appId, workflowId }, data) {
  const endpoint = `workflows/${workflowId}/phases/clone?appId=${appId}`
  const { error, resource } = await dataService.makeRequest(endpoint, { method: 'POST', body: data })
  return { resource, error }
}



// WEBPACK FOOTER //
// ../src/services/WorkflowService.js