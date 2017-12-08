import dataService from '../apis/dataService'

import { getWorkflowActionUrl } from './WorkflowService'


export async function updateWorkflowVariables (appId, workflowId, variables) {
  const endpoint = getWorkflowActionUrl(appId, workflowId, 'user-variables')

  const { error, resource } = await dataService.makeRequest(endpoint, { method: 'PUT', body: variables })

  return { workflowVariables: resource, error }
}




// WEBPACK FOOTER //
// ../src/services/WorkflowVariablesService.js